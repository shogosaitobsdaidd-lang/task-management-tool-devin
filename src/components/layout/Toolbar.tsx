import React, { useRef } from 'react';
import { Plus, Download, Upload, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '../ui/button';
import { useView } from '../../contexts/ViewContext';
import { useTasks } from '../../contexts/TaskContext';
import { TimeScale } from '../../types/view';
import { exportAndDownloadTasks } from '../../services/export';
import { importFromFile } from '../../services/import';

export const Toolbar: React.FC = () => {
  const { viewSettings, updateViewSettings, openEditModal } = useView();
  const { tasks, importTasks } = useTasks();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddTask = () => {
    openEditModal();
  };

  const handleExport = () => {
    try {
      exportAndDownloadTasks(tasks);
      console.log('Tasks exported successfully');
    } catch (error) {
      console.error('Failed to export tasks:', error);
      alert('Failed to export tasks. Please try again.');
    }
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const importedTasks = await importFromFile(file);
      importTasks(importedTasks);
      console.log(`Successfully imported ${importedTasks.length} tasks`);
    } catch (error) {
      console.error('Failed to import tasks:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to import tasks: ${errorMessage}`);
    }
    
    event.target.value = '';
  };

  const handleTimeScaleChange = (timeScale: TimeScale) => {
    updateViewSettings({ timeScale });
  };

  const handleZoomIn = () => {
    const newZoom = Math.min(viewSettings.zoom + 0.1, 2.0);
    updateViewSettings({ zoom: newZoom });
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(viewSettings.zoom - 0.1, 0.5);
    updateViewSettings({ zoom: newZoom });
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-2">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Button onClick={handleAddTask} size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Task
          </Button>
          
          <div className="h-6 w-px bg-gray-300" />
          
          <Button onClick={handleExport} variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          
          <Button onClick={handleImport} variant="outline" size="sm" className="gap-2">
            <Upload className="w-4 h-4" />
            Import
          </Button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-gray-100 rounded-md p-1">
            <button
              onClick={() => handleTimeScaleChange('day')}
              className={`px-3 py-1 text-sm rounded ${
                viewSettings.timeScale === 'day'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Day
            </button>
            <button
              onClick={() => handleTimeScaleChange('week')}
              className={`px-3 py-1 text-sm rounded ${
                viewSettings.timeScale === 'week'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => handleTimeScaleChange('month')}
              className={`px-3 py-1 text-sm rounded ${
                viewSettings.timeScale === 'month'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Month
            </button>
          </div>

          <div className="h-6 w-px bg-gray-300" />

          <div className="flex items-center gap-1">
            <Button onClick={handleZoomOut} variant="outline" size="sm">
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm text-gray-600 min-w-[3rem] text-center">
              {Math.round(viewSettings.zoom * 100)}%
            </span>
            <Button onClick={handleZoomIn} variant="outline" size="sm">
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
