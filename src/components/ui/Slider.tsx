import React from 'react';
import { cn } from '@/lib/utils';

export interface SliderProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onValueChange?: (val: number) => void;
}

export function Slider({
  className,
  value,
  min = 0,
  max = 1000000,
  step = 10000,
  onValueChange,
  onChange,
  ...props
}: SliderProps) {
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(e);
    if (onValueChange) onValueChange(Number(e.target.value));
  };

  return (
    <div className={cn('relative flex w-full touch-none select-none items-center py-2', className)}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        style={{
          background: `linear-gradient(to right, #4f46e5 0%, #4f46e5 ${percentage}%, #e2e8f0 ${percentage}%, #e2e8f0 100%)`,
        }}
        className="h-2.5 w-full cursor-pointer appearance-none rounded-lg accent-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
        {...props}
      />
    </div>
  );
}
