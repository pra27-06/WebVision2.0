import { Scheme, StudentProfile, EligibilityResult, EligibilityReason } from '@/types';
import { formatCurrencyINR } from '@/lib/utils';

export function evaluate(scheme: Scheme, profile: StudentProfile): EligibilityResult {
  const reasons: EligibilityReason[] = [];

  // 1. State check
  if (scheme.states !== 'ALL') {
    const stateMatched = scheme.states.includes(profile.state);
    if (!stateMatched) {
      reasons.push({
        kind: 'fail',
        text: {
          en: `Only for residents of ${scheme.states.join(', ')} (Your state: ${profile.state})`,
          hi: `केवल ${scheme.states.join(', ')} के निवासियों के लिए (आपका राज्य: ${profile.state})`,
        },
      });
      return { score: 0, tier: 'ineligible', reasons };
    } else {
      reasons.push({
        kind: 'pass',
        text: {
          en: `State ${profile.state} is eligible`,
          hi: `राज्य ${profile.state} पात्र है`,
        },
      });
    }
  }

  // 2. Course Level check
  if (!scheme.levels.includes(profile.level)) {
    reasons.push({
      kind: 'fail',
      text: {
        en: `Course level not covered (Applies to: ${scheme.levels.join(', ')})`,
        hi: `पाठ्यक्रम स्तर शामिल नहीं है (मान्य स्तर: ${scheme.levels.join(', ')})`,
      },
    });
    return { score: 0, tier: 'ineligible', reasons };
  } else {
    reasons.push({
      kind: 'pass',
      text: {
        en: `Course level is covered`,
        hi: `पाठ्यक्रम स्तर पात्र है`,
      },
    });
  }

  // 3. Category check
  if (scheme.categories !== 'ALL') {
    if (!scheme.categories.includes(profile.category)) {
      reasons.push({
        kind: 'fail',
        text: {
          en: `Scheme reserved for ${scheme.categories.map((c) => c.toUpperCase()).join(', ')} (You selected ${profile.category.toUpperCase()})`,
          hi: `योजना केवल ${scheme.categories.map((c) => c.toUpperCase()).join(', ')} हेतु आरक्षित है (आपका वर्ग: ${profile.category.toUpperCase()})`,
        },
      });
      return { score: 0, tier: 'ineligible', reasons };
    } else {
      reasons.push({
        kind: 'pass',
        text: {
          en: `Category ${profile.category.toUpperCase()} matches scheme quota`,
          hi: `श्रेणी ${profile.category.toUpperCase()} योजना के कोटे से मेल खाती है`,
        },
      });
    }
  }

  // 4. Female only check
  if (scheme.femaleOnly && !profile.isFemale) {
    reasons.push({
      kind: 'fail',
      text: {
        en: 'Reserved exclusively for female students',
        hi: 'विशेष रूप से केवल छात्राओं के लिए आरक्षित',
      },
    });
    return { score: 0, tier: 'ineligible', reasons };
  } else if (scheme.femaleOnly && profile.isFemale) {
    reasons.push({
      kind: 'pass',
      text: {
        en: 'Meets female student quota',
        hi: 'छात्रा कोटा पूर्ण',
      },
    });
  }

  // 5. Minority requirement check
  if (scheme.requiresMinority && !profile.isMinority) {
    reasons.push({
      kind: 'fail',
      text: {
        en: 'Requires applicant to belong to a notified minority community',
        hi: 'आवेदक का अधिसूचित अल्पसंख्यक समुदाय से होना आवश्यक है',
      },
    });
    return { score: 0, tier: 'ineligible', reasons };
  } else if (scheme.requiresMinority && profile.isMinority) {
    reasons.push({
      kind: 'pass',
      text: {
        en: 'Minority community verified',
        hi: 'अल्पसंख्यक समुदाय प्रमाणित',
      },
    });
  }

  // 6. Disability requirement check
  if (scheme.requiresDisability && !profile.hasDisability) {
    reasons.push({
      kind: 'fail',
      text: {
        en: 'Requires benchmark disability certificate (PwD ≥ 40%)',
        hi: 'मान्य दिव्यांगता प्रमाण पत्र (PwD ≥ 40%) आवश्यक है',
      },
    });
    return { score: 0, tier: 'ineligible', reasons };
  } else if (scheme.requiresDisability && profile.hasDisability) {
    reasons.push({
      kind: 'pass',
      text: {
        en: 'Disability quota verified',
        hi: 'दिव्यांगता कोटा प्रमाणित',
      },
    });
  }

  // 7. Income cap check
  if (profile.annualIncome > scheme.maxIncome) {
    reasons.push({
      kind: 'fail',
      text: {
        en: `Family income ${formatCurrencyINR(profile.annualIncome)} exceeds ceiling of ${formatCurrencyINR(scheme.maxIncome)}`,
        hi: `पारिवारिक आय ${formatCurrencyINR(profile.annualIncome)} अधिकतम सीमा ${formatCurrencyINR(scheme.maxIncome)} से अधिक है`,
      },
    });
    return { score: 0, tier: 'ineligible', reasons };
  } else {
    reasons.push({
      kind: 'pass',
      text: {
        en: `Income ${formatCurrencyINR(profile.annualIncome)} is within the ${formatCurrencyINR(scheme.maxIncome)} limit`,
        hi: `आय ${formatCurrencyINR(profile.annualIncome)} अनुमत सीमा ${formatCurrencyINR(scheme.maxIncome)} के भीतर है`,
      },
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
  }

  let tier: 'eligible' | 'likely' | 'ineligible';
  if (score === 100) {
    tier = 'eligible';
  } else if (score >= 70) {
    tier = 'likely';
  } else {
    tier = 'ineligible';
  }

  return { score, tier, reasons };
}
