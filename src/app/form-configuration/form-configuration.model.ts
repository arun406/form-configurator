export interface Form {
  id: number;
  formCode: string;
  formName: string;
  formVersion: string;
  schema: any; // To hold the JSON schema
}

export interface FormConfiguration {
  id: number;
  formConfigCode: string;
  version: number;
  clientId: number;
  formId: number;
  status: boolean; // true = active, false = inactive
  associations: EntityAssociation[];
}

export interface EntityAssociation {
  entityId: string;
  entityType: string;
} 