import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Container } from './Container'
import { Button } from './Button'
import { site } from '../config/site'

const links = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/contact', label: 'Contact' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-50 border-b border-ink/5 bg-surface/80 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link to="/" className="font-serif text-2xl text-ink">
          {site.name} <span className="text-base text-muted">{site.tagline}</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="text-sm text-ink/70 transition hover:text-aqua-ink" activeProps={{ className: 'text-aqua-ink font-medium' }}>
              {l.label}
            </Link>
          ))}
          <Button to="/contact">{site.hero.cta}</Button>
        </nav>
        <button className="md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
          <span className="block h-0.5 w-6 bg-ink" />
          <span className="mt-1.5 block h-0.5 w-6 bg-ink" />
          <span className="mt-1.5 block h-0.5 w-6 bg-ink" />
        </button>
      </Container>
      {open && (
        <Container className="flex flex-col gap-4 pb-6 md:hidden">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="text-ink/80" onClick={() => setOpen(false)}>{l.label}</Link>
          ))}
          <Button to="/contact" className="w-full">{site.hero.cta}</Button>
        </Container>
      )}
    </header>
  )
}
