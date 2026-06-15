import React from 'react';
import { useApp } from '../store/AppContext';

export const MiniProgressBar: React.FC = () => {
  const { progressPercent, isWaterDue, barPosition } = useApp();

  const isBottomLeft = barPosition === 'bottom-left';

  // Config container alignment classes
  const containerClass = isBottomLeft
    ? "absolute bottom-0 left-6 w-[200px] h-1 bg-zinc-805/40 backdrop-blur-sm rounded-t-md overflow-hidden transition-all duration-300 pointer-events-none"
    : "absolute top-0 left-1/2 -translate-x-1/2 w-[45%] h-1 bg-zinc-800/20 backdrop-blur-sm rounded-b-md overflow-hidden transition-all duration-305 pointer-events-none";

  const roundedClass = isBottomLeft ? "rounded-t-md" : "rounded-b-md";
  const fixedWidth = isBottomLeft ? '200px' : '350px';

  return (
    <div 
      id="mini-progress-bar-container"
      className={containerClass}
    >
      <div 
        className="h-full overflow-hidden transition-all duration-300 absolute right-0 top-0"
        style={{ width: `${progressPercent}%` }}
      >
        {/* Fixed gradient inside the clip wrapper so gradient points do not move as it drains/fills */}
        <div 
          className={`h-full absolute right-0 top-0 ${roundedClass} ${
            isWaterDue 
              ? 'bg-gradient-to-r from-red-500 via-rose-500 to-red-600 shadow-[0_1px_6px_rgba(239,68,68,0.5)] animate-pulse' 
              : 'bg-gradient-to-r from-cyan-400 via-indigo-505 to-rose-500'
          }`}
          style={{ width: fixedWidth, minWidth: fixedWidth }}
        />
      </div>
    </div>
  );
};
