import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { FormlyModule, FormlyFieldConfig } from '@ngx-formly/core';
import { Observable, of } from 'rxjs';
import { startWith, switchMap, map } from 'rxjs/operators';
import { Client, Entity } from '../../clients/clients.model';
import { ClientsService } from '../../clients/clients.service';
import { Form, EntityAssociation } from '../form-configuration.model';
import { FormService } from '../form.service';
import { FormConfigurationService } from '../form-configuration.service';

@Component({
  selector: 'app-add-form-configuration',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormlyModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
  ],
  templateUrl: './add-form-configuration.component.html',
  styleUrl: './add-form-configuration.component.scss'
})
export class AddFormConfigurationComponent implements OnInit {
  configForm!: FormGroup;
  clients$!: Observable<Client[]>;
  forms$!: Observable<Form[]>;
  
  selectedForm$!: Observable<Form | undefined>;
  previewFields$!: Observable<FormlyFieldConfig[]>;
  previewModel = {};

  availableEntities: Entity[] = [];

  constructor(
    private fb: FormBuilder,
    private clientsService: ClientsService,
    private formService: FormService,
    private formConfigService: FormConfigurationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.configForm = this.fb.group({
      clientId: ['', Validators.required],
      formId: ['', Validators.required],
      formConfigCode: ['', Validators.required],
      version: ['1.0', Validators.required],
      status: [true, Validators.required],
      associations: this.fb.array([]),
    });

    this.clients$ = this.clientsService.getClients();
    this.forms$ = this.formService.getForms();

    // When client changes, update available entities
    this.configForm.get('clientId')!.valueChanges.subscribe(clientId => {
      this.associations.clear();
      if (clientId) {
        const client = this.clientsService.getClientById(clientId);
        this.availableEntities = client ? [...client.entities] : [];
      } else {
        this.availableEntities = [];
      }
    });

    const formIdChanges$ = this.configForm.get('formId')!.valueChanges.pipe(
      startWith(null)
    );

    this.selectedForm$ = formIdChanges$.pipe(
      map(formId => formId ? this.formService.getFormById(formId) : undefined)
    );

    this.previewFields$ = this.selectedForm$.pipe(
      map(form => this.convertSchemaToFormly(form?.schema))
    );
  }

  get associations(): FormArray {
    return this.configForm.get('associations') as FormArray;
  }

  createAssociationGroup(association: EntityAssociation): FormGroup {
    return this.fb.group({
      entityId: [association.entityId],
      entityType: [association.entityType]
    });
  }

  addAssociation(entity: Entity): void {
    if (entity) {
      this.associations.push(this.createAssociationGroup({ entityId: entity.entityId, entityType: entity.entityType }));
      this.availableEntities = this.availableEntities.filter(e => e.entityId !== entity.entityId);
    }
  }

  removeAssociation(index: number): void {
    const removedAssociation = this.associations.at(index).value;
    const client = this.clientsService.getClientById(this.configForm.get('clientId')?.value);
    if(client) {
      const entityToAddBack = client.entities.find(e => e.entityId === removedAssociation.entityId);
      if (entityToAddBack) {
        this.availableEntities.push(entityToAddBack);
      }
    }
    this.associations.removeAt(index);
  }

  convertSchemaToFormly(schema: any): FormlyFieldConfig[] {
    if (!schema) return [];
    // This is a basic converter. More complex schemas would need a more robust implementation.
    const fields: FormlyFieldConfig[] = [];
    for (const key in schema.properties) {
      const prop = schema.properties[key];
      fields.push({
        key: key,
        type: 'input', // Basic mapping
        templateOptions: {
          label: prop.title,
          required: schema.required?.includes(key),
        },
      });
    }
    return fields;
  }

  onSave(): void {
    if (this.configForm.valid) {
      this.formConfigService.addConfiguration(this.configForm.value);
      this.router.navigate(['/form-configuration']);
    }
  }
}
