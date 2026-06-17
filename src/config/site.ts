// src/config/site.ts
// === EDIT EVERYTHING IN THIS FILE TO CUSTOMISE THE SITE ===

export const site = {
  name: 'Skinlab',
  tagline: 'by Dr Phuc',
  // TODO(owner): replace with your Formspree form endpoint.
  formspreeEndpoint: 'https://formspree.io/f/your-form-id',
  contact: {
    phone: '(02) 1234 5678', // TODO(owner)
    email: 'hello@skinlab.clinic', // TODO(owner)
    address: '12 Marina Boulevard, Sydney NSW 2000', // TODO(owner)
    hours: [
      { day: 'Mon – Fri', time: '9:00 – 18:00' },
      { day: 'Saturday', time: '9:00 – 14:00' },
      { day: 'Sunday', time: 'Closed' },
    ],
    socials: [
      { label: 'Instagram', href: 'https://instagram.com/' }, // TODO(owner)
      { label: 'Facebook', href: 'https://facebook.com/' }, // TODO(owner)
    ],
  },
  hero: {
    eyebrow: 'Skinlab · by Dr Phuc',
    title: 'Skin that speaks for itself.',
    italicWord: 'speaks',
    lead: 'Science-led skincare in a calm, modern clinic. Personalised treatments designed around your skin — never a one-size-fits-all menu.',
    cta: 'Book a consultation',
    image:
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80',
  },
  stats: [
    { value: '10+', label: 'Years of practice' },
    { value: '6,000+', label: 'Treatments delivered' },
    { value: '4.9★', label: 'Average client rating' },
  ],
  doctor: {
    name: 'Dr Phuc',
    role: 'Founder & Lead Practitioner',
    bio: 'Dr Phuc combines a decade of clinical dermatology experience with a gentle, evidence-based approach. Every plan starts with listening — to your skin, your history, and your goals.',
    credentials: ['MBBS', 'Diploma in Dermatology', 'Member, Cosmetic Physicians College'], // TODO(owner)
    image:
      'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=900&q=80',
  },
  featuredTreatments: ['hydrafacial', 'chemical-peel', 'laser-rejuvenation'], // ids from `services`
  services: [
    {
      id: 'hydrafacial',
      category: 'Facials & Peels',
      name: 'Signature HydraFacial',
      blurb: 'Deep cleanse, exfoliation and hydration in one calming session for an immediate, healthy glow.',
      duration: '60 min',
      priceFrom: 180,
    },
    {
      id: 'chemical-peel',
      category: 'Facials & Peels',
      name: 'Custom Chemical Peel',
      blurb: 'Targeted resurfacing to soften fine lines, even tone and refine texture, tailored to your skin.',
      duration: '45 min',
      priceFrom: 160,
    },
    {
      id: 'anti-wrinkle',
      category: 'Injectables',
      name: 'Anti-Wrinkle Treatment',
      blurb: 'Subtle, natural softening of expression lines, administered with a conservative, refined touch.',
      duration: '30 min',
      priceFrom: 12, // per unit
      priceSuffix: '/unit',
    },
    {
      id: 'dermal-filler',
      category: 'Injectables',
      name: 'Dermal Fillers',
      blurb: 'Restore volume and definition with premium fillers, planned around your natural proportions.',
      duration: '45 min',
      priceFrom: 550,
    },
    {
      id: 'laser-rejuvenation',
      category: 'Laser & Skin',
      name: 'Laser Rejuvenation',
      blurb: 'Stimulate collagen and reduce redness, pigment and pore size with gentle, modern laser therapy.',
      duration: '50 min',
      priceFrom: 290,
    },
    {
      id: 'skin-consult',
      category: 'Skin Health',
      name: 'Skin Health Consultation',
      blurb: 'A thorough one-on-one assessment with Dr Phuc and a clear, personalised treatment roadmap.',
      duration: '40 min',
      priceFrom: 90,
    },
  ],
  process: [
    { step: '01', title: 'Consult', text: 'We listen, assess your skin and discuss your goals — no pressure.' },
    { step: '02', title: 'Plan', text: 'Dr Phuc designs a personalised, staged treatment roadmap.' },
    { step: '03', title: 'Treat', text: 'Comfortable, precise treatments in a calm clinical setting.' },
    { step: '04', title: 'Aftercare', text: 'Ongoing guidance and reviews so results last.' },
  ],
  testimonials: [
    { quote: 'I finally feel confident without makeup. Dr Phuc never oversells — just honest, brilliant care.', name: 'Hannah L.', detail: 'HydraFacial client' },
    { quote: 'The most relaxing clinic I’ve been to. My skin has never looked better.', name: 'Marcus T.', detail: 'Laser rejuvenation' },
    { quote: 'Genuine expertise and a gentle touch. I recommend Skinlab to everyone.', name: 'Priya S.', detail: 'Skin consultation' },
  ],
  treatmentOptions: [ // for the contact form select
    'General enquiry',
    'Signature HydraFacial',
    'Custom Chemical Peel',
    'Injectables',
    'Laser Rejuvenation',
    'Skin Health Consultation',
  ],
} as const

export type Service = (typeof site.services)[number]
