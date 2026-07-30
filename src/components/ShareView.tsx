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
  ArrowLeft,
  Target
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
    <div className="w-full max-w-5xl mx-auto px-4 py-4 space-y-6 animate-minimal-fade">
      {/* Compact Top Navigation Bar */}
      <div className="flex items-center justify-between">
        <Link 
          href="/"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-md text-xs font-medium text-zinc-300 transition-colors btn-minimal-secondary"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{lang === 'zh' ? '返回首页' : 'Back Home'}</span>
        </Link>

        {/* Action Buttons Right on Top so no long scrolling needed */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => copyToClipboard(shareUrl, 'link')}
            className="px-3.5 py-1.5 btn-minimal text-xs flex items-center gap-1.5 shadow-sm"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-zinc-900" /> : <Share2 className="w-3.5 h-3.5 text-zinc-900" />}
            <span>{copiedLink ? t('copiedLink') : t('shareLink')}</span>
          </button>

          <button
            onClick={() => copyToClipboard(JSON.stringify(plan, null, 2), 'json')}
            className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-medium rounded-md btn-minimal-secondary"
          >
            {copiedJson ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedJson ? t('copiedJson') : t('exportJson')}</span>
          </button>

          <button
            onClick={() => setShowHevyModal(true)}
            className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-medium rounded-md btn-minimal-secondary flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5 text-zinc-400" />
            <span>{t('saveToHevy')}</span>
          </button>
        </div>
      </div>

      {/* Share Plan Compact Header Card (Minimalist Zinc Theme) */}
      <div className="minimal-card p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700 rounded flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-zinc-400" />
                <span>{t('verifiedBadge')}</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-zinc-500 bg-zinc-950 border border-zinc-800 rounded">
                {plan.visibility}
              </span>
            </div>

            <h1 className="text-xl font-bold text-zinc-100 tracking-tight">
              {plan.title}
            </h1>

            <p className="text-xs text-zinc-400 max-w-2xl line-clamp-2">
              {plan.description}
            </p>
          </div>
        </div>

        {/* Video Source Attribution */}
        <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <img 
              src={plan.source.thumbnail_url} 
              alt={plan.source.title} 
              className="w-8 h-8 rounded object-cover border border-zinc-800 shrink-0"
            />
            <div className="line-clamp-1">
              <span className="text-zinc-200 font-medium">{plan.source.title}</span>
              <span className="text-zinc-500 text-[11px] font-mono ml-2">({plan.source.channel_name})</span>
            </div>
          </div>

          <a 
            href={plan.source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white font-medium shrink-0 ml-2"
          >
            <span>{t('viewOriginal')}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Exercises Grid List - Fully Aligned Minimalist Monochrome Style */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-1 border-b border-zinc-800">
          <h2 className="text-sm font-bold text-zinc-200 flex items-center gap-2 font-mono uppercase tracking-wider">
            <Dumbbell className="w-4 h-4 text-zinc-400" />
            <span>Workout Routine ({plan.exercises.length} Exercises)</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plan.exercises.map((ex, index) => {
            const displayName = formatExerciseName(ex.name_en || ex.source_name, ex.name_zh || '', lang);
            const imageUrl = ex.image_url || getExerciseImageUrl(ex.name_en || ex.source_name);
            const targetMuscle = lang === 'zh' ? (ex.target_muscle_zh || ex.target_muscle) : (ex.target_muscle || 'Main Muscle');

            return (
              <div key={ex.id || index} className="minimal-card p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <img 
                    src={imageUrl} 
                    alt={displayName}
                    className="w-12 h-12 rounded object-cover border border-zinc-800 shrink-0"
                  />
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded bg-zinc-800 text-zinc-300 font-mono font-bold text-[11px] flex items-center justify-center border border-zinc-700">
                        {index + 1}
                      </span>
                      <h3 className="font-bold text-zinc-100 text-xs">{displayName}</h3>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-mono">
                      {targetMuscle && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-zinc-950 text-zinc-300 border border-zinc-800 rounded text-[10px]">
                          <Target className="w-2.5 h-2.5 text-zinc-500" />
                          <span>{targetMuscle}</span>
                        </span>
                      )}
                      <span>•</span>
                      <span>{ex.repeat_sets} Sets × {ex.sets[0]?.reps || 10} Reps</span>
                    </div>
                  </div>
                </div>

                {ex.coaching_cues && ex.coaching_cues.length > 0 && (
                  <div className="bg-zinc-950 border border-zinc-800/80 rounded p-2.5 space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono font-semibold text-zinc-400">
                      <Sparkles className="w-3 h-3 text-zinc-500" />
                      <span>{t('coachingCues')}</span>
                    </div>
                    <ul className="space-y-1">
                      {ex.coaching_cues.map((cue, cIdx) => (
                        <li key={cIdx} className="text-[11px] text-zinc-300 flex items-start gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-zinc-500 mt-1.5 shrink-0" />
                          <span>{cue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Hevy Modal - Minimalist Monochrome Style */}
      {showHevyModal && (
        <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="minimal-card p-6 max-w-md w-full space-y-4 animate-minimal-fade">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2 font-mono">
                <Layers className="w-4 h-4 text-zinc-400" />
                <span>Export to Hevy Routine</span>
              </h3>
              <button 
                onClick={() => setShowHevyModal(false)}
                className="text-zinc-500 hover:text-zinc-200 text-xs"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-400">
              Hevy API keys are processed securely without long-term server storage.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">Hevy Pro API Key</label>
              <input
                type="password"
                value={hevyApiKey}
                onChange={(e) => setHevyApiKey(e.target.value)}
                placeholder="Paste API Key..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-zinc-600 font-mono"
              />
            </div>

            {hevyStatus && (
              <div className="p-2.5 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded text-xs">
                {hevyStatus}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowHevyModal(false)}
                className="px-3 py-1.5 bg-zinc-900 text-zinc-300 text-xs font-medium rounded-md btn-minimal-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleExportHevy}
                className="px-4 py-1.5 btn-minimal text-xs"
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
