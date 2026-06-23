/**
 * A small rule-based recommender for the Decision Helper page. It does NOT try
 * to be clever — it encodes the same defaults a sensible senior would give:
 * start with a modular monolith, only distribute when several signals line up,
 * and only reach for hexagonal/clean when the domain is genuinely complex.
 */

export type Choice = {
  value: string
  label: string
  /** Pushes the system-shape recommendation toward distribution (+) or simplicity (-). */
  distribute: number
  note?: string
}

export type Question = {
  id: string
  question: string
  help: string
  choices: Choice[]
}

export const questions: Question[] = [
  {
    id: 'team',
    question: 'Who is building this?',
    help: 'Team size is the single biggest predictor of how much architecture you can operate.',
    choices: [
      { value: 'solo', label: 'Just me / 1–2 juniors', distribute: -2 },
      { value: 'small', label: 'A small team (3–8)', distribute: 0 },
      { value: 'multi', label: 'Multiple teams that deploy on their own schedule', distribute: 3 },
    ],
  },
  {
    id: 'stage',
    question: 'What stage is the product at?',
    help: 'Requirements that are still moving are a reason to keep things reversible.',
    choices: [
      { value: 'prototype', label: 'Prototype / still finding the problem', distribute: -2 },
      { value: 'v1', label: 'Building v1 to launch', distribute: -1 },
      { value: 'scaling', label: 'Live product, scaling a known bottleneck', distribute: 2 },
    ],
  },
  {
    id: 'scaling',
    question: 'Do parts of the system have very different scaling needs?',
    help: 'e.g. heavy media processing next to light CRUD. This is the main honest reason to split services.',
    choices: [
      { value: 'no', label: 'No — it’s mostly CRUD over a database', distribute: -1 },
      { value: 'unsure', label: 'Not sure yet', distribute: 0 },
      { value: 'yes', label: 'Yes — clearly different and measured', distribute: 3 },
    ],
  },
  {
    id: 'ops',
    question: 'How strong is your ops muscle?',
    help: 'Distributed systems demand CI/CD, monitoring, tracing, and someone on call.',
    choices: [
      { value: 'none', label: 'Minimal — we just want to ship', distribute: -2 },
      { value: 'some', label: 'Some — basic CI and logging', distribute: 0 },
      { value: 'strong', label: 'Strong — observability and on-call in place', distribute: 2 },
    ],
  },
  {
    id: 'deadline',
    question: 'How tight is the deadline?',
    help: 'Pressure is a reason to choose the most boring option that works.',
    choices: [
      { value: 'tight', label: 'Tight — weeks', distribute: -1 },
      { value: 'normal', label: 'Normal — a quarter or so', distribute: 0 },
      { value: 'relaxed', label: 'Relaxed — long-lived investment', distribute: 1 },
    ],
  },
  {
    id: 'domain',
    question: 'How complex are the business rules?',
    help: 'This decides code organization, not system shape. Rich rules can justify hexagonal/clean.',
    choices: [
      { value: 'crud', label: 'Mostly CRUD with light rules', distribute: 0, note: 'crud' },
      { value: 'moderate', label: 'Moderate — some real workflows', distribute: 0, note: 'moderate' },
      {
        value: 'rich',
        label: 'Rich rules / many integrations',
        distribute: 0,
        note: 'rich',
      },
    ],
  },
]

export type Recommendation = {
  systemId: 'monolith' | 'modular-monolith' | 'microservices'
  systemLabel: string
  codeId: 'layered' | 'feature-based' | 'hexagonal'
  codeLabel: string
  headline: string
  reasons: string[]
  cautions: string[]
}

export function recommend(answers: Record<string, string>): Recommendation {
  const all = questions
    .map((q) => q.choices.find((c) => c.value === answers[q.id]))
    .filter(Boolean) as Choice[]

  const score = all.reduce((sum, c) => sum + c.distribute, 0)
  const domain = answers['domain'] ?? 'crud'

  const reasons: string[] = []
  const cautions: string[] = []

  // ---- system shape ----
  let systemId: Recommendation['systemId']
  let systemLabel: string
  if (score >= 6 && answers['scaling'] === 'yes' && answers['ops'] === 'strong') {
    systemId = 'microservices'
    systemLabel = 'Microservices'
    reasons.push(
      'Multiple teams, a measured scaling difference, and real ops maturity together are the rare case where distributing actually pays.',
    )
    cautions.push(
      'Even here: extract one service out of a modular monolith rather than starting distributed. Splitting before boundaries are stable creates a “distributed monolith” — all the pain, none of the benefit.',
    )
  } else if (score <= -3) {
    systemId = 'monolith'
    systemLabel = 'Monolith'
    reasons.push(
      'Small team, early stage, and time pressure: one deployable app is the fastest path to learning and shipping.',
    )
    cautions.push(
      'Keep internal modules tidy from day one so it can grow into a modular monolith without a rewrite.',
    )
  } else {
    systemId = 'modular-monolith'
    systemLabel = 'Modular Monolith'
    reasons.push(
      'One deploy keeps ops simple, while enforced module boundaries give you clean seams and let you carve out a service later if a real need appears.',
    )
    if (answers['scaling'] === 'yes') {
      cautions.push(
        'You flagged different scaling needs — note which module, and be ready to extract just that one when you can measure the bottleneck.',
      )
    }
  }

  if (score < 6 && answers['scaling'] === 'yes') {
    cautions.push(
      'Different scaling needs alone don’t justify microservices yet — the rest of your signals favour staying simple. Revisit when team/ops catch up.',
    )
  }

  // ---- code organization ----
  let codeId: Recommendation['codeId']
  let codeLabel: string
  if (domain === 'rich') {
    codeId = 'hexagonal'
    codeLabel = 'Hexagonal (Ports & Adapters), inside feature modules'
    reasons.push(
      'Rich rules justify isolating the domain behind ports so it stays framework-free and unit-testable.',
    )
    cautions.push(
      'Apply it only to the genuinely complex modules — wrapping simple CRUD in ports and adapters is pure overhead.',
    )
  } else {
    codeId = 'feature-based'
    codeLabel = 'Feature-based folders + a layered (controller→service→repository) chain'
    reasons.push(
      'Slice by feature for cohesion, with a one-way layer rule inside each. This is what most well-run MERN codebases converge on.',
    )
    if (domain === 'moderate') {
      cautions.push(
        'As specific modules grow rich, you can promote just those to hexagonal — no need to do it everywhere.',
      )
    }
  }

  // ---- universal cautions ----
  cautions.push(
    'Whatever you pick: write down the one-way doors (data model, multi-tenancy, auth, public API shape) as ADRs before building features.',
  )

  const headline =
    systemId === 'microservices'
      ? 'Distribute — carefully, and one service at a time.'
      : systemId === 'monolith'
        ? 'Keep it a clean monolith. Resist the urge to distribute.'
        : 'Build a modular monolith. The boring, scalable default.'

  return { systemId, systemLabel, codeId, codeLabel, headline, reasons, cautions }
}
