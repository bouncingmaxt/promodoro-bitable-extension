// 任务上下文 - 管理任务数据

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task } from '../types';
import { getTasksFromView } from '../utils';
import { useErrorContext } from './ErrorContext';

interface TaskContextType {
  // 数据状态
  tasks: Task[];
  loading: boolean;  
  // 操作方法
  refreshTasks: () => Promise<void>;
  getTaskById: (id: string) => Task | undefined;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const { setError } = useErrorContext();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // 初始化任务数据
  useEffect(() => {
    setLoading(true);
    refreshTasks()
      .then(() => {
        setLoading(false);
      })
      .catch((_) => {
        setLoading(false);
      });
  }, []);

  // 刷新任务数据
  const refreshTasks = async () => {
    try {
      const tasksData = await getTasksFromView();
      setTasks(tasksData);
    } catch (err) {
      console.error('刷新任务数据失败:', err);
      setError('刷新任务数据失败');
    }
  };

  // 根据ID获取任务
  const getTaskById = (id: string): Task | undefined => {
    return tasks.find(task => task.id === id);
  };

  const contextValue: TaskContextType = {
    tasks,
    loading,
    refreshTasks,
    getTaskById
  };

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  );
};