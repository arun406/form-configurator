import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Form } from './form-configuration.model';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  private forms: Form[] = [
    { 
      id: 101, formCode: 'DA-01', formName: 'Damage Assessment Form', formVersion: '1',
      schema: {
        "title": "Damage Assessment",
        "type": "object",
        "properties": {
          "incidentId": { "type": "string", "title": "Incident ID" },
          "damageType": { "type": "string", "title": "Type of Damage", "enum": ["Flood", "Wind", "Fire"] }
        }
      } 
    },
    { 
      id: 102, formCode: 'SV-03', formName: 'Standard Survey', formVersion: '2',
      schema: {
        "title": "Customer Survey",
        "type": "object",
        "properties": {
          "customerName": { "type": "string", "title": "Customer Name" },
          "rating": { "type": "integer", "title": "Rating (1-5)", "minimum": 1, "maximum": 5 }
        }
      }
    },
    { 
      id: 103, formCode: 'INSP-A', formName: 'Asset Inspection', formVersion: '1',
      schema: {
        "title": "Asset Inspection",
        "type": "object",
        "properties": {
          "assetId": { "type": "string", "title": "Asset ID" },
          "condition": { "type": "string", "title": "Condition", "enum": ["Good", "Fair", "Needs Repair"] }
        }
      }
    },
  ];

  private forms$ = new BehaviorSubject<Form[]>(this.forms);

  getForms(): Observable<Form[]> {
    return this.forms$.asObservable();
  }

  getFormById(id: number): Form | undefined {
    return this.forms.find(f => f.id === id);
  }

  addForm(form: Omit<Form, 'id'>): void {
    const newForm: Form = { ...form, id: Date.now() };
    this.forms.push(newForm);
    this.forms$.next([...this.forms]);
  }
}
