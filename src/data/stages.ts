/**
 * The 4-stage method, adapted from Hossam Okasha's note to juniors.
 * The golden rule: walk the stages top-to-bottom, and don't move to the next
 * one until you've produced this stage's artifact. Code comes last, not first.
 */

export type Stage = {
  id: string
  number: number
  title: string
  arabicTitle: string
  tone: 'primary' | 'cyan' | 'amber' | 'emerald'
  goal: string
  summary: string
  /** Concrete questions to "vibe" with the AI — push it to think with you. */
  vibePrompts: string[]
  /** The artifact you must produce before advancing. */
  artifact: string
  /** A worked example for one running MERN product: a team task manager SaaS. */
  example: {
    heading: string
    body: string
    bullets: string[]
  }
  antiPattern: string
}

export const RUNNING_EXAMPLE =
  'TaskFlow — a small SaaS where teams create projects, assign tasks, comment, and get notified.'

export const stages: Stage[] = [
  {
    id: 'problem',
    number: 1,
    title: 'Problem & Constraints',
    arabicTitle: 'تحديد المشكلة',
    tone: 'primary',
    goal: 'Understand the business and surface your constraints — not a feature list.',
    summary:
      'Forget the code. Learn what problem the business solves and who the users are. The output of this stage is NOT a list of features — it is the set of constraints you must design around: scale, team size, deadlines, budget, compliance, latency, and the things that absolutely cannot break.',
    vibePrompts: [
      'Who are the users and what is the one job they hire this product to do?',
      'What breaks the business if it goes wrong — wrong billing? lost data? downtime?',
      'What is the realistic scale in year one: 50 users or 500,000?',
      'What are the hard constraints: team size, deadline, budget, regulations (GDPR, PCI)?',
      'Which numbers matter: requests/sec, data volume, read vs write ratio, p95 latency?',
    ],
    artifact:
      'A one-page brief: the problem, the users, and a bullet list of explicit constraints (scale, team, budget, deadline, compliance, must-not-fail invariants).',
    example: {
      heading: 'TaskFlow — constraints, not features',
      body: 'Instead of listing "tasks, comments, notifications", we extract what actually shapes the architecture:',
      bullets: [
        'Team of 2 juniors, 8-week deadline → favour boring, well-documented tools.',
        'Year-one scale ~2k teams, read-heavy boards → caching matters more than write throughput.',
        'Real-time-ish updates are "nice", not "must" → polling is acceptable v1; no need for sockets yet.',
        'Must-not-fail: a task assigned to you never silently disappears → data integrity > raw speed.',
      ],
    },
    antiPattern:
      'Jumping straight to "we need microservices and Kafka" before you can name a single constraint. Scale you do not have is a cost, not a feature.',
  },
  {
    id: 'boundaries',
    number: 2,
    title: 'Boundaries & Contracts',
    arabicTitle: 'تحديد الـ Boundaries',
    tone: 'cyan',
    goal: 'Turn understanding + constraints into a system with clear boundaries and contracts.',
    summary:
      'Take what you learned and draw lines. Split the system into parts with clear boundaries, and define the contracts — the shapes of data and the rules — by which those parts talk. Decide the data flow and the big, hard-to-reverse decisions here. This is docs and diagrams, still not code.',
    vibePrompts: [
      'What are the natural modules? (auth, projects, tasks, comments, notifications)',
      'Where are the seams — which parts could be owned by different people without stepping on each other?',
      'What is the contract between client and server? (the API shape, the DTOs, the error model)',
      'What is the data flow for the core action: "user assigns a task"? Trace it end to end.',
      'Which decisions are one-way doors here (DB choice, auth model, API style) vs two-way?',
    ],
    artifact:
      'A system map: modules with their responsibilities, the contracts between them (API/DTO shapes), the data-flow for the 2–3 core actions, and an ADR for each big decision.',
    example: {
      heading: 'TaskFlow — modules & one contract',
      body: 'Four modules with clear ownership, talking over a documented REST contract validated by a shared schema:',
      bullets: [
        'Modules: auth · projects · tasks · notifications — each owns its data and rules.',
        'Contract: POST /projects/:id/tasks → { title, assigneeId } returns a Task DTO; errors use a single {code,message} shape.',
        'Data flow: assign task → validate → persist → emit "task.assigned" → notifications module reacts.',
        'One-way door logged in an ADR: "REST over GraphQL for v1 — smaller team, simpler caching."',
      ],
    },
    antiPattern:
      'A "big ball of mud": controllers reach into each other, the React app talks to the DB shape directly, and there is no agreed contract — so every change ripples everywhere.',
  },
  {
    id: 'stack',
    number: 3,
    title: 'Tech Stack',
    arabicTitle: 'الـ Tech Stack',
    tone: 'amber',
    goal: 'Pick technologies that satisfy the constraints — the most boring option that works.',
    summary:
      'Only now do you choose tools, and you choose them to satisfy the constraints from stages 1–2 — not because they trend. Prefer boring, well-documented technology your team can actually operate. Every exotic choice is a cost you pay forever.',
    vibePrompts: [
      'Does this tool solve a constraint we actually have, or one we imagine?',
      'Can a 2-person junior team operate, debug, and hire for this in 8 weeks?',
      'What is the blast radius if we are wrong — is this a library (cheap) or our database (expensive)?',
      'What does the boring default look like, and what would have to be true to deviate from it?',
    ],
    artifact:
      'A short stack decision table: each choice, the constraint it serves, the boring default, and why you did (or did not) deviate.',
    example: {
      heading: 'TaskFlow — the boring, correct stack',
      body: 'Each pick maps back to a constraint, defaulting to MERN done well:',
      bullets: [
        'React + Vite + TypeScript + TanStack Query → fast DX, typed contracts, server-state handled.',
        'Node + Express + Zod → simple, hireable, runtime-validated contracts shared with the client.',
        'MongoDB + Mongoose → flexible documents fit task/board shapes; one DB to operate.',
        'JWT access + refresh in httpOnly cookie → standard auth the team understands.',
      ],
    },
    antiPattern:
      'Resume-driven development: choosing Kubernetes, microservices, GraphQL federation and three databases for an app two people will ship in two months.',
  },
  {
    id: 'standards',
    number: 4,
    title: 'Codebase Standards',
    arabicTitle: 'الـ Codebase Standards',
    tone: 'emerald',
    goal: 'Encode the conventions so the codebase stays consistent as it grows (and as AI writes it).',
    summary:
      'Last, set the rules of the road: folder structure, naming, the layering, lint/format, how errors and validation work, where business logic lives. With AI generating much of the code, explicit standards are what keep it coherent instead of a pile of plausible-looking snippets.',
    vibePrompts: [
      'Where does business logic live — and where is it forbidden? (not in controllers, not in components)',
      'What is the folder structure — feature-based or layer-based — and why?',
      'What is the import rule between layers? (e.g. routes → services → repositories, never backwards)',
      'How do we validate, log, and shape errors consistently across the whole app?',
      'Can I hand the AI these standards as context so every generated file matches?',
    ],
    artifact:
      'A CONVENTIONS.md (and ESLint/Prettier config) the whole team — and the AI — follows: structure, layering, naming, validation, error handling.',
    example: {
      heading: 'TaskFlow — conventions that scale',
      body: 'Feature-first folders with a strict dependency direction the linter enforces:',
      bullets: [
        'Frontend: src/features/<feature>/{api,components,hooks} — features never import each other directly.',
        'Backend: routes → controllers → services → repositories; business logic only in services.',
        'Validation at the edges: Zod parses every request body; controllers never trust input.',
        'One error shape, one logger, one config module — imported, never re-invented per file.',
      ],
    },
    antiPattern:
      'No rules: every file invents its own folder, error format and fetching style — so the codebase reads like five different people (or five different AI sessions) wrote it. Because they did.',
  },
]
