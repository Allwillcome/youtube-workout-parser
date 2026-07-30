import React from 'react';
import { Navbar } from '@/components/Navbar';
import { ShareView } from '@/components/ShareView';
import { getWorkoutPlanBySlug } from '@/lib/storage';
import { notFound } from 'next/navigation';

export const revalidate = 0;

export default async function WorkoutSharePage({
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 py-8">
        <ShareView plan={plan} />
      </main>
    </div>
  );
}
