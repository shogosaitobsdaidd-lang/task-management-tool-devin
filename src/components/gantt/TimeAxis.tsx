import React from 'react';
import { format, addDays, addMonths, startOfMonth, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval } from 'date-fns';
import { TimeScale } from '../../types/view';

interface TimeAxisProps {
  startDate: Date | string;
  endDate: Date | string;
  timeScale: TimeScale;
  pixelsPerDay: number;
  zoom: number;
}

export const TimeAxis: React.FC<TimeAxisProps> = ({
  startDate,
  endDate,
  timeScale,
  pixelsPerDay,
  zoom,
}) => {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

  const renderDayScale = () => {
    const days = eachDayOfInterval({ start, end });
    
    return (
      <div className="flex border-b border-gray-300">
        {days.map((day, index) => {
          const width = pixelsPerDay * zoom;
          const isWeekend = day.getDay() === 0 || day.getDay() === 6;
          
          return (
            <div
              key={index}
              className={`flex-shrink-0 border-r border-gray-200 text-center ${
                isWeekend ? 'bg-gray-50' : 'bg-white'
              }`}
              style={{ width: `${width}px` }}
            >
              <div className="text-xs font-medium text-gray-700 py-1">
                {format(day, 'EEE')}
              </div>
              <div className="text-sm font-semibold text-gray-900 pb-1">
                {format(day, 'd')}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderWeekScale = () => {
    const weeks = eachWeekOfInterval({ start, end }, { weekStartsOn: 1 });
    
    return (
      <div className="flex border-b border-gray-300">
        {weeks.map((week, index) => {
          const weekEnd = addDays(week, 6);
          const width = pixelsPerDay * 7 * zoom;
          
          return (
            <div
              key={index}
              className="flex-shrink-0 border-r border-gray-200 bg-white text-center"
              style={{ width: `${width}px` }}
            >
              <div className="text-xs font-medium text-gray-700 py-1">
                Week {format(week, 'w')}
              </div>
              <div className="text-sm font-semibold text-gray-900 pb-1">
                {format(week, 'MMM d')} - {format(weekEnd, 'MMM d')}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderMonthScale = () => {
    const months = eachMonthOfInterval({ start, end });
    
    return (
      <div className="flex border-b border-gray-300">
        {months.map((month, index) => {
          const monthStart = startOfMonth(month);
          const monthEnd = addMonths(monthStart, 1);
          const daysInMonth = Math.ceil((monthEnd.getTime() - monthStart.getTime()) / (1000 * 60 * 60 * 24));
          const width = pixelsPerDay * daysInMonth * zoom;
          
          return (
            <div
              key={index}
              className="flex-shrink-0 border-r border-gray-200 bg-white text-center"
              style={{ width: `${width}px` }}
            >
              <div className="text-sm font-semibold text-gray-900 py-2">
                {format(month, 'MMMM yyyy')}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-gray-50 sticky top-0 z-10">
      {timeScale === 'day' && renderDayScale()}
      {timeScale === 'week' && renderWeekScale()}
      {timeScale === 'month' && renderMonthScale()}
    </div>
  );
};
