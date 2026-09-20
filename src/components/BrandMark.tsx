import React from 'react';

interface BrandMarkProps {
  compact?: boolean;
  size?: number;
  className?: string;
}

export const BrandMark: React.FC<BrandMarkProps> = ({ compact = false, size = 32, className = '' }) => {
  const dimension = compact ? (size || 24) : (size || 32);

  return (
    <div
      className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-[#F28C52] to-[#D85A20] shadow-sm flex-shrink-0 text-white select-none ${className}`}
      style={{ width: dimension, height: dimension }}
    >
      <svg
        width={dimension * 0.65}
        height={dimension * 0.65}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 17l6-6-6-6" />
        <path d="M12 19h8" />
      </svg>
      <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#69D69E] ring-2 ring-[#0B0E14]" />
    </div>
  );
};
