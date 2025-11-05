import { Task } from '../types/task';

/**
 * Validate imported task data
 * @param data - Data to validate
 * @returns True if data is valid, false otherwise
 */
export const validateImportData = (data: any): data is Task[] => {
  if (!Array.isArray(data)) {
    return false;
  }

  return data.every((task) => {
    return (
      typeof task === 'object' &&
      task !== null &&
      typeof task.id === 'string' &&
      typeof task.name === 'string' &&
      typeof task.startDate === 'string' &&
      typeof task.endDate === 'string' &&
      typeof task.progress === 'number' &&
      task.progress >= 0 &&
      task.progress <= 100 &&
      typeof task.color === 'string' &&
      (task.assignee === undefined || typeof task.assignee === 'string') &&
      (task.description === undefined || typeof task.description === 'string')
    );
  });
};

/**
 * Import tasks from JSON string
 * @param jsonString - JSON string to parse
 * @returns Array of tasks if valid, throws error otherwise
 */
export const importFromJSON = (jsonString: string): Task[] => {
  try {
    const data = JSON.parse(jsonString);
    
    if (!validateImportData(data)) {
      throw new Error('Invalid task data format');
    }

    return data;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Invalid JSON format');
    }
    throw error;
  }
};

/**
 * Read and import tasks from a file
 * @param file - File to read
 * @returns Promise that resolves to array of tasks
 */
export const importFromFile = (file: File): Promise<Task[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const tasks = importFromJSON(content);
        resolve(tasks);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
};
