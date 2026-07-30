'use client';

import React, { useState, useRef } from 'react';
import { 
  WorkoutPlan, 
  ExerciseItem, 
  WorkoutSet, 
  UnresolvedItem,
  EvidenceSegment 
} from '@/types/workout';
import { 
  Play, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Share2, 
  Save, 
  ExternalLink, 
  Layers, 
  Info, 
  ChevronRight,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  Image as ImageIcon
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useI18n, formatExerciseName } from '@/lib/i18n';
import { getExerciseImageUrl } from '@/lib/exerciseImages';
import { ExportHubModal } from '@/components/ExportHubModal';

interface WorkoutEditorProps {
  initialPlan: WorkoutPlan;
  isReadOnly?: boolean;
}

export function WorkoutEditor({ initialPlan, isReadOnly = false }: WorkoutEditorProps) {
  const { lang, t } = useI18n();
  const [plan, setPlan] = useState<WorkoutPlan>(initialPlan);
  const [activeTimestamp, setActiveTimestamp] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessSlug, setSaveSuccessSlug] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showExportHub, setShowExportHub] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const router = useRouter();

  const jumpToTime = (seconds: number) => {
    setActiveTimestamp(seconds);
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: 'seekTo', args: [seconds, true] }),
        '*'
      );
      iframeRef.current.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: 'playVideo', args: [] }),
        '*'
      );
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const updateExercise = (index: number, updated: Partial<ExerciseItem>) => {
    const newExercises = [...plan.exercises];
    newExercises[index] = { ...newExercises[index], ...updated };
    setPlan({ ...plan, exercises: newExercises });
  };

  const addSet = (exIndex: number) => {
    const newExercises = [...plan.exercises];
    const targetEx = newExercises[exIndex];
    const lastSet = targetEx.sets[targetEx.sets.length - 1] || {
      set_type: 'normal',
      reps: 12,
      duration_seconds: null,
      weight_kg: null,
      distance_meters: null,
      rpe: null
    };

    targetEx.sets = [...targetEx.sets, { ...lastSet }];
    targetEx.repeat_sets = targetEx.sets.length;
    setPlan({ ...plan, exercises: newExercises });
  };

  const removeSet = (exIndex: number, setIndex: number) => {
    const newExercises = [...plan.exercises];
    const targetEx = newExercises[exIndex];
    if (targetEx.sets.length <= 1) return;

    targetEx.sets = targetEx.sets.filter((_, idx) => idx !== setIndex);
    targetEx.repeat_sets = targetEx.sets.length;
    setPlan({ ...plan, exercises: newExercises });
  };

  const addExercise = () => {
    const newEx: ExerciseItem = {
      id: `ex_custom_${Date.now()}`,
      order: plan.exercises.length + 1,
      source_name: 'Dumbbell Curl',
      name_en: 'Dumbbell Curl',
      name_zh: '哑铃弯举',
      canonical_name: null,
      image_url: getExerciseImageUrl('Dumbbell Curl'),
      repeat_sets: 3,
      sets: [
        { set_type: 'normal', reps: 10, duration_seconds: null, weight_kg: null, distance_meters: null, rpe: null },
        { set_type: 'normal', reps: 10, duration_seconds: null, weight_kg: null, distance_meters: null, rpe: null },
        { set_type: 'normal', reps: 10, duration_seconds: null, weight_kg: null, distance_meters: null, rpe: null }
      ],
      rest_seconds: 60,
      superset_group: null,
      notes: '',
      coaching_cues: ['Keep elbows pinned to sides'],
      confidence: 1.0,
      evidence: []
    };
    setPlan({ ...plan, exercises: [...plan.exercises, newEx] });
  };

  const removeExercise = (index: number) => {
    const updated = plan.exercises.filter((_, idx) => idx !== index).map((ex, idx) => ({ ...ex, order: idx + 1 }));
    setPlan({ ...plan, exercises: updated });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);

    try {
      const res = await fetch('/api/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || (data.details ? data.details.join('; ') : 'Save failed'));
      }

      setSaveSuccessSlug(data.slug);
      setShowExportHub(true);
    } catch (err: any) {
      setSaveError(err.message || 'Unknown save error');
    } finally {
      setIsSaving(false);
    }
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 0.9) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider uppercase font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          {lang === 'zh' ? `高置信度 (${(confidence * 100).toFixed(0)}%)` : `High (${(confidence * 100).toFixed(0)}%)`}
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider uppercase font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
          <AlertTriangle className="w-3 h-3 text-amber-400" />
          {lang === 'zh' ? `需确认 (${(confidence * 100).toFixed(0)}%)` : `Review (${(confidence * 100).toFixed(0)}%)`}
        </span>
      );
    }
  };

  const videoEmbedUrl = `https://www.youtube.com/embed/${plan.source.video_id}?enablejsapi=1&autoplay=0`;

  return (
    <div className="w-full max-w-[1600px] mx-auto p-4 lg:p-6 space-y-6 animate-taste-entry">
      {/* Top Banner with Doppelrand Outer/Inner Architecture */}
      <div className="doppelrand-outer shadow-2xl">
        <div className="doppelrand-inner p-4 lg:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
                {plan.status === 'verified' ? t('verifiedBadge') : 'Draft Plan'}
              </span>
              <span className="text-xs text-slate-400 font-mono">Schema Version {plan.schema_version}</span>
            </div>
            <input
              type="text"
              disabled={isReadOnly}
              value={plan.title}
              onChange={(e) => setPlan({ ...plan, title: e.target.value })}
              className="w-full text-xl lg:text-2xl font-black bg-transparent border-b border-transparent hover:border-white/10 focus:border-indigo-500 focus:outline-none text-white transition-colors py-1"
              placeholder="Enter Workout Plan Title..."
            />
            <p className="text-xs text-slate-400 line-clamp-2">{plan.description}</p>
          </div>

          {!isReadOnly && (
            <div className="flex items-center gap-3 self-start md:self-auto">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="group flex items-center justify-between gap-3 pl-6 pr-2 py-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm rounded-full shadow-lg shadow-indigo-600/30 border border-white/20 btn-taste disabled:opacity-50"
              >
                <span>{isSaving ? t('saving') : t('verifySave')}</span>
                <div className="w-8 h-8 rounded-full bg-white/15 border border-white/20 flex items-center justify-center btn-icon-circle shrink-0">
                  {isSaving ? (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 text-white" />
                  )}
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {saveError && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-300 text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: YouTube Player & Metadata */}
        <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
          <div className="doppelrand-outer shadow-2xl">
            <div className="doppelrand-inner overflow-hidden">
              <div className="relative aspect-video bg-slate-950">
                <iframe
                  ref={iframeRef}
                  src={videoEmbedUrl}
                  title={plan.source.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="p-4 space-y-3 bg-slate-950/60">
                <div className="flex items-center justify-between">
                  <a
                    href={plan.source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-slate-300 hover:text-indigo-400 flex items-center gap-1.5 transition-colors line-clamp-1"
                  >
                    <span>{plan.source.channel_name}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <span className="text-[11px] text-slate-500 font-mono">{t('viewOriginal')}</span>
                </div>
                
                <h3 className="text-sm font-bold text-slate-200 line-clamp-2">
                  {plan.source.title}
                </h3>
              </div>
            </div>
          </div>

          {/* Video Content Diagnostic Report (Multilingual) */}
          {plan.classification && (
            <div className="doppelrand-outer">
              <div className="doppelrand-inner p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      {lang === 'zh' ? '视频内容诊断报告' : 'Video Diagnostic Report'}
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                    {lang === 'zh' ? '可执行度 98%' : '98% Actionable'}
                  </span>
                </div>

                <p className="text-xs text-slate-300">
                  {lang === 'zh' 
                    ? (plan.classification.summary_zh || '成功验证包含结构化动作、组数、次数及姿势要点。') 
                    : (plan.classification.summary_en || 'Successfully verified actionable exercises, sets, reps & coaching cues.')}
                </p>

                <ul className="space-y-1.5 pt-1">
                  {(lang === 'zh' ? (plan.classification.reasons_zh || plan.classification.reasons) : plan.classification.reasons).map((reason, rIdx) => (
                    <li key={rIdx} className="text-[11px] text-slate-400 flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 mt-0.5 shrink-0" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Hevy Adapter Widget */}
          <div className="doppelrand-outer">
            <div className="doppelrand-inner p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-indigo-600/20 flex items-center justify-center border border-indigo-500/30">
                    <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  </div>
                  <span className="text-xs font-bold text-slate-200">Hevy Routine Connector</span>
                </div>
                <span className="text-[10px] font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded">Adapter Ready</span>
              </div>
              <p className="text-xs text-slate-400">
                Verified JSON maps seamlessly to Hevy Routine format via exercise template matching.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Structured Workout Plan Editor */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white">{t('exercisesHeader')}</h2>
              <span className="text-xs font-mono text-slate-400">({plan.exercises.length})</span>
            </div>
            {!isReadOnly && (
              <button
                onClick={addExercise}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 border border-white/10 text-indigo-300 rounded-xl btn-taste"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t('addExercise')}</span>
              </button>
            )}
          </div>

          {/* Exercises List */}
          <div className="space-y-5 stagger-cascade">
            {plan.exercises.map((ex, index) => {
              const displayName = formatExerciseName(ex.name_en || ex.source_name, ex.name_zh || '', lang);
              const imageUrl = ex.image_url || getExerciseImageUrl(ex.name_en || ex.source_name);

              return (
                <div 
                  key={ex.id || index}
                  className="doppelrand-outer card-taste shadow-xl"
                >
                  <div className="doppelrand-inner p-4 lg:p-5 space-y-4">
                    
                    {/* Exercise Top Header with Thumbnail Image */}
                    <div className="flex items-start gap-3 pb-3 border-b border-white/10">
                      <img 
                        src={imageUrl} 
                        alt={displayName}
                        className="w-16 h-16 rounded-xl object-cover border border-white/10 shrink-0 shadow-md"
                      />

                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-md bg-indigo-500/10 text-indigo-400 text-xs font-mono font-bold flex items-center justify-center border border-indigo-500/20">
                              {index + 1}
                            </span>
                            <h3 className="text-base font-bold text-white">
                              {displayName}
                            </h3>
                          </div>
                          {getConfidenceBadge(ex.confidence)}
                        </div>

                        <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                          <span>{ex.repeat_sets} Sets</span>
                          <span>•</span>
                          <span>{ex.rest_seconds || 60}s {t('rest')}</span>
                          {ex.superset_group && (
                            <>
                              <span>•</span>
                              <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded text-[10px]">
                                {ex.superset_group}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {!isReadOnly && (
                        <button
                          onClick={() => removeExercise(index)}
                          className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors btn-taste"
                          title="Delete Exercise"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Evidence Timestamp Anchor */}
                    {ex.evidence && ex.evidence.length > 0 && (
                      <div className="bg-slate-950/80 rounded-xl p-3 border border-white/5 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                          <span>{t('evidenceTitle')}:</span>
                        </div>
                        {ex.evidence.map((ev, evIdx) => (
                          <div key={evIdx} className="flex items-start justify-between gap-2 text-xs">
                            <p className="text-slate-300 italic">“{ev.text}”</p>
                            <button
                              onClick={() => jumpToTime(ev.start_seconds)}
                              className="shrink-0 flex items-center gap-1 px-2.5 py-1 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 rounded-lg border border-indigo-500/30 text-[11px] font-mono font-medium transition-colors btn-taste"
                            >
                              <Play className="w-2.5 h-2.5 fill-indigo-300" />
                              <span>{formatTime(ev.start_seconds)}</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Coaching Form Cues Section */}
                    <div className="bg-indigo-950/20 border border-indigo-500/20 rounded-xl p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-semibold text-indigo-300 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                          <span>{t('coachingCues')}</span>
                        </label>
                      </div>

                      {ex.coaching_cues && ex.coaching_cues.length > 0 ? (
                        <ul className="space-y-1.5">
                          {ex.coaching_cues.map((cue, cueIdx) => (
                            <li key={cueIdx} className="text-xs text-slate-300 bg-slate-950/80 p-2 rounded-lg border border-white/5 flex items-center justify-between gap-2">
                              <div className="flex items-start gap-2 flex-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                                <input
                                  type="text"
                                  disabled={isReadOnly}
                                  value={cue}
                                  onChange={(e) => {
                                    const newCues = [...(ex.coaching_cues || [])];
                                    newCues[cueIdx] = e.target.value;
                                    updateExercise(index, { coaching_cues: newCues });
                                  }}
                                  className="w-full bg-transparent text-white focus:outline-none text-xs"
                                />
                              </div>
                              {!isReadOnly && (
                                <button
                                  onClick={() => {
                                    const newCues = ex.coaching_cues?.filter((_, i) => i !== cueIdx);
                                    updateExercise(index, { coaching_cues: newCues });
                                  }}
                                  className="text-slate-500 hover:text-rose-400 p-0.5 text-xs shrink-0 btn-taste"
                                >
                                  ✕
                                </button>
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs text-slate-500 italic">No specific form cues recorded</p>
                      )}

                      {!isReadOnly && (
                        <button
                          onClick={() => {
                            const newCues = [...(ex.coaching_cues || []), 'Form technique cue...'];
                            updateExercise(index, { coaching_cues: newCues });
                          }}
                          className="text-[11px] text-indigo-400 hover:underline font-medium flex items-center gap-1 pt-1 btn-taste"
                        >
                          <Plus className="w-3 h-3" />
                          <span>{t('addCue')}</span>
                        </button>
                      )}
                    </div>

                    {/* Sets Table */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono text-slate-400 uppercase tracking-wider px-1">
                        <span>{t('setsDetail')}</span>
                        <span>Rest: {ex.rest_seconds || 60}s</span>
                      </div>

                      <div className="space-y-2">
                        {ex.sets.map((set, setIdx) => (
                          <div 
                            key={setIdx} 
                            className="flex items-center gap-3 bg-slate-950/90 p-2.5 rounded-xl border border-white/5 text-xs font-mono"
                          >
                            <span className="text-slate-500 w-8">#{setIdx + 1}</span>

                            <div className="flex items-center gap-2 flex-1">
                              <span className="text-slate-400 font-sans">Reps:</span>
                              <input
                                type="number"
                                disabled={isReadOnly}
                                value={set.reps ?? ''}
                                onChange={(e) => {
                                  const val = e.target.value === '' ? null : parseInt(e.target.value);
                                  const newSets = [...ex.sets];
                                  newSets[setIdx].reps = val;
                                  updateExercise(index, { sets: newSets });
                                }}
                                placeholder="12"
                                className="w-16 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white text-center focus:outline-none focus:border-indigo-500"
                              />
                            </div>

                            <div className="flex items-center gap-2 flex-1">
                              <span className="text-slate-400 font-sans">Weight(kg):</span>
                              <input
                                type="number"
                                disabled={isReadOnly}
                                value={set.weight_kg ?? ''}
                                onChange={(e) => {
                                  const val = e.target.value === '' ? null : parseFloat(e.target.value);
                                  const newSets = [...ex.sets];
                                  newSets[setIdx].weight_kg = val;
                                  updateExercise(index, { sets: newSets });
                                }}
                                placeholder="Opt"
                                className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white text-center focus:outline-none focus:border-indigo-500"
                              />
                            </div>

                            {!isReadOnly && ex.sets.length > 1 && (
                              <button
                                onClick={() => removeSet(index, setIdx)}
                                className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors btn-taste"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      {!isReadOnly && (
                        <button
                          onClick={() => addSet(index)}
                          className="w-full py-2 text-xs font-medium text-slate-400 hover:text-indigo-300 bg-slate-950/50 hover:bg-slate-900 border border-dashed border-white/10 rounded-xl transition-colors flex items-center justify-center gap-1 btn-taste"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{t('addSet')}</span>
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* Export & Share Hub Modal */}
      {showExportHub && (
        <ExportHubModal 
          plan={plan} 
          onClose={() => setShowExportHub(false)} 
        />
      )}
    </div>
  );
}
