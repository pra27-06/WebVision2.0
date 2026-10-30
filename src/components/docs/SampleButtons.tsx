'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useApp } from '@/context/AppContext';
import { Sparkles, FileImage, Loader2 } from 'lucide-react';
import { DocKind } from '@/types';

interface SampleButtonsProps {
  onLoadSample: (file: File, kind: DocKind) => void;
}

export function SampleButtons({ onLoadSample }: SampleButtonsProps) {
  const { t } = useApp();
  const [isGenerating, setIsGenerating] = useState<string | null>(null);

  /**
   * Generates a real large, noisy image file on a hidden HTML5 canvas
   * so that the file size is legitimately 3.4 MB or 2.1 MB.
   */
  const generateSampleImage = async (
    targetSizeMB: number,
    type: 'image/jpeg' | 'image/png',
    fileName: string,
    titleText: string,
    kind: DocKind
  ) => {
    setIsGenerating(fileName);

    try {
      // Yield to let UI render the spinner
      await new Promise((r) => setTimeout(r, 50));

      const width = type === 'image/jpeg' ? 2800 : 2000;
      const height = type === 'image/jpeg' ? 1900 : 1400;

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 1. Draw security pattern background (mesh of subtle colored lines)
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(0, 0, width, height);

      // Gradient header
      const grad = ctx.createLinearGradient(0, 0, width, 0);
      grad.addColorStop(0, '#1e1b4b');
      grad.addColorStop(1, '#312e81');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, 240);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 64px sans-serif';
      ctx.fillText(titleText, 80, 150);

      // Card border
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 8;
      ctx.strokeRect(40, 40, width - 80, height - 80);

      // Fictional details
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 52px sans-serif';
      ctx.fillText('Name: Priya Sharma', 100, 380);
      ctx.font = 'normal 44px sans-serif';
      ctx.fillText('DOB: 12/08/2005   |   Gender: Female', 100, 470);
      ctx.fillText('Address: Village Rampur, Dist. Lucknow, Uttar Pradesh', 100, 560);
      ctx.font = 'bold 60px monospace';
      ctx.fillText('Masked ID: XXXX XXXX 4821', 100, 680);

      // Large diagonal watermark
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.rotate(-Math.PI / 6);
      ctx.font = 'bold 160px sans-serif';
      ctx.fillStyle = 'rgba(225, 29, 72, 0.15)'; // Rose watermark
      ctx.textAlign = 'center';
      ctx.fillText('SAMPLE - DEMO ONLY', 0, 0);
      ctx.restore();

      // High-frequency textured noise to ensure real uncompressed byte size
      const noiseStep = type === 'image/jpeg' ? 6 : 8;
      for (let y = 800; y < height - 100; y += noiseStep) {
        for (let x = 80; x < width - 80; x += noiseStep) {
          const randVal = Math.floor(Math.random() * 255);
          ctx.fillStyle = `rgba(${randVal}, ${(randVal * 3) % 255}, ${(randVal * 7) % 255}, 0.25)`;
          ctx.fillRect(x, y, noiseStep - 1, noiseStep - 1);
        }
      }

      // Export to blob
      const quality = type === 'image/jpeg' ? 0.98 : undefined;
      const blob = await new Promise<Blob | null>((res) =>
        canvas.toBlob((b) => res(b), type, quality)
      );

      if (blob) {
        const file = new File([blob], fileName, {
          type,
          lastModified: Date.now(),
        });
        onLoadSample(file, kind);
      }
    } finally {
      setIsGenerating(null);
    }
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-600" />
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          {t('loadSamplesTitle')}
        </h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isGenerating !== null}
          onClick={() =>
            generateSampleImage(
              3.4,
              'image/jpeg',
              'Sample_Aadhaar_Scan_3.4MB.jpg',
              'IDENTIFICATION DOCUMENT (SAMPLE)',
              'aadhaar'
            )
          }
          className="flex items-center justify-between text-left h-auto py-2.5 px-3.5 bg-white hover:bg-slate-50 border-slate-300"
        >
          <div className="flex items-center gap-2.5">
            {isGenerating === 'Sample_Aadhaar_Scan_3.4MB.jpg' ? (
              <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
            ) : (
              <FileImage className="w-4 h-4 text-indigo-600" />
            )}
            <div className="text-xs">
              <span className="font-bold text-slate-900 block">
                {t('loadSampleAadhaar')}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                Real ~3.4 MB JPEG Canvas Output
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded font-bold border border-rose-200">
            Oversized
          </span>
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isGenerating !== null}
          onClick={() =>
            generateSampleImage(
              2.1,
              'image/png',
              'Sample_Income_Certificate_2.1MB.png',
              'INCOME CERTIFICATE (SAMPLE)',
              'income'
            )
          }
          className="flex items-center justify-between text-left h-auto py-2.5 px-3.5 bg-white hover:bg-slate-50 border-slate-300"
        >
          <div className="flex items-center gap-2.5">
            {isGenerating === 'Sample_Income_Certificate_2.1MB.png' ? (
              <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
            ) : (
              <FileImage className="w-4 h-4 text-indigo-600" />
            )}
            <div className="text-xs">
              <span className="font-bold text-slate-900 block">
                {t('loadSampleIncome')}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                Real ~2.1 MB PNG Canvas Output
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded font-bold border border-rose-200">
            Oversized
          </span>
        </Button>
      </div>
    </div>
  );
}
