import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { TaskForm } from './TaskForm';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { useView } from '../../contexts/ViewContext';
import { useTasks } from '../../contexts/TaskContext';
import { useToast } from '../../hooks/use-toast';
import { Task } from '../../types/task';

export const TaskEditModal: React.FC = () => {
  const { isEditModalOpen, closeEditModal, selectedTaskId } = useView();
  const { tasks, addTask, updateTask, deleteTask } = useTasks();
  const { toast } = useToast();
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (selectedTaskId) {
      const task = tasks.find((t) => t.id === selectedTaskId);
      setEditingTask(task);
    } else {
      setEditingTask(undefined);
    }
  }, [selectedTaskId, tasks]);

  const handleSave = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (editingTask) {
        updateTask(editingTask.id, taskData);
        toast({
          title: 'Task updated',
          description: `"${taskData.name}" has been updated successfully.`,
        });
      } else {
        addTask(taskData);
        toast({
          title: 'Task created',
          description: `"${taskData.name}" has been created successfully.`,
        });
      }
      closeEditModal();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save task. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleCancel = () => {
    closeEditModal();
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = () => {
    if (editingTask) {
      try {
        deleteTask(editingTask.id);
        toast({
          title: 'Task deleted',
          description: `"${editingTask.name}" has been deleted successfully.`,
        });
        setShowDeleteConfirm(false);
        closeEditModal();
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete task. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <Dialog open={isEditModalOpen} onOpenChange={closeEditModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </DialogTitle>
          </DialogHeader>
          <TaskForm
            task={editingTask}
            onSave={handleSave}
            onCancel={handleCancel}
            onDelete={editingTask ? handleDeleteClick : undefined}
          />
        </DialogContent>
      </Dialog>
      
      {editingTask && (
        <DeleteConfirmDialog
          open={showDeleteConfirm}
          taskName={editingTask.name}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}
    </>
  );
};
