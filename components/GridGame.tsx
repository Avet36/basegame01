import React from 'react';
import { Prize } from '../types';

interface GridGameProps {
  prizes: Prize[];
  activeIndex: number | null;
  isSpinning: boolean;
}

const GridGame: React.FC<GridGameProps> = ({ prizes, activeIndex, isSpinning }) => {
  return (
    <div className="w-full max-w-sm aspect-square p-3">
      <div className="grid grid-cols-3 grid-rows-3 gap-3 md:gap-4 w-full h-full perspective-1000">
        {prizes.map((prize, index) => {
          const isActive = activeIndex === index;
          
          return (
            <div
              key={prize.id}
              className={`
                relative rounded-2xl flex items-center justify-center p-2 text-center transform-gpu transition-all duration-[80ms] ease-out
                ${isActive 
                  ? 'z-20 scale-110 ring-4 ring-white shadow-[0_0_40px_rgba(255,255,255,0.7)] brightness-110' 
                  : 'z-0 scale-100 opacity-90 brightness-90 shadow-lg'}
              `}
              style={{
                backgroundColor: isActive ? '#ffffff' : prize.color,
                boxShadow: isActive 
                  ? '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)'
                  : '0 4px 6px -1px rgba(0, 0, 0, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.2)',
                // Slight rotation for random feel if needed, but keeping it clean for grid
              }}
            >
               {/* Inner Gloss/Highlight */}
               <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/30 to-black/10 pointer-events-none" />

               {/* Flash Effect Overlay */}
               {isActive && (
                 <div className="absolute inset-0 rounded-2xl bg-white animate-fade-in opacity-50 pointer-events-none" />
               )}

               <span 
                 className={`
                   relative z-10 font-black uppercase tracking-wide leading-none break-words
                   transition-transform duration-75
                   ${isActive ? 'scale-110' : ''}
                 `}
                 style={{ 
                   color: isActive ? prize.color : prize.textColor,
                   fontSize: 'clamp(0.9rem, 4.5vw, 1.35rem)', // Significantly larger, responsive text
                   textShadow: isActive ? 'none' : '0 2px 4px rgba(0,0,0,0.6)'
                 }}
               >
                 {prize.text}
               </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GridGame;