// 全局 AudioContext 实例
let audioContext: AudioContext | null = null;

export const playCompleteSound = async (): Promise<void> => {
  try {
    // 初始化 AudioContext（支持iOS）
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    // iOS需要在用户交互后恢复AudioContext
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    // 创建振荡器
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    // 连接节点
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // 设置音频参数
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime); // 800Hz 频率
    oscillator.type = 'sine'; // 正弦波

    // 设置音量包络
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    // 播放音频
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);

  } catch (error) {
    console.warn('播放完成音效失败:', error);
  }
};
