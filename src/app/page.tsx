'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { useRouter } from 'next/navigation';
import { RECOMMENDED_COURSES } from '@/lib/presetData';
import { 
  Video, 
  ArrowRight, 
  Dumbbell, 
  AlertCircle,
  Key,
  Play,
  Clock,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { useI18n } from '@/lib/i18n';

export default function HomePage() {
  const { lang, t } = useI18n();
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [customSubtitle, setCustomSubtitle] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const [isParsing, setIsParsing] = useState(false);
  const [parseStep, setParseStep] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleParse = async (targetUrl?: string) => {
    const inputUrl = targetUrl || url;
    if (!inputUrl || inputUrl.trim() === '') {
      setErrorMsg(lang === 'zh' ? '请输入正确的视频链接 (支持 YouTube / B站 / 抖音)' : 'Please enter a valid video URL (YouTube / Bilibili / Douyin)');
      return;
    }

    setErrorMsg(null);
    setIsParsing(true);

    try {
      setParseStep(t('step1'));
      await new Promise(r => setTimeout(r, 400));

      setParseStep(t('step2'));
      await new Promise(r => setTimeout(r, 400));

      setParseStep(t('step3'));
      
      const res = await fetch('/api/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: inputUrl,
          apiKey,
          customSubtitle
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Parse failed');
      }

      setParseStep(t('step4'));
      await new Promise(r => setTimeout(r, 300));

      if (data.plan && data.plan.slug) {
        // Save plan into browser localStorage
        try {
          const stored = localStorage.getItem('yt_workout_plans') || '{}';
          const map = JSON.parse(stored);
          map[data.plan.slug] = data.plan;
          map[data.plan.id] = data.plan;
          localStorage.setItem('yt_workout_plans', JSON.stringify(map));
        } catch (e) {
          console.warn('Failed to save to localStorage:', e);
        }

        router.push(`/workouts/${data.plan.slug}`);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Parse error occurred');
    } finally {
      setIsParsing(false);
      setParseStep('');
    }
  };

  return (
    <div className="min-h-screen bg-minimal-canvas text-zinc-100 flex flex-col font-sans selection:bg-zinc-700 selection:text-white">
      <Navbar />

      <main className="flex-1 flex flex-col items-center">
        <div className="w-full max-w-4xl px-4 lg:px-8 py-12 lg:py-16 space-y-12 animate-minimal-fade">
          
          {/* Hero Section */}
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-[11px] font-mono uppercase tracking-widest text-zinc-400">
              <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
              <span>{t('heroBadge')}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold text-zinc-100 tracking-tight leading-tight">
              {t('heroTitle')}{' '}
              <span className="text-zinc-400 font-normal">
                {t('heroTitleGradient')}
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
              {t('heroDesc')}
            </p>
          </div>

          {/* Main Input Component - Supporting Multi-Platforms */}
          <div className="minimal-card p-6 sm:p-8 space-y-6">
            <div className="space-y-3">
              <label className="text-[11px] font-mono uppercase tracking-wider font-semibold text-zinc-300 flex items-center gap-2">
                <Video className="w-3.5 h-3.5 text-zinc-400" />
                <span>{t('urlLabel')}</span>
              </label>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder={t('urlPlaceholder')}
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors font-mono"
                />

                <button
                  onClick={() => handleParse()}
                  disabled={isParsing}
                  className="px-6 py-3 btn-minimal text-xs flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
                >
                  {isParsing ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
                      <span>{t('parsingBtn')}</span>
                    </>
                  ) : (
                    <>
                      <span>{t('parseBtn')}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Advanced Options Toggle */}
            <div className="pt-1 border-t border-zinc-800/60">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-xs font-medium text-zinc-400 hover:text-zinc-200 flex items-center gap-1.5 transition-colors"
              >
                <Key className="w-3.5 h-3.5 text-zinc-500" />
                <span>{showAdvanced ? 'Hide Advanced Options' : t('advancedOptions')}</span>
              </button>

              {showAdvanced && (
                <div className="mt-4 p-4 bg-zinc-950 border border-zinc-800 rounded-lg space-y-4 animate-minimal-fade">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-300">{t('apiKeyLabel')}</label>
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Supports OpenAI & DeepSeek API (deepseek-chat)"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-zinc-600 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-300">{t('customSubLabel')}</label>
                    <textarea
                      value={customSubtitle}
                      onChange={(e) => setCustomSubtitle(e.target.value)}
                      placeholder="Paste raw video transcript text here..."
                      rows={3}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-zinc-600 font-mono"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Error Alert */}
            {errorMsg && (
              <div className="p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-zinc-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Loading Status Progress */}
            {isParsing && (
              <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-center space-y-1 animate-minimal-fade">
                <div className="text-xs font-medium text-zinc-300 flex items-center justify-center gap-2">
                  <div className="w-3 h-3 border-2 border-zinc-200 border-t-transparent rounded-full animate-spin" />
                  <span>{parseStep}</span>
                </div>
              </div>
            )}
          </div>

          {/* Featured Recommended Videos Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-mono uppercase tracking-wider font-bold text-zinc-300 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-zinc-400" />
                <span>{lang === 'zh' ? '多平台精选视频教程 (B站 / 抖音 / YouTube)' : 'Featured Multi-Platform Tutorials'}</span>
              </h2>
              <span className="text-[11px] text-zinc-500 font-mono">Bilibili • Douyin • YouTube</span>
            </div>

            {/* Clean Video Cards List */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {RECOMMENDED_COURSES.map((course) => (
                <div
                  key={course.id}
                  className="minimal-card p-5 space-y-3 flex flex-col justify-between group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700/60 rounded">
                        {course.creator}
                      </span>
                      <span className="text-[11px] text-zinc-500 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        <span>{course.duration_desc}</span>
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-zinc-100 group-hover:text-white transition-colors line-clamp-2 leading-relaxed">
                      {lang === 'zh' ? course.title_zh : course.title_en}
                    </h3>
                  </div>

                  <button
                    onClick={() => {
                      setUrl(course.url);
                      handleParse(course.url);
                    }}
                    className="w-full py-2 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-medium rounded-md btn-minimal-secondary flex items-center justify-center gap-2"
                  >
                    <Play className="w-3 h-3 text-zinc-400" />
                    <span>{lang === 'zh' ? '解析视频' : 'Parse Video'}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Architecture Footer Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-zinc-800/80">
            <div className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-lg space-y-1">
              <div className="text-[11px] font-mono font-bold text-zinc-300">01. Multi-Platform</div>
              <p className="text-[11px] text-zinc-500">Supports Bilibili, Douyin & YouTube links.</p>
            </div>

            <div className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-lg space-y-1">
              <div className="text-[11px] font-mono font-bold text-zinc-300">02. Deterministic Audit</div>
              <p className="text-[11px] text-zinc-500">Validates non-negatives, sets & superset rules.</p>
            </div>

            <div className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-lg space-y-1">
              <div className="text-[11px] font-mono font-bold text-zinc-300">03. Drill-down Routes</div>
              <p className="text-[11px] text-zinc-500">Unique shareable URL for every parsed video.</p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
