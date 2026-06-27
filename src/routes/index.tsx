import { createFileRoute } from '@tanstack/react-router'
import { Container } from '../components/Container'
import { Button } from '../components/Button'
import { Gradient } from '../components/Gradient'
import { FadeIn } from '../components/FadeIn'
import { Eyebrow, Heading, Lead } from '../components/Heading'
import { TreatmentCard } from '../components/TreatmentCard'
import { TestimonialCard } from '../components/TestimonialCard'
import { BookingCTA } from '../components/BookingCTA'
import { site } from '../config/site'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const featured = site.featuredTreatments
    .map((id) => site.services.find((s) => s.id === id)!)
    .filter(Boolean)
  const [pre, post] = site.hero.title.split(site.hero.italicWord)
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[color-mix(in_oklch,var(--color-tint)_35%,var(--color-tint-soft)_65%)] dark:bg-surface">
        <Gradient />
        <Container className="relative grid items-center gap-12 py-20 md:grid-cols-2 md:py-28">
          <div>
            <Eyebrow>{site.hero.eyebrow}</Eyebrow>
            <Heading as="h1" className="mt-4 dark:text-aqua-ink">
              {pre}<em className="not-italic text-[color-mix(in_oklch,var(--color-aqua-ink)_50%,var(--color-aqua-deep)_50%)] italic">{site.hero.italicWord}</em>{post}
            </Heading>
            <Lead className="mt-6 max-w-md">{site.hero.lead}</Lead>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button to="/contact">{site.hero.cta}</Button>
              <Button to="/services" variant="secondary">Explore treatments</Button>
            </div>
          </div>
          <FadeIn>
            <img src={site.hero.image} alt="Calm skincare clinic treatment room" className="aspect-[4/5] w-full rounded-4xl object-cover shadow-lg" loading="eager" />
          </FadeIn>
        </Container>
      </section>

      {/* Trust strip */}
      <Container className="grid grid-cols-1 gap-8 py-16 sm:grid-cols-3">
        {site.stats.map((s) => (
          <div key={s.label} className="text-center">
            <p className="font-serif text-5xl text-[color-mix(in_oklch,var(--color-aqua-ink)_65%,var(--color-aqua-deep)_35%)]">{s.value}</p>
            <p className="mt-2 text-sm text-muted">{s.label}</p>
          </div>
        ))}
      </Container>

      {/* Featured treatments */}
      <Container className="py-16">
        <FadeIn className="max-w-2xl">
          <Eyebrow>Treatments</Eyebrow>
          <Heading className="mt-3">Care, tailored to your skin.</Heading>
        </FadeIn>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {featured.map((s, i) => (
            <FadeIn key={s.id} delay={i * 0.08}><TreatmentCard service={s} /></FadeIn>
          ))}
        </div>
        <div className="mt-10"><Button to="/services" variant="secondary">View all services</Button></div>
      </Container>

      {/* Meet Dr Phuc */}
      <section className="bg-[color-mix(in_oklch,var(--color-tint)_35%,var(--color-tint-soft)_65%)] dark:bg-surface">
        <Container className="grid items-center gap-12 py-20 md:grid-cols-2">
          <FadeIn>
            <img src={site.doctor.image} alt={site.doctor.name} className="aspect-square w-full rounded-4xl object-cover shadow-lg" loading="lazy" />
          </FadeIn>
          <div>
            <Eyebrow>Meet {site.doctor.name}</Eyebrow>
            <Heading className="mt-3">{site.doctor.role}.</Heading>
            <p className="mt-6 text-muted">{site.doctor.bio}</p>
            <ul className="mt-6 flex flex-wrap gap-3">
              {site.doctor.credentials.map((c) => (
                <li key={c} className="rounded-full bg-tint-card px-4 py-1.5 text-sm text-aqua-ink">{c}</li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* Testimonials */}
      <Container className="py-20">
        <FadeIn className="max-w-2xl"><Eyebrow>Kind words</Eyebrow><Heading className="mt-3">Loved by our clients.</Heading></FadeIn>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {site.testimonials.map((t, i) => (
            <FadeIn key={t.name} delay={i * 0.08}><TestimonialCard {...t} /></FadeIn>
          ))}
        </div>
      </Container>

      <div className="pb-8"><BookingCTA /></div>
    </>
  )
}
