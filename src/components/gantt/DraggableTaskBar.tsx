import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../../types/task';
import { TaskBar } from './TaskBar';

interface DraggableTaskBarProps {
  task: Task;
  taskIndex: number;
  timelineStartDate: Date | string;
  pixelsPerDay: number;
  zoom: number;
  onClick: (taskId: string) => void;
}

export const DraggableTaskBar: React.FC<DraggableTaskBarProps> = ({
  task,
  taskIndex,
  timelineStartDate,
  pixelsPerDay,
  zoom,
  onClick,
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: {
      task,
      taskIndex,
    },
  });

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
        cursor: isDragging ? 'grabbing' : 'grab',
      }
    : {
        cursor: 'grab',
      };

  return (
    <g
      ref={setNodeRef as any}
      style={style as any}
      {...listeners}
      {...attributes}
    >
      <TaskBar
        task={task}
        taskIndex={taskIndex}
        timelineStartDate={timelineStartDate}
        pixelsPerDay={pixelsPerDay}
        zoom={zoom}
        onClick={onClick}
      />
    </g>
  );
};
