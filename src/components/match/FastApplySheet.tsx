'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Scheme } from '@/types';
import { TranslationKey } from '@/lib/i18n';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/Sheet';
import { Button } from '@/components/ui/Button';
import { formatCurrencyINR } from '@/lib/utils';
import {
  CheckCircle2,
  FileText,
  User,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface FastApplySheetProps {
  scheme: Scheme | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FastApplySheet({ scheme, open, onOpenChange }: FastApplySheetProps) {
  const router = useRouter();
  const { state, dispatch, t, getText } = useApp();
  const { profile } = state;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdAppId, setCreatedAppId] = useState<string | null>(null);

  if (!scheme) return null;

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      dispatch({
        type: 'CREATE_APPLICATION',
        payload: {
          scheme,
          applicantName: 'Priya Sharma',
        },
      });
      setIsSubmitting(false);
      setCreatedAppId('NEW');
    }, 600);
  };

  const handleClose = () => {
    setCreatedAppId(null);
    onOpenChange(false);
  };

  const handleTrackIt = () => {
    handleClose();
    router.push('/track');
  };

  const handlePrepareDocs = () => {
    handleClose();
    router.push('/docs');
  };

  const getDocName = (kind: string) => {
    const key = `kind_${kind}` as TranslationKey;
    return t(key);
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent onClose={handleClose}>
        {!createdAppId ? (
          <>
            <SheetHeader>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold w-fit border border-indigo-200">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t('sheetTitle')}</span>
              </div>
              <SheetTitle className="text-xl font-bold text-slate-900 mt-2">
                {getText(scheme.name)}
              </SheetTitle>
              <SheetDescription>
                {t('sheetSubtitle')}
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-6 my-4 text-sm">
              {/* Benefit & Provider pill */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 block">{t('benefitLabel')}</span>
                  <span className="text-xl font-black text-indigo-700 font-mono">
                    {formatCurrencyINR(scheme.benefitPerYear)}
                    <span className="text-xs font-normal text-slate-600 ml-1">{t('inrPerYear')}</span>
                  </span>
                </div>
                <div className="text-right max-w-[200px]">
                  <span className="text-xs text-slate-500 block">Authority</span>
                  <span className="text-xs font-semibold text-slate-800 line-clamp-2">
                    {getText(scheme.provider)}
                  </span>
                </div>
              </div>

              {/* Profile Summary Box */}
              <div className="border border-slate-200 rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{t('applicantProfileSummary')}</span>
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block">Applicant:</span>
                    <span className="font-semibold text-slate-900">Priya Sharma</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Domicile State:</span>
                    <span className="font-semibold text-slate-900">{profile.state}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Course Level:</span>
                    <span className="font-semibold text-slate-900 uppercase">{profile.level}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Category:</span>
                    <span className="font-semibold text-slate-900 uppercase">{profile.category}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Annual Income:</span>
                    <span className="font-semibold text-slate-900">{formatCurrencyINR(profile.annualIncome)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Quota Matches:</span>
                    <span className="font-semibold text-slate-900">Female Quota</span>
                  </div>
                </div>
              </div>

              {/* Required Documents Checklist */}
              <div className="border border-slate-200 rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{t('requiredDocsList')}</span>
                </h4>
                <ul className="space-y-2 text-xs">
                  {scheme.documents.map((doc) => (
                    <li key={doc} className="flex items-center gap-2 text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{getDocName(doc)} (PDF / JPG ≤ 200 KB)</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <SheetFooter>
              <Button
                type="button"
                variant="primary"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="w-full flex items-center justify-center gap-2 min-h-[48px]"
              >
                <span>{isSubmitting ? t('submitting') : t('confirmSubmission')}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </SheetFooter>
          </>
        ) : (
          /* Submission Success State */
          <div className="flex flex-col items-center justify-center text-center py-8 space-y-6 my-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-200/50">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900">
                Application Dispatched!
              </h3>
              <p className="text-sm text-slate-600 max-w-sm">
                {t('applySuccessToast')}
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-100 text-slate-800 font-mono text-xs font-bold border border-slate-200">
                Target: Institute Nodal Officer (INO Desk)
              </div>
            </div>

            <div className="w-full space-y-3 pt-4">
              <Button
                type="button"
                variant="primary"
                onClick={handleTrackIt}
                className="w-full flex items-center justify-center gap-2 min-h-[48px]"
              >
                <span>{t('trackNow')}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>

              <Button
                type="button"
                variant="secondary"
                onClick={handlePrepareDocs}
                className="w-full min-h-[48px]"
              >
                <span>{t('prepareDocsNow')}</span>
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
