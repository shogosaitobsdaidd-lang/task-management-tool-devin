import { Task } from '../types/task';
import { StorageData } from '../types/storage';

/**
 * Export tasks to JSON string
 * @param tasks - Array of tasks to export
 * @returns JSON string representation of tasks
 */
export const exportToJSON = (tasks: Task[]): string => {
  return JSON.stringify(tasks, null, 2);
};

/**
 * Export full application data to JSON string
 * @param data - Complete storage data including tasks and view settings
 * @returns JSON string representation of data
 */
export const exportDataToJSON = (data: StorageData): string => {
  return JSON.stringify(data, null, 2);
};

/**
 * Download JSON data as a file
 * @param jsonData - JSON string to download
 * @param filename - Name of the file to download (optional, defaults to tasks-{date}.json)
 */
export const downloadJSON = (jsonData: string, filename?: string): void => {
  const defaultFilename = `tasks-${new Date().toISOString().split('T')[0]}.json`;
  const finalFilename = filename || defaultFilename;

  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = finalFilename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Export and download tasks as JSON file
 * @param tasks - Array of tasks to export
 * @param filename - Optional custom filename
 */
export const exportAndDownloadTasks = (tasks: Task[], filename?: string): void => {
  const jsonData = exportToJSON(tasks);
  downloadJSON(jsonData, filename);
};
