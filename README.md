# 🏋️ FitParser - YouTube Fitness Video → Executable Workout Plan

[English](#english) | [简体中文](#简体中文)

---

<a name="english"></a>
## 🌐 English

**FitParser** is an AI-powered engine that transforms **YouTube Fitness Videos** into **structured, verifiable, and executable workout plans** with precise timestamp video jumping.

👉 **Live Demo**: [https://youtube-workout-parser.vercel.app](https://youtube-workout-parser.vercel.app)

### ✨ Core Features

- 🎯 **Ultra-High Granularity Extraction**: Complete exercise sequences (5+ movements), set types (Warmup/Feeder/Working/Failure), reps, RPE targets, and targeted muscle group tags.
- ⏱️ **Precision Timestamp Alignment**: Bounded video timestamp evidence. Click to seek directly to the exact frame where the creator demonstrates form.
- 💡 **Biomechanical Form Cues**: 3+ detailed technique and injury-prevention cues per exercise.
- 🖤 **Monochrome Utilitarian Aesthetics**: Minimalist dark UI designed for focused review without rainbow mesh distraction.
- 📋 **Multi-Format Export**: One-click export to printable gym check-in log sheets, formatted text (for Notion/Notes), or standard JSON.
- 🔗 **Drill-down Routes (`/workouts/[slug]`)**: Unique shareable URL backed by dual-layer persistence (localStorage + disk cache).

### 🚀 Quick Start (Vercel & Local)

```bash
# 1. Clone repository
git clone https://github.com/Allwillcome/youtube-workout-parser.git
cd youtube-workout-parser

# 2. Install dependencies
npm install

# 3. Start local development
npm run dev
# Open http://localhost:3000
```

---

<a name="简体中文"></a>
## 🌐 简体中文

**FitParser** 是一款大模型与规则驱动的健身工具，能将 **YouTube 健身/训练视频** 转换为 **结构化、可校对、可导出且带秒数跳转的训练计划**。

👉 **在线体验地址**: [https://youtube-workout-parser.vercel.app](https://youtube-workout-parser.vercel.app)

### ✨ 核心特性

- 🎯 **超高颗粒度解析**：完整提取视频中 5+ 个动作序列、组数类型（热身/递进/正式/力竭组）、次数、RPE 目标及肌群细分 Tag。
- ⏱️ **秒数时间戳精准跳播**：动作点与字幕秒数 100% 对齐，点击即可直接跳转到对应画面复看发力。
- 💡 **运动力学姿势要点**：每个动作精选 3+ 条发力与避坑指南。
- 🖤 **Monochrome Utilitarian 极简设计**：沉稳单色高冷风，首屏直达正题，无无谓下滑。
- 📋 **多端一键导出**：支持导出健身房打印刷卡卡片、复制排版文本（Notion/备忘录）及 Raw JSON。
- 🔗 **专属下钻路由 (`/workouts/[slug]`)**：双重缓存保障，生成专属可分享 URL。

### 🚀 本地运行与部署

```bash
# 1. 克隆项目
git clone https://github.com/Allwillcome/youtube-workout-parser.git
cd youtube-workout-parser

# 2. 安装依赖
npm install

# 3. 运行开发服务器
npm run dev
# 打开 http://localhost:3000
```

---

## 📄 License

[MIT](LICENSE) © [FitParser](https://github.com/Allwillcome/youtube-workout-parser)
