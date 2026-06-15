import React from 'react';
import { useApp } from '../store/AppContext';
import { CodexUsage } from './CodexUsage';
import { WaterReminder } from './WaterReminder';
import { MiniProgressBar } from './MiniProgressBar';

export const StatusBar: React.FC = () => {
  const { 
    displayMode, 
    barPosition, 
    opacity, 
    theme,
    setIsMouseNearTop
  } = useApp();

  // Helper to resolve theme styles
  const getThemeClass = () => {
    switch (theme) {
      case 'glass-light':
        return 'bg-white/70 text-zinc-800 border-zinc-200/50 shadow-[0_8px_24px_rgba(0,0,0,0.08)] backdrop-blur-md';
      case 'midnight-synth':
        return 'bg-fuchsia-950/40 text-rose-100 border-pink-500/20 shadow-[0_8px_24px_rgba(236,72,153,0.15)] backdrop-blur-lg';
      case 'frosted-dark':
      default:
        return 'bg-zinc-950/45 text-white border-zinc-700/35 shadow-[0_8px_24px_rgba(0,0,0,0.3)] backdrop-blur-xl';
    }
  };

  // Check if active or hidden
  const isCollapsed = displayMode === 'collapsed';
  const isReminding = displayMode === 'reminding';

  // Absolute Position style
  let positionClass = 'left-1/2 top-0 mt-3 -translate-x-1/2';
  let collapseTranslateClass = isCollapsed 
    ? 'opacity-0 scale-95 pointer-events-none -translate-y-12' 
    : 'opacity-100 scale-100 pointer-events-auto';
  let originClass = 'origin-top';

  if (barPosition === 'top-right') {
    positionClass = 'right-12 top-0 mt-3 translate-x-0';
    collapseTranslateClass = isCollapsed 
      ? 'opacity-0 scale-95 pointer-events-none -translate-y-12' 
      : 'opacity-100 scale-100 pointer-events-auto';
    originClass = 'origin-top';
  } else if (barPosition === 'bottom-left') {
    positionClass = 'left-6 bottom-4 mb-2 translate-x-0';
    collapseTranslateClass = isCollapsed 
      ? 'opacity-0 scale-95 pointer-events-none translate-y-12' 
      : 'opacity-100 scale-100 pointer-events-auto';
    originClass = 'origin-bottom';
  }

  return (
    <>
      {/* If collapsed, show the micro-mini border top progress bar */}
      {isCollapsed && <MiniProgressBar />}

      {/* Floating capsule status bar */}
      <div 
        id="floating-capsule-statusbar"
        className={`absolute z-[100] flex items-center gap-3 px-3.5 py-1.5 rounded-full border transition-all duration-500 ${originClass} select-none ${positionClass} ${getThemeClass()} ${collapseTranslateClass} ${
          isReminding 
            ? 'animate-border-glow-due border-rose-500/80 ring-2 ring-rose-500/10' 
            : ''
        }`}
        style={{ opacity: isCollapsed ? 0 : opacity }}
        onMouseEnter={() => setIsMouseNearTop(true)}
        onMouseLeave={() => setIsMouseNearTop(false)}
      >
        {/* Glow halo when reminding */}
        {isReminding && (
          <div className="absolute inset-0 -z-10 rounded-full blur-xl bg-rose-500/10 animate-pulse pointer-events-none" />
        )}

        {/* Content segments */}
        <CodexUsage />
        
        {/* Separator stick */}
        <div className={`w-[1px] h-5 self-center ${
          theme === 'glass-light' ? 'bg-zinc-300' : 'bg-zinc-800'
        }`} />

        <WaterReminder />
      </div>
    </>
  );
};
