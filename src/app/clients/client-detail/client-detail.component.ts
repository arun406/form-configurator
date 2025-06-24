import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Client, Entity } from '../clients.model';
import { ClientsService } from '../clients.service';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
  ],
  templateUrl: './client-detail.component.html',
  styleUrl: './client-detail.component.scss'
})
export class ClientDetailComponent implements OnInit {
  client!: Client;
  clientForm!: FormGroup;
  isEditMode = false;

  domains = [
    { value: 'EO', viewValue: 'Electric Office' },
    { value: 'PNI', viewValue: 'Telecom' },
    { value: 'GU', viewValue: 'Gas Utility' }
  ];
  entityTypes = ['Job', 'Sub Job', 'Asset', 'Operations'];
  entityIds: { [key: string]: string[] } = {
    'Job': ['Damage Assessment', 'Survey', 'Inspect'],
    'Sub Job': ['Rapid Patrol'],
    'Asset': ['Pole', 'Transformer'],
    'Operations': ['View', 'Edit']
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientsService: ClientsService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const foundClient = this.clientsService.getClientById(+id);
      if (foundClient) {
        this.client = foundClient;
        this.initializeForm();
      } else {
        // Handle client not found, maybe navigate away
        this.router.navigate(['/clients']);
      }
    }
  }

  initializeForm(): void {
    this.clientForm = this.fb.group({
      domain: [this.client.domain, Validators.required],
      description: [this.client.description],
      status: [this.client.status],
      entities: this.fb.array(this.client.entities.map(e => this.createEntityGroup(e)))
    });
  }

  createEntityGroup(entity: Entity): FormGroup {
    return this.fb.group(entity);
  }
  
  get entities(): FormArray {
    return this.clientForm.get('entities') as FormArray;
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode) {
      // If canceling edit, reset form to original state
      this.initializeForm();
    }
  }

  onSave(): void {
    if (this.clientForm.valid) {
      const updatedClientData = {
        ...this.client,
        ...this.clientForm.value,
      };
      this.clientsService.updateClient(updatedClientData);
      this.client = updatedClientData; // Update local view
      this.isEditMode = false;
    }
  }

  addEntity(type: string, id: string, name: string): void {
    if (!type || !id) return; // Basic validation
    const newEntity: Entity = {
      entityType: type as Entity['entityType'],
      entityId: id,
      entityName: name
    };
    this.entities.push(this.createEntityGroup(newEntity));
  }

  removeEntity(index: number): void {
    this.entities.removeAt(index);
  }

  get domainDisplayName(): string {
    return this.domains.find(d => d.value === this.client.domain)?.viewValue || this.client.domain;
  }
}
