'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Type } from 'lucide-react';

export function TextSizeToggle() {
  const { state, dispatch, t } = useApp();

  const toggleSize = () => {
    const nextSize = state.textSize === 'normal' ? 'large' : 'normal';
    dispatch({ type: 'SET_TEXT_SIZE', payload: nextSize });
  };

  return (
    <button
      type="button"
      onClick={toggleSize}
      title={t('textSizeToggle')}
      aria-label={`${t('textSizeToggle')}: ${state.textSize === 'normal' ? t('textSizeLarge') : t('textSizeNormal')}`}
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 font-medium text-xs transition-all shadow-2xs min-h-[44px] focus:outline-none focus:ring-2 focus:ring-indigo-600"
    >
      <Type className="w-3.5 h-3.5 text-indigo-600" />
      <span>{state.textSize === 'normal' ? 'A+' : 'A'}</span>
    </button>
  );
}
