# AGENTS.md — Skinlab storefront

3-page marketing site for a skincare clinic. TanStack Start in **SPA mode** (no SSR, no running server), Tailwind CSS v4, Framer Motion. Static deploy to GitHub Pages.

## Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Dev server on port 3000 |
| `npm run build` | Static build → `dist/client/` |
| `npm run build:pages` | Build + copies `index.html → 404.html` (SPA fallback for GH Pages) |
| `npm run test` | Vitest (co-located `*.test.ts` files) |
| `npm run lint` | ESLint flat config |
| `npm run generate-routes` | Regenerate `src/routeTree.gen.ts` after route changes |

## Build & deploy gotchas

- **`npm ci` fails on CI** — the lockfile was generated on macOS and is missing platform-specific deps (`@emnapi/*`). CI workflow uses `npm install` instead. Do not switch back to `npm ci` without regenerating the lockfile on Linux.
- **`BASE_PATH` env var** — Vite `base` config reads this. Must match the GitHub Pages subpath (e.g. `/skinlab-website/` for a project page, `/` for a user/custom domain). Set at build time. Affects all asset URLs.
- **Deploy is `dist/client/` only** — the `dist/server/` output is unused. Ignore it.
- **`.nojekyll` in `public/`** — disables Jekyll processing on GitHub Pages.

## Architecture

- **SPA mode, not SSR** — `tanstackStart({ spa: { enabled: true, prerender: { crawlLinks: true } } })`. Routes are statically prerendered to HTML at build time, then hydrated client-side. No Node server runs at runtime.
- **3 routes**: `/` (Home), `/services`, `/contact` — file-based under `src/routes/`. Shell layout in `__root.tsx`.
- **Router config**: `src/router.tsx` → imports `routeTree.gen.ts` (auto-generated — do not edit).
- **Content**: all owner-editable text, prices, images, Formspree endpoint in `src/config/site.ts`. Placeholders marked `TODO(owner)`. Edit there, not in components.
- **Contact form**: POSTs to Formspree (no backend). Validation in `src/lib/validateContact.ts`.
- **Path aliases**: `#/*` and `@/*` both map to `./src/*`.
- **Dark mode**: class-based (`.dark` on `<html>`), set by inline script in `__root.tsx` before paint. Theme toggle at `src/components/ThemeToggle.tsx`.

## CSS / Theming rules

- **Never use literal color values for UI surfaces** (`bg-white`, `text-black`) — they won't adapt to dark mode.
- Use semantic token utilities instead: `bg-base`, `bg-surface` (cards/nav/inputs), `bg-tint`/`bg-tint-soft`/`bg-tint-card` (section bands), `text-ink`, `text-muted`, `text-aqua-ink`, `bg-aqua`/`text-aqua`/`bg-aqua-deep`.
- Exception: text on `bg-aqua` uses fixed `text-[#0b1417]` (stays dark in both themes).
- Tokens defined in `src/styles.css` via `@theme` with `.dark` overrides on CSS custom properties.
- Fonts: headings `font-serif` (Cormorant Garamond), body `font-sans` (Inter).

## Generated files

| File | How it's created | Don't edit |
|---|---|---|
| `src/routeTree.gen.ts` | `tsr generate` / `npm run generate-routes` | Yes — run the script instead |
| `dist/` | `npm run build` | Yes — build output |

## Code conventions

- TypeScript: strict mode, `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`.
- ESLint ignores `dist/` and `src/routeTree.gen.ts`.
- Git: Conventional Commits (`feat:`, `style:`, `chore:`, `ci:`, etc.).
- `.gitignore` excludes `.superpowers/` (planning/design docs) and `.tanstack/` (build cache).

## Dependencies note

Several TanStack packages use `"latest"` as the version specifier in `package.json`. This is atypical and means the lockfile can drift from what a fresh install produces — another reason `npm ci` can fail unexpectedly.

## Tests

- `src/lib/base.test.ts` — `withBase()` URL helper
- `src/lib/validateContact.test.ts` — contact form validation
- Run: `npm run test`
