'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Application } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { ChevronRight, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

export function ApplicationPicker() {
  const { state, dispatch, t, getText } = useApp();
  const { applications, selectedAppId } = state;

  const getStatusBadge = (status: Application['status']) => {
    switch (status) {
      case 'AT_INO':
        return (
          <Badge variant="outline" className="text-[10px] bg-slate-50 text-slate-700">
            <Clock className="w-3 h-3 text-slate-500" />
            <span>INO Scrutiny</span>
          </Badge>
        );
      case 'AT_DNO':
        return (
          <Badge variant="default" className="text-[10px]">
            <Clock className="w-3 h-3 text-indigo-600" />
            <span>DNO Scrutiny</span>
          </Badge>
        );
      case 'DOC_REQUESTED':
        return (
          <Badge variant="warning" className="text-[10px]">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            <span>Doc Required</span>
          </Badge>
        );
      case 'DISBURSED':
        return (
          <Badge variant="success" className="text-[10px]">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>DBT Disbursed</span>
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          {t('myApplications')} ({applications.length})
        </h3>
      </div>

      <div className="space-y-3">
        {applications.map((app) => {
          const isSelected = app.id === selectedAppId;

          return (
            <button
              key={app.id}
              type="button"
              onClick={() =>
                dispatch({ type: 'SELECT_APPLICATION', payload: app.id })
              }
              className={cn(
                'w-full text-left p-4 rounded-2xl border transition-all flex flex-col space-y-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-600 min-h-[48px]',
                isSelected
                  ? 'bg-white border-indigo-600 ring-2 ring-indigo-600/20 shadow-md'
                  : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white text-slate-700'
              )}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-mono text-xs font-bold text-slate-900">
                  {app.id}
                </span>
                {getStatusBadge(app.status)}
              </div>

              <h4 className="text-sm font-bold text-slate-900 leading-snug line-clamp-1">
                {getText(app.schemeName)}
              </h4>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100 w-full">
                <span>{app.applicantName}</span>
                <span className="text-[11px] font-mono text-indigo-600 font-semibold flex items-center">
                  View Dominoes <ChevronRight className="w-3 h-3 ml-0.5" />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
