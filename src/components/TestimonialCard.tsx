export function TestimonialCard({ quote, name, detail }: { quote: string; name: string; detail: string }) {
  return (
    <figure className="flex h-full flex-col rounded-4xl bg-tint-soft p-8">
      <blockquote className="flex-1 font-serif text-xl/relaxed text-ink">“{quote}”</blockquote>
      <figcaption className="mt-6 text-sm">
        <span className="font-semibold text-ink">{name}</span>
        <span className="block text-muted">{detail}</span>
      </figcaption>
    </figure>
  )
}
