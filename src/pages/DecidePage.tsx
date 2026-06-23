import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowLeft, Check, Compass, RotateCcw, ShieldAlert, Sparkles } from 'lucide-react'
import { Badge, Card } from '@/components/ui/primitives'
import { questions, recommend } from '@/data/decision'
import { cn } from '@/lib/cn'

function Result({
  answers,
  onRestart,
}: {
  answers: Record<string, string>
  onRestart: () => void
}) {
  const rec = recommend(answers)
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Badge tone="emerald">
        <Sparkles className="size-3.5" /> Your recommendation
      </Badge>
      <h2 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">{rec.headline}</h2>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Card className="border-primary/25">
          <div className="font-mono text-xs uppercase tracking-widest text-faint">System shape</div>
          <div className="mt-1 font-display text-xl font-semibold text-primary-soft">
            {rec.systemLabel}
          </div>
        </Card>
        <Card className="border-cyan/25">
          <div className="font-mono text-xs uppercase tracking-widest text-faint">
            Code organization
          </div>
          <div className="mt-1 font-display text-lg font-semibold text-cyan">{rec.codeLabel}</div>
        </Card>
      </div>

      <div className="mt-6">
        <div className="mb-2 text-sm font-semibold text-emerald">Why</div>
        <ul className="space-y-2">
          {rec.reasons.map((r) => (
            <li key={r} className="flex gap-2.5 text-sm text-muted">
              <Check className="mt-0.5 size-4 shrink-0 text-emerald" /> {r}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-amber">
          <ShieldAlert className="size-4" /> Watch out for
        </div>
        <ul className="space-y-2">
          {rec.cautions.map((c) => (
            <li
              key={c}
              className="rounded-lg border border-amber/20 bg-amber/[0.05] px-3.5 py-2.5 text-sm text-muted"
            >
              {c}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Link
          to="/patterns"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-medium text-ink"
        >
          See these patterns in depth
        </Link>
        <button
          onClick={onRestart}
          className="inline-flex items-center gap-2 rounded-xl border border-border-strong px-5 py-3 font-medium text-fg hover:bg-surface-2"
        >
          <RotateCcw className="size-4" /> Start over
        </button>
      </div>

      <p className="mt-6 text-xs text-faint">
        This is a starting point, not gospel — a recommender that encodes sensible defaults. The
        point is to make the trade-offs visible, then decide on purpose.
      </p>
    </motion.div>
  )
}

export function DecidePage() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const done = step >= questions.length
  const q = questions[step]

  const choose = (value: string) => {
    setAnswers((prev) => ({ ...prev, [q.id]: value }))
    setStep((s) => s + 1)
  }

  const restart = () => {
    setAnswers({})
    setStep(0)
  }

  const progress = Math.round((step / questions.length) * 100)

  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <header className="max-w-2xl">
        <div className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-cyan">
          <Compass className="size-4" /> Decision helper
        </div>
        <h1 className="text-4xl font-semibold sm:text-5xl">Help me choose an architecture</h1>
        <p className="mt-4 text-lg text-muted">
          Six quick questions. We weigh your answers the way a level-headed senior would — biased
          toward the simplest option that fits.
        </p>
      </header>

      {/* Progress */}
      {!done && (
        <div className="mt-10">
          <div className="mb-2 flex items-center justify-between text-xs text-faint">
            <span>
              Question {step + 1} of {questions.length}
            </span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-surface-3">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary to-cyan"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>
      )}

      <div className="mt-8">
        <AnimatePresence mode="wait">
          {done ? (
            <Result key="result" answers={answers} onRestart={restart} />
          ) : (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="font-display text-2xl font-semibold">{q.question}</h2>
              <p className="mt-2 text-sm text-muted">{q.help}</p>

              <div className="mt-6 space-y-3">
                {q.choices.map((c) => {
                  const selected = answers[q.id] === c.value
                  return (
                    <button
                      key={c.value}
                      onClick={() => choose(c.value)}
                      className={cn(
                        'group flex w-full items-center justify-between gap-4 rounded-xl border px-5 py-4 text-left transition-all',
                        selected
                          ? 'border-primary/50 bg-primary/10'
                          : 'border-border bg-surface/60 hover:border-border-strong hover:bg-surface-2',
                      )}
                    >
                      <span className="text-[15px] font-medium text-fg">{c.label}</span>
                      <span
                        className={cn(
                          'flex size-6 shrink-0 items-center justify-center rounded-full border transition-colors',
                          selected
                            ? 'border-primary bg-primary text-ink'
                            : 'border-border-strong text-transparent group-hover:border-faint',
                        )}
                      >
                        <Check className="size-3.5" />
                      </span>
                    </button>
                  )
                })}
              </div>

              {step > 0 && (
                <button
                  onClick={() => setStep((s) => s - 1)}
                  className="mt-6 inline-flex items-center gap-1.5 text-sm text-faint hover:text-fg"
                >
                  <ArrowLeft className="size-4" /> Back
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
