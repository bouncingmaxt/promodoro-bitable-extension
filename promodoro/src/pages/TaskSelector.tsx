// 任务选择器组件

import React from 'react';
import { Spin, Typography, Empty, Card, Space } from '@douyinfe/semi-ui';
import { Task } from '../types';
import { TaskCard } from '../components/TaskCard';
import { TimerSettings } from '../components/TimerSettings';
import { useTaskContext, useStorageContext, useExecutionContext } from '../contexts';

interface TaskSelectorProps {
  onTaskStart: (task: Task) => void;
}

const { Title } = Typography;

export const TaskSelector: React.FC<TaskSelectorProps> = ({
  onTaskStart
}) => {
  const { tasks, loading } = useTaskContext();
  const { isLoading, getTaskStorage } = useStorageContext();
  const { executionRecords, getTaskCompletedCount } = useExecutionContext();

  const handleTaskStart = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      onTaskStart(task);
    }
  };

  // 计算统计数据
  const calculateStats = () => {
    let totalCompleted = 0;
    let totalTarget = 0;
    let totalCompletedTime = 0;
    let totalTargetTime = 0;

    tasks.forEach(task => {
      const completedCount = getTaskCompletedCount(task);
      totalCompleted += completedCount;
      totalTarget += task.count;

      // 计算该任务的完成时间（从执行记录中获取）
      const taskRecords = executionRecords.filter(record =>
        record.taskTitle.map(segment => segment.text).join('') === task.title.map(segment => segment.text).join('')
      );
      const taskCompletedTime = taskRecords.reduce((sum, record) => sum + record.executionTime, 0);
      totalCompletedTime += taskCompletedTime;

      // 计算该任务的目标时间（目标次数 * 25分钟）
      totalTargetTime += task.count * 25;
    });

    return {
      totalCompleted,
      totalTarget,
      totalCompletedTime,
      totalTargetTime
    };
  };

  const stats = calculateStats();

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
      <Card style={{ margin: '16px 0' }}>
        <Typography.Title heading={6} style={{ margin: '0 0 12px 0' }}>任务统计</Typography.Title>
        <Space wrap style={{ gap: '24px' }}>
          <div style={{ textAlign: 'center' }}>
            <Typography.Text type="secondary" size="small">完成次数</Typography.Text>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--semi-color-primary)' }}>
              {stats.totalCompleted}/{stats.totalTarget} 次
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Typography.Text type="secondary" size="small">完成时间</Typography.Text>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--semi-color-primary)' }}>
              {stats.totalCompletedTime}/{stats.totalTargetTime} 分钟
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Typography.Text type="secondary" size="small">完成率</Typography.Text>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--semi-color-success)' }}>
              {stats.totalTarget > 0 ? ((stats.totalCompleted / stats.totalTarget) * 100).toFixed(1) : 0}%
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Typography.Text type="secondary" size="small">时间完成率</Typography.Text>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--semi-color-success)' }}>
              {stats.totalTargetTime > 0 ? ((stats.totalCompletedTime / stats.totalTargetTime) * 100).toFixed(1) : 0}%
            </div>
          </div>
        </Space>
      </Card>

      {/* 任务列表 */}
      <div>
        <Title heading={6} style={{ margin: '0 0 16px 0' }}>
          进行中的任务
        </Title>

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

      <Title heading={6} style={{ margin: '0 0 16px 0' }}>
        设置
      </Title>

      {/* 倒计时设置 */}
      <TimerSettings />
    </div>
  );
};