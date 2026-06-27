import { createFileRoute } from '@tanstack/react-router'
import { Container } from '../components/Container'
import { Gradient } from '../components/Gradient'
import { FadeIn } from '../components/FadeIn'
import { Eyebrow, Heading, Lead } from '../components/Heading'
import { TreatmentCard } from '../components/TreatmentCard'
import { StepCard } from '../components/StepCard'
import { BookingCTA } from '../components/BookingCTA'
import { site } from '../config/site'

export const Route = createFileRoute('/services')({ component: Services })

function Services() {
  const categories = [...new Set(site.services.map((s) => s.category))]
  return (
    <>
      <section className="relative overflow-hidden bg-[color-mix(in_oklch,var(--color-tint)_35%,var(--color-tint-soft)_65%)] dark:bg-surface">
        <Gradient />
        <Container className="relative py-20 md:py-24">
          <Eyebrow>Our services</Eyebrow>
          <Heading as="h1" className="mt-4 max-w-3xl">Considered treatments for healthy, confident skin.</Heading>
          <Lead className="mt-6 max-w-2xl">Every treatment begins with a conversation. Prices are indicative starting points — your final plan is personalised in consultation.</Lead>
        </Container>
      </section>

      {categories.map((cat) => (
        <Container key={cat} className="py-14">
          <FadeIn><h2 className="font-serif text-3xl text-ink">{cat}</h2></FadeIn>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {site.services.filter((s) => s.category === cat).map((s, i) => (
              <FadeIn key={s.id} delay={i * 0.06}><TreatmentCard service={s} /></FadeIn>
            ))}
          </div>
        </Container>
      ))}

      <section className="bg-[color-mix(in_oklch,var(--color-tint)_35%,var(--color-tint-soft)_65%)] dark:bg-surface">
        <Container className="py-20">
          <FadeIn className="max-w-2xl"><Eyebrow>What to expect</Eyebrow><Heading className="mt-3">A calm, four-step journey.</Heading></FadeIn>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {site.process.map((p, i) => (
              <FadeIn key={p.step} delay={i * 0.06}><StepCard {...p} /></FadeIn>
            ))}
          </div>
        </Container>
      </section>

      <div className="py-20"><BookingCTA /></div>
    </>
  )
}
