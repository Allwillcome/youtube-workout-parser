'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  Image as ImageIcon,
  Target,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
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

  useEffect(() => {
    // Automatically reset scroll position to top when entering drill-down page
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

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
      target_muscle: 'Biceps',
      target_muscle_zh: '肱二头肌',
      image_url: getExerciseImageUrl('Dumbbell Curl'),
      repeat_sets: 3,
      sets: [
        { set_type: 'normal', reps: 10, duration_seconds: null, weight_kg: null, distance_meters: null, rpe: 8 },
        { set_type: 'normal', reps: 10, duration_seconds: null, weight_kg: null, distance_meters: null, rpe: 8 },
        { set_type: 'normal', reps: 10, duration_seconds: null, weight_kg: null, distance_meters: null, rpe: 8 }
      ],
      rest_seconds: 60,
      superset_group: null,
      notes: '',
      coaching_cues: ['Keep elbows pinned to sides'],
      confidence: 1.0,
      evidence: [{ start_seconds: 60, end_seconds: 90, text: 'Demonstrated in video segment' }]
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
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono tracking-wider uppercase font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700">
          <CheckCircle2 className="w-3 h-3 text-zinc-400" />
          {lang === 'zh' ? `高置信度 (${(confidence * 100).toFixed(0)}%)` : `High (${(confidence * 100).toFixed(0)}%)`}
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono tracking-wider uppercase font-semibold bg-zinc-800 text-zinc-400 border border-zinc-700">
          <AlertTriangle className="w-3 h-3 text-zinc-500" />
          {lang === 'zh' ? `需确认 (${(confidence * 100).toFixed(0)}%)` : `Review (${(confidence * 100).toFixed(0)}%)`}
        </span>
      );
    }
  };

  const videoEmbedUrl = `https://www.youtube.com/embed/${plan.source.video_id}?enablejsapi=1&autoplay=0`;

  return (
    <div className="w-full max-w-[1500px] mx-auto px-4 py-2 space-y-3 animate-minimal-fade">
      {/* Top Compact Bar: Immediate access to Home & Export */}
      <div className="minimal-card p-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Link 
            href="/"
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 rounded text-xs text-zinc-400 hover:text-white transition-colors shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{lang === 'zh' ? '首页' : 'Home'}</span>
          </Link>

          <input
            type="text"
            disabled={isReadOnly}
            value={plan.title}
            onChange={(e) => setPlan({ ...plan, title: e.target.value })}
            className="flex-1 text-sm font-bold bg-transparent border-b border-transparent hover:border-zinc-700 focus:border-zinc-500 focus:outline-none text-zinc-100 transition-colors py-0.5 truncate"
            placeholder="Enter Workout Plan Title..."
          />
        </div>

        {!isReadOnly && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowExportHub(true)}
              className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-medium rounded-md btn-minimal-secondary flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{t('shareLink')}</span>
            </button>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-1.5 btn-minimal text-xs font-semibold flex items-center justify-center gap-1.5 disabled:opacity-50 shadow-sm"
            >
              {isSaving ? (
                <>
                  <div className="w-3 h-3 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
                  <span>{t('saving')}</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>{t('verifySave')}</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {saveError && (
        <div className="p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-zinc-400 shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      {/* Main Grid: Zero-scrolling Needed Above-the-Fold Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* LEFT COLUMN: Ultra Compact Player */}
        <div className="lg:col-span-5 space-y-3 lg:sticky lg:top-16">
          <div className="minimal-card overflow-hidden">
            <div className="relative aspect-video bg-zinc-950">
              <iframe
                ref={iframeRef}
                src={videoEmbedUrl}
                title={plan.source.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="p-2.5 space-y-1 bg-zinc-950">
              <div className="flex items-center justify-between text-[11px]">
                <a
                  href={plan.source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-zinc-300 hover:text-white flex items-center gap-1 transition-colors truncate max-w-[200px]"
                >
                  <span>{plan.source.channel_name}</span>
                  <ExternalLink className="w-3 h-3 text-zinc-500 shrink-0" />
                </a>
                <span className="text-zinc-500 font-mono text-[10px]">{t('viewOriginal')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Immediate Actionable Workout Exercises */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between pb-1.5 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-mono uppercase tracking-wider font-bold text-zinc-200">{t('exercisesHeader')}</h2>
              <span className="text-[11px] font-mono text-zinc-500">({plan.exercises.length} Exercises Extracted)</span>
            </div>
            {!isReadOnly && (
              <button
                onClick={addExercise}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800 rounded btn-minimal-secondary"
              >
                <Plus className="w-3 h-3" />
                <span>{t('addExercise')}</span>
              </button>
            )}
          </div>

          {/* Exercises List - Instant First View */}
          <div className="space-y-3">
            {plan.exercises.map((ex, index) => {
              const displayName = formatExerciseName(ex.name_en || ex.source_name, ex.name_zh || '', lang);
              const imageUrl = ex.image_url || getExerciseImageUrl(ex.name_en || ex.source_name);
              const targetMuscle = lang === 'zh' ? (ex.target_muscle_zh || ex.target_muscle) : (ex.target_muscle || 'Main Muscle');

              return (
                <div 
                  key={ex.id || index}
                  className="minimal-card p-3 space-y-3"
                >
                  {/* Exercise Header */}
                  <div className="flex items-start gap-3 pb-2 border-b border-zinc-800/80">
                    <img 
                      src={imageUrl} 
                      alt={displayName}
                      className="w-12 h-12 rounded object-cover border border-zinc-800 shrink-0"
                    />

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded bg-zinc-800 text-zinc-300 text-[10px] font-mono font-bold flex items-center justify-center border border-zinc-700">
                            {index + 1}
                          </span>
                          <h3 className="text-xs font-bold text-zinc-100">
                            {displayName}
                          </h3>
                        </div>
                        {getConfidenceBadge(ex.confidence)}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-zinc-400">
                        {targetMuscle && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-zinc-950 text-zinc-300 border border-zinc-800 rounded text-[10px]">
                            <Target className="w-2.5 h-2.5 text-zinc-500" />
                            <span>{targetMuscle}</span>
                          </span>
                        )}
                        <span>•</span>
                        <span>{ex.repeat_sets} Sets</span>
                        <span>•</span>
                        <span>Rest {ex.rest_seconds || 60}s</span>
                      </div>
                    </div>

                    {!isReadOnly && (
                      <button
                        onClick={() => removeExercise(index)}
                        className="text-zinc-500 hover:text-zinc-200 p-1 rounded hover:bg-zinc-800 transition-colors btn-minimal-secondary"
                        title="Delete Exercise"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Evidence Timestamp Anchor */}
                  {ex.evidence && ex.evidence.length > 0 && (
                    <div className="bg-zinc-950 rounded p-2 border border-zinc-800 space-y-1.5">
                      {ex.evidence.map((ev, evIdx) => (
                        <div key={evIdx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-zinc-900/60 p-1.5 rounded border border-zinc-800 text-xs">
                          <input
                            type="text"
                            disabled={isReadOnly}
                            value={ev.text}
                            onChange={(e) => {
                              const newEvidence = [...ex.evidence];
                              newEvidence[evIdx].text = e.target.value;
                              updateExercise(index, { evidence: newEvidence });
                            }}
                            className="flex-1 bg-transparent text-zinc-200 font-mono text-[11px] focus:outline-none"
                          />

                          <div className="flex items-center gap-2 shrink-0">
                            <input
                              type="number"
                              disabled={isReadOnly}
                              value={ev.start_seconds}
                              onChange={(e) => {
                                const sec = parseInt(e.target.value) || 0;
                                const newEvidence = [...ex.evidence];
                                newEvidence[evIdx].start_seconds = sec;
                                updateExercise(index, { evidence: newEvidence });
                              }}
                              className="w-12 bg-zinc-950 border border-zinc-800 rounded px-1 py-0.5 text-zinc-300 text-center font-mono text-[10px] focus:outline-none"
                            />
                            <button
                              onClick={() => jumpToTime(ev.start_seconds)}
                              className="flex items-center gap-1 px-2 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded border border-zinc-700 text-[10px] font-mono transition-colors"
                            >
                              <Play className="w-2.5 h-2.5 text-zinc-300 fill-zinc-300" />
                              <span>{formatTime(ev.start_seconds)}</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Coaching Form Cues Section */}
                  <div className="bg-zinc-950 border border-zinc-800/80 rounded p-2.5 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-semibold text-zinc-400 flex items-center gap-1 font-mono uppercase">
                        <Sparkles className="w-3 h-3 text-zinc-500" />
                        <span>{t('coachingCues')} ({ex.coaching_cues?.length || 0})</span>
                      </label>
                    </div>

                    {ex.coaching_cues && ex.coaching_cues.length > 0 ? (
                      <ul className="space-y-1">
                        {ex.coaching_cues.map((cue, cueIdx) => (
                          <li key={cueIdx} className="text-xs text-zinc-300 bg-zinc-900/90 p-1.5 rounded border border-zinc-800 flex items-center justify-between gap-2">
                            <div className="flex items-start gap-2 flex-1">
                              <span className="w-1 h-1 rounded-full bg-zinc-400 mt-1.5 shrink-0" />
                              <input
                                type="text"
                                disabled={isReadOnly}
                                value={cue}
                                onChange={(e) => {
                                  const newCues = [...(ex.coaching_cues || [])];
                                  newCues[cueIdx] = e.target.value;
                                  updateExercise(index, { coaching_cues: newCues });
                                }}
                                className="w-full bg-transparent text-zinc-200 focus:outline-none text-[11px]"
                              />
                            </div>
                            {!isReadOnly && (
                              <button
                                onClick={() => {
                                  const newCues = ex.coaching_cues?.filter((_, i) => i !== cueIdx);
                                  updateExercise(index, { coaching_cues: newCues });
                                }}
                                className="text-zinc-500 hover:text-zinc-300 p-0.5 text-[11px] shrink-0"
                              >
                                ✕
                              </button>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-[11px] text-zinc-500 italic">No form cues recorded</p>
                    )}

                    {!isReadOnly && (
                      <button
                        onClick={() => {
                          const newCues = [...(ex.coaching_cues || []), 'Form technique cue...'];
                          updateExercise(index, { coaching_cues: newCues });
                        }}
                        className="text-[10px] text-zinc-400 hover:text-white font-medium flex items-center gap-1 pt-0.5"
                      >
                        <Plus className="w-2.5 h-2.5" />
                        <span>{t('addCue')}</span>
                      </button>
                    )}
                  </div>

                  {/* Sets Table */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 uppercase tracking-wider px-1">
                      <span>{t('setsDetail')}</span>
                      <span>Rest: {ex.rest_seconds || 60}s</span>
                    </div>

                    <div className="space-y-1">
                      {ex.sets.map((set, setIdx) => (
                        <div 
                          key={setIdx} 
                          className="flex items-center gap-2 bg-zinc-950 p-1.5 rounded border border-zinc-800 text-[11px] font-mono"
                        >
                          <span className="text-zinc-500 w-6">#{setIdx + 1}</span>

                          <div className="flex items-center gap-1 flex-1">
                            <span className="text-zinc-500 font-sans text-[10px]">Type:</span>
                            <span className="px-1 py-0.5 bg-zinc-900 text-zinc-300 border border-zinc-800 rounded text-[9px] uppercase">
                              {set.set_type}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 flex-1">
                            <span className="text-zinc-500 font-sans text-[10px]">Reps:</span>
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
                              className="w-12 bg-zinc-900 border border-zinc-800 rounded px-1 py-0.5 text-zinc-100 text-center focus:outline-none focus:border-zinc-600 text-[11px]"
                            />
                          </div>

                          <div className="flex items-center gap-1 flex-1">
                            <span className="text-zinc-500 font-sans text-[10px]">Kg:</span>
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
                              className="w-14 bg-zinc-900 border border-zinc-800 rounded px-1 py-0.5 text-zinc-100 text-center focus:outline-none focus:border-zinc-600 text-[11px]"
                            />
                          </div>

                          {!isReadOnly && ex.sets.length > 1 && (
                            <button
                              onClick={() => removeSet(index, setIdx)}
                              className="text-zinc-500 hover:text-zinc-300 p-0.5 transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ))}
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
