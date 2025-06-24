import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormConfiguration } from './form-configuration.model';
import { FormConfigurationService } from './form-configuration.service';
import { ClientsService } from '../clients/clients.service';
import { FormService } from './form.service';
import { Client } from '../clients/clients.model';
import { Form } from './form-configuration.model';

export interface EnrichedConfiguration {
  id: number;
  formConfigCode: string;
  version: number;
  status: boolean;
  client: Client;
  form: Form;
}

@Component({
  selector: 'app-form-configuration',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: './form-configuration.component.html',
  styleUrl: './form-configuration.component.scss'
})
export class FormConfigurationComponent implements OnInit {
  displayedColumns: string[] = ['formConfigCode', 'clientName', 'formCode', 'formName', 'formVersion', 'version', 'status', 'actions'];
  configurations$!: Observable<EnrichedConfiguration[]>;

  constructor(
    private formConfigService: FormConfigurationService,
    private clientsService: ClientsService,
    private formService: FormService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.configurations$ = combineLatest([
      this.formConfigService.getConfigurations(),
      this.clientsService.getClients(),
      this.formService.getForms()
    ]).pipe(
      map(([configs, clients, forms]) => {
        return configs.map(config => {
          const client = clients.find(c => c.id === config.clientId);
          const form = forms.find(f => f.id === config.formId);
          return {
            id: config.id,
            formConfigCode: config.formConfigCode,
            version: config.version,
            status: config.status,
            client: client!,
            form: form!
          };
        }).filter(c => c.client && c.form); // Filter out any incomplete mappings
      })
    );
  }

  viewConfiguration(id: number): void {
    this.router.navigate(['/form-configuration', id]);
  }

  openAddDialog(): void {
    this.router.navigate(['/form-configuration/add']);
  }
}
