import React from 'react';
import { Prize } from '../types';

interface WheelProps {
  prizes: Prize[];
  rotation: number;
  onTransitionEnd: () => void;
  size?: number;
}

const Wheel: React.FC<WheelProps> = ({ prizes, rotation, onTransitionEnd, size = 320 }) => {
  const radius = size / 2;
  const totalPrizes = prizes.length;
  const segmentAngle = 360 / totalPrizes;

  // Calculate SVG path for a slice
  const getSectorPath = (index: number) => {
    const startAngle = index * segmentAngle;
    const endAngle = (index + 1) * segmentAngle;

    // Convert degrees to radians, subtracting 90deg to start from 12 o'clock
    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);

    const x1 = radius + radius * Math.cos(startRad);
    const y1 = radius + radius * Math.sin(startRad);
    const x2 = radius + radius * Math.cos(endRad);
    const y2 = radius + radius * Math.sin(endRad);

    return `M${radius},${radius} L${x1},${y1} A${radius},${radius} 0 0,1 ${x2},${y2} Z`;
  };

  return (
    <div className="relative flex justify-center items-center py-8">
      {/* Pointer/Indicator */}
      <div className="absolute top-0 z-20 w-8 h-12 bg-white clip-arrow-down transform translate-y-[-10px] shadow-md" 
           style={{ clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)' }}>
      </div>

      {/* The Wheel */}
      <div
        className="rounded-full shadow-2xl border-4 border-gray-800 overflow-hidden relative box-content"
        style={{
          width: size,
          height: size,
          transform: `rotate(${rotation}deg)`,
          transition: rotation === 0 ? 'none' : 'transform 4s cubic-bezier(0.2, 0.8, 0.3, 1)',
        }}
        onTransitionEnd={onTransitionEnd}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          {prizes.map((prize, index) => {
            const angle = index * segmentAngle + segmentAngle / 2;
            
            return (
              <g key={prize.id}>
                {/* Slice Background */}
                <path
                  d={getSectorPath(index)}
                  fill={prize.color}
                  stroke="#1a1a2e"
                  strokeWidth="2"
                />
                
                {/* Text Label */}
                <text
                  x={radius + radius * 0.65 * Math.cos((angle - 90) * Math.PI / 180)}
                  y={radius + radius * 0.65 * Math.sin((angle - 90) * Math.PI / 180)}
                  fill={prize.textColor}
                  fontSize={size * 0.05}
                  fontWeight="bold"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  transform={`rotate(${angle + 90}, ${radius + radius * 0.65 * Math.cos((angle - 90) * Math.PI / 180)}, ${radius + radius * 0.65 * Math.sin((angle - 90) * Math.PI / 180)})`}
                >
                  {prize.text.length > 15 ? prize.text.substring(0, 15) + '...' : prize.text}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      
      {/* Center Cap */}
      <div className="absolute z-10 w-12 h-12 bg-gray-800 rounded-full border-4 border-white flex items-center justify-center">
        <div className="w-4 h-4 bg-white rounded-full" />
      </div>
    </div>
  );
};

export default Wheel;