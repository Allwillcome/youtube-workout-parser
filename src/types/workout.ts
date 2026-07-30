export type SetType = 'normal' | 'warmup' | 'drop' | 'failure';

export interface WorkoutSet {
  set_type: SetType;
  reps: number | null;
  duration_seconds: number | null;
  weight_kg: number | null;
  distance_meters: number | null;
  rpe: number | null;
}

export interface EvidenceSegment {
  start_seconds: number;
  end_seconds: number;
  text: string;
}

export interface ExerciseItem {
  id: string;
  order: number;
  source_name: string;
  name_en: string;
  name_zh: string;
  canonical_name: string | null;
  image_url?: string;
  sets: WorkoutSet[];
  repeat_sets: number;
  rest_seconds: number | null;
  superset_group: string | null;
  notes: string;
  coaching_cues?: string[];
  coaching_cues_zh?: string[];
  confidence: number;
  evidence: EvidenceSegment[];
}

export interface UnresolvedItem {
  id: string;
  path: string;
  reason: string;
  reason_zh?: string;
  severity: 'info' | 'warning' | 'error';
}

export interface VideoMetadata {
  platform: 'youtube';
  url: string;
  video_id: string;
  title: string;
  channel_name: string;
  channel_url: string;
  thumbnail_url: string;
  duration_seconds: number;
  published_at?: string;
}

export type ContentType = 
  | 'complete_workout'
  | 'exercise_tutorial'
  | 'workout_explanation'
  | 'program_overview'
  | 'follow_along_workout'
  | 'fitness_discussion'
  | 'not_workout_related';

export interface Stage1Classification {
  content_type: ContentType;
  is_actionable: boolean;
  confidence: number;
  reasons: string[];
  reasons_zh?: string[];
  summary_en?: string;
  summary_zh?: string;
}

export interface WorkoutStructure {
  type: 'straight_sets' | 'circuit' | 'emom' | 'amrap' | 'superset';
  rounds: number | null;
}

export interface WorkoutPlan {
  id: string;
  schema_version: '1.0';
  title: string;
  title_zh?: string;
  description: string;
  description_zh?: string;
  source: VideoMetadata;
  structure: WorkoutStructure;
  classification?: Stage1Classification;
  exercises: ExerciseItem[];
  unresolved: UnresolvedItem[];
  status: 'draft' | 'verified';
  visibility: 'private' | 'unlisted' | 'public';
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface WorkoutPlanVersion {
  id: string;
  workout_plan_id: string;
  version: number;
  workout_json: WorkoutPlan;
  change_source: 'llm_extraction' | 'user_edit';
  created_at: string;
}

export interface TranscriptSegment {
  start_seconds: number;
  end_seconds: number;
  text: string;
}

export interface TranscriptResult {
  source_type: 'caption' | 'whisper' | 'manual';
  language: string;
  segments: TranscriptSegment[];
}
