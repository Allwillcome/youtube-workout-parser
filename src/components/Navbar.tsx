'use client';

import React from 'react';
import { Dumbbell, Globe } from 'lucide-react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';

export function Navbar() {
  const { lang, setLang, t } = useI18n();

  return (
    <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo - Utilitarian Monochrome Style */}
        <Link href="/" className="flex items-center gap-2.5 group btn-minimal-secondary px-3 py-1.5 border-transparent bg-transparent hover:bg-zinc-900">
          <div className="w-7 h-7 rounded-md bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-200 group-hover:text-white transition-colors">
            <Dumbbell className="w-3.5 h-3.5" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-tight text-zinc-100">
              {t('appName')}
            </span>
            <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest text-zinc-400 bg-zinc-900 border border-zinc-800 rounded">
              Phase 1 MVP
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          {/* Language Switcher Button - Minimalist Zinc Pill */}
          <button
            onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-md btn-minimal-secondary shadow-sm"
            title="Switch Language / 切换语言"
          >
            <Globe className="w-3.5 h-3.5 text-zinc-400" />
            <span>{lang === 'en' ? 'English (EN)' : '中文 (双语)'}</span>
          </button>
        </div>

      </div>
    </header>
  );
}
