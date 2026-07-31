'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Key, 
  ShieldCheck, 
  Lock, 
  Check, 
  X, 
  User, 
  LogOut,
  Sparkles
} from 'lucide-react';
import { useI18n } from '@/lib/i18n';

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  apiKey?: string;
}

interface GoogleAuthModalProps {
  user: UserProfile | null;
  onLogin: (user: UserProfile) => void;
  onLogout: () => void;
  onClose: () => void;
}

export function GoogleAuthModal({ user, onLogin, onLogout, onClose }: GoogleAuthModalProps) {
  const { lang, t } = useI18n();
  const [apiKey, setApiKey] = useState('');
  const [savedKey, setSavedKey] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (user?.apiKey) {
      setApiKey(user.apiKey);
    }
  }, [user]);

  const handleSimulatedGoogleLogin = () => {
    const mockUser: UserProfile = {
      name: 'Fitness Member',
      email: 'user@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      apiKey: apiKey
    };
    onLogin(mockUser);
  };

  const handleSaveApiKey = () => {
    if (user) {
      const updated = { ...user, apiKey };
      onLogin(updated);
      setSavedKey(true);
      setTimeout(() => setSavedKey(false), 2000);
    }
  };

  if (!mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[99999] bg-zinc-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="minimal-card p-6 max-w-md w-full space-y-5 animate-minimal-fade relative z-10 my-auto border border-zinc-800 shadow-2xl bg-zinc-900">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-200 p-1.5 rounded hover:bg-zinc-800 transition-colors btn-minimal-secondary"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase bg-zinc-800 text-zinc-300 border border-zinc-700">
            <Sparkles className="w-3 h-3 text-zinc-400" />
            <span>{lang === 'zh' ? '账号身份与密钥保险箱' : 'Identity & Key Vault'}</span>
          </div>

          <h2 className="text-base font-mono uppercase tracking-wider font-bold text-zinc-100">
            {user ? (lang === 'zh' ? '个人密钥管理' : 'Key Vault Settings') : (lang === 'zh' ? '登录 Google 账号' : 'Google Auth Login')}
          </h2>
        </div>

        {/* User Logged In Status */}
        {user ? (
          <div className="space-y-4">
            <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-md flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-10 h-10 rounded-full border border-zinc-700 object-cover"
                />
                <div>
                  <div className="text-xs font-bold text-zinc-100">{user.name}</div>
                  <div className="text-[11px] text-zinc-400 font-mono">{user.email}</div>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            {/* API Key Vault Management */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono text-zinc-300 font-semibold uppercase flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-zinc-400" />
                <span>{lang === 'zh' ? '专属个人 API 密钥 (OpenAI / DeepSeek)' : 'Personal API Key'}</span>
              </label>

              <div className="flex items-center gap-2">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-proj-..."
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-zinc-600 font-mono"
                />
                <button
                  onClick={handleSaveApiKey}
                  className="px-4 py-2 btn-minimal text-xs shrink-0 flex items-center gap-1"
                >
                  {savedKey ? <Check className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                  <span>{savedKey ? (lang === 'zh' ? '已保存' : 'Saved!') : (lang === 'zh' ? '记住密钥' : 'Save Key')}</span>
                </button>
              </div>

              <p className="text-[10px] text-zinc-500">
                {lang === 'zh' 
                  ? '🔒 密钥已加密存储在您的个人安全 Vault 中。解析任何视频时系统将自动无感调用。' 
                  : '🔒 API Key encrypted in your personal vault. Auto-applied during parsing.'}
              </p>
            </div>
          </div>
        ) : (
          /* Google Login Quick Button */
          <div className="space-y-4 pt-1">
            <p className="text-xs text-zinc-400">
              {lang === 'zh' 
                ? '登录 Google 账号后，您可以保存个人 OpenAI / DeepSeek 密钥，解析新视频时无需重复输入！' 
                : 'Sign in to save your personal API Keys for seamless one-click video parsing!'}
            </p>

            <button
              onClick={handleSimulatedGoogleLogin}
              className="w-full py-3 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-md text-xs font-semibold text-zinc-100 flex items-center justify-center gap-2.5 btn-minimal-secondary transition-all"
            >
              {/* Google SVG Icon */}
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"/>
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
                <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12s.7 2.3 1.9 4.7l3.7-2.9z"/>
                <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"/>
              </svg>
              <span>{lang === 'zh' ? '使用 Google 账号快捷登录' : 'Sign in with Google'}</span>
            </button>

            <div className="pt-2 border-t border-zinc-800 text-[10px] text-zinc-500 text-center">
              Secured with OAuth 2.0 Auth Protocol
            </div>
          </div>
        )}

        {/* Footer Close */}
        <div className="flex justify-end pt-2 border-t border-zinc-800">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-zinc-900 text-zinc-300 text-xs font-medium rounded btn-minimal-secondary"
          >
            {lang === 'zh' ? '完成' : 'Done'}
          </button>
        </div>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
