import { Task } from '../types/task';
import { TASK_COLORS } from '../constants/colors';

/**
 * Generate sample tasks for first-time users
 * @returns Array of sample tasks
 */
export const generateSampleTasks = (): Task[] => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const threeDaysLater = new Date(today);
  threeDaysLater.setDate(threeDaysLater.getDate() + 3);
  
  const fiveDaysLater = new Date(today);
  fiveDaysLater.setDate(fiveDaysLater.getDate() + 5);
  
  const sevenDaysLater = new Date(today);
  sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);
  
  const tenDaysLater = new Date(today);
  tenDaysLater.setDate(tenDaysLater.getDate() + 10);

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const now = new Date().toISOString();

  return [
    {
      id: 'sample-1',
      name: 'Project Planning',
      startDate: formatDate(today),
      endDate: formatDate(threeDaysLater),
      progress: 75,
      color: TASK_COLORS[0],
      assignee: 'Alice',
      description: 'Define project scope and create initial plan',
      order: 0,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'sample-2',
      name: 'Design Phase',
      startDate: formatDate(tomorrow),
      endDate: formatDate(fiveDaysLater),
      progress: 50,
      color: TASK_COLORS[1],
      assignee: 'Bob',
      description: 'Create wireframes and design mockups',
      order: 1,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'sample-3',
      name: 'Development Sprint 1',
      startDate: formatDate(threeDaysLater),
      endDate: formatDate(sevenDaysLater),
      progress: 25,
      color: TASK_COLORS[2],
      assignee: 'Charlie',
      description: 'Implement core features',
      order: 2,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'sample-4',
      name: 'Testing & QA',
      startDate: formatDate(fiveDaysLater),
      endDate: formatDate(tenDaysLater),
      progress: 0,
      color: TASK_COLORS[3],
      assignee: 'Diana',
      description: 'Comprehensive testing and bug fixes',
      order: 3,
      createdAt: now,
      updatedAt: now,
    },
  ];
};
