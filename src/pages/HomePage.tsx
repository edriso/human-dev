import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  ArrowRight,
  Compass,
  DoorClosed,
  DoorOpen,
  Layers,
  Sparkles,
  Wrench,
} from 'lucide-react'
import { Badge, Card } from '@/components/ui/primitives'
import { stages } from '@/data/stages'

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-5 pb-16 pt-20 sm:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <Badge tone="primary">
            <Sparkles className="size-3.5" /> Architecture, for the AI-era junior
          </Badge>
          <h1 className="mt-6 text-balance font-display text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            Just like you vibe the code,
            <br />
            <span className="text-gradient">vibe the architecture.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted">
            AI handed juniors big responsibilities overnight — shipping whole projects without a
            senior. This is a calm, interactive walk through the few decisions that are hard to
            reverse, so you build with some rules instead of total randomness. With real MERN-stack
            examples throughout.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/method"
              className="group inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-medium text-ink transition-transform hover:scale-[1.02]"
            >
              Start the method
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/decide"
              className="inline-flex items-center gap-2 rounded-xl border border-border-strong px-5 py-3 font-medium text-fg transition-colors hover:bg-surface-2"
            >
              <Compass className="size-4 text-cyan" />
              Help me choose
            </Link>
          </div>
        </motion.div>

        {/* The original note, in its own voice. */}
        <motion.figure
          {...fadeUp}
          className="mt-14 max-w-2xl rounded-2xl border border-primary/25 bg-primary/[0.05] p-6"
        >
          <blockquote className="rtl text-[15px] leading-loose text-fg/90">
            صديقي الجونيور.. ممكن زي ما بتفايب الكود تفايب الأركتكشر؟ امشي على المراحل من فوق لتحت
            ومتعديش مرحلة إلا بعد ما تطلع الهدف بتاعها.
          </blockquote>
          <figcaption className="mt-3 text-sm text-faint">
            — Hossam Okasha, Senior Frontend Engineer · the note that inspired this guide
          </figcaption>
        </motion.figure>
      </div>
    </section>
  )
}

function StagesOverview() {
  const icons = [Compass, Layers, Wrench, Sparkles]
  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <motion.div {...fadeUp}>
        <div className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-primary-soft">
          The method
        </div>
        <h2 className="max-w-2xl text-3xl font-semibold sm:text-4xl">
          Four stages, top to bottom. Don’t skip ahead.
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          Each stage produces an artifact before you move on. Notice that writing code is the{' '}
          <span className="text-fg">last</span> thing you do — not the first.
        </p>
      </motion.div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stages.map((stage, i) => {
          const Icon = icons[i]
          return (
            <motion.div
              key={stage.id}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.06 }}
            >
              <Card hover className="h-full">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-faint">0{stage.number}</span>
                  <Icon className="size-5 text-primary-soft" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{stage.title}</h3>
                <p className="mt-1 font-mono text-xs text-faint">{stage.arabicTitle}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted">{stage.goal}</p>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <motion.div {...fadeUp} className="mt-6">
        <Link
          to="/method"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-soft hover:text-fg"
        >
          Walk through all four <ArrowRight className="size-4" />
        </Link>
      </motion.div>
    </section>
  )
}

function DoorsTeaser() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <div className="grid gap-6 md:grid-cols-2">
        <motion.div {...fadeUp}>
          <Card className="h-full border-rose/25">
            <DoorClosed className="size-7 text-rose" />
            <h3 className="mt-4 text-xl font-semibold">One-way doors</h3>
            <p className="mt-2 text-muted">
              Hard to reverse — the data model, multi-tenancy, auth, the public API shape. Decide
              these slowly and write them down. Changing them later means a rewrite, not a refactor.
            </p>
          </Card>
        </motion.div>
        <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.06 }}>
          <Card className="h-full border-emerald/25">
            <DoorOpen className="size-7 text-emerald" />
            <h3 className="mt-4 text-xl font-semibold">Two-way doors</h3>
            <p className="mt-2 text-muted">
              Cheaply reversible — your state library, UI kit, folder layout, most dependencies.
              Decide fast and move on. Over-thinking these is its own kind of mistake.
            </p>
          </Card>
        </motion.div>
      </div>
      <motion.div {...fadeUp} className="mt-6">
        <Link
          to="/patterns#doors"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-soft hover:text-fg"
        >
          See the full list and how to make a door more reversible{' '}
          <ArrowRight className="size-4" />
        </Link>
      </motion.div>
    </section>
  )
}

export function HomePage() {
  return (
    <>
      <Hero />
      <StagesOverview />
      <DoorsTeaser />
    </>
  )
}
