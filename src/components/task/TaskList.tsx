import React, { useRef, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Task } from '../../types/task';
import { SortableTaskListItem } from './SortableTaskListItem';
import { getTotalHeight } from '../../utils/coordinates';
import { TASK_BAR_HEIGHT, TASK_BAR_MARGIN } from '../../constants/config';

interface TaskListProps {
  tasks: Task[];
  selectedTaskId: string | null;
  onTaskClick: (taskId: string) => void;
  onReorder: (taskId: string, newOrder: number) => void;
  scrollTop?: number;
  onScroll?: (scrollTop: number) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  selectedTaskId,
  onTaskClick,
  onReorder,
  scrollTop = 0,
  onScroll,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = tasks.findIndex((task) => task.id === active.id);
      const newIndex = tasks.findIndex((task) => task.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        onReorder(active.id as string, newIndex);
      }
    }
  };

  const totalHeight = getTotalHeight(tasks.length, TASK_BAR_HEIGHT, TASK_BAR_MARGIN);

  return (
    <div
      ref={containerRef}
      className="h-full overflow-y-auto overflow-x-hidden bg-white border-r border-gray-200"
      onScroll={handleScroll}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={tasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="relative" style={{ height: `${totalHeight}px` }}>
            {tasks.map((task, index) => (
              <SortableTaskListItem
                key={task.id}
                task={task}
                taskIndex={index}
                isSelected={task.id === selectedTaskId}
                onClick={onTaskClick}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};
