'use client';

import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, PauseCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/context/AppContext';
import { useIsMounted } from '@/lib/useIsMounted';

interface SlaCountdownProps {
  dueAt: string;
  isPaused?: boolean;
  isBreached?: boolean;
}

export function SlaCountdown({ dueAt, isPaused, isBreached }: SlaCountdownProps) {
  const { t } = useApp();
  const mounted = useIsMounted();
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
    totalMs: number;
  }>({
    hours: 52,
    minutes: 0,
    seconds: 0,
    totalMs: 52 * 3600 * 1000,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const diff = new Date(dueAt).getTime() - Date.now();
      if (diff <= 0 || isBreached) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, totalMs: 0 });
        return;
      }
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ hours: h, minutes: m, seconds: s, totalMs: diff });
    };

    updateCountdown();
    if (isPaused || isBreached) return;

    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [dueAt, isPaused, isBreached]);

  if (!mounted) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-mono">
        <Clock className="w-3.5 h-3.5" />
        <span>SLA Clock: 52:00:00</span>
      </div>
    );
  }

  if (isPaused) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-300 text-xs font-semibold">
        <PauseCircle className="w-4 h-4 text-amber-600 animate-pulse" />
        <span>{t('slaPausedBadge')}</span>
      </div>
    );
  }

  if (isBreached || timeLeft.totalMs <= 0) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-50 text-rose-800 border border-rose-300 text-xs font-bold font-mono">
        <AlertTriangle className="w-4 h-4 text-rose-600 animate-bounce" />
        <span>00:00:00 ({t('slaBreachedBadge')})</span>
      </div>
    );
  }

  const hoursRemaining = timeLeft.hours;
  const isAmber = hoursRemaining < 24;
  const colorClass = isAmber
    ? 'bg-amber-50 text-amber-900 border-amber-300'
    : 'bg-emerald-50 text-emerald-900 border-emerald-300';

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-mono font-bold tabular-nums shadow-2xs',
        colorClass
      )}
    >
      <Clock className="w-4 h-4 shrink-0" />
      <span>
        {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
      </span>
      <span className="text-[10px] font-sans font-medium uppercase tracking-wider text-slate-600 ml-1">
        {t('slaTimeRemaining')}
      </span>
    </div>
  );
}
