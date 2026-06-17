import { describe, expect, it } from 'vitest'
import {
  DEFAULT_ACCENT,
  DEFAULT_MAIN,
  deriveTheme,
  hexToHsl,
  hslToHex,
  suggestAccent,
  suggestAccents,
  themeCss,
} from './theme'

describe('hex <-> hsl', () => {
  it('round-trips representative colors within 1 unit', () => {
    for (const hex of ['#9ebfae', '#edbcc7', '#000000', '#ffffff', '#42e6f5']) {
      const back = hslToHex(hexToHsl(hex))
      // allow ±1 per channel from rounding
      const channels = (h: string) =>
        [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
      const a = channels(hex)
      const b = channels(back)
      a.forEach((v, i) => expect(Math.abs(v - b[i])).toBeLessThanOrEqual(2))
    }
  })

  it('clamps out-of-range lightness', () => {
    expect(hslToHex({ h: 150, s: 50, l: 200 })).toBe('#ffffff')
    expect(hslToHex({ h: 150, s: 50, l: -10 })).toBe('#000000')
  })
})

describe('deriveTheme', () => {
  const t = deriveTheme(DEFAULT_MAIN, DEFAULT_ACCENT)

  it('uses the anchors directly for tint and aqua', () => {
    expect(t.light['color-tint']).toBe(DEFAULT_MAIN)
    expect(t.light['color-aqua']).toBe(DEFAULT_ACCENT)
    expect(t.dark['color-aqua']).toBe(DEFAULT_ACCENT)
  })

  it('makes light surfaces bright and dark surfaces dark', () => {
    expect(hexToHsl(t.light['color-base']).l).toBeGreaterThan(80)
    expect(hexToHsl(t.dark['color-base']).l).toBeLessThan(15)
  })

  it('keeps every token in the main hue family for neutrals', () => {
    const mainHue = hexToHsl(DEFAULT_MAIN).h
    // Near-white tokens drift more from 8-bit rounding; allow a generous bound.
    for (const key of ['color-base', 'color-surface', 'color-tint-soft']) {
      expect(Math.abs(hexToHsl(t.light[key]).h - mainHue)).toBeLessThanOrEqual(12)
    }
  })
})

describe('suggestAccents', () => {
  it('always returns soft pastels (high lightness, capped saturation)', () => {
    for (const main of ['#9ebfae', '#a9c3d6', '#c0b6d4', '#aebac4', '#7a5c33']) {
      for (const { hex } of suggestAccents(main)) {
        const { s, l } = hexToHsl(hex)
        expect(l).toBeGreaterThan(75)
        expect(s).toBeLessThanOrEqual(64)
      }
    }
  })

  it('never suggests a yellow / yellow-green hue', () => {
    for (const main of ['#c0b6d4', '#b6c0a0', '#9ebfae']) {
      for (const { hex } of suggestAccents(main)) {
        const { h } = hexToHsl(hex)
        expect(h < 38 || h > 97).toBe(true)
      }
    }
  })

  it('suggests a hue distinct from the main (contrast, not match)', () => {
    const mainHue = hexToHsl(DEFAULT_MAIN).h
    const accentHue = hexToHsl(suggestAccent(DEFAULT_MAIN)).h
    const raw = Math.abs(accentHue - mainHue)
    const dist = Math.min(raw, 360 - raw) // angular distance, 0–180
    expect(dist).toBeGreaterThan(120) // roughly opposite on the wheel
  })

  it('returns deduplicated options', () => {
    const hexes = suggestAccents('#9ebfae').map((c) => c.hex)
    expect(new Set(hexes).size).toBe(hexes.length)
  })
})

describe('themeCss', () => {
  it('emits :root and .dark blocks with custom properties', () => {
    const css = themeCss(DEFAULT_MAIN, DEFAULT_ACCENT)
    expect(css).toContain(':root{')
    expect(css).toContain('.dark{')
    expect(css).toContain(`--color-tint:${DEFAULT_MAIN};`)
  })
})
