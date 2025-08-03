import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserSettings, TaskStorage, Task } from '../types/task';
import { bitable } from '@lark-opdev/block-bitable-api';
import { useErrorContext } from './ErrorContext';

interface StorageContextType {
  userSettings: UserSettings;
  updateUserSettings: (settings: Partial<UserSettings>) => void;
  updateTaskStorage: (task: Task, accumulatedTime: number) => void;
  getTaskStorage: (task: Task) => TaskStorage | null;
  isLoading: boolean;
}

const StorageContext = createContext<StorageContextType | undefined>(undefined);

export const useStorageContext = () => {
  const context = useContext(StorageContext);
  if (context === undefined) {
    throw new Error('useStorageContext must be used within a StorageProvider');
  }
  return context;
};

interface StorageProviderProps {
  children: ReactNode;
}

export const StorageProvider: React.FC<StorageProviderProps> = ({ children }) => {
  const { setError } = useErrorContext();

  const [userSettings, setUserSettings] = useState<UserSettings>({ timerDuration: 25 });
  const [taskStorages, setTaskStorages] = useState<TaskStorage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 初始化时加载数据
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await bitable.bridge.getData() as Record<string, unknown>;
        console.log("番茄钟业务数据初始化", data);
        if (data['user']) {
          const userSettings = data['user'] as UserSettings;
          setUserSettings(userSettings);
          console.log('用户设置数据', userSettings);
        }
        if (data['tasks']) {
          const taskStorages = data['tasks'] as TaskStorage[];
          const validTaskStorages = taskStorages.filter(ts => ts.date === new Date().toISOString().split('T')[0]);
          setTaskStorages(validTaskStorages);
          console.log('任务执行数据', validTaskStorages);
        }
      } catch (error) {
        console.error('番茄钟业务加载存储数据失败:', error);
        setError('无法加载存储数据');
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const updateUserSettings = async (newSettings: Partial<UserSettings>) => {
    const updatedSettings = { ...userSettings, ...newSettings };
    console.log('持久化番茄钟用户设置数据', '用户设置', updatedSettings, '任务执行数据', taskStorages);
    await bitable.bridge.setData({ user: updatedSettings, tasks: taskStorages });
    setUserSettings(updatedSettings);
  };

  const updateTaskStorage = async (task: Task, accumulatedTime: number) => {
    const taskName = task.title.map(segment => segment.text).join('');

    let updatedSettings: TaskStorage[] = [];
    if (accumulatedTime > 0) {
      if (taskStorages.find(ts => ts.taskName === taskName)) {
        updatedSettings = taskStorages.map(ts =>
          ts.taskName === taskName ? { ...ts, accumulatedTime } : ts
        );
      } else {
        updatedSettings = [
          ...taskStorages,
          { taskName: taskName, accumulatedTime, date: new Date().toISOString().split('T')[0] },
        ];
      }
    } else {
      updatedSettings = taskStorages.filter(ts => ts.taskName !== taskName);
    }

    console.log('持久化番茄钟任务执行数据', '任务标题', taskName, '任务执行数据', taskStorages, '-->', updatedSettings, '已积累时间', accumulatedTime, '用户设置', userSettings);
    await bitable.bridge.setData({ user: userSettings, tasks: updatedSettings });
    setTaskStorages(updatedSettings);
  };

  const getTaskStorage = (task: Task): TaskStorage | null => {
    const taskName = task.title.map(segment => segment.text).join('');
    const targetTask = taskStorages.filter(ts => ts.taskName === taskName)[0] || null
    return targetTask;
  };

  const value: StorageContextType = {
    userSettings,
    updateUserSettings,
    updateTaskStorage,
    getTaskStorage,
    isLoading,
  };

  return (
    <StorageContext.Provider value={value}>
      {children}
    </StorageContext.Provider>
  );
};