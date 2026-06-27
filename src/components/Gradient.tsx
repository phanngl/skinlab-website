import { clsx } from 'clsx'

export function Gradient({ className }: { className?: string }) {
  return (
    <div aria-hidden className={clsx('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-aqua/15 blur-3xl dark:bg-aqua/25" />
      <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-aqua-deep/10 blur-3xl dark:bg-aqua-deep/20" />
    </div>
  )
}
