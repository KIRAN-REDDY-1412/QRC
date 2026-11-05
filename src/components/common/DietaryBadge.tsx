import React from 'react';
import { DietaryType } from '@/types';

interface DietaryBadgeProps {
  type: DietaryType;
  showLabel?: boolean;
  className?: string;
}

export const DietaryBadge: React.FC<DietaryBadgeProps> = ({ type, showLabel = false, className = '' }) => {
  switch (type) {
    case 'veg':
      return (
        <span className={`inline-flex items-center gap-1.5 ${className}`} title="Vegetarian (Green Dot)">
          <span className="badge-fssai-veg" />
          {showLabel && <span className="text-[11px] font-medium text-emerald-700 uppercase tracking-wider">Veg</span>}
        </span>
      );
    case 'non_veg':
      return (
        <span className={`inline-flex items-center gap-1.5 ${className}`} title="Non-Vegetarian (Red Triangle)">
          <span className="badge-fssai-nonveg" />
          {showLabel && <span className="text-[11px] font-medium text-red-700 uppercase tracking-wider">Non-Veg</span>}
        </span>
      );
    case 'egg':
      return (
        <span className={`inline-flex items-center gap-1.5 ${className}`} title="Contains Egg (Yellow Circle)">
          <span className="badge-fssai-egg" />
          {showLabel && <span className="text-[11px] font-medium text-amber-700 uppercase tracking-wider">Contains Egg</span>}
        </span>
      );
    case 'jain':
      return (
        <span className={`inline-flex items-center gap-1.5 ${className}`} title="Jain Friendly (No root vegetables)">
          <span className="badge-fssai-veg" />
          <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">JAIN</span>
        </span>
      );
    case 'vegan':
      return (
        <span className={`inline-flex items-center gap-1.5 ${className}`} title="100% Plant Based Vegan">
          <span className="badge-fssai-veg" />
          <span className="text-[10px] font-semibold text-green-800 bg-green-50 px-1.5 py-0.5 rounded border border-green-200">VEGAN</span>
        </span>
      );
    default:
      return null;
  }
};
