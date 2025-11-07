import { TaskProvider, useTasks } from './contexts/TaskContext';
import { ViewProvider, useView } from './contexts/ViewContext';
import { Layout } from './components/layout/Layout';
import { Toolbar } from './components/layout/Toolbar';
import { GanttChart } from './components/gantt/GanttChart';
import { TaskEditModal } from './components/task/TaskEditModal';
import { Loading } from './components/common/Loading';
import { Toaster } from './components/ui/toaster';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import './App.css';

function AppContent() {
  const { tasks, isLoading, deleteTask } = useTasks();
  const { selectedTaskId, setSelectedTaskId, openEditModal, closeEditModal, isEditModalOpen } = useView();

  useKeyboardShortcuts({
    onNewTask: () => {
      openEditModal(undefined);
    },
    onEscape: () => {
      if (isEditModalOpen) {
        closeEditModal();
      } else if (selectedTaskId) {
        setSelectedTaskId(null);
      }
    },
    onDelete: () => {
      if (selectedTaskId && !isEditModalOpen) {
        const task = tasks.find(t => t.id === selectedTaskId);
        if (task && window.confirm(`Delete task "${task.name}"?`)) {
          deleteTask(selectedTaskId);
          setSelectedTaskId(null);
        }
      }
    },
    onArrowUp: () => {
      if (!isEditModalOpen && tasks.length > 0) {
        const currentIndex = selectedTaskId 
          ? tasks.findIndex(t => t.id === selectedTaskId)
          : -1;
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : tasks.length - 1;
        setSelectedTaskId(tasks[prevIndex].id);
      }
    },
    onArrowDown: () => {
      if (!isEditModalOpen && tasks.length > 0) {
        const currentIndex = selectedTaskId 
          ? tasks.findIndex(t => t.id === selectedTaskId)
          : -1;
        const nextIndex = currentIndex < tasks.length - 1 ? currentIndex + 1 : 0;
        setSelectedTaskId(tasks[nextIndex].id);
      }
    },
  });

  if (isLoading) {
    return <Loading message="Loading tasks..." fullScreen />;
  }

  return (
    <div className="h-screen flex flex-col">
      <Layout>
        <Toolbar />
        <GanttChart />
      </Layout>
      <TaskEditModal />
    </div>
  );
}

function App() {
  return (
    <TaskProvider>
      <ViewProvider>
        <AppContent />
        <Toaster />
      </ViewProvider>
    </TaskProvider>
  );
}

export default App;
