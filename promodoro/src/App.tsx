import { useState } from 'react';
import { Task } from './types';
import { TaskSelector, TimerClock } from './pages';
import ErrorPage from './components/ErrorPage';
import { TaskProvider, ExecutionProvider, ErrorProvider, StorageProvider, useErrorContext, AudioProvider } from './contexts';

type AppMode = 'task-selector' | 'timer' | 'error';

// 应用内容组件（在 ErrorProvider 内部）
const AppContent = () => {
  const [mode, setMode] = useState<AppMode>('task-selector');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const { hasError } = useErrorContext();

  // 开始任务
  const handleTaskStart = (task: Task) => {
    setSelectedTask(task);
    setMode('timer');
  };

  // 返回任务选择页面
  const handleBackToTaskSelector = () => {
    setSelectedTask(null);
    setMode('task-selector');
  };

  // 如果有错误，显示错误页面
  if (hasError) {
    return (
      <ErrorPage onReturnToTasks={handleBackToTaskSelector} />
    );
  }

  // 正常的应用内容
  return (
    <AudioProvider>
      <StorageProvider>
        <TaskProvider>
          <ExecutionProvider>
            {
              mode === 'timer' && selectedTask ?
                <TimerClock
                  task={selectedTask}
                  onBack={handleBackToTaskSelector}
                />
                :
                <TaskSelector
                  onTaskStart={handleTaskStart}
                />
            }
          </ExecutionProvider>
        </TaskProvider>
      </StorageProvider>
    </AudioProvider>
  );
};

// 主应用组件
const App = () => {
  return (
    <ErrorProvider>
      <AppContent />
    </ErrorProvider>
  );
};

export default App;
