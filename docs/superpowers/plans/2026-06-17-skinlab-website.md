# Skinlab Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a 3-page (Home, Services, Contact) marketing website for the "Skinlab, by Dr Phuc" skincare clinic, statically deployable to GitHub Pages.

**Architecture:** TanStack Start (latest) in SPA/CSR mode with static prerendering, TanStack Router for the 3 routes, Tailwind CSS v4 for styling, Framer Motion for subtle animation. A central `site config` module holds all owner-editable content (text, prices, images, business details, Formspree endpoint, base path). The Contact form posts to Formspree. Output is plain static files served from a configurable base path, with a `404.html` SPA fallback for GitHub Pages.

**Tech Stack:** `@tanstack/react-start` ^1.168, `@tanstack/react-router` ^1.170, Vite ≥7, React 19, Tailwind CSS v4, Framer Motion, clsx, Inter + Cormorant Garamond via `@fontsource`.

**Design system — "Clinical Calm":** primary aqua `#42e6f5`, deep aqua `#1bb6d6`/`#0e7d8c`, tints `#f3fdff`/`#eafbfd`/`#d6f7fb`, ink `#0f2730`, muted `#5b7079`, white base. Cormorant Garamond headings, Inter body. Airy whitespace, rounded `2xl`–`4xl`, soft aqua blobs.

**Reference:** Tailwind Plus "Radiant" template at `/Users/phanngl/Downloads/tailwind-plus-radiant/radiant-ts` (component patterns, Framer Motion usage). Spec: `docs/superpowers/specs/2026-06-17-skinlab-website-design.md`.

> **Version note:** TanStack Start's setup has changed across releases. At scaffold time, run `npm view @tanstack/react-start version` and skim the current "Start" docs (https://tanstack.com/start/latest) to confirm the Vite-plugin + SPA/prerender config shape below still matches. The concrete config in Task 2 reflects ~v1.168; adjust property names if the current docs differ, keeping the same intent (static SPA output).

---

## File Structure

```
storefront/
├── package.json
├── vite.config.ts                 # TanStack Start plugin + React + base path + SPA/prerender
├── tsconfig.json
├── .gitignore
├── index.html                     # SPA shell (if required by chosen scaffold)
├── public/
│   └── .nojekyll                  # tells GitHub Pages not to run Jekyll
├── src/
│   ├── styles.css                 # Tailwind v4 import + @theme tokens + fonts
│   ├── router.tsx                 # createRouter, basepath wiring
│   ├── routes/
│   │   ├── __root.tsx             # html shell, Navbar, Footer, <Outlet/>
│   │   ├── index.tsx              # Home page
│   │   ├── services.tsx           # Services page
│   │   └── contact.tsx            # Contact page
│   ├── config/
│   │   └── site.ts                # ALL owner-editable content + config (single source)
│   ├── lib/
│   │   ├── base.ts                # withBase() link/asset helper + BASE_PATH
│   │   └── validateContact.ts     # pure contact-form validation
│   └── components/
│       ├── Container.tsx
│       ├── Button.tsx
│       ├── Heading.tsx            # Heading / Subheading / Eyebrow / Lead
│       ├── Navbar.tsx
│       ├── Footer.tsx
│       ├── Gradient.tsx           # soft aqua blob/gradient background
│       ├── BookingCTA.tsx         # reused closing CTA band
│       ├── FadeIn.tsx             # Framer Motion entrance wrapper
│       ├── TreatmentCard.tsx
│       ├── TestimonialCard.tsx
│       ├── StepCard.tsx
│       └── ContactForm.tsx        # Formspree submit + states
└── .github/workflows/deploy.yml   # build + publish to GitHub Pages
```

---

## Task 1: Scaffold the TanStack Start project

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html` (per scaffold), `src/router.tsx`, `src/routes/__root.tsx`, `src/routes/index.tsx`, `.gitignore`

- [ ] **Step 1: Initialize git and scaffold**

The working dir `/Users/phanngl/projects/skinlab/storefront` already contains `.claude/`, `docs/`, and `.superpowers/`. Scaffold in place. Run:

```bash
cd /Users/phanngl/projects/skinlab/storefront
git init
npm create @tanstack/start@latest -- --template typescript .
```

If the interactive prompt refuses a non-empty dir, scaffold into a temp dir and copy `src/`, `vite.config.ts`, `tsconfig.json`, `package.json`, `index.html` over:

```bash
npm create @tanstack/start@latest /tmp/skinlab-scaffold -- --template typescript
cp -R /tmp/skinlab-scaffold/{src,vite.config.ts,tsconfig.json,package.json,index.html,public} /Users/phanngl/projects/skinlab/storefront/ 2>/dev/null || true
```

- [ ] **Step 2: Add `.gitignore` entries**

Ensure `.gitignore` contains:

```
node_modules
dist
.output
.nitro
.tanstack
.vinxi
.superpowers
*.local
.DS_Store
```

- [ ] **Step 3: Install deps and verify dev server boots**

```bash
cd /Users/phanngl/projects/skinlab/storefront
npm install
npm run dev
```

Expected: dev server starts (Vite, typically http://localhost:3000) with the starter page. Stop it with Ctrl-C.

- [ ] **Step 4: Verify production build works**

```bash
npm run build
```

Expected: build completes with no errors. Note the output directory (`.output`, `dist`, or as printed) — used in Task 14.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: scaffold TanStack Start project"
```

---

## Task 2: Configure SPA mode, base path, and static output

**Files:**
- Modify: `vite.config.ts`
- Create: `public/.nojekyll`

- [ ] **Step 1: Configure the Vite plugin for SPA + prerender + base path**

Edit `vite.config.ts`. Read the version note at the top of this plan first, then set the config to this shape (property names per ~v1.168 — confirm against current docs):

```ts
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Base path for GitHub Pages. For a project page at
// https://<user>.github.io/skinlab/ set BASE_PATH="/skinlab/".
// For a user/org page or custom domain, leave it "/".
const BASE_PATH = process.env.BASE_PATH ?? '/'

export default defineConfig({
  base: BASE_PATH,
  plugins: [
    tanstackStart({
      // Render fully on the client; prerender the static shell for each route.
      spa: { enabled: true },
      prerender: { enabled: true, crawlLinks: true },
    }),
    viteReact(),
  ],
})
```

If the current docs expose SPA/static output differently (e.g. a `target: 'static'` or a `pages` array), use that instead — the goal is: **client-rendered app, static files emitted, one HTML entry per route plus a client bundle.**

- [ ] **Step 2: Add `.nojekyll`**

Create `public/.nojekyll` as an empty file so GitHub Pages serves `_`-prefixed asset folders:

```bash
mkdir -p public && : > public/.nojekyll
```

- [ ] **Step 3: Build and confirm static output**

```bash
BASE_PATH=/skinlab/ npm run build
```

Expected: build succeeds; output dir contains `index.html` and hashed JS/CSS assets whose URLs are prefixed with `/skinlab/`. Note the exact output dir.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: configure SPA mode, base path, static output"
```

---

## Task 3: Install styling/animation deps and set up Tailwind v4 + fonts

**Files:**
- Modify: `package.json` (via install)
- Create/modify: `src/styles.css`
- Modify: `vite.config.ts` (add Tailwind plugin), `src/routes/__root.tsx` (import styles)

- [ ] **Step 1: Install dependencies**

```bash
npm install tailwindcss @tailwindcss/vite framer-motion clsx @fontsource/inter @fontsource-variable/cormorant-garamond
```

- [ ] **Step 2: Add the Tailwind Vite plugin**

In `vite.config.ts`, add `import tailwindcss from '@tailwindcss/vite'` and include `tailwindcss()` in the `plugins` array (before `viteReact()`).

- [ ] **Step 3: Create `src/styles.css` with theme tokens + fonts**

```css
@import 'tailwindcss';

@import '@fontsource-variable/cormorant-garamond';
@import '@fontsource/inter/400.css';
@import '@fontsource/inter/500.css';
@import '@fontsource/inter/600.css';
@import '@fontsource/inter/700.css';

@theme {
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-serif: 'Cormorant Garamond Variable', Georgia, serif;

  --color-aqua: #42e6f5;
  --color-aqua-deep: #1bb6d6;
  --color-aqua-ink: #0e7d8c;
  --color-tint: #f3fdff;
  --color-tint-soft: #eafbfd;
  --color-tint-card: #d6f7fb;
  --color-ink: #0f2730;
  --color-muted: #5b7079;

  --radius-4xl: 2rem;
}

html {
  scroll-behavior: smooth;
}

body {
  background: #ffffff;
  color: var(--color-ink);
  font-family: var(--font-sans);
}
```

- [ ] **Step 4: Import styles in the root route**

In `src/routes/__root.tsx`, ensure `import '../styles.css'` is present (replace any starter CSS import).

- [ ] **Step 5: Verify Tailwind classes apply**

Temporarily add `<div className="bg-aqua text-ink rounded-4xl p-4 font-serif text-3xl">Skinlab</div>` to the home route, run `npm run dev`, confirm aqua background + serif text render. Remove the temp div afterward.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add Tailwind v4 theme tokens and fonts"
```

---

## Task 4: Base-path helper (`withBase`) — TDD

**Files:**
- Create: `src/lib/base.ts`
- Test: `src/lib/base.test.ts`

This helper builds correct URLs for static assets (e.g. Unsplash is absolute, but local `public/` assets and any hardcoded hrefs must respect the base path). Internal route navigation uses `<Link>` (router handles base), so this is for **assets and external-style hrefs only**.

- [ ] **Step 1: Install a test runner**

```bash
npm install -D vitest
```

Add to `package.json` scripts: `"test": "vitest run"`.

- [ ] **Step 2: Write the failing test**

```ts
// src/lib/base.test.ts
import { describe, it, expect } from 'vitest'
import { withBase } from './base'

describe('withBase', () => {
  it('joins a leading-slash path onto the base', () => {
    expect(withBase('/img/hero.jpg', '/skinlab/')).toBe('/skinlab/img/hero.jpg')
  })
  it('handles a root base path', () => {
    expect(withBase('/img/hero.jpg', '/')).toBe('/img/hero.jpg')
  })
  it('does not double slashes', () => {
    expect(withBase('img/hero.jpg', '/skinlab/')).toBe('/skinlab/img/hero.jpg')
  })
  it('passes absolute http(s) URLs through unchanged', () => {
    expect(withBase('https://images.unsplash.com/x', '/skinlab/')).toBe('https://images.unsplash.com/x')
  })
})
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm run test`
Expected: FAIL — `withBase` is not defined.

- [ ] **Step 4: Implement `src/lib/base.ts`**

```ts
// Injected by Vite from vite.config `base`.
export const BASE_PATH = import.meta.env.BASE_URL || '/'

export function withBase(path: string, base: string = BASE_PATH): string {
  if (/^https?:\/\//i.test(path)) return path
  const b = base.endsWith('/') ? base : base + '/'
  const p = path.replace(/^\//, '')
  return b + p
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test`
Expected: PASS (4 passing).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add base-path URL helper with tests"
```

---

## Task 5: Site config — all owner-editable content

**Files:**
- Create: `src/config/site.ts`

- [ ] **Step 1: Write the config module**

This is the single source of truth for content. Every `TODO(owner)` marks a value to replace with real details.

```ts
// src/config/site.ts
// === EDIT EVERYTHING IN THIS FILE TO CUSTOMISE THE SITE ===

export const site = {
  name: 'Skinlab',
  tagline: 'by Dr Phuc',
  // TODO(owner): set to "/<repo>/" for project pages, "/" for a custom domain.
  // Mirror this in vite.config BASE_PATH at build time.
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
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add central site config with placeholder content"
```

---

## Task 6: Primitive components — Container, Heading, Button, FadeIn, Gradient

**Files:**
- Create: `src/components/Container.tsx`, `src/components/Heading.tsx`, `src/components/Button.tsx`, `src/components/FadeIn.tsx`, `src/components/Gradient.tsx`

- [ ] **Step 1: Container**

```tsx
// src/components/Container.tsx
import { clsx } from 'clsx'

export function Container({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={clsx('mx-auto w-full max-w-7xl px-6 lg:px-8', className)}>{children}</div>
}
```

- [ ] **Step 2: Heading set**

```tsx
// src/components/Heading.tsx
import { clsx } from 'clsx'

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={clsx('text-xs font-semibold uppercase tracking-[0.14em] text-aqua-ink', className)}>
      {children}
    </span>
  )
}

export function Heading({ as: As = 'h2', children, className }: { as?: 'h1' | 'h2' | 'h3'; children: React.ReactNode; className?: string }) {
  return (
    <As className={clsx('font-serif text-ink', As === 'h1' ? 'text-5xl/[1.05] md:text-6xl/[1.05]' : 'text-4xl/[1.1] md:text-5xl/[1.1]', className)}>
      {children}
    </As>
  )
}

export function Lead({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={clsx('text-lg/relaxed text-muted', className)}>{children}</p>
}
```

- [ ] **Step 3: Button (renders router Link or external anchor)**

```tsx
// src/components/Button.tsx
import { Link } from '@tanstack/react-router'
import { clsx } from 'clsx'

type Variant = 'primary' | 'secondary'
const base = 'inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition'
const variants: Record<Variant, string> = {
  primary: 'bg-aqua text-ink hover:bg-aqua-deep hover:text-white',
  secondary: 'border border-ink/15 text-ink hover:border-aqua hover:text-aqua-ink',
}

export function Button({ to, href, variant = 'primary', className, children }: { to?: string; href?: string; variant?: Variant; className?: string; children: React.ReactNode }) {
  const cls = clsx(base, variants[variant], className)
  if (href) return <a href={href} className={cls}>{children}</a>
  return <Link to={to ?? '/'} className={cls}>{children}</Link>
}
```

- [ ] **Step 4: FadeIn (Framer Motion entrance)**

```tsx
// src/components/FadeIn.tsx
import { motion } from 'framer-motion'

export function FadeIn({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
```

- [ ] **Step 5: Gradient (soft aqua blob background)**

```tsx
// src/components/Gradient.tsx
import { clsx } from 'clsx'

export function Gradient({ className }: { className?: string }) {
  return (
    <div aria-hidden className={clsx('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-aqua/30 blur-3xl" />
      <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-aqua-deep/20 blur-3xl" />
    </div>
  )
}
```

- [ ] **Step 6: Type-check and commit**

```bash
npx tsc --noEmit
git add -A
git commit -m "feat: add primitive UI components"
```

---

## Task 7: Navbar and Footer

**Files:**
- Create: `src/components/Navbar.tsx`, `src/components/Footer.tsx`

- [ ] **Step 1: Navbar (with mobile menu)**

```tsx
// src/components/Navbar.tsx
import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Container } from './Container'
import { Button } from './Button'
import { site } from '../config/site'

const links = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/contact', label: 'Contact' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-50 border-b border-ink/5 bg-white/80 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link to="/" className="font-serif text-2xl text-ink">
          {site.name} <span className="text-base text-muted">{site.tagline}</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="text-sm text-ink/70 transition hover:text-aqua-ink" activeProps={{ className: 'text-aqua-ink font-medium' }}>
              {l.label}
            </Link>
          ))}
          <Button to="/contact">{site.hero.cta}</Button>
        </nav>
        <button className="md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
          <span className="block h-0.5 w-6 bg-ink" />
          <span className="mt-1.5 block h-0.5 w-6 bg-ink" />
          <span className="mt-1.5 block h-0.5 w-6 bg-ink" />
        </button>
      </Container>
      {open && (
        <Container className="flex flex-col gap-4 pb-6 md:hidden">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="text-ink/80" onClick={() => setOpen(false)}>{l.label}</Link>
          ))}
          <Button to="/contact" className="w-full">{site.hero.cta}</Button>
        </Container>
      )}
    </header>
  )
}
```

- [ ] **Step 2: Footer**

```tsx
// src/components/Footer.tsx
import { Link } from '@tanstack/react-router'
import { Container } from './Container'
import { site } from '../config/site'

export function Footer() {
  return (
    <footer className="mt-24 border-t border-ink/5 bg-tint">
      <Container className="grid gap-10 py-16 md:grid-cols-3">
        <div>
          <p className="font-serif text-2xl text-ink">{site.name} <span className="text-base text-muted">{site.tagline}</span></p>
          <p className="mt-3 max-w-xs text-sm text-muted">{site.contact.address}</p>
        </div>
        <div className="text-sm text-muted">
          <p className="font-semibold text-ink">Hours</p>
          {site.contact.hours.map((h) => (
            <p key={h.day} className="mt-1 flex justify-between gap-6"><span>{h.day}</span><span>{h.time}</span></p>
          ))}
        </div>
        <div className="text-sm text-muted">
          <p className="font-semibold text-ink">Get in touch</p>
          <p className="mt-1"><a className="hover:text-aqua-ink" href={`tel:${site.contact.phone}`}>{site.contact.phone}</a></p>
          <p><a className="hover:text-aqua-ink" href={`mailto:${site.contact.email}`}>{site.contact.email}</a></p>
          <div className="mt-3 flex gap-4">
            {site.contact.socials.map((s) => (
              <a key={s.label} href={s.href} className="hover:text-aqua-ink">{s.label}</a>
            ))}
          </div>
          <Link to="/contact" className="mt-3 inline-block font-medium text-aqua-ink">Book a consultation →</Link>
        </div>
      </Container>
      <Container className="border-t border-ink/5 py-6 text-xs text-muted">
        © {new Date().getFullYear()} {site.name}. All rights reserved.
      </Container>
    </footer>
  )
}
```

- [ ] **Step 3: Type-check and commit**

```bash
npx tsc --noEmit
git add -A
git commit -m "feat: add Navbar and Footer"
```

---

## Task 8: Root layout wiring

**Files:**
- Modify: `src/routes/__root.tsx`

- [ ] **Step 1: Compose Navbar + Outlet + Footer**

Set the root route component to render the shell. Keep whatever `createRootRoute`/`HeadContent`/`Scripts` imports the scaffold generated; only change the component body:

```tsx
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
// ...existing scaffold imports (createRootRoute, Outlet, HeadContent, Scripts) and '../styles.css'

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Skinlab — by Dr Phuc</title>
        <meta name="description" content="Skinlab, by Dr Phuc — science-led skincare treatments in a calm, modern clinic." />
        {/* HeadContent from scaffold goes here if present */}
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
        {/* Scripts from scaffold goes here if present */}
      </body>
    </html>
  )
}
```

Wire `RootDocument` as the root component wrapping `<Outlet />` exactly as the scaffold expects (some versions render the html shell in the root component, others in a `shellComponent`). Match the generated pattern.

- [ ] **Step 2: Verify all three nav routes resolve**

Create empty stub routes if not present so navigation works: `src/routes/services.tsx` and `src/routes/contact.tsx` each exporting a minimal route returning `<Container>…</Container>`. (They are fully built in Tasks 11–13.)

```bash
npm run dev
```

Expected: Navbar/Footer show on every page; clicking Home/Services/Contact navigates client-side without full reload.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: wire root layout with Navbar and Footer"
```

---

## Task 9: Content cards — TreatmentCard, TestimonialCard, StepCard

**Files:**
- Create: `src/components/TreatmentCard.tsx`, `src/components/TestimonialCard.tsx`, `src/components/StepCard.tsx`

- [ ] **Step 1: TreatmentCard**

```tsx
// src/components/TreatmentCard.tsx
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
```

- [ ] **Step 2: TestimonialCard**

```tsx
// src/components/TestimonialCard.tsx
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
```

- [ ] **Step 3: StepCard**

```tsx
// src/components/StepCard.tsx
export function StepCard({ step, title, text }: { step: string; title: string; text: string }) {
  return (
    <div className="rounded-4xl border border-ink/5 bg-white p-8">
      <span className="font-serif text-4xl text-aqua">{step}</span>
      <h3 className="mt-3 text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm/relaxed text-muted">{text}</p>
    </div>
  )
}
```

- [ ] **Step 4: Type-check and commit**

```bash
npx tsc --noEmit
git add -A
git commit -m "feat: add content card components"
```

---

## Task 10: BookingCTA band

**Files:**
- Create: `src/components/BookingCTA.tsx`

- [ ] **Step 1: Implement**

```tsx
// src/components/BookingCTA.tsx
import { Container } from './Container'
import { Button } from './Button'
import { Gradient } from './Gradient'
import { Heading } from './Heading'

export function BookingCTA() {
  return (
    <Container>
      <div className="relative overflow-hidden rounded-4xl bg-tint px-8 py-16 text-center md:py-20">
        <Gradient />
        <div className="relative">
          <Heading as="h2">Ready when your skin is.</Heading>
          <p className="mx-auto mt-4 max-w-xl text-muted">Book a consultation with Dr Phuc and start a plan made just for you.</p>
          <div className="mt-8"><Button to="/contact">Book a consultation</Button></div>
        </div>
      </div>
    </Container>
  )
}
```

- [ ] **Step 2: Type-check and commit**

```bash
npx tsc --noEmit
git add -A
git commit -m "feat: add BookingCTA band"
```

---

## Task 11: Home page

**Files:**
- Modify: `src/routes/index.tsx`

- [ ] **Step 1: Build the page**

Keep the scaffold's `createFileRoute('/')` wrapper; set the component to:

```tsx
import { Container } from '../components/Container'
import { Button } from '../components/Button'
import { Gradient } from '../components/Gradient'
import { FadeIn } from '../components/FadeIn'
import { Eyebrow, Heading, Lead } from '../components/Heading'
import { TreatmentCard } from '../components/TreatmentCard'
import { TestimonialCard } from '../components/TestimonialCard'
import { BookingCTA } from '../components/BookingCTA'
import { site } from '../config/site'

function Home() {
  const featured = site.featuredTreatments
    .map((id) => site.services.find((s) => s.id === id)!)
    .filter(Boolean)
  const [pre, post] = site.hero.title.split(site.hero.italicWord)
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-tint">
        <Gradient />
        <Container className="relative grid items-center gap-12 py-20 md:grid-cols-2 md:py-28">
          <div>
            <Eyebrow>{site.hero.eyebrow}</Eyebrow>
            <Heading as="h1" className="mt-4">
              {pre}<em className="not-italic text-aqua-deep italic">{site.hero.italicWord}</em>{post}
            </Heading>
            <Lead className="mt-6 max-w-md">{site.hero.lead}</Lead>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button to="/contact">{site.hero.cta}</Button>
              <Button to="/services" variant="secondary">Explore treatments</Button>
            </div>
          </div>
          <FadeIn>
            <img src={site.hero.image} alt="Calm skincare clinic treatment room" className="aspect-[4/5] w-full rounded-4xl object-cover shadow-lg" loading="eager" />
          </FadeIn>
        </Container>
      </section>

      {/* Trust strip */}
      <Container className="grid grid-cols-1 gap-8 py-16 sm:grid-cols-3">
        {site.stats.map((s) => (
          <div key={s.label} className="text-center">
            <p className="font-serif text-5xl text-aqua-deep">{s.value}</p>
            <p className="mt-2 text-sm text-muted">{s.label}</p>
          </div>
        ))}
      </Container>

      {/* Featured treatments */}
      <Container className="py-16">
        <FadeIn className="max-w-2xl">
          <Eyebrow>Treatments</Eyebrow>
          <Heading className="mt-3">Care, tailored to your skin.</Heading>
        </FadeIn>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {featured.map((s, i) => (
            <FadeIn key={s.id} delay={i * 0.08}><TreatmentCard service={s} /></FadeIn>
          ))}
        </div>
        <div className="mt-10"><Button to="/services" variant="secondary">View all services</Button></div>
      </Container>

      {/* Meet Dr Phuc */}
      <section className="bg-tint">
        <Container className="grid items-center gap-12 py-20 md:grid-cols-2">
          <FadeIn>
            <img src={site.doctor.image} alt={site.doctor.name} className="aspect-square w-full rounded-4xl object-cover shadow-lg" loading="lazy" />
          </FadeIn>
          <div>
            <Eyebrow>Meet {site.doctor.name}</Eyebrow>
            <Heading className="mt-3">{site.doctor.role}.</Heading>
            <p className="mt-6 text-muted">{site.doctor.bio}</p>
            <ul className="mt-6 flex flex-wrap gap-3">
              {site.doctor.credentials.map((c) => (
                <li key={c} className="rounded-full bg-tint-card px-4 py-1.5 text-sm text-aqua-ink">{c}</li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* Testimonials */}
      <Container className="py-20">
        <FadeIn className="max-w-2xl"><Eyebrow>Kind words</Eyebrow><Heading className="mt-3">Loved by our clients.</Heading></FadeIn>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {site.testimonials.map((t, i) => (
            <FadeIn key={t.name} delay={i * 0.08}><TestimonialCard {...t} /></FadeIn>
          ))}
        </div>
      </Container>

      <div className="pb-8"><BookingCTA /></div>
    </>
  )
}

// attach `Home` as the route component per the scaffold's createFileRoute('/') pattern
```

- [ ] **Step 2: Verify in browser**

```bash
npm run dev
```

Expected: Home renders hero (serif headline with italic accent word), stats, 3 featured cards, Dr Phuc band, 3 testimonials, CTA. Scroll triggers fade-ins. Responsive at mobile width.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: build Home page"
```

---

## Task 12: Services page

**Files:**
- Modify: `src/routes/services.tsx`

- [ ] **Step 1: Build the page**

```tsx
import { Container } from '../components/Container'
import { Gradient } from '../components/Gradient'
import { FadeIn } from '../components/FadeIn'
import { Eyebrow, Heading, Lead } from '../components/Heading'
import { TreatmentCard } from '../components/TreatmentCard'
import { StepCard } from '../components/StepCard'
import { BookingCTA } from '../components/BookingCTA'
import { site } from '../config/site'

function Services() {
  const categories = [...new Set(site.services.map((s) => s.category))]
  return (
    <>
      <section className="relative overflow-hidden bg-tint">
        <Gradient />
        <Container className="relative py-20 md:py-24">
          <Eyebrow>Our services</Eyebrow>
          <Heading as="h1" className="mt-4 max-w-3xl">Considered treatments for healthy, confident skin.</Heading>
          <Lead className="mt-6 max-w-2xl">Every treatment begins with a conversation. Prices are indicative starting points — your final plan is personalised in consultation.</Lead>
        </Container>
      </section>

      {categories.map((cat) => (
        <Container key={cat} className="py-14">
          <FadeIn><h2 className="font-serif text-3xl text-ink">{cat}</h2></FadeIn>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {site.services.filter((s) => s.category === cat).map((s, i) => (
              <FadeIn key={s.id} delay={i * 0.06}><TreatmentCard service={s} /></FadeIn>
            ))}
          </div>
        </Container>
      ))}

      <section className="bg-tint">
        <Container className="py-20">
          <FadeIn className="max-w-2xl"><Eyebrow>What to expect</Eyebrow><Heading className="mt-3">A calm, four-step journey.</Heading></FadeIn>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {site.process.map((p, i) => (
              <FadeIn key={p.step} delay={i * 0.06}><StepCard {...p} /></FadeIn>
            ))}
          </div>
        </Container>
      </section>

      <div className="py-20"><BookingCTA /></div>
    </>
  )
}

// attach `Services` as the route component per the scaffold's createFileRoute('/services') pattern
```

- [ ] **Step 2: Verify and commit**

```bash
npm run dev   # confirm categories group correctly, prices show "/unit" suffix where set
git add -A
git commit -m "feat: build Services page"
```

---

## Task 13: Contact page — form validation (TDD), form, and page

**Files:**
- Create: `src/lib/validateContact.ts`, `src/lib/validateContact.test.ts`, `src/components/ContactForm.tsx`
- Modify: `src/routes/contact.tsx`

- [ ] **Step 1: Write failing validation test**

```ts
// src/lib/validateContact.test.ts
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
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm run test`
Expected: FAIL — `validateContact` not defined.

- [ ] **Step 3: Implement validation**

```ts
// src/lib/validateContact.ts
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
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm run test`
Expected: PASS.

- [ ] **Step 5: Build ContactForm (Formspree submit + states)**

```tsx
// src/components/ContactForm.tsx
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
```

- [ ] **Step 6: Build the Contact page**

```tsx
// src/routes/contact.tsx — keep scaffold's createFileRoute('/contact') wrapper
import { Container } from '../components/Container'
import { Gradient } from '../components/Gradient'
import { Eyebrow, Heading, Lead } from '../components/Heading'
import { ContactForm } from '../components/ContactForm'
import { site } from '../config/site'

function Contact() {
  const mapQuery = encodeURIComponent(site.contact.address)
  return (
    <>
      <section className="relative overflow-hidden bg-tint">
        <Gradient />
        <Container className="relative py-20 md:py-24">
          <Eyebrow>Contact</Eyebrow>
          <Heading as="h1" className="mt-4">Let’s talk about your skin.</Heading>
          <Lead className="mt-6 max-w-2xl">Send a message or call the clinic — we’ll help you find the right next step.</Lead>
        </Container>
      </section>

      <Container className="grid gap-12 py-16 md:grid-cols-2">
        <ContactForm />
        <div className="space-y-8">
          <div>
            <h2 className="font-serif text-2xl text-ink">Visit us</h2>
            <p className="mt-2 text-muted">{site.contact.address}</p>
            <p className="mt-3"><a className="text-aqua-ink" href={`tel:${site.contact.phone}`}>{site.contact.phone}</a></p>
            <p><a className="text-aqua-ink" href={`mailto:${site.contact.email}`}>{site.contact.email}</a></p>
          </div>
          <div>
            <h2 className="font-serif text-2xl text-ink">Opening hours</h2>
            <div className="mt-2 text-muted">
              {site.contact.hours.map((h) => (
                <p key={h.day} className="flex justify-between border-b border-ink/5 py-2"><span>{h.day}</span><span>{h.time}</span></p>
              ))}
            </div>
          </div>
          {/* Map: Google Maps embed (no API key needed for the q= embed). */}
          <iframe
            title="Clinic location"
            className="h-64 w-full rounded-4xl border border-ink/5"
            loading="lazy"
            src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
          />
        </div>
      </Container>
    </>
  )
}

// attach `Contact` as the route component
```

- [ ] **Step 7: Verify and commit**

```bash
npm run test   # validation passes
npm run dev    # submit empty form → inline errors; fill valid → network attempt (will 404 until owner sets real Formspree id)
git add -A
git commit -m "feat: build Contact page with validated Formspree form"
```

---

## Task 14: GitHub Pages deploy — 404 fallback + Actions workflow

**Files:**
- Create: `.github/workflows/deploy.yml`
- Modify: build step to copy `index.html` → `404.html`

- [ ] **Step 1: Confirm the build output directory**

```bash
BASE_PATH=/skinlab/ npm run build && ls -1
```

Identify the static output dir from Task 2 (referred to below as `<OUT>`, e.g. `dist` or `.output/public`).

- [ ] **Step 2: Add 404 fallback to the build**

Add an npm script that copies the SPA entry to `404.html` so deep-link refreshes resolve. In `package.json` scripts add (replace `<OUT>`):

```json
"build:pages": "BASE_PATH=${BASE_PATH:-/} vite build && cp <OUT>/index.html <OUT>/404.html"
```

Run and verify:

```bash
BASE_PATH=/skinlab/ npm run build:pages && ls <OUT>/404.html
```

Expected: `404.html` exists.

- [ ] **Step 3: Add the deploy workflow**

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: true
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      # TODO(owner): set BASE_PATH to "/<repo>/" for a project page, or "/" for a custom domain / user page.
      - run: BASE_PATH=/skinlab/ npm run build:pages
      - uses: actions/upload-pages-artifact@v3
        with:
          path: <OUT>
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

Replace `<OUT>` with the real output dir.

- [ ] **Step 4: Add a README deploy note**

Create/append `README.md` documenting: set `BASE_PATH`, enable Pages (Settings → Pages → Source: GitHub Actions), set the Formspree endpoint in `src/config/site.ts`, replace `TODO(owner)` values.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "ci: add GitHub Pages deploy workflow with SPA 404 fallback"
```

---

## Task 15: Final verification

- [ ] **Step 1: Lint/type/test/build all green**

```bash
npx tsc --noEmit && npm run test && BASE_PATH=/skinlab/ npm run build:pages
```

Expected: type-check clean, tests pass, build emits `<OUT>/index.html`, `<OUT>/404.html`, `<OUT>/.nojekyll`, and base-path-prefixed assets.

- [ ] **Step 2: Serve the static build under the base path and click through**

```bash
npx serve <OUT> -l 5050
# open http://localhost:5050/skinlab/ — verify all 3 pages, nav, and a deep-link refresh on /skinlab/services
```

Expected: all pages render with correct styling/fonts; assets load (no 404s); refreshing a deep route still loads the app (via 404.html when applicable).

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "chore: final verification pass"
```

---

## Self-Review Notes

- **Spec coverage:** stack/SPA/base-path/404/Actions (Tasks 1,2,14) · Tailwind+fonts+tokens (Task 3) · design system applied across components (Tasks 6–10) · Home/Services/Contact (Tasks 11–13) · Formspree form + states + validation (Task 13) · centralized owner-editable content (Task 5) · Unsplash imagery with swap points (Task 5). All spec sections map to tasks.
- **Version risk:** TanStack Start scaffold/SPA API may differ from the v1.168 shape shown; Tasks 1–2 and 8 instruct matching the generated pattern and confirming current docs. This is the main place the implementer must adapt.
- **Type consistency:** `Service` type from `site.ts` used in `TreatmentCard`; `ContactValues`/`ContactErrors` shared between `validateContact.ts` and `ContactForm.tsx`; `withBase`/`BASE_PATH` in `base.ts`.
- **Note:** `priceSuffix` exists only on some services; `TreatmentCard` reads it defensively.
