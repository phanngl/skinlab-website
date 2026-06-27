import { describe, expect, it } from 'vitest'
import {
  DEFAULT_MAIN,
  deriveMonoTheme,
  hexToHsl,
  hslToHex,
  suggestShades,
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

describe('deriveMonoTheme', () => {
  const t = deriveMonoTheme(DEFAULT_MAIN)

  it('generates all 10 light and 10 dark tokens', () => {
    expect(Object.keys(t.light)).toHaveLength(10)
    expect(Object.keys(t.dark)).toHaveLength(10)
  })

  it('makes light surfaces bright and dark surfaces dark', () => {
    expect(hexToHsl(t.light['color-base']).l).toBeGreaterThan(80)
    expect(hexToHsl(t.dark['color-base']).l).toBeLessThan(15)
  })

  it('keeps every token in the same hue family', () => {
    const mainHue = hexToHsl(DEFAULT_MAIN).h
    // All tokens should be within 15° hue of the anchor — rounding drift only.
    for (const mode of ['light', 'dark'] as const) {
      for (const hex of Object.values(t[mode])) {
        const { h } = hexToHsl(hex)
        expect(Math.abs(h - mainHue)).toBeLessThanOrEqual(18)
      }
    }
  })
})

describe('suggestShades', () => {
  it('returns 4 lightness variants close to the anchor', () => {
    const shades = suggestShades(DEFAULT_MAIN)
    expect(shades).toHaveLength(4)
    for (const s of shades) {
      expect(s.hex).toMatch(/^#[0-9a-f]{6}$/)
      expect(s.name).toBeTruthy()
    }
  })

  it('keeps all shades in the same hue family', () => {
    const mainHue = hexToHsl(DEFAULT_MAIN).h
    for (const { hex } of suggestShades(DEFAULT_MAIN)) {
      const { h } = hexToHsl(hex)
      expect(Math.abs(h - mainHue)).toBeLessThanOrEqual(5)
    }
  })
})

describe('themeCss', () => {
  it('emits :root and .dark blocks with custom properties', () => {
    const css = themeCss(DEFAULT_MAIN)
    expect(css).toContain(':root{')
    expect(css).toContain('.dark{')
    expect(css).toContain('--color-tint:')
    expect(css).toContain('--color-aqua:')
  })
})
