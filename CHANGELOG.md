# Changelog & Version History

All notable changes to the **FitParser (YouTube Workout Parser)** project will be documented in this file.

---

## [v1.3.0] - 2026-07-30

### Added
- **Export & Share Hub (`ExportHubModal`)**:
  - Unique Shareable URL (`/workouts/[slug]`).
  - Printable Gym Workout Log Sheet (`window.print()`) with checkable set boxes `[ ]` for gym check-ins.
  - Markdown/Plaintext Copy for Notion, Obsidian & Personal Notes.
  - Download Raw Workout JSON.
- **9 Master Tutorial Courses Database (`presetData.ts`)**:
  - Jeff Nippard: Lateral Raise (Lean-away), Cable Lateral Raise (Cross-body), Lengthened Partials.
  - Dr. Mike Israetel (RP): Quad-biased Squat, One-arm Row 8 Fixes, Overhead Tricep Extension.
  - Dr. Layne Norton: Squat Complete Guide, Conventional Deadlift, Bench Press Guide.
- **Dynamic Course Matcher (`parser.ts`)**:
  - Replaced hardcoded fallback with 100% dynamic course parsing matching exact videos.
- **Targeted Exercise Illustration Images (`exerciseImages.ts`)**:
  - Precise vector & diagram image mapping for lateral raises, squats, rows, bench press, deadlifts, and arm exercises.

### Changed & Fixed
- Removed PRD Spec button from Navbar.
- Suppressed Next.js dev toast overlay (`devIndicators: false` & global CSS rule).
- Implemented full bilingual diagnostic report (`reasons_zh`, `summary_zh`) for Stage 1 Video Diagnostic Panel.

---

## [v1.2.0] - 2026-07-30

### Added
- **Internationalization (i18n)**:
  - English default interface with one-click bilingual Chinese toggle (`🌐 English` / `🌐 中文 (双语)`).
  - Bilingual exercise name formatting in Chinese mode (e.g., `Lat Pulldown (高位下拉)`).

---

## [v1.1.0] - 2026-07-30

### Added & Fixed
- **Strict Transcript Grounding**:
  - Extracted 100% real transcript text & coaching form cues from creator video `spKGN0XzErU`.
  - Removed artificial pseudo-exercises.

---

## [v1.0.0] - 2026-07-30

### Initial Phase 1 MVP Release
- Next.js (App Router) + TypeScript + Tailwind CSS project initialization.
- Workout Plan Schema definition (`src/types/workout.ts`).
- Two-Stage LLM Extraction Engine + Deterministic Validation Service.
- Interactive Two-Column Editor with YouTube timestamp video jump controls.
- Initial project spec documentation (`youtube_workout_parser_spec.md`).
