# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Marketing site for the **Skinlab, by Dr Phuc** skincare clinic — 3 pages (Home, Services, Contact). TanStack Start (SPA / client-rendered, statically prerendered), Tailwind CSS v4, Framer Motion. Deploys as static files to GitHub Pages.

## Commands

- `npm run dev` — dev server on port 3000
- `npm run test` — Vitest (tests live beside source as `*.test.ts`)
- `npm run build` — static build → **`dist/client/`** (also emits an unused `dist/server/` bundle; ignore it)
- `npm run build:pages` — production deploy build: `build` + copies `index.html` → `404.html` (SPA fallback for GitHub Pages)
- `npm run lint` — ESLint (flat config in `eslint.config.js`; ignores `dist/` and the generated `src/routeTree.gen.ts`)
- `npm run generate-routes` — regenerate `src/routeTree.gen.ts` after adding/renaming routes (`tsr generate`)

## Static SPA / GitHub Pages

- The app is client-rendered; routes are prerendered to static HTML. **No server is used at runtime.**
- `BASE_PATH` env var sets the deploy base path (see `vite.config.ts`): `/skinlab-website/` for a project page, `/` for a custom/user-page domain. Build with e.g. `BASE_PATH=/skinlab-website/ npm run build:pages`.
- Internal navigation uses the router `<Link>` (handles the base path). For static assets / non-router hrefs, use `withBase()` from `src/lib/base.ts`.
- Deploy is via `.github/workflows/deploy.yml`; static output dir is `dist/client`.
- CI runs `npm install`, **not `npm ci`** — the macOS lockfile is missing Linux platform deps (`@emnapi/*`), so `npm ci` fails there. Don't switch CI back without regenerating the lockfile on Linux.

## Design tokens & dark mode (important)

- Colors are semantic CSS tokens defined in `src/styles.css` under `@theme`, with dark-mode overrides in the `.dark` block. Dark mode is class-based (`.dark` on `<html>`), set before paint by an inline script in `src/routes/__root.tsx` and toggled via `src/components/ThemeToggle.tsx`.
- **Use the token utilities so theming flips automatically:** `bg-base`, `bg-surface` (cards/navbar/inputs), `bg-tint`/`bg-tint-soft`/`bg-tint-card` (section bands/pills), `text-ink`, `text-muted`, `text-aqua-ink`, `bg-aqua`/`text-aqua`/`bg-aqua-deep`. **Do not use raw `bg-white`/`text-black`/literal hex** for UI surfaces — it won't adapt to dark mode.
- Exception: text sitting on the `bg-aqua` fill uses fixed `text-[#0b1417]` (stays dark in both themes).
- The `aqua*` tokens are the **accent** color — currently a blush-rose pastel; the `aqua` name is kept for stability (no longer cyan).
- `src/lib/theme.ts` derives the full light+dark token set from two anchor colors (main + accent) and provides `suggestAccents()`. The owner-only ThemePicker (`src/components/ThemePicker.tsx`) previews colors live on any page visited with `?tune` (persisted to localStorage; hidden from normal visitors). `styles.css` `@theme` stays the committed source of truth.
- Headings use `font-serif` (Cormorant Garamond); body uses `font-sans` (Inter).

## Conventions

- All owner-editable content (copy, prices, contact details, treatments, Formspree endpoint, image URLs) lives in **`src/config/site.ts`** — edit content there, not in components. Placeholder values are marked `TODO(owner)`.
- Routing is file-based under `src/routes/`: `export const Route = createFileRoute('/path')({ component })`. `src/routeTree.gen.ts` is auto-generated — don't edit it by hand.
- The contact form posts to Formspree (no backend); validation is in `src/lib/validateContact.ts`.
- Commit messages follow Conventional Commits (`feat:`, `style:`, `chore:`, `ci:`).
