import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormConfiguration } from './form-configuration.model';

@Injectable({
  providedIn: 'root'
})
export class FormConfigurationService {
  private readonly STORAGE_KEY = 'form-configurator-configurations';
  private configurations: FormConfiguration[] = [];
  private configurations$ = new BehaviorSubject<FormConfiguration[]>([]);

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      this.configurations = JSON.parse(stored);
    } else {
      // Initialize with default data if no stored data exists
      this.configurations = [
        { id: 1, formConfigCode: 'CONF-001', version: 1, clientId: 1, formId: 101, status: true, associations: [{ entityId: 'E1001', entityType: 'Building' }] },
        { id: 2, formConfigCode: 'CONF-002', version: 2, clientId: 2, formId: 102, status: true, associations: [] },
        { id: 3, formConfigCode: 'CONF-003', version: 5, clientId: 1, formId: 103, status: false, associations: [{ entityId: 'E1002', entityType: 'Vehicle' }, { entityId: 'E1003', entityType: 'Vehicle' }] },
      ];
      this.saveToStorage();
    }
    this.configurations$.next([...this.configurations]);
  }

  private saveToStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.configurations));
  }

  getConfigurations(): Observable<FormConfiguration[]> {
    return this.configurations$.asObservable();
  }
  
  getConfigurationById(id: number): FormConfiguration | undefined {
    return this.configurations.find(c => c.id === id);
  }

  addConfiguration(config: Omit<FormConfiguration, 'id' | 'version'>): void {
    const newConfig: FormConfiguration = { ...config, id: Date.now(), version: 1, associations: config.associations || [] };
    this.configurations.push(newConfig);
    this.configurations$.next([...this.configurations]);
    this.saveToStorage();
  }
  
  updateConfiguration(updatedConfig: FormConfiguration): void {
    const index = this.configurations.findIndex(c => c.id === updatedConfig.id);
    if (index !== -1) {
      this.configurations[index] = { ...updatedConfig };
      this.configurations$.next([...this.configurations]);
      this.saveToStorage();
    }
  }
}
