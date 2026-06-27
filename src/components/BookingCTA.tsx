import { Container } from './Container'
import { Button } from './Button'
import { Gradient } from './Gradient'
import { Heading } from './Heading'

export function BookingCTA() {
  return (
    <Container>
      <div className="relative overflow-hidden rounded-4xl bg-[color-mix(in_oklch,var(--color-tint)_35%,var(--color-tint-soft)_65%)] dark:bg-surface px-8 py-16 text-center md:py-20">
        <Gradient />
        <div className="relative">
          <Heading as="h2" className="dark:text-aqua-ink">Ready when your skin is.</Heading>
          <p className="mx-auto mt-4 max-w-xl text-muted">Book a consultation with Dr Phuc and start a plan made just for you.</p>
          <div className="mt-8"><Button to="/contact">Book a consultation</Button></div>
        </div>
      </div>
    </Container>
  )
}
