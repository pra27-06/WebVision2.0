import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { DemoGuide } from '@/components/layout/DemoGuide';
import { ScholarshipCopilot } from '@/components/copilot/ScholarshipCopilot';

export const metadata: Metadata = {
  title: 'Setu (NSP Direct) - Scholarship Portal Friction Fix',
  description:
    'A high-contrast, frictionless GovTech layer for the National Scholarship Portal (NSP). Instant scheme matching, domino pipeline tracking, and client-side doc auto-compression.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 min-h-screen flex flex-col antialiased selection:bg-indigo-100 selection:text-indigo-900">
        <AppProvider>
          <Header />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {children}
          </main>
          <Footer />
          <DemoGuide />
          <ScholarshipCopilot />
        </AppProvider>
      </body>
    </html>
  );
}
