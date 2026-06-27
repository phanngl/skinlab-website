import { createFileRoute } from '@tanstack/react-router'
import { Container } from '../components/Container'
import { Gradient } from '../components/Gradient'
import { Eyebrow, Heading, Lead } from '../components/Heading'
import { ContactForm } from '../components/ContactForm'
import { site } from '../config/site'

export const Route = createFileRoute('/contact')({ component: Contact })

function Contact() {
  const mapQuery = encodeURIComponent(site.contact.address)
  return (
    <>
      <section className="relative overflow-hidden bg-[color-mix(in_oklch,var(--color-tint)_35%,var(--color-tint-soft)_65%)] dark:bg-surface">
        <Gradient />
        <Container className="relative py-20 md:py-24">
          <Eyebrow>Contact</Eyebrow>
          <Heading as="h1" className="mt-4">Let’s talk about your skin.</Heading>
          <Lead className="mt-6 max-w-2xl">Send a message or call the clinic — we’ll help you find the right next step.</Lead>
        </Container>
      </section>

      <Container className="grid gap-12 py-16 md:grid-cols-2">
        <ContactForm />
        <div className="space-y-8">
          <div>
            <h2 className="font-serif text-2xl text-ink">Visit us</h2>
            <p className="mt-2 text-muted">{site.contact.address}</p>
            <p className="mt-3"><a className="text-aqua-ink" href={`tel:${site.contact.phone}`}>{site.contact.phone}</a></p>
            <p><a className="text-aqua-ink" href={`mailto:${site.contact.email}`}>{site.contact.email}</a></p>
          </div>
          <div>
            <h2 className="font-serif text-2xl text-ink">Opening hours</h2>
            <div className="mt-2 text-muted">
              {site.contact.hours.map((h) => (
                <p key={h.day} className="flex justify-between border-b border-ink/5 py-2 dark:border-white/10"><span>{h.day}</span><span>{h.time}</span></p>
              ))}
            </div>
          </div>
          <iframe
            title="Clinic location"
            className="h-64 w-full rounded-4xl border border-ink/5 dark:border-white/10"
            loading="lazy"
            src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
          />
        </div>
      </Container>
    </>
  )
}
