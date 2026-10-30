'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Languages } from 'lucide-react';

export function LangToggle() {
  const { state, dispatch, t } = useApp();

  const toggleLanguage = () => {
    const nextLang = state.language === 'en' ? 'hi' : 'en';
    dispatch({ type: 'SET_LANGUAGE', payload: nextLang });
  };

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      aria-label={t('langAria')}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 font-medium text-sm transition-all shadow-2xs min-h-[44px] focus:outline-none focus:ring-2 focus:ring-indigo-600"
    >
      <Languages className="w-4 h-4 text-indigo-600" />
      <span>{t('langToggle')}</span>
    </button>
  );
}
