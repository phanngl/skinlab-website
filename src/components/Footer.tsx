import { Link } from '@tanstack/react-router'
import { Container } from './Container'
import { site } from '../config/site'

export function Footer() {
  return (
    <footer className="mt-24 border-t border-ink/5 bg-tint">
      <Container className="grid gap-10 py-16 md:grid-cols-3">
        <div>
          <p className="font-serif text-2xl text-ink">{site.name} <span className="text-base text-muted">{site.tagline}</span></p>
          <p className="mt-3 max-w-xs text-sm text-muted">{site.contact.address}</p>
        </div>
        <div className="text-sm text-muted">
          <p className="font-semibold text-ink">Hours</p>
          {site.contact.hours.map((h) => (
            <p key={h.day} className="mt-1 flex justify-between gap-6"><span>{h.day}</span><span>{h.time}</span></p>
          ))}
        </div>
        <div className="text-sm text-muted">
          <p className="font-semibold text-ink">Get in touch</p>
          <p className="mt-1"><a className="hover:text-aqua-ink" href={`tel:${site.contact.phone}`}>{site.contact.phone}</a></p>
          <p><a className="hover:text-aqua-ink" href={`mailto:${site.contact.email}`}>{site.contact.email}</a></p>
          <div className="mt-3 flex gap-4">
            {site.contact.socials.map((s) => (
              <a key={s.label} href={s.href} className="hover:text-aqua-ink">{s.label}</a>
            ))}
          </div>
          <Link to={'/contact' as string} className="mt-3 inline-block font-medium text-aqua-ink">Book a consultation →</Link>
        </div>
      </Container>
      <Container className="border-t border-ink/5 py-6 text-xs text-muted">
        © {new Date().getFullYear()} {site.name}. All rights reserved.
      </Container>
    </footer>
  )
}
