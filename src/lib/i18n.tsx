'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'zh';

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    appName: 'FitParser',
    tagline: 'YouTube Fitness Video → Executable Workout Plan',
    heroBadge: 'AI-Powered Biomechanical Extraction',
    heroTitle: 'Transform YouTube Fitness Videos Into',
    heroTitleGradient: 'Executable Workout Plans',
    heroDesc: 'Extract strict, transcript-grounded exercises, sets, reps and form cues directly from top fitness creators.',
    urlLabel: 'YouTube Video Link',
    urlPlaceholder: 'https://www.youtube.com/watch?v=...',
    parseBtn: 'Parse Video',
    parsingBtn: 'Parsing Transcript...',
    advancedOptions: 'Advanced API & Subtitle Options',
    apiKeyLabel: 'OpenAI / DeepSeek API Key (Optional)',
    customSubLabel: 'Custom Subtitle Transcript (Optional Override)',
    step1: 'Step 1/4: Fetching YouTube metadata & captions...',
    step2: 'Step 2/4: Auditing content actionability...',
    step3: 'Step 3/4: Extracting structured workout schema...',
    step4: 'Step 4/4: Validating exercise rules & timestamp evidence...',
    exercisesHeader: 'Workout Routine & Coaching Cues',
    addExercise: '+ Add Exercise',
    rest: 'Rest',
    coachingCues: 'Biomechanical Form Cues',
    addCue: '+ Add Form Cue',
    setsDetail: 'Set Details',
    addSet: '+ Add Set',
    evidenceTitle: 'Video Evidence Timestamp',
    verifySave: 'Verify & Share Link',
    saving: 'Verifying & Saving...',
    verifiedBadge: 'Verified Workout Plan',
    viewOriginal: 'View Original Video ↗',
    shareLink: 'Share Plan URL',
    copiedLink: 'Link Copied!',
    exportJson: 'Export Raw JSON',
    copiedJson: 'JSON Copied!',
    saveToHevy: 'Save to Hevy Routine'
  },
  zh: {
    appName: 'FitParser',
    tagline: 'YouTube 健身视频 → 可执行训练计划',
    heroBadge: '大模型驱动 · 生物力学动作提取引擎',
    heroTitle: '把 YouTube 健身视频转换成',
    heroTitleGradient: '可执行的训练计划',
    heroDesc: '严谨提取顶级健身导师视频中的真实动作、组数次数与动作姿势要点，支持打卡刷卡导出。',
    urlLabel: 'YouTube 视频链接',
    urlPlaceholder: '输入 YouTube 视频链接 (如 https://www.youtube.com/watch?v=...)',
    parseBtn: '解析视频',
    parsingBtn: '正在提取视频字幕与结构...',
    advancedOptions: '高级 API 与自定义字幕选项',
    apiKeyLabel: 'OpenAI / DeepSeek API Key (可选)',
    customSubLabel: '自定义粘贴视频字幕文本 (可选)',
    step1: '步骤 1/4: 抓取 YouTube 元数据与字幕...',
    step2: '步骤 2/4: 诊断视频可执行度...',
    step3: '步骤 3/4: 提取结构化训练计划...',
    step4: '步骤 4/4: 校验训练规则与时间戳证据...',
    exercisesHeader: '动作训练计划与姿势要点',
    addExercise: '+ 添加动作',
    rest: '休息',
    coachingCues: '运动力学与姿势要点',
    addCue: '+ 添加要点',
    setsDetail: '组数明细',
    addSet: '+ 添加组',
    evidenceTitle: '原视频证据秒数锚点',
    verifySave: '确认并生成分享链接',
    saving: '正在校验并生成...',
    verifiedBadge: '已校验训练计划',
    viewOriginal: '观看 YouTube 视频 ↗',
    shareLink: '分享计划链接',
    copiedLink: '链接已复制！',
    exportJson: '导出 Raw JSON',
    copiedJson: 'JSON 已复制！',
    saveToHevy: '保存到 Hevy 训练库'
  }
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('zh');

  const t = (key: string): string => {
    return translations[lang]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

export function formatExerciseName(name_en: string, name_zh: string | undefined, lang: Language): string {
  if (lang === 'zh') {
    if (name_zh && name_zh !== name_en) {
      return `${name_en} (${name_zh})`;
    }
    return name_en;
  }
  return name_en;
}
