'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { ApplicationPicker } from '@/components/track/ApplicationPicker';
import { DominoPipeline } from '@/components/track/DominoPipeline';
import { GitCommit } from 'lucide-react';

export default function TrackPage() {
  const { state, t } = useApp();
  const { applications, selectedAppId } = state;

  const currentApplication =
    applications.find((app) => app.id === selectedAppId) || applications[0];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page Title & Context Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-200">
          <GitCommit className="w-3.5 h-3.5" />
          <span>Module B • Complete Nodal Scrutiny Visibility</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
          {t('trackTitle')}
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl">
          {t('trackSubtitle')}
        </p>
      </div>

      {/* Grid: Left Application Picker, Right Domino Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 xl:col-span-3 sticky top-24">
          <ApplicationPicker />
        </div>
        <div className="lg:col-span-8 xl:col-span-9">
          {currentApplication ? (
            <DominoPipeline application={currentApplication} />
          ) : (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
              <p className="text-sm text-slate-500">No application selected.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
