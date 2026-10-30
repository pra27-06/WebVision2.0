import { ParsedQueryFilter } from '@/types';
import { INDIAN_STATES } from './states';

/**
 * Parses conversational search queries into structured filter parameters.
 * Supports natural language such as:
 * - "I am a female B.Tech student from UP with family income 2.2 Lakh looking for scholarships"
 * - "Show me OBC scholarships under 2.5 lakh"
 * - "What schemes are available for Class 12 girl students?"
 * - "Disability scholarships for diploma"
 */
export function parseNaturalLanguageQuery(query: string): ParsedQueryFilter {
  const lower = query.toLowerCase().trim();
  const filter: ParsedQueryFilter = {
    keywords: [],
  };

  // 1. Detect Course Level
  if (/\b(b\.?tech|b\.?e|b\.?sc|b\.?a|b\.?com|bca|undergrad|undergraduate|ug|degree|college)\b/.test(lower)) {
    filter.level = 'ug';
  } else if (/\b(m\.?tech|m\.?sc|m\.?a|m\.?com|mca|postgrad|postgraduate|pg|master)\b/.test(lower)) {
    filter.level = 'pg';
  } else if (/\b(diploma|polytechnic)\b/.test(lower)) {
    filter.level = 'diploma';
  } else if (/\b(ph\.?d|doctorate|research scholar)\b/.test(lower)) {
    filter.level = 'phd';
  } else if (/\b(11th|12th|class 11|class 12|inter|intermediate|higher secondary)\b/.test(lower)) {
    filter.level = 'class11_12';
  }

  // 2. Detect Gender
  if (/\b(girl|girls|female|woman|women|daughter|she|her)\b/.test(lower)) {
    filter.isFemale = true;
  }

  // 3. Detect Social Category
  if (/\b(sc|scheduled caste)\b/.test(lower)) {
    filter.category = 'sc';
  } else if (/\b(st|scheduled tribe|tribal)\b/.test(lower)) {
    filter.category = 'st';
  } else if (/\b(obc|other backward|non-creamy|ebc|dnt)\b/.test(lower)) {
    filter.category = 'obc';
  } else if (/\b(ews|economically weaker)\b/.test(lower)) {
    filter.category = 'ews';
  } else if (/\b(general|open category)\b/.test(lower)) {
    filter.category = 'general';
  }

  // 4. Detect Minority
  if (/\b(minority|muslim|christian|sikh|buddhist|jain|parsi)\b/.test(lower)) {
    filter.isMinority = true;
  }

  // 5. Detect Disability
  if (/\b(disab|pwd|handicap|divyang|blind|ortho|hearing|differently abled)\b/.test(lower)) {
    filter.hasDisability = true;
  }

  // 6. Detect State
  for (const st of INDIAN_STATES) {
    const stNameLower = st.en.toLowerCase();
    if (lower.includes(stNameLower)) {
      filter.state = st.id;
      break;
    }
  }
  // Common state abbreviations
  if (!filter.state) {
    if (/\b(up|u\.p\.)\b/.test(lower)) filter.state = 'Uttar Pradesh';
    else if (/\b(mp|m\.p\.)\b/.test(lower)) filter.state = 'Madhya Pradesh';
    else if (/\b(ap|a\.p\.)\b/.test(lower)) filter.state = 'Andhra Pradesh';
    else if (/\b(j&k|jk|kashmir|ladakh)\b/.test(lower)) filter.state = 'Jammu and Kashmir';
    else if (/\b(delhi|ncr)\b/.test(lower)) filter.state = 'Delhi';
  }

  // 7. Detect Annual Income
  // Matches "2.5 lakh", "2.5L", "250000", "under 3 lakh"
  const lakhMatch = lower.match(/(\d+(?:\.\d+)?)\s*(?:lakh|lakhs|lac|lacs|l)\b/);
  if (lakhMatch) {
    const num = parseFloat(lakhMatch[1]);
    filter.annualIncome = Math.round(num * 100000);
  } else {
    const directNumMatch = lower.match(/(?:income|rupees|rs\.?|₹)\s*(\d{5,7})/);
    if (directNumMatch) {
      filter.annualIncome = parseInt(directNumMatch[1], 10);
    }
  }

  // Build summary explanation of what was extracted
  const extractedParts: string[] = [];
  if (filter.level) extractedParts.push(`Level: ${filter.level.toUpperCase()}`);
  if (filter.category) extractedParts.push(`Category: ${filter.category.toUpperCase()}`);
  if (filter.isFemale) extractedParts.push('Female quota');
  if (filter.isMinority) extractedParts.push('Minority quota');
  if (filter.hasDisability) extractedParts.push('PwD quota');
  if (filter.state) extractedParts.push(`State: ${filter.state}`);
  if (filter.annualIncome) extractedParts.push(`Income: ₹${(filter.annualIncome / 100000).toFixed(1)} Lakh`);

  filter.summaryNote = extractedParts.length > 0
    ? `Extracted criteria: ${extractedParts.join(' • ')}`
    : 'Showing broad matching results from catalog.';

  return filter;
}
