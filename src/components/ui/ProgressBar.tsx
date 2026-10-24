import { useEffect, useState } from 'react';

interface ProgressBarProps {
  percentage: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success' | 'warning';
  showLabel?: boolean;
  animated?: boolean;
}

function ProgressBar({
  percentage,
  size = 'md',
  color = 'primary',
  showLabel = false,
  animated = true,
}: ProgressBarProps) {
  const safePercentage = Math.min(100, Math.max(0, percentage));
  const [displayPercentage, setDisplayPercentage] = useState(animated ? 0 : safePercentage);

  useEffect(() => {
    if (animated) {
      const timer = requestAnimationFrame(() => {
        setDisplayPercentage(safePercentage);
      });
      return () => cancelAnimationFrame(timer);
    } else {
      setDisplayPercentage(safePercentage);
    }
  }, [safePercentage, animated]);

  const heights = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  const colors = {
    primary: 'bg-primary-500',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
  };

  return (
    <div className="w-full">
      <div className={`w-full bg-surface-200 rounded-full ${heights[size]} overflow-hidden`}>
        <div
          className={`${heights[size]} ${colors[color]} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${displayPercentage}%` }}
          role="progressbar"
          aria-valuenow={safePercentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      {showLabel && (
        <p className="text-sm text-gray-500 mt-1">{safePercentage}%</p>
      )}
    </div>
  );
}

export default ProgressBar;
