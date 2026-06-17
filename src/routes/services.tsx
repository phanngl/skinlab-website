import { createFileRoute } from '@tanstack/react-router'
import { Container } from '../components/Container'

export const Route = createFileRoute('/services')({ component: Services })

function Services() {
  return <Container className="py-20">Services — coming soon.</Container>
}
