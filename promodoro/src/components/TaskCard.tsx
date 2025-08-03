// 任务卡片组件

import React from 'react';
import { Card, Button, Typography, Space, Tag } from '@douyinfe/semi-ui';
import { Task } from '../types';
import { useExecutionContext, useStorageContext } from '../contexts';

interface TaskCardProps {
  task: Task;
  onStart: (taskId: string) => void;
}

const { Text, Title } = Typography;

export const TaskCard: React.FC<TaskCardProps> = ({ task, onStart }) => {
  const { getTaskCompletedCount } = useExecutionContext();
  const { userSettings } = useStorageContext();

  const completedCount = getTaskCompletedCount(task);
  const progress = getTaskCompletedCount(task) / task.count * 100;
  const completedTime = completedCount * userSettings.timerDuration;
  const totalTime = task.count * userSettings.timerDuration;

  return (
    <Card
      style={{ marginBottom: 16 }}
      bodyStyle={{ padding: 16 }}
      shadows='hover'
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <Title heading={5} style={{ margin: '0 0 8px 0' }}>
            {task.title.map(segment => segment.text).join('')}
          </Title>

          <Space wrap style={{ marginBottom: 12 }}>
            <Tag color="blue">{task.taskType.text}</Tag>
            <Tag color="green">{task.quadrant.text}</Tag>
          </Space>

          <div style={{ marginBottom: 8 }}>
            <Text type="secondary">
              进度: {completedCount}/{task.count} 次 ({progress.toFixed(2)}%)
            </Text>
          </div>

          <div>
            <Text type="secondary">
              时间: {completedTime}分钟/{totalTime}分钟
            </Text>
          </div>
        </div>

        <Button
          type="primary"
          onClick={() => onStart(task.id)}
          style={{ marginLeft: 16 }}
        >
          开始
        </Button>
      </div>
    </Card>
  );
};