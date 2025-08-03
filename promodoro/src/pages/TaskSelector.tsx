// 任务选择器组件

import React from 'react';
import { Spin, Typography, Empty, Card, Space } from '@douyinfe/semi-ui';
import { Task } from '../types';
import { TaskCard } from '../components/TaskCard';
import { TimerSettings } from '../components/TimerSettings';
import { useTaskContext, useStorageContext, useExecutionContext } from '../contexts';
import { Statistics } from '../components/Statistics';

interface TaskSelectorProps {
  onTaskStart: (task: Task) => void;
}

const { Title } = Typography;

export const TaskSelector: React.FC<TaskSelectorProps> = ({
  onTaskStart
}) => {
  const { tasks, loading } = useTaskContext();
  const { isLoading } = useStorageContext();

  const handleTaskStart = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      onTaskStart(task);
    }
  };

  if (loading || isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: 40 }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>加载任务中...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: 16 }}>
      <Title heading={4} style={{ margin: '0 0 24px 0', textAlign: 'center' }}>
        番茄钟 - 任务选择
      </Title>

      {/* 统计信息 */}
      <Title heading={6} style={{ margin: '0 0 12px 0', textAlign: 'center' }}>任务统计</Title>
      <div>
        <Statistics />
      </div>

      {/* 任务列表 */}
      <Title heading={6} style={{ margin: '0 0 16px 0', textAlign: 'center' }}>进行中的任务</Title>
      <div>
        {tasks.length === 0 ? (
          <Empty
            title="暂无任务"
            description={'当前"进行中"视图中没有任务'}
            image="simple"
          />
        ) : (
          tasks.map(task => {
            return (
              <TaskCard
                key={task.id}
                task={task}
                onStart={handleTaskStart}
              />
            );
          })
        )}
      </div>

      {/* 倒计时设置 */}
      <Title heading={6} style={{ margin: '0 0 16px 0', textAlign: 'center' }}>设置</Title>
      <div>
        <TimerSettings />
      </div>
    </div>
  );
};