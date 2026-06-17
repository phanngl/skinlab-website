import { describe, it, expect } from 'vitest'
import { withBase } from './base'

describe('withBase', () => {
  it('joins a leading-slash path onto the base', () => {
    expect(withBase('/img/hero.jpg', '/skinlab/')).toBe('/skinlab/img/hero.jpg')
  })
  it('handles a root base path', () => {
    expect(withBase('/img/hero.jpg', '/')).toBe('/img/hero.jpg')
  })
  it('does not double slashes', () => {
    expect(withBase('img/hero.jpg', '/skinlab/')).toBe('/skinlab/img/hero.jpg')
  })
  it('passes absolute http(s) URLs through unchanged', () => {
    expect(withBase('https://images.unsplash.com/x', '/skinlab/')).toBe('https://images.unsplash.com/x')
  })
})
