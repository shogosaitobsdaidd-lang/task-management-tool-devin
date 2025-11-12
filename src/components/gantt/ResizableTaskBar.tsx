import React, { useState, useRef } from 'react';
import { Task } from '../../types/task';
import { TaskBar } from './TaskBar';
import { getTaskX, getTaskWidth, getTaskY } from '../../utils/coordinates';
import { TASK_BAR_HEIGHT, TASK_BAR_MARGIN } from '../../constants/config';
import { differenceInDays, addDays } from 'date-fns';

interface ResizableTaskBarProps {
  task: Task;
  taskIndex: number;
  timelineStartDate: Date | string;
  pixelsPerDay: number;
  zoom: number;
  onClick: (taskId: string) => void;
  onResize: (taskId: string, newStartDate: string, newEndDate: string) => void;
}

export const ResizableTaskBar: React.FC<ResizableTaskBarProps> = ({
  task,
  taskIndex,
  timelineStartDate,
  pixelsPerDay,
  zoom,
  onClick,
  onResize,
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const [tempDates, setTempDates] = useState<{ start: Date; end: Date } | null>(null);
  const startXRef = useRef<number>(0);
  const originalDatesRef = useRef<{ start: Date; end: Date } | null>(null);

  const handleResizeStart = (e: React.MouseEvent, handle: 'left' | 'right') => {
    e.stopPropagation();
    setIsResizing(true);
    startXRef.current = e.clientX;
    originalDatesRef.current = {
      start: new Date(task.startDate),
      end: new Date(task.endDate),
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!originalDatesRef.current) return;

      const deltaX = moveEvent.clientX - startXRef.current;
      const effectivePixelsPerDay = pixelsPerDay * zoom;
      const daysDelta = Math.round(deltaX / effectivePixelsPerDay);

      let newStart = originalDatesRef.current.start;
      let newEnd = originalDatesRef.current.end;

      if (handle === 'left') {
        newStart = addDays(originalDatesRef.current.start, daysDelta);
        if (differenceInDays(newEnd, newStart) < 1) {
          newStart = addDays(newEnd, -1);
        }
      } else {
        newEnd = addDays(originalDatesRef.current.end, daysDelta);
        if (differenceInDays(newEnd, newStart) < 1) {
          newEnd = addDays(newStart, 1);
        }
      }

      setTempDates({ start: newStart, end: newEnd });
    };

    const handleMouseUp = () => {
      if (tempDates) {
        const newStartDate = tempDates.start.toISOString().split('T')[0];
        const newEndDate = tempDates.end.toISOString().split('T')[0];
        onResize(task.id, newStartDate, newEndDate);
      }
      setIsResizing(false);
      setTempDates(null);
      originalDatesRef.current = null;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const displayTask = tempDates
    ? {
        ...task,
        startDate: tempDates.start.toISOString().split('T')[0],
        endDate: tempDates.end.toISOString().split('T')[0],
      }
    : task;

  const x = getTaskX(displayTask, timelineStartDate, pixelsPerDay * zoom);
  const width = getTaskWidth(displayTask, pixelsPerDay * zoom);
  const y = getTaskY(taskIndex, TASK_BAR_HEIGHT, TASK_BAR_MARGIN);
  const handleWidth = 8;

  return (
    <g style={{ opacity: isResizing ? 0.7 : 1 }}>
      <TaskBar
        task={displayTask}
        taskIndex={taskIndex}
        timelineStartDate={timelineStartDate}
        pixelsPerDay={pixelsPerDay}
        zoom={zoom}
        onClick={onClick}
      />
      {/* Left resize handle */}
      <rect
        x={x - handleWidth / 2}
        y={y}
        width={handleWidth}
        height={TASK_BAR_HEIGHT}
        fill="transparent"
        style={{ cursor: 'ew-resize' }}
        onMouseDown={(e) => handleResizeStart(e, 'left')}
      />
      {/* Right resize handle */}
      <rect
        x={x + width - handleWidth / 2}
        y={y}
        width={handleWidth}
        height={TASK_BAR_HEIGHT}
        fill="transparent"
        style={{ cursor: 'ew-resize' }}
        onMouseDown={(e) => handleResizeStart(e, 'right')}
      />
    </g>
  );
};
