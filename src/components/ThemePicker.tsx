import { useEffect, useState } from 'react'

import {
  DEFAULT_MAIN,
  PRESETS,
  suggestShades,
  themeCss,
} from '../lib/theme'

const STYLE_ID = 'theme-tune'
const KEY_HEX = 'tuneHex'
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
  const [hex, setHex] = useState(() => readStored(KEY_HEX) ?? DEFAULT_MAIN)
  const [copied, setCopied] = useState(false)

  // Re-derive + inject the override CSS whenever the anchor hex changes.
  useEffect(() => {
    if (!enabled) return
    const css = themeCss(hex)
    applyCss(css)
    try {
      localStorage.setItem(KEY_HEX, hex)
      localStorage.setItem(KEY_CSS, css)
    } catch {
      // ignore storage failures
    }
  }, [enabled, hex])

  if (!enabled) return null

  const reset = () => {
    setHex(DEFAULT_MAIN)
    try {
      localStorage.removeItem(KEY_HEX)
      localStorage.removeItem(KEY_CSS)
    } catch {
      // ignore
    }
  }

  const copy = async () => {
    const text = `Anchor: ${hex}`
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard blocked — values are still shown on screen
    }
  }

  // Lightness variants around the current anchor.
  const shades = suggestShades(hex)

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

      <Swatch label="Anchor" value={hex} onChange={setHex} />

      {/* Curated monochromatic starting points. */}
      <p className="mb-1.5 mt-3 text-[11px] font-medium text-muted">Palettes</p>
      <div className="flex flex-wrap gap-1.5">
        {PRESETS.map((p) => (
          <button
            key={p.name}
            type="button"
            title={p.name}
            onClick={() => setHex(p.hex)}
            aria-label={`Use ${p.name} palette`}
            className="flex h-6 w-10 overflow-hidden rounded-full ring-1 ring-ink/15 transition hover:ring-ink/40"
          >
            <span className="h-full w-full" style={{ background: p.hex }} />
          </button>
        ))}
      </div>

      {/* Lightness variants of the current anchor hue. */}
      <p className="mb-1.5 mt-3 text-[11px] font-medium text-muted">
        Suggested shades
      </p>
      <div className="flex flex-wrap gap-1.5">
        {shades.map((c) => (
          <button
            key={c.hex}
            type="button"
            title={`${c.name} — ${c.hex}`}
            onClick={() => setHex(c.hex)}
            aria-label={`Use ${c.name} shade ${c.hex}`}
            className={`h-6 w-6 rounded-full ring-1 transition hover:scale-110 ${
              hex.toLowerCase() === c.hex.toLowerCase()
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
          {copied ? 'Copied!' : 'Copy hex'}
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
        Sets the anchor hue for the mono palette. Affects light &amp; dark mode.
      </p>
    </div>
  )
}

const HEX_RE = /^#[0-9a-fA-F]{6}$/

function normalizeHex(input: string): string | null {
  let v = input.trim()
  if (v && !v.startsWith('#')) v = `#${v}`
  // Expand shorthand #abc → #aabbcc.
  if (/^#[0-9a-fA-F]{3}$/.test(v)) {
    v = `#${v[1]}${v[1]}${v[2]}${v[2]}${v[3]}${v[3]}`
  }
  return HEX_RE.test(v) ? v.toLowerCase() : null
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
  // Local text state lets the owner type freely; we only commit a valid hex.
  const [text, setText] = useState(value)
  // Keep the field in sync when the value changes elsewhere (presets, picker…)
  // by adjusting state during render rather than in an effect.
  const [prevValue, setPrevValue] = useState(value)
  if (value !== prevValue) {
    setPrevValue(value)
    setText(value)
  }

  const commit = (raw: string) => {
    const hex = normalizeHex(raw)
    if (hex) onChange(hex)
    else setText(value) // revert invalid input to the last good value
  }

  const valid = normalizeHex(text) !== null

  return (
    <label className="mb-2 flex items-center justify-between gap-3">
      <span className="text-xs text-muted">{label}</span>
      <span className="flex items-center gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            const hex = normalizeHex(e.target.value)
            if (hex) onChange(hex)
          }}
          onBlur={(e) => commit(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commit((e.target as HTMLInputElement).value)
          }}
          spellCheck={false}
          aria-label={`${label} hex value`}
          className={`w-20 rounded border bg-base px-1.5 py-1 font-mono text-[11px] uppercase text-ink/80 ${
            valid ? 'border-ink/15' : 'border-red-400'
          }`}
        />
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
