import { NextRequest, NextResponse } from 'next/server';
import { parseNaturalLanguageQuery } from '@/lib/queryParser';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Query string is required' }, { status: 400 });
    }

    // 1. Run local deterministic parser first (fast & reliable)
    const localParsed = parseNaturalLanguageQuery(query);

    // 2. If API key is available, use LLM to refine intent and generate an insightful student summary
    let geminiApiKey = process.env.GEMINI_API_KEY;
    let openaiApiKey = process.env.OPENAI_API_KEY;

    if (openaiApiKey && openaiApiKey.startsWith('AIzaSy') && !geminiApiKey) {
      geminiApiKey = openaiApiKey;
      openaiApiKey = undefined;
    }

    if (geminiApiKey && geminiApiKey.trim() !== '') {
      try {
        const ai = new GoogleGenAI({ apiKey: geminiApiKey });
        const prompt = `Analyze this student's query for Indian government scholarships (National Scholarship Portal):
"${query}"

Output ONLY valid JSON with this exact schema (no markdown, no backticks):
{
  "level": "class11_12" | "diploma" | "ug" | "pg" | "phd" | null,
  "category": "general" | "ews" | "obc" | "sc" | "st" | null,
  "isFemale": true | false | null,
  "isMinority": true | false | null,
  "hasDisability": true | false | null,
  "state": string | null,
  "annualIncome": number | null,
  "explanation": "One short sentence explaining what was identified"
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        const raw = response.text?.trim() || '';
        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const aiParsed = JSON.parse(jsonMatch[0]);
          return NextResponse.json({
            level: aiParsed.level || localParsed.level,
            category: aiParsed.category || localParsed.category,
            isFemale: aiParsed.isFemale ?? localParsed.isFemale,
            isMinority: aiParsed.isMinority ?? localParsed.isMinority,
            hasDisability: aiParsed.hasDisability ?? localParsed.hasDisability,
            state: aiParsed.state || localParsed.state,
            annualIncome: aiParsed.annualIncome || localParsed.annualIncome,
            summaryNote: aiParsed.explanation || localParsed.summaryNote,
            parsedBy: 'Google Gemini (gemini-2.5-flash)',
          });
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.warn('Gemini query parse failed, using local parser:', msg);
      }
    }

    // Default to local deterministic parser result
    return NextResponse.json({
      ...localParsed,
      parsedBy: 'Setu Natural Language Parser (Local)',
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal error';
    console.error('Error in /api/parse-query:', errorMsg);
    return NextResponse.json({ error: 'Failed to parse query', details: errorMsg }, { status: 500 });
  }
}
