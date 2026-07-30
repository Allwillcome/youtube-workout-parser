export interface RecommendedCourse {
  id: string;
  creator: string;
  url: string;
  video_id: string;
  title_en: string;
  title_zh: string;
  topic_en: string;
  topic_zh: string;
  duration_desc: string;
}

export const RECOMMENDED_COURSES: RecommendedCourse[] = [
  {
    id: 'course_pull',
    creator: 'Jeff Nippard',
    url: 'https://www.youtube.com/watch?v=spKGN0XzErU',
    video_id: 'spKGN0XzErU',
    title_en: 'The Ultimate PULL Workout For Muscle Growth (Back, Biceps, Rear Delts)',
    title_zh: '终极拉系训练计划 (背部、肱二头肌、后束)',
    topic_en: 'Pull Day Routine: Lat Pulldown, Machine Row & Bicep Curls',
    topic_zh: '拉系训练：高位下拉、机器划船与二头弯举',
    duration_desc: '15-20 mins'
  },
  {
    id: 'course_push',
    creator: 'Jeff Nippard',
    url: 'https://www.youtube.com/watch?v=H6mRkx1x77k',
    video_id: 'H6mRkx1x77k',
    title_en: 'The Ultimate PUSH Workout For Muscle Growth (Chest, Shoulders, Triceps)',
    title_zh: '终极推系训练计划 (胸肌、三角肌前/中束、肱三头肌)',
    topic_en: 'Push Day Routine: Incline Bench, Overhead Press & Tricep Extension',
    topic_zh: '推系训练：上斜卧推、推举与三头臂屈伸',
    duration_desc: '15-20 mins'
  },
  {
    id: 'course_leg',
    creator: 'Jeff Nippard',
    url: 'https://www.youtube.com/watch?v=b6ouj88iBZs',
    video_id: 'b6ouj88iBZs',
    title_en: 'The Ultimate LEG Workout For Muscle Growth (Quads, Hamstrings, Calves)',
    title_zh: '终极腿部训练计划 (股四头肌、腘绳肌、小腿)',
    topic_en: 'Leg Day Routine: Barbell Squat, Romanian Deadlift & Leg Curl',
    topic_zh: '腿部训练：杠铃深蹲、罗马尼亚硬拉与腿弯举',
    duration_desc: '15-20 mins'
  }
];
