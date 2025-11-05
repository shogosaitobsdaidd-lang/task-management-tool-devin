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
import { Task } from '../../types/task';

export const TaskEditModal: React.FC = () => {
  const { isEditModalOpen, closeEditModal, selectedTaskId } = useView();
  const { tasks, addTask, updateTask, deleteTask } = useTasks();
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
    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }
    closeEditModal();
  };

  const handleCancel = () => {
    closeEditModal();
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = () => {
    if (editingTask) {
      deleteTask(editingTask.id);
      setShowDeleteConfirm(false);
      closeEditModal();
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
