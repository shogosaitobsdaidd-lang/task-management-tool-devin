import React, { useState, useMemo, useCallback } from 'react';
import { Task } from '../../types/task';
import { getTaskX, getTaskWidth, getTaskY } from '../../utils/coordinates';
import { TASK_BAR_HEIGHT, TASK_BAR_MARGIN } from '../../constants/config';

interface TaskBarProps {
  task: Task;
  taskIndex: number;
  timelineStartDate: Date | string;
  pixelsPerDay: number;
  zoom: number;
  onClick: (taskId: string) => void;
}

export const TaskBar: React.FC<TaskBarProps> = React.memo(({
  task,
  taskIndex,
  timelineStartDate,
  pixelsPerDay,
  zoom,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const effectivePixelsPerDay = useMemo(() => pixelsPerDay * zoom, [pixelsPerDay, zoom]);
  
  const x = useMemo(() => getTaskX(task, timelineStartDate, effectivePixelsPerDay), [task, timelineStartDate, effectivePixelsPerDay]);
  const width = useMemo(() => getTaskWidth(task, effectivePixelsPerDay), [task, effectivePixelsPerDay]);
  const y = useMemo(() => getTaskY(taskIndex, TASK_BAR_HEIGHT, TASK_BAR_MARGIN), [taskIndex]);

  const progressWidth = useMemo(() => (width * task.progress) / 100, [width, task.progress]);

  const handleClick = useCallback(() => {
    onClick(task.id);
  }, [onClick, task.id]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  return (
    <g
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ cursor: 'pointer' }}
    >
      {/* Task bar background */}
      <rect
        x={x}
        y={y}
        width={width}
        height={TASK_BAR_HEIGHT}
        fill={task.color}
        opacity={isHovered ? 0.8 : 0.6}
        rx={4}
        ry={4}
      />
      
      {/* Progress bar */}
      <rect
        x={x}
        y={y}
        width={progressWidth}
        height={TASK_BAR_HEIGHT}
        fill={task.color}
        opacity={isHovered ? 1 : 0.9}
        rx={4}
        ry={4}
      />
      
      {/* Task name text */}
      <text
        x={x + 8}
        y={y + TASK_BAR_HEIGHT / 2 + 4}
        fill="white"
        fontSize={12}
        fontWeight="500"
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        {task.name}
      </text>
      
      {/* Progress percentage text */}
      {width > 60 && (
        <text
          x={x + width - 8}
          y={y + TASK_BAR_HEIGHT / 2 + 4}
          fill="white"
          fontSize={11}
          fontWeight="500"
          textAnchor="end"
          style={{ pointerEvents: 'none', userSelect: 'none' }}
        >
          {task.progress}%
        </text>
      )}
      
      {/* Hover border */}
      {isHovered && (
        <rect
          x={x}
          y={y}
          width={width}
          height={TASK_BAR_HEIGHT}
          fill="none"
          stroke={task.color}
          strokeWidth={2}
          rx={4}
          ry={4}
          style={{ pointerEvents: 'none' }}
        />
      )}
    </g>
  );
});
