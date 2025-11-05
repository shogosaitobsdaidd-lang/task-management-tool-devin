import { StorageData } from '../types/storage';
import { STORAGE_KEY, STORAGE_VERSION } from '../constants/config';

export class StorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StorageError';
  }
}

export const saveToLocalStorage = (data: StorageData): void => {
  try {
    const dataToSave: StorageData = {
      ...data,
      version: STORAGE_VERSION,
      lastModified: new Date().toISOString(),
    };

    const serializedData = JSON.stringify(dataToSave);
    localStorage.setItem(STORAGE_KEY, serializedData);
  } catch (error) {
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      throw new StorageError(
        'LocalStorage quota exceeded. Please clear some data or export your tasks.'
      );
    }
    throw new StorageError(
      `Failed to save data to LocalStorage: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

export const loadFromLocalStorage = (): StorageData | null => {
  try {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    
    if (!serializedData) {
      return null;
    }

    const data = JSON.parse(serializedData) as StorageData;

    if (data.version !== STORAGE_VERSION) {
      console.warn(
        `Data version mismatch. Expected ${STORAGE_VERSION}, got ${data.version}. Migration may be needed.`
      );
    }

    return data;
  } catch (error) {
    throw new StorageError(
      `Failed to load data from LocalStorage: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

export const clearLocalStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    throw new StorageError(
      `Failed to clear LocalStorage: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

export const isLocalStorageAvailable = (): boolean => {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};
