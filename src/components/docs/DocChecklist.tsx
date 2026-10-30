'use client';

import React from 'react';
import { DocKind } from '@/types';
import { useApp } from '@/context/AppContext';
import { TranslationKey } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { MOCK_SCHOLARSHIPS } from '@/data/mockScholarships';
import {
  FileText,
  Camera,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
  BookOpen,
} from 'lucide-react';

interface DocChecklistProps {
  selectedKind: DocKind;
  onSelectKind: (kind: DocKind) => void;
  completedKinds: Set<DocKind>;
  currentSchemeId?: string;
  onSchemeChange?: (schemeId: string) => void;
  requiredKinds?: DocKind[];
}

export function DocChecklist({
  selectedKind,
  onSelectKind,
  completedKinds,
  currentSchemeId,
  onSchemeChange,
  requiredKinds,
}: DocChecklistProps) {
  const { t, state } = useApp();
  const lang = state.language;

  const currentScheme = currentSchemeId
    ? MOCK_SCHOLARSHIPS.find((s) => s.id === currentSchemeId)
    : null;

  const effectiveRequiredKinds = requiredKinds || currentScheme?.documents || [];

  const docItems: {
    kind: DocKind;
    titleKey: TranslationKey;
    rule: string;
    icon: typeof FileText;
    format: string;
  }[] = [
    {
      kind: 'aadhaar',
      titleKey: 'docAadhaar',
      rule: 'PDF / JPG ≤ 200 KB',
      icon: ShieldCheck,
      format: 'Name & e-KYC',
    },
    {
      kind: 'income',
      titleKey: 'docIncome',
      rule: 'PDF / JPG ≤ 200 KB',
      icon: FileText,
      format: 'Tehsildar Seal',
    },
    {
      kind: 'caste',
      titleKey: 'docCaste',
      rule: 'PDF / JPG ≤ 200 KB',
      icon: FileText,
      format: 'OBC/SC/ST Quota',
    },
    {
      kind: 'bank',
      titleKey: 'docBank',
      rule: 'PDF / JPG ≤ 200 KB',
      icon: FileText,
      format: 'Aadhaar Seeded',
    },
    {
      kind: 'marksheet',
      titleKey: 'docMarksheet',
      rule: 'PDF / JPG ≤ 200 KB',
      icon: FileText,
      format: 'Marks & Percentile',
    },
    {
      kind: 'photo',
      titleKey: 'docPhoto',
      rule: 'JPG Only ≤ 50 KB',
      icon: Camera,
      format: 'Passport Size',
    },
  ];

  const requiredCount = effectiveRequiredKinds.length;
  const completedRequiredCount = effectiveRequiredKinds.filter((k) =>
    completedKinds.has(k)
  ).length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4 shadow-xs">
      <div className="border-b border-slate-100 pb-3 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            {t('docRulesTitle')}
          </h3>
          {requiredCount > 0 && (
            <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              {completedRequiredCount}/{requiredCount} Verified
            </span>
          )}
        </div>

        {/* Scheme Checklist Selector */}
        {onSchemeChange && (
          <div className="space-y-1">
            <label
              htmlFor="scheme-checklist-select"
              className="text-[11px] font-semibold text-slate-600 flex items-center gap-1"
            >
              <BookOpen className="w-3 h-3 text-indigo-600" />
              <span>Target Scheme Checklist:</span>
            </label>
            <select
              id="scheme-checklist-select"
              value={currentSchemeId || ''}
              onChange={(e) => onSchemeChange(e.target.value)}
              className="w-full text-xs font-semibold rounded-lg border border-slate-300 bg-slate-50 py-1.5 px-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 truncate"
            >
              {MOCK_SCHOLARSHIPS.map((scheme) => (
                <option key={scheme.id} value={scheme.id}>
                  {scheme.name[lang] || scheme.name.en}
                </option>
              ))}
            </select>
          </div>
        )}

        <p className="text-xs text-slate-500">
          {currentScheme
            ? `Required documents for ${currentScheme.name[lang] || currentScheme.name.en}`
            : 'Select a category to optimize or test with AI OCR'}
        </p>
      </div>

      <div className="space-y-2">
        {docItems.map((item) => {
          const isSelected = selectedKind === item.kind;
          const isDone = completedKinds.has(item.kind);
          const isRequiredForScheme = effectiveRequiredKinds.includes(item.kind);
          const Icon = item.icon;

          return (
            <button
              key={item.kind}
              type="button"
              onClick={() => onSelectKind(item.kind)}
              className={cn(
                'w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between min-h-[48px] focus:outline-none focus:ring-2 focus:ring-indigo-600',
                isSelected
                  ? 'bg-indigo-50/70 border-indigo-600 text-indigo-950 font-bold shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                    isSelected
                      ? 'bg-indigo-600 text-white'
                      : isDone
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-100 text-slate-500'
                  )}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900 block leading-tight">
                      {t(item.titleKey)}
                    </span>
                    {isRequiredForScheme && (
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-200">
                        Mandatory
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {item.format} • {item.rule}
                  </span>
                </div>
              </div>

              <ChevronRight
                className={cn(
                  'w-4 h-4 shrink-0 transition-transform',
                  isSelected ? 'text-indigo-600 translate-x-0.5' : 'text-slate-400'
                )}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
