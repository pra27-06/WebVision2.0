'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { PlayCircle, ChevronUp, ChevronDown, ArrowRight } from 'lucide-react';

export function DemoGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useApp();

  const steps = [
    {
      num: 1,
      title: 'Scheme Matchmaker',
      href: '/match',
      time: '0:30 – 1:20',
      action: 'Click "Try demo profile" (UP, UG, OBC, ₹2.4L). Badges appear (100%, 100%, 85%). Toggle Hindi. Click Fast Apply.',
    },
    {
      num: 2,
      title: 'Domino Tracker',
      href: '/track',
      time: '1:20 – 2:05',
      action: 'Select APP-2026-104233 at DNO level. Notice queue #14/212 and live SLA clock. Click "Request Additional Doc".',
    },
    {
      num: 3,
      title: 'Doc Health Check',
      href: '/docs?app=APP-2026-104233',
      time: '2:05 – 2:45',
      action: 'Click "Fix now". Load 3.4 MB Aadhaar scan: shrinks to ~150 KB, runs Laplacian sharpness & name check. Click "Resubmit to DNO".',
    },
    {
      num: 4,
      title: 'Disbursal & Finish',
      href: '/track',
      time: '2:45 – 3:00',
      action: 'Pipeline resumes back at DNO. Click "Approve as DNO". Dominoes fall to DBT Disbursal with UTR ref.',
    },
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="w-[360px] sm:w-[420px] max-w-[calc(100vw-32px)] bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700 p-5 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-indigo-400" />
              <h4 className="font-bold text-sm text-white">
                {t('demoGuideTitle')}
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-xs min-h-[32px] min-w-[32px] flex items-center justify-center"
              aria-label="Close demo guide"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {steps.map((s) => (
              <div
                key={s.num}
                className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60 hover:border-indigo-500/50 transition-colors"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-indigo-400 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-[10px] font-bold">
                      {s.num}
                    </span>
                    {s.title}
                  </span>
                  <span className="text-slate-400 font-mono text-[10px]">{s.time}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-2">
                  {s.action}
                </p>
                <Link
                  href={s.href}
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-300 hover:text-white"
                >
                  <span>Open {s.title}</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900 text-white font-semibold text-xs shadow-xl border border-slate-700 hover:bg-slate-800 hover:border-indigo-500 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[44px]"
        >
          <PlayCircle className="w-4 h-4 text-indigo-400" />
          <span>Demo Guide (3-Min Pitch)</span>
          <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
        </button>
      )}
    </div>
  );
}
