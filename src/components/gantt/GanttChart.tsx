import React, { useState, useRef } from 'react';
import { useTasks } from '../../contexts/TaskContext';
import { useView } from '../../contexts/ViewContext';
import { TaskList } from '../task/TaskList';
import { TimeAxis } from './TimeAxis';
import { GridLines } from './GridLines';
import { TodayMarker } from './TodayMarker';
import { TaskBar } from './TaskBar';
import { getTotalHeight, getTotalWidth, isTaskVisible } from '../../utils/coordinates';
import { TASK_BAR_HEIGHT, TASK_BAR_MARGIN, PIXELS_PER_DAY } from '../../constants/config';

export const GanttChart: React.FC = () => {
  const { tasks } = useTasks();
  const { viewSettings, selectedTaskId, openEditModal, setSelectedTaskId } = useView();
  const [scrollTop, setScrollTop] = useState(0);
  const chartPanelRef = useRef<HTMLDivElement>(null);

  const pixelsPerDay = PIXELS_PER_DAY;
  const totalHeight = getTotalHeight(tasks.length, TASK_BAR_HEIGHT, TASK_BAR_MARGIN);
  const totalWidth = getTotalWidth(
    viewSettings.startDate,
    viewSettings.endDate,
    pixelsPerDay * viewSettings.zoom
  );

  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId);
    openEditModal(taskId);
  };

  const handleTaskListScroll = (scrollTop: number) => {
    setScrollTop(scrollTop);
    if (chartPanelRef.current) {
      chartPanelRef.current.scrollTop = scrollTop;
    }
  };

  const handleChartPanelScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const newScrollTop = e.currentTarget.scrollTop;
    setScrollTop(newScrollTop);
  };

  const visibleTasks = tasks.filter((task) =>
    isTaskVisible(task, viewSettings.startDate, viewSettings.endDate)
  );

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header with TimeAxis */}
      <div className="flex border-b border-gray-300 bg-white">
        {/* Left spacer for task list */}
        <div className="w-64 flex-shrink-0 border-r border-gray-300 bg-gray-50">
          <div className="px-4 py-3 font-semibold text-sm text-gray-700">
            Tasks
          </div>
        </div>
        {/* Time axis */}
        <div className="flex-1 overflow-x-auto">
          <div style={{ width: `${totalWidth}px` }}>
            <TimeAxis
              startDate={viewSettings.startDate}
              endDate={viewSettings.endDate}
              timeScale={viewSettings.timeScale}
              pixelsPerDay={pixelsPerDay}
              zoom={viewSettings.zoom}
            />
          </div>
        </div>
      </div>

      {/* Body with TaskList and Chart */}
      <div className="flex flex-1 overflow-hidden">
        {/* Task list panel */}
        <div className="w-64 flex-shrink-0 border-r border-gray-300">
          <TaskList
            tasks={tasks}
            selectedTaskId={selectedTaskId}
            onTaskClick={handleTaskClick}
            scrollTop={scrollTop}
            onScroll={handleTaskListScroll}
          />
        </div>

        {/* Chart panel */}
        <div
          ref={chartPanelRef}
          className="flex-1 overflow-auto relative"
          onScroll={handleChartPanelScroll}
        >
          <div
            className="relative"
            style={{
              width: `${totalWidth}px`,
              height: `${totalHeight}px`,
            }}
          >
            {/* Grid lines */}
            <GridLines
              startDate={viewSettings.startDate}
              endDate={viewSettings.endDate}
              pixelsPerDay={pixelsPerDay}
              zoom={viewSettings.zoom}
              height={totalHeight}
            />

            {/* Today marker */}
            <TodayMarker
              startDate={viewSettings.startDate}
              pixelsPerDay={pixelsPerDay}
              zoom={viewSettings.zoom}
              height={totalHeight}
            />

            {/* Task bars */}
            <svg
              className="absolute top-0 left-0"
              width={totalWidth}
              height={totalHeight}
            >
              {visibleTasks.map((task) => {
                const taskIndex = tasks.findIndex((t) => t.id === task.id);
                return (
                  <TaskBar
                    key={task.id}
                    task={task}
                    taskIndex={taskIndex}
                    timelineStartDate={viewSettings.startDate}
                    pixelsPerDay={pixelsPerDay}
                    zoom={viewSettings.zoom}
                    onClick={handleTaskClick}
                  />
                );
              })}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
