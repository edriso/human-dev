import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'

// Route-level code splitting: each page (and its heavier deps like the syntax
// highlighter) loads only when that route is visited.
const HomePage = lazy(() => import('@/pages/HomePage').then((m) => ({ default: m.HomePage })))
const MethodPage = lazy(() => import('@/pages/MethodPage').then((m) => ({ default: m.MethodPage })))
const PatternsPage = lazy(() =>
  import('@/pages/PatternsPage').then((m) => ({ default: m.PatternsPage })),
)
const DecidePage = lazy(() => import('@/pages/DecidePage').then((m) => ({ default: m.DecidePage })))
const ExamplesPage = lazy(() =>
  import('@/pages/ExamplesPage').then((m) => ({ default: m.ExamplesPage })),
)
const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
)

function RouteFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="size-7 animate-spin rounded-full border-2 border-border border-t-primary" />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route
            index
            element={
              <Suspense fallback={<RouteFallback />}>
                <HomePage />
              </Suspense>
            }
          />
          <Route
            path="/method"
            element={
              <Suspense fallback={<RouteFallback />}>
                <MethodPage />
              </Suspense>
            }
          />
          <Route
            path="/patterns"
            element={
              <Suspense fallback={<RouteFallback />}>
                <PatternsPage />
              </Suspense>
            }
          />
          <Route
            path="/decide"
            element={
              <Suspense fallback={<RouteFallback />}>
                <DecidePage />
              </Suspense>
            }
          />
          <Route
            path="/examples"
            element={
              <Suspense fallback={<RouteFallback />}>
                <ExamplesPage />
              </Suspense>
            }
          />
          <Route
            path="*"
            element={
              <Suspense fallback={<RouteFallback />}>
                <NotFoundPage />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
