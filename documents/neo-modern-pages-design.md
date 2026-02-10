# Feature Design Document: Neo-Modern Page Redesign

> **Template version:** 1.0
> **Project:** Art Gallery (React / TypeScript / Vite)
> **Stack:** React 19, TypeScript 5.9, Vite 7, Tailwind CSS 4, React Router 7

---

## Metadata

| Field              | Value                                      |
|--------------------|--------------------------------------------|
| **Feature name**   | Neo-Modern Page Redesign                   |
| **Author**         | Claude Code                                |
| **Date**           | 2026-02-10                                 |
| **Status**         | Draft                                      |
| **Branch**         | main                                       |
| **PR**             | —                                          |

---

## 1. Overview & Pattern Analysis

### 1.1 Feature Goal

Redesign the Home, About, and Contact pages with a neo-modern aesthetic featuring bold typography, generous whitespace, dark/light section contrast, geometric decorative elements, and full responsiveness. Also update the RootLayout (header/footer) to match the new design language.

### 1.2 Expected Behavior

**Home Page (`/`):**
1. Hero section with full-bleed image carousel (auto-advances, manual navigation dots/arrows)
2. Newsletter signup section with email input and subscribe button
3. Upcoming events section displaying 2-3 event cards with date, title, and description

**About Page (`/about`):**
1. Hero banner with page title and mission statement
2. Gallery history section with narrative text
3. Team/curator section with card grid (photo placeholder, name, role, bio)

**Contact Page (`/contact`):**
1. Contact form with name, email, and message fields (client-side validation)
2. Gallery location info with address and hours
3. Map placeholder (styled div simulating a map embed)

**All Pages:**
- Alternating dark (stone-900) and light (white/stone-50) sections for visual contrast
- Geometric decorative shapes (circles, lines) as background accents
- Smooth scroll behavior and subtle entrance feel
- Mobile-first responsive design

### 1.3 Existing Pattern Analysis

**Patterns to reuse:**
- Function declarations with default exports (all existing pages)
- `useState` for local component state (GalleryPage pattern)
- Tailwind utility-first styling with no CSS files
- `max-w-6xl mx-auto px-6` container pattern from RootLayout
- Interface-above-component pattern for props
- `text-4xl font-bold` heading pattern

**Patterns to introduce:**
- Full-bleed sections that break out of the `max-w-6xl` container — requires RootLayout change to allow pages to control their own width
- `@theme` block in `index.css` for custom design tokens (colors, fonts)
- Shared reusable components in `src/components/` (currently empty)
- `useEffect` + `setInterval` for carousel auto-advance
- Form state management with `useState` and `handleSubmit`

**Key RootLayout change:** The current layout wraps `<Outlet />` in `max-w-6xl mx-auto px-6 py-12`. For full-bleed sections (hero carousel, dark bands), we need to remove this constraint from `<main>` and let each page control its own width. The layout will keep the header/footer constrained.

---

## 2. TypeScript Types & Data Model

### 2.1 Types

```typescript
// src/types/event.ts
export interface GalleryEvent {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  imageUrl: string;
}

// src/types/teamMember.ts
export interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
}

// src/types/carouselSlide.ts
export interface CarouselSlide {
  id: number;
  title: string;
  subtitle: string;
  imageUrl: string;
}
```

### 2.2 Data Source

All data is hardcoded as `const` arrays within each page component (same pattern as `ARTWORKS` in GalleryPage). No external API or MCP server calls needed.

### 2.3 State Management

| Component        | State                              | Approach              |
|------------------|------------------------------------|-----------------------|
| HomePage         | `currentSlide: number`             | `useState` + `useEffect` interval |
| ContactPage      | `formData: { name, email, message }` | `useState` object    |
| ContactPage      | `isSubmitted: boolean`             | `useState` for confirmation |

---

## 3. Components

### 3.1 New Shared Components (`src/components/`)

```typescript
// src/components/SectionHeading.tsx
interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  isDark?: boolean;  // light text on dark background
}

// src/components/GeometricDecor.tsx
// Renders SVG geometric shapes (circles, lines) as decorative accents
// No props — uses absolute positioning within parent
```

### 3.2 Page Components (New/Modified)

```
HomePage (rewrite)
├── Hero Carousel section (full-bleed)
│   ├── Slide images with overlay text
│   ├── Navigation dots
│   └── Prev/Next arrows
├── Newsletter section (dark background)
│   ├── SectionHeading
│   └── Email input + button
└── Upcoming Events section (light background)
    ├── SectionHeading
    └── Event cards (grid)

AboutPage (rewrite)
├── Hero banner section (dark background)
│   └── SectionHeading (mission statement)
├── History section (light background)
│   ├── GeometricDecor
│   └── Narrative text blocks
└── Team section (dark background)
    ├── SectionHeading
    └── Team member cards (grid)

ContactPage (rewrite)
├── Hero banner section (dark background)
│   └── SectionHeading
├── Contact form section (light background)
│   ├── Name input
│   ├── Email input
│   ├── Message textarea
│   └── Submit button
└── Location section (dark background)
    ├── Address & hours info
    └── Map placeholder
```

### 3.3 Modified Components

```
RootLayout (modify)
├── header — updated with neo-modern styling, mobile hamburger menu
├── main — remove max-w/padding constraints (pages own their layout)
└── footer — updated with neo-modern styling, dark background
```

---

## 4. Routes & Navigation

No new routes needed. Existing routes remain:

| Path       | Component    | Change   |
|------------|-------------|----------|
| `/`        | HomePage    | Rewrite  |
| `/gallery` | GalleryPage | No change |
| `/about`   | AboutPage   | Rewrite  |
| `/contact` | ContactPage | Rewrite  |

Navigation links in RootLayout header remain the same (Home, Gallery, About, Contact).

---

## 5. Styling

### 5.1 Design Tokens (`src/index.css`)

```css
@import "tailwindcss";

@theme {
  --color-gallery-950: #0a0a0a;
  --color-gallery-900: #1a1a1a;
  --color-gallery-800: #2a2a2a;
  --color-gallery-100: #f5f5f0;
  --color-gallery-50: #fafaf7;
  --color-accent: #c8a45e;
  --color-accent-light: #dfc07a;
  --font-display: "Playfair Display", Georgia, serif;
  --font-body: "Inter", system-ui, sans-serif;
}
```

### 5.2 Google Fonts

Add to `index.html` `<head>`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">
```

### 5.3 Neo-Modern Design Principles

| Principle            | Implementation                                         |
|----------------------|--------------------------------------------------------|
| **Bold typography**  | `font-display` for headings (5xl-7xl), `font-body` for text |
| **Generous whitespace** | `py-24` to `py-32` section padding                  |
| **Dark/light contrast** | Alternating `bg-gallery-950` and `bg-white` sections |
| **Geometric accents**   | Absolute-positioned SVG circles/lines with low opacity |
| **Gold accent color**   | CTAs, hover states, decorative elements use `accent`  |
| **Clean lines**         | Minimal borders, `rounded-xl` to `rounded-2xl` cards  |
| **Responsive**          | Mobile-first: single column -> multi-column grids     |

### 5.4 Section Pattern

Every section follows this structure:
```tsx
<section className="relative bg-gallery-950 py-24 text-white overflow-hidden">
  {/* Optional GeometricDecor */}
  <div className="mx-auto max-w-6xl px-6">
    {/* Section content */}
  </div>
</section>
```

---

## 6. Testing

No test runner configured yet. Manual testing checklist:

- [ ] All pages render without TypeScript errors (`npm run build`)
- [ ] Carousel auto-advances and manual controls work
- [ ] Newsletter form captures email (logs to console for now)
- [ ] Contact form validates required fields
- [ ] Contact form shows success message on submit
- [ ] All sections display correctly on mobile (375px)
- [ ] All sections display correctly on tablet (768px)
- [ ] All sections display correctly on desktop (1280px)
- [ ] Dark/light section contrast renders properly
- [ ] Navigation links work between all pages
- [ ] Images load with proper alt text

### 6.1 Implementation Checklist

- [ ] Custom theme tokens added to `index.css`
- [ ] Google Fonts added to `index.html`
- [ ] `SectionHeading` component created
- [ ] `GeometricDecor` component created
- [ ] RootLayout updated (full-bleed support, neo-modern header/footer)
- [ ] HomePage rewritten (carousel, newsletter, events)
- [ ] AboutPage rewritten (history, team)
- [ ] ContactPage rewritten (form, location, map)
- [ ] Type interfaces created in `src/types/`
- [ ] Responsive design verified at all breakpoints
- [ ] `npm run build` passes
- [ ] `npm run lint` passes

---

## 7. Dependencies

```bash
# No new npm dependencies required
# Google Fonts loaded via CDN link in index.html
```

---

## 8. Security Considerations

- [ ] No secrets or API keys in source code
- [ ] Contact form does not use `dangerouslySetInnerHTML`
- [ ] Form inputs sanitized (standard React controlled inputs handle this)
- [ ] Newsletter email validated client-side before any future API integration
- [ ] External font URLs use `crossorigin` attribute

---

## 9. Rollback Plan

1. Revert changes to `RootLayout.tsx`, `HomePage.tsx`, `AboutPage.tsx`, `ContactPage.tsx`
2. Revert `index.css` theme tokens and `index.html` font links
3. Delete new files: `src/components/SectionHeading.tsx`, `src/components/GeometricDecor.tsx`, `src/types/*.ts`
4. No data migration needed — all data is hardcoded

---

## 10. Implementation Order

Recommended sequence to minimize broken states:

1. **Theme foundation** — `index.css` tokens + `index.html` font links
2. **Shared components** — `SectionHeading`, `GeometricDecor`
3. **Type definitions** — `src/types/` interfaces
4. **RootLayout** — Updated header/footer + full-bleed `<main>`
5. **HomePage** — Carousel, newsletter, events
6. **AboutPage** — History, team
7. **ContactPage** — Form, location, map
8. **Verify** — `npm run build` + `npm run lint` + visual review
