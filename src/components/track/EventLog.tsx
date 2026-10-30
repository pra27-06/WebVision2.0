'use client';

import React from 'react';
import { EventLogItem } from '@/types';
import { useApp } from '@/context/AppContext';
import { useIsMounted } from '@/lib/useIsMounted';
import { History, User } from 'lucide-react';

interface EventLogProps {
  events: EventLogItem[];
}

export function EventLog({ events }: EventLogProps) {
  const { t } = useApp();
  const mounted = useIsMounted();

  const formatTimestamp = (iso: string) => {
    if (!mounted) return 'Just now';
    try {
      const date = new Date(iso);
      return date.toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4 shadow-xs">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <History className="w-4 h-4 text-indigo-600" />
        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          {t('eventLogTitle')}
        </h4>
        <span className="text-[11px] font-mono text-slate-400 ml-auto">
          {events.length} entries
        </span>
      </div>

      <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
        {events.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">
            {t('emptyEventLog')}
          </p>
        ) : (
          events.map((item, idx) => (
            <div
              key={idx}
              className="relative pl-6 pb-4 border-l-2 border-indigo-100 last:border-transparent last:pb-0"
            >
              {/* Timeline marker */}
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[9px] font-bold ring-4 ring-white">
                ✓
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <span className="font-bold text-slate-900 text-sm">
                    {item.action}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 tabular-nums">
                    {formatTimestamp(item.timestamp)}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-indigo-700 font-medium">
                  <User className="w-3 h-3" />
                  <span>{item.actor}</span>
                </div>

                <p className="text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100 mt-1">
                  {item.note}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
