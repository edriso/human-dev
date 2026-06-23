/**
 * One-way vs two-way door decisions (Bezos, 2015–2016 shareholder letters).
 * One-way = hard/impossible to reverse → decide slowly, write it down.
 * Two-way = cheaply reversible → decide fast, don't over-think it.
 */

export type Door = {
  decision: string
  why: string
  /** A move that converts a one-way door into a more reversible one. */
  reversibilityTip?: string
}

export const oneWayDoors: Door[] = [
  {
    decision: 'MongoDB data model & multi-tenancy strategy',
    why: 'Once production data is written in a shape, migrating it is a careful, risky project. Multi-tenancy (shared vs isolated data) is the foundational SaaS choice and is expensive to undo.',
    reversibilityTip:
      'Keep all DB access behind a repository so query shapes are swappable, and pick the tenancy model deliberately up front.',
  },
  {
    decision: 'The public API contract / URL shape',
    why: 'Clients couple to your endpoints and payloads. Changing them is a breaking change for every consumer.',
    reversibilityTip:
      'Version the API and validate with a shared schema so changes are explicit and detectable.',
  },
  {
    decision: 'Auth model (sessions vs JWT, which identity provider)',
    why: 'It touches every request and every user’s security. Rewiring it later means a migration that can log everyone out or open holes.',
    reversibilityTip:
      'Centralise auth in one middleware/module so the mechanism can change without touching every route.',
  },
  {
    decision: 'Primary-key / ID strategy (auto-increment vs UUID)',
    why: 'IDs are referenced everywhere — by foreign keys, URLs, and external systems. Switching means rewriting every reference.',
  },
  {
    decision: 'Monolith vs microservices boundaries',
    why: 'Splitting a system into services — or merging them back — is a multi-repo, multi-deploy effort with data-migration risk.',
    reversibilityTip:
      'Start as a modular monolith: the boundaries are real but live in one repo, so they’re cheap to move until they stabilise.',
  },
]

export const twoWayDoors: Door[] = [
  {
    decision: 'React state library (Zustand, Redux Toolkit, …)',
    why: 'State lives inside the app and is swappable feature by feature. Wrong call? Refactor one slice at a time.',
  },
  {
    decision: 'Component / UI library',
    why: 'Presentational only. You can migrate components incrementally without touching business logic.',
  },
  {
    decision: 'Folder structure within a layer',
    why: 'Moving files is a mechanical refactor your editor and the type-checker handle for you.',
  },
  {
    decision: 'Most npm dependencies',
    why: 'A library behind a thin wrapper can be replaced in an afternoon. Don’t agonise — try one.',
  },
  {
    decision: 'Lint / format config, CI provider',
    why: 'Pure tooling. Change it whenever; nothing about your product depends on the choice.',
  },
]

/** Bezos’ guidance for moving fast without breaking the irreversible things. */
export const bezosPrinciples = [
  {
    title: 'The 70% rule',
    body: '“Most decisions should probably be made with somewhere around 70% of the information you wish you had. If you wait for 90%, in most cases, you’re probably being slow.”',
  },
  {
    title: 'Disagree and commit',
    body: 'Once a reversible decision is made, commit to it fully — even if you argued against it. You can revisit a two-way door later if it’s wrong.',
  },
  {
    title: 'Don’t use a heavy process on light decisions',
    body: 'The common failure mode is treating every Type-2 (reversible) decision like a Type-1 (irreversible) one. That’s what makes teams slow and timid.',
  },
]
