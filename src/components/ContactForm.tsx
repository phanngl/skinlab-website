import { useState } from 'react'
import { clsx } from 'clsx'
import { site } from '../config/site'
import { validateContact, type ContactValues, type ContactErrors } from '../lib/validateContact'

const empty: ContactValues = { name: '', email: '', phone: '', treatment: site.treatmentOptions[0], message: '' }

export function ContactForm() {
  const [values, setValues] = useState<ContactValues>(empty)
  const [errors, setErrors] = useState<ContactErrors>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const set = (k: keyof ContactValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setValues((v) => ({ ...v, [k]: e.target.value }))

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validateContact(values)
    setErrors(errs)
    if (Object.keys(errs).length) return
    setStatus('submitting')
    try {
      const res = await fetch(site.formspreeEndpoint, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      setStatus(res.ok ? 'success' : 'error')
      if (res.ok) setValues(empty)
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-4xl bg-tint-soft p-10 text-center">
        <p className="font-serif text-3xl text-ink">Thank you.</p>
        <p className="mt-3 text-muted">We’ve received your message and will be in touch shortly.</p>
      </div>
    )
  }

  const field = 'w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-ink outline-none focus:border-aqua'
  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div>
        <label className="text-sm font-medium text-ink">Name</label>
        <input className={clsx(field, errors.name && 'border-red-400')} value={values.name} onChange={set('name')} />
        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-ink">Email</label>
          <input type="email" className={clsx(field, errors.email && 'border-red-400')} value={values.email} onChange={set('email')} />
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
        </div>
        <div>
          <label className="text-sm font-medium text-ink">Phone</label>
          <input className={field} value={values.phone} onChange={set('phone')} />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-ink">Treatment of interest</label>
        <select className={field} value={values.treatment} onChange={set('treatment')}>
          {site.treatmentOptions.map((o) => <option key={o}>{o}</option>)}
        </select>
      </div>
      <div>
        <label className="text-sm font-medium text-ink">Message</label>
        <textarea rows={4} className={clsx(field, errors.message && 'border-red-400')} value={values.message} onChange={set('message')} />
        {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message}</p>}
      </div>
      {status === 'error' && <p className="text-sm text-red-500">Something went wrong. Please try again or call us.</p>}
      <button type="submit" disabled={status === 'submitting'} className="inline-flex items-center justify-center rounded-full bg-aqua px-6 py-3 text-sm font-semibold text-ink transition hover:bg-aqua-deep hover:text-white disabled:opacity-60">
        {status === 'submitting' ? 'Sending…' : 'Send message'}
      </button>
    </form>
  )
}
