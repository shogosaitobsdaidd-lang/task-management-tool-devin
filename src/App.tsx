import { TaskProvider } from './contexts/TaskContext';
import { ViewProvider } from './contexts/ViewContext';
import { Layout } from './components/layout/Layout';
import { Toolbar } from './components/layout/Toolbar';
import { GanttChart } from './components/gantt/GanttChart';
import { TaskEditModal } from './components/task/TaskEditModal';
import { Toaster } from './components/ui/toaster';
import './App.css';

function App() {
  return (
    <TaskProvider>
      <ViewProvider>
        <div className="h-screen flex flex-col">
          <Layout>
            <Toolbar />
            <GanttChart />
          </Layout>
          <TaskEditModal />
          <Toaster />
        </div>
      </ViewProvider>
    </TaskProvider>
  );
}

export default App;
