'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { WorkoutEditor } from '@/components/WorkoutEditor';
import { WorkoutPlan } from '@/types/workout';
import { RECOMMENDED_COURSES, RecommendedCourse } from '@/lib/presetData';
import { 
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
    <div className="min-h-screen bg-minimal-canvas text-zinc-100 flex flex-col font-sans selection:bg-zinc-700 selection:text-white">
      <Navbar />

      <main className="flex-1 flex flex-col items-center">
        {!currentPlan ? (
          <div className="w-full max-w-5xl px-4 lg:px-8 py-12 lg:py-16 space-y-12 animate-minimal-fade">
            
            {/* Hero Section */}
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-[11px] font-mono uppercase tracking-widest text-zinc-400">
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

            {/* Main Input Component - Clean Utilitarian Style */}
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

            {/* Recommended Master Courses Section */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-zinc-400" />
                    <span>{lang === 'zh' ? '顶流导师经典健身教程库' : 'Master Exercise Tutorials Library'}</span>
                  </h2>
                  <p className="text-xs text-zinc-400">
                    {lang === 'zh' ? '精选 Jeff Nippard、Mike Israetel (RP)、Layne Norton 权威动作指南' : 'Curated technical guides by Jeff Nippard, Dr. Mike Israetel (RP) & Layne Norton'}
                  </p>
                </div>

                {/* Creator Filter Tabs */}
                <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-md border border-zinc-800 text-xs self-start sm:self-auto font-mono">
                  <button
                    onClick={() => setSelectedCreator('all')}
                    className={`px-3 py-1 rounded font-medium transition-all ${selectedCreator === 'all' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
                  >
                    {lang === 'zh' ? '全部 (9)' : 'All (9)'}
                  </button>
                  <button
                    onClick={() => setSelectedCreator('Jeff')}
                    className={`px-3 py-1 rounded font-medium transition-all ${selectedCreator === 'Jeff' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
                  >
                    Jeff Nippard
                  </button>
                  <button
                    onClick={() => setSelectedCreator('Mike')}
                    className={`px-3 py-1 rounded font-medium transition-all ${selectedCreator === 'Mike' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
                  >
                    Mike Israetel
                  </button>
                  <button
                    onClick={() => setSelectedCreator('Layne')}
                    className={`px-3 py-1 rounded font-medium transition-all ${selectedCreator === 'Layne' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
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
                    className="minimal-card p-5 space-y-4 flex flex-col justify-between group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700/60 rounded">
                          {course.creator}
                        </span>
                        <span className="text-[11px] text-zinc-500 flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3" />
                          <span>{course.duration_desc}</span>
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-zinc-100 group-hover:text-white transition-colors line-clamp-2">
                        {lang === 'zh' ? course.title_zh : course.title_en}
                      </h3>

                      <p className="text-xs text-zinc-400 bg-zinc-950 p-2 rounded border border-zinc-800/80">
                        <strong className="text-zinc-300">{lang === 'zh' ? '课程方向:' : 'Topic:'}</strong> {lang === 'zh' ? course.topic_zh : course.topic_en}
                      </p>

                      <div className="space-y-1.5 pt-1">
                        <span className="text-[11px] font-semibold text-zinc-300">
                          {lang === 'zh' ? '核心要点:' : 'Core Technique:'}
                        </span>
                        <ul className="space-y-1">
                          {(lang === 'zh' ? course.core_points_zh : course.core_points_en).map((pt, idx) => (
                            <li key={idx} className="text-[11px] text-zinc-400 flex items-start gap-1.5">
                              <span className="w-1 h-1 rounded-full bg-zinc-500 mt-1.5 shrink-0" />
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
                      className="w-full mt-4 py-2 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-medium rounded-md btn-minimal-secondary flex items-center justify-center gap-2"
                    >
                      <Play className="w-3 h-3 text-zinc-400" />
                      <span>{lang === 'zh' ? '解析该教程训练计划' : 'Parse This Tutorial'}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature Architecture Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-8 border-t border-zinc-800">
              <div className="minimal-card p-4 space-y-2">
                <div className="w-6 h-6 rounded bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 font-mono font-bold text-xs">
                  01
                </div>
                <h4 className="text-xs font-bold text-zinc-200">Two-Stage LLM Extraction</h4>
                <p className="text-[11px] text-zinc-400">Classifies content first (is_actionable), then extracts exercises, sets, reps & timestamped cues.</p>
              </div>

              <div className="minimal-card p-4 space-y-2">
                <div className="w-6 h-6 rounded bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 font-mono font-bold text-xs">
                  02
                </div>
                <h4 className="text-xs font-bold text-zinc-200">Deterministic Validation</h4>
                <p className="text-[11px] text-zinc-400">Prevents AI hallucinations by auditing non-negatives, set rules, superset logic and unresolved items.</p>
              </div>

              <div className="minimal-card p-4 space-y-2">
                <div className="w-6 h-6 rounded bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 font-mono font-bold text-xs">
                  03
                </div>
                <h4 className="text-xs font-bold text-zinc-200">Bilingual & Image Visuals</h4>
                <p className="text-[11px] text-zinc-400">Default English with bilingual Chinese support. Dynamic exercise thumbnails for ultimate visual clarity.</p>
              </div>
            </div>

          </div>
        ) : (
          <div className="w-full animate-minimal-fade max-w-7xl mx-auto px-4">
            <div className="bg-zinc-900 border-b border-zinc-800 px-6 py-2.5 flex items-center justify-between text-xs">
              <span className="text-zinc-400">Editing Plan: <strong className="text-zinc-100">{currentPlan.title}</strong></span>
              <button 
                onClick={() => setCurrentPlan(null)}
                className="text-zinc-300 hover:text-white font-medium btn-minimal-secondary px-3 py-1"
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
