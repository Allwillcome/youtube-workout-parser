<!-- BEGIN:nextjs-agent-rules -->
# 🤖 FitParser - AI Agent Collaboration & Engineering Guide

Welcome AI Agents! This document defines the engineering standards, architecture protocols, and strict behavioral guidelines for developing and maintaining the **FitParser** codebase.

---

## ⚠️ 1. Critical Framework Rule: Next.js 16 (App Router)

> **This is NOT the Next.js you know.**

This project runs on **Next.js 16 (Turbopack)**. APIs, conventions, and file structures differ significantly from legacy training data:
- Always use the App Router architecture under `src/app/`.
- Do not use Pages Router or legacy `getInitialProps`/`getServerSideProps`.
- Read the official docs in `node_modules/next/dist/docs/` before implementing new server actions or route handlers.
- Heed all deprecation notices for symbols imported from `next/server` and `next/navigation`.

---

## 🎯 2. Product Identity & Vision

**FitParser** transforms fitness video URLs (YouTube, Bilibili, Douyin) into **structured, verifiable, and executable workout plans** with precise timestamp video jumping.

### Key Value Pillars
1. **Ultra-High Granularity Extraction**: Captures 5+ full movement sequences, set structures (Warmup/Feeder/Working/Failure), reps, RPE targets, and targeted muscle group tags.
2. **Precision Timestamp Alignment**: Binds exercises to exact video seconds (`clampTimestamp`) for instant frame jumps.
3. **Biomechanical Form Cues**: Extracts 3+ specific technique and injury-prevention cues per exercise.
4. **Monochrome Utilitarian Aesthetics**: Pure Zinc monochrome dark mode (`#09090b`, crisp 1px borders, high-contrast black/white buttons).
5. **Zero-404 Serverless Persistence**: Binds local disk storage with client-side `localStorage` hydration.

---

## 🎨 3. Design System & Aesthetics (Monochrome Utilitarian)

Agents MUST strictly follow the established visual design system:
- **Canvas Base**: `#09090b` (`bg-minimal-canvas`)
- **Card Elements**: `bg-zinc-900`/`bg-zinc-950` with `1px solid rgba(255, 255, 255, 0.08)` borders (`minimal-card`).
- **Primary Buttons**: High-contrast white buttons with press feedback (`scale(0.97)`).
- **Modals & Dialogs**: Must be rendered via `createPortal` to `document.body` to prevent viewport offset bugs.

---

## 📁 4. Architecture Sitemap & Key Modules

| Path | Purpose & Responsibilities |
| :--- | :--- |
| `src/lib/videoPlatforms.ts` | Multi-platform URL detection, Bilibili BV API fetching, Douyin metadata extraction, and embed player URLs. |
| `src/lib/parser.ts` | Real-time dynamic semantic parser engine, LLM structured prompt construction, and timestamp clamping (`clampTimestamp`). |
| `src/lib/storage.ts` | Dual-layer persistence engine (`.data/workouts.json` + `localStorage`). |
| `src/components/WorkoutEditor.tsx` | Main compact above-the-fold editor with video timestamp jump integration and form cues editor. |
| `src/components/ExportHubModal.tsx` | Multi-format export modal (Gym log sheets, Notion formatted text, raw JSON) mounted via React `createPortal`. |
| `src/components/GoogleAuthModal.tsx` | Official `@react-oauth/google` integration and personal API Key vault storage. |
| `src/components/ClientHydrationView.tsx` | Client-side fallback view ensuring zero-404s in Vercel Serverless stateless environments. |

---

## 🧪 5. Testing & Verification Requirements

When making edits or adding features, Agents MUST execute:
1. `npm run build` to verify Next.js Turbopack compilation and TypeScript type validity.
2. Ensure no hardcoded static fallback templates break multi-platform dynamic parsing.
3. Commit message format follows Conventional Commits (e.g. `feat(vX.Y.Z): ...`, `fix(vX.Y.Z): ...`).

<!-- END:nextjs-agent-rules -->
