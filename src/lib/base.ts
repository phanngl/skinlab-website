// Injected by Vite from vite.config `base`.
export const BASE_PATH = import.meta.env.BASE_URL || '/'

export function withBase(path: string, base: string = BASE_PATH): string {
  if (/^https?:\/\//i.test(path)) return path
  const b = base.endsWith('/') ? base : base + '/'
  const p = path.replace(/^\//, '')
  return b + p
}
