import React from 'react';
import { Navbar } from '@/components/Navbar';
import { WorkoutEditor } from '@/components/WorkoutEditor';
import { ClientHydrationView } from '@/components/ClientHydrationView';
import { getWorkoutPlanBySlug } from '@/lib/storage';

export const revalidate = 0;

export default async function WorkoutDetailPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const plan = getWorkoutPlanBySlug(slug);

  return (
    <div className="min-h-screen bg-minimal-canvas text-zinc-100 flex flex-col font-sans selection:bg-zinc-700 selection:text-white">
      <Navbar />
      <main className="flex-1 py-4">
        {plan ? (
          <WorkoutEditor initialPlan={plan} />
        ) : (
          <ClientHydrationView slug={slug} />
        )}
      </main>
    </div>
  );
}
