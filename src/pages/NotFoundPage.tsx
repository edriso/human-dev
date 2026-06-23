import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-5 py-32 text-center">
      <div className="font-display text-7xl font-bold text-gradient">404</div>
      <h1 className="mt-4 text-2xl font-semibold">This route has no contract</h1>
      <p className="mt-3 text-muted">
        The page you’re after doesn’t exist — an undefined boundary. Let’s get you back to a
        documented one.
      </p>
      <Link
        to="/"
        className="mt-8 rounded-xl bg-primary px-5 py-3 font-medium text-ink transition-transform hover:scale-[1.02]"
      >
        Back home
      </Link>
    </div>
  )
}
