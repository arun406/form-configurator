export interface Entity {
  entityType: 'Job' | 'Sub Job' | 'Asset' | 'Operations';
  entityName?: string;
  entityId: string;
}

export interface Client {
  id: number;
  clientName: string;
  clientCode: string;
  domain: string; // e.g., 'EO', 'PNI'
  description: string;
  status: boolean; // true = active, false = inactive
  entities: Entity[];
} 