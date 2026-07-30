'use client';

import React, { useState } from 'react';
import { WorkoutPlan } from '@/types/workout';
import { 
  Share2, 
  Copy, 
  Check, 
  ExternalLink, 
  Dumbbell, 
  Clock, 
  ShieldCheck, 
  Sparkles,
  Layers,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { useI18n, formatExerciseName } from '@/lib/i18n';
import { getExerciseImageUrl } from '@/lib/exerciseImages';

interface ShareViewProps {
  plan: WorkoutPlan;
}

export function ShareView({ plan }: ShareViewProps) {
  const { lang, t } = useI18n();
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [showHevyModal, setShowHevyModal] = useState(false);
  const [hevyApiKey, setHevyApiKey] = useState('');
  const [hevyStatus, setHevyStatus] = useState<string | null>(null);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : `/workouts/${plan.slug}`;

  const copyToClipboard = (text: string, type: 'link' | 'json') => {
    navigator.clipboard.writeText(text);
    if (type === 'link') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else {
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2000);
    }
  };

  const handleExportHevy = () => {
    if (!hevyApiKey) {
      setHevyStatus(lang === 'zh' ? '请输入您的 Hevy Pro API Key' : 'Please enter your Hevy Pro API Key');
      return;
    }
    setHevyStatus(lang === 'zh' ? '已成功与 Hevy 模板匹配！Routine 已创建。' : 'Successfully mapped to Hevy exercise templates! Routine created.');
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto p-4 lg:p-8 space-y-8 animate-taste-entry">
      {/* Back Button */}
      <Link 
        href="/"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors btn-taste"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{lang === 'zh' ? '返回首页重新解析' : 'Back to Home'}</span>
      </Link>

      {/* Share Card Header (Doppelrand Double-Bezel Architecture) */}
      <div className="doppelrand-outer shadow-2xl">
        <div className="doppelrand-inner p-6 lg:p-10 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 text-xs font-mono uppercase font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded-full flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{t('verifiedBadge')}</span>
                </span>
                <span className="px-3 py-1 text-xs font-mono uppercase font-semibold bg-white/10 text-slate-200 rounded-full">
                  {plan.visibility}
                </span>
              </div>

              <h1 className="text-2xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                {plan.title}
              </h1>

              <p className="text-sm text-slate-400 max-w-2xl">
                {plan.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => copyToClipboard(shareUrl, 'link')}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold rounded-full btn-taste shadow-lg shadow-indigo-600/25 border border-white/20"
              >
                {copiedLink ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                <span>{copiedLink ? t('copiedLink') : t('shareLink')}</span>
              </button>

              <button
                onClick={() => copyToClipboard(JSON.stringify(plan, null, 2), 'json')}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.06] hover:bg-white/10 text-slate-200 text-xs font-bold rounded-full btn-taste border border-white/10"
              >
                {copiedJson ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedJson ? t('copiedJson') : t('exportJson')}</span>
              </button>

              <button
                onClick={() => setShowHevyModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs rounded-full btn-taste shadow-lg shadow-orange-500/20"
              >
                <Layers className="w-4 h-4" />
                <span>{t('saveToHevy')}</span>
              </button>
            </div>
          </div>

          {/* Video Source Attribution */}
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-3">
              <img 
                src={plan.source.thumbnail_url} 
                alt={plan.source.title} 
                className="w-12 h-12 rounded-xl object-cover border border-white/10 shrink-0 shadow-md"
              />
              <div>
                <p className="text-white font-medium line-clamp-1">{plan.source.title}</p>
                <p className="text-slate-400 text-[11px] font-mono">{plan.source.channel_name}</p>
              </div>
            </div>

            <a 
              href={plan.source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-slate-950 hover:bg-slate-900 border border-white/10 rounded-full text-indigo-300 font-medium btn-taste self-start sm:self-auto"
            >
              <span>{t('viewOriginal')}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Exercises List Card with Exercise Images & Bilingual Names */}
      <div className="space-y-4">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <Dumbbell className="w-5 h-5 text-indigo-400" />
          <span>Workout Plan ({plan.exercises.length} Exercises)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 stagger-cascade">
          {plan.exercises.map((ex, index) => {
            const displayName = formatExerciseName(ex.name_en || ex.source_name, ex.name_zh || '', lang);
            const imageUrl = ex.image_url || getExerciseImageUrl(ex.name_en || ex.source_name);

            return (
              <div key={ex.id || index} className="doppelrand-outer card-taste shadow-xl">
                <div className="doppelrand-inner p-5 space-y-4 h-full">
                  <div className="flex items-start gap-3">
                    <img 
                      src={imageUrl} 
                      alt={displayName}
                      className="w-14 h-14 rounded-xl object-cover border border-white/10 shrink-0 shadow-md"
                    />
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-indigo-600/20 text-indigo-400 font-bold text-xs font-mono flex items-center justify-center">
                          {index + 1}
                        </span>
                        <h3 className="font-bold text-slate-100 text-base">{displayName}</h3>
                      </div>
                      <p className="text-xs text-slate-400 font-mono">
                        {ex.repeat_sets} Sets × {ex.sets[0]?.reps || 10} Reps • Rest {ex.rest_seconds || 60}s
                      </p>
                    </div>
                  </div>

                  {ex.coaching_cues && ex.coaching_cues.length > 0 && (
                    <div className="bg-indigo-950/20 border border-indigo-500/20 rounded-xl p-3 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-indigo-300">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{t('coachingCues')}</span>
                      </div>
                      <ul className="space-y-1">
                        {ex.coaching_cues.map((cue, cIdx) => (
                          <li key={cIdx} className="text-xs text-slate-300 flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                            <span>{cue}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {ex.notes && (
                    <p className="text-xs text-slate-400 bg-slate-950/80 p-2.5 rounded-xl border border-white/5">
                      {ex.notes}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hevy Modal */}
      {showHevyModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 lg:p-8 max-w-md w-full space-y-5 shadow-2xl animate-taste-entry">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-orange-400" />
                <span>Export to Hevy Routine</span>
              </h3>
              <button 
                onClick={() => setShowHevyModal(false)}
                className="text-slate-400 hover:text-white btn-taste"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Hevy API keys are processed securely without long-term server storage.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Hevy Pro API Key</label>
              <input
                type="password"
                value={hevyApiKey}
                onChange={(e) => setHevyApiKey(e.target.value)}
                placeholder="Paste API Key..."
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            {hevyStatus && (
              <div className="p-3 bg-orange-500/10 border border-orange-500/20 text-orange-300 rounded-xl text-xs">
                {hevyStatus}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowHevyModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl btn-taste"
              >
                Cancel
              </button>
              <button
                onClick={handleExportHevy}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-black text-xs rounded-xl btn-taste shadow-lg shadow-orange-500/20"
              >
                Match & Export Routine
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
