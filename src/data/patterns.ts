/**
 * Architecture patterns, grouped into two questions every MERN project answers:
 *   1. System shape  — how many deployable units, and how do they talk?
 *   2. Code organization — how is the code inside one unit structured?
 * For each: when it fits, when it's overkill, real trade-offs, and a verdict.
 */

export type PatternCategory = 'system' | 'code'

export type Pattern = {
  id: string
  name: string
  category: PatternCategory
  tagline: string
  tone: 'primary' | 'cyan' | 'amber' | 'emerald' | 'rose'
  /** 1 = simplest/most local, 5 = most distributed/most ceremony. */
  complexity: number
  description: string
  whenToUse: string[]
  whenToAvoid: string[]
  pros: string[]
  cons: string[]
  mern: {
    label: string
    tree: string
  }
  verdict: string
}

export const categoryMeta: Record<
  PatternCategory,
  { label: string; question: string }
> = {
  system: {
    label: 'System shape',
    question: 'How many deployable units — and how do they talk?',
  },
  code: {
    label: 'Code organization',
    question: 'How do you structure the code inside one unit?',
  },
}

export const patterns: Pattern[] = [
  {
    id: 'monolith',
    name: 'Monolith',
    category: 'system',
    tagline: 'One deployable app. The right starting point for almost everyone.',
    tone: 'emerald',
    complexity: 1,
    description:
      'A single Express app and a single React app, one database, one deploy. All modules live in one codebase and call each other in-process. Simple to run, debug, and reason about.',
    whenToUse: [
      'New product, small team, requirements still moving.',
      'You cannot yet name a part that needs to scale independently.',
      'You want one place to log, debug, and deploy.',
    ],
    whenToAvoid: [
      'Genuinely independent domains with wildly different scaling needs.',
      'Many teams that must deploy on their own cadence without coordination.',
    ],
    pros: [
      'Lowest operational cost — one thing to deploy and monitor.',
      'Easy local dev; refactors are a single PR.',
      'No network between modules → no distributed-systems failure modes.',
    ],
    cons: [
      'Everything ships together; one bad deploy affects all.',
      'Without internal boundaries it can rot into a "big ball of mud".',
    ],
    mern: {
      label: 'server/ — one Express app',
      tree: `server/
├─ src/
│  ├─ modules/
│  │  ├─ auth/
│  │  ├─ projects/
│  │  ├─ tasks/
│  │  └─ notifications/
│  ├─ shared/        # logger, errors, config
│  ├─ app.ts         # wires modules together
│  └─ server.ts
└─ package.json      # one deploy`,
    },
    verdict:
      'The correct default. Start here. You can always carve out a service later when a real boundary earns it.',
  },
  {
    id: 'modular-monolith',
    name: 'Modular Monolith',
    category: 'system',
    tagline: 'One deploy, but with enforced internal boundaries. The sweet spot.',
    tone: 'primary',
    complexity: 2,
    description:
      'Still one deployable unit, but modules have explicit boundaries: each owns its data and exposes a small internal API. Modules talk through those interfaces, not by reaching into each other’s tables. Gives you most of the clarity of microservices with none of the network pain.',
    whenToUse: [
      'You want the simplicity of a monolith but fear the "ball of mud".',
      'You expect to maybe split a module out later and want clean seams now.',
      'A growing team where modules map to people.',
    ],
    whenToAvoid: [
      'Tiny throwaway prototype where even modules are ceremony.',
      'You truly need independent scaling/deploys today (then go services).',
    ],
    pros: [
      'Clear ownership and contracts without distributed-systems cost.',
      'Refactor boundaries cheaply — it’s all in one repo.',
      'A module can be promoted to a service later with minimal surgery.',
    ],
    cons: [
      'Boundaries are a discipline; nothing physically stops a shortcut.',
      'Still one deploy and one runtime.',
    ],
    mern: {
      label: 'Modules expose interfaces, not tables',
      tree: `server/src/modules/
├─ tasks/
│  ├─ tasks.routes.ts
│  ├─ tasks.controller.ts
│  ├─ tasks.service.ts      # the module's public API
│  ├─ tasks.repository.ts   # owns the Task collection
│  └─ tasks.types.ts
└─ notifications/
   └─ notifications.service.ts
   # tasks.service emits an event; notifications reacts.
   # No module imports another module's repository.`,
    },
    verdict:
      'The best default for anything you expect to grow. Same deploy as a monolith, but it ages well. Recommended for most MERN SaaS.',
  },
  {
    id: 'microservices',
    name: 'Microservices',
    category: 'system',
    tagline: 'Many independently deployable services. Powerful — and a tax.',
    tone: 'rose',
    complexity: 5,
    description:
      'Each domain is its own deployable service with its own database, communicating over the network (HTTP/gRPC/queues). Enables independent scaling and deploys — at the cost of distributed-systems complexity: partial failure, eventual consistency, tracing, and a lot of ops.',
    whenToUse: [
      'Large org where independent teams must deploy on their own schedule.',
      'Parts with truly different scaling profiles (e.g. video transcoding vs CRUD).',
      'You have the ops maturity: CI/CD, observability, on-call.',
    ],
    whenToAvoid: [
      'Small team / early product — this is the classic junior trap.',
      'You cannot draw the service boundaries confidently yet.',
      'You are reaching for it for "scalability" you do not measurably need.',
    ],
    pros: [
      'Independent deploy and scaling per service.',
      'Fault isolation — one service down need not take all down.',
      'Teams own services end to end.',
    ],
    cons: [
      'Distributed transactions, eventual consistency, network failures.',
      'Heavy ops: service discovery, tracing, multiple databases.',
      'A refactor across services is a multi-repo, multi-deploy coordination.',
    ],
    mern: {
      label: 'A service per domain (+ gateway)',
      tree: `services/
├─ gateway/          # routes + auth, talks to all
├─ auth-service/     # own DB
├─ tasks-service/    # own DB
└─ notifications-service/
   # services talk over HTTP / a message queue
   # each has its own package.json + deploy`,
    },
    verdict:
      'Rarely the right first move for a junior-led MERN app. It is a one-way-ish door with a permanent ops tax. Earn it with a real, measured need — usually by splitting a module out of a modular monolith.',
  },
  {
    id: 'serverless',
    name: 'Serverless / Functions',
    category: 'system',
    tagline: 'Deploy functions, not servers. Great for spiky, event-driven work.',
    tone: 'cyan',
    complexity: 3,
    description:
      'Code runs as functions that scale to zero and up automatically (e.g. Vercel Functions, Lambda). You pay per use and skip server management — but you inherit cold starts, statelessness, and execution limits.',
    whenToUse: [
      'Spiky or unpredictable traffic; want to pay only for use.',
      'Event-driven glue: webhooks, scheduled jobs, image processing.',
      'Small team that wants zero server ops.',
    ],
    whenToAvoid: [
      'Long-lived connections (websockets) or very long jobs.',
      'Latency-critical paths sensitive to cold starts (mitigable, but real).',
    ],
    pros: [
      'No servers to manage; scales automatically, even to zero.',
      'Cost tracks usage closely for spiky workloads.',
    ],
    cons: [
      'Statelessness forces external stores for everything.',
      'Cold starts and execution time limits shape your design.',
      'Local dev and debugging are less straightforward.',
    ],
    mern: {
      label: 'API as functions, React as static',
      tree: `app/
├─ api/
│  ├─ projects/route.ts     # one function per route
│  └─ tasks/[id]/route.ts
├─ src/ (React app → static/CDN)
└─ (Mongo via a serverless-friendly driver/pooler)`,
    },
    verdict:
      'A fine deploy target for a MERN API — especially behind a managed platform. Orthogonal to code structure: you still organize the code with one of the patterns below.',
  },
  {
    id: 'layered',
    name: 'Layered (N-tier)',
    category: 'code',
    tagline: 'Routes → controllers → services → repositories. The honest default.',
    tone: 'emerald',
    complexity: 1,
    description:
      'Organize code by technical role in horizontal layers with a one-way dependency rule: HTTP (routes/controllers) depends on business logic (services), which depends on data access (repositories/models). Each layer only knows the one below it.',
    whenToUse: [
      'Standard CRUD-heavy apps — most MERN backends.',
      'A team that wants an obvious, teachable structure.',
    ],
    whenToAvoid: [
      'Very large apps where "all services together" becomes a junk drawer.',
      'Domains so rich you want the business core fully framework-agnostic.',
    ],
    pros: [
      'Everyone understands it; easy to onboard.',
      'Clear separation of HTTP, logic, and data.',
      'Easy to test services in isolation from Express.',
    ],
    cons: [
      'By-layer folders scatter one feature across many directories.',
      'Business logic can still leak into controllers if undisciplined.',
    ],
    mern: {
      label: 'Folders by technical layer',
      tree: `server/src/
├─ routes/        # HTTP endpoints
├─ controllers/   # parse req, call service, send res
├─ services/      # business logic lives ONLY here
├─ repositories/  # all DB access
├─ models/        # Mongoose schemas
└─ middleware/    # auth, validation, errors`,
    },
    verdict:
      'A perfectly good default for small/medium MERN backends. Pair the dependency rule with feature folders (below) once it grows.',
  },
  {
    id: 'feature-based',
    name: 'Feature-based / Vertical Slice',
    category: 'code',
    tagline: 'Group by feature, not by file type. Scales the best.',
    tone: 'primary',
    complexity: 2,
    description:
      'Slice the codebase by feature (auth, tasks, projects) instead of by technical type. Everything one feature needs — its components, hooks, API calls, types — lives together. The dominant convention in modern React (see bulletproof-react) and works just as well on the Express side.',
    whenToUse: [
      'Any app you expect to grow past a handful of screens/endpoints.',
      'You want changes to a feature to touch one folder, not five.',
      'Multiple people working without colliding.',
    ],
    whenToAvoid: [
      'A truly tiny app where one components/ folder is fine.',
    ],
    pros: [
      'High cohesion — a feature is self-contained and easy to find.',
      'Easy to delete or extract a whole feature.',
      'Enforce boundaries: features talk through a public index, never deep imports.',
    ],
    cons: [
      'Requires judgement on what counts as a "feature".',
      'Shared code needs a clear home (shared/ or lib/) to avoid duplication.',
    ],
    mern: {
      label: 'React app sliced by feature',
      tree: `src/
├─ app/            # routing, providers, layout
├─ features/
│  ├─ auth/
│  │  ├─ api/      # query/mutation hooks
│  │  ├─ components/
│  │  └─ index.ts  # the feature's public surface
│  └─ tasks/
│     ├─ api/
│     ├─ components/
│     └─ hooks/
├─ components/     # shared, dumb UI
└─ lib/            # api client, utils`,
    },
    verdict:
      'The recommended structure for the React side, and an excellent one for Express too. This is what most well-run MERN codebases converge on.',
  },
  {
    id: 'hexagonal',
    name: 'Hexagonal (Ports & Adapters)',
    category: 'code',
    tagline: 'Business core in the middle; the DB and HTTP are pluggable adapters.',
    tone: 'cyan',
    complexity: 4,
    description:
      'Put the business logic at the center and let it define "ports" (interfaces). The outside world — Express, MongoDB, email providers — plugs in via "adapters" that implement those ports. The core never imports a framework, so you can swap Mongo for Postgres or Express for Fastify without touching it.',
    whenToUse: [
      'Rich domain logic you want fully isolated and unit-testable.',
      'Real chance of swapping infrastructure (DB, transport, providers).',
      'Long-lived product where the domain outlives the frameworks.',
    ],
    whenToAvoid: [
      'CRUD apps — the indirection buys you little and costs clarity.',
      'Small team on a deadline; the ceremony slows you down.',
    ],
    pros: [
      'Domain is framework-agnostic and trivially unit-testable.',
      'Infrastructure is swappable behind interfaces.',
    ],
    cons: [
      'More files and indirection; steeper learning curve.',
      'Over-applied to simple CRUD, it is pure overhead.',
    ],
    mern: {
      label: 'Core defines ports; adapters implement them',
      tree: `server/src/tasks/
├─ domain/
│  ├─ Task.ts             # pure entity, no Mongoose
│  └─ TaskRepository.ts   # PORT (interface)
├─ application/
│  └─ AssignTask.ts       # use case, depends on the port
└─ infrastructure/
   ├─ MongoTaskRepository.ts  # ADAPTER
   └─ TaskController.ts       # ADAPTER (Express)`,
    },
    verdict:
      'Powerful for complex domains, overkill for typical CRUD. Reach for it only when the domain is genuinely rich — not by default.',
  },
  {
    id: 'clean',
    name: 'Clean Architecture',
    category: 'code',
    tagline: 'Concentric layers; dependencies point inward to the domain.',
    tone: 'amber',
    complexity: 5,
    description:
      'A stricter cousin of hexagonal: entities at the core, then use cases, then interface adapters, then frameworks/drivers on the outside. The iron rule is the Dependency Rule — source code dependencies only point inward. Maximum decoupling, maximum ceremony.',
    whenToUse: [
      'Large, long-lived systems with complex, stable business rules.',
      'Strong testing culture; multiple delivery mechanisms (web, CLI, jobs).',
    ],
    whenToAvoid: [
      'Startups and most MERN apps — the file count and indirection rarely pay off.',
      'Teams new to the codebase who need to move fast.',
    ],
    pros: [
      'Business rules are completely independent of frameworks and DB.',
      'Highly testable and very explicit about responsibilities.',
    ],
    cons: [
      'Lots of boilerplate, mappers, and layers.',
      'Easy to cargo-cult; slows small teams down dramatically.',
    ],
    mern: {
      label: 'Concentric layers, inward dependencies',
      tree: `server/src/
├─ entities/         # enterprise rules (pure)
├─ usecases/         # application rules
├─ adapters/         # controllers, presenters, gateways
└─ frameworks/       # Express, Mongoose, external APIs
   # nothing inner imports anything outer`,
    },
    verdict:
      'Excellent for a few systems, miscast in most. For a junior-led MERN app it is usually the wrong altitude — a modular monolith with layered + feature folders gets you 90% of the benefit at 20% of the cost.',
  },
]
