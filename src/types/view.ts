export type TimeScale = 'day' | 'week' | 'month';

export interface ViewSettings {
  timeScale: TimeScale;
  startDate: string;
  endDate: string;
  zoom: number;
}
