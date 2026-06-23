# 1. Ship as a static client-side SPA

Status: Accepted — 2026-06-23

## Context
"Vibe the Architecture" is a content/education app. There is no user data, no
authentication, and nothing dynamic that a server must compute per request. We
want fast iteration, cheap hosting, and a light runtime. The alternative would
be a server-rendered framework (e.g. Next.js), which adds a server we don't need.

## Decision
We will build a static client-side SPA with Vite + React + React Router. Routes
are code-split with `React.lazy` so each page loads only what it needs. A host
rewrite (`vercel.json`) maps all paths to `index.html` so deep links resolve.

## Consequences
+ Trivial, cheap deployment to any static host or CDN.
+ Fast local dev and small, route-split bundles.
- No server-side rendering → SEO relies on the SPA being indexable; acceptable
  for this audience and content.
- Deep links need the host rewrite; without it, refreshing `/patterns` 404s.
~ If we later need dynamic data or SSR, revisit via a new ADR superseding this.
