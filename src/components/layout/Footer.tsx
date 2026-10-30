'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { ShieldAlert, Cpu } from 'lucide-react';

export function Footer() {
  const { t } = useApp();

  return (
    <footer className="mt-auto border-t border-slate-200 bg-white text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex flex-col md:flex-row items-start justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Independent Hackathon Prototype</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              {t('disclaimerGov')}
            </p>
            <p className="text-xs text-slate-400">
              {t('allRightsReserved')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-2 text-xs text-slate-500">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-mono text-[11px] border border-slate-200">
              <Cpu className="w-3 h-3 text-indigo-600" />
              <span>Client-Side In-Memory Engine</span>
            </div>
            <span>GovTech Architecture Mockup</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
