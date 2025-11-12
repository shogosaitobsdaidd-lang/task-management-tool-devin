import React from 'react';
import { Task } from '../../types/task';
import { TASK_BAR_HEIGHT, TASK_BAR_MARGIN } from '../../constants/config';

interface TaskListItemProps {
  task: Task;
  taskIndex: number;
  isSelected: boolean;
  onClick: (taskId: string) => void;
}

export const TaskListItem: React.FC<TaskListItemProps> = ({
  task,
  taskIndex,
  isSelected,
  onClick,
}) => {
  const height = TASK_BAR_HEIGHT + TASK_BAR_MARGIN;
  const top = taskIndex * height;

  const handleClick = () => {
    onClick(task.id);
  };

  return (
    <div
      className={`absolute left-0 right-0 px-4 py-2 cursor-pointer transition-colors ${
        isSelected
          ? 'bg-blue-50 border-l-4 border-blue-500'
          : 'hover:bg-gray-50 border-l-4 border-transparent'
      }`}
      style={{
        top: `${top}px`,
        height: `${height}px`,
      }}
      onClick={handleClick}
    >
      <div className="flex items-center h-full">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {/* Task color indicator */}
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: task.color }}
            />
            {/* Task name */}
            <span
              className={`text-sm font-medium truncate ${
                isSelected ? 'text-blue-900' : 'text-gray-900'
              }`}
              title={task.name}
            >
              {task.name}
            </span>
          </div>
          {/* Task assignee */}
          {task.assignee && (
            <div className="text-xs text-gray-500 mt-1 ml-5 truncate">
              {task.assignee}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
