import React from 'react';
import { dateToX } from '../../utils/date';

interface TodayMarkerProps {
  startDate: Date | string;
  pixelsPerDay: number;
  zoom: number;
  height: number;
}

export const TodayMarker: React.FC<TodayMarkerProps> = ({
  startDate,
  pixelsPerDay,
  zoom,
  height,
}) => {
  const today = new Date();
  const x = dateToX(today, startDate, pixelsPerDay * zoom);

  if (x < 0) {
    return null;
  }

  return (
    <svg
      className="absolute top-0 left-0 pointer-events-none"
      style={{ width: '100%', height: `${height}px` }}
    >
      {/* Today marker line */}
      <line
        x1={x}
        y1={0}
        x2={x}
        y2={height}
        stroke="#ef4444"
        strokeWidth={2}
        strokeDasharray="4 4"
      />
      {/* Today marker label */}
      <g>
        <rect
          x={x - 30}
          y={8}
          width={60}
          height={20}
          fill="#ef4444"
          rx={4}
        />
        <text
          x={x}
          y={22}
          textAnchor="middle"
          fill="white"
          fontSize={12}
          fontWeight="bold"
        >
          TODAY
        </text>
      </g>
    </svg>
  );
};
