import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Tone = 'primary' | 'amber' | 'emerald' | 'rose' | 'cyan' | 'neutral'

const toneText: Record<Tone, string> = {
  primary: 'text-primary-soft',
  amber: 'text-amber',
  emerald: 'text-emerald',
  rose: 'text-rose',
  cyan: 'text-cyan',
  neutral: 'text-muted',
}

const toneBg: Record<Tone, string> = {
  primary: 'bg-primary/12 text-primary-soft ring-primary/25',
  amber: 'bg-amber/12 text-amber ring-amber/25',
  emerald: 'bg-emerald/12 text-emerald ring-emerald/25',
  rose: 'bg-rose/12 text-rose ring-rose/25',
  cyan: 'bg-cyan/12 text-cyan ring-cyan/25',
  neutral: 'bg-surface-3 text-muted ring-border',
}

export function Badge({
  children,
  tone = 'neutral',
  className,
}: {
  children: ReactNode
  tone?: Tone
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset',
        toneBg[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

export function Card({
  children,
  className,
  hover = false,
}: {
  children: ReactNode
  className?: string
  hover?: boolean
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border bg-surface/70 p-6 backdrop-blur-sm',
        hover && 'card-hover',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  tone = 'primary',
  className,
}: {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  tone?: Tone
  className?: string
}) {
  return (
    <div className={cn('max-w-2xl', className)}>
      {eyebrow && (
        <div className={cn('mb-3 font-mono text-xs uppercase tracking-[0.2em]', toneText[tone])}>
          {eyebrow}
        </div>
      )}
      <h2 className="text-3xl font-semibold text-fg sm:text-4xl">{title}</h2>
      {description && <p className="mt-4 text-lg leading-relaxed text-muted">{description}</p>}
    </div>
  )
}

type CalloutKind = 'tip' | 'warn' | 'danger' | 'quote'

const calloutStyle: Record<CalloutKind, string> = {
  tip: 'border-emerald/30 bg-emerald/[0.06]',
  warn: 'border-amber/30 bg-amber/[0.06]',
  danger: 'border-rose/30 bg-rose/[0.06]',
  quote: 'border-primary/30 bg-primary/[0.06]',
}

export function Callout({
  kind = 'tip',
  title,
  children,
  icon,
  className,
}: {
  kind?: CalloutKind
  title?: ReactNode
  children: ReactNode
  icon?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('rounded-xl border p-5', calloutStyle[kind], className)}>
      {title && (
        <div className="mb-1.5 flex items-center gap-2 font-display font-semibold text-fg">
          {icon}
          {title}
        </div>
      )}
      <div className="text-[15px] leading-relaxed text-muted">{children}</div>
    </div>
  )
}
