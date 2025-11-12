import { differenceInDays, addDays, startOfDay, parseISO } from 'date-fns';

/**
 * Convert a date to X coordinate (pixel position)
 * @param date - The date to convert
 * @param startDate - The start date of the timeline
 * @param pixelsPerDay - Number of pixels per day
 * @returns The X coordinate in pixels
 */
export const dateToX = (
  date: Date | string,
  startDate: Date | string,
  pixelsPerDay: number
): number => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const startDateObj = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  
  const daysDiff = differenceInDays(startOfDay(dateObj), startOfDay(startDateObj));
  return daysDiff * pixelsPerDay;
};

/**
 * Convert X coordinate (pixel position) to date
 * @param x - The X coordinate in pixels
 * @param startDate - The start date of the timeline
 * @param pixelsPerDay - Number of pixels per day
 * @returns The corresponding date
 */
export const xToDate = (
  x: number,
  startDate: Date | string,
  pixelsPerDay: number
): Date => {
  const startDateObj = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const days = Math.floor(x / pixelsPerDay);
  return addDays(startOfDay(startDateObj), days);
};

/**
 * Calculate the width of a task bar in pixels
 * @param startDate - The start date of the task
 * @param endDate - The end date of the task
 * @param pixelsPerDay - Number of pixels per day
 * @returns The width in pixels
 */
export const calculateBarWidth = (
  startDate: Date | string,
  endDate: Date | string,
  pixelsPerDay: number
): number => {
  const startDateObj = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const endDateObj = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  
  const days = differenceInDays(startOfDay(endDateObj), startOfDay(startDateObj)) + 1;
  return Math.max(days * pixelsPerDay, pixelsPerDay); // Minimum width of 1 day
};

/**
 * Format a date to ISO string (YYYY-MM-DD)
 * @param date - The date to format
 * @returns The formatted date string
 */
export const formatDateToISO = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Check if a date is within a range
 * @param date - The date to check
 * @param rangeStart - The start of the range
 * @param rangeEnd - The end of the range
 * @returns True if the date is within the range
 */
export const isDateInRange = (
  date: Date | string,
  rangeStart: Date | string,
  rangeEnd: Date | string
): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const rangeStartObj = typeof rangeStart === 'string' ? parseISO(rangeStart) : rangeStart;
  const rangeEndObj = typeof rangeEnd === 'string' ? parseISO(rangeEnd) : rangeEnd;
  
  const dateTime = startOfDay(dateObj).getTime();
  const startTime = startOfDay(rangeStartObj).getTime();
  const endTime = startOfDay(rangeEndObj).getTime();
  
  return dateTime >= startTime && dateTime <= endTime;
};

/**
 * Snap a pixel value to the nearest day boundary
 * @param pixels - The pixel value to snap
 * @param pixelsPerDay - Number of pixels per day
 * @returns The snapped pixel value
 */
export const snapToDay = (pixels: number, pixelsPerDay: number): number => {
  const days = Math.round(pixels / pixelsPerDay);
  return days * pixelsPerDay;
};
