import type { Service } from '../config/site'

export function TreatmentCard({ service }: { service: Service }) {
  const suffix = 'priceSuffix' in service ? (service as { priceSuffix?: string }).priceSuffix ?? '' : ''
  return (
    <div className="flex h-full flex-col rounded-4xl border border-ink/5 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-aqua-ink">{service.category}</span>
      <h3 className="mt-3 font-serif text-2xl text-ink">{service.name}</h3>
      <p className="mt-2 flex-1 text-sm/relaxed text-muted">{service.blurb}</p>
      <div className="mt-6 flex items-center justify-between border-t border-ink/5 pt-4 text-sm">
        <span className="text-muted">{service.duration}</span>
        <span className="font-semibold text-ink">From ${service.priceFrom}{suffix}</span>
      </div>
    </div>
  )
}
