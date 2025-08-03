// 声音控制组件

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@douyinfe/semi-ui';
import { IconVolume2, IconVolume1 } from '@douyinfe/semi-icons';

interface SoundControlProps {
  onSoundToggle?: (enabled: boolean) => void;
}

export const SoundControl = React.forwardRef<SoundControlRef, SoundControlProps>(({ onSoundToggle }, ref) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // 监听soundEnabled状态变化，当开启时播放声音
    if (soundEnabled && audioRef.current) {
      audioRef.current.play().catch(console.error);
    }
  }, [soundEnabled]);

  const toggleSound = () => {
    const newSoundEnabled = !soundEnabled;
    setSoundEnabled(newSoundEnabled);
    onSoundToggle?.(newSoundEnabled);
  };

  // 暴露播放声音的方法
  const playSound = () => {
    setSoundEnabled(true);
  };

  // 将播放方法暴露给父组件
  React.useImperativeHandle(ref, () => ({
    playSound
  }));

  return (
    <>
      <audio
        ref={audioRef}
        src="/electronic-doorbell-262895.mp3"
        preload="auto"
        style={{ display: 'none' }}
      />
      <Button
        type="tertiary"
        size="large"
        icon={soundEnabled ? <IconVolume2 /> : <IconVolume1 />}
        onClick={toggleSound}
        style={{ color: soundEnabled ? '#1890ff' : '#999' }}
      >
        {soundEnabled ? '声音' : '静音'}
      </Button>
    </>
  );
});

// 导出ref类型
export interface SoundControlRef {
  playSound: () => void;
}