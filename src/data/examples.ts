/**
 * Real, copy-pasteable MERN + TypeScript examples that demonstrate the
 * architecture ideas in practice. Grouped so the Examples page can tab them.
 * Code reflects current best practice: shared Zod contracts, a thin
 * controller → service → repository chain, TanStack Query on the client,
 * sane Mongoose data modeling, and lint-enforced module boundaries.
 */

export type ExampleGroup = 'contracts' | 'backend' | 'frontend' | 'data' | 'decisions'

export type Example = {
  id: string
  group: ExampleGroup
  title: string
  summary: string
  lang: string
  filename: string
  code: string
  takeaway?: string
}

export const exampleGroups: { id: ExampleGroup; label: string; blurb: string }[] = [
  {
    id: 'contracts',
    label: 'Contracts',
    blurb: 'One Zod schema is the single source of truth for client and server.',
  },
  {
    id: 'backend',
    label: 'Express backend',
    blurb: 'Thin controllers, logic in services, all DB access behind a repository.',
  },
  {
    id: 'frontend',
    label: 'React frontend',
    blurb: 'Feature-based files, server state in TanStack Query, typed API layer.',
  },
  {
    id: 'data',
    label: 'MongoDB modeling',
    blurb: 'Embed by default; reference when data is unbounded or stands alone.',
  },
  {
    id: 'decisions',
    label: 'Decisions (ADR)',
    blurb: 'Capture the one-way doors as short, immutable records in the repo.',
  },
]

export const examples: Example[] = [
  // ---------------------------------------------------------------- contracts
  {
    id: 'zod-contract',
    group: 'contracts',
    title: 'Shared contract (the MERN-TS superpower)',
    summary:
      'A single Zod schema lives in a shared package. The server validates with it at runtime; the client infers its types from it. The contract can never silently drift between the two.',
    lang: 'typescript',
    filename: 'packages/contracts/task.ts',
    code: `import { z } from 'zod'

// The contract: one definition, used everywhere.
export const createTaskInput = z.object({
  title: z.string().min(1).max(200),
  assigneeId: z.string().optional(),
  dueDate: z.coerce.date().optional(),
})

export const taskDto = z.object({
  id: z.string(),
  title: z.string(),
  status: z.enum(['todo', 'doing', 'done']),
  assigneeId: z.string().nullable(),
  createdAt: z.string(),
})

// Static types are *derived* from the runtime schema — they cannot drift.
export type CreateTaskInput = z.infer<typeof createTaskInput>
export type TaskDto = z.infer<typeof taskDto>`,
    takeaway:
      'Validation and types come from the same line. Change the shape once; both sides update.',
  },
  {
    id: 'error-shape',
    group: 'contracts',
    title: 'One error shape for the whole API',
    summary:
      'Every error the API returns has the same shape. The client writes one error handler instead of guessing per endpoint. This is a contract too.',
    lang: 'typescript',
    filename: 'shared/api-error.ts',
    code: `// Every non-2xx response looks exactly like this.
export type ApiError = {
  code: string        // machine-readable: 'TASK_NOT_FOUND'
  message: string     // human-readable, safe to show
  details?: unknown   // e.g. flattened Zod field errors
}

// Express error middleware — the single place errors become responses.
export function errorHandler(err, _req, res, _next) {
  if (err.name === 'ZodError') {
    return res.status(400).json({
      code: 'VALIDATION_ERROR',
      message: 'Invalid request body',
      details: err.flatten(),
    } satisfies ApiError)
  }
  const status = err.status ?? 500
  res.status(status).json({
    code: err.code ?? 'INTERNAL_ERROR',
    message: status === 500 ? 'Something went wrong' : err.message,
  } satisfies ApiError)
}`,
    takeaway: 'Shape errors once, at the edge. Never leak stack traces or DB errors to clients.',
  },
  // ------------------------------------------------------------------ backend
  {
    id: 'layering',
    group: 'backend',
    title: 'Route → Controller → Service → Repository',
    summary:
      'The dependency chain only points one way. The controller does HTTP and nothing else. The service holds the business rule. The repository is the only code that touches Mongoose.',
    lang: 'typescript',
    filename: 'server/src/modules/tasks/*',
    code: `// tasks.routes.ts — declare endpoints, attach validation
router.post('/projects/:id/tasks', validate(createTaskInput), tasksController.create)

// tasks.controller.ts — HTTP only. No business logic here.
export const tasksController = {
  async create(req, res) {
    const task = await tasksService.assignTask(req.params.id, req.body, req.user.id)
    res.status(201).json(task) // already a TaskDto
  },
}

// tasks.service.ts — the business rule lives ONLY here.
export const tasksService = {
  async assignTask(projectId, input, actorId) {
    const project = await projectsRepo.findById(projectId)
    if (!project) throw new AppError('PROJECT_NOT_FOUND', 404)
    if (!project.memberIds.includes(actorId)) throw new AppError('FORBIDDEN', 403)

    const task = await tasksRepo.create({ ...input, projectId })
    events.emit('task.assigned', { taskId: task.id, assigneeId: task.assigneeId })
    return toTaskDto(task)
  },
}

// tasks.repository.ts — the ONLY file that knows about Mongoose.
export const tasksRepo = {
  create: (data) => TaskModel.create(data),
  findById: (id) => TaskModel.findById(id).lean(),
}`,
    takeaway:
      'Controllers stay thin; services are framework-free and unit-testable; swapping the DB touches one file.',
  },
  {
    id: 'validate-middleware',
    group: 'backend',
    title: 'Validate at the edge with the shared schema',
    summary:
      'A tiny middleware parses the request body with the same Zod schema the client uses. Past this line, the rest of the app can trust its input completely.',
    lang: 'typescript',
    filename: 'server/src/middleware/validate.ts',
    code: `import type { ZodSchema } from 'zod'

// Reusable: hand it any contract schema.
export const validate =
  (schema: ZodSchema) =>
  (req, _res, next) => {
    const result = schema.safeParse(req.body)
    if (!result.success) return next(result.error) // → errorHandler
    req.body = result.data // now fully typed & trimmed of extras
    next()
  }`,
    takeaway:
      'Never trust req.body. Parsing at the edge also strips unknown fields — that kills mass-assignment bugs.',
  },
  // ----------------------------------------------------------------- frontend
  {
    id: 'api-layer',
    group: 'frontend',
    title: 'Typed API function + a Query hook',
    summary:
      'Each endpoint gets a plain typed function and a TanStack Query hook that wraps it. Components call the hook and get caching, loading, and refetching for free. Server state never goes into useState.',
    lang: 'tsx',
    filename: 'src/features/tasks/api/use-tasks.ts',
    code: `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import type { TaskDto, CreateTaskInput } from '@app/contracts'

// 1) plain typed function
const getTasks = (projectId: string) =>
  api.get<TaskDto[]>(\`/projects/\${projectId}/tasks\`)

// 2) the hook components actually use
export function useTasks(projectId: string) {
  return useQuery({
    queryKey: ['tasks', projectId],
    queryFn: () => getTasks(projectId),
  })
}

export function useCreateTask(projectId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateTaskInput) =>
      api.post<TaskDto>(\`/projects/\${projectId}/tasks\`, input),
    // refetch the list once the server confirms
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks', projectId] }),
  })
}`,
    takeaway:
      'Server state = TanStack Query. Keep only true UI state (a modal’s open/closed) in useState.',
  },
  {
    id: 'eslint-boundaries',
    group: 'frontend',
    title: 'Lint-enforced module boundaries (bulletproof-react)',
    summary:
      'Conventions only hold if a machine enforces them. This ESLint rule makes illegal imports a build error: features can’t import each other, and shared code can’t import features.',
    lang: 'javascript',
    filename: 'eslint.config.js',
    code: `// import/no-restricted-paths — the boundaries become real.
'import/no-restricted-paths': ['error', {
  zones: [
    // a feature may not reach into another feature
    { target: './src/features/tasks', from: './src/features', except: ['./tasks'] },
    // the app layer is the only place features get composed
    { target: './src/features', from: './src/app' },
    // shared code must never depend on features or app
    {
      target: ['./src/components', './src/hooks', './src/lib', './src/utils'],
      from: ['./src/features', './src/app'],
    },
  ],
}]
// Allowed direction:  shared → features → app  (one way only)`,
    takeaway:
      'A boundary nobody enforces is a suggestion. Let the linter say no so humans don’t have to.',
  },
  // --------------------------------------------------------------------- data
  {
    id: 'embed-vs-reference',
    group: 'data',
    title: 'Embed vs reference: model for how you read',
    summary:
      'MongoDB’s rule of thumb: favour embedding, but never embed an unbounded array. A few sub-items that you always load with the parent? Embed. A list that grows forever, like comments? Separate collection with a reference.',
    lang: 'typescript',
    filename: 'server/src/modules/tasks/task.model.ts',
    code: `import { Schema, model } from 'mongoose'

// ✅ EMBED: bounded, always read with the task (a handful of labels)
const taskSchema = new Schema({
  title: String,
  status: { type: String, enum: ['todo', 'doing', 'done'], default: 'todo' },
  labels: [{ name: String, color: String }], // small, fixed-ish → embed
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', index: true },
})

// ✅ REFERENCE: comments grow without bound → their own collection.
// Embedding them would push the task toward the 16MB document limit.
const commentSchema = new Schema({
  taskId: { type: Schema.Types.ObjectId, ref: 'Task', index: true },
  authorId: { type: Schema.Types.ObjectId, ref: 'User' },
  body: String,
  createdAt: { type: Date, default: Date.now },
})

export const Task = model('Task', taskSchema)
export const Comment = model('Comment', commentSchema)`,
    takeaway:
      'Rule of thumb: > a couple hundred on the “many” side → don’t embed; > a few thousand → don’t even use an array of refs. Data accessed together is stored together.',
  },
  // ---------------------------------------------------------------- decisions
  {
    id: 'adr',
    group: 'decisions',
    title: 'An Architecture Decision Record (ADR)',
    summary:
      'One short, immutable markdown file per significant decision, kept in the repo. You don’t edit an accepted ADR — you supersede it with a new one. This is how you write down a one-way door so future-you remembers why.',
    lang: 'text',
    filename: 'docs/adr/0002-rest-over-graphql.md',
    code: `# 2. Use REST (not GraphQL) for the v1 API

Status: Accepted — 2026-06-23

## Context
We are a 2-person team shipping TaskFlow v1 in 8 weeks. The client is the
only consumer of the API. We want simple caching and an easy mental model.
The public API shape is a one-way door — clients will couple to it.

## Decision
We will expose a REST API following standard resource conventions.
GraphQL is deferred until we have multiple consumers or proven over-fetching.

## Consequences
+ Smaller learning curve; HTTP caching works out of the box.
+ Tooling (Express, Zod, fetch) is boring and well understood.
- Some endpoints may over/under-fetch; we accept this for v1.
~ If a mobile app appears later, revisit via a new ADR (supersede this one).`,
    takeaway:
      'ADRs are cheap insurance against re-litigating decisions. Keep them one page, in the repo, and never rewrite history — supersede it.',
  },
]
