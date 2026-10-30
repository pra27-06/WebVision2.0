'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
  ExternalLink,
  Sparkles,
  ShieldCheck,
  FileCheck2,
} from 'lucide-react';
import { ScholarshipCopilot } from '@/components/copilot/ScholarshipCopilot';

interface SchemeCardProps {
  scheme: Scheme;
  eligibility: EligibilityResult;
  onFastApply: (scheme: Scheme) => void;
}

export function SchemeCard({ scheme, eligibility, onFastApply }: SchemeCardProps) {
  const { t, getText } = useApp();
  const { tier, auditItems } = eligibility;
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [copilotPrompt, setCopilotPrompt] = useState('');

  const satisfiedCount = auditItems?.filter((item) => item.status === 'satisfied').length || 0;
  const unverifiedItem = auditItems?.find((item) => item.status === 'unverified');

  const renderStatusBadge = () => {
    if (tier === 'eligible') {
      return (
        <Badge variant="success" className="px-3 py-1 text-xs gap-1.5 shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
          <span>All {satisfiedCount} Core Criteria Verified</span>
        </Badge>
      );
    }
    if (tier === 'likely') {
      return (
        <Badge variant="warning" className="px-3 py-1 text-xs gap-1.5 shadow-2xs">
          <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
          <span>Core Match • 1 Condition Unverified</span>
        </Badge>
      );
    }
    return (
      <Badge variant="destructive" className="px-3 py-1 text-xs gap-1.5 shadow-2xs">
        <XCircle className="w-3.5 h-3.5 text-rose-700" />
        <span>Ineligible for Current Profile</span>
      </Badge>
    );
  };

  const handleOpenCopilot = (question: string) => {
    setCopilotPrompt(question);
    setCopilotOpen(true);
  };

  return (
    <Card className="overflow-hidden border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all">
      <div className="p-5 sm:p-6 space-y-4">
        {/* Header Row: Deterministic Verdict Badge & Live Urgency Countdown */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          {renderStatusBadge()}
          <DeadlineCountdown daysRemaining={scheme.deadlineInDays} />
        </div>

        {/* Scheme Name & Official Provider */}
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 leading-snug">
              {getText(scheme.name)}
            </h3>
            {/* Official Source Link Citation */}
            <a
              href={scheme.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 hover:text-indigo-900 hover:underline shrink-0 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200"
              title="Official portal guideline"
            >
              <span>{getText(scheme.portalName)}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <p className="text-xs font-medium text-slate-500">
            {getText(scheme.provider)}
          </p>
        </div>

        {/* Benefit Box */}
        <div className="inline-flex items-baseline gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-950">
          <span className="text-xs font-semibold text-indigo-700">{t('benefitLabel')}:</span>
          <span className="text-xl sm:text-2xl font-black font-mono tabular-nums text-indigo-800">
            {formatCurrencyINR(scheme.benefitPerYear)}
          </span>
          <span className="text-xs font-normal text-indigo-600">{t('inrPerYear')}</span>
        </div>

        {/* What the official guideline says */}
        <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-200/80 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
            <span>{t('guidelineSays')}</span>
          </span>
          <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
            {getText(scheme.summary)}
          </p>
        </div>

        {/* Verified Criteria Audit Breakdown */}
        {auditItems && auditItems.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Requirement Audit Status:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {auditItems.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-start gap-1.5 p-2 rounded-lg text-xs ${
                    item.status === 'satisfied'
                      ? 'bg-emerald-50/70 text-emerald-900 border border-emerald-200/60'
                      : item.status === 'unverified'
                      ? 'bg-amber-50 text-amber-900 border border-amber-300'
                      : 'bg-rose-50 text-rose-900 border border-rose-200'
                  }`}
                >
                  {item.status === 'satisfied' && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  )}
                  {item.status === 'unverified' && (
                    <HelpCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  {item.status === 'failed' && (
                    <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div className="leading-tight">
                    <span className="font-semibold block">{getText(item.name)}:</span>
                    <span className="text-[11px] opacity-90">{getText(item.explanation)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* If soft criterion unverified, explain what is needed */}
        {unverifiedItem && (
          <div className="p-3 bg-amber-50/90 rounded-xl border border-amber-300 text-xs text-amber-950 space-y-1">
            <span className="font-bold flex items-center gap-1.5 text-amber-900">
              <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
              <span>Action Needed Before Applying:</span>
            </span>
            <p className="leading-normal">
              {getText(unverifiedItem.explanation)}
            </p>
          </div>
        )}

        {/* AI Copilot Contextual Quick Prompts & Checklist Link */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <button
            type="button"
            onClick={() => handleOpenCopilot(`Explain eligibility criteria and benefits for ${scheme.name.en} in simple terms.`)}
            className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-indigo-50/70 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors"
          >
            <Sparkles className="w-3 h-3 text-indigo-600" />
            <span>Explain in simple words</span>
          </button>
          <button
            type="button"
            onClick={() => handleOpenCopilot(`What exact documents are required for ${scheme.name.en} on the official portal?`)}
            className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-indigo-50/70 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors"
          >
            <FileCheck2 className="w-3 h-3 text-indigo-600" />
            <span>Ask required documents</span>
          </button>
          <Link
            href={`/docs?scheme=${scheme.id}`}
            className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors"
          >
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>Prepare Docs ({scheme.documents?.length || 4})</span>
          </Link>
        </div>

        {/* Fast Apply Primary Action */}
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

      {/* Embedded Copilot Trigger Modal */}
      {copilotOpen && (
        <ScholarshipCopilot
          selectedSchemeId={scheme.id}
          initialQuestion={copilotPrompt}
          isOpenExternal={copilotOpen}
          onCloseExternal={() => setCopilotOpen(false)}
        />
      )}
    </Card>
  );
}
