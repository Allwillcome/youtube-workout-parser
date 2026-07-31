export interface RecommendedCourse {
  id: string;
  video_id: string;
  url: string;
  creator: string;
  title_en: string;
  title_zh: string;
  topic_en: string;
  topic_zh: string;
  duration_desc: string;
  platform?: 'youtube' | 'bilibili' | 'douyin';
}

export const RECOMMENDED_COURSES: RecommendedCourse[] = [
  {
    id: 'bilibili_push',
    video_id: 'BV1SEorB6Ekj',
    url: 'https://www.bilibili.com/video/BV1SEorB6Ekj/',
    creator: 'B站精选 · 哔哩哔哩健身',
    title_en: 'Bilibili Full Push Workout Technique Guide',
    title_zh: 'B站全网火爆 · 胸肩三头推系全程训练干货',
    topic_en: 'Incline press, OHP, lateral raises & triceps extensions.',
    topic_zh: '详细解析上斜卧推、站姿推举、侧平举与臂屈伸动作细节。',
    duration_desc: 'B站 12:45',
    platform: 'bilibili'
  },
  {
    id: 'douyin_leg',
    video_id: '7595410750903198075',
    url: 'https://www.douyin.com/video/7595410750903198075',
    creator: '抖音精选 · 抖音健身达人',
    title_en: 'Douyin Quick Leg Workout Routine',
    title_zh: '抖音爆款 · 腿部股四与腘绳肌极速爆爽卡片',
    topic_en: 'Deep squat, Romanian RDL & Bulgarian split squat.',
    topic_zh: '深蹲姿势、罗马尼亚硬拉拉伸位与单腿蹲细节。',
    duration_desc: '抖音 03:20',
    platform: 'douyin'
  },
  {
    id: 'pull_workout',
    video_id: 'spKGN0XzErU',
    url: 'https://www.youtube.com/watch?v=spKGN0XzErU',
    creator: 'Jeff Nippard (YouTube)',
    title_en: 'The Ultimate PULL Workout For Muscle Growth',
    title_zh: 'YouTube 终极 PULL 拉系训练 (背部/二头/后束)',
    topic_en: 'Lat pulldowns, chest supported rows, pullovers & incline curls.',
    topic_zh: '精细包含高位下拉、支撑划船、直臂拉开与二头弯举。',
    duration_desc: 'YouTube 16:32',
    platform: 'youtube'
  }
];
