import { Scheme, StudentProfile, EligibilityResult, EligibilityReason, RequirementAuditItem } from '@/types';
import { formatCurrencyINR } from '@/lib/utils';

export function evaluate(scheme: Scheme, profile: StudentProfile): EligibilityResult {
  const reasons: EligibilityReason[] = [];
  const auditItems: RequirementAuditItem[] = [];

  // 1. State check
  if (scheme.states !== 'ALL') {
    const stateMatched = scheme.states.includes(profile.state);
    if (!stateMatched) {
      const text = {
        en: `Only for residents of ${scheme.states.join(', ')} (Your state: ${profile.state})`,
        hi: `केवल ${scheme.states.join(', ')} के निवासियों के लिए (आपका राज्य: ${profile.state})`,
      };
      reasons.push({ kind: 'fail', text });
      auditItems.push({
        id: 'state',
        name: { en: 'State Domicile', hi: 'मूल निवास' },
        status: 'failed',
        explanation: text,
      });
      return { score: 0, tier: 'ineligible', reasons, auditItems };
    } else {
      const text = {
        en: `State ${profile.state} matches scheme residency requirement`,
        hi: `राज्य ${profile.state} निवास शर्त को पूरा करता है`,
      };
      reasons.push({ kind: 'pass', text });
      auditItems.push({
        id: 'state',
        name: { en: 'State Domicile', hi: 'मूल निवास' },
        status: 'satisfied',
        explanation: text,
      });
    }
  } else {
    const text = { en: 'Open to residents of all Indian States & UTs', hi: 'सभी भारतीय राज्यों एवं केंद्र शासित प्रदेशों हेतु मान्य' };
    auditItems.push({
      id: 'state',
      name: { en: 'All-India Domicile', hi: 'अखिल भारतीय निवास' },
      status: 'satisfied',
      explanation: text,
    });
  }

  // 2. Course Level check
  if (!scheme.levels.includes(profile.level)) {
    const text = {
      en: `Course level not covered (Scheme applies to: ${scheme.levels.map((l) => l.toUpperCase()).join(', ')})`,
      hi: `पाठ्यक्रम स्तर शामिल नहीं है (मान्य स्तर: ${scheme.levels.map((l) => l.toUpperCase()).join(', ')})`,
    };
    reasons.push({ kind: 'fail', text });
    auditItems.push({
      id: 'level',
      name: { en: 'Course Level', hi: 'पाठ्यक्रम स्तर' },
      status: 'failed',
      explanation: text,
    });
    return { score: 0, tier: 'ineligible', reasons, auditItems };
  } else {
    const text = {
      en: `Current level (${profile.level.toUpperCase()}) is eligible`,
      hi: `वर्तमान स्तर (${profile.level.toUpperCase()}) पात्र है`,
    };
    reasons.push({ kind: 'pass', text });
    auditItems.push({
      id: 'level',
      name: { en: 'Course Level', hi: 'पाठ्यक्रम स्तर' },
      status: 'satisfied',
      explanation: text,
    });
  }

  // 3. Category check
  if (scheme.categories !== 'ALL') {
    if (!scheme.categories.includes(profile.category)) {
      const text = {
        en: `Reserved for ${scheme.categories.map((c) => c.toUpperCase()).join(', ')} category (Selected: ${profile.category.toUpperCase()})`,
        hi: `केवल ${scheme.categories.map((c) => c.toUpperCase()).join(', ')} वर्ग हेतु आरक्षित (चयनित: ${profile.category.toUpperCase()})`,
      };
      reasons.push({ kind: 'fail', text });
      auditItems.push({
        id: 'category',
        name: { en: 'Social Category Quota', hi: 'सामाजिक श्रेणी कोटा' },
        status: 'failed',
        explanation: text,
      });
      return { score: 0, tier: 'ineligible', reasons, auditItems };
    } else {
      const text = {
        en: `Category ${profile.category.toUpperCase()} matches verified quota`,
        hi: `श्रेणी ${profile.category.toUpperCase()} कोटे से मेल खाती है`,
      };
      reasons.push({ kind: 'pass', text });
      auditItems.push({
        id: 'category',
        name: { en: 'Social Category Quota', hi: 'सामाजिक श्रेणी कोटा' },
        status: 'satisfied',
        explanation: text,
      });
    }
  } else {
    auditItems.push({
      id: 'category',
      name: { en: 'Universal Category', hi: 'सार्वभौमिक श्रेणी' },
      status: 'satisfied',
      explanation: { en: 'Open to all categories (General, OBC, SC, ST, EWS)', hi: 'सभी वर्गों के लिए खुला है' },
    });
  }

  // 4. Female only check
  if (scheme.femaleOnly && !profile.isFemale) {
    const text = {
      en: 'Reserved exclusively for female students',
      hi: 'विशेष रूप से केवल छात्राओं के लिए आरक्षित',
    };
    reasons.push({ kind: 'fail', text });
    auditItems.push({
      id: 'gender',
      name: { en: 'Gender Requirement', hi: 'लिंग मानदंड' },
      status: 'failed',
      explanation: text,
    });
    return { score: 0, tier: 'ineligible', reasons, auditItems };
  } else if (scheme.femaleOnly && profile.isFemale) {
    const text = {
      en: 'Verified: Female student quota satisfied',
      hi: 'सत्यापित: छात्रा कोटा पूर्ण',
    };
    reasons.push({ kind: 'pass', text });
    auditItems.push({
      id: 'gender',
      name: { en: 'Gender Requirement', hi: 'लिंग मानदंड' },
      status: 'satisfied',
      explanation: text,
    });
  }

  // 5. Minority requirement check
  if (scheme.requiresMinority && !profile.isMinority) {
    const text = {
      en: 'Requires applicant to belong to a notified minority community (Muslim, Christian, Sikh, Buddhist, Jain, Parsi)',
      hi: 'आवेदक का अधिसूचित अल्पसंख्यक समुदाय (मुस्लिम, ईसाई, सिख, बौद्ध, जैन, पारसी) से होना आवश्यक है',
    };
    reasons.push({ kind: 'fail', text });
    auditItems.push({
      id: 'minority',
      name: { en: 'Minority Community', hi: 'अल्पसंख्यक समुदाय' },
      status: 'failed',
      explanation: text,
    });
    return { score: 0, tier: 'ineligible', reasons, auditItems };
  } else if (scheme.requiresMinority && profile.isMinority) {
    const text = { en: 'Notified minority status verified', hi: 'अल्पसंख्यक स्थिति प्रमाणित' };
    reasons.push({ kind: 'pass', text });
    auditItems.push({
      id: 'minority',
      name: { en: 'Minority Community', hi: 'अल्पसंख्यक समुदाय' },
      status: 'satisfied',
      explanation: text,
    });
  }

  // 6. Disability requirement check
  if (scheme.requiresDisability && !profile.hasDisability) {
    const text = {
      en: 'Requires benchmark disability certificate (PwD ≥ 40%) with UDID registration',
      hi: 'यूडीआईडी पंजीकरण सहित 40% या अधिक दिव्यांगता प्रमाण पत्र आवश्यक है',
    };
    reasons.push({ kind: 'fail', text });
    auditItems.push({
      id: 'disability',
      name: { en: 'Disability Quota', hi: 'दिव्यांगता कोटा' },
      status: 'failed',
      explanation: text,
    });
    return { score: 0, tier: 'ineligible', reasons, auditItems };
  } else if (scheme.requiresDisability && profile.hasDisability) {
    const text = { en: 'Benchmark disability (PwD ≥ 40%) verified', hi: 'दिव्यांगता कोटा प्रमाणित' };
    reasons.push({ kind: 'pass', text });
    auditItems.push({
      id: 'disability',
      name: { en: 'Disability Quota', hi: 'दिव्यांगता कोटा' },
      status: 'satisfied',
      explanation: text,
    });
  }

  // 7. Income cap check
  if (profile.annualIncome > scheme.maxIncome) {
    const text = {
      en: `Family income ${formatCurrencyINR(profile.annualIncome)} exceeds official ceiling of ${formatCurrencyINR(scheme.maxIncome)}`,
      hi: `पारिवारिक आय ${formatCurrencyINR(profile.annualIncome)} अधिकतम सीमा ${formatCurrencyINR(scheme.maxIncome)} से अधिक है`,
    };
    reasons.push({ kind: 'fail', text });
    auditItems.push({
      id: 'income',
      name: { en: 'Family Income Cap', hi: 'पारिवारिक आय सीमा' },
      status: 'failed',
      explanation: text,
    });
    return { score: 0, tier: 'ineligible', reasons, auditItems };
  } else {
    const text = {
      en: `Income ${formatCurrencyINR(profile.annualIncome)} is within the official ${formatCurrencyINR(scheme.maxIncome)} limit`,
      hi: `आय ${formatCurrencyINR(profile.annualIncome)} अनुमत सीमा ${formatCurrencyINR(scheme.maxIncome)} के भीतर है`,
    };
    reasons.push({ kind: 'pass', text });
    auditItems.push({
      id: 'income',
      name: { en: 'Family Income Cap', hi: 'पारिवारिक आय सीमा' },
      status: 'satisfied',
      explanation: text,
    });
  }

  // All hard rules passed! Check soft criteria
  let score = 100;
  if (scheme.soft) {
    score = Math.max(0, 100 - scheme.soft.penalty);
    reasons.push({
      kind: 'verify',
      text: scheme.soft.note,
    });
    auditItems.push({
      id: 'soft_criteria',
      name: { en: 'Academic / Merit Condition', hi: 'शैक्षणिक / मेरिट शर्त' },
      status: 'unverified',
      explanation: scheme.soft.note,
    });
  }

  let tier: 'eligible' | 'likely' | 'ineligible';
  if (score === 100) {
    tier = 'eligible';
  } else if (score >= 70) {
    tier = 'likely';
  } else {
    tier = 'ineligible';
  }

  return { score, tier, reasons, auditItems };
}
