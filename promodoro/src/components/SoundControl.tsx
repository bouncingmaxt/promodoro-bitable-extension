// 声音控制组件

import React, { useState, useEffect } from 'react';
import { Button } from '@douyinfe/semi-ui';
import { IconVolume2, IconVolume1 } from '@douyinfe/semi-icons';

interface SoundControlProps {
  onSoundToggle?: (enabled: boolean) => void;
}

export const SoundControl = React.forwardRef<SoundControlRef, SoundControlProps>(({ onSoundToggle }, ref) => {
  const [soundEnabled, setSoundEnabled] = useState(true);

  // 使用Web Audio API播放蜂鸣音
  const playBeep = (duration = 800, frequency = 440, volume = 0.3) => {
    try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = 'sine'; // 使用正弦波产生柔和音调
        
        // 创建柔和的音量包络，使声音渐入渐出更平滑
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.05); // 更慢的渐入
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration / 1000 - 0.1); // 更长的渐出

        oscillator.start();
        oscillator.stop(audioContext.currentTime + duration / 1000);
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  };

  useEffect(() => {
    // 监听soundEnabled状态变化，当开启时播放声音
    if (soundEnabled) {
      playBeep();
    }
  }, [soundEnabled]);

  const toggleSound = () => {
    const newSoundEnabled = !soundEnabled;
    setSoundEnabled(newSoundEnabled);
    onSoundToggle?.(newSoundEnabled);
  };

  // 暴露播放声音的方法
  const playSound = () => {
    if (soundEnabled) {
      playBeep();
    }
  };

  // 将播放方法暴露给父组件
  React.useImperativeHandle(ref, () => ({
    playSound
  }));

  return (
    <Button
      type="tertiary"
      size="large"
      icon={soundEnabled ? <IconVolume2 /> : <IconVolume1 />}
      onClick={toggleSound}
      style={{ color: soundEnabled ? '#1890ff' : '#999' }}
    >
      {soundEnabled ? '声音' : '静音'}
    </Button>
  );
});

// 导出ref类型
export interface SoundControlRef {
  playSound: () => void;
}