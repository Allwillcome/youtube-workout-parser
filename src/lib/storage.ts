import { WorkoutPlan } from '@/types/workout';
import fs from 'fs';
import path from 'path';
import { RECOMMENDED_COURSES } from './presetData';
import { stage2ExtractWorkout } from './parser';

// File-based persistence path
const DATA_DIR = path.join(process.cwd(), '.data');
const FILE_PATH = path.join(DATA_DIR, 'workouts.json');

function ensureDataFile() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(FILE_PATH)) {
      fs.writeFileSync(FILE_PATH, JSON.stringify({}), 'utf-8');
    }
  } catch (err) {
    console.warn('Failed to initialize data file:', err);
  }
}

const memoryStore = new Map<string, WorkoutPlan>();

function readAllPlansFromFile(): Record<string, WorkoutPlan> {
  ensureDataFile();
  try {
    if (fs.existsSync(FILE_PATH)) {
      const raw = fs.readFileSync(FILE_PATH, 'utf-8');
      return JSON.parse(raw || '{}');
    }
  } catch (err) {
    console.warn('Failed to read workouts.json file:', err);
  }
  return {};
}

function writeAllPlansToFile(map: Record<string, WorkoutPlan>) {
  ensureDataFile();
  try {
    fs.writeFileSync(FILE_PATH, JSON.stringify(map, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Failed to write workouts.json file:', err);
  }
}

export function saveWorkoutPlan(plan: WorkoutPlan): WorkoutPlan {
  plan.updated_at = new Date().toISOString();
  
  memoryStore.set(plan.slug, plan);
  memoryStore.set(plan.id, plan);

  const fileData = readAllPlansFromFile();
  fileData[plan.slug] = plan;
  fileData[plan.id] = plan;
  writeAllPlansToFile(fileData);

  return plan;
}

export function getWorkoutPlanBySlug(slug: string): WorkoutPlan | null {
  if (memoryStore.has(slug)) {
    return memoryStore.get(slug)!;
  }

  const fileData = readAllPlansFromFile();
  if (fileData[slug]) {
    memoryStore.set(slug, fileData[slug]);
    return fileData[slug];
  }

  // Matching preset recommended courses dynamically
  const matchCourse = RECOMMENDED_COURSES.find(c => c.id === slug || c.video_id === slug || slug.includes(c.video_id));
  if (matchCourse) {
    // Generate full real extracted plan dynamically
    const mockMetadata = {
      platform: 'youtube' as const,
      url: matchCourse.url,
      video_id: matchCourse.video_id,
      title: matchCourse.title_en,
      channel_name: matchCourse.creator,
      channel_url: '',
      thumbnail_url: `https://img.youtube.com/vi/${matchCourse.video_id}/hqdefault.jpg`,
      duration_seconds: 900
    };
    
    // Create base full plan
    const fallbackPlan: WorkoutPlan = {
      id: `plan_preset_${matchCourse.id}`,
      schema_version: '1.0',
      title: matchCourse.title_en,
      description: matchCourse.topic_en,
      source: mockMetadata,
      structure: { type: 'straight_sets', rounds: null },
      exercises: [],
      unresolved: [],
      status: 'draft',
      visibility: 'unlisted',
      slug: slug,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return fallbackPlan;
  }

  return null;
}
