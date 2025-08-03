// 倒计时时钟组件

import React, { useEffect, useState, useReducer } from 'react';
import { Typography, Progress, Card } from '@douyinfe/semi-ui';
import { Task } from '../types';
import { useErrorContext, useExecutionContext, useStorageContext } from '../contexts';
import { TimerControls } from '../components/TimerControls';
import { showConfirm } from '../components/modalUtils';
import { playCompleteSound } from '../utils';

const { Title, Text } = Typography;

// runTime reducer
const runTimeReducer = (state: number, action: { type: string; payload?: number }) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'SET':
      return action.payload || 0;
    case 'RESET':
      return 0;
    default:
      return state;
  }
};

interface TimerClockProps {
  task: Task;
  onBack: () => void;
}

export const TimerClock: React.FC<TimerClockProps> = ({ task, onBack }) => {
  const { userSettings, getTaskStorage, updateTaskStorage } = useStorageContext();
  const { addExecutionRecord } = useExecutionContext();
  const { setError } = useErrorContext();

  const [running, setRunning] = useState(false);
  const [runTime, dispatchRunTime] = useReducer(runTimeReducer, (getTaskStorage(task)?.accumulatedTime || 0) * 60);

  // 暴露的接口：runtime+1
  const incrementRunTime = () => {
    dispatchRunTime({ type: 'INCREMENT' });
  };

  // 页面初始化时自动开始倒计时
  useEffect(() => {
    setRunning(true);
  }, []); // 空依赖数组确保只在组件挂载时执行一次

  useEffect(() => {
    if (runTime % 60 === 0) {
      updateTaskStorage(task, runTime / 60);
    }

    if (runTime >= userSettings.timerDuration * 60) {
      console.log("One round complete, setting runtime to 0 from", runTime);
      handleComplete(runTime / 60);
    }
  }, [runTime]);

  const handleComplete = async (timeMinutes: number) => {
    playCompleteSound();

    try {
      await addExecutionRecord(task, timeMinutes);
      updateTaskStorage(task, 0);
      dispatchRunTime({ type: 'RESET' });
      setRunning(false);

      const confirmed = await showConfirm({
        title: '完成计时',
        content: '🎉 恭喜！您已完成本次专注时间。是否确认完成？',
        confirmText: '确认完成',
        confirmTheme: 'green',
        cancelText: '开始下一轮专注',
        cancelTheme: 'blue'
      });
      if (confirmed) {
        onBack();
      } else {
        setRunning(true);
      }
    } catch (error) {
      console.error('添加执行记录失败:', error);
      setError('添加执行记录失败');
    }
  }

  // 计算进度百分比
  const progressPercentage = userSettings.timerDuration > 0 ? Math.round((runTime / 60 / userSettings.timerDuration) * 100) : 0;

  // 格式化时间显示
  const formatTime = (remainingTime: number) => {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = Math.floor(remainingTime % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ padding: 16, textAlign: 'center' }}>
      <Title heading={4} style={{ margin: '0 0 24px 0' }}>
        番茄钟 - 专注时间
      </Title>

      <Card style={{ marginBottom: 24 }} bodyStyle={{ padding: 24 }}>
        <Title heading={5} style={{ margin: '0 0 16px 0' }}>
          {task.title.map(segment => segment.text).join('')}
        </Title>

        <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
          {task.taskType.text} · {task.quadrant.text}
        </Text>

        {/* 倒计时显示 */}
        <div style={{ marginBottom: 32 }}>
          <Title heading={1} style={{ margin: '0 0 16px 0', fontSize: 48, fontFamily: 'monospace' }}>
            {formatTime(Math.max(0, userSettings.timerDuration * 60 - runTime))}
          </Title>

          <Progress
            percent={progressPercentage}
            size="large"
            stroke={progressPercentage >= 100 ? '#52c41a' : '#1890ff'}
            style={{ marginBottom: 16 }}
          />

          <Text type="secondary">
            已完成 {Math.floor(runTime / 60)} / {userSettings.timerDuration} 分钟
          </Text>
        </div>

        {/* 计时器控制组件 */}
        <TimerControls
          runTime={runTime}
          running={running}
          setRunning={setRunning}
          incrementRunTime={incrementRunTime}
          onBack={onBack}
        />
      </Card>
    </div>
  );
};