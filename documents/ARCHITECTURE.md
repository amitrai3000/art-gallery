# Art Gallery — Architecture

## 1. Project Overview

The Art Gallery is a multi-page React application for browsing artwork, learning about the gallery, and contacting the team. It is part of the "Art of Vibe Coding" workshop and serves as a hands-on project for practicing Document-Driven Development with AI-assisted tooling.

### Goals

- Provide a clean, responsive gallery experience with Home, About, and Contact pages.
- Keep the frontend simple: no external state library, no backend framework — just React, TypeScript, and Tailwind CSS served by Vite.
- Remain easy to extend — new pages, components, or data sources (e.g., an MCP server backed by PostgreSQL) can be added without restructuring.

### Tech Stack

| Layer       | Technology                        | Version  |
|-------------|-----------------------------------|----------|
| Runtime     | React                             | 19.x     |
| Language    | TypeScript (strict mode)          | 5.9      |
| Build tool  | Vite                              | 7.x      |
| Styling     | Tailwind CSS (Vite plugin)        | 4.x      |
| Routing     | React Router                      | 7.x      |
| Linting     | ESLint + typescript-eslint        | 9.x      |

---

## 2. Folder Structure

```
art-gallery/
├── public/                  # Static assets served as-is (favicons, robots.txt)
├── src/
│   ├── assets/              # Images, SVGs, and other files imported by components
│   ├── components/          # Shared, reusable UI components
│   ├── layouts/
│   │   └── RootLayout.tsx   # App shell: header nav, <Outlet />, footer
│   ├── pages/
│   │   ├── HomePage.tsx     # "/" — landing page
│   │   ├── AboutPage.tsx    # "/about" — gallery info
│   │   └── ContactPage.tsx  # "/contact" — contact form
│   ├── App.tsx              # Router definition and route-to-layout mapping
│   ├── main.tsx             # React entry point (StrictMode, createRoot)
│   └── index.css            # Tailwind CSS import
├── documents/
│   ├── ARCHITECTURE.md      # This file
│   └── templates/           # Design document templates (feature, enhancement, bug fix)
├── index.html               # Vite HTML entry point
├── vite.config.ts           # Vite + React + Tailwind plugin config
├── tsconfig.json            # TypeScript project references root
├── tsconfig.app.json        # App-level TS config (strict, ES2022, react-jsx)
├── tsconfig.node.json       # Node-level TS config (for vite.config.ts)
├── eslint.config.js         # Flat ESLint config
└── package.json
```

### Conventions

- **One component per file.** The filename matches the default export (`HomePage.tsx` exports `HomePage`).
- **Pages vs. components.** A page is a routable view (`src/pages/`). A component is a reusable piece of UI that can appear on any page (`src/components/`).
- **Layouts wrap pages.** Layouts live in `src/layouts/` and use React Router's `<Outlet />` to render their child routes.
- **Flat within folders.** Avoid deep nesting. If a component grows complex enough to need sub-files, co-locate them in a folder named after the component (e.g., `src/components/Carousel/`).

---

## 3. Component Structure and Hierarchy

```
main.tsx
└── <StrictMode>
    └── <App>                         ← BrowserRouter + Routes
        └── <RootLayout>              ← shared header, footer, <Outlet />
            ├── <HomePage />          ← "/"
            ├── <AboutPage />         ← "/about"
            └── <ContactPage />       ← "/contact"
```

### RootLayout

`RootLayout` (`src/layouts/RootLayout.tsx`) is the app shell. It renders:

1. **Header** — site title linking to `/`, navigation links (Home, About, Contact).
2. **Main** — a centered, max-width container that renders `<Outlet />` (the matched child route).
3. **Footer** — copyright with the current year.

All pages are rendered inside this layout. If a future page needs a different shell (e.g., a full-bleed gallery view), add a second layout and a separate `<Route>` branch in `App.tsx`.

### Adding a New Page

1. Create `src/pages/NewPage.tsx` with a default export.
2. Add a `<Route>` inside the `<Route element={<RootLayout />}>` block in `App.tsx`.
3. Add a `<Link>` to the nav in `RootLayout.tsx`.

### Adding a Shared Component

1. Create `src/components/ComponentName.tsx`.
2. Define a `Props` interface and export the component as a named or default export.
3. Import it from any page or layout that needs it.

---

## 4. State Management

### Current Approach

The app currently has no shared state. Each page is a self-contained component with no props from the router (aside from URL params when needed).

### Guidelines for Growth

| Scope | Tool | When to use |
|-------|------|-------------|
| Single component | `useState` | Form inputs, toggles, local UI state |
| Derived / expensive values | `useMemo` | Filtering a list, computing totals |
| Cross-component (parent → child) | Props | Passing data down 1–2 levels |
| App-wide (theme, auth, user) | React Context + `useContext` | Data needed by many unrelated components |
| Server data (fetch, cache, sync) | Custom hook or a data library | When an MCP server or API is integrated |

**Guiding principle:** start with the simplest tool that works. Do not add a global store (Redux, Zustand, etc.) unless prop-drilling or Context becomes clearly painful across many components.

---

## 5. Routing Structure

Routing is handled by React Router v7 with `BrowserRouter` (HTML5 history API).

### Route Table

| Path        | Component       | Layout       |
|-------------|-----------------|--------------|
| `/`         | `HomePage`      | `RootLayout` |
| `/about`    | `AboutPage`     | `RootLayout` |
| `/contact`  | `ContactPage`   | `RootLayout` |

### How It Works

```tsx
// src/App.tsx
<BrowserRouter>
  <Routes>
    <Route element={<RootLayout />}>      {/* layout route — no path */}
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
    </Route>
  </Routes>
</BrowserRouter>
```

- `RootLayout` is a **layout route** (no `path` prop). It renders for every child route and injects the child via `<Outlet />`.
- Navigation between pages uses `<Link to="...">` from `react-router-dom`, which performs client-side transitions without a full page reload.

### Future Considerations

- **Dynamic routes:** e.g., `/artworks/:id` for artwork detail pages. Add as a child of the existing layout route.
- **404 handling:** Add a catch-all `<Route path="*" element={<NotFoundPage />} />` as the last child.
- **Nested layouts:** If a section (e.g., `/admin/*`) needs its own layout, create a new layout component and a nested `<Route>` branch.

---

## 6. Styling Approach

### Tailwind CSS v4

Tailwind is integrated as a Vite plugin — no `tailwind.config.js` or `postcss.config.js` required.

**Configuration:**

```ts
// vite.config.ts
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

```css
/* src/index.css */
@import "tailwindcss";
```

### Conventions

- **Utility-first.** Style elements with Tailwind classes directly in JSX. Avoid writing custom CSS unless it is truly necessary (e.g., complex animations).
- **Consistent spacing.** Use the default Tailwind scale (`px-6`, `py-4`, `gap-6`, `py-12`). The layout uses `max-w-6xl mx-auto` for a centered content column.
- **Responsive design.** Use Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`) on the element that needs to change. Mobile-first: the unprefixed class is the mobile style.
- **No component-scoped CSS files.** The old `App.css` pattern is removed. All styling goes through Tailwind utility classes.

### Custom Theme Extensions

If the project needs custom colors, fonts, or spacing beyond Tailwind's defaults, add a `@theme` block in `src/index.css`:

```css
@import "tailwindcss";

@theme {
  --color-gallery-accent: #4f46e5;
  --font-family-display: "Playfair Display", serif;
}
```

These tokens then become available as utilities (`bg-gallery-accent`, `font-display`).

---

## 7. Development vs. Production

### Development (`npm run dev`)

- **Vite dev server** with Hot Module Replacement (HMR). Changes to components, styles, and CSS are reflected instantly without a full reload.
- **No TypeScript emit.** Vite transpiles `.tsx` on the fly via esbuild. Type-checking happens separately via `tsc`.
- **Source maps** are enabled by default for easier debugging.
- **Runs at** `http://localhost:5173/` by default.

### Production (`npm run build`)

- **Two-step build:** `tsc -b` (type-check, zero output) followed by `vite build` (bundle, minify, tree-shake).
- **Output directory:** `dist/` (git-ignored).
- **Assets are hashed:** filenames include content hashes for cache-busting (e.g., `index-DXqmJuet.js`).
- **CSS is extracted and minified** by Tailwind's Vite plugin. Unused utilities are automatically excluded.
- **Preview locally** with `npm run preview` to serve the `dist/` folder.

### Linting (`npm run lint`)

ESLint with flat config (`eslint.config.js`) runs `typescript-eslint` recommended rules, React Hooks rules, and React Refresh validation across all `.ts` and `.tsx` files.

### Scripts Summary

| Script          | Command              | Purpose                              |
|-----------------|----------------------|--------------------------------------|
| `npm run dev`   | `vite`               | Start dev server with HMR            |
| `npm run build` | `tsc -b && vite build` | Type-check then bundle for production |
| `npm run lint`  | `eslint .`           | Lint all TypeScript files            |
| `npm run preview` | `vite preview`     | Serve production build locally       |

### Environment Variables

Vite exposes env vars prefixed with `VITE_` to client code via `import.meta.env`. Store secrets and server-side-only values outside this prefix (they will not be bundled).

```
# .env (git-ignored)
VITE_API_BASE_URL=http://localhost:8001
```

```typescript
const url = import.meta.env.VITE_API_BASE_URL;
```

---

## 8. Future Extension Points

These are not implemented yet but represent natural next steps:

| Area | Approach |
|------|----------|
| **Artwork data** | Fetch from a PostgreSQL MCP server; define an `Artwork` type in `src/types/` |
| **Image generation** | Integrate the NanoBanana / Gemini MCP server for AI-generated artwork |
| **Testing** | Add Vitest + React Testing Library; co-locate tests as `__tests__/` folders or `.test.tsx` siblings |
| **Error boundary** | Add a top-level `ErrorBoundary` component wrapping `<Outlet />` in the layout |
| **404 page** | Add a `NotFoundPage` and a `path="*"` catch-all route |
