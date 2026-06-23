import { useState } from 'react'
import { motion } from 'motion/react'
import { Lightbulb } from 'lucide-react'
import { Badge } from '@/components/ui/primitives'
import { CodeBlock } from '@/components/ui/CodeBlock'
import { examples, exampleGroups, type ExampleGroup } from '@/data/examples'
import { cn } from '@/lib/cn'

export function ExamplesPage() {
  const [group, setGroup] = useState<ExampleGroup>('contracts')
  const active = exampleGroups.find((g) => g.id === group)!
  const visible = examples.filter((e) => e.group === group)

  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
      <header className="max-w-2xl">
        <div className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-primary-soft">
          MERN examples
        </div>
        <h1 className="text-4xl font-semibold sm:text-5xl">The ideas, in real code</h1>
        <p className="mt-4 text-lg text-muted">
          Copy-pasteable TypeScript that puts the architecture into practice — shared contracts,
          thin controllers, server state in TanStack Query, and sane MongoDB modeling.
        </p>
      </header>

      {/* Group tabs */}
      <div className="mt-8 flex flex-wrap gap-1 rounded-xl border border-border bg-surface-2/60 p-1">
        {exampleGroups.map((g) => (
          <button
            key={g.id}
            onClick={() => setGroup(g.id)}
            className={cn(
              'rounded-lg px-3.5 py-2 text-sm font-medium transition-colors',
              group === g.id
                ? 'bg-surface-3 text-fg ring-1 ring-border-strong'
                : 'text-faint hover:text-muted',
            )}
          >
            {g.label}
          </button>
        ))}
      </div>

      <p className="mt-4 text-muted">{active.blurb}</p>

      <motion.div
        key={group}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-8 space-y-12"
      >
        {visible.map((ex) => (
          <article key={ex.id}>
            <div className="flex items-center gap-3">
              <Badge tone="primary">{active.label}</Badge>
            </div>
            <h2 className="mt-3 font-display text-2xl font-semibold">{ex.title}</h2>
            <p className="mt-2 max-w-2xl leading-relaxed text-muted">{ex.summary}</p>
            <div className="mt-4">
              <CodeBlock code={ex.code} lang={ex.lang} title={ex.filename} />
            </div>
            {ex.takeaway && (
              <div className="mt-3 flex gap-2.5 rounded-xl border border-amber/25 bg-amber/[0.05] px-4 py-3">
                <Lightbulb className="mt-0.5 size-4 shrink-0 text-amber" />
                <p className="text-sm leading-relaxed text-muted">{ex.takeaway}</p>
              </div>
            )}
          </article>
        ))}
      </motion.div>
    </div>
  )
}
