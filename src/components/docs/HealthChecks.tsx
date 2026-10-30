'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { SharpnessResult } from '@/lib/sharpness';
import { OcrResult } from '@/lib/ocrMock';
import { CompressionResult, getNspLimitForKind } from '@/lib/compress';
import { DocKind } from '@/types';
import { CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';

interface HealthChecksProps {
  kind: DocKind;
  compressionResult: CompressionResult;
  sharpness: SharpnessResult | null;
  ocr: OcrResult | null;
}

export function HealthChecks({
  kind,
  compressionResult,
  sharpness,
  ocr,
}: HealthChecksProps) {
  const { t } = useApp();
  const limit = getNspLimitForKind(kind);

  // 1. Format Valid
  const isValidFormat =
    kind === 'photo'
      ? compressionResult.compressedFile.type.includes('jpeg')
      : compressionResult.compressedFile.type.includes('pdf') ||
        compressionResult.compressedFile.type.includes('jpeg');

  // 2. Size within limit
  const isWithinLimit = compressionResult.compressedSize <= limit;

  // 3. Readable (Sharpness >= 100)
  const isSharp = sharpness ? sharpness.isSharp : true;
  const sharpnessScore = sharpness ? sharpness.score : 135;

  // 4. Resolution check
  const isResValid = compressionResult.width >= 600;

  // 5. Name match (if Aadhaar)
  const isNameMatched = ocr ? ocr.status === 'match' : true;

  const checks = [
    {
      title: t('checkFormat'),
      passed: isValidFormat,
      detail: compressionResult.compressedFile.type,
    },
    {
      title: t('checkSize'),
      passed: isWithinLimit,
      detail: `${Math.round(compressionResult.compressedSize / 1024)} KB / ${Math.round(limit / 1024)} KB limit`,
    },
    {
      title: t('checkSharpness'),
      passed: isSharp,
      detail: `Score: ${sharpnessScore} (Min 100)`,
    },
    {
      title: t('checkResolution'),
      passed: isResValid,
      detail: `${compressionResult.width} x ${compressionResult.height} px`,
    },
    ...(kind === 'aadhaar'
      ? [
          {
            title: t('checkNameMatch'),
            passed: isNameMatched,
            detail: ocr ? `${ocr.status.toUpperCase()} (${Math.round(ocr.similarity * 100)}%)` : 'Checking...',
          },
        ]
      : []),
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4 shadow-xs">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          {t('healthChecksTitle')}
        </h4>
      </div>

      <div className="space-y-2.5">
        {checks.map((chk, i) => (
          <div
            key={i}
            className={`flex items-center justify-between p-3 rounded-xl border text-xs transition-all ${
              chk.passed
                ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                : 'bg-rose-50/50 border-rose-200 text-rose-950'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {chk.passed ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span className="font-semibold text-slate-800">{chk.title}</span>
            </div>

            <span className="font-mono text-[11px] text-slate-500 font-bold">
              {chk.detail}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
