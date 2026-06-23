import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Check,
  DoorClosed,
  DoorOpen,
  Lightbulb,
  Minus,
  Plus,
  X,
} from 'lucide-react'
import { Badge, Card, Callout } from '@/components/ui/primitives'
import { CodeBlock } from '@/components/ui/CodeBlock'
import {
  patterns,
  categoryMeta,
  type Pattern,
  type PatternCategory,
} from '@/data/patterns'
import { oneWayDoors, twoWayDoors, bezosPrinciples } from '@/data/doors'
import { cn } from '@/lib/cn'

const toneText: Record<Pattern['tone'], string> = {
  primary: 'text-primary-soft',
  cyan: 'text-cyan',
  amber: 'text-amber',
  emerald: 'text-emerald',
  rose: 'text-rose',
}

const toneDot: Record<Pattern['tone'], string> = {
  primary: 'bg-primary',
  cyan: 'bg-cyan',
  amber: 'bg-amber',
  emerald: 'bg-emerald',
  rose: 'bg-rose',
}

function Complexity({ value, tone }: { value: number; tone: Pattern['tone'] }) {
  return (
    <div className="flex items-center gap-1.5" title={`Complexity ${value}/5`}>
      <span className="font-mono text-[11px] uppercase tracking-wider text-faint">complexity</span>
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={cn(
              'h-1.5 w-3 rounded-full',
              i < value ? toneDot[tone] : 'bg-surface-3',
            )}
          />
        ))}
      </div>
    </div>
  )
}

function PatternCard({ pattern, onOpen }: { pattern: Pattern; onOpen: () => void }) {
  return (
    <button onClick={onOpen} className="text-left">
      <Card hover className="flex h-full flex-col">
        <div className="flex items-start justify-between gap-3">
          <h3 className={cn('font-display text-lg font-semibold', toneText[pattern.tone])}>
            {pattern.name}
          </h3>
          <Badge tone="neutral">{categoryMeta[pattern.category].label}</Badge>
        </div>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{pattern.tagline}</p>
        <div className="mt-5 flex items-center justify-between">
          <Complexity value={pattern.complexity} tone={pattern.tone} />
          <span className="inline-flex items-center gap-1 text-xs font-medium text-faint">
            Details <Plus className="size-3.5" />
          </span>
        </div>
      </Card>
    </button>
  )
}

function ProsCons({ pros, cons }: { pros: string[]; cons: string[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-xl border border-emerald/25 bg-emerald/[0.05] p-4">
        <div className="mb-2 text-sm font-semibold text-emerald">Strengths</div>
        <ul className="space-y-2">
          {pros.map((p) => (
            <li key={p} className="flex gap-2 text-sm text-muted">
              <Check className="mt-0.5 size-4 shrink-0 text-emerald" /> {p}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl border border-rose/25 bg-rose/[0.05] p-4">
        <div className="mb-2 text-sm font-semibold text-rose">Costs</div>
        <ul className="space-y-2">
          {cons.map((c) => (
            <li key={c} className="flex gap-2 text-sm text-muted">
              <Minus className="mt-0.5 size-4 shrink-0 text-rose" /> {c}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function PatternModal({ pattern, onClose }: { pattern: Pattern; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-ink/70 p-4 backdrop-blur-sm sm:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-3xl rounded-2xl border border-border-strong bg-surface p-6 shadow-2xl sm:p-8"
        initial={{ opacity: 0, scale: 0.97, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 12 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-faint hover:bg-surface-3 hover:text-fg"
          aria-label="Close"
        >
          <X className="size-5" />
        </button>

        <Badge tone="neutral">{categoryMeta[pattern.category].label}</Badge>
        <h2 className={cn('mt-3 font-display text-3xl font-semibold', toneText[pattern.tone])}>
          {pattern.name}
        </h2>
        <p className="mt-1 text-muted">{pattern.tagline}</p>
        <div className="mt-4">
          <Complexity value={pattern.complexity} tone={pattern.tone} />
        </div>

        <p className="mt-6 leading-relaxed text-fg/90">{pattern.description}</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <div className="mb-2 text-sm font-semibold text-emerald">Choose it when</div>
            <ul className="space-y-1.5 text-sm text-muted">
              {pattern.whenToUse.map((w) => (
                <li key={w}>• {w}</li>
              ))}
            </ul>
          </div>
          <div>
            <div className="mb-2 text-sm font-semibold text-rose">Avoid it when</div>
            <ul className="space-y-1.5 text-sm text-muted">
              {pattern.whenToAvoid.map((w) => (
                <li key={w}>• {w}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6">
          <ProsCons pros={pattern.pros} cons={pattern.cons} />
        </div>

        <div className="mt-6">
          <div className="mb-2 text-sm font-semibold text-fg">MERN shape — {pattern.mern.label}</div>
          <CodeBlock code={pattern.mern.tree} lang="text" title="structure" />
        </div>

        <Callout
          kind="quote"
          className="mt-6"
          title="The verdict"
          icon={<Lightbulb className="size-4 text-primary-soft" />}
        >
          {pattern.verdict}
        </Callout>
      </motion.div>
    </motion.div>
  )
}

const filters: { id: PatternCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'system', label: 'System shape' },
  { id: 'code', label: 'Code organization' },
]

function DoorList({
  doors,
  kind,
}: {
  doors: typeof oneWayDoors
  kind: 'one' | 'two'
}) {
  const isOne = kind === 'one'
  return (
    <ul className="space-y-3">
      {doors.map((d) => (
        <li
          key={d.decision}
          className={cn(
            'rounded-xl border bg-surface/60 p-4',
            isOne ? 'border-rose/20' : 'border-emerald/20',
          )}
        >
          <div className="font-medium text-fg">{d.decision}</div>
          <p className="mt-1 text-sm text-muted">{d.why}</p>
          {d.reversibilityTip && (
            <p className="mt-2 text-sm text-cyan">
              <span className="font-medium">Make it more reversible:</span> {d.reversibilityTip}
            </p>
          )}
        </li>
      ))}
    </ul>
  )
}

export function PatternsPage() {
  const [filter, setFilter] = useState<PatternCategory | 'all'>('all')
  const [openId, setOpenId] = useState<string | null>(null)
  const visible = patterns.filter((p) => filter === 'all' || p.category === filter)
  const open = patterns.find((p) => p.id === openId) ?? null

  // Allow deep-linking to the doors section (#doors).
  useEffect(() => {
    if (window.location.hash === '#doors') {
      document.getElementById('doors')?.scrollIntoView()
    }
  }, [])

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <header className="max-w-2xl">
        <div className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-primary-soft">
          Patterns
        </div>
        <h1 className="text-4xl font-semibold sm:text-5xl">Know the options. Pick on purpose.</h1>
        <p className="mt-4 text-lg text-muted">
          Two separate questions, often confused. Click any pattern for trade-offs, a MERN folder
          shape, and a plain verdict on when it’s the right call.
        </p>
      </header>

      {/* Filter */}
      <div className="mt-8 inline-flex gap-1 rounded-xl border border-border bg-surface-2/60 p-1">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              'rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors',
              filter === f.id ? 'bg-surface-3 text-fg ring-1 ring-border-strong' : 'text-faint hover:text-muted',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filter !== 'all' && (
        <p className="mt-4 text-sm text-muted">{categoryMeta[filter].question}</p>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((p) => (
          <PatternCard key={p.id} pattern={p} onOpen={() => setOpenId(p.id)} />
        ))}
      </div>

      {/* One-way / two-way doors */}
      <section id="doors" className="mt-24 scroll-mt-24">
        <div className="max-w-2xl">
          <div className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-primary-soft">
            Reversibility
          </div>
          <h2 className="text-3xl font-semibold sm:text-4xl">One-way vs two-way doors</h2>
          <p className="mt-4 text-lg text-muted">
            Jeff Bezos’ framing: some decisions are nearly irreversible (decide slowly, write them
            down); most are cheaply reversible (decide fast, don’t agonise). The classic mistake is
            treating every decision like it’s irreversible.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Card className="border-rose/25">
            <div className="flex items-center gap-2 text-rose">
              <DoorClosed className="size-6" />
              <h3 className="text-xl font-semibold text-fg">One-way doors — decide slowly</h3>
            </div>
            <p className="mt-2 text-sm text-muted">
              Changing these later is a rewrite, not a refactor. Each deserves an ADR.
            </p>
            <div className="mt-4">
              <DoorList doors={oneWayDoors} kind="one" />
            </div>
          </Card>
          <Card className="border-emerald/25">
            <div className="flex items-center gap-2 text-emerald">
              <DoorOpen className="size-6" />
              <h3 className="text-xl font-semibold text-fg">Two-way doors — decide fast</h3>
            </div>
            <p className="mt-2 text-sm text-muted">
              Reversible in an afternoon. Pick a sensible default and keep moving.
            </p>
            <div className="mt-4">
              <DoorList doors={twoWayDoors} kind="two" />
            </div>
          </Card>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {bezosPrinciples.map((p) => (
            <Card key={p.title} className="bg-surface-2/40">
              <div className="font-display font-semibold text-amber">{p.title}</div>
              <p className="mt-2 text-sm leading-relaxed text-muted">{p.body}</p>
            </Card>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {open && <PatternModal pattern={open} onClose={() => setOpenId(null)} />}
      </AnimatePresence>
    </div>
  )
}
