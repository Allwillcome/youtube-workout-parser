import { WorkoutPlan, UnresolvedItem } from '@/types/workout';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  unresolved: UnresolvedItem[];
}

export function validateWorkoutPlan(plan: WorkoutPlan): ValidationResult {
  const errors: string[] = [];
  const unresolved: UnresolvedItem[] = [...(plan.unresolved || [])];

  const videoDuration = plan.source.duration_seconds || 86400; // default cap

  if (!plan.title || plan.title.trim() === '') {
    errors.push('计划标题不能为空');
  }

  if (!plan.exercises || plan.exercises.length === 0) {
    errors.push('训练计划中至少需要包含一个动作');
    return { isValid: false, errors, unresolved };
  }

  // Record superset counts
  const supersetMap = new Map<string, number>();

  plan.exercises.forEach((ex, index) => {
    const pathPrefix = `exercises[${index}]`;

    // Rule: Exercise name cannot be empty
    if (!ex.source_name || ex.source_name.trim() === '') {
      errors.push(`第 ${index + 1} 个动作的名称不能为空`);
    }

    // Rule: Repeat sets must be > 0
    if (ex.repeat_sets <= 0) {
      errors.push(`动作 "${ex.source_name || index + 1}" 的组数必须大于 0`);
    }

    // Rule: Confidence must be between 0 and 1
    if (ex.confidence < 0 || ex.confidence > 1) {
      ex.confidence = Math.max(0, Math.min(1, ex.confidence));
    }

    // Track supersets
    if (ex.superset_group) {
      const count = supersetMap.get(ex.superset_group) || 0;
      supersetMap.set(ex.superset_group, count + 1);
    }

    // Rule: Validate evidence timestamps
    if (ex.evidence) {
      ex.evidence.forEach((ev, evIdx) => {
        if (ev.start_seconds < 0 || ev.start_seconds > videoDuration) {
          errors.push(`动作 "${ex.source_name}" 的时间戳证据 (${ev.start_seconds}s) 超出视频总时长`);
        }
      });
    }

    // Rule: Validate sets
    if (!ex.sets || ex.sets.length === 0) {
      unresolved.push({
        id: `unresolved-${index}-sets`,
        path: `${pathPrefix}.sets`,
        reason: `动作 "${ex.source_name}" 缺失详细 Sets 规则数据`,
        severity: 'warning'
      });
    } else {
      ex.sets.forEach((set, setIdx) => {
        const setPath = `${pathPrefix}.sets[${setIdx}]`;

        // Cannot have negative values
        if (set.reps !== null && set.reps < 0) errors.push(`动作 "${ex.source_name}" 次数不能为负数`);
        if (set.duration_seconds !== null && set.duration_seconds < 0) errors.push(`动作 "${ex.source_name}" 时长不能为负数`);
        if (set.weight_kg !== null && set.weight_kg < 0) errors.push(`动作 "${ex.source_name}" 重量不能为负数`);

        // Rule: A set cannot simultaneously lack reps, duration, AND distance
        if (set.reps === null && set.duration_seconds === null && set.distance_meters === null) {
          unresolved.push({
            id: `unresolved-${index}-${setIdx}-incomplete`,
            path: setPath,
            reason: `动作 "${ex.source_name}" 第 ${setIdx + 1} 组未指明次数、时长或距离`,
            severity: 'info'
          });
        }
      });
    }

    // Flag missing weights if weight is not specified
    const hasAnyWeight = ex.sets?.some(s => s.weight_kg !== null);
    if (!hasAnyWeight) {
      const alreadyHasInfo = unresolved.some(u => u.path === `${pathPrefix}.weight_kg`);
      if (!alreadyHasInfo) {
        unresolved.push({
          id: `unresolved-${index}-weight`,
          path: `${pathPrefix}.weight_kg`,
          reason: `视频中未明确说明动作 "${ex.source_name}" 的推荐重量`,
          severity: 'info'
        });
      }
    }
  });

  // Rule: Supersets must contain at least 2 exercises
  supersetMap.forEach((count, groupName) => {
    if (count < 2) {
      errors.push(`超级组 "${groupName}" 至少需要包含 2 个动作`);
    }
  });

  // Remove duplicate unresolved entries
  const uniqueUnresolved = Array.from(
    new Map(unresolved.map(item => [item.path + item.reason, item])).values()
  );

  return {
    isValid: errors.length === 0,
    errors,
    unresolved: uniqueUnresolved
  };
}
