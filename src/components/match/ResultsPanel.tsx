'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { MOCK_SCHOLARSHIPS } from '@/data/mockScholarships';
import { evaluate } from '@/lib/eligibility';
import { Scheme } from '@/types';
import { SchemeCard } from './SchemeCard';
import { FastApplySheet } from './FastApplySheet';
import { NaturalLanguageSearchBar } from './NaturalLanguageSearchBar';
import { ChevronDown, ChevronUp, ShieldX, Sparkles, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export function ResultsPanel() {
  const { state, t, getText } = useApp();
  const { profile } = state;
  const [selectedSchemeForApply, setSelectedSchemeForApply] = useState<Scheme | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [showIneligible, setShowIneligible] = useState(false);

  // Evaluate all schemes with the current profile
  const { eligibleSchemes, ineligibleSchemes } = useMemo(() => {
    const evaluated = MOCK_SCHOLARSHIPS.map((scheme) => ({
      scheme,
      eligibility: evaluate(scheme, profile),
    }));

    // Split eligible (score > 0 and tier !== 'ineligible') and ineligible
    const eligible = evaluated.filter((item) => item.eligibility.tier !== 'ineligible');
    const ineligible = evaluated.filter((item) => item.eligibility.tier === 'ineligible');

    // Sort eligible by score desc, then benefit desc, then deadline asc
    eligible.sort((a, b) => {
      if (b.eligibility.score !== a.eligibility.score) {
        return b.eligibility.score - a.eligibility.score;
      }
      if (b.scheme.benefitPerYear !== a.scheme.benefitPerYear) {
        return b.scheme.benefitPerYear - a.scheme.benefitPerYear;
      }
      return a.scheme.deadlineInDays - b.scheme.deadlineInDays;
    });

    return {
      eligibleSchemes: eligible,
      ineligibleSchemes: ineligible,
    };
  }, [profile]);

  const handleOpenFastApply = (scheme: Scheme) => {
    setSelectedSchemeForApply(scheme);
    setIsSheetOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Natural Language AI Search Bar */}
      <NaturalLanguageSearchBar />

      {/* Results Header with aria-live */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-2" aria-live="polite">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-slate-900 text-base sm:text-lg">
            {t('matchesFound', { count: eligibleSchemes.length })}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="success" className="font-mono">
            {eligibleSchemes.filter((s) => s.eligibility.tier === 'eligible').length} 100% Eligible
          </Badge>
          <Badge variant="warning" className="font-mono">
            {eligibleSchemes.filter((s) => s.eligibility.tier === 'likely').length} Likely
          </Badge>
        </div>
      </div>

      {/* Eligible Scheme Cards List (Animated) */}
      <div className="space-y-4">
        {eligibleSchemes.length > 0 ? (
          <AnimatePresence mode="popLayout">
            {eligibleSchemes.map(({ scheme, eligibility }) => (
              <motion.div
                key={scheme.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
              >
                <SchemeCard
                  scheme={scheme}
                  eligibility={eligibility}
                  onFastApply={handleOpenFastApply}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
            <Filter className="w-10 h-10 text-slate-400 mx-auto" />
            <h4 className="font-bold text-slate-800">No Eligible Schemes for this Selection</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your category, increasing the income slider, or switching course level to view matched grants.
            </p>
          </div>
        )}
      </div>

      {/* Ineligible Collapsed Drawer */}
      {ineligibleSchemes.length > 0 && (
        <div className="border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => setShowIneligible(!showIneligible)}
            className="w-full p-4 flex items-center justify-between text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-600 min-h-[44px]"
            aria-expanded={showIneligible}
          >
            <div className="flex items-center gap-2">
              <ShieldX className="w-4 h-4 text-slate-400" />
              <span>{t('ineligibleCount', { count: ineligibleSchemes.length })}</span>
            </div>
            {showIneligible ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {showIneligible && (
            <div className="p-4 pt-0 space-y-3 border-t border-slate-100 divide-y divide-slate-100">
              {ineligibleSchemes.map(({ scheme, eligibility }) => (
                <div key={scheme.id} className="pt-3 first:pt-0 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-xs text-slate-800">
                      {getText(scheme.name)}
                    </h5>
                    <Badge variant="secondary" className="text-[10px]">
                      {getText(scheme.provider)}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    {eligibility.reasons
                      .filter((r) => r.kind === 'fail')
                      .map((r, i) => (
                        <p key={i} className="text-xs text-rose-700 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                          <span>{getText(r.text)}</span>
                        </p>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Fast Apply Slide-Over Drawer */}
      <FastApplySheet
        scheme={selectedSchemeForApply}
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
      />
    </div>
  );
}
