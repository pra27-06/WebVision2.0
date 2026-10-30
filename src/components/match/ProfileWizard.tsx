'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { TranslationKey } from '@/lib/i18n';
import { CourseLevel, Category } from '@/types';
import { INDIAN_STATES } from '@/lib/states';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/Select';
import { Slider } from '@/components/ui/Slider';
import { Switch } from '@/components/ui/Switch';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatCurrencyINR, cn } from '@/lib/utils';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Check,
  GraduationCap,
  MapPin,
  ShieldCheck,
  IndianRupee,
} from 'lucide-react';

export function ProfileWizard() {
  const { state, dispatch, t } = useApp();
  const { profile } = state;
  const [currentStep, setCurrentStep] = useState<number>(1);

  const courseLevels: { value: CourseLevel; labelKey: TranslationKey }[] = [
    { value: 'class11_12', labelKey: 'levelClass11_12' },
    { value: 'diploma', labelKey: 'levelDiploma' },
    { value: 'ug', labelKey: 'levelUg' },
    { value: 'pg', labelKey: 'levelPg' },
    { value: 'phd', labelKey: 'levelPhd' },
  ];

  const categories: { value: Category; labelKey: TranslationKey }[] = [
    { value: 'general', labelKey: 'catGeneral' },
    { value: 'ews', labelKey: 'catEws' },
    { value: 'obc', labelKey: 'catObc' },
    { value: 'sc', labelKey: 'catSc' },
    { value: 'st', labelKey: 'catSt' },
  ];

  const handleTryDemoProfile = () => {
    dispatch({
      type: 'SET_PROFILE',
      payload: {
        state: 'Uttar Pradesh',
        level: 'ug',
        category: 'obc',
        isFemale: true,
        isMinority: false,
        hasDisability: false,
        annualIncome: 240000,
      },
    });
  };

  const handleIncomeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    const num = Number(rawValue);
    if (!isNaN(num)) {
      dispatch({
        type: 'SET_PROFILE',
        payload: { annualIncome: Math.min(1000000, Math.max(0, num)) },
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
      {/* Top Bar: Title & Demo Shortcut */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            {t('matchTitle')}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('stepIndicator', { current: currentStep, total: 3 })}
          </p>
        </div>

        <button
          type="button"
          onClick={handleTryDemoProfile}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 text-xs font-semibold transition-all shadow-2xs min-h-[44px] focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>{t('tryDemoProfile')}</span>
        </button>
      </div>

      {/* Step Indicators */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { step: 1, label: t('step1Title') },
          { step: 2, label: t('step2Title') },
          { step: 3, label: t('step3Title') },
        ].map((s) => (
          <button
            key={s.step}
            type="button"
            onClick={() => setCurrentStep(s.step)}
            className={cn(
              'flex flex-col text-left py-2 px-3 rounded-xl border transition-all text-xs font-medium min-h-[44px]',
              currentStep === s.step
                ? 'border-indigo-600 bg-indigo-50/60 text-indigo-900 font-bold'
                : currentStep > s.step
                ? 'border-emerald-300 bg-emerald-50/40 text-emerald-800'
                : 'border-slate-200 text-slate-500 hover:border-slate-300'
            )}
          >
            <span className="text-[10px] uppercase tracking-wider text-slate-400">
              Step {s.step}
            </span>
            <span className="truncate">{s.label}</span>
          </button>
        ))}
      </div>

      {/* Step Content */}
      <div className="min-h-[280px]">
        {/* STEP 1: State & Course Level */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Domicile State */}
            <div className="space-y-2">
              <Label htmlFor="state-select" className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-indigo-600" />
                <span>{t('selectState')}</span>
              </Label>
              <Select
                id="state-select"
                value={profile.state}
                onChange={(e) =>
                  dispatch({
                    type: 'SET_PROFILE',
                    payload: { state: e.target.value },
                  })
                }
              >
                {INDIAN_STATES.map((st) => (
                  <option key={st.id} value={st.id}>
                    {state.language === 'hi' ? `${st.hi} (${st.en})` : st.en}
                  </option>
                ))}
              </Select>
            </div>

            {/* Course Level (Segmented Options) */}
            <div className="space-y-2.5">
              <Label className="flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                <span>{t('selectLevel')}</span>
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {courseLevels.map((lvl) => {
                  const isSelected = profile.level === lvl.value;
                  return (
                    <button
                      key={lvl.value}
                      type="button"
                      onClick={() =>
                        dispatch({
                          type: 'SET_PROFILE',
                          payload: { level: lvl.value },
                        })
                      }
                      className={cn(
                        'flex items-center justify-between p-3.5 rounded-xl border text-left text-sm transition-all min-h-[48px]',
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-semibold shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                      )}
                    >
                      <span>{t(lvl.labelKey)}</span>
                      {isSelected && <Check className="w-4 h-4 text-indigo-600 ml-2 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Category & Toggles */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Social Category Chips */}
            <div className="space-y-2.5">
              <Label className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>{t('selectCategory')}</span>
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {categories.map((cat) => {
                  const isSelected = profile.category === cat.value;
                  return (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() =>
                        dispatch({
                          type: 'SET_PROFILE',
                          payload: { category: cat.value },
                        })
                      }
                      className={cn(
                        'flex items-center justify-between p-3.5 rounded-xl border text-left text-sm transition-all min-h-[48px]',
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold shadow-xs ring-1 ring-indigo-600'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                      )}
                    >
                      <span className="truncate">{t(cat.labelKey)}</span>
                      {isSelected && <Check className="w-4 h-4 text-indigo-600 shrink-0 ml-1" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Special Quota Toggles */}
            <div className="space-y-3.5 pt-2 border-t border-slate-100">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {t('specialToggles')}
              </Label>

              {/* Female Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                <div className="pr-4">
                  <span className="text-sm font-semibold text-slate-900 block">
                    {t('toggleFemale')}
                  </span>
                  <span className="text-xs text-slate-500">
                    Qualifies for AICTE Pragati and girl-child scholarships
                  </span>
                </div>
                <Switch
                  checked={profile.isFemale}
                  onCheckedChange={(val) =>
                    dispatch({
                      type: 'SET_PROFILE',
                      payload: { isFemale: val },
                    })
                  }
                  aria-label={t('toggleFemale')}
                />
              </div>

              {/* Minority Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                <div className="pr-4">
                  <span className="text-sm font-semibold text-slate-900 block">
                    {t('toggleMinority')}
                  </span>
                  <span className="text-xs text-slate-500">
                    Qualifies for MoMA schemes (Muslim, Christian, Sikh, etc.)
                  </span>
                </div>
                <Switch
                  checked={profile.isMinority}
                  onCheckedChange={(val) =>
                    dispatch({
                      type: 'SET_PROFILE',
                      payload: { isMinority: val },
                    })
                  }
                  aria-label={t('toggleMinority')}
                />
              </div>

              {/* Disability Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                <div className="pr-4">
                  <span className="text-sm font-semibold text-slate-900 block">
                    {t('toggleDisability')}
                  </span>
                  <span className="text-xs text-slate-500">
                    Qualifies for AICTE Saksham and special PwD benefits
                  </span>
                </div>
                <Switch
                  checked={profile.hasDisability}
                  onCheckedChange={(val) =>
                    dispatch({
                      type: 'SET_PROFILE',
                      payload: { hasDisability: val },
                    })
                  }
                  aria-label={t('toggleDisability')}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Family Annual Income */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1">
              <Label htmlFor="income-input" className="flex items-center gap-1.5">
                <IndianRupee className="w-4 h-4 text-indigo-600" />
                <span>{t('incomeSliderLabel')}</span>
              </Label>
              <p className="text-xs text-slate-500">{t('incomeSliderHelp')}</p>
            </div>

            {/* Income Display Box & Numeric Input */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-slate-600 font-medium">
                  {t('incomeCurrent')}
                </span>
                <span className="text-2xl font-black font-mono tabular-nums text-indigo-700">
                  {formatCurrencyINR(profile.annualIncome)}
                </span>
              </div>

              {/* Interactive Range Slider */}
              <Slider
                min={0}
                max={1000000}
                step={10000}
                value={profile.annualIncome}
                onValueChange={(val) =>
                  dispatch({
                    type: 'SET_PROFILE',
                    payload: { annualIncome: val },
                  })
                }
                aria-label="Annual family income slider"
              />

              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>₹0</span>
                <span>₹2,50,000 (OBC/SC/ST Cap)</span>
                <span>₹4,50,000</span>
                <span>₹8,00,000</span>
                <span>₹10,00,000+</span>
              </div>

              {/* Direct Numeric Input with Indian grouping */}
              <div className="pt-2">
                <Label htmlFor="income-manual" className="text-xs text-slate-600 mb-1.5 block">
                  Or enter exact amount in ₹:
                </Label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                    ₹
                  </span>
                  <Input
                    id="income-manual"
                    type="text"
                    value={profile.annualIncome.toLocaleString('en-IN')}
                    onChange={handleIncomeInputChange}
                    className="pl-8 font-mono font-semibold"
                    aria-label="Direct annual income input in Rupees"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons: Back / Next */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <Button
          type="button"
          variant="secondary"
          disabled={currentStep === 1}
          onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{t('back')}</span>
        </Button>

        {currentStep < 3 ? (
          <Button
            type="button"
            variant="primary"
            onClick={() => setCurrentStep((prev) => Math.min(3, prev + 1))}
            className="flex items-center gap-1"
          >
            <span>{t('next')}</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
            <Check className="w-4 h-4" />
            <span>Profile Complete</span>
          </div>
        )}
      </div>
    </div>
  );
}
