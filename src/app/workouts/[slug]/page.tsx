import React from 'react';
import { Navbar } from '@/components/Navbar';
import { WorkoutEditor } from '@/components/WorkoutEditor';
import { ShareView } from '@/components/ShareView';
import { getWorkoutPlanBySlug } from '@/lib/storage';
import { notFound } from 'next/navigation';

export const revalidate = 0;

export default async function WorkoutDetailPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const plan = getWorkoutPlanBySlug(slug);

  if (!plan) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-minimal-canvas text-zinc-100 flex flex-col font-sans selection:bg-zinc-700 selection:text-white">
      <Navbar />
      <main className="flex-1 py-6">
        <WorkoutEditor initialPlan={plan} />
      </main>
    </div>
  );
}
