'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  Compass,
  GitCommit,
  FileCheck2,
  ArrowRight,
  Clock,
  Building,
  HardDrive,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export default function HomePage() {
  const { t } = useApp();

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-850 text-white p-8 sm:p-12 md:p-16 shadow-xl border border-indigo-900/50">
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-400/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{t('heroBadge')}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.1] text-white">
            {t('heroTitle')}
          </h1>

          <p className="text-base sm:text-lg text-indigo-100/90 leading-relaxed max-w-2xl">
            {t('heroSubtitle')}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/match"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-indigo-950 font-bold text-sm sm:text-base hover:bg-indigo-50 transition-all shadow-lg shadow-black/10 min-h-[48px] focus:outline-none focus:ring-2 focus:ring-white"
            >
              <span>{t('ctaFindSchemes')}</span>
              <ArrowRight className="w-4 h-4 text-indigo-600" />
            </Link>
            <Link
              href="/track"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-indigo-800/80 hover:bg-indigo-700/80 text-white font-semibold text-sm sm:text-base transition-all border border-indigo-600/50 min-h-[48px] focus:outline-none focus:ring-2 focus:ring-white"
            >
              <span>{t('ctaTrack')}</span>
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-indigo-800/80 hover:bg-indigo-700/80 text-white font-semibold text-sm sm:text-base transition-all border border-indigo-600/50 min-h-[48px] focus:outline-none focus:ring-2 focus:ring-white"
            >
              <span>{t('ctaDocs')}</span>
            </Link>
          </div>
        </div>

        {/* Subtle decorative background glow */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Three Stats Row */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          <div className="flex flex-col space-y-1.5 md:pr-6">
            <div className="flex items-center gap-2 text-rose-600">
              <Clock className="w-5 h-5" />
              <span className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums text-slate-900">
                {t('stat1Value')}
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-800">
              {t('stat1Label')}
            </h3>
            <p className="text-xs text-slate-500 leading-normal">
              {t('stat1Sub')}
            </p>
          </div>

          <div className="flex flex-col space-y-1.5 pt-4 md:pt-0 md:px-6">
            <div className="flex items-center gap-2 text-amber-600">
              <Building className="w-5 h-5" />
              <span className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums text-slate-900">
                {t('stat2Value')}
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-800">
              {t('stat2Label')}
            </h3>
            <p className="text-xs text-slate-500 leading-normal">
              {t('stat2Sub')}
            </p>
          </div>

          <div className="flex flex-col space-y-1.5 pt-4 md:pt-0 md:pl-6">
            <div className="flex items-center gap-2 text-indigo-600">
              <HardDrive className="w-5 h-5" />
              <span className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums text-slate-900">
                {t('stat3Value')}
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-800">
              {t('stat3Label')}
            </h3>
            <p className="text-xs text-slate-500 leading-normal">
              {t('stat3Sub')}
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-slate-500 text-xs">
          <span className="font-semibold text-slate-700">Note:</span>
          <span>{t('statsSourceNote')}</span>
        </div>
      </section>

      {/* The Three Modules / Traps Solved */}
      <section className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Three Friction Traps, One Seamless GovTech Fix
          </h2>
          <p className="text-sm text-slate-600">
            How Setu reimagines the student journey from discovery to direct benefit transfer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:border-indigo-300 hover:shadow-md transition-all">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                <Compass className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-rose-700 text-xs font-bold uppercase tracking-wider">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Problem 1</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                  {t('trap1Title')}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {t('trap1Desc')}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 mb-3">
                <CheckCircle2 className="w-4 h-4" />
                <span>Fix: {t('trap1Fix')}</span>
              </div>
              <Link
                href="/match"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-800"
              >
                <span>Try Scheme Matchmaker</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:border-indigo-300 hover:shadow-md transition-all">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                <GitCommit className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-rose-700 text-xs font-bold uppercase tracking-wider">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Problem 2</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                  {t('trap2Title')}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {t('trap2Desc')}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 mb-3">
                <CheckCircle2 className="w-4 h-4" />
                <span>Fix: {t('trap2Fix')}</span>
              </div>
              <Link
                href="/track"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-800"
              >
                <span>Open Domino Tracker</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:border-indigo-300 hover:shadow-md transition-all">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-rose-700 text-xs font-bold uppercase tracking-wider">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Problem 3</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                  {t('trap3Title')}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {t('trap3Desc')}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 mb-3">
                <CheckCircle2 className="w-4 h-4" />
                <span>Fix: {t('trap3Fix')}</span>
              </div>
              <Link
                href="/docs"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-800"
              >
                <span>Compress & Check Docs</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
