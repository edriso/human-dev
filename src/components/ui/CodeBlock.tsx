import { useEffect, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { getHighlighter, SHIKI_THEME } from '@/lib/highlighter'
import { cn } from '@/lib/cn'

type CodeBlockProps = {
  code: string
  lang?: string
  /** Optional filename / label shown in the window chrome. */
  title?: string
  className?: string
}

/**
 * Syntax-highlighted code window. Highlighting happens off the critical path:
 * we show plain text first, then swap in the Shiki-rendered HTML once ready.
 */
export function CodeBlock({ code, lang = 'tsx', title, className }: CodeBlockProps) {
  const [html, setHtml] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const trimmed = code.replace(/\n$/, '')

  useEffect(() => {
    let active = true
    getHighlighter()
      .then((hl) => {
        if (!active) return
        setHtml(hl.codeToHtml(trimmed, { lang, theme: SHIKI_THEME }))
      })
      .catch(() => setHtml(null))
    return () => {
      active = false
    }
  }, [trimmed, lang])

  const copy = () => {
    navigator.clipboard.writeText(trimmed).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    })
  }

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl border border-border bg-[#121218] text-[13px] leading-relaxed shadow-lg shadow-black/30',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-border/70 bg-surface-2/60 px-4 py-2">
        <div className="flex min-w-0 items-center gap-1.5">
          <span className="size-2.5 shrink-0 rounded-full bg-rose/70" />
          <span className="size-2.5 shrink-0 rounded-full bg-amber/70" />
          <span className="size-2.5 shrink-0 rounded-full bg-emerald/70" />
          {title && (
            <span className="ml-3 truncate font-mono text-xs text-muted">{title}</span>
          )}
        </div>
        <button
          onClick={copy}
          className="flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-xs text-faint transition-colors hover:bg-surface-3 hover:text-fg"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check className="size-3.5 text-emerald" /> Copied
            </>
          ) : (
            <>
              <Copy className="size-3.5" /> Copy
            </>
          )}
        </button>
      </div>
      <div className="max-h-[28rem] overflow-auto">
        {html ? (
          <div
            className="shiki-host [&_pre]:!m-0 [&_pre]:!bg-transparent [&_pre]:p-4 [&_code]:font-mono"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <pre className="m-0 p-4 font-mono text-fg/80">
            <code>{trimmed}</code>
          </pre>
        )}
      </div>
    </div>
  )
}
