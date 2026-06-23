import { useState, type ReactNode } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/cn'

export type Tab = {
  id: string
  label: string
  content: ReactNode
}

/** Accessible, animated tab switcher with a sliding active indicator. */
export function Tabs({ tabs, className }: { tabs: Tab[]; className?: string }) {
  const [active, setActive] = useState(tabs[0]?.id)
  const current = tabs.find((t) => t.id === active) ?? tabs[0]

  return (
    <div className={className}>
      <div
        role="tablist"
        className="flex flex-wrap gap-1 rounded-xl border border-border bg-surface-2/60 p-1"
      >
        {tabs.map((tab) => {
          const isActive = tab.id === active
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(tab.id)}
              className={cn(
                'relative rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors',
                isActive ? 'text-fg' : 'text-faint hover:text-muted',
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="tab-pill"
                  className="absolute inset-0 rounded-lg bg-surface-3 ring-1 ring-border-strong"
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          )
        })}
      </div>
      <motion.div
        key={current?.id}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="mt-4"
      >
        {current?.content}
      </motion.div>
    </div>
  )
}
