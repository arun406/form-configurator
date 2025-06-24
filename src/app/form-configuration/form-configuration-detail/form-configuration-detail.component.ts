import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormConfigurationService } from '../form-configuration.service';
import { ClientsService } from '../../clients/clients.service';
import { FormService } from '../form.service';
import { FormConfiguration, EntityAssociation } from '../form-configuration.model';
import { Client, Entity } from '../../clients/clients.model';
import { Form } from '../form-configuration.model';

@Component({
  selector: 'app-form-configuration-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDividerModule,
    MatSlideToggleModule,
  ],
  templateUrl: './form-configuration-detail.html',
  styleUrls: ['./form-configuration-detail.scss']
})
export class FormConfigurationDetailComponent implements OnInit {
  config!: FormConfiguration;
  client!: Client;
  form!: Form;
  editMode = false;
  configForm!: FormGroup;
  availableEntities: Entity[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private configService: FormConfigurationService,
    private clientsService: ClientsService,
    private formService: FormService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const foundConfig = this.configService.getConfigurationById(+id);
      if (foundConfig) {
        this.config = foundConfig;
        this.client = this.clientsService.getClientById(foundConfig.clientId)!;
        this.form = this.formService.getFormById(foundConfig.formId)!;
        this.initializeForm();
        this.updateAvailableEntities();
      } else {
        this.router.navigate(['/form-configuration']);
      }
    }
  }

  initializeForm(): void {
    this.configForm = this.fb.group({
      id: [this.config.id],
      formConfigCode: [{value: this.config.formConfigCode, disabled: true}],
      formId: [this.config.formId],
      status: [this.config.status],
      associations: this.fb.array(this.config.associations.map(a => this.createAssociationGroup(a)))
    });
  }

  createAssociationGroup(association: EntityAssociation): FormGroup {
    return this.fb.group({
      entityId: [association.entityId],
      entityType: [association.entityType]
    });
  }
  
  get associations(): FormArray {
    return this.configForm.get('associations') as FormArray;
  }

  updateAvailableEntities(): void {
    const associatedEntityIds = new Set(this.config.associations.map(a => a.entityId));
    this.availableEntities = this.client.entities.filter(e => !associatedEntityIds.has(e.entityId));
  }

  addAssociation(entity: Entity): void {
    if (entity) {
      this.associations.push(this.createAssociationGroup({ entityId: entity.entityId, entityType: entity.entityType }));
      this.availableEntities = this.availableEntities.filter(e => e.entityId !== entity.entityId);
    }
  }

  removeAssociation(index: number): void {
    const removedAssociation = this.associations.at(index).value;
    const entityToAddBack = this.client.entities.find(e => e.entityId === removedAssociation.entityId);
    if (entityToAddBack) {
      this.availableEntities.push(entityToAddBack);
    }
    this.associations.removeAt(index);
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
    if (!this.editMode) {
      // If canceling edit, reset form to original state
      this.initializeForm();
      this.updateAvailableEntities();
    }
  }

  onSave(): void {
    if (this.configForm.valid) {
      const formData = this.configForm.getRawValue();
      const associationsData = this.associations.value;
      
      const updatedConfig = {
        ...this.config,
        ...formData,
        associations: associationsData || []
      };
      
      this.configService.updateConfiguration(updatedConfig);
      this.config = updatedConfig; // Update local view
      this.updateAvailableEntities();
      this.editMode = false;
    }
  }
}
