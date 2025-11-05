import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../../types/task';
import { TaskListItem } from './TaskListItem';

interface SortableTaskListItemProps {
  task: Task;
  taskIndex: number;
  isSelected: boolean;
  onClick: (taskId: string) => void;
}

export const SortableTaskListItem: React.FC<SortableTaskListItemProps> = ({
  task,
  taskIndex,
  isSelected,
  onClick,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskListItem
        task={task}
        taskIndex={taskIndex}
        isSelected={isSelected}
        onClick={onClick}
      />
    </div>
  );
};
