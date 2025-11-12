import { TaskProvider, useTasks } from './contexts/TaskContext';
import { ViewProvider } from './contexts/ViewContext';
import { Layout } from './components/layout/Layout';
import { Toolbar } from './components/layout/Toolbar';
import { GanttChart } from './components/gantt/GanttChart';
import { TaskEditModal } from './components/task/TaskEditModal';
import { Loading } from './components/common/Loading';
import { Toaster } from './components/ui/toaster';
import './App.css';

function AppContent() {
  const { isLoading } = useTasks();

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
