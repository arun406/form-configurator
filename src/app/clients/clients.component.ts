import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Router, RouterModule } from '@angular/router';

import { Client } from './clients.model';
import { ClientsService } from './clients.service';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})
export class ClientsComponent implements OnInit {
  displayedColumns: string[] = ['clientCode', 'clientName', 'domain', 'description', 'status', 'actions'];
  clients$!: Observable<Client[]>;
  domainMap: { [key: string]: string } = {
    'EO': 'Electric Office',
    'PNI': 'Telecom',
    'GU': 'Gas Utility'
  };

  constructor(
    private clientsService: ClientsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.clients$ = this.clientsService.getClients();
  }

  viewClient(id: number): void {
    this.router.navigate(['/clients', id]);
  }
}
