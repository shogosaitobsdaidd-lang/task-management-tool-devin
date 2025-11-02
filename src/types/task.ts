export interface Task {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  progress: number;
  assignee?: string;
  color?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}
