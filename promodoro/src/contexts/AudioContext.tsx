import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import config from '../config.json';

// 扩展Window接口以支持webkitAudioContext
declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

// 定义AudioContext类型
interface AudioContextType {
  audioContext: AudioContext | null;
}

// 定义AudioDispatch类型
interface AudioDispatchType {
  toggleSound: () => void;
  playSoundIfEnabled: () => void;
  soundEnabled: boolean;
}

// 定义AudioProvider props类型
interface AudioProviderProps {
  children: ReactNode;
}

export const AudioContext = createContext<AudioContextType | null>(null);
export const AudioDispatchContext = createContext<AudioDispatchType | null>(null);

export function AudioProvider({ children }: AudioProviderProps) {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [soundState, setSoundState] = useState({ prev: false, current: true });

  // Initialize AudioContext on mount
  useEffect(() => {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      const ctx = new AudioCtx();
      setAudioContext(ctx);

      // Add a global listener to resume context on user interaction
      // This is a common pattern for mobile browsers
      const resumeContext = () => {
        if (ctx.state === 'suspended') {
          ctx.resume().then(() => {
            console.log('AudioContext resumed!');
            document.removeEventListener('click', resumeContext);
            document.removeEventListener('touchend', resumeContext);
          });
        }
      };

      document.addEventListener('click', resumeContext);
      document.addEventListener('touchend', resumeContext);

      return () => {
        // Cleanup: close the audio context when component unmounts
        // Or if you only want one for the whole app, this might be handled globally
        if (ctx.state !== 'closed') {
          ctx.close().then(() => console.log('AudioContext closed.'));
        }
        document.removeEventListener('click', resumeContext);
        document.removeEventListener('touchend', resumeContext);
      };
    } else {
      console.error('Web Audio API not supported in this browser.');
    }
  }, []);

  // Function to play a beep sound using oscillator
  const playBeep = useCallback((): OscillatorNode | undefined => {
    if (!audioContext || audioContext.state === 'suspended') {
      console.warn('AudioContext is suspended or not ready. Click/touch to activate.');
      return;
    }

    const { duration, frequency, volume } = config.Sound;

    try {
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

      return oscillator;
    } catch (error) {
      console.warn('Error playing beep sound:', error);
    }
  }, [audioContext]);

  // 切换声音状态
  const toggleSound = useCallback(() => {
    const newSoundEnabled = !soundState.current;
    setSoundState({ prev: soundState.current, current: newSoundEnabled });
  }, [soundState]);

  // 如果声音启用则播放蜂鸣音
  const playSoundIfEnabled = useCallback(() => {
    if (soundState.current) {
      playBeep();
    }
  }, [soundState.current, playBeep]);

  // 监听声音状态变化，从false变为true时播放声音
  useEffect(() => {
    if (soundState.prev === false && soundState.current === true) {
      playBeep();
    }
  }, [soundState, playBeep]);

  const dispatch: AudioDispatchType = { 
    toggleSound, 
    playSoundIfEnabled,
    soundEnabled: soundState.current
  };

  return (
    <AudioContext.Provider value={{ audioContext }}>
      <AudioDispatchContext.Provider value={dispatch}>
        {children}
      </AudioDispatchContext.Provider>
    </AudioContext.Provider>
  );
}
