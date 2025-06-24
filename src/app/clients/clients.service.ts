import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Client } from './clients.model';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  private readonly STORAGE_KEY = 'form-configurator-clients';
  private clients: Client[] = [];
  private clients$ = new BehaviorSubject<Client[]>([]);

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      this.clients = JSON.parse(stored);
    } else {
      // Initialize with default data if no stored data exists
      this.clients = [
        {
          id: 3,
          clientName: 'Field Apps',
          clientCode: 'FDA',
          domain: 'EO', // Electric Office
          description: 'Mobile applications for field agents.',
          status: true,
          entities: [
            { entityType: 'Job', entityId: 'Survey' },
            { entityType: 'Sub Job', entityId: 'Rapid Patrol' },
            { entityType: 'Asset', entityId: 'Pole' },
            { entityType: 'Operations', entityId: 'View' },
            { entityType: 'Operations', entityId: 'Edit' },
            { entityType: 'Job', entityId: 'Damage Assessment' },
            { entityType: 'Job', entityId: 'Inspect' },
            { entityType: 'Asset', entityId: 'Transformer' }
          ]
        }
      ];
      this.saveToStorage();
    }
    this.clients$.next([...this.clients]);
  }

  private saveToStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.clients));
  }

  getClients(): Observable<Client[]> {
    return this.clients$.asObservable();
  }

  addClient(client: Omit<Client, 'id'>): void {
    const newClient: Client = {
      ...client,
      id: Date.now(), // Simple unique ID generation
    };
    this.clients.push(newClient);
    this.saveToStorage();
    this.clients$.next([...this.clients]);
  }

  getClientById(id: number): Client | undefined {
    return this.clients.find(client => client.id === id);
  }

  updateClient(updatedClient: Client): void {
    const index = this.clients.findIndex(client => client.id === updatedClient.id);
    if (index !== -1) {
      this.clients[index] = updatedClient;
      this.saveToStorage();
      this.clients$.next([...this.clients]);
    }
  }
}
