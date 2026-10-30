'use client';

import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/context/AppContext';
import { useIsMounted } from '@/lib/useIsMounted';

interface DeadlineCountdownProps {
  daysRemaining: number;
}

export function DeadlineCountdown({ daysRemaining }: DeadlineCountdownProps) {
  const { t } = useApp();
  const mounted = useIsMounted();
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({
    days: daysRemaining,
    hours: 14,
    minutes: 32,
    seconds: 45,
  });

  useEffect(() => {
    // Calculate a consistent target time based on daysRemaining
    const targetTimestamp = Date.now() + daysRemaining * 24 * 60 * 60 * 1000 - 3 * 60 * 60 * 1000;

    const updateTimer = () => {
      const diff = Math.max(0, targetTimestamp - Date.now());
      const d = Math.floor(diff / (24 * 60 * 60 * 1000));
      const h = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
      const m = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
      const s = Math.floor((diff % (60 * 1000)) / 1000);

      setTimeLeft({ days: d, hours: h, minutes: m, seconds: s });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [daysRemaining]);

  if (!mounted) {
    return (
      <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium">
        <Clock className="w-3.5 h-3.5 text-slate-400" />
        <span>{t('deadlineLabel')}: {daysRemaining} days</span>
      </div>
    );
  }

  // Color logic: amber under 7 days, rose under 3 days
  const isUrgent = daysRemaining <= 3;
  const isWarning = daysRemaining <= 7 && !isUrgent;

  const colorClass = isUrgent
    ? 'text-rose-700 bg-rose-50 border-rose-200'
    : isWarning
    ? 'text-amber-800 bg-amber-50 border-amber-200'
    : 'text-slate-700 bg-slate-50 border-slate-200';

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border tabular-nums tracking-tight',
        colorClass
      )}
      title={`${timeLeft.days}d ${pad(timeLeft.hours)}h ${pad(timeLeft.minutes)}m ${pad(timeLeft.seconds)}s remaining`}
    >
      <Clock className="w-3.5 h-3.5 shrink-0" />
      <span>
        {timeLeft.days > 0 ? `${timeLeft.days}d ` : ''}
        {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
      </span>
      {isUrgent && <span className="font-bold uppercase text-[10px] ml-0.5">Soon!</span>}
    </div>
  );
}
