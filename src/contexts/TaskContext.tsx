import React, { createContext, useContext, useReducer, useEffect, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Task } from '../types/task';
import { saveToLocalStorage, loadFromLocalStorage } from '../services/storage';
import { DEFAULT_TIME_SCALE } from '../constants/config';
import { generateSampleTasks } from '../data/sampleTasks';

type TaskAction =
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: { id: string; updates: Partial<Task> } }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'REORDER_TASKS'; payload: { id: string; newOrder: number } }
  | { type: 'IMPORT_TASKS'; payload: Task[] }
  | { type: 'LOAD_TASKS'; payload: Task[] };

interface TaskContextType {
  tasks: Task[];
  isLoading: boolean;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  reorderTasks: (taskId: string, newOrder: number) => void;
  importTasks: (tasks: Task[]) => void;
  exportTasks: () => string;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const taskReducer = (state: Task[], action: TaskAction): Task[] => {
  switch (action.type) {
    case 'ADD_TASK':
      return [...state, action.payload];

    case 'UPDATE_TASK': {
      const { id, updates } = action.payload;
      return state.map((task) =>
        task.id === id
          ? { ...task, ...updates, updatedAt: new Date().toISOString() }
          : task
      );
    }

    case 'DELETE_TASK':
      return state.filter((task) => task.id !== action.payload);

    case 'REORDER_TASKS': {
      const { id, newOrder } = action.payload;
      const taskIndex = state.findIndex((task) => task.id === id);
      if (taskIndex === -1) return state;

      const newTasks = [...state];
      const [movedTask] = newTasks.splice(taskIndex, 1);
      newTasks.splice(newOrder, 0, movedTask);

      return newTasks.map((task, index) => ({
        ...task,
        order: index,
        updatedAt: new Date().toISOString(),
      }));
    }

    case 'IMPORT_TASKS':
      return action.payload;

    case 'LOAD_TASKS':
      return action.payload;

    default:
      return state;
  }
};

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, dispatch] = useReducer(taskReducer, []);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 100));
        const loadedData = loadFromLocalStorage();
        if (loadedData && loadedData.tasks) {
          dispatch({ type: 'LOAD_TASKS', payload: loadedData.tasks });
        } else {
          const sampleTasks = generateSampleTasks();
          dispatch({ type: 'LOAD_TASKS', payload: sampleTasks });
        }
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (tasks.length > 0 || loadFromLocalStorage()?.tasks) {
      const today = new Date().toISOString().split('T')[0];
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 3);
      const endDateStr = endDate.toISOString().split('T')[0];

      saveToLocalStorage({
        version: '1.0.0',
        tasks,
        viewSettings: {
          timeScale: DEFAULT_TIME_SCALE,
          startDate: today,
          endDate: endDateStr,
          zoom: 1.0,
        },
        lastModified: new Date().toISOString(),
      });
    }
  }, [tasks]);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newTask: Task = {
      ...taskData,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };
    dispatch({ type: 'ADD_TASK', payload: newTask });
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    dispatch({ type: 'UPDATE_TASK', payload: { id: taskId, updates } });
  };

  const deleteTask = (taskId: string) => {
    dispatch({ type: 'DELETE_TASK', payload: taskId });
  };

  const reorderTasks = (taskId: string, newOrder: number) => {
    dispatch({ type: 'REORDER_TASKS', payload: { id: taskId, newOrder } });
  };

  const importTasks = (importedTasks: Task[]) => {
    dispatch({ type: 'IMPORT_TASKS', payload: importedTasks });
  };

  const exportTasks = (): string => {
    return JSON.stringify(tasks, null, 2);
  };

  const value: TaskContextType = {
    tasks,
    isLoading,
    addTask,
    updateTask,
    deleteTask,
    reorderTasks,
    importTasks,
    exportTasks,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
