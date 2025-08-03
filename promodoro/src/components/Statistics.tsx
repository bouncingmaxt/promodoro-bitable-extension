// 统计数据组件

import React from 'react';
import { Typography, Card, Space } from '@douyinfe/semi-ui';
import { useTaskContext, useExecutionContext } from '../contexts';
import { formatMinutes } from '../utils';

interface StatsProps {
}

export const Statistics: React.FC<StatsProps> = ({}) => {
  const { tasks } = useTaskContext();
  const { executionRecords, getTaskCompletedCount } = useExecutionContext();

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

  return (
    <div style={{ padding: 16 }}>
      <Card style={{ margin: '16px 0' }}>
        <Typography.Title heading={6} style={{ margin: '0 0 12px 0', textAlign: 'center' }}>任务统计</Typography.Title>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* 第一行：完成次数和完成率 */}
          <Space style={{ justifyContent: 'space-around', width: '100%' }}>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <Typography.Text type="secondary" size="small">完成次数</Typography.Text>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--semi-color-primary)' }}>
                {stats.totalCompleted}/{stats.totalTarget} 次
              </div>
            </div>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <Typography.Text type="secondary" size="small">完成率</Typography.Text>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--semi-color-success)' }}>
                {stats.totalTarget > 0 ? ((stats.totalCompleted / stats.totalTarget) * 100).toFixed(1) : 0}%
              </div>
            </div>
          </Space>
          
          {/* 第二行：完成时间和时间完成率 */}
          <Space style={{ justifyContent: 'space-around', width: '100%' }}>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <Typography.Text type="secondary" size="small">完成时间</Typography.Text>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--semi-color-primary)' }}>
                {formatMinutes(stats.totalCompletedTime)}/{formatMinutes(stats.totalTargetTime)}
              </div>
            </div>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <Typography.Text type="secondary" size="small">时间完成率</Typography.Text>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--semi-color-success)' }}>
                {stats.totalTargetTime > 0 ? ((stats.totalCompletedTime / stats.totalTargetTime) * 100).toFixed(1) : 0}%
              </div>
            </div>
          </Space>
        </div>
      </Card>
    </div>
  );
};