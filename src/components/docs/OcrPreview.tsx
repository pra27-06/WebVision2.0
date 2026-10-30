'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { OcrResult, OcrScenario } from '@/lib/ocrMock';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/Select';
import {
  Scan,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Cpu,
  User,
  CreditCard,
} from 'lucide-react';

interface OcrPreviewProps {
  ocr: OcrResult | null;
  applicantName: string;
  onApplicantNameChange: (name: string) => void;
  scenario: OcrScenario;
  onScenarioChange: (scenario: OcrScenario) => void;
}

export function OcrPreview({
  ocr,
  applicantName,
  onApplicantNameChange,
  scenario,
  onScenarioChange,
}: OcrPreviewProps) {
  const { t } = useApp();

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-6 shadow-xs">
      {/* Header with Simulated pill */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Scan className="w-4 h-4 text-indigo-600" />
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            {t('ocrTitle')}
          </h4>
        </div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-[11px] border border-slate-200">
          <Cpu className="w-3 h-3 text-indigo-600" />
          <span>OCR simulated for demo</span>
        </div>
      </div>

      {/* Demo Scenario Selector for presenter */}
      <div className="bg-indigo-50/50 rounded-xl p-3.5 border border-indigo-100 space-y-2">
        <Label htmlFor="scenario-select" className="text-xs font-semibold text-indigo-900">
          {t('ocrScenarioLabel')} (Presenter Override)
        </Label>
        <Select
          id="scenario-select"
          value={scenario}
          onChange={(e) => onScenarioChange(e.target.value as OcrScenario)}
          className="h-10 text-xs font-medium"
        >
          <option value="match">{t('scenarioMatch')}</option>
          <option value="slight_mismatch">{t('scenarioSlight')}</option>
          <option value="mismatch">{t('scenarioMismatch')}</option>
        </Select>
      </div>

      {/* Visual Scanner Box with Scanline Animation */}
      <div className="relative rounded-xl border border-slate-200 bg-slate-900 text-white p-4 overflow-hidden min-h-[140px] flex items-center justify-center">
        {/* Animated Scan Line */}
        <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-500 shadow-md shadow-cyan-400/50 animate-scan pointer-events-none" />

        <div className="relative z-10 text-center space-y-1">
          <Scan className="w-8 h-8 text-cyan-400 mx-auto animate-pulse" />
          <span className="font-mono text-xs text-cyan-200 block">
            Aadhaar Edge Verification Frame
          </span>
          <span className="font-mono text-[11px] text-slate-400 block">
            ID: XXXX XXXX 4821 • Indian Union Resident
          </span>
        </div>
      </div>

      {/* Extracted Fields & Comparison */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        {/* Applicant Input Field (Editable) */}
        <div className="space-y-1.5">
          <Label htmlFor="applicant-name" className="text-slate-600 flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-indigo-600" />
            <span>{t('ocrApplicantName')}</span>
          </Label>
          <Input
            id="applicant-name"
            value={applicantName}
            onChange={(e) => onApplicantNameChange(e.target.value)}
            className="font-semibold text-slate-900"
          />
        </div>

        {/* OCR Extracted Field */}
        <div className="space-y-1.5">
          <span className="text-slate-600 font-semibold flex items-center gap-1">
            <CreditCard className="w-3.5 h-3.5 text-indigo-600" />
            <span>{t('ocrDetectedName')}</span>
          </span>
          <div className="h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center font-mono font-bold text-slate-900">
            {ocr ? ocr.extractedName : 'Analyzing...'}
          </div>
        </div>
      </div>

      {/* Match Result Status Banner */}
      {ocr && (
        <div
          className={`p-3.5 rounded-xl border flex items-center gap-2.5 text-xs font-semibold ${
            ocr.status === 'match'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : ocr.status === 'possible_mismatch'
              ? 'bg-amber-50 border-amber-200 text-amber-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
        >
          {ocr.status === 'match' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
          {ocr.status === 'possible_mismatch' && (
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          )}
          {ocr.status === 'mismatch' && <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}

          <span>
            {ocr.status === 'match'
              ? t('ocrStatusMatch')
              : ocr.status === 'possible_mismatch'
              ? t('ocrStatusPossible')
              : t('ocrStatusFail')}
          </span>
          <span className="ml-auto font-mono text-[11px] font-bold">
            Sim: {Math.round(ocr.similarity * 100)}%
          </span>
        </div>
      )}
    </div>
  );
}
