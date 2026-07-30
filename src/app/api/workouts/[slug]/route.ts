import { NextRequest, NextResponse } from 'next/server';
import { getWorkoutPlanBySlug } from '@/lib/storage';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const plan = getWorkoutPlanBySlug(slug);

  if (!plan) {
    return NextResponse.json({ error: '未找到对应的训练计划' }, { status: 404 });
  }

  return NextResponse.json({ success: true, plan });
}
