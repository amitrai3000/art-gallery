# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Art Gallery is a multi-page React application for browsing artwork, built as part of the "Art of Vibe Coding" workshop. It uses React 19, TypeScript 5.9 (strict mode), Vite 7, Tailwind CSS 4, and React Router 7.

## Commands

- `npm run dev` — Start Vite dev server (http://localhost:5173)
- `npm run build` — Type-check (`tsc -b`) then bundle (`vite build`)
- `npm run lint` — ESLint across all `.ts`/`.tsx` files
- `npm run preview` — Serve production build locally

No test runner is configured yet. When added, it will be Vitest + React Testing Library.

## Architecture

**Routing:** `BrowserRouter` in `src/App.tsx` defines all routes. `RootLayout` is a layout route (no `path`) that wraps all pages via `<Outlet />`.

**Full-bleed layout:** `RootLayout`'s `<main>` has no max-width constraint — each page owns its own section widths. Pages use alternating full-width `<section>` elements with `mx-auto max-w-6xl px-6` containers inside. This enables dark/light band sections that span the viewport.

**Current routes** (defined in `App.tsx`):

| Path             | Component           | Description                |
|------------------|---------------------|----------------------------|
| `/`              | `HomePage`          | Landing page               |
| `/gallery`       | `GalleryPage`       | Artwork grid, links to detail |
| `/artwork/:id`   | `ArtworkDetailPage` | Single artwork view        |
| `/about`         | `AboutPage`         | Gallery info & team        |
| `/contact`       | `ContactPage`       | Contact form               |

**Navigation:** Nav links are defined in the `NAV_LINKS` constant at the top of `RootLayout.tsx`. To add a nav link, add to this array — it feeds the desktop nav, mobile menu, and footer.

**Static data layer:** Artwork data lives in `src/data/artworks.ts` as a `const` array (`ARTWORKS`). Pages import and consume this directly — there is no backend or API yet. To add a new data source, create a new file in `src/data/` with a typed constant array.

**Detail page pattern:** `ArtworkDetailPage` uses `useParams` to extract the route `:id`, looks up the artwork from `ARTWORKS`, and renders `<ArtworkNotFound />` if not found. Follow this pattern for future detail routes.

**Adding a new page:**
1. Create `src/pages/NewPage.tsx` with a default export
2. Add a `<Route>` inside the `<Route element={<RootLayout />}>` block in `App.tsx`
3. Add an entry to `NAV_LINKS` in `src/layouts/RootLayout.tsx`

**Folder conventions:**
- `src/pages/` — routable page components (one per route)
- `src/components/` — shared, reusable UI components (`SectionHeading`, `GeometricDecor`)
- `src/layouts/` — shell components using `<Outlet />`
- `src/data/` — static data arrays (e.g., `artworks.ts` exports `ARTWORKS`)
- `src/types/` — shared TypeScript interfaces
- `src/assets/` — images/SVGs imported by components
- `src/hooks/` — shared custom hooks (when created)
- `src/utils/` — pure utility functions, no React imports (when created)

## Design System

**Aesthetic:** Neo-modern — clean lines, bold typography, generous whitespace, dark/light section contrast, geometric decorative accents.

**Theme tokens** are defined in `@theme` block in `src/index.css`:
- Colors: `gallery-950` through `gallery-50` (dark to light neutrals), `accent` / `accent-light` / `accent-dark` (gold)
- Fonts: `font-display` (Playfair Display — headings), `font-body` (Inter — body text)
- Google Fonts are loaded via CDN in `index.html`

**Section pattern:** Every page section follows this structure:
```tsx
<section className="relative overflow-hidden bg-gallery-950 py-24">
  <GeometricDecor />  {/* optional decorative shapes */}
  <div className="relative mx-auto max-w-6xl px-6">
    <SectionHeading title="..." subtitle="..." isDark />
    {/* content */}
  </div>
</section>
```

Alternate between `bg-gallery-950` (dark, `text-white`) and `bg-white` (light) sections. Use `SectionHeading` for consistent section titles with gold accent divider.

## Key Conventions

- One component per file; filename matches the default export (PascalCase)
- Function declarations with default exports; no `React.FC`
- Props defined as `interface` directly above the component
- Tailwind CSS v4 utility-first styling — no component-scoped CSS files; Tailwind is a Vite plugin (no `tailwind.config.js`)
- Never use `any`; use `unknown` and narrow instead
- Prefer `interface` for object shapes, `type` for unions/intersections
- Use `import type` for type-only imports (`verbatimModuleSyntax` enforced)
- Event handlers: prefix with `handle` in owner component, callback props with `on`
- Booleans: prefix with `is`, `has`, `should`, `can`
- Constants: `UPPER_SNAKE_CASE` for compile-time constants, `camelCase` for runtime
- Static data (artworks, events, team members) defined as `const` arrays at module top

## Document-Driven Development

Design documents live in `documents/`. Templates in `documents/templates/` cover feature, enhancement, and bug-fix workflows. The recommended AI workflow is:

1. Requirements gathering
2. Pattern analysis — search existing code before designing
3. Design doc creation using appropriate template
4. Design review before implementation
5. Implementation following existing patterns
6. Testing, documentation update, commit

See `documents/ARCHITECTURE.md` for full architecture details and `documents/CODING_STANDARDS.md` for all coding conventions.

## TypeScript

Strict mode is on. The compiler enforces `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, and `verbatimModuleSyntax`. Target is ES2022 with `react-jsx` transform.

## Environment Variables

Client-accessible env vars must be prefixed with `VITE_` and accessed via `import.meta.env.VITE_*`.
