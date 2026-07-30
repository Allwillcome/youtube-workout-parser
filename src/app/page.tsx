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
  BookOpen
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

  // Filter courses by selected creator
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="flex-1 flex flex-col items-center">
        {!currentPlan ? (
          <div className="w-full max-w-6xl px-4 lg:px-8 py-12 lg:py-16 space-y-12">
            
            {/* Hero Section */}
            <div className="text-center space-y-5 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                <span>{t('heroBadge')}</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
                {t('heroTitle')} <br />
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {t('heroTitleGradient')}
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
                {t('heroDesc')}
              </p>
            </div>

            {/* Main Input Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

              <div className="space-y-3 relative z-10">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Video className="w-4 h-4 text-red-500" />
                  <span>{t('urlLabel')}</span>
                </label>

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder={t('urlPlaceholder')}
                      className="w-full bg-slate-950/90 border border-slate-700/80 focus:border-indigo-500 rounded-2xl px-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner"
                    />
                  </div>

                  <button
                    onClick={() => handleParse()}
                    disabled={isParsing}
                    className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm rounded-2xl shadow-lg shadow-indigo-600/30 transition-all active:scale-95 disabled:opacity-50 shrink-0"
                  >
                    {isParsing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>{t('parsingBtn')}</span>
                      </>
                    ) : (
                      <>
                        <span>{t('parseBtn')}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Advanced Options Toggle */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="text-xs font-semibold text-slate-400 hover:text-indigo-400 flex items-center gap-1.5 transition-colors"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>{showAdvanced ? 'Hide Advanced Options' : t('advancedOptions')}</span>
                </button>

                {showAdvanced && (
                  <div className="mt-4 p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">{t('apiKeyLabel')}</label>
                      <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Supports OpenAI & DeepSeek API (deepseek-chat)"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">{t('customSubLabel')}</label>
                      <textarea
                        value={customSubtitle}
                        onChange={(e) => setCustomSubtitle(e.target.value)}
                        placeholder="Paste raw video transcript text here..."
                        rows={3}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
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
                <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl space-y-2 text-center">
                  <div className="flex items-center justify-center gap-2 text-xs font-semibold text-indigo-300">
                    <Sparkles className="w-4 h-4 animate-spin text-indigo-400" />
                    <span>{parseStep}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Saving timestamp evidence and calculating confidence scores...</p>
                </div>
              )}
            </div>

            {/* Recommended Master Courses Section */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-400" />
                    <span>{lang === 'zh' ? '顶流导师经典健身教程库' : 'Master Exercise Tutorials Library'}</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    {lang === 'zh' ? '精选 Jeff Nippard、Mike Israetel (RP)、Layne Norton 权威动作指南' : 'Curated technical guides by Jeff Nippard, Dr. Mike Israetel (RP) & Layne Norton'}
                  </p>
                </div>

                {/* Creator Filter Tabs */}
                <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs self-start sm:self-auto">
                  <button
                    onClick={() => setSelectedCreator('all')}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all ${selectedCreator === 'all' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                  >
                    {lang === 'zh' ? '全部 (9)' : 'All (9)'}
                  </button>
                  <button
                    onClick={() => setSelectedCreator('Jeff')}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all ${selectedCreator === 'Jeff' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                  >
                    Jeff Nippard
                  </button>
                  <button
                    onClick={() => setSelectedCreator('Mike')}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all ${selectedCreator === 'Mike' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                  >
                    Mike Israetel
                  </button>
                  <button
                    onClick={() => setSelectedCreator('Layne')}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all ${selectedCreator === 'Layne' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                  >
                    Layne Norton
                  </button>
                </div>
              </div>

              {/* Course Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {filteredCourses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/50 p-5 rounded-2xl space-y-4 transition-all flex flex-col justify-between group shadow-xl"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 text-[11px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-md">
                          {course.creator}
                        </span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>{course.duration_desc}</span>
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-2">
                        {lang === 'zh' ? course.title_zh : course.title_en}
                      </h3>

                      <p className="text-xs text-slate-400 bg-slate-950/50 p-2 rounded-lg border border-slate-800/80">
                        <strong>{lang === 'zh' ? '课程方向:' : 'Topic:'}</strong> {lang === 'zh' ? course.topic_zh : course.topic_en}
                      </p>

                      <div className="space-y-1 pt-1">
                        <span className="text-[11px] font-semibold text-slate-300">
                          {lang === 'zh' ? '核心要点:' : 'Core Technique:'}
                        </span>
                        <ul className="space-y-1">
                          {(lang === 'zh' ? course.core_points_zh : course.core_points_en).map((pt, idx) => (
                            <li key={idx} className="text-[11px] text-slate-400 flex items-start gap-1.5">
                              <span className="w-1 h-1 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
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
                      className="w-full mt-4 py-2.5 bg-slate-950 hover:bg-indigo-600/20 border border-slate-800 hover:border-indigo-500/30 text-indigo-400 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 group-hover:text-white"
                    >
                      <Play className="w-3.5 h-3.5 fill-indigo-400 group-hover:fill-white transition-colors" />
                      <span>{lang === 'zh' ? '解析该教程训练计划' : 'Parse This Tutorial'}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature Architecture Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-900">
              <div className="p-5 bg-slate-900/40 border border-slate-800/60 rounded-2xl space-y-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xs">
                  1
                </div>
                <h4 className="text-sm font-bold text-white">Two-Stage LLM Extraction</h4>
                <p className="text-xs text-slate-400">Classifies content first (is_actionable), then extracts exercises, sets, reps & timestamped cues.</p>
              </div>

              <div className="p-5 bg-slate-900/40 border border-slate-800/60 rounded-2xl space-y-2">
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-xs">
                  2
                </div>
                <h4 className="text-sm font-bold text-white">Deterministic Validation</h4>
                <p className="text-xs text-slate-400">Prevents AI hallucinations by auditing non-negatives, set rules, superset logic and unresolved items.</p>
              </div>

              <div className="p-5 bg-slate-900/40 border border-slate-800/60 rounded-2xl space-y-2">
                <div className="w-8 h-8 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 font-bold text-xs">
                  3
                </div>
                <h4 className="text-sm font-bold text-white">Bilingual & Image Visuals</h4>
                <p className="text-xs text-slate-400">Default English with bilingual Chinese support. Dynamic exercise thumbnails for ultimate visual clarity.</p>
              </div>
            </div>

          </div>
        ) : (
          <div className="w-full">
            <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center justify-between text-xs">
              <span className="text-slate-400">Editing Plan: <strong className="text-white">{currentPlan.title}</strong></span>
              <button 
                onClick={() => setCurrentPlan(null)}
                className="text-indigo-400 hover:underline font-medium"
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
