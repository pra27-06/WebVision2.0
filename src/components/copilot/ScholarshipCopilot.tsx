'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useApp } from '@/context/AppContext';
import { CopilotMessage } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Sparkles,
  X,
  Send,
  ExternalLink,
  BookOpen,
  ShieldCheck,
  Loader2,
  ChevronRight,
} from 'lucide-react';

interface ScholarshipCopilotProps {
  selectedSchemeId?: string;
  initialQuestion?: string;
  isOpenExternal?: boolean;
  onCloseExternal?: () => void;
}

export function ScholarshipCopilot({
  selectedSchemeId,
  initialQuestion,
  isOpenExternal,
  onCloseExternal,
}: ScholarshipCopilotProps) {
  const { state } = useApp();
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = isOpenExternal !== undefined ? isOpenExternal : internalOpen;

  const setIsOpen = (open: boolean) => {
    if (onCloseExternal && !open) {
      onCloseExternal();
    }
    setInternalOpen(open);
  };

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeProvider, setActiveProvider] = useState<string>('Grounded AI Engine');

  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        `Hello! I am your **Setu Scholarship Copilot**.\nI provide verified answers grounded in official guidelines from **AICTE, UGC, Ministry of Education, and Ministry of Minority Affairs**.\n\nAsk me about eligibility rules, income caps, documents, or deadlines.`,
      sources: [
        {
          title: 'National Scholarship Portal (NSP)',
          url: 'https://scholarships.gov.in',
        },
      ],
      verifiedFacts: [
        'Grounded in 12 verified Central Government scholarship schemes',
        'Direct link citations to official government guidelines',
      ],
      suggestedFollowUps: [
        'Can two sisters apply for AICTE Pragati?',
        'What is the difference between Pragati and CSSS?',
        'Which scholarships close in 24-48 hours?',
        'What documents are needed for PM YASASVI?',
      ],
      timestamp: 0,
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = useCallback(
    async (queryText?: string) => {
      const textToSend = queryText || input;
      if (!textToSend.trim() || isLoading) return;

      const userMsg: CopilotMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: textToSend.trim(),
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setIsLoading(true);

      try {
        const res = await fetch('/api/copilot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [...messages, userMsg].map((m) => ({
              role: m.role,
              content: m.content,
            })),
            currentProfile: state.profile,
            selectedSchemeId,
            language: state.language,
          }),
        });

        if (!res.ok) {
          throw new Error(`Copilot API responded with status ${res.status}`);
        }

        const data = await res.json();
        if (data.provider) {
          setActiveProvider(data.provider);
        }

        const assistantMsg: CopilotMessage = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: data.content || 'I could not find a verified answer in the catalogue.',
          sources: data.sources || [],
          verifiedFacts: data.verifiedFacts || [],
          unverifiedNotes: data.unverifiedNotes || [],
          suggestedFollowUps: data.suggestedFollowUps || [],
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, assistantMsg]);
      } catch (err: unknown) {
        console.error('Copilot error:', err);
        const errorMsg: CopilotMessage = {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content:
            'I am currently experiencing network latency. You can still review verified eligibility requirements on each scheme card or consult [scholarships.gov.in](https://scholarships.gov.in).',
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading, messages, selectedSchemeId, state.language, state.profile]
  );

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Handle external trigger with pre-filled question
  useEffect(() => {
    if (initialQuestion && isOpen) {
      const timer = setTimeout(() => {
        handleSend(initialQuestion);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [initialQuestion, isOpen, handleSend]);

  return (
    <>
      {/* Floating Trigger Button (when drawer is closed) */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 left-4 z-40 inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xl shadow-indigo-500/25 border border-indigo-400/40 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-600 min-h-[44px]"
          aria-label="Open AI Scholarship Copilot"
        >
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          <span>Ask AI Copilot</span>
        </button>
      )}

      {/* Floating / Slide-out Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-4 left-4 z-50 w-[380px] sm:w-[440px] max-w-[calc(100vw-32px)] h-[580px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Top Header */}
          <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 text-white p-4 flex items-center justify-between border-b border-indigo-950">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>Setu Scholarship Copilot</span>
                </h4>
                <div className="flex items-center gap-1.5 text-[10px] text-indigo-200 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>{activeProvider}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-indigo-200 hover:text-white hover:bg-white/10 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
              aria-label="Close AI Copilot"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs bg-slate-50/50">
            {messages.map((m) => {
              const isUser = m.role === 'user';

              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl p-3.5 leading-relaxed shadow-2xs ${
                      isUser
                        ? 'bg-indigo-600 text-white rounded-br-xs'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                    }`}
                  >
                    <div className="whitespace-pre-line space-y-2">
                      {m.content}
                    </div>

                    {/* Grounded Official Sources (if assistant) */}
                    {m.sources && m.sources.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                          <BookOpen className="w-3 h-3 text-indigo-600" />
                          <span>Verified Government Sources:</span>
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {m.sources.map((s, idx) => (
                            <a
                              key={idx}
                              href={s.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-[10px] font-semibold border border-indigo-200 transition-colors"
                            >
                              <span className="truncate max-w-[180px]">{s.title}</span>
                              <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Verified Facts vs Unverified Notes */}
                    {m.verifiedFacts && m.verifiedFacts.length > 0 && (
                      <div className="mt-2 text-[10px] text-emerald-800 bg-emerald-50/70 p-2 rounded-lg border border-emerald-200/60 space-y-0.5">
                        <span className="font-bold flex items-center gap-1 text-emerald-900">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          <span>Verified Rule Basis:</span>
                        </span>
                        {m.verifiedFacts.map((f, i) => (
                          <div key={i}>• {f}</div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Suggested Follow-Ups */}
                  {m.suggestedFollowUps && m.suggestedFollowUps.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1 max-w-[95%]">
                      {m.suggestedFollowUps.map((prompt, pIdx) => (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => handleSend(prompt)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-900 text-[10px] font-medium transition-all shadow-2xs text-left"
                        >
                          <span>{prompt}</span>
                          <ChevronRight className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 p-3 bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs w-fit shadow-2xs">
                <Loader2 className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
                <span>Consulting verified guidelines...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input & Form */}
          <div className="p-3 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <Input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about rules, income, docs, or deadlines..."
                className="h-10 text-xs rounded-xl"
                disabled={isLoading}
              />
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={isLoading || !input.trim()}
                className="h-10 px-3 shrink-0 rounded-xl"
                aria-label="Send message to Copilot"
              >
                <Send className="w-3.5 h-3.5" />
              </Button>
            </form>
            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5 px-1 font-mono">
              <span>Grounded in official circulars</span>
              <span>No Aadhaar or OTP requested</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
