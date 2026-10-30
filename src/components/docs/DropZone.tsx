'use client';

import React, { useState, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { UploadCloud, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DropZoneProps {
  onFileSelect: (file: File) => void;
}

export function DropZone({ onFileSelect }: DropZoneProps) {
  const { t } = useApp();
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label="Upload document dropzone"
      className={cn(
        'relative rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-4 focus:outline-none focus:ring-2 focus:ring-indigo-600',
        isDragOver
          ? 'border-indigo-600 bg-indigo-50/70 scale-[1.01]'
          : 'border-slate-300 hover:border-indigo-400 bg-white hover:bg-slate-50/50'
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf"
        onChange={handleInputChange}
        className="hidden"
      />

      <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-xs">
        <UploadCloud className="w-8 h-8" />
      </div>

      <div className="space-y-1">
        <h4 className="text-base font-bold text-slate-900">
          {t('dropzoneTitle')}
        </h4>
        <p className="text-xs text-slate-500">
          {t('dropzoneSub')}
        </p>
      </div>

      {/* Privacy Guarantee Pill */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium">
        <Shield className="w-3.5 h-3.5 text-emerald-600" />
        <span>{t('privacyNotice')}</span>
      </div>
    </div>
  );
}
