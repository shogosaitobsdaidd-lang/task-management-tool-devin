import { Task } from './task';
import { ViewSettings } from './view';

export interface AppState {
  tasks: Task[];
  viewSettings: ViewSettings;
  selectedTaskId: string | null;
  isEditModalOpen: boolean;
}
