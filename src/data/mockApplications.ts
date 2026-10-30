import { Application } from '@/types';

export function getInitialApplications(): Application[] {
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const hourMs = 60 * 60 * 1000;

  return [
    {
      id: 'APP-2026-104233',
      schemeId: 'pragati',
      schemeName: {
        en: 'AICTE Pragati Scholarship for Girl Students',
        hi: 'छात्राओं के लिए एआईसीटीई प्रगति छात्रवृत्ति',
      },
      applicantName: 'Priya Sharma',
      status: 'AT_DNO',
      submittedAt: new Date(now - 9 * dayMs).toISOString(),
      updatedAt: new Date(now - 5 * dayMs).toISOString(),
      slaDueAt: new Date(now + 52 * hourMs).toISOString(),
      slaPaused: false,
      slaBreached: false,
      escalatedToSno: false,
      queuePosition: 14,
      queueTotal: 212,
      deskInfo: {
        name: 'Smt. Kavita Rao',
        designation: 'District Nodal Officer (DNO)',
        office: 'District Social Welfare Office, Collectorate Compound, Lucknow',
        desk: 'Desk 4',
        hours: 'Mon-Fri 10:00-17:00',
      },
      events: [
        {
          timestamp: new Date(now - 9 * dayMs).toISOString(),
          actor: 'Priya Sharma (Applicant)',
          action: 'Applicant Submitted',
          note: 'Application submitted via Setu Fast Apply with Aadhaar e-KYC',
        },
        {
          timestamp: new Date(now - 5 * dayMs).toISOString(),
          actor: 'Dr. Anil Verma (INO)',
          action: 'INO Verification Completed',
          note: 'Academic records, enrollment fee receipt, and bonafide credentials verified. Forwarded to District level.',
        },
        {
          timestamp: new Date(now - 4 * dayMs).toISOString(),
          actor: 'System / DNO Workflow',
          action: 'Assigned to District Desk',
          note: 'Allocated to Smt. Kavita Rao (DNO Desk 4). Queue position #14.',
        },
      ],
    },
    {
      id: 'APP-2026-097810',
      schemeId: 'yasasvi',
      schemeName: {
        en: 'PM YASASVI Post-Matric Scholarship for OBC, EBC and DNT',
        hi: 'ओबीसी, ईबीसी और डीएनटी के लिए पीएम यशस्वी पोस्ट-मैट्रिक छात्रवृत्ति',
      },
      applicantName: 'Priya Sharma',
      status: 'AT_INO',
      submittedAt: new Date(now - 11 * dayMs).toISOString(),
      updatedAt: new Date(now - 11 * dayMs).toISOString(),
      slaDueAt: new Date(now + 20 * hourMs).toISOString(),
      slaPaused: false,
      slaBreached: false,
      escalatedToSno: false,
      queuePosition: 3,
      queueTotal: 40,
      deskInfo: {
        name: 'Prof. S. Iyer',
        designation: 'Institute Nodal Officer (INO)',
        office: 'Dean of Student Affairs Office, Govt Engineering College',
        desk: 'Administrative Block, Room 102',
        hours: 'Mon-Sat 10:30-16:30',
      },
      events: [
        {
          timestamp: new Date(now - 11 * dayMs).toISOString(),
          actor: 'Priya Sharma (Applicant)',
          action: 'Applicant Submitted',
          note: 'Application submitted with OBC Certificate & Income Certificate',
        },
        {
          timestamp: new Date(now - 10 * dayMs).toISOString(),
          actor: 'Institute Portal',
          action: 'Queued for College Scrutiny',
          note: 'Assigned to Prof. S. Iyer. Verification queue position #3 of 40.',
        },
      ],
    },
    {
      id: 'APP-2026-081155',
      schemeId: 'nmmss',
      schemeName: {
        en: 'National Means-cum-Merit Scholarship',
        hi: 'राष्ट्रीय साधन-सह-योग्यता छात्रवृत्ति योजना',
      },
      applicantName: 'Priya Sharma',
      status: 'DISBURSED',
      submittedAt: new Date(now - 75 * dayMs).toISOString(),
      updatedAt: new Date(now - 15 * dayMs).toISOString(),
      slaDueAt: new Date(now - 15 * dayMs).toISOString(),
      slaPaused: false,
      slaBreached: false,
      escalatedToSno: false,
      queuePosition: 0,
      queueTotal: 0,
      disbursementRef: 'DBT-DEMO-000123',
      disbursedAmount: 12000,
      disbursedBank: 'State Bank of India (XXXX 4821)',
      deskInfo: {
        name: 'PFMS DBT Automation Gateway',
        designation: 'Public Financial Management System',
        office: 'Ministry of Finance / MoE Disbursal Cell',
        desk: 'Automated NACH Clearing',
        hours: '24x7 Core Banking Direct Credit',
      },
      events: [
        {
          timestamp: new Date(now - 75 * dayMs).toISOString(),
          actor: 'Priya Sharma (Applicant)',
          action: 'Applicant Submitted',
          note: 'Application submitted for Class 12 renewal cycle',
        },
        {
          timestamp: new Date(now - 45 * dayMs).toISOString(),
          actor: 'Shri R. K. Dixit (INO)',
          action: 'INO Verification Approved',
          note: 'Passed 85% attendance and Class 11 promotional marksheet verified',
        },
        {
          timestamp: new Date(now - 28 * dayMs).toISOString(),
          actor: 'Smt. Anjali Mehra (DNO)',
          action: 'DNO Verification Approved',
          note: 'Merit quota authenticated and recommended for payment push',
        },
        {
          timestamp: new Date(now - 15 * dayMs).toISOString(),
          actor: 'PFMS Central Disbursal Engine',
          action: 'DBT Disbursal Successful',
          note: 'Direct Benefit Transfer ₹12,000 credited to Aadhaar-linked Bank A/C ending in 4821. UTR: DBT-DEMO-000123',
        },
      ],
    },
  ];
}
