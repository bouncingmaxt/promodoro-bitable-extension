// 执行记录上下文 - 管理执行记录数据

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ExecutionRecord, Task } from '../types';
import { getExecutionRecords, createExecutionRecord } from '../utils';
import { useErrorContext } from './ErrorContext';

interface ExecutionContextType {
  // 数据状态
  executionRecords: ExecutionRecord[];
  loading: boolean;
  // 操作方法
  addExecutionRecord: (task: Task, duration: number) => Promise<void>;
  getTaskCompletedCount: (task: Task) => number;
}

const ExecutionContext = createContext<ExecutionContextType | undefined>(undefined);

export const useExecutionContext = () => {
  const context = useContext(ExecutionContext);
  if (context === undefined) {
    throw new Error('useExecutionContext must be used within an ExecutionProvider');
  }
  return context;
};

interface ExecutionProviderProps {
  children: ReactNode;
}

export const ExecutionProvider: React.FC<ExecutionProviderProps> = ({ children }) => {
  const { setError } = useErrorContext();

  const [executionRecords, setExecutionRecords] = useState<ExecutionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // 初始化执行记录数据
  useEffect(() => {
    setLoading(true);
    refreshExecutionRecords()
      .then(() => {
        setLoading(false);
      })
      .catch(_ => {
        setLoading(false);
      });
  }, []);

  // 刷新执行记录
  const refreshExecutionRecords = async () => {
    try {
      const recordsData = await getExecutionRecords();
      setExecutionRecords(recordsData);
    } catch (err) {
      console.error('刷新执行记录失败:', err);
      setError('刷新执行记录失败');
    }
  };

  // 添加执行记录
  const addExecutionRecord = async (task: Task, duration: number) => {
    try {
      console.log('添加执行记录', task.title.map(segment => segment.text).join(''));
      await createExecutionRecord(task, duration);
      await refreshExecutionRecords();
    } catch (err) {
      console.error('保存执行记录失败:', err);
      setError('保存执行记录失败');
    }
  };

  // 计算任务完成次数
  const getTaskCompletedCount = (task: Task): number => {
    return executionRecords.filter(record =>
      record.taskTitle.map(segment => segment.text).join('') === task.title.map(segment => segment.text).join('')
    ).length;
  };

  const contextValue: ExecutionContextType = {
    executionRecords,
    loading,
    addExecutionRecord,
    getTaskCompletedCount,
  };

  return (
    <ExecutionContext.Provider value={contextValue}>
      {children}
    </ExecutionContext.Provider>
  );
};