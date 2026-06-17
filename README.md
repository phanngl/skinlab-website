# Skinlab — by Dr Phuc

Marketing website for the Skinlab skincare clinic. Three pages (Home, Services,
Contact), built with **TanStack Start** (SPA / client-rendered, statically
prerendered), **Tailwind CSS v4**, and **Framer Motion**. Deploys as static
files to **GitHub Pages**.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
```

## Test

```bash
npm run test     # vitest (withBase + contact-form validation)
```

## Build

```bash
npm run build            # static build → dist/client/
npm run build:pages      # same, plus copies index.html → 404.html (SPA fallback)
```

The static site is emitted to **`dist/client/`** (`index.html` + hashed assets,
`404.html` fallback, `.nojekyll`). No server is required to serve it.

## Customise the content

Almost everything you'll want to change lives in **`src/config/site.ts`**:
clinic name, contact details, opening hours, socials, hero copy, stats, Dr Phuc
bio/credentials, the treatments list (with pricing), the process steps,
testimonials, and the contact-form options. Search the file for `TODO(owner)`
for the values you must replace with real details.

Imagery uses Unsplash URLs in that same config — swap the `image` fields for
your own photos.

### Contact form (Formspree)

The contact form POSTs to a [Formspree](https://formspree.io) endpoint (no
backend needed). Create a form, then set `formspreeEndpoint` in
`src/config/site.ts` to your `https://formspree.io/f/xxxxxxx` URL. Until then,
submissions will fail with an inline error.

## Deploy to GitHub Pages

A workflow at `.github/workflows/deploy.yml` builds and publishes on every push
to `main`.

1. In the repo: **Settings → Pages → Build and deployment → Source: GitHub
   Actions**.
2. Set the **base path** so asset URLs resolve at your Pages address. Edit the
   `BASE_PATH=/skinlab/` line in `.github/workflows/deploy.yml`:
   - Project page (`https://<user>.github.io/<repo>/`): use `/<repo>/`.
   - User/org page or custom domain (served at `/`): use `/`.
   The build reads `BASE_PATH` (see `vite.config.ts`); locally you can run
   `BASE_PATH=/skinlab/ npm run build:pages` to preview the same output.
3. Push to `main` (or run the workflow manually). The `404.html` fallback lets
   deep links like `/services` survive a refresh on GitHub Pages.
