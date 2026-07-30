'use client';

import React from 'react';
import { Dumbbell, Globe, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';

export function Navbar() {
  const { lang, setLang, t } = useI18n();

  return (
    <header className="sticky top-0 z-50 px-4 lg:px-8 py-4">
      {/* Floating Island Navigation bar with Doppelrand architecture */}
      <div className="max-w-7xl mx-auto backdrop-blur-2xl bg-slate-950/70 border border-white/10 rounded-full px-5 py-3 flex items-center justify-between shadow-2xl shadow-indigo-950/20">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group btn-taste">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-md shadow-indigo-500/30 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
              <Dumbbell className="w-4 h-4 text-indigo-300 group-hover:rotate-12 transition-transform" />
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              {t('appName')}
            </span>
            <span className="px-2.5 py-0.5 text-[9px] font-mono uppercase tracking-widest font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
              Phase 1 MVP
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-[11px] text-slate-400">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>LLM Structured Engine</span>
          </div>

          {/* Language Switcher Button */}
          <button
            onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
            className="flex items-center gap-2 px-4 py-1.5 text-xs font-semibold bg-white/[0.06] hover:bg-white/10 border border-white/10 text-slate-200 hover:text-white rounded-full btn-taste shadow-sm"
            title="Switch Language / 切换语言"
          >
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <span>{lang === 'en' ? 'English (EN)' : '中文 (双语)'}</span>
          </button>
        </div>

      </div>
    </header>
  );
}
