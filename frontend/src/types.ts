export type WorkflowStatus = 'pending' | 'active' | 'done' | 'error';

export interface WorkflowStep {
  id: 'location' | 'menu' | 'search';
  label: string;
  status: WorkflowStatus;
  message?: string;
}

export interface LocationPoint {
  address: string;
}
