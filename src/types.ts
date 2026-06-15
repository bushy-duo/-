export interface AppConfig {
  autoHide: boolean;
  waterIntervalMinutes: number;
  lastWaterAt: number;
  nextWaterAt: number;
  barPosition: 'bottom-left' | 'top-center' | 'top-right';
  opacity: number;
  enableAnimation: boolean;
  launchAtStartup: boolean;
  theme: 'frosted-dark' | 'glass-light' | 'midnight-synth';
}

export interface CodexUsage {
  fiveHourPercent: number;
  weeklyPercent: number;
  updatedAt: number;
  source: 'mock' | 'manual' | 'api';
}

export interface WaterHistory {
  id: string;
  time: number;
  amountMl?: number;
}
