'use client';

import React from 'react';
import { Scheme, EligibilityResult } from '@/types';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DeadlineCountdown } from './DeadlineCountdown';
import { formatCurrencyINR } from '@/lib/utils';
import {
  CheckCircle2,
  AlertCircle,
  XCircle,
  HelpCircle,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

interface SchemeCardProps {
  scheme: Scheme;
  eligibility: EligibilityResult;
  onFastApply: (scheme: Scheme) => void;
}

export function SchemeCard({ scheme, eligibility, onFastApply }: SchemeCardProps) {
  const { t, getText } = useApp();
  const { score, tier, reasons } = eligibility;

  const renderBadge = () => {
    if (tier === 'eligible') {
      return (
        <Badge variant="success" className="px-3 py-1 text-xs">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
          <span>{t('tierEligible')}</span>
        </Badge>
      );
    }
    if (tier === 'likely') {
      return (
        <Badge variant="warning" className="px-3 py-1 text-xs">
          <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
          <span>{t('tierLikely', { score })}</span>
        </Badge>
      );
    }
    return (
      <Badge variant="destructive" className="px-3 py-1 text-xs">
        <XCircle className="w-3.5 h-3.5 text-rose-700" />
        <span>{t('tierIneligible')}</span>
      </Badge>
    );
  };

  return (
    <Card className="overflow-hidden border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all">
      <div className="p-5 sm:p-6 space-y-4">
        {/* Header Row: Confidence Badge & Live Countdown */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          {renderBadge()}
          <DeadlineCountdown daysRemaining={scheme.deadlineInDays} />
        </div>

        {/* Scheme Name & Provider */}
        <div className="space-y-1">
          <h3 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 leading-snug">
            {getText(scheme.name)}
          </h3>
          <p className="text-xs font-medium text-slate-500">
            {getText(scheme.provider)}
          </p>
        </div>

        {/* Benefit Hero Box */}
        <div className="inline-flex items-baseline gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-950">
          <span className="text-xs font-semibold text-indigo-700">{t('benefitLabel')}:</span>
          <span className="text-xl sm:text-2xl font-black font-mono tabular-nums text-indigo-800">
            {formatCurrencyINR(scheme.benefitPerYear)}
          </span>
          <span className="text-xs font-normal text-indigo-600">{t('inrPerYear')}</span>
        </div>

        {/* What the guideline says */}
        <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-200/80 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
            <span>{t('guidelineSays')}</span>
          </span>
          <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
            {getText(scheme.summary)}
          </p>
        </div>

        {/* Reasons Chips */}
        <div className="space-y-1.5 pt-1">
          {reasons.map((r, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2 text-xs p-2 rounded-lg ${
                r.kind === 'pass'
                  ? 'bg-emerald-50/60 text-emerald-900 border border-emerald-100'
                  : r.kind === 'verify'
                  ? 'bg-amber-50/80 text-amber-900 border border-amber-200'
                  : 'bg-rose-50/60 text-rose-900 border border-rose-100'
              }`}
            >
              {r.kind === 'pass' && (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              )}
              {r.kind === 'verify' && (
                <HelpCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              )}
              {r.kind === 'fail' && (
                <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <span className="leading-tight">{getText(r.text)}</span>
            </div>
          ))}
        </div>

        {/* Fast Apply Action */}
        <div className="pt-2">
          <Button
            type="button"
            variant="primary"
            onClick={() => onFastApply(scheme)}
            className="w-full flex items-center justify-center gap-2 text-sm font-bold min-h-[44px]"
          >
            <span>{t('fastApplyBtn')}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
