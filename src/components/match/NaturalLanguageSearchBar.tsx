'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { StudentProfile } from '@/types';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Sparkles, Search, Loader2, Check, ArrowRight } from 'lucide-react';

export function NaturalLanguageSearchBar() {
  const { dispatch } = useApp();
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [parseSummary, setParseSummary] = useState<string | null>(null);

  const samplePrompts = [
    'Female B.Tech student in UP under 2.5 Lakh',
    'OBC student under 2.5 Lakh',
    'Class 12 student looking for scholarships',
    'AICTE scholarship for girl students',
  ];

  const handleSearch = async (textToSearch?: string) => {
    const q = textToSearch || query;
    if (!q.trim() || isLoading) return;

    setIsLoading(true);
    setParseSummary(null);

    try {
      const res = await fetch('/api/parse-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      });

      if (!res.ok) throw new Error('Query parser failed');

      const data = await res.json();

      // Dispatch parsed profile attributes
      const payload: Partial<StudentProfile> = {};
      if (data.level) payload.level = data.level;
      if (data.category) payload.category = data.category;
      if (data.isFemale !== undefined && data.isFemale !== null) payload.isFemale = data.isFemale;
      if (data.isMinority !== undefined && data.isMinority !== null) payload.isMinority = data.isMinority;
      if (data.hasDisability !== undefined && data.hasDisability !== null) payload.hasDisability = data.hasDisability;
      if (data.state) payload.state = data.state;
      if (data.annualIncome) payload.annualIncome = data.annualIncome;

      if (Object.keys(payload).length > 0) {
        dispatch({ type: 'SET_PROFILE', payload });
      }

      setParseSummary(data.summaryNote || 'Search criteria applied to catalogue.');
    } catch (err) {
      console.error('Search error:', err);
      setParseSummary('Could not parse natural language. You can adjust the 3-step wizard directly.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-900 via-indigo-850 to-indigo-900 text-white rounded-2xl p-5 shadow-sm space-y-3.5 border border-indigo-700/50">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-300" />
        <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-200">
          AI Natural Language Scholarship Search
        </h4>
        <span className="text-[10px] font-mono bg-white/10 text-indigo-200 px-2 py-0.5 rounded ml-auto">
          Gemini / Deterministic
        </span>
      </div>

      {/* Search Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
        className="flex items-center gap-2"
      >
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe your situation (e.g. 'I am a female B.Tech student in UP with 2.4L income')"
            className="pl-10 h-11 bg-white text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm rounded-xl focus-visible:ring-amber-400"
            disabled={isLoading}
          />
        </div>
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading || !query.trim()}
          className="h-11 px-5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shrink-0 rounded-xl"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <div className="flex items-center gap-1.5">
              <span>Find Matches</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          )}
        </Button>
      </form>

      {/* Feedback Banner if search just ran */}
      {parseSummary && (
        <div className="flex items-center gap-2 text-xs bg-white/10 text-amber-200 p-2.5 rounded-xl border border-white/10 animate-in fade-in duration-200">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{parseSummary}</span>
        </div>
      )}

      {/* Suggested Quick Query Chips */}
      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
        <span className="text-[10px] text-indigo-300 font-medium">Try asking:</span>
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setQuery(p);
              handleSearch(p);
            }}
            className="text-[10px] px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-indigo-100 transition-colors border border-white/10"
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
