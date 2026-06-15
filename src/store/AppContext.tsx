import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { AppConfig, CodexUsage, WaterHistory } from '../types';

interface AppContextType {
  // Config states (persisted)
  autoHide: boolean;
  waterIntervalMinutes: number;
  lastWaterAt: number;
  nextWaterAt: number;
  barPosition: 'bottom-left' | 'top-center' | 'top-right';
  opacity: number;
  theme: 'frosted-dark' | 'glass-light' | 'midnight-synth';
  codexFiveHourPercent: number;
  codexWeeklyPercent: number;
  waterHistory: WaterHistory[];
  desktopBackground: string;
  isTimerSpeedUp: boolean;

  // Setters (persisted updates)
  setAutoHide: (val: boolean) => void;
  setWaterIntervalMinutes: (val: number) => void;
  setBarPosition: (val: 'bottom-left' | 'top-center' | 'top-right') => void;
  setOpacity: (val: number) => void;
  setTheme: (val: 'frosted-dark' | 'glass-light' | 'midnight-synth') => void;
  setCodexFiveHourPercent: (val: number) => void;
  setCodexWeeklyPercent: (val: number) => void;
  setIsTimerSpeedUp: (val: boolean) => void;
  setDesktopBackground: (val: string) => void;

  // Runtime states
  isMouseNearTop: boolean;
  setIsMouseNearTop: (val: boolean) => void;
  displayMode: 'expanded' | 'collapsed' | 'reminding';
  progressPercent: number;
  secondsRemaining: number;
  isWaterDue: boolean;

  // Actions
  resetWaterTimer: () => void;
  triggerManualRemind: () => void;
  clearWaterHistory: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'codex_water_statusbar_cfg_v2';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Initial State from LocalStorage
  const [autoHide, setAutoHideState] = useState(true);
  const [waterIntervalMinutes, setWaterIntervalMinutesState] = useState(30);
  const [lastWaterAt, setLastWaterAtState] = useState(0);
  const [nextWaterAt, setNextWaterAtState] = useState(0);
  const [barPosition, setBarPositionState] = useState<'bottom-left' | 'top-center' | 'top-right'>('bottom-left');
  const [opacity, setOpacityState] = useState(0.95);
  const [theme, setThemeState] = useState<'frosted-dark' | 'glass-light' | 'midnight-synth'>('frosted-dark');
  const [codexFiveHourPercent, setCodexFiveHourPercentState] = useState(62);
  const [codexWeeklyPercent, setCodexWeeklyPercentState] = useState(41);
  const [waterHistory, setWaterHistoryState] = useState<WaterHistory[]>([]);
  const [desktopBackground, setDesktopBackgroundState] = useState('aurora');
  const [isTimerSpeedUp, setIsTimerSpeedUpState] = useState(false);

  // Runtime only states
  const [isMouseNearTop, setIsMouseNearTop] = useState(false);
  const [isManualDue, setIsManualDue] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(1800);
  const [isWaterDue, setIsWaterDue] = useState(false);

  // Load configs on mount
  useEffect(() => {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (typeof parsed.autoHide === 'boolean') setAutoHideState(parsed.autoHide);
        if (typeof parsed.waterIntervalMinutes === 'number') setWaterIntervalMinutesState(parsed.waterIntervalMinutes);
        if (typeof parsed.lastWaterAt === 'number') setLastWaterAtState(parsed.lastWaterAt);
        if (typeof parsed.nextWaterAt === 'number') setNextWaterAtState(parsed.nextWaterAt);
        if (parsed.barPosition) setBarPositionState(parsed.barPosition);
        if (typeof parsed.opacity === 'number') setOpacityState(parsed.opacity);
        if (parsed.theme) setThemeState(parsed.theme);
        if (typeof parsed.codexFiveHourPercent === 'number') setCodexFiveHourPercentState(parsed.codexFiveHourPercent);
        if (typeof parsed.codexWeeklyPercent === 'number') setCodexWeeklyPercentState(parsed.codexWeeklyPercent);
        if (Array.isArray(parsed.waterHistory)) setWaterHistoryState(parsed.waterHistory);
        if (parsed.desktopBackground) setDesktopBackgroundState(parsed.desktopBackground);
        if (typeof parsed.isTimerSpeedUp === 'boolean') setIsTimerSpeedUpState(parsed.isTimerSpeedUp);
      } else {
        // Defaults initialization
        const now = Date.now();
        const next = now + 30 * 60 * 1000;
        setLastWaterAtState(now);
        setNextWaterAtState(next);
      }
    } catch (e) {
      console.error('Error loading config from localStorage:', e);
    }
  }, []);

  // Save config helper
  const saveToStorage = (updates: Partial<any>) => {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_KEY);
      const current = data ? JSON.parse(data) : {};
      const merged = {
        autoHide,
        waterIntervalMinutes,
        lastWaterAt,
        nextWaterAt,
        barPosition,
        opacity,
        theme,
        codexFiveHourPercent,
        codexWeeklyPercent,
        waterHistory,
        desktopBackground,
        isTimerSpeedUp,
        ...updates
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
    } catch (e) {
      console.error('Error saving config to localStorage:', e);
    }
  };

  // State setters that persist
  const setAutoHide = (val: boolean) => {
    setAutoHideState(val);
    saveToStorage({ autoHide: val });
  };

  const setWaterIntervalMinutes = (val: number) => {
    setWaterIntervalMinutesState(val);
    // Restart timer with new interval
    const now = Date.now();
    const durationMs = isTimerSpeedUp ? val * 1000 : val * 60 * 1000;
    const next = now + durationMs;
    setLastWaterAtState(now);
    setNextWaterAtState(next);
    setIsManualDue(false);
    saveToStorage({ waterIntervalMinutes: val, lastWaterAt: now, nextWaterAt: next });
  };

  const setBarPosition = (val: 'bottom-left' | 'top-center' | 'top-right') => {
    setBarPositionState(val);
    saveToStorage({ barPosition: val });
  };

  const setOpacity = (val: number) => {
    setOpacityState(val);
    saveToStorage({ opacity: val });
  };

  const setTheme = (val: 'frosted-dark' | 'glass-light' | 'midnight-synth') => {
    setThemeState(val);
    saveToStorage({ theme: val });
  };

  const setCodexFiveHourPercent = (val: number) => {
    setCodexFiveHourPercentState(val);
    saveToStorage({ codexFiveHourPercent: val });
  };

  const setCodexWeeklyPercent = (val: number) => {
    setCodexWeeklyPercentState(val);
    saveToStorage({ codexWeeklyPercent: val });
  };

  const setIsTimerSpeedUp = (val: boolean) => {
    setIsTimerSpeedUpState(val);
    // Recalculate nextWaterAt with new speed mode
    const now = Date.now();
    const durationMs = val ? waterIntervalMinutes * 1000 : waterIntervalMinutes * 60 * 1000;
    const next = now + durationMs;
    setLastWaterAtState(now);
    setNextWaterAtState(next);
    setIsManualDue(false);
    saveToStorage({ isTimerSpeedUp: val, lastWaterAt: now, nextWaterAt: next });
  };

  const setDesktopBackground = (val: string) => {
    setDesktopBackgroundState(val);
    saveToStorage({ desktopBackground: val });
  };

  // Actions
  const resetWaterTimer = () => {
    const now = Date.now();
    const durationMs = isTimerSpeedUp ? waterIntervalMinutes * 1000 : waterIntervalMinutes * 60 * 1000;
    const next = now + durationMs;

    setLastWaterAtState(now);
    setNextWaterAtState(next);
    setIsManualDue(false);

    // Record logging
    const newRecord: WaterHistory = {
      id: Math.random().toString(36).substring(2, 9),
      time: now,
    };
    const updatedHistory = [newRecord, ...waterHistory].slice(0, 30); // limit to last 30 entries
    setWaterHistoryState(updatedHistory);

    saveToStorage({
      lastWaterAt: now,
      nextWaterAt: next,
      waterHistory: updatedHistory
    });
  };

  const triggerManualRemind = () => {
    setIsManualDue(true);
  };

  const clearWaterHistory = () => {
    setWaterHistoryState([]);
    saveToStorage({ waterHistory: [] });
  };

  // Timer Core logic
  useEffect(() => {
    const checkTimer = () => {
      if (lastWaterAt === 0 || nextWaterAt === 0) return;

      const now = Date.now();
      const total = nextWaterAt - lastWaterAt;
      const elapsed = now - lastWaterAt;

      let pct = 0;
      let remainingSec = 0;
      let due = false;

      if (isManualDue) {
        pct = 0;
        remainingSec = 0;
        due = true;
      } else {
        if (elapsed <= 0) {
          pct = 100;
          remainingSec = Math.round(total / 1000);
        } else if (elapsed >= total) {
          pct = 0;
          remainingSec = 0;
          due = true;
        } else {
          pct = ((total - elapsed) / total) * 105; // clamp or simple subtraction
          // let's clip it strictly between 0 and 100
          const calcPct = ((total - elapsed) / total) * 100;
          pct = Math.max(0, Math.min(100, calcPct));
          remainingSec = Math.round((nextWaterAt - now) / 1000);
        }
      }

      setProgressPercent(parseFloat(pct.toFixed(1)));
      setSecondsRemaining(remainingSec);
      setIsWaterDue(due);
    };

    // Calculate immediately
    checkTimer();

    // Set interval to check every 100ms for responsiveness
    const timer = setInterval(checkTimer, 100);
    return () => clearInterval(timer);
  }, [lastWaterAt, nextWaterAt, isTimerSpeedUp, isManualDue]);

  // Derived display state
  const isDueActive = isWaterDue || isManualDue;
  
  // Display Mode state machine
  // reminding: drinking alert is active (independent of autoHide / mouse position)
  // expanded: hover is active, or autoHide is false
  // collapsed: autoHide is true, mouse is not top, and timer is not due
  let displayMode: 'expanded' | 'collapsed' | 'reminding' = 'expanded';
  if (isDueActive) {
    displayMode = 'reminding';
  } else if (autoHide) {
    displayMode = isMouseNearTop ? 'expanded' : 'collapsed';
  } else {
    displayMode = 'expanded';
  }

  return (
    <AppContext.Provider
      value={{
        autoHide,
        waterIntervalMinutes,
        lastWaterAt,
        nextWaterAt,
        barPosition,
        opacity,
        theme,
        codexFiveHourPercent,
        codexWeeklyPercent,
        waterHistory,
        desktopBackground,
        isTimerSpeedUp,

        setAutoHide,
        setWaterIntervalMinutes,
        setBarPosition,
        setOpacity,
        setTheme,
        setCodexFiveHourPercent,
        setCodexWeeklyPercent,
        setIsTimerSpeedUp,
        setDesktopBackground,

        isMouseNearTop,
        setIsMouseNearTop,
        displayMode,
        progressPercent,
        secondsRemaining,
        isWaterDue: isDueActive,

        resetWaterTimer,
        triggerManualRemind,
        clearWaterHistory,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
