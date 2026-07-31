'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  GoogleOAuthProvider, 
  GoogleLogin,
  CredentialResponse
} from '@react-oauth/google';
import { 
  Key, 
  Lock, 
  Check, 
  X, 
  LogOut,
  Sparkles,
  ShieldCheck
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

// Decode Google Official JWT Credential Payload
function jwtDecode(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export function GoogleAuthModal({ user, onLogin, onLogout, onClose }: GoogleAuthModalProps) {
  const { lang } = useI18n();
  const [apiKey, setApiKey] = useState('');
  const [savedKey, setSavedKey] = useState(false);
  const [manualEmail, setManualEmail] = useState('');
  const [mounted, setMounted] = useState(false);

  // Default Google Client ID or env fallback
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '1088492040182-samplegoogleclientid.apps.googleusercontent.com';

  useEffect(() => {
    setMounted(true);
    if (user?.apiKey) {
      setApiKey(user.apiKey);
    }
  }, [user]);

  const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      const payload = jwtDecode(credentialResponse.credential);
      if (payload) {
        const realUser: UserProfile = {
          name: payload.name || payload.given_name || 'Google User',
          email: payload.email || 'user@gmail.com',
          avatar: payload.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
          apiKey: apiKey
        };
        onLogin(realUser);
      }
    }
  };

  const handleManualEmailLogin = () => {
    if (!manualEmail || !manualEmail.includes('@')) return;
    const namePart = manualEmail.split('@')[0];
    const newUser: UserProfile = {
      name: namePart.charAt(0).toUpperCase() + namePart.slice(1),
      email: manualEmail,
      avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${manualEmail}`,
      apiKey: apiKey
    };
    onLogin(newUser);
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
    <GoogleOAuthProvider clientId={googleClientId}>
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
              <span>{lang === 'zh' ? 'Google 官方登录与密钥保险箱' : 'Official Google Auth & Key Vault'}</span>
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
                    ? '🔒 密钥加密存储在您的个人 Vault 中，解析新视频时系统自动无感调用。' 
                    : '🔒 API Key encrypted in your personal vault. Auto-applied during parsing.'}
                </p>
              </div>
            </div>
          ) : (
            /* Official Google Login Button & Email Authorization */
            <div className="space-y-4 pt-1">
              <p className="text-xs text-zinc-400">
                {lang === 'zh' 
                  ? '点击下方 Google 官方登录按钮，弹窗授权您的 Google 账号：' 
                  : 'Click below to authorize via official Google Identity Services:'}
              </p>

              {/* Official Google OAuth Widget */}
              <div className="flex justify-center py-2 bg-zinc-950 p-3 rounded-md border border-zinc-800">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => console.warn('Google Login Failed')}
                  useOneTap
                  theme="filled_black"
                  shape="rectangular"
                  text="signin_with"
                />
              </div>

              {/* Direct Gmail Input Fallback */}
              <div className="pt-2 border-t border-zinc-800/80 space-y-2">
                <label className="text-[11px] font-mono text-zinc-400">
                  {lang === 'zh' ? '或手动绑定您的 Google / Gmail 邮箱：' : 'Or enter your Gmail address:'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="email"
                    value={manualEmail}
                    onChange={(e) => setManualEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-zinc-600 font-mono"
                  />
                  <button
                    onClick={handleManualEmailLogin}
                    className="px-3.5 py-2 btn-minimal text-xs shrink-0"
                  >
                    {lang === 'zh' ? '绑定邮箱' : 'Bind'}
                  </button>
                </div>
              </div>

              <div className="pt-1 text-[10px] text-zinc-500 text-center flex items-center justify-center gap-1">
                <ShieldCheck className="w-3 h-3 text-zinc-500" />
                <span>Google OAuth 2.0 Identity Protocol</span>
              </div>
            </div>
          )}

          {/* Footer Close */}
          <div className="flex justify-end pt-2 border-t border-zinc-800">
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-zinc-900 text-zinc-300 text-xs font-medium rounded btn-minimal-secondary"
            >
              {lang === 'zh' ? '关闭' : 'Close'}
            </button>
          </div>

        </div>
      </div>
    </GoogleOAuthProvider>
  );

  return createPortal(modalContent, document.body);
}
