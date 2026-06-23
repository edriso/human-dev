# 2. Model content as typed data, not as JSX

Status: Accepted — 2026-06-23

## Context
The app is mostly structured content: stages, patterns, examples, quiz
questions. We could write this directly as JSX inside page components, or model
it as typed data that pages render. Inlining content in JSX couples editing the
text to editing the layout and scatters it across components.

## Decision
All content lives in typed modules under `src/data/` (`stages.ts`,
`patterns.ts`, `examples.ts`, `decision.ts`, `doors.ts`). Pages are thin views
that map over that data. The data shapes (`Stage`, `Pattern`, `Example`, …) are
the contract between content and presentation.

## Consequences
+ Content is editable in one place, separate from layout.
+ The compiler enforces the content shape — a missing field is a build error.
+ The decision recommender is a pure function over data, easy to test/tweak.
- Changing a data shape is a one-way-ish door: every consuming page must update.
  We accept this because TypeScript makes every break explicit and local.
