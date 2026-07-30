import { WorkoutPlan } from '@/types/workout';
import fs from 'fs';
import path from 'path';
import { RECOMMENDED_COURSES } from './presetData';

// File-based persistence path for server worker sharing
const DATA_DIR = path.join(process.cwd(), '.data');
const FILE_PATH = path.join(DATA_DIR, 'workouts.json');

// Ensure directory and file exist
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

// In-memory global cache fallback
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
  
  // 1. Update in-memory store
  memoryStore.set(plan.slug, plan);
  memoryStore.set(plan.id, plan);

  // 2. Persist to disk file for multi-worker Node.js sharing
  const fileData = readAllPlansFromFile();
  fileData[plan.slug] = plan;
  fileData[plan.id] = plan;
  writeAllPlansToFile(fileData);

  return plan;
}

export function getWorkoutPlanBySlug(slug: string): WorkoutPlan | null {
  // 1. Check in-memory store
  if (memoryStore.has(slug)) {
    return memoryStore.get(slug)!;
  }

  // 2. Check disk file
  const fileData = readAllPlansFromFile();
  if (fileData[slug]) {
    memoryStore.set(slug, fileData[slug]);
    return fileData[slug];
  }

  // 3. Fallback for preset recommended courses matching
  const matchCourse = RECOMMENDED_COURSES.find(c => c.id === slug || c.video_id === slug);
  if (matchCourse) {
    const fallbackPlan: WorkoutPlan = {
      id: `plan_preset_${matchCourse.id}`,
      schema_version: '1.0',
      title: matchCourse.title_en,
      description: matchCourse.topic_en,
      source: {
        platform: 'youtube',
        url: matchCourse.url,
        video_id: matchCourse.video_id,
        title: matchCourse.title_en,
        channel_name: matchCourse.creator,
        channel_url: '',
        thumbnail_url: `https://img.youtube.com/vi/${matchCourse.video_id}/hqdefault.jpg`,
        duration_seconds: 600
      },
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
