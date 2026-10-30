'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Application } from '@/types';
import { useApp } from '@/context/AppContext';
import { SlaCountdown } from './SlaCountdown';
import { OfficerDeskCard } from './OfficerDeskCard';
import { SimulatePanel } from './SimulatePanel';
import { EventLog } from './EventLog';
import { formatCurrencyINR, cn } from '@/lib/utils';
import {
  AlertTriangle,
  Check,
  ShieldAlert,
  Coins,
  Wrench,
  UploadCloud,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface DominoPipelineProps {
  application: Application;
}

export function DominoPipeline({ application }: DominoPipelineProps) {
  const router = useRouter();
  const { dispatch, t } = useApp();
  const shouldReduceMotion = useReducedMotion();

  const {
    id,
    applicantName,
    status,
    slaDueAt,
    slaPaused,
    slaBreached,
    escalatedToSno,
    disbursementRef,
    disbursedAmount,
    disbursedBank,
    docRequestNote,
    events,
  } = application;

  // Define the 4 domino pipeline stages
  // Stage 1: Submitted
  // Stage 2: INO
  // Stage 3: DNO
  // Stage 4: Disbursal
  const getStageState = (stageIndex: number): 'done' | 'active' | 'blocked' | 'upcoming' => {
    if (status === 'DISBURSED') {
      return 'done';
    }

    if (stageIndex === 1) {
      return 'done'; // Applicant Submitted is always done for existing apps
    }

    if (stageIndex === 2) {
      if (status === 'AT_INO') return 'active';
      return 'done'; // INO done if at DNO, DOC_REQUESTED or DISBURSED
    }

    if (stageIndex === 3) {
      if (status === 'AT_INO') return 'upcoming';
      if (status === 'DOC_REQUESTED') return 'blocked';
      if (status === 'AT_DNO') return 'active';
      return 'done';
    }

    if (stageIndex === 4) {
      return 'upcoming';
    }

    return 'upcoming';
  };

  const stages = [
    {
      index: 1,
      title: t('stage1Name'),
      owner: applicantName,
      state: getStageState(1),
      timeSpent: 'Completed',
    },
    {
      index: 2,
      title: t('stage2Name'),
      owner: 'Dr. Anil Verma (INO)',
      state: getStageState(2),
      timeSpent: status === 'AT_INO' ? 'In progress' : '4 days',
    },
    {
      index: 3,
      title: t('stage3Name'),
      owner: escalatedToSno ? 'Shri Vikram Malhotra (SNO)' : 'Smt. Kavita Rao (DNO)',
      state: getStageState(3),
      timeSpent: status === 'AT_DNO' ? '5 days' : status === 'DOC_REQUESTED' ? 'Paused' : status === 'DISBURSED' ? 'Completed' : 'Queued',
    },
    {
      index: 4,
      title: t('stage4Name'),
      owner: 'PFMS DBT Direct Disbursal Cell',
      state: getStageState(4),
      timeSpent: status === 'DISBURSED' ? 'Credited' : 'Pending',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Escalated to SNO Banner */}
      {escalatedToSno && (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
          <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-rose-950">
              {t('slaBreachedBanner')}
            </h4>
            <p className="text-xs text-rose-800 leading-relaxed">
              District scrutiny exceeded the 72-hour statutory SLA. File automatically transferred to State Appeals Directorate (Room 408) with expedited 24-hour resolution order.
            </p>
          </div>
        </div>
      )}

      {/* Action Required Banner for DOC_REQUESTED */}
      {status === 'DOC_REQUESTED' && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-in fade-in duration-300">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-amber-950">
                Action Required: Aadhaar Scan Unclear
              </h4>
              <p className="text-xs text-amber-800 leading-relaxed">
                {docRequestNote || 'The District Nodal Officer requested a clearer Aadhaar scan. SLA clock is paused until you resubmit.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => router.push(`/docs?app=${id}`)}
              className="bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-1.5"
            >
              <Wrench className="w-4 h-4" />
              <span>{t('btnFixNow')}</span>
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => dispatch({ type: 'RESUBMIT_DOC', payload: { appId: id } })}
              className="flex items-center gap-1.5"
            >
              <UploadCloud className="w-4 h-4" />
              <span>{t('btnSimulateResubmit')}</span>
            </Button>
          </div>
        </div>
      )}

      {/* Disbursed Hero Card */}
      {status === 'DISBURSED' && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              <Coins className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-200 block">
                {t('disbursedTitle')}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black font-mono">
                {formatCurrencyINR(disbursedAmount || 50000)}
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-3 border-t border-white/20">
            <div>
              <span className="text-emerald-200 block">{t('disbursedRef')}:</span>
              <span className="font-mono font-bold text-sm text-white">
                {disbursementRef || 'DBT-DEMO-000123'}
              </span>
            </div>
            <div>
              <span className="text-emerald-200 block">{t('disbursedBank')}:</span>
              <span className="font-semibold text-white">
                {disbursedBank || 'State Bank of India (XXXX 4821)'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 4-Stage Domino Pipeline Visual */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              4-Stage Verification Pipeline
            </h3>
            <p className="text-xs text-slate-500">
              Application ID: <span className="font-mono font-bold text-slate-700">{id}</span>
            </p>
          </div>

          {/* SLA Clock pill */}
          {status !== 'DISBURSED' && (
            <SlaCountdown
              dueAt={slaDueAt}
              isPaused={slaPaused}
              isBreached={slaBreached}
            />
          )}
        </div>

        {/* Pipeline Nodes & Connectors */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {stages.map((st, i) => {
            const isLast = i === stages.length - 1;

            return (
              <div key={st.index} className="flex flex-col relative">
                {/* Horizontal connector line on desktop */}
                {!isLast && (
                  <div
                    aria-hidden="true"
                    className="hidden md:block absolute top-6 left-1/2 w-full h-1 -z-0"
                  >
                    <div
                      className={cn(
                        'h-full transition-all duration-500',
                        st.state === 'done' ? 'bg-indigo-600' : 'bg-slate-200'
                      )}
                    />
                  </div>
                )}

                {/* Node Box */}
                <motion.div
                  initial={shouldReduceMotion ? false : { scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.1, duration: 0.2 }}
                  className={cn(
                    'relative z-10 flex flex-col p-4 rounded-2xl border transition-all h-full',
                    st.state === 'done'
                      ? 'bg-indigo-50/70 border-indigo-200 text-indigo-950'
                      : st.state === 'active'
                      ? 'bg-white border-indigo-600 shadow-md ring-2 ring-indigo-600/30 ring-offset-2'
                      : st.state === 'blocked'
                      ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-400/30'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    {/* Node Icon */}
                    <div
                      className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-xs',
                        st.state === 'done'
                          ? 'bg-indigo-600 text-white'
                          : st.state === 'active'
                          ? 'bg-indigo-600 text-white animate-pulse'
                          : st.state === 'blocked'
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-200 text-slate-500'
                      )}
                    >
                      {st.state === 'done' ? (
                        <Check className="w-4 h-4 stroke-[3]" />
                      ) : (
                        st.index
                      )}
                    </div>

                    {/* Status Badge */}
                    <span
                      className={cn(
                        'text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full',
                        st.state === 'done'
                          ? 'bg-indigo-100 text-indigo-800'
                          : st.state === 'active'
                          ? 'bg-indigo-600 text-white'
                          : st.state === 'blocked'
                          ? 'bg-amber-200 text-amber-900'
                          : 'bg-slate-200 text-slate-600'
                      )}
                    >
                      {st.state === 'done'
                        ? t('stageDone')
                        : st.state === 'active'
                        ? t('stageActive')
                        : st.state === 'blocked'
                        ? t('stageBlocked')
                        : t('stageUpcoming')}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 mb-1 leading-snug">
                    {st.title}
                  </h4>
                  <span className="text-xs text-slate-500 truncate block">
                    {st.owner}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 mt-auto pt-2 block">
                    Time: {st.timeSpent}
                  </span>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expanded Active Node Scrutiny (Desk & SLA Details) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <OfficerDeskCard application={application} />
          <SimulatePanel application={application} />
        </div>
        <div className="lg:col-span-5">
          <EventLog events={events} />
        </div>
      </div>
    </div>
  );
}
