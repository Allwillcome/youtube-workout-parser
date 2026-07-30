# 🏋️ FitParser - YouTube Fitness Video → Executable Workout Plan

FitParser 是一个将 **YouTube 健身/训练视频** 转换为 **结构化、可校对、可分享且带时间戳跳转训练计划** 的 AI 引擎。

## 🌟 核心特性

- 🎯 **超高颗粒度解析 (Ultra-High Granularity Extraction)**：涵盖视频中的全部 5+ 个动作序列、组数/次数/RPE 目标及肌群细分 Tag。
- ⏱️ **秒数时间戳精准跳播 (Precision Timestamp Alignment)**：每个动作绑定原视频字幕秒数，点击直接跳转至具体讲授帧。
- 💡 **运动力学姿势要点 (Biomechanical Form Cues)**：严谨提炼 3+ 条动作发力与姿势建议。
- 🖤 **Monochrome Utilitarian 极简设计**：沉稳高感单色配色，首屏直达正题，支持一键导出刷卡卡片/Notion/JSON。
- 🔗 **独立下钻路由 (`/workouts/[slug]`)**：基于磁盘持久化存储（`.data/workouts.json`），提供专属可分享 URL。

---

## 🚀 部署到 Vercel (Deployment Guide)

### 1. 推送到 GitHub
在 GitHub 上新建一个仓库（例如 `youtube-workout-parser`），然后执行以下指令：

```bash
git remote add origin https://github.com/<your-username>/youtube-workout-parser.git
git branch -M main
git push -u origin main
```

### 2. 在 Vercel 上一键部署
1. 打开 [Vercel Dashboard](https://vercel.com/new)，选择 **Import** 刚刚推送的 GitHub 仓库；
2. **Framework Preset** 选择 `Next.js`；
3. **Environment Variables (环境变量配置)**（可选）：
   - `OPENAI_API_KEY`: 您的 OpenAI API Key（用于启用大模型高颗粒度推理）
   - `DEEPSEEK_API_KEY`: 您的 DeepSeek API Key

> 💡 **提示**：即便不设置全局环境变量，产品前端也已内置了 **【高级选项：API Key 自定义输入框】**。使用者可以在界面上自行填写自己的 OpenAI / DeepSeek Key 进行解析，不需要开发者承担 API Token 费用！

---

## 💻 本地开发

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev

# 3. 访问本地页面
# 打开 http://localhost:3000
```
