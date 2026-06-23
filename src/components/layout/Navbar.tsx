import { useEffect, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/cn'

const links = [
  { to: '/method', label: 'The Method' },
  { to: '/patterns', label: 'Patterns' },
  { to: '/decide', label: 'Decision Helper' },
  { to: '/examples', label: 'MERN Examples' },
]

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 font-display text-fg">
      <svg viewBox="0 0 64 64" className="size-7" aria-hidden>
        <g fill="none" strokeWidth="3.4" strokeLinejoin="round" strokeLinecap="round">
          <path d="M32 10 54 22 32 34 10 22 32 10Z" stroke="#8b7cff" />
          <path d="M10 32 32 44 54 32" stroke="#5cc8e6" />
          <path d="M10 42 32 54 54 42" stroke="#ffb84d" />
        </g>
      </svg>
      <span className="text-[15px] font-semibold tracking-tight">
        Vibe the <span className="text-primary-soft">Architecture</span>
      </span>
    </Link>
  )
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-colors duration-300',
        scrolled ? 'glass border-b border-border' : 'border-b border-transparent',
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Logo />

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                cn(
                  'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive ? 'text-fg' : 'text-faint hover:text-fg',
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
          <a
            href="https://github.com/alan2207/bulletproof-react"
            target="_blank"
            rel="noreferrer"
            className="ml-2 rounded-lg border border-border-strong px-3.5 py-2 text-sm font-medium text-fg transition-colors hover:bg-surface-2"
          >
            Further reading ↗
          </a>
        </div>

        <button
          className="rounded-lg p-2 text-muted md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {open && (
        <div className="glass border-t border-border md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col px-5 py-2">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'rounded-lg px-3 py-3 text-sm font-medium',
                    isActive ? 'bg-surface-2 text-fg' : 'text-muted',
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
