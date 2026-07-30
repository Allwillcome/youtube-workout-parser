'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { WorkoutPlan } from '@/types/workout';
import { 
  Share2, 
  Copy, 
  Check, 
  Printer, 
  Download, 
  Layers, 
  ExternalLink,
  Sparkles,
  FileText,
  X,
  Link as LinkIcon
} from 'lucide-react';
import { useI18n, formatExerciseName } from '@/lib/i18n';

interface ExportHubModalProps {
  plan: WorkoutPlan;
  onClose: () => void;
}

export function ExportHubModal({ plan, onClose }: ExportHubModalProps) {
  const { lang, t } = useI18n();
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Prevent background scrolling when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/workouts/${plan.slug}` : `/workouts/${plan.slug}`;

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const copyFormattedText = () => {
    const textLines = [
      `🏋️‍♂️ ${plan.title}`,
      `Source: ${plan.source.title} (${plan.source.channel_name})`,
      `Link: ${plan.source.url}`,
      ``,
      `--- EXERCISE ROUTINE ---`
    ];

    plan.exercises.forEach((ex, idx) => {
      const name = formatExerciseName(ex.name_en || ex.source_name, ex.name_zh || '', 'zh');
      textLines.push(`${idx + 1}. ${name}`);
      textLines.push(`   • Sets/Reps: ${ex.repeat_sets} Sets × ${ex.sets[0]?.reps || 10} Reps (Rest ${ex.rest_seconds || 60}s)`);
      if (ex.coaching_cues && ex.coaching_cues.length > 0) {
        textLines.push(`   • Coaching Cues: ${ex.coaching_cues.join('; ')}`);
      }
      textLines.push(``);
    });

    navigator.clipboard.writeText(textLines.join('\n'));
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const copyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(plan, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[99999] bg-zinc-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      {/* Background Backdrop Click to Close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Container: Always Centered in Active Viewport */}
      <div className="minimal-card p-5 sm:p-6 max-w-lg w-full space-y-4 animate-minimal-fade relative z-10 my-auto border border-zinc-800 shadow-2xl bg-zinc-900">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-200 p-1.5 rounded hover:bg-zinc-800 transition-colors btn-minimal-secondary"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase bg-zinc-800 text-zinc-300 border border-zinc-700">
            <Sparkles className="w-3 h-3 text-zinc-400" />
            <span>{lang === 'zh' ? '计划已保存校验' : 'Workout Plan Verified'}</span>
          </div>
          
          <h2 className="text-base font-mono uppercase tracking-wider font-bold text-zinc-100">
            {lang === 'zh' ? '计划导出与分享中心' : 'Export & Share Hub'}
          </h2>
        </div>

        {/* Share Link Preview Box */}
        <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-md space-y-1.5">
          <label className="text-[10px] font-mono text-zinc-400 uppercase font-semibold flex items-center gap-1.5">
            <LinkIcon className="w-3 h-3 text-zinc-500" />
            <span>{lang === 'zh' ? '专属分享 URL' : 'Shareable Plan Link'}</span>
          </label>

          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1 text-xs text-zinc-300 font-mono focus:outline-none select-all"
            />
            <button
              onClick={copyLink}
              className="px-3.5 py-1 btn-minimal text-xs shrink-0 flex items-center gap-1.5"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? (lang === 'zh' ? '已复制' : 'Copied!') : (lang === 'zh' ? '复制链接' : 'Copy Link')}</span>
            </button>
          </div>
        </div>

        {/* Export Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          
          {/* Action 1: Printable Gym Sheet */}
          <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-md space-y-2 flex flex-col justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1">
                <Printer className="w-3.5 h-3.5 text-zinc-400" />
                <span className="text-xs font-bold text-zinc-200">{lang === 'zh' ? '打印刷卡卡片' : 'Print Log Sheet'}</span>
              </div>
              <p className="text-[10px] text-zinc-500">
                {lang === 'zh' ? '带复选框的打卡片' : 'Printable sheet'}
              </p>
            </div>

            <button
              onClick={handlePrint}
              className="w-full py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-[11px] font-medium rounded btn-minimal-secondary flex items-center justify-center gap-1"
            >
              <Printer className="w-3 h-3" />
              <span>{lang === 'zh' ? '打印卡片' : 'Print'}</span>
            </button>
          </div>

          {/* Action 2: Copy Text */}
          <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-md space-y-2 flex flex-col justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-zinc-400" />
                <span className="text-xs font-bold text-zinc-200">{lang === 'zh' ? '复制文本' : 'Copy Text'}</span>
              </div>
              <p className="text-[10px] text-zinc-500">
                {lang === 'zh' ? '排版纯文本备忘' : 'Plain text'}
              </p>
            </div>

            <button
              onClick={copyFormattedText}
              className="w-full py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-[11px] font-medium rounded btn-minimal-secondary flex items-center justify-center gap-1"
            >
              {copiedText ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              <span>{copiedText ? (lang === 'zh' ? '已复制' : 'Copied!') : (lang === 'zh' ? '复制文本' : 'Copy Text')}</span>
            </button>
          </div>

          {/* Action 3: Export Raw JSON */}
          <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-md space-y-2 flex flex-col justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1">
                <Download className="w-3.5 h-3.5 text-zinc-400" />
                <span className="text-xs font-bold text-zinc-200">{lang === 'zh' ? '导出 JSON' : 'Export JSON'}</span>
              </div>
              <p className="text-[10px] text-zinc-500">
                {lang === 'zh' ? 'Workout Schema' : 'JSON data'}
              </p>
            </div>

            <button
              onClick={copyJson}
              className="w-full py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-[11px] font-medium rounded btn-minimal-secondary flex items-center justify-center gap-1"
            >
              {copiedJson ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              <span>{copiedJson ? (lang === 'zh' ? '已复制' : 'Copied!') : (lang === 'zh' ? '复制 JSON' : 'Copy JSON')}</span>
            </button>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="flex justify-end pt-1 border-t border-zinc-800/80">
          <button
            onClick={onClose}
            className="px-3.5 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-medium rounded btn-minimal-secondary"
          >
            {lang === 'zh' ? '关闭' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
