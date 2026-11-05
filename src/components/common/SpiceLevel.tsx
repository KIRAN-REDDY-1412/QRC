import React from 'react';
import { Flame } from 'lucide-react';

interface SpiceLevelProps {
  level: number; // 0 to 3
  className?: string;
}

export const SpiceLevel: React.FC<SpiceLevelProps> = ({ level, className = '' }) => {
  if (level <= 0) return null;

  return (
    <span 
      className={`inline-flex items-center gap-0.5 text-amber-600 ${className}`} 
      title={`Spice Level: ${level === 1 ? 'Mild' : level === 2 ? 'Medium' : 'Spicy'}`}
    >
      {Array.from({ length: level }).map((_, i) => (
        <Flame key={i} className="w-3.5 h-3.5 fill-current text-red-500" />
      ))}
    </span>
  );
};
