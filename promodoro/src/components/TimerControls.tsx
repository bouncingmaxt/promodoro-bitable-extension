// 计时器控制按钮组件

import React, { useRef, useEffect } from 'react';
import { Button, Space } from '@douyinfe/semi-ui';
import { IconPlay, IconPause, IconStop } from '@douyinfe/semi-icons';
import { useStorageContext } from '../contexts';
import { showConfirm } from '../components/modalUtils';
import { SoundControl } from './SoundControl';

interface TimerControlsProps {
  runTime: number;
  running: boolean;
  setRunning: (running: boolean) => void;
  incrementRunTime: () => void;
  onBack: () => void;
}

export const TimerControls: React.FC<TimerControlsProps> = ({ runTime, running, setRunning, incrementRunTime, onBack }) => {
  const { userSettings } = useStorageContext();

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 监听running状态变化，开始或停止计时
  useEffect(() => {
    if (running) {
      if (intervalRef.current) return; // 防止重复启动
      intervalRef.current = setInterval(handleTick, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [running]);

  // 组件卸载时清理计时器
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleTick = async () => {
    incrementRunTime();
  }

  // 启动计时器
  const startTimer = () => {
    setRunning(true);
  };

  // 暂停计时器
  const pauseTimer = () => {
    setRunning(false);
  };

  // 停止计时器
  const stopTimer = async () => {
    console.log("Terminating clock", runTime);
    setRunning(false);
    const confirmed = await showConfirm({
      title: '停止计时',
      content: '确定要停止当前的计时吗？1分钟内的进度将不会被保存。',
      confirmText: '确定停止',
      confirmTheme: 'red',
      cancelText: '继续计时',
      cancelTheme: 'blue'
    });

    if (confirmed) {
      setRunning(false);
      onBack();
    } else {
      setRunning(true);
    }
  };

  return (
    <Space spacing={24}>
      {/* 控制按钮 */}
      {!running ? (
        <Button
          type="primary"
          size="large"
          icon={<IconPlay />}
          onClick={startTimer}
          disabled={runTime / 60 >= userSettings.timerDuration}
        >
          {runTime > 0 ? '继续' : '开始'}
        </Button>
      ) : (
        <Button
          type="secondary"
          size="large"
          icon={<IconPause />}
          onClick={pauseTimer}
        >
          暂停
        </Button>
      )}

      <SoundControl />

      <Button
        type="tertiary"
        size="large"
        icon={<IconStop />}
        onClick={stopTimer}
        style={{ color: '#ff4d4f' }}
      >
        停止
      </Button>
    </Space>
  );
};