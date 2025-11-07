import React, { useRef } from 'react';
import { Plus, Download, Upload, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '../ui/button';
import { useView } from '../../contexts/ViewContext';
import { useTasks } from '../../contexts/TaskContext';
import { useToast } from '../../hooks/use-toast';
import { TimeScale } from '../../types/view';
import { exportAndDownloadTasks } from '../../services/export';
import { importFromFile } from '../../services/import';

export const Toolbar: React.FC = () => {
  const { viewSettings, updateViewSettings, openEditModal } = useView();
  const { tasks, importTasks } = useTasks();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddTask = () => {
    openEditModal();
  };

  const handleExport = () => {
    try {
      exportAndDownloadTasks(tasks);
      toast({
        title: 'Export successful',
        description: `${tasks.length} tasks exported successfully.`,
      });
    } catch (error) {
      console.error('Failed to export tasks:', error);
      toast({
        title: 'Export failed',
        description: 'Failed to export tasks. Please try again.',
        variant: 'destructive',
      });
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
      toast({
        title: 'Import successful',
        description: `${importedTasks.length} tasks imported successfully.`,
      });
    } catch (error) {
      console.error('Failed to import tasks:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast({
        title: 'Import failed',
        description: errorMessage,
        variant: 'destructive',
      });
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
    <div className="bg-white border-b border-gray-200 px-4 py-2" role="toolbar" aria-label="Task management toolbar">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Button onClick={handleAddTask} size="sm" className="gap-2" aria-label="Add new task">
            <Plus className="w-4 h-4" aria-hidden="true" />
            Add Task
          </Button>
          
          <div className="h-6 w-px bg-gray-300" aria-hidden="true" />
          
          <Button onClick={handleExport} variant="outline" size="sm" className="gap-2" aria-label="Export tasks to JSON file">
            <Download className="w-4 h-4" aria-hidden="true" />
            Export
          </Button>
          
          <Button onClick={handleImport} variant="outline" size="sm" className="gap-2" aria-label="Import tasks from JSON file">
            <Upload className="w-4 h-4" aria-hidden="true" />
            Import
          </Button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
            aria-label="File input for importing tasks"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-gray-100 rounded-md p-1" role="group" aria-label="Time scale selector">
            <button
              onClick={() => handleTimeScaleChange('day')}
              className={`px-3 py-1 text-sm rounded ${
                viewSettings.timeScale === 'day'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              aria-label="View by day"
              aria-pressed={viewSettings.timeScale === 'day'}
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
              aria-label="View by week"
              aria-pressed={viewSettings.timeScale === 'week'}
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
              aria-label="View by month"
              aria-pressed={viewSettings.timeScale === 'month'}
            >
              Month
            </button>
          </div>

          <div className="h-6 w-px bg-gray-300" aria-hidden="true" />

          <div className="flex items-center gap-1" role="group" aria-label="Zoom controls">
            <Button onClick={handleZoomOut} variant="outline" size="sm" aria-label="Zoom out">
              <ZoomOut className="w-4 h-4" aria-hidden="true" />
            </Button>
            <span className="text-sm text-gray-600 min-w-[3rem] text-center" aria-live="polite" aria-label={`Current zoom level: ${Math.round(viewSettings.zoom * 100)} percent`}>
              {Math.round(viewSettings.zoom * 100)}%
            </span>
            <Button onClick={handleZoomIn} variant="outline" size="sm" aria-label="Zoom in">
              <ZoomIn className="w-4 h-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
