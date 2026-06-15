import React from 'react';
import { useApp } from '../store/AppContext';
import { Droplet } from 'lucide-react';

export const WaterReminder: React.FC = () => {
  const { 
    progressPercent, 
    isWaterDue, 
    resetWaterTimer, 
    secondsRemaining, 
    waterIntervalMinutes,
    barPosition
  } = useApp();

  // Dryness factor goes from 0 (at 100% progress, full) to 1 (at 0% progress, empty)
  const dryness = Math.max(0, Math.min(100, 100 - progressPercent)) / 100;
  const factor = dryness * dryness; // quadratic base for animation amplitude

  // Calculate dynamic pulse parameters
  const maxScale = isWaterDue ? 1.2 : 1.15;
  const maxShadow = isWaterDue ? 12 : 8;

  const currentScale = 1 + (maxScale - 1) * factor;
  const currentShadow = `${maxShadow * factor}px`;

  // Format time remaining for human output (MM:SS)
  const formatTime = (secs: number) => {
    if (secs <= 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-2.5" id="water-reminder-wrap">
      {/* Interactive Water Droplet Button with dynamic pulse amplitude scaling */}
      <button
        id="btn-drink-reset"
        onClick={resetWaterTimer}
        className={`relative flex items-center justify-center w-6 h-6 rounded-full border transition-all duration-300 focus:outline-none ${
          isWaterDue
            ? 'bg-rose-500/20 border-rose-500 text-rose-400 cursor-pointer hover:bg-rose-500/30 shadow-[0_0_12px_rgba(244,63,94,0.4)] animate-water-pulse-due'
            : 'bg-indigo-500/10 border-indigo-500/30 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 cursor-pointer animate-water-pulse'
        }`}
        style={{
          '--pulse-scale': currentScale,
          '--pulse-shadow': currentShadow,
        } as React.CSSProperties}
        title="点击以确认喝水，重置30分钟提醒计时器"
      >
        <Droplet className={`w-3.5 h-3.5 transition-transform ${isWaterDue ? 'scale-110 fill-rose-400' : 'fill-cyan-400/20'}`} />
        
        {/* Ring ripple on normal/due - opacity decreases/disappears scale quadratically */}
        <span 
          className={`absolute inset-0 rounded-full border border-current animate-ping ${isWaterDue ? 'hidden' : 'hidden md:inline'}`} 
          style={{ opacity: 0.35 * factor }}
        />
      </button>

      {/* Progress Track and Tooltip */}
      <div className="flex flex-col justify-center group relative cursor-help">
        <div className="flex items-center justify-between text-[10px] text-zinc-400 font-sans tracking-tight leading-3 mb-0.5">
          <span className={isWaterDue ? 'text-rose-400 font-medium animate-pulse' : 'text-zinc-500'}>
            {isWaterDue ? '是时候喝水啦！' : '水分摄入倒计时'}
          </span>
          <span className={`font-mono text-[10px] ml-4 ${isWaterDue ? 'text-rose-400 font-bold' : 'text-indigo-300'}`}>
            {formatTime(secondsRemaining)}
          </span>
        </div>

        {/* Progress Bar with Static Blue-Purple-Red Gradient Backdrop */}
        <div className="w-[124px] h-2 bg-zinc-950/80 rounded-full overflow-hidden border border-white/5 relative">
          <div 
            className="h-full rounded-full overflow-hidden transition-[width] duration-350 ease-out absolute right-0 top-0"
            style={{ width: `${progressPercent}%` }}
          >
            {/* Inner div has fixed width of 124px to lock the gradient start and end coordinates */}
            <div 
              className={`h-full absolute right-0 top-0 transition-all duration-300 ${
                isWaterDue 
                  ? 'bg-gradient-to-r from-red-500 to-rose-600 shadow-[0_0_8px_rgba(239,68,68,0.7)] animate-pulse' 
                  : 'bg-gradient-to-r from-sky-400 via-indigo-500 to-rose-500'
              }`}
              style={{ width: '124px', minWidth: '124px' }}
            />
          </div>
        </div>

        {/* Floating Tooltip */}
        <span className={`${
          barPosition === 'bottom-left'
            ? 'absolute -top-14 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-all duration-200 origin-bottom'
            : 'absolute -bottom-14 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-all duration-200 origin-top'
        } bg-zinc-900 border border-zinc-700/50 text-[10px] text-zinc-300 px-2.5 py-1.5 rounded shadow-xl whitespace-nowrap z-50`}>
          <p className="font-semibold text-sky-400">喝水提醒进度</p>
          <p className="text-[9px] text-zinc-400">
            间隔: {waterIntervalMinutes}分钟 | 进度: {progressPercent}%
          </p>
        </span>
      </div>
    </div>
  );
};
