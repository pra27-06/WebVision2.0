'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { ProfileWizard } from '@/components/match/ProfileWizard';
import { ResultsPanel } from '@/components/match/ResultsPanel';
import { Compass } from 'lucide-react';

export default function MatchPage() {
  const { t } = useApp();

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page Title & Context Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-200">
          <Compass className="w-3.5 h-3.5" />
          <span>Module A • Instant Scheme Discovery</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
          {t('matchTitle')}
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl">
          {t('matchSubtitle')}
        </p>
      </div>

      {/* Grid: Left Wizard, Right Reactive Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 xl:col-span-5 sticky top-24">
          <ProfileWizard />
        </div>
        <div className="lg:col-span-7 xl:col-span-7">
          <ResultsPanel />
        </div>
      </div>
    </div>
  );
}
