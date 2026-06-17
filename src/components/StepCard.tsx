export function StepCard({ step, title, text }: { step: string; title: string; text: string }) {
  return (
    <div className="rounded-4xl border border-ink/5 bg-white p-8">
      <span className="font-serif text-4xl text-aqua">{step}</span>
      <h3 className="mt-3 text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm/relaxed text-muted">{text}</p>
    </div>
  )
}
