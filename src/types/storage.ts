import { Task } from './task';
import { ViewSettings } from './view';

export interface StorageData {
  version: string;
  tasks: Task[];
  viewSettings: ViewSettings;
  lastModified: string;
}
