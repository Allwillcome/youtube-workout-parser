# YouTube 视频训练计划解析器：技术探索方案

## 一、项目目标

开发一个小型 Web 应用。用户输入 YouTube 健身视频链接，系统使用大语言模型将视频内容解析成结构化训练计划，并生成可分享的解析页面。

系统保存：

- YouTube 原始链接
- 视频标题
- YouTube 作者／频道名称
- 视频封面
- 视频发布时间
- 结构化训练计划
- 解析中的不确定项
- 解析页面链接
- 创建和更新时间

扩展功能：用户可以将确认后的训练计划保存到 Hevy。

第一阶段以个人技术探索为目标，不追求规模化和完整合规体系，但架构上需要把 YouTube 内容获取模块隔离，方便后续替换为授权字幕、用户上传或创作者接入。

---

## 二、核心用户流程

1. 用户粘贴 YouTube URL。
2. 系统读取视频基本信息。
3. 系统获取字幕或音频转写结果。
4. LLM 将内容转换为平台无关的 Workout JSON。
5. 系统展示解析结果和不确定项。
6. 用户修改动作、组数、次数、重量、休息等内容。
7. 用户确认并保存计划。
8. 系统生成公开或私密的分享链接。
9. 可选：连接 Hevy，匹配动作后创建 Routine。

核心原则：

- LLM 负责提取和建议，不直接写入 Hevy。
- 用户确认后的 JSON 才是最终数据。
- 保存来源和证据，避免生成结果脱离原视频。
- 产品自己的 Workout Schema 是数据核心，Hevy 只是适配器。

---

## 三、系统架构

```text
Frontend
  ├─ URL 输入
  ├─ 解析状态
  ├─ 训练计划编辑器
  ├─ 视频时间戳证据
  ├─ 分享页面
  └─ Hevy 导出确认

Backend API
  ├─ Video Metadata Service
  ├─ Content Ingestion Service
  ├─ Transcript Service
  ├─ LLM Extraction Service
  ├─ Workout Validation Service
  ├─ Share Service
  └─ Hevy Connector

Database
  ├─ videos
  ├─ transcripts
  ├─ workout_plans
  ├─ workout_plan_versions
  ├─ shared_pages
  ├─ hevy_connections
  └─ export_jobs

External Services
  ├─ YouTube
  ├─ Speech-to-Text
  ├─ LLM
  └─ Hevy API
```

---

## 四、推荐技术栈

为了快速试水，采用单体应用：

- Web 框架：Next.js + TypeScript
- UI：Tailwind CSS
- 数据库：PostgreSQL (或 SQLite/D1 便于本地零配置启动)
- ORM：Drizzle ORM 或 Prisma
- 后台任务：初期使用数据库 Job；需要时再引入队列
- 文件存储：本地临时目录；部署后使用 S3 兼容存储
- LLM：支持 JSON Schema 或结构化输出的模型 (如 Gemini 1.5/2.0 / OpenAI GPT-4o)
- 部署：先本地或测试环境，不立即公开生产部署

避免第一版引入：

- 微服务
- Kafka
- 复杂 Agent 框架
- 向量数据库
- 多模型自动路由
- 自动发布训练计划社区

---

## 五、视频内容获取路线

设计统一接口：

```ts
interface VideoContentProvider {
  getMetadata(url: string): Promise<VideoMetadata>;
  getTranscript(url: string): Promise<TranscriptResult>;
}
```

第一阶段可以实现多个 Provider，并记录每次解析使用的来源。

### 路线 A：已有字幕

优先使用视频字幕，因为速度快、成本低，也更容易保留时间戳。

输出：

```json
{
  "source_type": "caption",
  "language": "en",
  "segments": [
    {
      "start_seconds": 12.4,
      "end_seconds": 18.1,
      "text": "Complete three sets of twelve goblet squats."
    }
  ]
}
```

### 路线 B：音频转写

没有字幕时：

1. 获取临时音频。
2. 调用语音识别。
3. 生成带时间戳的 Transcript。
4. 转写完成后删除临时音频。
5. 默认不长期保存原始音频。

该模块必须与业务逻辑隔离，因为未来可能替换为：

- 用户主动上传音视频
- 创作者提供源文件
- 创作者授权频道
- 第三方合法字幕服务

### 路线 C：用户粘贴字幕

保留一个手动字幕入口，作为最稳定的兜底方式。

---

## 六、两阶段 LLM 解析

不要用一个 Prompt 直接从整段字幕生成 Hevy API Payload。

### 阶段一：内容识别

判断视频属于哪种类型：

```json
{
  "content_type": "complete_workout",
  "is_actionable": true,
  "confidence": 0.91,
  "reasons": [
    "Contains exercise sequence",
    "Contains set and rep instructions"
  ]
}
```

建议类型：

- `complete_workout`
- `exercise_tutorial`
- `workout_explanation`
- `program_overview`
- `follow_along_workout`
- `fitness_discussion`
- `not_workout_related`

只有具备可执行信息的内容才进入下一阶段。

### 阶段二：训练计划提取

模型输出严格遵循 Workout JSON Schema，并包含证据和不确定项。

```json
{
  "schema_version": "1.0",
  "title": "20 Minute Dumbbell Full Body Workout",
  "description": "",
  "source": {
    "platform": "youtube",
    "url": "https://youtube.com/watch?v=...",
    "video_id": "...",
    "video_title": "...",
    "channel_name": "...",
    "thumbnail_url": "..."
  },
  "structure": {
    "type": "straight_sets",
    "rounds": null
  },
  "exercises": [
    {
      "id": "local_uuid",
      "order": 1,
      "source_name": "Goblet Squat",
      "canonical_name": null,
      "sets": [
        {
          "set_type": "normal",
          "reps": 12,
          "duration_seconds": null,
          "weight_kg": null,
          "distance_meters": null,
          "rpe": null
        }
      ],
      "repeat_sets": 3,
      "rest_seconds": 60,
      "superset_group": null,
      "notes": "",
      "confidence": 0.94,
      "evidence": [
        {
          "start_seconds": 125,
          "end_seconds": 152,
          "text": "Three sets of twelve goblet squats."
        }
      ]
    }
  ],
  "unresolved": [
    {
      "path": "exercises[0].sets[0].weight_kg",
      "reason": "The video only says to choose a challenging weight.",
      "severity": "info"
    }
  ]
}
```

---

## 七、确定性校验

LLM 输出后必须经过普通程序校验，而不是继续相信模型。

校验规则包括：

- 动作名称不能为空。
- 组数必须大于零。
- 次数、重量、时长和距离不得为负数。
- 一个 Set 不能同时缺少 reps、duration 和 distance。
- 时间戳必须落在视频长度内。
- 动作顺序不能重复。
- 超级组必须至少包含两个动作。
- `confidence` 必须在 0～1 之间。
- 所有无法确认的信息必须进入 `unresolved`。
- 禁止模型自行补充视频没有提到的重量和次数。

校验失败时返回编辑页面，不自动重试到“看起来正确”。

---

## 八、用户校对页面

校对页面是产品核心，不是附属功能。

页面布局建议：

```text
左侧：YouTube 视频播放器
右侧：结构化训练计划编辑器

每个动作：
- 动作名称
- 组数
- 次数／时长
- 重量
- 休息
- 超级组／循环组
- 备注
- 置信度
- 跳转原视频时间戳
```

视觉规则：

- 高置信度：普通显示
- 中置信度：黄色提示
- 低置信度：红色提示，要求用户确认
- 缺失但非必要：灰色提示
- 缺失且影响执行：阻止导出

记录用户修改前后的差异，用于评估模型质量。

---

## 九、分享页面

每个确认后的计划生成唯一链接：

```text
/workouts/{slug}
```

分享页面展示：

- 训练计划标题
- YouTube 作者／频道名称
- 原始视频链接
- 封面
- 动作列表
- 组数、次数、重量和休息
- 视频时间戳链接
- “基于该视频解析”的来源说明
- 复制 JSON
- 保存到 Hevy
- 复制分享链接

默认不要展示：

- 完整字幕
- 下载的音频
- 大段原视频文字
- 去除来源后的内容副本

分享页面必须保留原视频链接和作者信息。

可增加可见性：

- `private`
- `unlisted`
- `public`

个人试验阶段默认 `unlisted`。

---

## 十、Hevy 集成

### 前提

Hevy 公共 API 只对 Hevy Pro 用户开放。用户需要自行提供 API Key。

第一阶段不做代理授权体系，采用：

- 用户在 Hevy 网页生成 API Key。
- 用户粘贴到应用。
- API Key 不发送给 LLM。
- 单用户本地测试可放服务端环境变量。
- 多用户版本必须加密保存，或只在当前会话临时使用。

### 导出流程

1. 用户点击“保存到 Hevy”。
2. 后端调用：

```text
GET /v1/exercise_templates
```

3. 将本地动作和 Hevy 动作库进行匹配。
4. 返回候选结果，不直接提交。
5. 用户确认每个动作。
6. 未匹配动作提供三种选择：
   - 选择已有 Hevy 动作
   - 创建自定义动作
   - 暂不导出该动作
7. 生成 Hevy Routine 预览。
8. 用户最终确认。
9. 调用：

```text
POST /v1/routines
```

10. 保存导出结果和 Hevy Routine ID。

### 动作匹配

匹配分为三层：

1. 标准化后的精确匹配
2. 别名和器械规则匹配
3. 语义模型候选匹配

语义匹配只能给建议，不能静默决定。

匹配结果：

```json
{
  "source_exercise": "Dumbbell Bench Press",
  "candidates": [
    {
      "hevy_template_id": "...",
      "title": "Bench Press (Dumbbell)",
      "confidence": 0.97
    }
  ],
  "selected_template_id": null,
  "requires_confirmation": true
}
```

---

## 十一、数据库核心结构

### videos

- `id`
- `platform`
- `external_video_id`
- `source_url`
- `title`
- `channel_name`
- `channel_url`
- `thumbnail_url`
- `duration_seconds`
- `published_at`
- `created_at`

### transcripts

- `id`
- `video_id`
- `source_type`
- `language`
- `segments_json`
- `status`
- `created_at`
- `expires_at`

### workout_plans

- `id`
- `video_id`
- `title`
- `schema_version`
- `workout_json`
- `visibility`
- `slug`
- `status`
- `created_at`
- `updated_at`

### workout_plan_versions

- `id`
- `workout_plan_id`
- `version`
- `workout_json`
- `change_source`
- `created_at`

### hevy_exports

- `id`
- `workout_plan_id`
- `hevy_routine_id`
- `mapping_json`
- `request_status`
- `error_message`
- `created_at`

---

## 十二、安全和隐私

- API Key 不进入 Prompt、日志或分析系统。
- 不在前端源码中写死服务端密钥。
- 音频文件只做临时处理，转写结束后删除。
- 日志不记录完整字幕和用户密钥。
- 写入 Hevy 前必须由用户主动确认。
- 导出请求增加幂等控制，避免重复创建 Routine。
- 分享页面默认不公开索引。
- 提供删除视频解析和关联数据的能力。

---

## 十三、开发阶段

### Phase 0：离线技术验证

输入：

- 一段人工提供的字幕

输出：

- Workout JSON
- 校验错误
- 可编辑结果

验证模型是否能可靠理解：

- 普通组
- 固定时长
- 循环训练
- 超级组
- 左右侧动作
- AMRAP／EMOM

### Phase 1：个人 Web MVP

实现：

- YouTube URL 输入
- 视频元数据
- 字幕／转写
- LLM 解析
- 训练计划编辑器
- 数据库存储
- Unlisted 分享链接

暂不实现 Hevy。

### Phase 2：Hevy Connector

实现：

- Hevy API Key
- 动作模板读取
- 动作候选匹配
- 用户确认
- 创建 Routine
- 防止重复创建

### Phase 3：小范围用户测试

邀请 10～20 名真实用户，观察：

- 什么视频最常被解析
- 哪些字段最常修改
- 哪些训练结构无法表达
- 动作匹配失败率
- 用户是否愿意连接 Hevy
- 用户真正想保存的是原计划还是个性化后的计划

---

## 十四、关键指标

技术指标：

- 可执行视频识别准确率
- JSON Schema 首次通过率
- 动作提取准确率
- 组数／次数准确率
- 动作匹配 Top-1 和 Top-3 准确率
- 平均低置信度字段数
- Hevy 导出成功率

产品指标：

- URL 提交到计划生成完成的时间
- 用户平均修改字段数
- 完成校对比例
- 分享比例
- Hevy 连接比例
- Routine 创建比例
- 同一用户再次解析视频的比例

最重要的指标是：

```text
用户确认前修改了多少内容
```

如果用户需要大幅重写，说明解析价值不成立；如果只需确认少量不确定项，才值得继续产品化。

---

## 十五、第一版明确不做

- 不批量抓取频道或播放列表
- 不建立完整字幕库
- 不长期保存原始音频
- 不自动创建大量自定义动作
- 不让 LLM 直接调用 Hevy
- 不未经确认自动发布分享页面
- 不做训练建议和视频原计划的混合生成
- 不做社区、关注、点赞和推荐流
- 不做复杂个性化算法

第一版只验证一个问题：

> 用户是否需要把 YouTube 健身视频快速转换成可执行、可保存、可分享的训练计划？
