/**
 * Mock OCR Engine & Normalized Levenshtein Matcher for Aadhaar name verification.
 * Simulates real OCR extraction delay (900ms - 1400ms).
 */

export type OcrScenario = 'match' | 'slight_mismatch' | 'mismatch';

export interface OcrResult {
  extractedName: string;
  maskedId: string;
  similarity: number; // 0 to 1
  status: 'match' | 'possible_mismatch' | 'mismatch';
  elapsedMs: number;
}

export function levenshteinDistance(a: string, b: string): number {
  const s1 = a.trim().toLowerCase();
  const s2 = b.trim().toLowerCase();

  const m = s1.length;
  const n = s2.length;
  if (m === 0) return n;
  if (n === 0) return m;

  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, // deletion
        dp[i][j - 1] + 1, // insertion
        dp[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return dp[m][n];
}

export function calculateNormalizedSimilarity(a: string, b: string): number {
  const dist = levenshteinDistance(a, b);
  const maxLen = Math.max(a.trim().length, b.trim().length);
  if (maxLen === 0) return 1.0;
  return Math.max(0, 1 - dist / maxLen);
}

export async function runMockOcr(
  file: File | Blob,
  applicantName: string,
  scenario: OcrScenario = 'match'
): Promise<OcrResult> {
  const startTime = performance.now();
  // Simulates OCR processing time between 900ms and 1400ms
  const simulatedDelay = Math.floor(900 + Math.random() * 500);
  await new Promise((r) => setTimeout(r, simulatedDelay));

  let extractedName = 'Priya Sharma';
  if (scenario === 'slight_mismatch') {
    extractedName = 'Priyaa Sharma';
  } else if (scenario === 'mismatch') {
    extractedName = 'Pooja Verma';
  }

  const similarity = calculateNormalizedSimilarity(extractedName, applicantName);

  let status: 'match' | 'possible_mismatch' | 'mismatch';
  if (similarity >= 0.9) {
    status = 'match';
  } else if (similarity >= 0.7) {
    status = 'possible_mismatch';
  } else {
    status = 'mismatch';
  }

  const elapsedMs = Math.round(performance.now() - startTime);

  return {
    extractedName,
    maskedId: 'XXXX XXXX 4821',
    similarity: Math.round(similarity * 100) / 100,
    status,
    elapsedMs,
  };
}
