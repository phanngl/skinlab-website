import { clsx } from 'clsx'

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={clsx('text-xs font-semibold uppercase tracking-[0.14em] text-aqua-ink', className)}>
      {children}
    </span>
  )
}

export function Heading({ as: As = 'h2', children, className }: { as?: 'h1' | 'h2' | 'h3'; children: React.ReactNode; className?: string }) {
  return (
    <As className={clsx('font-serif font-semibold text-ink', As === 'h1' ? 'text-5xl/[1.05] md:text-6xl/[1.05]' : 'text-4xl/[1.1] md:text-5xl/[1.1]', className)}>
      {children}
    </As>
  )
}

export function Lead({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={clsx('text-lg/relaxed text-muted', className)}>{children}</p>
}
