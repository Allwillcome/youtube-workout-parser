import { WorkoutPlan } from '@/types/workout';

// In-memory global cache for server-side persistence in single instance
const globalPlanStore = new Map<string, WorkoutPlan>();

export function saveWorkoutPlan(plan: WorkoutPlan): WorkoutPlan {
  plan.updated_at = new Date().toISOString();
  globalPlanStore.set(plan.slug, plan);
  globalPlanStore.set(plan.id, plan);

  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('yt_workout_plans') || '{}';
      const map = JSON.parse(stored);
      map[plan.slug] = plan;
      map[plan.id] = plan;
      localStorage.setItem('yt_workout_plans', JSON.stringify(map));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  }

  return plan;
}

export function getWorkoutPlanBySlug(slug: string): WorkoutPlan | null {
  if (globalPlanStore.has(slug)) {
    return globalPlanStore.get(slug)!;
  }

  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('yt_workout_plans');
      if (stored) {
        const map = JSON.parse(stored);
        if (map[slug]) return map[slug];
      }
    } catch (e) {
      console.warn('Failed to read from localStorage:', e);
    }
  }

  return null;
}
