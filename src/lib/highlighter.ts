import { createHighlighterCore, type HighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'

/**
 * A single shared Shiki highlighter, created lazily on first use.
 *
 * We use the fine-grained `shiki/core` build with the JavaScript regex engine
 * (no Oniguruma WASM) and import only the grammars/theme we actually render.
 * This keeps the bundle small instead of pulling in Shiki's full language set.
 * Plain "text" needs no grammar — Shiki handles it as a built-in no-op.
 */
let instance: Promise<HighlighterCore> | null = null

export const SHIKI_THEME = 'vitesse-dark'

export function getHighlighter(): Promise<HighlighterCore> {
  if (!instance) {
    instance = createHighlighterCore({
      themes: [import('shiki/themes/vitesse-dark.mjs')],
      langs: [
        import('shiki/langs/typescript.mjs'),
        import('shiki/langs/tsx.mjs'),
        import('shiki/langs/javascript.mjs'),
        import('shiki/langs/json.mjs'),
        import('shiki/langs/bash.mjs'),
      ],
      engine: createJavaScriptRegexEngine(),
    })
  }
  return instance
}
