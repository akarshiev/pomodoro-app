import { useState, useEffect, useCallback, useRef } from 'react';

export type TimerMode = 'focus' | 'break';

interface PomodoroState {
  mode: TimerMode;
  timeRemaining: number;
  isRunning: boolean;
  currentPomodoro: number;
  totalPomodoros: number;
  todayFocusedTime: number;
  todayPomodoroCount: number;
}

const FOCUS_DURATION = 25 * 60; // 25 minutes
const BREAK_DURATION = 5 * 60; // 5 minutes
const POMODOROS_PER_SET = 4;

const getStorageKey = () => {
  const today = new Date().toISOString().split('T')[0];
  return `pomodoro_${today}`;
};

const loadTodayStats = () => {
  const key = getStorageKey();
  const saved = localStorage.getItem(key);
  if (saved) {
    return JSON.parse(saved);
  }
  return { focusedTime: 0, pomodoroCount: 0 };
};

const saveTodayStats = (focusedTime: number, pomodoroCount: number) => {
  const key = getStorageKey();
  localStorage.setItem(key, JSON.stringify({ focusedTime, pomodoroCount }));
};

export const usePomodoro = () => {
  const [state, setState] = useState<PomodoroState>(() => {
    const stats = loadTodayStats();
    return {
      mode: 'focus',
      timeRemaining: FOCUS_DURATION,
      isRunning: false,
      currentPomodoro: 1,
      totalPomodoros: POMODOROS_PER_SET,
      todayFocusedTime: stats.focusedTime,
      todayPomodoroCount: stats.pomodoroCount,
    };
  });

  const intervalRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(Date.now());

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const tick = useCallback(() => {
    const now = Date.now();
    const elapsed = Math.floor((now - lastTickRef.current) / 1000);
    lastTickRef.current = now;

    setState(prev => {
      if (!prev.isRunning) return prev;

      const newTimeRemaining = Math.max(0, prev.timeRemaining - elapsed);
      
      let newFocusedTime = prev.todayFocusedTime;
      if (prev.mode === 'focus') {
        newFocusedTime += elapsed;
        saveTodayStats(newFocusedTime, prev.todayPomodoroCount);
      }

      if (newTimeRemaining === 0) {
        if (prev.mode === 'focus') {
          const newPomodoroCount = prev.todayPomodoroCount + 1;
          saveTodayStats(newFocusedTime, newPomodoroCount);
          
          return {
            ...prev,
            mode: 'break',
            timeRemaining: BREAK_DURATION,
            isRunning: false,
            todayFocusedTime: newFocusedTime,
            todayPomodoroCount: newPomodoroCount,
          };
        } else {
          const nextPomodoro = prev.currentPomodoro >= POMODOROS_PER_SET ? 1 : prev.currentPomodoro + 1;
          return {
            ...prev,
            mode: 'focus',
            timeRemaining: FOCUS_DURATION,
            isRunning: false,
            currentPomodoro: nextPomodoro,
            todayFocusedTime: newFocusedTime,
          };
        }
      }

      return {
        ...prev,
        timeRemaining: newTimeRemaining,
        todayFocusedTime: newFocusedTime,
      };
    });
  }, []);

  useEffect(() => {
    if (state.isRunning) {
      lastTickRef.current = Date.now();
      intervalRef.current = window.setInterval(tick, 1000);
    } else {
      clearTimer();
    }

    return clearTimer;
  }, [state.isRunning, tick, clearTimer]);

  const toggleTimer = useCallback(() => {
    setState(prev => ({ ...prev, isRunning: !prev.isRunning }));
  }, []);

  const skipToBreak = useCallback(() => {
    setState(prev => ({
      ...prev,
      mode: 'break',
      timeRemaining: BREAK_DURATION,
      isRunning: false,
    }));
  }, []);

  const skipToFocus = useCallback(() => {
    setState(prev => {
      const nextPomodoro = prev.currentPomodoro >= POMODOROS_PER_SET ? 1 : prev.currentPomodoro + 1;
      return {
        ...prev,
        mode: 'focus',
        timeRemaining: FOCUS_DURATION,
        isRunning: false,
        currentPomodoro: nextPomodoro,
      };
    });
  }, []);

  const reset = useCallback(() => {
    setState(prev => ({
      ...prev,
      mode: 'focus',
      timeRemaining: FOCUS_DURATION,
      isRunning: false,
      currentPomodoro: 1,
    }));
  }, []);

  const progress = state.mode === 'focus' 
    ? 1 - (state.timeRemaining / FOCUS_DURATION)
    : 1 - (state.timeRemaining / BREAK_DURATION);

  return {
    ...state,
    progress,
    toggleTimer,
    skipToBreak,
    skipToFocus,
    reset,
    focusDuration: FOCUS_DURATION,
    breakDuration: BREAK_DURATION,
  };
};
