import { Task } from '../types/task';
import { dateToX, calculateBarWidth } from './date';

/**
 * Calculate the X position of a task bar
 * @param task - The task
 * @param timelineStartDate - The start date of the timeline
 * @param pixelsPerDay - Number of pixels per day
 * @returns The X position in pixels
 */
export const getTaskX = (
  task: Task,
  timelineStartDate: Date | string,
  pixelsPerDay: number
): number => {
  return dateToX(task.startDate, timelineStartDate, pixelsPerDay);
};

/**
 * Calculate the width of a task bar
 * @param task - The task
 * @param pixelsPerDay - Number of pixels per day
 * @returns The width in pixels
 */
export const getTaskWidth = (task: Task, pixelsPerDay: number): number => {
  return calculateBarWidth(task.startDate, task.endDate, pixelsPerDay);
};

/**
 * Calculate the Y position of a task bar
 * @param taskIndex - The index of the task in the list
 * @param taskBarHeight - The height of each task bar
 * @param taskBarMargin - The margin between task bars
 * @returns The Y position in pixels
 */
export const getTaskY = (
  taskIndex: number,
  taskBarHeight: number,
  taskBarMargin: number
): number => {
  return taskIndex * (taskBarHeight + taskBarMargin);
};

/**
 * Calculate the total height needed for all tasks
 * @param taskCount - The number of tasks
 * @param taskBarHeight - The height of each task bar
 * @param taskBarMargin - The margin between task bars
 * @returns The total height in pixels
 */
export const getTotalHeight = (
  taskCount: number,
  taskBarHeight: number,
  taskBarMargin: number
): number => {
  if (taskCount === 0) return 0;
  return taskCount * (taskBarHeight + taskBarMargin) - taskBarMargin;
};

/**
 * Calculate the total width needed for the timeline
 * @param startDate - The start date of the timeline
 * @param endDate - The end date of the timeline
 * @param pixelsPerDay - Number of pixels per day
 * @returns The total width in pixels
 */
export const getTotalWidth = (
  startDate: Date | string,
  endDate: Date | string,
  pixelsPerDay: number
): number => {
  return calculateBarWidth(startDate, endDate, pixelsPerDay);
};

/**
 * Check if a task is visible in the current viewport
 * @param task - The task
 * @param viewportStartDate - The start date of the viewport
 * @param viewportEndDate - The end date of the viewport
 * @returns True if the task is visible
 */
export const isTaskVisible = (
  task: Task,
  viewportStartDate: Date | string,
  viewportEndDate: Date | string
): boolean => {
  const taskStart = new Date(task.startDate).getTime();
  const taskEnd = new Date(task.endDate).getTime();
  const viewStart = new Date(viewportStartDate).getTime();
  const viewEnd = new Date(viewportEndDate).getTime();

  return taskStart <= viewEnd && taskEnd >= viewStart;
};

/**
 * Snap X coordinate to the nearest day
 * @param x - The X coordinate in pixels
 * @param pixelsPerDay - Number of pixels per day
 * @returns The snapped X coordinate
 */
export const snapToDay = (x: number, pixelsPerDay: number): number => {
  return Math.round(x / pixelsPerDay) * pixelsPerDay;
};
