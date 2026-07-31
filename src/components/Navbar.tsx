'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Dumbbell, Globe, Key, User, Sparkles } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { GoogleAuthModal, UserProfile } from './GoogleAuthModal';

export function Navbar() {
  const { lang, setLang, t } = useI18n();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('fit_parser_user');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Failed to load user session:', e);
    }
  }, []);

  const handleLogin = (newUser: UserProfile) => {
    setUser(newUser);
    try {
      localStorage.setItem('fit_parser_user', JSON.stringify(newUser));
    } catch (e) {
      console.warn('Failed to save user session:', e);
    }
  };

  const handleLogout = () => {
    setUser(null);
    try {
      localStorage.removeItem('fit_parser_user');
    } catch (e) {
      console.warn('Failed to clear user session:', e);
    }
    setShowAuthModal(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80 transition-all">
      <div className="w-full max-w-[1500px] mx-auto px-4 lg:px-8 h-14 flex items-center justify-between">
        
        {/* Brand Logo & Title */}
        <Link 
          href="/" 
          className="flex items-center gap-2.5 group transition-transform duration-200 active:scale-[0.97]"
        >
          <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-100 group-hover:border-zinc-500 transition-colors">
            <Dumbbell className="w-4 h-4 text-zinc-100" />
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-bold text-sm text-zinc-100 tracking-tight">
                FitParser
              </span>
              <span className="px-1.5 py-0.2 text-[9px] font-mono uppercase bg-zinc-900 text-zinc-400 border border-zinc-800 rounded">
                v3.3
              </span>
            </div>
            <span className="text-[10px] text-zinc-500 hidden sm:inline font-mono">
              YouTube / B站 / 抖音 ➔ 训练计划
            </span>
          </div>
        </Link>

        {/* Right Action Tools: Google Auth & Language Switcher */}
        <div className="flex items-center gap-3">
          
          {/* User Profile or Google Sign-in */}
          {user ? (
            <button
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-2 px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-md text-xs font-mono text-zinc-200 transition-colors"
            >
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-4 h-4 rounded-full border border-zinc-700 object-cover"
              />
              <span className="max-w-[100px] truncate">{user.name}</span>
              {user.apiKey && <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" title="API Key Active" />}
            </button>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-md text-xs font-medium text-zinc-300 transition-colors btn-minimal-secondary"
            >
              <User className="w-3.5 h-3.5 text-zinc-400" />
              <span>{lang === 'zh' ? 'Google 登录' : 'Sign in'}</span>
            </button>
          )}

          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-mono text-zinc-400 hover:text-zinc-200 bg-zinc-900 border border-zinc-800 rounded-md transition-colors btn-minimal-secondary"
          >
            <Globe className="w-3.5 h-3.5 text-zinc-500" />
            <span className="uppercase">{lang}</span>
          </button>
        </div>

      </div>

      {/* Google Auth & Key Vault Modal */}
      {showAuthModal && (
        <GoogleAuthModal
          user={user}
          onLogin={handleLogin}
          onLogout={handleLogout}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </header>
  );
}
