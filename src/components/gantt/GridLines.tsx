import React from 'react';
import { eachDayOfInterval } from 'date-fns';

interface GridLinesProps {
  startDate: Date | string;
  endDate: Date | string;
  pixelsPerDay: number;
  zoom: number;
  height: number;
}

export const GridLines: React.FC<GridLinesProps> = ({
  startDate,
  endDate,
  pixelsPerDay,
  zoom,
  height,
}) => {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

  const days = eachDayOfInterval({ start, end });

  return (
    <svg
      className="absolute top-0 left-0 pointer-events-none"
      style={{ width: '100%', height: `${height}px` }}
    >
      {days.map((day, index) => {
        const x = index * pixelsPerDay * zoom;
        const isWeekend = day.getDay() === 0 || day.getDay() === 6;
        
        return (
          <g key={index}>
            {/* Vertical grid line */}
            <line
              x1={x}
              y1={0}
              x2={x}
              y2={height}
              stroke={isWeekend ? '#e5e7eb' : '#f3f4f6'}
              strokeWidth={1}
            />
            {/* Weekend background */}
            {isWeekend && (
              <rect
                x={x}
                y={0}
                width={pixelsPerDay * zoom}
                height={height}
                fill="#f9fafb"
                opacity={0.5}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
};
