# Skinlab — Clinic Website Design Spec

**Date:** 2026-06-17
**Brand:** Skinlab, by Dr Phuc — a premium, science-led skincare clinic
**Status:** Approved for implementation planning

## 1. Overview

A standard 3-page marketing website for the Skinlab skincare clinic. Static
site, client-rendered, hosted on GitHub Pages. Realistic placeholder content
and stock imagery that the owner (Dr Phuc) can swap for real details later.

Pages: **Home**, **Services**, **Contact**.

## 2. Tech Stack

- **TanStack Start (latest)** — `@tanstack/react-start` `^1.168` (current
  Vite-plugin architecture, Vite ≥7) in SPA / client-side-rendering mode,
  **statically prerendered** so the build is plain static files
  (HTML/CSS/JS) — no server required. Verify the newest release at scaffold
  time and follow the current docs (the setup has changed across versions).
- **TanStack Router** `^1.170` for the three routes: `/`, `/services`, `/contact`.
- **Tailwind CSS v4** (same setup as the Radiant reference template).
- **Framer Motion** for subtle scroll/entrance animations (matching Radiant's feel).
- **clsx** for conditional class composition.
- Package manager / tooling consistent with a Vite-based TanStack Start app.

### GitHub Pages constraints (must-handle)

- **Static only:** build output must be fully static. Configure TanStack Start
  for static prerender / SPA output.
- **Client-side routing fallback:** add a `404.html` that mirrors `index.html`
  so deep-link refreshes (e.g. `/services`) resolve into the SPA instead of a
  GitHub 404.
- **Base path:** support a configurable base path (e.g. `/skinlab/`) for
  project-pages hosting at `username.github.io/skinlab`. Set via the
  router/build config and used in all internal links and asset URLs.
- **Deploy:** a GitHub Actions workflow that builds and publishes the static
  output to GitHub Pages. Created but not auto-triggered; owner controls deploy.

## 3. Design System — "Clinical Calm"

Airy whitespace, soft aqua tints, rounded shapes; gentle, trustworthy,
spa-meets-medical.

### Color

| Token | Value | Use |
|-------|-------|-----|
| Primary / aqua | `#42e6f5` | CTAs, accents, highlights |
| Aqua deep | `#1bb6d6` / `#0e7d8c` | hover states, small accents, eyebrow text |
| Tint light | `#f3fdff` | page / section backgrounds |
| Tint soft | `#eafbfd`, `#d6f7fb` | cards, pills, bands |
| Ink | `#0f2730` | headings & primary text |
| Muted | `#5b7079` | body / secondary text |
| Base | `#ffffff` | surfaces |

Rounded corners (Tailwind `2xl`–`4xl`, with a `4xl` = 2rem token like Radiant).
Soft aqua radial blobs / gradients for visual warmth.

### Typography

- **Headlines:** Cormorant Garamond (serif), weight 500–700. Used for hero and
  section titles; occasional italic for emphasis words.
- **Body / UI / pricing / buttons:** Inter, weights 400–700.
- Both loaded via Google Fonts (self-hosted or `@fontsource` is acceptable; no
  proprietary license concerns).

### Reusable components (ported/adapted from Radiant)

`Container`, `Navbar`, `Footer`, `Button` (primary aqua + secondary outline),
`Heading` / `Subheading` / `Text`, `Gradient`/blob background, `BookingCTA`
band, and content-specific cards (`TreatmentCard`, `TestimonialCard`,
`StepCard`).

## 4. Pages

### Home (`/`)
1. **Navbar** — logo "Skinlab", links (Home, Services, Contact), "Book a
   consultation" button.
2. **Hero** — serif headline ("Skin that speaks for itself."), supporting line,
   primary CTA, soft aqua gradient/blob, hero image.
3. **Trust strip** — small stats / credentials (years, treatments, rating).
4. **Featured treatments** — 3–4 `TreatmentCard`s linking to Services.
5. **Meet Dr Phuc** — intro band: portrait + short bio + credentials, link/CTA.
6. **Testimonials** — 2–3 `TestimonialCard`s.
7. **Closing booking CTA** band.
8. **Footer** — contact summary, hours, social links, copyright.

### Services (`/services`)
1. Navbar.
2. **Hero / intro** — section title + lead paragraph.
3. **Treatment categories** — grouped cards (e.g. Facials & Peels, Injectables,
   Laser & Skin, Skin Health). Each card: name, blurb, duration, indicative
   "from" price.
4. **What to expect** — 3–4 `StepCard`s (Consult → Plan → Treat → Aftercare).
5. **Closing booking CTA**.
6. Footer.

### Contact (`/contact`)
1. Navbar.
2. **Hero** — short title + line.
3. **Contact form** — name, email, phone, treatment of interest (select),
   message; submits to **Formspree** via a configurable endpoint
   (`VITE_FORMSPREE_ENDPOINT` or config constant). Loading + success + error
   states; graceful "Thank you, we'll be in touch" confirmation. Client-side
   validation only (static site).
4. **Clinic info** — address, opening hours, phone, email.
5. **Map** — embedded map placeholder (static image or iframe placeholder with
   swap point).
6. Footer.

## 5. Content & Imagery

- Realistic placeholder copy written for a premium skincare clinic: treatment
  names/blurbs with indicative pricing, Dr Phuc bio + credentials, 2–3
  testimonials, clinic hours/address.
- Imagery referenced from Unsplash by URL, with clearly marked swap points (a
  central image map / constants file) so the owner can replace them.
- All placeholder business details (address, phone, email, prices) flagged as
  TODO-for-owner in a single config location.

## 6. Non-goals (YAGNI)

- No CMS, no blog, no auth, no e-commerce/online payment.
- No server-side rendering or backend (form delegates to Formspree).
- No real booking system — "Book a consultation" links to the Contact form.
- No multi-language, no dark mode.

## 7. Success Criteria

- `npm run build` produces static output that runs from a subpath and on
  GitHub Pages (incl. deep-link refresh via `404.html`).
- All three pages render, navigate client-side, and are responsive
  (mobile → desktop).
- Consistent Clinical Calm design system: aqua palette, Cormorant headings,
  Inter body, rounded/airy layout.
- Contact form validates and submits to a configurable Formspree endpoint with
  visible success/error states.
- Owner-editable content/config (text, prices, images, business details, base
  path, Formspree endpoint) is centralized and clearly marked.
