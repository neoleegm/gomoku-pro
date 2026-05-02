import { useCallback, useEffect, useRef, useState } from 'react';

type Tone = {
  frequency: number;
  start: number;
  duration: number;
  gain: number;
  type?: OscillatorType;
};

export function useGameAudio() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const getAudioContext = useCallback(() => {
    if (!soundEnabled) return null;
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    if (audioContextRef.current.state === 'suspended') {
      void audioContextRef.current.resume();
    }
    return audioContextRef.current;
  }, [soundEnabled]);

  const playTones = useCallback((tones: Tone[]) => {
    const audioContext = getAudioContext();
    if (!audioContext) return;

    const now = audioContext.currentTime;
    for (const tone of tones) {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();

      oscillator.type = tone.type ?? 'sine';
      oscillator.frequency.setValueAtTime(tone.frequency, now + tone.start);
      gain.gain.setValueAtTime(0.0001, now + tone.start);
      gain.gain.exponentialRampToValueAtTime(tone.gain, now + tone.start + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + tone.start + tone.duration);

      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start(now + tone.start);
      oscillator.stop(now + tone.start + tone.duration + 0.02);
    }
  }, [getAudioContext]);

  // Close AudioContext on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, []);

  const playMove = useCallback(() => {
    playTones([
      { frequency: 220, start: 0, duration: 0.045, gain: 0.045, type: 'triangle' },
      { frequency: 520, start: 0.006, duration: 0.055, gain: 0.018, type: 'sine' },
    ]);
  }, [playTones]);

  const playWin = useCallback(() => {
    playTones([
      { frequency: 392, start: 0, duration: 0.18, gain: 0.04 },
      { frequency: 494, start: 0.12, duration: 0.2, gain: 0.04 },
      { frequency: 659, start: 0.26, duration: 0.28, gain: 0.038 },
    ]);
  }, [playTones]);

  const playLoss = useCallback(() => {
    playTones([
      { frequency: 330, start: 0, duration: 0.22, gain: 0.035 },
      { frequency: 247, start: 0.16, duration: 0.24, gain: 0.034 },
      { frequency: 196, start: 0.34, duration: 0.3, gain: 0.032 },
    ]);
  }, [playTones]);

  return {
    soundEnabled,
    setSoundEnabled,
    playMove,
    playWin,
    playLoss,
  };
}
