import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ClientsService } from '../clients.service';
import { Client, Entity } from '../clients.model';

@Component({
  selector: 'app-add-client',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatSlideToggleModule,
  ],
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.scss']
})
export class AddClientComponent implements OnInit {
  clientForm!: FormGroup;
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
    private fb: FormBuilder,
    private clientsService: ClientsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.clientForm = this.fb.group({
      clientName: ['', Validators.required],
      clientCode: ['', Validators.required],
      domain: ['', Validators.required],
      description: [''],
      status: [true], // Default to active
      entities: this.fb.array([])
    });
  }

  get entities(): FormArray {
    return this.clientForm.get('entities') as FormArray;
  }

  createEntityGroup(entity: Entity): FormGroup {
    return this.fb.group(entity);
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

  onSave(): void {
    if (this.clientForm.valid) {
      this.clientsService.addClient(this.clientForm.value);
      this.router.navigate(['/clients']);
    }
  }
} 