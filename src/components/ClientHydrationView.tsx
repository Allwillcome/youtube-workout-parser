'use client';

import React, { useEffect, useState } from 'react';
import { WorkoutPlan } from '@/types/workout';
import { WorkoutEditor } from '@/components/WorkoutEditor';
import { Dumbbell, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';

interface ClientHydrationViewProps {
  slug: string;
}

export function ClientHydrationView({ slug }: ClientHydrationViewProps) {
  const { lang } = useI18n();
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // Read from local browser storage
      const stored = localStorage.getItem('yt_workout_plans');
      if (stored) {
        const map = JSON.parse(stored);
        if (map[slug]) {
          setPlan(map[slug]);
        }
      }
    } catch (e) {
      console.warn('Failed to read plan from localStorage:', e);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 space-y-3">
        <div className="w-6 h-6 border-2 border-zinc-200 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-mono text-zinc-400">Loading plan from cache...</span>
      </div>
    );
  }

  if (plan) {
    return <WorkoutEditor initialPlan={plan} />;
  }

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4 max-w-md mx-auto animate-minimal-fade">
      <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
        <Dumbbell className="w-5 h-5 text-zinc-400" />
      </div>

      <div className="space-y-1">
        <h2 className="text-base font-bold text-zinc-100 font-mono uppercase tracking-wider">
          {lang === 'zh' ? '该计划为临时演示生成' : 'Plan Cache Expired'}
        </h2>
        <p className="text-xs text-zinc-400 leading-relaxed">
          {lang === 'zh' 
            ? '在无数据库公网环境中，旧临时计划可能会随着云端节点更新清空。您可以随时返回首页重新解析任意视频！'
            : 'In serverless environment, temporary plans clear upon edge node reset. Return home to parse any YouTube video instantly!'}
        </p>
      </div>

      <Link
        href="/"
        className="px-5 py-2.5 btn-minimal text-xs font-semibold flex items-center justify-center gap-2"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>{lang === 'zh' ? '返回首页解析新视频' : 'Back to Home'}</span>
      </Link>
    </div>
  );
}
