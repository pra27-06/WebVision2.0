'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Application } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
  Sliders,
  CheckCircle2,
  FileQuestion,
  AlertTriangle,
  RotateCcw,
  UploadCloud,
  Wrench,
} from 'lucide-react';

interface SimulatePanelProps {
  application: Application;
}

export function SimulatePanel({ application }: SimulatePanelProps) {
  const router = useRouter();
  const { dispatch, t } = useApp();
  const { id, status } = application;

  const handleApproveIno = () => {
    dispatch({ type: 'APPROVE_INO', payload: { appId: id } });
  };

  const handleApproveDno = () => {
    dispatch({ type: 'APPROVE_DNO', payload: { appId: id } });
  };

  const handleRequestDoc = () => {
    dispatch({ type: 'REQUEST_DOC', payload: { appId: id } });
  };

  const handleSimulateBreach = () => {
    dispatch({ type: 'SIMULATE_BREACH', payload: { appId: id } });
  };

  const handleSimulateResubmit = () => {
    dispatch({ type: 'RESUBMIT_DOC', payload: { appId: id } });
  };

  const handleFixNow = () => {
    router.push(`/docs?app=${id}`);
  };

  const handleResetDemo = () => {
    dispatch({ type: 'RESET_DEMO' });
  };

  return (
    <Card className="border-2 border-indigo-200 bg-indigo-50/40 p-5 rounded-2xl shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-indigo-700" />
          <h4 className="text-sm font-bold text-indigo-950 uppercase tracking-wider">
            {t('demoControlsTitle')}
          </h4>
        </div>
        <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
          State: {status}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {/* AT_INO Actions */}
        {status === 'AT_INO' && (
          <>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleApproveIno}
              className="flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{t('btnApproveIno')}</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRequestDoc}
              className="flex items-center gap-1.5"
            >
              <FileQuestion className="w-4 h-4" />
              <span>{t('btnRequestDoc')}</span>
            </Button>
          </>
        )}

        {/* AT_DNO Actions */}
        {status === 'AT_DNO' && (
          <>
            <Button
              type="button"
              variant="success"
              size="sm"
              onClick={handleApproveDno}
              className="flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{t('btnApproveDno')}</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRequestDoc}
              className="flex items-center gap-1.5"
            >
              <FileQuestion className="w-4 h-4" />
              <span>{t('btnRequestDoc')}</span>
            </Button>
            {!application.slaBreached && (
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={handleSimulateBreach}
                className="flex items-center gap-1.5"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>{t('btnSimulateBreach')}</span>
              </Button>
            )}
          </>
        )}

        {/* DOC_REQUESTED Actions */}
        {status === 'DOC_REQUESTED' && (
          <>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleFixNow}
              className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white"
            >
              <Wrench className="w-4 h-4" />
              <span>{t('btnFixNow')}</span>
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleSimulateResubmit}
              className="flex items-center gap-1.5"
            >
              <UploadCloud className="w-4 h-4" />
              <span>{t('btnSimulateResubmit')}</span>
            </Button>
          </>
        )}

        {/* DISBURSED Actions */}
        {status === 'DISBURSED' && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleResetDemo}
            className="flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t('resetDemo')}</span>
          </Button>
        )}
      </div>
    </Card>
  );
}
