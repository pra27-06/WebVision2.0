'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { OcrResult, OcrScenario } from '@/lib/ocrMock';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import {
  Scan,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Cpu,
  User,
  CreditCard,
  ShieldCheck,
  Check,
  Eye,
} from 'lucide-react';

interface OcrPreviewProps {
  ocr: (OcrResult & { rawText?: string; qualityGuidance?: string[]; provider?: string; disclaimer?: string }) | null;
  applicantName: string;
  onApplicantNameChange: (name: string) => void;
  scenario: OcrScenario;
  onScenarioChange: (scenario: OcrScenario) => void;
  isConfirmed?: boolean;
  onConfirmChange?: (confirmed: boolean) => void;
}

export function OcrPreview({
  ocr,
  applicantName,
  onApplicantNameChange,
  scenario,
  onScenarioChange,
  isConfirmed,
  onConfirmChange,
}: OcrPreviewProps) {
  const { t } = useApp();
  const [internalConfirmed, setInternalConfirmed] = useState(false);
  const [showRawText, setShowRawText] = useState(false);

  const isConfirmedByUser = isConfirmed !== undefined ? isConfirmed : internalConfirmed;
  const setConfirmed = (val: boolean) => {
    setInternalConfirmed(val);
    onConfirmChange?.(val);
  };

  const providerLabel = ocr?.provider || 'Google Gemini Vision / Edge OCR';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-6 shadow-xs">
      {/* Header with Provider Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Scan className="w-4 h-4 text-indigo-600" />
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            {t('ocrTitle')}
          </h4>
        </div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-800 font-mono text-[11px] border border-indigo-200">
          <Cpu className="w-3 h-3 text-indigo-600" />
          <span>{providerLabel}</span>
        </div>
      </div>

      {/* Demo Scenario Selector for presenter */}
      <div className="bg-indigo-50/50 rounded-xl p-3.5 border border-indigo-100 space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="scenario-select" className="text-xs font-semibold text-indigo-900">
            {t('ocrScenarioLabel')} (Presenter Override)
          </Label>
          <span className="text-[10px] text-indigo-600 font-mono">Simulate Mismatch</span>
        </div>
        <Select
          id="scenario-select"
          value={scenario}
          onChange={(e) => {
            onScenarioChange(e.target.value as OcrScenario);
            setConfirmed(false);
          }}
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
            Masked Identifier: {ocr?.maskedId || 'XXXX XXXX 4821'}
          </span>
        </div>
      </div>

      {/* Extracted Fields & Comparison */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        {/* Applicant Input Field (Editable) */}
        <div className="space-y-1.5">
          <Label htmlFor="applicant-name" className="text-slate-600 flex items-center gap-1 font-semibold">
            <User className="w-3.5 h-3.5 text-indigo-600" />
            <span>{t('ocrApplicantName')}</span>
          </Label>
          <Input
            id="applicant-name"
            value={applicantName}
            onChange={(e) => {
              onApplicantNameChange(e.target.value);
              setConfirmed(false);
            }}
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

      {/* Quality Guidance & Preview Drawer */}
      <div className="space-y-2 border-t border-slate-100 pt-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Image Quality & Guidance:</span>
          </span>
          <button
            type="button"
            onClick={() => setShowRawText(!showRawText)}
            className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
          >
            <Eye className="w-3 h-3" />
            <span>{showRawText ? 'Hide Raw Text' : 'View Extracted Text'}</span>
          </button>
        </div>

        <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
          <li>Resolution passes official NSP requirement (minimum 600px width).</li>
          <li>Contrast and edge sharpness verified above threshold.</li>
          <li>No Aadhaar number or biometric data is ever stored on a server.</li>
        </ul>

        {showRawText && (
          <div className="bg-slate-900 text-cyan-300 font-mono text-[11px] p-3 rounded-xl overflow-x-auto max-h-32 border border-slate-800">
            {ocr?.rawText || `NAME: ${ocr?.extractedName || applicantName}\nMASKED ID: XXXX XXXX 4821\nDOB: 12/08/2005\nADDRESS: Village Rampur, Lucknow, UP`}
          </div>
        )}
      </div>

      {/* User Confirmation Checkbox */}
      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
        <div className="text-xs text-slate-700">
          <span className="font-semibold block">Applicant Confirmation:</span>
          <span className="text-[11px] text-slate-500">
            I verify that the extracted name matches my educational bonafide records.
          </span>
        </div>
        <Button
          type="button"
          size="sm"
          variant={isConfirmedByUser ? 'success' : 'outline'}
          onClick={() => setConfirmed(!isConfirmedByUser)}
          className="text-xs shrink-0 ml-3"
        >
          {isConfirmedByUser ? (
            <div className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>Confirmed</span>
            </div>
          ) : (
            <span>Confirm Extracted Data</span>
          )}
        </Button>
      </div>

      {/* Privacy Notice Disclaimer */}
      <p className="text-[10px] text-slate-400 text-center leading-normal">
        Disclaimer: This automated check assists in preventing portal upload defects. It does not replace official authentication by the Institute Nodal Officer (INO) or UIDAI.
      </p>
    </div>
  );
}
