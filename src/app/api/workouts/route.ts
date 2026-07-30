import { NextRequest, NextResponse } from 'next/server';
import { saveWorkoutPlan } from '@/lib/storage';
import { validateWorkoutPlan } from '@/lib/validation';
import { WorkoutPlan } from '@/types/workout';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const plan: WorkoutPlan = body.plan;

    if (!plan || !plan.id) {
      return NextResponse.json({ error: '无效的 Workout Plan 数据' }, { status: 400 });
    }

    // Run deterministic validation
    const validation = validateWorkoutPlan(plan);
    if (!validation.isValid) {
      return NextResponse.json({
        error: '训练计划校验未通过',
        details: validation.errors
      }, { status: 422 });
    }

    plan.unresolved = validation.unresolved;
    plan.status = 'verified';
    plan.updated_at = new Date().toISOString();

    const saved = saveWorkoutPlan(plan);

    return NextResponse.json({
      success: true,
      slug: saved.slug,
      plan: saved
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || '保存训练计划失败' }, { status: 500 });
  }
}
