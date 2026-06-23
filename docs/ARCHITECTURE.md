# Architecture — Vibe the Architecture (the app)

This app teaches an architecture method, so it tries to follow that method
itself. This document is the "stage 2 + stage 4" artifact for the app.

## 1. Problem & constraints

- **Problem:** juniors now own architecture decisions without a senior. They
  need a calm, concrete reference for the few decisions that are hard to undo.
- **Users:** junior/mid engineers working in the MERN stack.
- **Constraints:**
  - Content-heavy but must stay fast and feel light → static SPA, code-split.
  - No backend needed — all content is data, shipped with the app.
  - Must be readable on mobile and accessible.
  - Examples must be real MERN/TypeScript, not toy snippets.

## 2. Boundaries & contracts

- **Content is data, not markup.** Every section's content lives in typed
  modules under `src/data/` (`stages.ts`, `patterns.ts`, `examples.ts`,
  `decision.ts`, `doors.ts`). Pages are thin views over that data. This is the
  app's main boundary: *content* vs *presentation*.
- **UI primitives** (`src/components/ui`) know nothing about content; **pages**
  compose primitives with data. Layout components are route-agnostic.
- **The decision recommender** (`src/data/decision.ts`) is a pure function:
  `recommend(answers) → recommendation`. It has no UI dependency and is trivial
  to test or tweak.

## 3. Tech stack (and why)

| Decision | Choice | Reason |
| --- | --- | --- |
| Rendering | Client-side SPA | Pure content/education; no server data or SEO-critical dynamic pages. |
| Bundler | Vite | Fast dev, first-class TS/React, simple config. |
| Styling | Tailwind v4 | Token-driven design system in CSS via `@theme`; no config file. |
| Routing | React Router | Standard SPA routing; route-level `lazy()` keeps initial load small. |
| Highlighting | Shiki core + JS engine | Avoids the Oniguruma WASM and ships only the grammars we use. |

## 4. Codebase standards

- **Imports:** absolute via the `@/` alias (`@/components`, `@/data`, …).
- **One-way data flow:** `data` → `pages`/`components`. UI never owns content.
- **Each route is a lazy chunk** so a page's heavy deps (e.g. Shiki on the
  Patterns/Examples pages) don't bloat the initial bundle.
- **Lint + types are the gate:** `npm run build` (tsc) and `npm run lint` must
  pass; that's the contract for "done".

## Notable one-way doors here

- **The content data shapes** (`Stage`, `Pattern`, `Example`, …) — pages couple
  to them, so changing a shape ripples. They're versioned in TypeScript so the
  compiler catches every break. See [ADR 0002](adr/0002-content-as-typed-data.md).
- **Client-side routing** requires a host rewrite (`vercel.json`) so deep links
  resolve. See [ADR 0001](adr/0001-static-spa.md).
