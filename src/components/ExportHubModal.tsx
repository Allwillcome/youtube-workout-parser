'use client';

import React, { useState } from 'react';
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
  X
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

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/workouts/${plan.slug}` : `/workouts/${plan.slug}`;

  // Copy share URL
  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Copy Markdown / Notion formatted text
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

  // Copy raw JSON
  const copyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(plan, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  // Trigger browser print for gym workout log card
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 max-w-2xl w-full space-y-6 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'zh' ? '训练计划已校对并生效！' : 'Workout Plan Verified & Ready!'}</span>
          </div>
          <h2 className="text-2xl font-black text-white">
            {lang === 'zh' ? '计划导出与分享中心' : 'Export & Share Hub'}
          </h2>
          <p className="text-xs text-slate-400">
            {lang === 'zh' ? '您可以复制专属分享链接、生成刷卡记组卡、导出到 Notion/备忘录或下载 JSON 数据。' : 'Copy unique share links, generate printable gym check-in sheets, or export to Notion/Hevy.'}
          </p>
        </div>

        {/* Main Export Grid (4 High-Value Real Actions) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Action 1: Share Link */}
          <div className="bg-slate-950/80 border border-slate-800 hover:border-indigo-500/50 p-4 rounded-2xl space-y-3 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                  <Share2 className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-white">{lang === 'zh' ? '专属公开/Unlisted 链接' : 'Unique Share URL'}</span>
              </div>
            </div>
            <p className="text-xs text-slate-400">
              {lang === 'zh' ? '带有完整视频跳播锚点与结构化表单的精美页面。' : 'Includes timestamp video jumps & clean workout cards.'}
            </p>
            <button
              onClick={copyLink}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
            >
              {copiedLink ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
              <span>{copiedLink ? (lang === 'zh' ? '已复制分享链接' : 'Link Copied!') : (lang === 'zh' ? '复制分享链接' : 'Copy Share Link')}</span>
            </button>
          </div>

          {/* Action 2: Printable Gym Check-in Sheet */}
          <div className="bg-slate-950/80 border border-slate-800 hover:border-purple-500/50 p-4 rounded-2xl space-y-3 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center font-bold text-xs">
                  <Printer className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-white">{lang === 'zh' ? '健身房刷卡记组卡' : 'Gym Workout Log Sheet'}</span>
              </div>
            </div>
            <p className="text-xs text-slate-400">
              {lang === 'zh' ? '生成带打勾方框 [ ] 的纯净表格，供健身房打印使用。' : 'Printable PDF/Paper sheet with checkable set boxes.'}
            </p>
            <button
              onClick={handlePrint}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20"
            >
              <Printer className="w-4 h-4" />
              <span>{lang === 'zh' ? '打印/导出刷卡卡片' : 'Print Gym Log Sheet'}</span>
            </button>
          </div>

          {/* Action 3: Copy Text for Notion / Notes */}
          <div className="bg-slate-950/80 border border-slate-800 hover:border-emerald-500/50 p-4 rounded-2xl space-y-3 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-white">{lang === 'zh' ? '复制到 Notion / 备忘录' : 'Copy for Notion / Notes'}</span>
              </div>
            </div>
            <p className="text-xs text-slate-400">
              {lang === 'zh' ? '生成包含双语动作名与要点的排版纯文本。' : 'Formatted plain text with exercise cues for personal notes.'}
            </p>
            <button
              onClick={copyFormattedText}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {copiedText ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedText ? (lang === 'zh' ? '已复制文本' : 'Text Copied!') : (lang === 'zh' ? '复制排版文本' : 'Copy Text')}</span>
            </button>
          </div>

          {/* Action 4: Download JSON */}
          <div className="bg-slate-950/80 border border-slate-800 hover:border-amber-500/50 p-4 rounded-2xl space-y-3 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-600/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                  <Download className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-white">{lang === 'zh' ? '导出原始 Workout JSON' : 'Export Raw JSON'}</span>
              </div>
            </div>
            <p className="text-xs text-slate-400">
              {lang === 'zh' ? '标准 JSON Schema，包含动作、时间戳与解析不确定项。' : 'Standard Workout JSON Schema with timestamps.'}
            </p>
            <button
              onClick={copyJson}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {copiedJson ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedJson ? (lang === 'zh' ? '已复制 JSON' : 'JSON Copied!') : (lang === 'zh' ? '复制 JSON' : 'Copy JSON')}</span>
            </button>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors"
          >
            {lang === 'zh' ? '关闭' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
}
