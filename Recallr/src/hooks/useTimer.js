import { useState, useEffect, useCallback } from 'react';

export function useTimer(initialTime, onTimeUp) {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval=null;

    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((time) => {
          if (time <= 1) {
            setIsActive(false);
            onTimeUp();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else if (timeRemaining === 0) {
      onTimeUp();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeRemaining, onTimeUp]);

  const startTimer = useCallback(() => setIsActive(true), []);
  const pauseTimer = useCallback(() => setIsActive(false), []);
  const resetTimer = useCallback((newTime) => {
    setIsActive(false);
    if (newTime !== undefined) {
      setTimeRemaining(newTime);
    } else {
      setTimeRemaining(initialTime);
    }
  }, [initialTime]);

  const formatTime = useCallback((seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  return {
    timeRemaining,
    isActive,
    startTimer,
    pauseTimer,
    resetTimer,
    formatTime: formatTime(timeRemaining)
  };
}