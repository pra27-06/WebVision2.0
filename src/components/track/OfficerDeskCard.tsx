'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Application } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import {
  UserCheck,
  Send,
  CheckCircle,
  HelpCircle,
  Users,
} from 'lucide-react';

interface OfficerDeskCardProps {
  application: Application;
}

export function OfficerDeskCard({ application }: OfficerDeskCardProps) {
  const { dispatch, t } = useApp();
  const { deskInfo, queuePosition, queueTotal, reminderSent, id } = application;

  const handleSendReminder = () => {
    dispatch({ type: 'SEND_REMINDER', payload: { appId: id } });
  };

  // Progress through queue (e.g., if queue position is 14 out of 212, processed percentage is (212 - 14) / 212 * 100)
  const queuePercentage =
    queueTotal > 0 ? Math.round(((queueTotal - queuePosition) / queueTotal) * 100) : 100;

  return (
    <Card className="border border-slate-200 bg-white p-5 sm:p-6 space-y-6 shadow-xs">
      {/* Title & Desk Identification */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-100">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900">{t('deskCardTitle')}</h4>
            <p className="text-xs text-slate-500">{deskInfo.designation}</p>
          </div>
        </div>

        {/* Send Reminder Action Button */}
        {application.status !== 'DISBURSED' && (
          <Button
            type="button"
            variant={reminderSent ? 'secondary' : 'outline'}
            size="sm"
            disabled={reminderSent}
            onClick={handleSendReminder}
            className="flex items-center gap-1.5 self-start sm:self-auto min-h-[40px]"
          >
            {reminderSent ? (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>{t('reminderSentBadge')}</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 text-indigo-600" />
                <span>{t('sendReminderBtn')}</span>
              </>
            )}
          </Button>
        )}
      </div>

      {/* Desk Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="space-y-1">
          <span className="text-slate-500 font-medium block">{t('deskOfficer')}:</span>
          <span className="text-slate-900 font-bold text-sm">{deskInfo.name}</span>
        </div>

        <div className="space-y-1">
          <span className="text-slate-500 font-medium block">{t('deskNumber')}:</span>
          <span className="text-slate-800 font-semibold">{deskInfo.desk}</span>
        </div>

        <div className="space-y-1">
          <span className="text-slate-500 font-medium block">{t('deskOffice')}:</span>
          <span className="text-slate-800 leading-normal">{deskInfo.office}</span>
        </div>

        <div className="space-y-1">
          <span className="text-slate-500 font-medium block">{t('deskHours')}:</span>
          <span className="text-slate-800 font-mono">{deskInfo.hours}</span>
        </div>
      </div>

      {/* Live Queue Position Bar */}
      {queueTotal > 0 && application.status !== 'DISBURSED' && (
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-indigo-600" />
              <span>{t('queuePosLabel')}</span>
            </span>
            <span className="font-mono font-bold text-indigo-700 text-sm">
              #{queuePosition} of {queueTotal}
            </span>
          </div>

          <Progress value={queuePercentage} className="h-2" />

          <p className="text-[11px] text-slate-500">
            {t('queueSubtext', { pos: queuePosition, total: queueTotal })}
          </p>
        </div>
      )}

      {/* Why is this pending? */}
      {application.status !== 'DISBURSED' && (
        <div className="border-t border-slate-100 pt-4 space-y-2">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
            <span>{t('whyPendingTitle')}</span>
          </h5>
          <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside">
            <li>{t('whyPendingBullet1')}</li>
            <li>{t('whyPendingBullet2')}</li>
            <li>{t('whyPendingBullet3')}</li>
          </ul>
        </div>
      )}
    </Card>
  );
}
