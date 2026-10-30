'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Application, StudentProfile, BilingualText, Scheme } from '@/types';
import { getInitialApplications } from '@/data/mockApplications';
import { translations, Language, TranslationKey } from '@/lib/i18n';

export type TextSize = 'normal' | 'large';

interface AppState {
  language: Language;
  textSize: TextSize;
  profile: StudentProfile;
  applications: Application[];
  selectedAppId: string;
}

export const DEMO_PROFILE: StudentProfile = {
  state: 'Uttar Pradesh',
  level: 'ug',
  category: 'obc',
  isFemale: true,
  isMinority: false,
  hasDisability: false,
  annualIncome: 240000,
};

type Action =
  | { type: 'SET_LANGUAGE'; payload: Language }
  | { type: 'SET_TEXT_SIZE'; payload: TextSize }
  | { type: 'SET_PROFILE'; payload: Partial<StudentProfile> }
  | { type: 'RESET_PROFILE' }
  | { type: 'RESET_DEMO' }
  | { type: 'SELECT_APPLICATION'; payload: string }
  | { type: 'CREATE_APPLICATION'; payload: { scheme: Scheme; applicantName?: string } }
  | { type: 'APPROVE_INO'; payload: { appId: string } }
  | { type: 'APPROVE_DNO'; payload: { appId: string } }
  | { type: 'REQUEST_DOC'; payload: { appId: string; note?: string } }
  | { type: 'SIMULATE_BREACH'; payload: { appId: string } }
  | { type: 'RESUBMIT_DOC'; payload: { appId: string } }
  | { type: 'SEND_REMINDER'; payload: { appId: string } };

const initialApps = getInitialApplications();

const initialState: AppState = {
  language: 'en',
  textSize: 'normal',
  profile: DEMO_PROFILE,
  applications: initialApps,
  selectedAppId: initialApps[0].id,
};

function appReducer(state: AppState, action: Action): AppState {
  const now = new Date();
  const hourMs = 60 * 60 * 1000;

  switch (action.type) {
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };

    case 'SET_TEXT_SIZE':
      return { ...state, textSize: action.payload };

    case 'SET_PROFILE':
      return { ...state, profile: { ...state.profile, ...action.payload } };

    case 'RESET_PROFILE':
      return { ...state, profile: DEMO_PROFILE };

    case 'RESET_DEMO': {
      const resetApps = getInitialApplications();
      return {
        ...state,
        profile: DEMO_PROFILE,
        applications: resetApps,
        selectedAppId: resetApps[0].id,
      };
    }

    case 'SELECT_APPLICATION':
      return { ...state, selectedAppId: action.payload };

    case 'CREATE_APPLICATION': {
      const { scheme, applicantName = 'Priya Sharma' } = action.payload;
      const newAppId = `APP-2026-${Math.floor(100000 + Math.random() * 900000)}`;
      const newApp: Application = {
        id: newAppId,
        schemeId: scheme.id,
        schemeName: scheme.name,
        applicantName,
        status: 'AT_INO',
        submittedAt: now.toISOString(),
        updatedAt: now.toISOString(),
        slaDueAt: new Date(now.getTime() + 72 * hourMs).toISOString(),
        slaPaused: false,
        slaBreached: false,
        escalatedToSno: false,
        queuePosition: 8,
        queueTotal: 45,
        deskInfo: {
          name: 'Prof. S. Iyer',
          designation: 'Institute Nodal Officer (INO)',
          office: 'Dean of Student Affairs Office, College Admin Block',
          desk: 'Desk 1, Verification Cell',
          hours: 'Mon-Sat 10:00-16:00',
        },
        events: [
          {
            timestamp: now.toISOString(),
            actor: `${applicantName} (Applicant)`,
            action: 'Applicant Submitted',
            note: 'Application initiated via Setu Fast Apply. Dispatched to Institute Nodal Officer.',
          },
        ],
      };
      return {
        ...state,
        applications: [newApp, ...state.applications],
        selectedAppId: newAppId,
      };
    }

    case 'APPROVE_INO': {
      return {
        ...state,
        applications: state.applications.map((app) => {
          if (app.id !== action.payload.appId) return app;
          return {
            ...app,
            status: 'AT_DNO',
            updatedAt: now.toISOString(),
            slaDueAt: new Date(now.getTime() + 72 * hourMs).toISOString(),
            slaPaused: false,
            slaBreached: false,
            escalatedToSno: false,
            queuePosition: 14,
            queueTotal: 180,
            deskInfo: {
              name: 'Smt. Kavita Rao',
              designation: 'District Nodal Officer (DNO)',
              office: 'District Social Welfare Office, Collectorate Compound',
              desk: 'Desk 4',
              hours: 'Mon-Fri 10:00-17:00',
            },
            events: [
              {
                timestamp: now.toISOString(),
                actor: 'Dr. Anil Verma (INO)',
                action: 'INO Verification Approved',
                note: 'Institute scrutiny complete. Bonafide and fees validated. Forwarded to District Desk.',
              },
              ...app.events,
            ],
          };
        }),
      };
    }

    case 'APPROVE_DNO': {
      return {
        ...state,
        applications: state.applications.map((app) => {
          if (app.id !== action.payload.appId) return app;
          const randomDigits = Math.floor(100000 + Math.random() * 900000);
          return {
            ...app,
            status: 'DISBURSED',
            updatedAt: now.toISOString(),
            slaDueAt: now.toISOString(),
            slaPaused: false,
            slaBreached: false,
            escalatedToSno: false,
            queuePosition: 0,
            queueTotal: 0,
            disbursementRef: `DBT-DEMO-${randomDigits}`,
            disbursedAmount: 50000,
            disbursedBank: 'State Bank of India (XXXX 4821)',
            events: [
              {
                timestamp: now.toISOString(),
                actor: 'PFMS Direct Disbursal Cell',
                action: 'DBT Disbursal Successful',
                note: `Direct Benefit Transfer of ₹50,000 credited to student account. UTR: DBT-DEMO-${randomDigits}`,
              },
              {
                timestamp: new Date(now.getTime() - 1000).toISOString(),
                actor: 'Smt. Kavita Rao (DNO)',
                action: 'DNO Verification Approved',
                note: 'Eligibility criteria confirmed. Pushed to PFMS gateway for DBT release.',
              },
              ...app.events,
            ],
          };
        }),
      };
    }

    case 'REQUEST_DOC': {
      return {
        ...state,
        applications: state.applications.map((app) => {
          if (app.id !== action.payload.appId) return app;
          return {
            ...app,
            status: 'DOC_REQUESTED',
            updatedAt: now.toISOString(),
            slaPaused: true,
            docRequestNote: action.payload.note || 'Upload a clearer Aadhaar scan. Current scan is blurry or corners cut off.',
            events: [
              {
                timestamp: now.toISOString(),
                actor: 'Smt. Kavita Rao (DNO)',
                action: 'Additional Document Requested',
                note: action.payload.note || 'Defect flagged: Clear Aadhaar scan required (max 200 KB). SLA timer paused.',
              },
              ...app.events,
            ],
          };
        }),
      };
    }

    case 'SIMULATE_BREACH': {
      return {
        ...state,
        applications: state.applications.map((app) => {
          if (app.id !== action.payload.appId) return app;
          return {
            ...app,
            slaBreached: true,
            escalatedToSno: true,
            updatedAt: now.toISOString(),
            slaDueAt: new Date(now.getTime() + 24 * hourMs).toISOString(),
            deskInfo: {
              name: 'Shri Vikram Malhotra, IAS',
              designation: 'State Nodal Officer (SNO)',
              office: 'State Directorate of Social Welfare & Backward Classes',
              desk: 'Appeals & Escalations Cell, Room 408',
              hours: 'Mon-Fri 09:30-17:30',
            },
            events: [
              {
                timestamp: now.toISOString(),
                actor: 'Automated SLA Monitor',
                action: 'SLA Breached & Escalated to SNO',
                note: 'Desk failed to resolve within statutory deadline. Escalated to State Nodal Officer under Right to Public Service Guarantee.',
              },
              ...app.events,
            ],
          };
        }),
      };
    }

    case 'RESUBMIT_DOC': {
      return {
        ...state,
        applications: state.applications.map((app) => {
          if (app.id !== action.payload.appId) return app;
          return {
            ...app,
            status: 'AT_DNO',
            updatedAt: now.toISOString(),
            slaDueAt: new Date(now.getTime() + 72 * hourMs).toISOString(),
            slaPaused: false,
            docRequestNote: undefined,
            events: [
              {
                timestamp: now.toISOString(),
                actor: `${app.applicantName} (Applicant)`,
                action: 'Document Resubmitted',
                note: 'Auto-compressed Aadhaar scan submitted (148 KB). Sharpness and name match verified by Setu Health Check.',
              },
              ...app.events,
            ],
          };
        }),
      };
    }

    case 'SEND_REMINDER': {
      return {
        ...state,
        applications: state.applications.map((app) => {
          if (app.id !== action.payload.appId) return app;
          if (app.reminderSent) return app;
          return {
            ...app,
            reminderSent: true,
            events: [
              {
                timestamp: now.toISOString(),
                actor: `${app.applicantName} (Applicant)`,
                action: 'Reminder Ping Sent',
                note: 'Polite verification prompt delivered to officer portal desk queue.',
              },
              ...app.events,
            ],
          };
        }),
      };
    }

    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  getText: (bilingual: BilingualText) => string;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    document.documentElement.lang = state.language;
  }, [state.language]);

  function t(key: TranslationKey, params?: Record<string, string | number>): string {
    const langDict = translations[state.language] || translations.en;
    let str: string = (langDict as Record<string, string>)[key] || (translations.en as Record<string, string>)[key] || key;
    if (params) {
      Object.entries(params).forEach(([paramKey, val]) => {
        str = str.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(val));
      });
    }
    return str;
  }

  function getText(bilingual: BilingualText): string {
    return state.language === 'hi' ? bilingual.hi : bilingual.en;
  }

  return (
    <AppContext.Provider value={{ state, dispatch, t, getText }}>
      <div className={state.textSize === 'large' ? 'text-lg leading-relaxed' : 'text-base'}>
        {children}
      </div>
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
