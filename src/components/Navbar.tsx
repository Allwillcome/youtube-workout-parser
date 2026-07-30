'use client';

import React from 'react';
import { Dumbbell, Globe } from 'lucide-react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';

export function Navbar() {
  const { lang, setLang, t } = useI18n();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 px-4 lg:px-8 py-3.5 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-3 group">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
          <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
            <Dumbbell className="w-5 h-5 text-indigo-400 group-hover:rotate-12 transition-transform" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              {t('appName')}
            </span>
            <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wide bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
              Phase 1 MVP
            </span>
          </div>
          <p className="text-xs text-slate-400 hidden sm:block">{t('tagline')}</p>
        </div>
      </Link>

      <div className="flex items-center gap-3">
        {/* Language Switcher Button */}
        <button
          onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 hover:text-white rounded-lg transition-colors"
          title="Switch Language / 切换语言"
        >
          <Globe className="w-3.5 h-3.5 text-indigo-400" />
          <span>{lang === 'en' ? 'English (EN)' : '中文 (双语)'}</span>
        </button>
      </div>
    </header>
  );
}
