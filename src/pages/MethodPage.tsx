import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Link } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  FileText,
  MessageSquareQuote,
} from 'lucide-react'
import { Badge, Callout } from '@/components/ui/primitives'
import { stages, RUNNING_EXAMPLE, type Stage } from '@/data/stages'
import { cn } from '@/lib/cn'

const toneRing: Record<Stage['tone'], string> = {
  primary: 'ring-primary/40 bg-primary/10 text-primary-soft',
  cyan: 'ring-cyan/40 bg-cyan/10 text-cyan',
  amber: 'ring-amber/40 bg-amber/10 text-amber',
  emerald: 'ring-emerald/40 bg-emerald/10 text-emerald',
}

function StageDetail({ stage }: { stage: Stage }) {
  return (
    <motion.div
      key={stage.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-3">
        <span
          className={cn(
            'flex size-11 items-center justify-center rounded-xl font-display text-lg font-bold ring-1',
            toneRing[stage.tone],
          )}
        >
          {stage.number}
        </span>
        <div>
          <h2 className="text-2xl font-semibold">{stage.title}</h2>
          <p className="font-mono text-xs text-faint">{stage.arabicTitle}</p>
        </div>
      </div>

      <p className="mt-5 text-lg font-medium text-fg">{stage.goal}</p>
      <p className="mt-3 leading-relaxed text-muted">{stage.summary}</p>

      {/* Vibe prompts */}
      <div className="mt-8">
        <div className="flex items-center gap-2 text-sm font-semibold text-fg">
          <MessageSquareQuote className="size-4 text-primary-soft" />
          Vibe it with the AI — push it to think with you
        </div>
        <ul className="mt-3 space-y-2">
          {stage.vibePrompts.map((p) => (
            <li
              key={p}
              className="rounded-xl border border-border bg-surface-2/50 px-4 py-3 text-sm text-muted"
            >
              {p}
            </li>
          ))}
        </ul>
      </div>

      {/* Artifact */}
      <Callout
        kind="quote"
        className="mt-6"
        title="Before you move on, produce this"
        icon={<FileText className="size-4 text-primary-soft" />}
      >
        {stage.artifact}
      </Callout>

      {/* Worked example */}
      <div className="mt-6 rounded-2xl border border-border bg-surface/60 p-6">
        <div className="mb-1 flex items-center gap-2">
          <Badge tone="cyan">Worked example</Badge>
        </div>
        <h3 className="mt-3 font-display text-lg font-semibold">{stage.example.heading}</h3>
        <p className="mt-1 text-sm text-muted">{stage.example.body}</p>
        <ul className="mt-4 space-y-2.5">
          {stage.example.bullets.map((b) => (
            <li key={b} className="flex gap-2.5 text-sm text-muted">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>

      <Callout
        kind="danger"
        className="mt-6"
        title="The anti-pattern to avoid"
        icon={<AlertTriangle className="size-4 text-rose" />}
      >
        {stage.antiPattern}
      </Callout>
    </motion.div>
  )
}

export function MethodPage() {
  const [activeId, setActiveId] = useState(stages[0].id)
  const active = stages.find((s) => s.id === activeId) ?? stages[0]
  const activeIndex = stages.findIndex((s) => s.id === activeId)

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <header className="max-w-2xl">
        <div className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-primary-soft">
          The method
        </div>
        <h1 className="text-4xl font-semibold sm:text-5xl">Walk the stages, in order</h1>
        <p className="mt-4 text-lg text-muted">
          Don’t pass a stage until you’ve produced its artifact. Throughout, we design one running
          example: <span className="text-fg">{RUNNING_EXAMPLE}</span>
        </p>
      </header>

      <div className="mt-12 grid gap-8 lg:grid-cols-[260px_1fr]">
        {/* Stage rail */}
        <nav className="lg:sticky lg:top-24 lg:self-start">
          <ol className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
            {stages.map((stage, i) => {
              const isActive = stage.id === activeId
              const isDone = i < activeIndex
              return (
                <li key={stage.id} className="shrink-0 lg:shrink">
                  <button
                    onClick={() => setActiveId(stage.id)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition-colors',
                      isActive
                        ? 'border-border-strong bg-surface-2'
                        : 'border-border bg-transparent hover:bg-surface-2/50',
                    )}
                  >
                    <span
                      className={cn(
                        'flex size-7 shrink-0 items-center justify-center rounded-lg text-sm font-semibold ring-1',
                        isActive || isDone
                          ? toneRing[stage.tone]
                          : 'bg-surface-3 text-faint ring-border',
                      )}
                    >
                      {stage.number}
                    </span>
                    <span>
                      <span
                        className={cn(
                          'block text-sm font-medium',
                          isActive ? 'text-fg' : 'text-muted',
                        )}
                      >
                        {stage.title}
                      </span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ol>
        </nav>

        {/* Detail */}
        <div>
          <AnimatePresence mode="wait">
            <StageDetail stage={active} />
          </AnimatePresence>

          {/* Pager */}
          <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
            <button
              disabled={activeIndex === 0}
              onClick={() => setActiveId(stages[activeIndex - 1].id)}
              className="text-sm text-muted enabled:hover:text-fg disabled:opacity-30"
            >
              ← {activeIndex > 0 ? stages[activeIndex - 1].title : ''}
            </button>
            {activeIndex < stages.length - 1 ? (
              <button
                onClick={() => setActiveId(stages[activeIndex + 1].id)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-surface-2 px-4 py-2 text-sm font-medium text-fg hover:bg-surface-3"
              >
                Next: {stages[activeIndex + 1].title} <ArrowRight className="size-4" />
              </button>
            ) : (
              <Link
                to="/patterns"
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-ink"
              >
                Explore the patterns <ArrowRight className="size-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
