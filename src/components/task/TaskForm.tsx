import React, { useState, useEffect } from 'react';
import { Task } from '../../types/task';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { TASK_COLORS, DEFAULT_TASK_COLOR } from '../../constants/colors';

interface TaskFormProps {
  task?: Task;
  onSave: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ task, onSave, onCancel, onDelete }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [assignee, setAssignee] = useState('');
  const [progress, setProgress] = useState(0);
  const [color, setColor] = useState<string>(DEFAULT_TASK_COLOR);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (task) {
      setName(task.name);
      setDescription(task.description || '');
      setStartDate(task.startDate);
      setEndDate(task.endDate);
      setAssignee(task.assignee || '');
      setProgress(task.progress);
      setColor(task.color || DEFAULT_TASK_COLOR);
    } else {
      const today = new Date().toISOString().split('T')[0];
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      const nextWeekStr = nextWeek.toISOString().split('T')[0];
      
      setName('');
      setDescription('');
      setStartDate(today);
      setEndDate(nextWeekStr);
      setAssignee('');
      setProgress(0);
      setColor(DEFAULT_TASK_COLOR);
    }
  }, [task]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Task name is required';
    } else if (name.trim().length > 200) {
      newErrors.name = 'Task name must be 200 characters or less';
    }

    if (description.length > 2000) {
      newErrors.description = 'Description must be 2000 characters or less';
    }

    if (!startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }

    if (assignee.length > 100) {
      newErrors.assignee = 'Assignee name must be 100 characters or less';
    }

    if (progress < 0 || progress > 100) {
      newErrors.progress = 'Progress must be between 0 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
      name: name.trim(),
      description: description.trim() || undefined,
      startDate,
      endDate,
      assignee: assignee.trim() || undefined,
      progress,
      color,
      order: task?.order ?? 0,
    };

    onSave(taskData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Task Name *</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter task name"
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description"
          rows={3}
          className={errors.description ? 'border-red-500' : ''}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date *</Label>
          <Input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={errors.startDate ? 'border-red-500' : ''}
          />
          {errors.startDate && (
            <p className="text-sm text-red-500">{errors.startDate}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">End Date *</Label>
          <Input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={errors.endDate ? 'border-red-500' : ''}
          />
          {errors.endDate && (
            <p className="text-sm text-red-500">{errors.endDate}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="assignee">Assignee</Label>
        <Input
          id="assignee"
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
          placeholder="Enter assignee name"
          className={errors.assignee ? 'border-red-500' : ''}
        />
        {errors.assignee && (
          <p className="text-sm text-red-500">{errors.assignee}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="progress">Progress (%)</Label>
        <div className="flex items-center gap-4">
          <Input
            id="progress"
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            className="flex-1"
          />
          <span className="text-sm font-medium w-12 text-right">{progress}%</span>
        </div>
        {errors.progress && (
          <p className="text-sm text-red-500">{errors.progress}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Color</Label>
        <div className="flex gap-2">
          {TASK_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`w-8 h-8 rounded-full border-2 transition-all ${
                color === c ? 'border-gray-900 scale-110' : 'border-gray-300'
              }`}
              style={{ backgroundColor: c }}
              aria-label={`Select color ${c}`}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-between pt-4">
        {onDelete && (
          <Button type="button" variant="destructive" onClick={onDelete}>
            Delete
          </Button>
        )}
        <div className="flex gap-2 ml-auto">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {task ? 'Update Task' : 'Create Task'}
          </Button>
        </div>
      </div>
    </form>
  );
};
