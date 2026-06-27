import { Link } from '@tanstack/react-router'
import { clsx } from 'clsx'

type Variant = 'primary' | 'secondary'
const base = 'inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition'
const variants: Record<Variant, string> = {
  primary: 'bg-aqua text-[#0b1417] hover:bg-aqua-deep hover:text-white',
  secondary: 'border border-ink/15 text-ink hover:border-aqua hover:text-aqua-ink dark:border-white/25 dark:hover:border-aqua',
}

export function Button({ to, href, variant = 'primary', className, children }: { to?: string; href?: string; variant?: Variant; className?: string; children: React.ReactNode }) {
  const cls = clsx(base, variants[variant], className)
  if (href) return <a href={href} className={cls}>{children}</a>
  return <Link to={to ?? '/'} className={cls}>{children}</Link>
}
