// Derive the full semantic-token palette from two anchor colors:
//   main   — the sage neutral hue (drives base/surface/tint/ink/muted)
//   accent — the blush pastel accent (drives aqua / aqua-deep / aqua-ink)
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

/** Produce a hex from a base hue, overriding any of saturation/lightness. */
function shade(base: HSL, s: number, l: number): string {
  return hslToHex({ h: base.h, s: clamp(s, 0, 100), l: clamp(l, 0, 100) })
}

export type ThemeVars = Record<string, string>

export interface DerivedTheme {
  light: ThemeVars
  dark: ThemeVars
}

export function deriveTheme(mainHex: string, accentHex: string): DerivedTheme {
  const m = hexToHsl(mainHex)
  const a = hexToHsl(accentHex)

  return {
    light: {
      'color-base': shade(m, Math.min(m.s, 30), 92),
      'color-surface': shade(m, Math.min(m.s, 26), 96),
      'color-tint': mainHex,
      'color-tint-soft': shade(m, m.s * 0.9, 85),
      'color-tint-card': shade(m, m.s, Math.max(0, m.l - 12)),
      'color-ink': shade(m, Math.min(m.s + 8, 30), 16),
      'color-muted': shade(m, 14, 38),
      'color-aqua': accentHex,
      'color-aqua-deep': shade(a, a.s * 0.6, 40),
      'color-aqua-ink': shade(a, a.s * 0.55, 42),
    },
    dark: {
      'color-base': shade(m, 22, 7),
      'color-surface': shade(m, 20, 11),
      'color-tint': shade(m, 22, 9),
      'color-tint-soft': shade(m, 20, 13),
      'color-tint-card': shade(m, 18, 21),
      'color-ink': shade(m, 14, 92),
      'color-muted': shade(m, 12, 70),
      'color-aqua': accentHex,
      'color-aqua-deep': shade(a, a.s * 0.7, 66),
      'color-aqua-ink': shade(a, a.s * 0.8, 82),
    },
  }
}

const toBlock = (selector: string, vars: ThemeVars) =>
  `${selector}{${Object.entries(vars)
    .map(([k, v]) => `--${k}:${v};`)
    .join('')}}`

/** CSS that overrides the default tokens for both light and dark mode. */
export function themeCss(mainHex: string, accentHex: string): string {
  const { light, dark } = deriveTheme(mainHex, accentHex)
  return `${toBlock(':root', light)}\n${toBlock('.dark', dark)}`
}

export const DEFAULT_MAIN = '#9ebfae'
export const DEFAULT_ACCENT = '#edbcc7'

export interface AccentSuggestion {
  name: string
  hex: string
}

// Rotate a hue, but skip the muddy yellow / yellow-green band (per the
// "no yellow" rule) by snapping it to a universally-soft rose.
function harmonyHue(baseHue: number, offset: number): number {
  let h = (baseHue + offset + 360) % 360
  if (h >= 40 && h <= 95) h = 345
  return h
}

// Dynamically suggest harmonious pastel accents for a chosen main colour using
// classic colour-wheel formulas, so a non-designer gets flattering options
// without knowing any colour theory. Every result is forced to a soft pastel
// (fixed lightness, capped saturation) so it always reads gently.
export function suggestAccents(mainHex: string): AccentSuggestion[] {
  const m = hexToHsl(mainHex)
  const s = clamp(Math.max(m.s, 30) + 25, 45, 62)
  const pastel = (offset: number) =>
    hslToHex({ h: harmonyHue(m.h, offset), s, l: 83 })

  const raw: AccentSuggestion[] = [
    { name: 'Complementary', hex: pastel(180) },
    { name: 'Soft contrast', hex: pastel(160) },
    { name: 'Warm contrast', hex: pastel(205) },
    { name: 'Triadic', hex: pastel(120) },
  ]

  // Drop any near-duplicates the yellow-snap may have produced.
  const seen = new Set<string>()
  return raw.filter((c) => (seen.has(c.hex) ? false : (seen.add(c.hex), true)))
}

/** The single best (complementary) accent for a main colour. */
export function suggestAccent(mainHex: string): string {
  return suggestAccents(mainHex)[0].hex
}

export interface Preset {
  name: string
  main: string
  accent: string
}

// Hand-picked, harmony-checked combinations so a non-designer can pick a
// guaranteed-good look in one click. All soft & cool — no yellow, no harsh teal.
export const PRESETS: Preset[] = [
  { name: 'Sage & Blush', main: DEFAULT_MAIN, accent: DEFAULT_ACCENT },
  { name: 'Sky & Rose', main: '#a9c3d6', accent: '#e8b4c1' },
  { name: 'Lilac & Sage', main: '#c0b6d4', accent: '#b3d0bf' },
  { name: 'Eucalyptus & Plum', main: '#9fc0b3', accent: '#d8a7c4' },
  { name: 'Slate & Petal', main: '#aebac4', accent: '#e6b3c4' },
]
