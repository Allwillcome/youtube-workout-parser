export interface RecommendedCourse {
  id: string;
  creator: 'Jeff Nippard' | 'Dr. Mike Israetel (RP)' | 'Dr. Layne Norton';
  title_en: string;
  title_zh: string;
  original_video: string;
  url: string;
  video_id: string;
  topic_zh: string;
  topic_en: string;
  duration_desc: string;
  core_points_zh: string[];
  core_points_en: string[];
}

export const RECOMMENDED_COURSES: RecommendedCourse[] = [
  // 1. Jeff Nippard
  {
    id: 'jn_1',
    creator: 'Jeff Nippard',
    title_en: 'A Better Way To Do Lateral Raises',
    title_zh: '哑铃侧平举：如何通过身体倾斜调整阻力曲线',
    original_video: 'A Better Way To Do Lateral Raises',
    url: 'https://www.youtube.com/watch?v=3VcKaXpzqRo',
    video_id: '3VcKaXpzqRo',
    topic_zh: '身体倾斜调整阻力曲线与拉伸位负荷',
    topic_en: 'Body lean setup & resistance curve optimization',
    duration_desc: '60–90 秒',
    core_points_zh: [
      '对比标准站姿、向外倾斜和向内倾斜的受力差异',
      '增加三角肌中束处于拉伸位（Lengthened Position）时的力矩负荷',
      '控制肩胛骨下沉，避免斜方肌耸肩和借力摆动'
    ],
    core_points_en: [
      'Compare standing vs leaning away vs leaning in setups',
      'Increase torque load when side delt is in lengthened stretch',
      'Depress scapula to eliminate upper trap momentum'
    ]
  },
  {
    id: 'jn_2',
    creator: 'Jeff Nippard',
    title_en: 'Stop Messing Up Lateral Raises',
    title_zh: '绳索侧平举：3 个关键设置细节',
    original_video: 'Stop Messing Up Lateral Raises',
    url: 'https://www.youtube.com/watch?v=WPAXBZuqi_s',
    video_id: 'WPAXBZuqi_s',
    topic_zh: '滑轮高度、跨体起始位与腕带使用',
    topic_en: 'Cable height, cross-body stretch & wrist cuffs',
    duration_desc: '60–90 秒',
    core_points_zh: [
      '调整滑轮高度在手腕至膝盖之间以优化起始张力',
      '采用跨体（Cross-body）起始位最大化三角肌拉伸行程',
      '使用腕带（Wrist Cuffs）减少前臂握力疲劳干扰'
    ],
    core_points_en: [
      'Set pulley height between wrist and knee for optimal tension',
      'Cross-body setup maximizes side delt stretch at bottom',
      'Use wrist cuffs to prevent forearm and grip fatigue'
    ]
  },
  {
    id: 'jn_3',
    creator: 'Jeff Nippard',
    title_en: "The World's Smartest Muscle Building Technique",
    title_zh: '长肌长半程训练 (Lengthened Partials)',
    original_video: "The World's Smartest Muscle Building Technique",
    url: 'https://www.youtube.com/watch?v=0t41mG8gA98',
    video_id: '0t41mG8gA98',
    topic_zh: '拉伸区间半程训练与肥大机制',
    topic_en: 'Lengthened partials for maximum muscle hypertrophy',
    duration_desc: '90–120 秒',
    core_points_zh: [
      '区分长肌长半程（Lengthened Partials）与普通缩短位半程',
      '在全程动作达到向心力竭后，继续在拉伸位追加半程次',
      '避免泛化到所有动作，优先应用于离心张力高的动作'
    ],
    core_points_en: [
      'Distinguish lengthened partials from shortened partials',
      'Perform stretched partial reps after full ROM concentric failure',
      'Apply selectively to exercises with high passive stretch tension'
    ]
  },

  // 2. Mike Israetel / Renaissance Periodization
  {
    id: 'mi_1',
    creator: 'Dr. Mike Israetel (RP)',
    title_en: 'How To Squat For Pure Quad Growth',
    title_zh: '股四头肌导向深蹲：腿部发力细节',
    original_video: 'How To Squat For Pure Quad Growth',
    url: 'https://www.youtube.com/watch?v=uK_q1x724vU',
    video_id: 'uK_q1x724vU',
    topic_zh: '膝关节前移、直立躯干与深度离心',
    topic_en: 'Forward knee travel, upright torso & deep eccentric',
    duration_desc: '90–120 秒',
    core_points_zh: [
      '允许膝关节自然超越脚尖前移（Forward Knee Travel）',
      '保持相对直立的躯干，将负荷集中于股四头肌拉伸位',
      '根据踝关节背屈能力选择垫高脚跟（Heel Elevation）'
    ],
    core_points_en: [
      'Allow natural forward knee travel past toes',
      'Maintain upright torso to bias quad tension over glutes',
      'Elevate heels on wedges if ankle dorsiflexion is limited'
    ]
  },
  {
    id: 'mi_2',
    creator: 'Dr. Mike Israetel (RP)',
    title_en: '8 One Arm Row Mistakes and How to Fix Them',
    title_zh: '单臂哑铃划船：8 个常见错误与修正',
    original_video: '8 One Arm Row Mistakes and How to Fix Them',
    url: 'https://www.youtube.com/watch?v=FkWs_4gP2w0',
    video_id: 'FkWs_4gP2w0',
    topic_zh: '支撑姿势、躯干扭转与手肘轨迹',
    topic_en: 'Stable stance, anti-rotation & elbow path',
    duration_desc: '90–120 秒',
    core_points_zh: [
      '建立三点稳定的支撑姿势，防止躯干过度摆动借力',
      '根据目标肌群调整手肘轨迹（贴紧躯干练背阔肌 vs 外展练上背）',
      '在底部保留合理肩胛前伸（Protraction）以拉满背部肌群'
    ],
    core_points_en: [
      'Establish stable 3-point base, prevent torso momentum rotation',
      'Adjust elbow path (close to torso for lats vs flared for upper back)',
      'Allow controlled scapular protraction for full stretch'
    ]
  },
  {
    id: 'mi_3',
    creator: 'Dr. Mike Israetel (RP)',
    title_en: 'Exercise Scientist Top 5 Tricep Exercises',
    title_zh: '过顶肱三头肌臂屈伸：拉伸位训练长头',
    original_video: 'Exercise Scientist Top 5 Tricep Exercises',
    url: 'https://www.youtube.com/watch?v=6SS6aym9w9U',
    video_id: '6SS6aym9w9U',
    topic_zh: '三头肌长头拉伸、肘关节屈曲与变式选择',
    topic_en: 'Overhead tricep long head stretch & elbow comfort',
    duration_desc: '60–90 秒',
    core_points_zh: [
      '大臂保持接近头部垂直上方，强力拉伸肱三头肌长头',
      '让肘关节获得充分屈曲，避免动作退化为肩部推举',
      '根据肘关节舒适度灵活选择 EZ 杆或绳索变式'
    ],
    core_points_en: [
      'Keep upper arm overhead to stretch tricep long head',
      'Achieve deep elbow flexion without shoulder press compensation',
      'Choose EZ-bar or cable rope based on elbow comfort'
    ]
  },

  // 3. Layne Norton / BioLayne
  {
    id: 'ln_1',
    creator: 'Dr. Layne Norton',
    title_en: 'How To Perform a Proper Squat',
    title_zh: '杠铃深蹲：完整基础动作指南',
    original_video: 'How To Perform a Proper Squat',
    url: 'https://www.youtube.com/watch?v=vV95t15Wb5E',
    video_id: 'vV95t15Wb5E',
    topic_zh: '站距、瓦氏呼吸腹压与足底三点受力',
    topic_en: 'Stance, bracing Valsalva & tripod foot balance',
    duration_desc: '2–3 分钟',
    core_points_zh: [
      '根据骨盆结构确定舒适站距与脚尖外展角度',
      '深吸气做瓦氏呼吸（Valsalva）建立强力核心腹压',
      '膝关节与髋关节同步屈曲，全程保持足底三点平稳受力'
    ],
    core_points_en: [
      'Set stance width and toe angle to fit individual hip anatomy',
      'Deep bracing breath (Valsalva) for spine & core rigidity',
      'Simultaneous hip & knee flexion while maintaining tripod foot balance'
    ]
  },
  {
    id: 'ln_2',
    creator: 'Dr. Layne Norton',
    title_en: 'Layne Norton Teaches You How to Deadlift',
    title_zh: '传统杠铃硬拉：起始姿势与发力顺序',
    original_video: 'Layne Norton Teaches You How to Deadlift',
    url: 'https://www.youtube.com/watch?v=Y1IGTJxjhio',
    video_id: 'Y1IGTJxjhio',
    topic_zh: '杠铃置于足中部、背阔肌锁紧与蹬地伸髋',
    topic_en: 'Bar over mid-foot, lat engagement & leg push lock',
    duration_desc: '2–3 分钟',
    core_points_zh: [
      '起始时杠铃始终处于足中部（Mid-foot）上方 1 英寸',
      '收紧背阔肌消除杠铃间隙，保持杠铃紧贴腿部上升',
      '双腿蹬地与髋部向前伸展同步完成，顶部避免脊柱过伸'
    ],
    core_points_en: [
      'Position bar directly over mid-foot before pull',
      'Engage lats to pull slack out of bar and keep bar tight to legs',
      'Push floor away while driving hips forward, avoid lumbar hyperextension at top'
    ]
  },
  {
    id: 'ln_3',
    creator: 'Dr. Layne Norton',
    title_en: "How To Bench Press: Layne Norton's Complete Guide",
    title_zh: '杠铃卧推：准备姿势、杠铃轨迹与腿部驱动',
    original_video: "How To Bench Press: Layne Norton's Complete Guide",
    url: 'https://www.youtube.com/watch?v=BYKScL2sgFs',
    video_id: 'BYKScL2sgFs',
    topic_zh: '肩胛骨后缩下沉、小臂垂直与反向 J 型轨迹',
    topic_en: 'Scapular retraction, vertical forearms & reverse J arch',
    duration_desc: '2–3 分钟',
    core_points_zh: [
      '肩胛骨向后紧缩并下沉，形成稳定的胸部平台',
      '根据底部小臂垂直状态确定握距，下放触碰下胸骨位置',
      '推起时采用轻微反向 J 型轨迹（Reverse J-path），利用腿部驱动（Leg Drive）'
    ],
    core_points_en: [
      'Retract and depress scapulae to create solid upper back arch',
      'Set grip width so forearms are vertical at bottom of press',
      'Press along slight reverse J-curve utilizing leg drive safely'
    ]
  }
];
