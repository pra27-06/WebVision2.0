'use client';

import React from 'react';
import { CompressionResult, getNspLimitForKind } from '@/lib/compress';
import { DocKind } from '@/types';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { Badge } from '@/components/ui/Badge';
import {
  Download,
  RotateCcw,
  CheckCircle2,
  Timer,
} from 'lucide-react';

interface FileResultCardProps {
  result: CompressionResult;
  kind: DocKind;
  onReplace: () => void;
}

export function FileResultCard({ result, kind, onReplace }: FileResultCardProps) {
  const { t } = useApp();
  const limit = getNspLimitForKind(kind);
  const limitKB = Math.round(limit / 1024);

  const originalKB = Math.round(result.originalSize / 1024);
  const compressedKB = Math.round(result.compressedSize / 1024);

  // Percentage of limit
  const limitPct = Math.min(100, Math.round((result.compressedSize / limit) * 100));

  const handleDownload = () => {
    const url = URL.createObjectURL(result.compressedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = result.compressedFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="border border-slate-200 bg-white p-5 sm:p-6 rounded-2xl shadow-sm space-y-6">
      {/* Top Bar: Status & Savings */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <Badge variant="success" className="px-3 py-1 text-xs">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Ready for NSP: {compressedKB} KB of {limitKB} KB</span>
          </Badge>
          <Badge variant="default" className="text-xs font-mono">
            {result.formatChange}
          </Badge>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
          <Timer className="w-3.5 h-3.5 text-indigo-600" />
          <span>{result.elapsedMs} ms</span>
        </div>
      </div>

      {/* File Metrics & Progress Bars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Original */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-2">
          <span className="text-xs text-slate-500 font-medium block">
            {t('originalSize')}
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-black font-mono text-slate-700">
              {originalKB >= 1024 ? `${(originalKB / 1024).toFixed(1)} MB` : `${originalKB} KB`}
            </span>
            <span className="text-xs font-bold text-rose-600 uppercase font-mono">
              Oversized
            </span>
          </div>
          <div className="h-2 w-full bg-rose-200 rounded-full overflow-hidden">
            <div className="h-full bg-rose-500 w-full" />
          </div>
        </div>

        {/* Compressed / Optimized */}
        <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-emerald-900 font-medium block">
              {t('compressedSize')}
            </span>
            <span className="text-xs font-bold text-emerald-700 font-mono">
              Saved {result.percentSaved}%
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-black font-mono text-emerald-800">
              {compressedKB} KB
            </span>
            <span className="text-xs text-emerald-700 font-mono">
              {limitPct}% of {limitKB} KB cap
            </span>
          </div>
          <Progress value={limitPct} indicatorColor="bg-emerald-600" className="h-2" />
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onReplace}
          className="flex items-center gap-1.5"
        >
          <RotateCcw className="w-4 h-4 text-slate-500" />
          <span>{t('replaceFile')}</span>
        </Button>

        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={handleDownload}
          className="flex items-center gap-1.5"
        >
          <Download className="w-4 h-4" />
          <span>{t('downloadCompressed')}</span>
        </Button>
      </div>
    </Card>
  );
}
