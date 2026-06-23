import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="font-display text-lg font-semibold text-fg">
              Vibe the <span className="text-primary-soft">Architecture</span>
            </div>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
              An interactive companion for juniors who suddenly own architecture decisions.
              Inspired by Hossam Okasha's note: just like you vibe the code, you can vibe the
              architecture — as long as you walk the stages in order.
            </p>
          </div>

          <div>
            <div className="mb-3 font-mono text-xs uppercase tracking-widest text-faint">
              Walkthrough
            </div>
            <ul className="space-y-2 text-sm text-muted">
              <li>
                <Link to="/method" className="hover:text-fg">
                  The 4-stage method
                </Link>
              </li>
              <li>
                <Link to="/patterns" className="hover:text-fg">
                  Architecture patterns
                </Link>
              </li>
              <li>
                <Link to="/decide" className="hover:text-fg">
                  Decision helper
                </Link>
              </li>
              <li>
                <Link to="/examples" className="hover:text-fg">
                  MERN examples
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="mb-3 font-mono text-xs uppercase tracking-widest text-faint">
              References
            </div>
            <ul className="space-y-2 text-sm text-muted">
              <li>
                <a
                  href="https://github.com/alan2207/bulletproof-react"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-fg"
                >
                  bulletproof-react ↗
                </a>
              </li>
              <li>
                <a
                  href="https://adr.github.io/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-fg"
                >
                  ADR (decision records) ↗
                </a>
              </li>
              <li>
                <a
                  href="https://martinfowler.com/architecture/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-fg"
                >
                  Fowler on architecture ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
          <span>Built with React + Vite + TypeScript + Tailwind. A learning project.</span>
          <span>أعانك الله يا صديقي 🌹</span>
        </div>
      </div>
    </footer>
  )
}
