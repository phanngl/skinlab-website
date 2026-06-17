export interface ContactValues {
  name: string
  email: string
  phone: string
  treatment: string
  message: string
}
export type ContactErrors = Partial<Record<keyof ContactValues, string>>

export function validateContact(v: ContactValues): ContactErrors {
  const e: ContactErrors = {}
  if (!v.name.trim()) e.name = 'Please enter your name.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = 'Please enter a valid email.'
  if (v.message.trim().length < 5) e.message = 'Please enter a short message.'
  return e
}
