import React from 'react';
import { useApp } from '../store/AppContext';

export const CodexUsage: React.FC = () => {
  const { codexFiveHourPercent, codexWeeklyPercent, barPosition } = useApp();

  const isBottomLeft = barPosition === 'bottom-left';
  const tooltipClass = isBottomLeft
    ? "absolute -top-14 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-all duration-200 origin-bottom bg-zinc-900 border border-zinc-700/50 text-[10px] text-zinc-300 px-2.5 py-1.5 rounded shadow-xl whitespace-nowrap z-50"
    : "absolute -bottom-14 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-all duration-200 origin-top bg-zinc-900 border border-zinc-700/50 text-[10px] text-zinc-300 px-2.5 py-1.5 rounded shadow-xl whitespace-nowrap z-50";

  return (
    <div className="flex items-center gap-3.5" id="codex-usage-wrap">
      {/* Platform Title */}
      <span className="font-display font-bold text-[12px] tracking-wide text-zinc-300">
        Codex
      </span>

      {/* 5-Hour Limit Block */}
      <div className="flex flex-col gap-0.5 justify-center group relative cursor-help">
        <div className="flex items-center justify-between text-[10px] text-zinc-400 font-sans tracking-tight leading-3">
          <span>5小时:</span>
          <span className="text-cyan-400 font-mono font-medium ml-1">
            {codexFiveHourPercent}%
          </span>
        </div>
        <div className="w-[58px] h-1.5 bg-zinc-800 rounded-full overflow-hidden border border-zinc-700/20">
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 rounded-full transition-all duration-500"
            style={{ width: `${codexFiveHourPercent}%` }}
          />
        </div>
        {/* Hover info tooltip */}
        <span className={tooltipClass}>
          <p className="font-semibold text-cyan-400">5小时额度</p>
          <p className="text-[9px] text-zinc-400">已使用: {codexFiveHourPercent}% | 剩余: {100 - codexFiveHourPercent}%</p>
        </span>
      </div>

      {/* Weekly Limit Block */}
      <div className="flex flex-col gap-0.5 justify-center group relative cursor-help">
        <div className="flex items-center justify-between text-[10px] text-zinc-400 font-sans tracking-tight leading-3">
          <span>每周:</span>
          <span className="text-emerald-400 font-mono font-medium ml-1">
            {codexWeeklyPercent}%
          </span>
        </div>
        <div className="w-[58px] h-1.5 bg-zinc-800 rounded-full overflow-hidden border border-zinc-700/20">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
            style={{ width: `${codexWeeklyPercent}%` }}
          />
        </div>
        {/* Hover info tooltip */}
        <span className={tooltipClass}>
          <p className="font-semibold text-emerald-400">每周累计额度</p>
          <p className="text-[9px] text-zinc-400">已使用: {codexWeeklyPercent}% | 剩余: {100 - codexWeeklyPercent}%</p>
        </span>
      </div>
    </div>
  );
};
