# AGENT.md — MyGuard AI Security Web App

This file orients any AI coding agent (Claude Code, Cursor, etc.) working in this repository.

## Product

"MyGuard" is an enterprise SaaS platform that protects corporate AI and agentic AI
systems from prompt injection attacks hidden inside uploaded documents. Core flow:

Upload document → extract PDF text → OCR the visible text → compare the two →
detect hidden/mismatched text → run an ML/AI injection detector → produce a risk
score → safe documents forward to the main AI model; suspicious ones are blocked
or routed to a stronger security AI.

The full UI/UX specification (all screens, copy, colors, typography) lives in
`PROMPT.md`. Read it before building or editing any screen — it is the source of
truth for content and design decisions, not this file.

## Tech stack

- React 19 + TypeScript, built with Vite 8
- Tailwind CSS v4 (via `@tailwindcss/vite`, config lives in `src/index.css` under `@theme`, not a `tailwind.config.js`)
- `react-router-dom` for routing
- `lucide-react` for icons
- `recharts` for the restrained charts on the Risk Reports page
- `clsx` for conditional classNames

## Folder structure

```
src/
  components/
    ui/            shared primitives (Button, Card, Badge, Input, ProgressStep...)
    layout/         TopBar, BottomNav, PageShell, FloatingAiAssistant
    dashboard/      widgets specific to the Home/Dashboard screen
    documents/      document table/list/filter components
    scan/           upload + scanning pipeline components
    assistant/      AI Assistant chat components
  pages/            one component per route/screen, thin — compose from components/
  context/          React Context providers (LanguageContext, UserRoleContext)
  i18n/             localization translations (az, en)
  hooks/            reusable hooks (e.g. useDocumentScan, useRiskColor)
  lib/              non-React helpers (formatters, mock API, risk-score math)
  data/             mock/sample data used until a real backend is wired up
  types/            shared TypeScript types (see types/index.ts)
  styles/           reserved for any global styles beyond index.css
```

Keep `pages/*` components thin: fetch/derive data, then render `components/*`.
Don't put business logic inline in JSX.

## Design tokens

Design system: **"Sovereign Intelligence."** All colors, typography, radii, and
shadows are defined as CSS variables in `src/index.css` under `@theme`
(Tailwind v4 style) — use the generated utility classes (e.g. `bg-primary`,
`text-on-surface`, `bg-brand-blue`, `bg-brand-purple`, `rounded-xl`,
`shadow-l1`, `text-title-lg`) rather than hardcoding hex values, pixel sizes,
or ad-hoc shadows in components.

- `brand-blue` (`#3174ef`) is the primary action color; `brand-purple`
  (`#c282ed`) is reserved for AI/"intelligence" features only.
- A full Material-3-style role token set (`primary`, `secondary`, `tertiary`,
  `error`, `outline`, `surface-container-*`, plus `*-fixed` variants) is
  available for role-based theming.
- Semantic status: use `success`/`warning`/`error` (+ `-container` variants)
  for status chips and alerts — never invent new risk colors.

Visual style is **restrained, premium, enterprise/governmental-grade** — "Corporate
Modern," minimalist, generous whitespace. See the Design System section of
`PROMPT.md` for the full rules (typography scale, elevation layers, shape
scale, component specs).

## UI copy language & i18n

Primary user-facing screen copy supports **Azerbaijani** (default) and **English**
via `src/context/LanguageContext.tsx` and `src/i18n/translations.ts`.

## Conventions

- Functional components only, no class components.
- Prefer named exports for components in `components/`, default export for
  `pages/*` (matches the router imports in `App.tsx`).
- Use the `@/` path alias (configured in `vite.config.js`) for imports from `src/`.
- Routing is centralized in `App.tsx`.
- Mock data belongs in `src/data/`, typed against `src/types/index.ts`.

## Git Commit Conventions

All Git commits in this repository MUST be written in English using the following structured format:

```
<type>: <short summary title>

- <detail 1>
- <detail 2>
- <detail 3>
```

Allowed types: `feat`, `fix`, `refactor`, `style`, `docs`, `chore`.

## Commands

```
npm install
npm run dev      # local dev server
npm run build    # typecheck + production build
```
