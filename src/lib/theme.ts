// Derive the full semantic-token palette from a single anchor hex, producing a
// Tailwind-style monochromatic palette. All tokens — base, tint, ink, aqua —
// come from the same hue family, varying only in lightness and saturation.
// Used by the owner-facing ThemePicker to preview new colors live, and as the
// single source of truth for what each anchor expands into.

export interface HSL {
  h: number // 0–360
  s: number // 0–100
  l: number // 0–100
}

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n))

export function hexToHsl(hex: string): HSL {
  const m = hex.replace('#', '')
  const r = parseInt(m.slice(0, 2), 16) / 255
  const g = parseInt(m.slice(2, 4), 16) / 255
  const b = parseInt(m.slice(4, 6), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const d = max - min
  const l = (max + min) / 2

  let h = 0
  let s = 0
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1))
    switch (max) {
      case r:
        h = ((g - b) / d) % 6
        break
      case g:
        h = (b - r) / d + 2
        break
      default:
        h = (r - g) / d + 4
    }
    h *= 60
    if (h < 0) h += 360
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) }
}

export function hslToHex({ h, s, l }: HSL): string {
  const sN = clamp(s, 0, 100) / 100
  const lN = clamp(l, 0, 100) / 100
  const c = (1 - Math.abs(2 * lN - 1)) * sN
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const mAdj = lN - c / 2

  let r: number, g: number, b: number
  if (h < 60) [r, g, b] = [c, x, 0]
  else if (h < 120) [r, g, b] = [x, c, 0]
  else if (h < 180) [r, g, b] = [0, c, x]
  else if (h < 240) [r, g, b] = [0, x, c]
  else if (h < 300) [r, g, b] = [x, 0, c]
  else [r, g, b] = [c, 0, x]

  const toHex = (v: number) =>
    Math.round((v + mAdj) * 255)
      .toString(16)
      .padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

/** Produce a hex from a base hue, overriding saturation and lightness. */
function shade(base: HSL, s: number, l: number): string {
  return hslToHex({ h: base.h, s: clamp(s, 0, 100), l: clamp(l, 0, 100) })
}

export type ThemeVars = Record<string, string>

export interface DerivedTheme {
  light: ThemeVars
  dark: ThemeVars
}

// Tailwind-style monochromatic token positions (lightness + saturation per token).
// All derived from a single hue — the "aqua" tokens use the same hue, just at
// different lightness/saturation positions.
const MONO_LIGHT: Record<string, [s: number, l: number]> = {
  'color-base':      [15, 97],
  'color-surface':   [10, 96],
  'color-tint-soft': [50, 90],
  'color-tint':      [60, 80],
  'color-tint-card': [75, 62],
  'color-aqua':      [35, 92],
  'color-aqua-deep': [65, 48],
  'color-aqua-ink':  [45, 28],
  'color-ink':       [20, 12],
  'color-muted':     [30, 38],
}

const MONO_DARK: Record<string, [s: number, l: number]> = {
  'color-base':      [20,  6],
  'color-surface':   [22, 16],
  'color-tint':      [20,  9],
  'color-tint-soft': [18, 18],
  'color-tint-card': [12, 22],
  'color-aqua':      [35, 92],   // light accent stays light on dark bg
  'color-aqua-deep': [55, 62],   // richer accent saturation
  'color-aqua-ink':  [55, 85],   // deeper tint for headings
  'color-ink':       [18, 92],   // slightly tinted white
  'color-muted':     [18, 68],   // tinted secondary
}

/** Derive a full Tailwind-style monochromatic palette from a single hex. */
export function deriveMonoTheme(hex: string): DerivedTheme {
  const h = hexToHsl(hex)

  const map = (specs: Record<string, [number, number]>): ThemeVars => {
    const vars: ThemeVars = {}
    for (const [k, [s, l]] of Object.entries(specs)) {
      vars[k] = shade(h, s, l)
    }
    return vars
  }

  return {
    light: map(MONO_LIGHT),
    dark: map(MONO_DARK),
  }
}

const toBlock = (selector: string, vars: ThemeVars) =>
  `${selector}{${Object.entries(vars)
    .map(([k, v]) => `--${k}:${v};`)
    .join('')}}`

/** CSS that overrides the default tokens for both light and dark mode. */
export function themeCss(hex: string): string {
  const { light, dark } = deriveMonoTheme(hex)
  return `${toBlock(':root', light)}\n${toBlock('.dark', dark)}`
}

export const DEFAULT_MAIN = '#cefff8'

export interface ShadeSuggestion {
  name: string
  hex: string
}

// Suggest lightness variations around the anchor — gives the owner interesting
// alternatives within the same hue family (mono palette).
export function suggestShades(hex: string): ShadeSuggestion[] {
  const h = hexToHsl(hex)
  return [
    { name: 'Lighter', hex: shade(h, clamp(h.s - 10, 20, 90), 88) },
    { name: 'Deeper',  hex: shade(h, clamp(h.s + 5, 20, 90), 64) },
    { name: 'Muted',   hex: shade(h, clamp(h.s - 25, 10, 80), 75) },
    { name: 'Vibrant', hex: shade(h, clamp(h.s + 15, 20, 95), 72) },
  ].filter((a, i, arr) => arr.findIndex((b) => b.hex === a.hex) === i)
}

export interface Preset {
  name: string
  hex: string
}

// Curated monochromatic starting points — each gives a complete Tailwind-style
// mono palette when run through deriveMonoTheme(). First entry is the default.
export const PRESETS: Preset[] = [
  { name: 'Ice',          hex: '#cefff8' },
  { name: 'Sky Blue',     hex: '#93e3fd' },
  { name: 'Teal',         hex: '#6cc3d0' },
  { name: 'Slate',        hex: '#94a8b8' },
  { name: 'Lavender',     hex: '#b8aed4' },
  { name: 'Rose',         hex: '#d4aeb8' },
]
