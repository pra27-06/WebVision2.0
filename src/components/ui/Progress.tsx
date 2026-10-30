import React from 'react';
import { cn } from '@/lib/utils';

export interface ProgressProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value?: number; // 0 to 100
  indicatorColor?: string;
}

export function Progress({
  className,
  value = 0,
  indicatorColor = 'bg-indigo-600',
  ...props
}: ProgressProps) {
  const clampedValue = Math.min(100, Math.max(0, value || 0));

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clampedValue}
      className={cn(
        'relative h-2.5 w-full overflow-hidden rounded-full bg-slate-100 border border-slate-200/50',
        className
      )}
      {...props}
    >
      <div
        className={cn('h-full w-full flex-1 transition-all duration-300 ease-in-out', indicatorColor)}
        style={{ transform: `translateX(-${100 - clampedValue}%)` }}
      />
    </div>
  );
}
