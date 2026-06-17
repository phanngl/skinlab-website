import { createFileRoute } from '@tanstack/react-router'
import { Container } from '../components/Container'

export const Route = createFileRoute('/contact')({ component: Contact })

function Contact() {
  return <Container className="py-20">Contact — coming soon.</Container>
}
