'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { WorkoutEditor } from '@/components/WorkoutEditor';
import { WorkoutPlan } from '@/types/workout';
import { RECOMMENDED_COURSES, RecommendedCourse } from '@/lib/presetData';
import { 
  Sparkles, 
  Video, 
  ArrowRight, 
  Dumbbell, 
  Layers, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  Key,
  FileText,
  Play,
  User,
  Clock,
  BookOpen,
  Zap
} from 'lucide-react';
import { useI18n } from '@/lib/i18n';

export default function HomePage() {
  const { lang, t } = useI18n();
  const [url, setUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [customSubtitle, setCustomSubtitle] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState<string>('all');
  
  const [isParsing, setIsParsing] = useState(false);
  const [parseStep, setParseStep] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const [currentPlan, setCurrentPlan] = useState<WorkoutPlan | null>(null);

  const filteredCourses = selectedCreator === 'all' 
    ? RECOMMENDED_COURSES 
    : RECOMMENDED_COURSES.filter(c => c.creator.includes(selectedCreator));

  const handleParse = async (targetUrl?: string) => {
    const inputUrl = targetUrl || url;
    if (!inputUrl || (!inputUrl.includes('youtube.com') && !inputUrl.includes('youtu.be'))) {
      setErrorMsg(lang === 'zh' ? '请输入正确的 YouTube 视频链接 (例如 https://www.youtube.com/watch?v=...)' : 'Please enter a valid YouTube URL');
      return;
    }

    setErrorMsg(null);
    setIsParsing(true);

    try {
      setParseStep(t('step1'));
      await new Promise(r => setTimeout(r, 600));

      setParseStep(t('step2'));
      await new Promise(r => setTimeout(r, 600));

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
      await new Promise(r => setTimeout(r, 500));

      if (data.plan) {
        setCurrentPlan(data.plan);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Parse error occurred');
    } finally {
      setIsParsing(false);
      setParseStep('');
    }
  };

  return (
    <div className="min-h-screen bg-ethereal-mesh text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white relative overflow-x-hidden">
      <Navbar />

      <main className="flex-1 flex flex-col items-center z-10">
        {!currentPlan ? (
          <div className="w-full max-w-6xl px-4 lg:px-8 py-10 lg:py-16 space-y-16 animate-taste-entry">
            
            {/* Hero Section with Eyebrow Badge & Massive Agency Typography */}
            <div className="text-center space-y-6 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[11px] font-mono tracking-[0.15em] uppercase text-indigo-300 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                <span>{t('heroBadge')}</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08]">
                {t('heroTitle')} <br />
                <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                  {t('heroTitleGradient')}
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed font-normal">
                {t('heroDesc')}
              </p>
            </div>

            {/* Main Input Component - Doppelrand (Double-Bezel) Architecture */}
            <div className="doppelrand-outer max-w-4xl mx-auto">
              <div className="doppelrand-inner p-6 sm:p-8 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="space-y-3 relative z-10">
                  <label className="text-[11px] font-mono uppercase tracking-[0.2em] font-semibold text-slate-300 flex items-center gap-2">
                    <Video className="w-4 h-4 text-red-400" />
                    <span>{t('urlLabel')}</span>
                  </label>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder={t('urlPlaceholder')}
                        className="w-full bg-slate-950/90 border border-white/10 focus:border-indigo-500 rounded-2xl px-5 py-4 text-sm text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner"
                      />
                    </div>

                    {/* Button-in-Button Trailing Icon CTA */}
                    <button
                      onClick={() => handleParse()}
                      disabled={isParsing}
                      className="group flex items-center justify-between gap-3 pl-6 pr-2 py-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm rounded-full shadow-lg shadow-indigo-600/30 border border-white/20 btn-taste disabled:opacity-50 shrink-0"
                    >
                      <span>{isParsing ? t('parsingBtn') : t('parseBtn')}</span>
                      <div className="w-8 h-8 rounded-full bg-white/15 border border-white/20 flex items-center justify-center btn-icon-circle shrink-0">
                        {isParsing ? (
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <ArrowRight className="w-4 h-4 text-white" />
                        )}
                      </div>
                    </button>
                  </div>
                </div>

                {/* Advanced Options Toggle */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="text-xs font-semibold text-slate-400 hover:text-indigo-300 flex items-center gap-1.5 transition-colors btn-taste"
                  >
                    <Key className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{showAdvanced ? 'Hide Advanced Options' : t('advancedOptions')}</span>
                  </button>

                  {showAdvanced && (
                    <div className="mt-4 p-4 bg-slate-950/90 border border-white/10 rounded-2xl space-y-4 animate-taste-entry">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">{t('apiKeyLabel')}</label>
                        <input
                          type="password"
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                          placeholder="Supports OpenAI & DeepSeek API (deepseek-chat)"
                          className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">{t('customSubLabel')}</label>
                        <textarea
                          value={customSubtitle}
                          onChange={(e) => setCustomSubtitle(e.target.value)}
                          placeholder="Paste raw video transcript text here..."
                          rows={3}
                          className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Error Alert */}
                {errorMsg && (
                  <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Loading Status Progress */}
                {isParsing && (
                  <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl space-y-2 text-center animate-taste-entry">
                    <div className="flex items-center justify-center gap-2 text-xs font-semibold text-indigo-300">
                      <Sparkles className="w-4 h-4 animate-spin text-indigo-400" />
                      <span>{parseStep}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Saving timestamp evidence and calculating confidence scores...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recommended Master Courses Section */}
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest bg-purple-500/10 text-purple-300 border border-purple-500/20">
                    <Zap className="w-3 h-3 text-purple-400" />
                    <span>Curated Library</span>
                  </div>
                  <h2 className="text-2xl font-black text-white">
                    {lang === 'zh' ? '顶流导师经典健身教程库' : 'Master Exercise Tutorials Library'}
                  </h2>
                </div>

                {/* Creator Filter Tabs with Taste Pill Styling */}
                <div className="flex items-center gap-1.5 bg-white/[0.04] p-1.5 rounded-full border border-white/10 text-xs self-start sm:self-auto backdrop-blur-md">
                  <button
                    onClick={() => setSelectedCreator('all')}
                    className={`px-4 py-1.5 rounded-full font-semibold btn-taste ${selectedCreator === 'all' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                  >
                    {lang === 'zh' ? '全部 (9)' : 'All (9)'}
                  </button>
                  <button
                    onClick={() => setSelectedCreator('Jeff')}
                    className={`px-4 py-1.5 rounded-full font-semibold btn-taste ${selectedCreator === 'Jeff' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                  >
                    Jeff Nippard
                  </button>
                  <button
                    onClick={() => setSelectedCreator('Mike')}
                    className={`px-4 py-1.5 rounded-full font-semibold btn-taste ${selectedCreator === 'Mike' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                  >
                    Mike Israetel
                  </button>
                  <button
                    onClick={() => setSelectedCreator('Layne')}
                    className={`px-4 py-1.5 rounded-full font-semibold btn-taste ${selectedCreator === 'Layne' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                  >
                    Layne Norton
                  </button>
                </div>
              </div>

              {/* Course Cards Grid with Taste Card Lift & Doppelrand Aesthetics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-cascade">
                {filteredCourses.map((course) => (
                  <div
                    key={course.id}
                    className="doppelrand-outer card-taste group"
                  >
                    <div className="doppelrand-inner p-6 space-y-4 h-full flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
                            {course.creator}
                          </span>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3 text-slate-500" />
                            <span>{course.duration_desc}</span>
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2 leading-snug">
                          {lang === 'zh' ? course.title_zh : course.title_en}
                        </h3>

                        <p className="text-xs text-slate-400 bg-slate-950/80 p-2.5 rounded-xl border border-white/5">
                          <strong className="text-slate-300">{lang === 'zh' ? '课程方向:' : 'Topic:'}</strong> {lang === 'zh' ? course.topic_zh : course.topic_en}
                        </p>

                        <div className="space-y-1.5 pt-1">
                          <span className="text-[11px] font-semibold text-slate-300">
                            {lang === 'zh' ? '核心要点:' : 'Core Technique:'}
                          </span>
                          <ul className="space-y-1">
                            {(lang === 'zh' ? course.core_points_zh : course.core_points_en).map((pt, idx) => (
                              <li key={idx} className="text-[11px] text-slate-400 flex items-start gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1 shrink-0" />
                                <span className="line-clamp-2">{pt}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setUrl(course.url);
                          handleParse(course.url);
                        }}
                        className="w-full mt-4 py-2.5 px-4 bg-white/[0.04] hover:bg-indigo-600/30 border border-white/10 hover:border-indigo-500/40 text-indigo-300 text-xs font-bold rounded-xl btn-taste flex items-center justify-center gap-2 group-hover:text-white shadow-sm"
                      >
                        <Play className="w-3.5 h-3.5 fill-indigo-400 group-hover:fill-white transition-colors" />
                        <span>{lang === 'zh' ? '解析该教程训练计划' : 'Parse This Tutorial'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature Architecture Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-white/10">
              <div className="doppelrand-outer card-taste">
                <div className="doppelrand-inner p-5 space-y-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xs font-mono">
                    01
                  </div>
                  <h4 className="text-sm font-bold text-white">Two-Stage LLM Extraction</h4>
                  <p className="text-xs text-slate-400">Classifies content first (is_actionable), then extracts exercises, sets, reps & timestamped cues.</p>
                </div>
              </div>

              <div className="doppelrand-outer card-taste">
                <div className="doppelrand-inner p-5 space-y-2">
                  <div className="w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-xs font-mono">
                    02
                  </div>
                  <h4 className="text-sm font-bold text-white">Deterministic Validation</h4>
                  <p className="text-xs text-slate-400">Prevents AI hallucinations by auditing non-negatives, set rules, superset logic and unresolved items.</p>
                </div>
              </div>

              <div className="doppelrand-outer card-taste">
                <div className="doppelrand-inner p-5 space-y-2">
                  <div className="w-8 h-8 rounded-full bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 font-bold text-xs font-mono">
                    03
                  </div>
                  <h4 className="text-sm font-bold text-white">Bilingual & Image Visuals</h4>
                  <p className="text-xs text-slate-400">Default English with bilingual Chinese support. Dynamic exercise thumbnails for ultimate visual clarity.</p>
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="w-full animate-taste-entry max-w-7xl mx-auto px-4">
            <div className="bg-slate-950/80 border-b border-white/10 px-6 py-3 flex items-center justify-between text-xs backdrop-blur-xl">
              <span className="text-slate-400">Editing Plan: <strong className="text-white">{currentPlan.title}</strong></span>
              <button 
                onClick={() => setCurrentPlan(null)}
                className="text-indigo-400 hover:underline font-medium btn-taste"
              >
                ← Parse Another Video
              </button>
            </div>

            <WorkoutEditor initialPlan={currentPlan} />
          </div>
        )}
      </main>
    </div>
  );
}
