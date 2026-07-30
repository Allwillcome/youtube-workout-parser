'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'zh';

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    appName: 'FitParser',
    tagline: 'YouTube Workout Parser',
    specDoc: 'PRD Spec',
    heroBadge: 'YouTube Fitness Video → Structured Workout JSON',
    heroTitle: 'Transform Workout Videos into',
    heroTitleGradient: 'Structured Workout JSON',
    heroDesc: 'Convert any YouTube fitness video into actionable, verifiable, and exportable workout plans with timestamped evidence.',
    urlLabel: 'YouTube Video URL',
    urlPlaceholder: 'Paste YouTube URL (e.g., https://www.youtube.com/watch?v=...)',
    parseBtn: 'Parse Workout Plan',
    parsingBtn: 'AI Extracting...',
    presetTitle: 'Quick One-Click Demo Videos',
    advancedOptions: 'Advanced Options (API Key or Custom Transcript)',
    apiKeyLabel: 'OpenAI / Gemini API Key (Optional)',
    customSubLabel: 'Paste Custom Subtitles (Fallback Route C)',
    step1: 'Stage 1: Fetching YouTube metadata & captions...',
    step2: 'Stage 1: Classifying video content (is_actionable)...',
    step3: 'Stage 2: Extracting Exercises, Sets & Reps...',
    step4: 'Stage 3: Running deterministic validation...',
    verifySave: 'Verify & Generate Share Link',
    saving: 'Verifying...',
    exercisesHeader: 'Structured Exercises',
    coachingCues: 'Coaching Form Cues',
    addCue: 'Add Coaching Cue',
    addExercise: 'Add Exercise',
    addSet: 'Add Set',
    rest: 'Rest',
    setsDetail: 'Sets Detail',
    evidenceTitle: 'Video Evidence Timestamp',
    unresolvedTitle: 'Parser Warnings & Review Notes',
    saveToHevy: 'Save to Hevy',
    exportJson: 'Export JSON',
    shareLink: 'Copy Share Link',
    copiedLink: 'Link Copied!',
    copiedJson: 'JSON Copied!',
    verifiedBadge: 'Verified & Reviewed',
    viewOriginal: 'Watch Original Video on YouTube',
    langToggle: 'Language / 语言',
  },
  zh: {
    appName: 'FitParser',
    tagline: 'YouTube 健身视频解析器',
    specDoc: 'PRD 方案',
    heroBadge: 'YouTube 健身视频 → 可校对、可分享、可导出的结构化训练计划',
    heroTitle: '将健身视频秒变',
    heroTitleGradient: '结构化 Workout JSON',
    heroDesc: '输入任意 YouTube 健身视频链接。自动解析动作、组数、次数、教练级动作姿势要点 (Coaching Cues) 及证据时间戳。',
    urlLabel: 'YouTube 视频 URL 链接',
    urlPlaceholder: '粘贴 YouTube 视频 URL (例如 https://www.youtube.com/watch?v=...)',
    parseBtn: '解析训练计划',
    parsingBtn: 'AI 解析中...',
    presetTitle: '快速一键体验示例视频',
    advancedOptions: '高级选项 (使用 API Key 或 自定义字幕)',
    apiKeyLabel: 'OpenAI / Gemini API Key (可选)',
    customSubLabel: '手动粘贴字幕 (路线 C 兜底)',
    step1: '阶段 1: 读取 YouTube 视频元数据与字幕/转写...',
    step2: '阶段 1: 进行视频类型判定 (is_actionable)...',
    step3: '阶段 2: LLM 结构化提取 Exercises, Sets & Reps...',
    step4: '阶段 3: 执行确定性程序校验与置信度推导...',
    verifySave: '确认并生成分享链接',
    saving: '校验保存中...',
    exercisesHeader: '结构化动作表单',
    coachingCues: '动作指导姿势要点 (Coaching Cues)',
    addCue: '添加动作要点',
    addExercise: '添加动作',
    addSet: '增加一组',
    rest: '休息',
    setsDetail: '组别详情',
    evidenceTitle: '视频证据时间戳',
    unresolvedTitle: '解析不确定项与建议校对',
    saveToHevy: '保存到 Hevy',
    exportJson: '导出 JSON',
    shareLink: '复制分享链接',
    copiedLink: '已复制分享链接',
    copiedJson: '已复制 Workout JSON',
    verifiedBadge: '已校对保存',
    viewOriginal: '观看 YouTube 原视频',
    langToggle: '语言 / Language',
  }
};

const I18nContext = createContext<I18nContextType>({
  lang: 'en',
  setLang: () => {},
  t: (key) => key,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('fitparser_lang') as Language;
    if (saved === 'en' || saved === 'zh') {
      setLangState(saved);
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('fitparser_lang', newLang);
  };

  const t = (key: string): string => {
    return translations[lang]?.[key] || translations.en[key] || key;
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}

// Helper: Format bilingual exercise name based on current language
export function formatExerciseName(name_en: string, name_zh: string, lang: Language): string {
  if (lang === 'zh') {
    // Bilingual presentation when in Chinese mode: English Name (中文译名)
    if (name_zh && name_zh !== name_en) {
      return `${name_en} (${name_zh})`;
    }
    return name_en;
  }
  // Pure English when in English mode
  return name_en;
}
