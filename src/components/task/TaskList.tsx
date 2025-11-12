import React, { useRef, useEffect } from 'react';
import { Task } from '../../types/task';
import { TaskListItem } from './TaskListItem';
import { getTotalHeight } from '../../utils/coordinates';
import { TASK_BAR_HEIGHT, TASK_BAR_MARGIN } from '../../constants/config';

interface TaskListProps {
  tasks: Task[];
  selectedTaskId: string | null;
  onTaskClick: (taskId: string) => void;
  scrollTop?: number;
  onScroll?: (scrollTop: number) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  selectedTaskId,
  onTaskClick,
  scrollTop = 0,
  onScroll,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && scrollTop !== undefined) {
      containerRef.current.scrollTop = scrollTop;
    }
  }, [scrollTop]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (onScroll) {
      onScroll(e.currentTarget.scrollTop);
    }
  };

  const totalHeight = getTotalHeight(tasks.length, TASK_BAR_HEIGHT, TASK_BAR_MARGIN);

  return (
    <div
      ref={containerRef}
      className="h-full overflow-y-auto overflow-x-hidden bg-white border-r border-gray-200"
      onScroll={handleScroll}
    >
      <div className="relative" style={{ height: `${totalHeight}px` }}>
        {tasks.map((task, index) => (
          <TaskListItem
            key={task.id}
            task={task}
            taskIndex={index}
            isSelected={task.id === selectedTaskId}
            onClick={onTaskClick}
          />
        ))}
      </div>
    </div>
  );
};
