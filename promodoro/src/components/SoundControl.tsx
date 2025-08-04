// 声音控制组件

import React, { useContext } from 'react';
import { Button } from '@douyinfe/semi-ui';
import { IconVolume2, IconVolumnSilent } from '@douyinfe/semi-icons';
import { AudioDispatchContext } from '../contexts';

interface SoundControlProps {
  onSoundToggle?: (enabled: boolean) => void;
}

export const SoundControl: React.FC<SoundControlProps> = ({ onSoundToggle }) => {
  const audioDispatch = useContext(AudioDispatchContext);

  const handleToggleSound = () => {
    if (audioDispatch) {
      audioDispatch.toggleSound();
      onSoundToggle?.(audioDispatch.soundEnabled);
    }
  };

  if (!audioDispatch) {
    return null;
  }

  return (
    <Button
      icon={audioDispatch.soundEnabled ? <IconVolume2 /> : <IconVolumnSilent />}
      onClick={handleToggleSound}
      type="tertiary"
      size="large"
      theme="borderless"
    />
  );
};