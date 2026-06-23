# Vibe the Architecture

An interactive guide that teaches juniors how to make software-architecture
decisions **before** writing code — with real, copy-pasteable **MERN-stack**
(MongoDB · Express · React · Node) examples in TypeScript throughout.

It's inspired by [Hossam Okasha's note](#credit) to junior engineers: *"Just
like you vibe the code, you can vibe the architecture"* — as long as you walk
the stages in order and don't skip ahead.

## What's inside

- **The Method** — a 4-stage walkthrough (Problem & Constraints → Boundaries &
  Contracts → Tech Stack → Codebase Standards), each with the questions to
  "vibe" with the AI, the artifact you must produce, a worked example, and the
  anti-pattern to avoid.
- **Patterns** — an explorer of system shapes (monolith, modular monolith,
  microservices, serverless) and code organization (layered, feature-based,
  hexagonal, clean), each with trade-offs, a MERN folder shape, and a verdict.
- **One-way vs two-way doors** — Bezos' reversibility framing applied to MERN
  decisions, plus how to make a one-way door more reversible.
- **Decision Helper** — a short interactive quiz that recommends a sensible
  default architecture and flags what to watch out for.
- **MERN Examples** — shared Zod contracts, a thin controller → service →
  repository chain, TanStack Query data hooks, lint-enforced module boundaries,
  embed-vs-reference data modeling, and an ADR template.

## Tech stack

| Concern        | Choice                                  |
| -------------- | --------------------------------------- |
| Build / dev    | Vite + React 19 + TypeScript            |
| Styling        | Tailwind CSS v4 (`@tailwindcss/vite`)   |
| Routing        | React Router (route-level code split)   |
| Animation      | Motion (Framer Motion)                  |
| Icons          | lucide-react                            |
| Syntax highlighting | Shiki (fine-grained core, JS engine) |

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check + production build
npm run preview  # serve the production build
npm run lint     # ESLint
```

## Project structure

The app itself follows a feature-aware, layered structure — it tries to
practice what it teaches.

```
src/
├─ app entry (main.tsx, App.tsx)   # routing + providers
├─ components/
│  ├─ layout/                      # Navbar, Footer, Layout
│  └─ ui/                          # reusable primitives, CodeBlock, Tabs
├─ data/                           # content as typed data (stages, patterns, …)
├─ lib/                            # cn(), the Shiki highlighter singleton
└─ pages/                          # one file per route
docs/
├─ ARCHITECTURE.md                 # decisions for THIS app
├─ adr/                            # Architecture Decision Records
└─ mern-architecture-reference.md  # researched best-practice source material
```

## Docs

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — the architecture of this app.
- [`docs/adr/`](docs/adr) — the decision records.
- [`docs/mern-architecture-reference.md`](docs/mern-architecture-reference.md) —
  the cited research the content is built on.

## Credit

The philosophy is adapted from a LinkedIn note by **Hossam Okasha**, Senior
Frontend Engineer, addressed to junior engineers navigating architecture in the
AI era. This project turns that note into an interactive, example-driven guide.
