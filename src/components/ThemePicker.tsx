import { useEffect, useState } from 'react'

import {
  DEFAULT_ACCENT,
  DEFAULT_MAIN,
  PRESETS,
  suggestAccents,
  themeCss,
} from '../lib/theme'

const STYLE_ID = 'theme-tune'
const KEY_MAIN = 'tuneMain'
const KEY_ACCENT = 'tuneAccent'
const KEY_CSS = 'tuneCss'

// Only show the picker when the URL contains ?tune — keeps it hidden from
// ordinary visitors while letting the owner open it on the live site.
function isEnabled(): boolean {
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).has('tune')
}

function readStored(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function applyCss(css: string) {
  let el = document.getElementById(STYLE_ID) as HTMLStyleElement | null
  if (!el) {
    el = document.createElement('style')
    el.id = STYLE_ID
    document.head.appendChild(el)
  }
  el.textContent = css
}

export function ThemePicker() {
  const [enabled] = useState(isEnabled)
  const [open, setOpen] = useState(true)
  // Seed from any previously-tried colors so a reload keeps the experiment.
  const [main, setMain] = useState(() => readStored(KEY_MAIN) ?? DEFAULT_MAIN)
  const [accent, setAccent] = useState(() => readStored(KEY_ACCENT) ?? DEFAULT_ACCENT)
  const [copied, setCopied] = useState(false)

  // Re-derive + inject the override CSS whenever a color changes.
  useEffect(() => {
    if (!enabled) return
    const css = themeCss(main, accent)
    applyCss(css)
    try {
      localStorage.setItem(KEY_MAIN, main)
      localStorage.setItem(KEY_ACCENT, accent)
      localStorage.setItem(KEY_CSS, css)
    } catch {
      // ignore storage failures
    }
  }, [enabled, main, accent])

  if (!enabled) return null

  const reset = () => {
    setMain(DEFAULT_MAIN)
    setAccent(DEFAULT_ACCENT)
    try {
      localStorage.removeItem(KEY_MAIN)
      localStorage.removeItem(KEY_ACCENT)
      localStorage.removeItem(KEY_CSS)
    } catch {
      // ignore
    }
  }

  const copy = async () => {
    const text = `--color-tint (main): ${main}\n--color-aqua (accent): ${accent}`
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard blocked — values are still shown on screen
    }
  }

  const applyPreset = (m: string, a: string) => {
    setMain(m)
    setAccent(a)
  }

  // Formula-derived accent options for whatever main is currently chosen.
  const suggestions = suggestAccents(main)

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 left-4 z-50 rounded-full bg-surface px-4 py-2 text-sm font-medium text-ink shadow-lg ring-1 ring-ink/10"
      >
        Try colors
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 w-64 rounded-2xl bg-surface p-4 text-ink shadow-xl ring-1 ring-ink/10">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-semibold">Try colors</span>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Hide color picker"
          className="text-muted hover:text-ink"
        >
          ✕
        </button>
      </div>

      <Swatch label="Main" value={main} onChange={setMain} />
      <Swatch label="Accent" value={accent} onChange={setAccent} />

      {/* Curated full looks — foolproof starting points. */}
      <p className="mb-1.5 mt-3 text-[11px] font-medium text-muted">Palettes</p>
      <div className="flex flex-wrap gap-1.5">
        {PRESETS.map((p) => (
          <button
            key={p.name}
            type="button"
            title={p.name}
            onClick={() => applyPreset(p.main, p.accent)}
            aria-label={`Use ${p.name} palette`}
            className="flex h-6 w-10 overflow-hidden rounded-full ring-1 ring-ink/15 transition hover:ring-ink/40"
          >
            <span className="h-full w-1/2" style={{ background: p.main }} />
            <span className="h-full w-1/2" style={{ background: p.accent }} />
          </button>
        ))}
      </div>

      {/* Accents generated from the current main by colour-wheel formulas. */}
      <p className="mb-1.5 mt-3 text-[11px] font-medium text-muted">
        Suggested accents
      </p>
      <div className="flex flex-wrap gap-1.5">
        {suggestions.map((c) => (
          <button
            key={c.hex}
            type="button"
            title={`${c.name} — ${c.hex}`}
            onClick={() => setAccent(c.hex)}
            aria-label={`Use ${c.name} accent ${c.hex}`}
            className={`h-6 w-6 rounded-full ring-1 transition hover:scale-110 ${
              accent.toLowerCase() === c.hex.toLowerCase()
                ? 'ring-2 ring-ink/60'
                : 'ring-ink/15'
            }`}
            style={{ background: c.hex }}
          />
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={copy}
          className="flex-1 rounded-full bg-aqua px-3 py-2 text-xs font-semibold text-[#0b1417] transition hover:bg-aqua-deep hover:text-white"
        >
          {copied ? 'Copied!' : 'Copy values'}
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded-full px-3 py-2 text-xs font-medium text-muted ring-1 ring-ink/15 hover:text-ink"
        >
          Reset
        </button>
      </div>
      <p className="mt-2 text-[11px] leading-snug text-muted">
        Affects light &amp; dark mode. Use the sun/moon to preview both.
      </p>
    </div>
  )
}

function Swatch({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (hex: string) => void
}) {
  return (
    <label className="mb-2 flex items-center justify-between gap-3">
      <span className="text-xs text-muted">{label}</span>
      <span className="flex items-center gap-2">
        <span className="font-mono text-[11px] uppercase text-ink/70">{value}</span>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-7 w-9 cursor-pointer rounded border-0 bg-transparent p-0"
          aria-label={label}
        />
      </span>
    </label>
  )
}
