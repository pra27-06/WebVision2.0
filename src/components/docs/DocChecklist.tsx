'use client';

import React from 'react';
import { DocKind } from '@/types';
import { useApp } from '@/context/AppContext';
import { TranslationKey } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import {
  FileText,
  Camera,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

interface DocChecklistProps {
  selectedKind: DocKind;
  onSelectKind: (kind: DocKind) => void;
  completedKinds: Set<DocKind>;
}

export function DocChecklist({
  selectedKind,
  onSelectKind,
  completedKinds,
}: DocChecklistProps) {
  const { t } = useApp();

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

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4 shadow-xs">
      <div className="border-b border-slate-100 pb-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          {t('docRulesTitle')}
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Select a category to optimize or test
        </p>
      </div>

      <div className="space-y-2">
        {docItems.map((item) => {
          const isSelected = selectedKind === item.kind;
          const isDone = completedKinds.has(item.kind);
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
                  <span className="text-xs font-bold text-slate-900 block leading-tight">
                    {t(item.titleKey)}
                  </span>
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
