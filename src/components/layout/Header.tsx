'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { LangToggle } from './LangToggle';
import { TextSizeToggle } from './TextSizeToggle';
import { RotateCcw, Menu, X, Landmark } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();
  const { t, dispatch } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: t('navHome') },
    { href: '/match', label: t('navMatch') },
    { href: '/track', label: t('navTrack') },
    { href: '/docs', label: t('navDocs') },
  ];

  const handleResetDemo = () => {
    dispatch({ type: 'RESET_DEMO' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* 3px Indian National Tricolor Strip */}
      <div className="h-[3px] w-full flex">
        <div className="w-1/3 bg-[#FF9933]" />
        <div className="w-1/3 bg-[#FFFFFF]" />
        <div className="w-1/3 bg-[#138808]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Wordmark & Bridge Icon */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-indigo-600 rounded-lg p-1"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200 group-hover:bg-indigo-700 transition-colors">
              {/* Bridge-like landmark SVG icon */}
              <Landmark className="w-5 h-5 text-amber-200" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-slate-900 leading-none">
                {t('appName')}
                <span className="text-indigo-600 text-xs ml-1 font-semibold uppercase tracking-wider">
                  Direct
                </span>
              </span>
              <span className="text-[10px] text-slate-500 font-medium tracking-tight">
                {t('appTagline')}
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-3.5 py-2 rounded-xl text-sm font-medium transition-colors min-h-[44px] flex items-center focus:outline-none focus:ring-2 focus:ring-indigo-600',
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Header Actions */}
          <div className="hidden md:flex items-center gap-2.5">
            <LangToggle />
            <TextSizeToggle />
            <button
              type="button"
              onClick={handleResetDemo}
              title={t('resetDemo')}
              aria-label={t('resetDemo')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs font-medium transition-all shadow-2xs min-h-[44px] focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>{t('resetDemo')}</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <LangToggle />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-600 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'block px-4 py-2.5 rounded-xl text-base font-medium min-h-[44px] flex items-center',
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            <TextSizeToggle />
            <button
              type="button"
              onClick={() => {
                handleResetDemo();
                setMobileMenuOpen(false);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium min-h-[44px]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t('resetDemo')}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
