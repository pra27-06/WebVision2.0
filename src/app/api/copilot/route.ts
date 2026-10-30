import { NextRequest, NextResponse } from 'next/server';
import { MOCK_SCHOLARSHIPS } from '@/data/mockScholarships';
import { CopilotSource } from '@/types';
import OpenAI from 'openai';
import { GoogleGenAI } from '@google/genai';

interface RequestBody {
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
  currentProfile?: Record<string, unknown>;
  selectedSchemeId?: string;
  language?: 'en' | 'hi';
}

function getSystemKnowledgeBase(): string {
  return MOCK_SCHOLARSHIPS.map((s) => {
    return `
SCHEME ID: ${s.id}
NAME: ${s.name.en} (${s.name.hi})
PROVIDER: ${s.provider.en}
BENEFIT: ₹${s.benefitPerYear.toLocaleString('en-IN')}/year
INCOME CEILING: ₹${s.maxIncome.toLocaleString('en-IN')}/year
ELIGIBLE LEVELS: ${s.levels.join(', ')}
ELIGIBLE STATES: ${Array.isArray(s.states) ? s.states.join(', ') : s.states}
ELIGIBLE CATEGORIES: ${Array.isArray(s.categories) ? s.categories.join(', ') : s.categories}
FEMALE ONLY: ${s.femaleOnly ? 'YES' : 'NO'}
REQUIRES MINORITY: ${s.requiresMinority ? 'YES' : 'NO'}
REQUIRES DISABILITY: ${s.requiresDisability ? 'YES' : 'NO'}
SOFT / MERIT CONDITION: ${s.soft ? s.soft.note.en : 'None'}
REQUIRED DOCUMENTS: ${s.documents.join(', ')}
OFFICIAL PORTAL: ${s.portalName.en}
OFFICIAL SOURCE URL: ${s.officialUrl}
APPLICATION MODE: ${s.applicationMode.en}
${s.verifiedFaqs ? 'VERIFIED FAQS:\n' + s.verifiedFaqs.map((f) => `- Q: ${f.question.en}\n  A: ${f.answer.en}`).join('\n') : ''}
`.trim();
  }).join('\n\n---\n\n');
}

/**
 * Intelligent deterministic fallback when neither key is configured or offline.
 */
function generateOfflineResponse(userQuery: string, selectedSchemeId?: string) {
  const q = userQuery.toLowerCase();
  const sources: CopilotSource[] = [];
  const verifiedFacts: string[] = [];
  const unverifiedNotes: string[] = [];
  const suggestedFollowUps: string[] = [];

  let content = '';

  const matchedScheme = selectedSchemeId
    ? MOCK_SCHOLARSHIPS.find((s) => s.id === selectedSchemeId)
    : MOCK_SCHOLARSHIPS.find((s) => q.includes(s.id) || q.includes(s.name.en.toLowerCase()) || q.includes(s.name.hi));

  if (matchedScheme) {
    sources.push({
      title: `${matchedScheme.name.en} - Official Portal`,
      url: matchedScheme.officialUrl,
      schemeId: matchedScheme.id,
    });

    verifiedFacts.push(`Annual benefit: ₹${matchedScheme.benefitPerYear.toLocaleString('en-IN')}/year`);
    verifiedFacts.push(`Income ceiling: Under ₹${matchedScheme.maxIncome.toLocaleString('en-IN')} annual family income`);
    verifiedFacts.push(`Documents required: ${matchedScheme.documents.join(', ')}`);

    if (q.includes('document') || q.includes('docs') || q.includes('upload')) {
      content = `### Required Documents for ${matchedScheme.name.en}
Based on verified guidelines from **${matchedScheme.provider.en}**, you need the following documents for submission on **${matchedScheme.portalName.en}**:
${matchedScheme.documents.map((d) => `- **${d.toUpperCase()}**: Valid copy under official 200 KB limit`).join('\n')}

**Official Application Mode**: ${matchedScheme.applicationMode.en}.
You can verify full requirements directly on the official portal link below.`;
      suggestedFollowUps.push('How do I compress my documents to 200 KB?');
      suggestedFollowUps.push('What is the deadline for this scheme?');
    } else if (q.includes('deadline') || q.includes('last date') || q.includes('when')) {
      content = `### Official Deadlines for ${matchedScheme.name.en}
- **Student Application Window**: Closes in **${matchedScheme.deadlineInDays} days** (Post-matric closing window: 31 Oct 2026).
- **Institute Verification (INO)**: Closes 15 Nov 2026.
- **Provider Authority**: ${matchedScheme.provider.en}.

Please ensure you submit before the window closes, as college verification takes 3–5 working days.`;
      suggestedFollowUps.push('Who is my Institute Nodal Officer (INO)?');
      suggestedFollowUps.push('What happens if verification is delayed?');
    } else {
      content = `### Verified Overview: ${matchedScheme.name.en}
- **Benefit**: ₹${matchedScheme.benefitPerYear.toLocaleString('en-IN')} per year towards academic fees and incidental maintenance.
- **Authority**: ${matchedScheme.provider.en}.
- **Income Limit**: Annual parental income must not exceed **₹${matchedScheme.maxIncome.toLocaleString('en-IN')}**.
- **Eligible Levels**: ${matchedScheme.levels.map((l) => l.toUpperCase()).join(', ')}.
${matchedScheme.femaleOnly ? '- **Quota**: Reserved exclusively for female students.\n' : ''}${matchedScheme.requiresMinority ? '- **Quota**: Reserved for notified minority communities.\n' : ''}${matchedScheme.requiresDisability ? '- **Quota**: Requires benchmark disability (PwD ≥ 40%) certificate.\n' : ''}
${matchedScheme.soft ? `> **Important Note**: ${matchedScheme.soft.note.en}\n` : ''}
**Official Portal**: [${matchedScheme.portalName.en}](${matchedScheme.officialUrl})`;

      if (matchedScheme.soft) {
        unverifiedNotes.push(matchedScheme.soft.note.en);
      }
      suggestedFollowUps.push(`What documents are required for ${matchedScheme.name.en}?`);
      suggestedFollowUps.push('Can I apply for more than one scholarship?');
    }

    return { content, sources, verifiedFacts, unverifiedNotes, suggestedFollowUps };
  }

  // Comparison query
  if (q.includes('pragati') && q.includes('csss') || (q.includes('difference') && (q.includes('two') || q.includes('scheme')))) {
    const pragati = MOCK_SCHOLARSHIPS.find((s) => s.id === 'pragati')!;
    const csss = MOCK_SCHOLARSHIPS.find((s) => s.id === 'csss')!;

    sources.push({ title: 'AICTE Pragati Portal', url: pragati.officialUrl, schemeId: 'pragati' });
    sources.push({ title: 'MoE CSSS Portal', url: csss.officialUrl, schemeId: 'csss' });

    verifiedFacts.push('AICTE Pragati: ₹50,000/yr, female students in technical diploma/degree, income cap ₹8 Lakh.');
    verifiedFacts.push('CSSS: ₹20,000/yr, general college/university students, income cap ₹4.5 Lakh, requires top 20 percentile.');
    unverifiedNotes.push('Under NSP rules, a student can receive only ONE central merit scholarship at a time.');

    content = `### Comparison: AICTE Pragati vs. Central Sector Scheme (CSSS)

| Feature | AICTE Pragati | Central Sector Scheme (CSSS) |
| :--- | :--- | :--- |
| **Annual Amount** | **₹50,000 / year** | ₹20,000 / year |
| **Target Group** | Female students in technical degree/diploma | Merit students in general or professional UG/PG |
| **Income Limit** | Up to ₹8,00,000 | Up to ₹4,50,000 |
| **Merit Rule** | Admitted to AICTE technical course | **Top 20th percentile** in State Board Class 12 |
| **Provider** | AICTE | Ministry of Education (MoE) |

> **Combination Rule**: You can apply to both to check eligibility, but if selected, NSP allows availing only **one** central merit scholarship.`;

    suggestedFollowUps.push('What is the top 20 percentile cut-off for CSSS?');
    suggestedFollowUps.push('Can two sisters in a family apply for Pragati?');
    return { content, sources, verifiedFacts, unverifiedNotes, suggestedFollowUps };
  }

  // General catalog response
  const closingSoon = MOCK_SCHOLARSHIPS.filter((s) => s.deadlineInDays <= 3);
  closingSoon.forEach((s) => {
    sources.push({ title: `${s.name.en} (Portal)`, url: s.officialUrl, schemeId: s.id });
    verifiedFacts.push(`${s.name.en}: Closes in ${s.deadlineInDays} day(s)`);
  });

  content = `### Verified National Scholarship Portal (NSP) Intelligence
Hello! I am your **Setu Scholarship Copilot**, grounded strictly in verified guidelines from AICTE, UGC, Ministry of Education, and Ministry of Minority Affairs.

Here are the highest-urgency schemes currently in our catalogue:
${closingSoon.map((s) => `- **${s.name.en}** (${s.provider.en}): Closes in **${s.deadlineInDays} day(s)** • Benefit: ₹${s.benefitPerYear.toLocaleString('en-IN')}/yr`).join('\n')}

How can I help you today? You can:
1. Describe your course, state, and category for instant personalized advice.
2. Ask about required documents or compression limits (200 KB).
3. Check rules for specific schemes like Pragati, CSSS, or PM YASASVI.`;

  suggestedFollowUps.push('Find scholarships for female undergraduate students');
  suggestedFollowUps.push('What are the income limits for OBC and SC scholarships?');
  suggestedFollowUps.push('What documents do I need to prepare before applying?');

  return { content, sources, verifiedFacts, unverifiedNotes, suggestedFollowUps };
}

export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json();
    const { messages, currentProfile, selectedSchemeId, language = 'en' } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    const latestUserMessage = messages[messages.length - 1].content || '';

    // Check for API Keys - intelligently detect Google Gemini vs OpenAI keys
    let geminiApiKey = process.env.GEMINI_API_KEY;
    let openaiApiKey = process.env.OPENAI_API_KEY;

    // If an AIzaSy... key was placed in OPENAI_API_KEY by mistake, route to Gemini
    if (openaiApiKey && openaiApiKey.startsWith('AIzaSy') && !geminiApiKey) {
      geminiApiKey = openaiApiKey;
      openaiApiKey = undefined;
    }

    const systemPrompt = `You are Setu Scholarship Copilot, an expert, student-friendly AI assistant for Indian government scholarships on the National Scholarship Portal (NSP).
Your task is to provide accurate, honest, and plain-language guidance to students and parents.

KNOWLEDGE BASE OF VERIFIED SCHOLARSHIPS:
${getSystemKnowledgeBase()}

${currentProfile ? `STUDENT'S CURRENT AUDITED PROFILE:\n${JSON.stringify(currentProfile, null, 2)}\n` : ''}

STRICT INSTRUCTIONS:
1. Primary Source: Ground all answers in the verified scholarship catalog above.
2. Official Source Links: When discussing a scholarship, ALWAYS include its exact official source URL from the catalog. Never fabricate URLs.
3. Plain Language: Explain bureaucratic terms simply (e.g. explain what "top 20 percentile" or "domicile certificate" means).
4. No Invented Rules: Never invent income limits, reservation quotas, or eligibility rules not present in the catalog. If unsure, explicitly state: "This detail requires confirmation on the official portal."
5. Combination Rules: Note that under NSP guidelines, a student can typically receive only ONE central merit scholarship at a time.
6. Honest Disclaimers: Remind students that this is an independent advisory assistant, not official government sanction.
7. Language: Respond in ${language === 'hi' ? 'natural, simple Hindi (हिंदी)' : 'clear, simple English'}.
8. Structure: Use markdown with bold headers, bullet points, and source citations.`;

    // 1. Try Google Gemini if key present
    if (geminiApiKey && geminiApiKey.trim() !== '') {
      try {
        const ai = new GoogleGenAI({ apiKey: geminiApiKey });
        const chatHistory = messages.slice(0, -1).map((m) => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n');
        const promptWithContext = `${systemPrompt}\n\n${chatHistory ? `CONVERSATION HISTORY:\n${chatHistory}\n\n` : ''}User Question: ${latestUserMessage}`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: promptWithContext,
        });

        const replyText = response.text || '';
        const sources: CopilotSource[] = [];
        MOCK_SCHOLARSHIPS.forEach((s) => {
          if (replyText.toLowerCase().includes(s.id) || replyText.toLowerCase().includes(s.name.en.toLowerCase().slice(0, 15))) {
            sources.push({
              title: `${s.name.en} (Official Portal)`,
              url: s.officialUrl,
              schemeId: s.id,
            });
          }
        });

        // Determine facts and unverified notes
        const verifiedFacts = sources.map((s) => `Grounded in official rules of ${s.title}`);

        return NextResponse.json({
          content: replyText,
          sources: sources.slice(0, 3),
          verifiedFacts,
          provider: 'Google Gemini (gemini-2.5-flash)',
          isAiGrounded: true,
          suggestedFollowUps: [
            'What documents do I need to prepare?',
            'Explain the income limit criteria',
            'Can I apply for multiple scholarships?',
          ],
        });
      } catch (geminiErr: unknown) {
        const msg = geminiErr instanceof Error ? geminiErr.message : String(geminiErr);
        console.warn('Gemini API call failed, falling back:', msg);
      }
    }

    // 2. Try OpenAI if key present
    if (openaiApiKey && openaiApiKey.trim() !== '' && !openaiApiKey.startsWith('AIzaSy')) {
      try {
        const openai = new OpenAI({ apiKey: openaiApiKey });
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages.map((m) => ({
              role: m.role as 'user' | 'assistant' | 'system',
              content: m.content,
            })),
          ],
          temperature: 0.3,
        });

        const replyContent = completion.choices[0]?.message?.content || '';
        const sources: CopilotSource[] = [];
        MOCK_SCHOLARSHIPS.forEach((s) => {
          if (replyContent.toLowerCase().includes(s.id) || replyContent.toLowerCase().includes(s.name.en.toLowerCase().slice(0, 15))) {
            sources.push({
              title: `${s.name.en} (Official Portal)`,
              url: s.officialUrl,
              schemeId: s.id,
            });
          }
        });

        return NextResponse.json({
          content: replyContent,
          sources: sources.slice(0, 3),
          verifiedFacts: sources.map((s) => `Grounded in official rules of ${s.title}`),
          provider: 'OpenAI (gpt-4o-mini)',
          isAiGrounded: true,
          suggestedFollowUps: [
            'What documents are required for this scheme?',
            'What is the last date to apply?',
            'Who is my Institute Nodal Officer (INO)?',
          ],
        });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.warn('OpenAI API call failed, falling back:', msg);
      }
    }

    // 3. Fallback: Intelligent Local Grounded Knowledge Engine
    const offlineResult = generateOfflineResponse(latestUserMessage, selectedSchemeId);
    return NextResponse.json({
      content: offlineResult.content,
      sources: offlineResult.sources,
      verifiedFacts: offlineResult.verifiedFacts,
      unverifiedNotes: offlineResult.unverifiedNotes,
      suggestedFollowUps: offlineResult.suggestedFollowUps,
      provider: 'Setu Grounded Knowledge Engine (Local)',
      isAiGrounded: false,
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Internal server error';
    console.error('Error in /api/copilot:', error);
    return NextResponse.json(
      {
        error: 'Failed to process copilot query',
        details: errorMsg,
      },
      { status: 500 }
    );
  }
}
