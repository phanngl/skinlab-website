import { describe, it, expect } from 'vitest'
import { validateContact } from './validateContact'

const ok = { name: 'Ann', email: 'ann@example.com', phone: '0400000000', treatment: 'General enquiry', message: 'Hello there' }

describe('validateContact', () => {
  it('passes a valid submission', () => {
    expect(validateContact(ok)).toEqual({})
  })
  it('requires a name', () => {
    expect(validateContact({ ...ok, name: '' }).name).toBeTruthy()
  })
  it('rejects a malformed email', () => {
    expect(validateContact({ ...ok, email: 'nope' }).email).toBeTruthy()
  })
  it('requires a message of at least 5 chars', () => {
    expect(validateContact({ ...ok, message: 'hi' }).message).toBeTruthy()
  })
})
