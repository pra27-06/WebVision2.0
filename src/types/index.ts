export type CourseLevel = 'class11_12' | 'diploma' | 'ug' | 'pg' | 'phd';
export type Category = 'general' | 'ews' | 'obc' | 'sc' | 'st';
export type DocKind = 'aadhaar' | 'income' | 'caste' | 'bank' | 'marksheet' | 'photo';
export type AppStatus = 'AT_INO' | 'AT_DNO' | 'DOC_REQUESTED' | 'DISBURSED';

export interface BilingualText {
  en: string;
  hi: string;
}

export interface SoftCriteria {
  penalty: number;
  note: BilingualText;
}

export interface Scheme {
  id: string;
  name: BilingualText;
  provider: BilingualText;
  summary: BilingualText;
  levels: CourseLevel[];
  states: 'ALL' | string[];
  categories: 'ALL' | Category[];
  maxIncome: number;
  femaleOnly?: boolean;
  requiresMinority?: boolean;
  requiresDisability?: boolean;
  soft?: SoftCriteria;
  benefitPerYear: number;
  deadlineInDays: number;
  documents: DocKind[];
}

export interface StudentProfile {
  state: string;
  level: CourseLevel;
  category: Category;
  isFemale: boolean;
  isMinority: boolean;
  hasDisability: boolean;
  annualIncome: number;
}

export type EligibilityReasonKind = 'pass' | 'fail' | 'verify';

export interface EligibilityReason {
  kind: EligibilityReasonKind;
  text: BilingualText;
}

export interface EligibilityResult {
  score: number;
  tier: 'eligible' | 'likely' | 'ineligible';
  reasons: EligibilityReason[];
}

export interface EventLogItem {
  timestamp: string; // ISO string
  actor: string;
  action: string;
  note: string;
}

export interface OfficerDeskInfo {
  name: string;
  designation: string;
  office: string;
  desk: string;
  hours: string;
}

export interface Application {
  id: string;
  schemeId: string;
  schemeName: BilingualText;
  applicantName: string;
  status: AppStatus;
  submittedAt: string; // ISO string
  updatedAt: string; // ISO string
  slaDueAt: string; // ISO string
  slaPaused?: boolean;
  slaBreached?: boolean;
  escalatedToSno?: boolean;
  queuePosition: number;
  queueTotal: number;
  deskInfo: OfficerDeskInfo;
  disbursementRef?: string;
  disbursedAmount?: number;
  disbursedBank?: string;
  docRequestNote?: string;
  reminderSent?: boolean;
  events: EventLogItem[];
}
