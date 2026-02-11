# Feature Design Document: Artwork Detail Page

> **Template version:** 1.0
> **Project:** Art Gallery (React / TypeScript / Vite)
> **Stack:** React 19, TypeScript 5.9, Vite 7, Tailwind CSS 4, React Router 7

---

## Metadata

| Field              | Value                          |
|--------------------|--------------------------------|
| **Feature name**   | Artwork Detail Page            |
| **Author**         | AI-assisted                    |
| **Date**           | 2026-02-10                     |
| **Status**         | Draft                          |
| **Branch**         | feature/artwork-detail-page    |
| **PR**             | —                              |

---

## 1. Overview & Pattern Analysis

### 1.1 Feature Goal

Allow visitors to view a single artwork in a dedicated, full-page layout with a large image, artist name, title, medium, year, and a descriptive paragraph. The page is reached via `/artwork/:id` and includes navigation back to the gallery.

### 1.2 Expected Behavior

1. User clicks an artwork card on the **Gallery page** (or any future link to an artwork).
2. App navigates to `/artwork/:id` (e.g., `/artwork/3`).
3. The detail page displays:
   - The artwork image in a large, prominent format.
   - The artwork title (display font, large).
   - The artist name, year, and medium.
   - A descriptive paragraph about the artwork / artist.
   - A "Back to Gallery" link.
4. If the artwork ID does not match any known artwork, the user sees a "not found" fallback message with a link back to the gallery.
5. The page follows the neo-modern aesthetic with alternating dark/light sections.

### 1.3 Existing Pattern Analysis

**Routing (`src/App.tsx`):** All routes are nested inside `<Route element={<RootLayout />}>`. The new route follows this pattern exactly.

**Pages (`src/pages/`):** Each page is a single default-export function component. Data is defined as `const` arrays at the module top (e.g., `ARTWORKS` in `GalleryPage.tsx`, `SLIDES` and `UPCOMING_EVENTS` in `HomePage.tsx`).

**Artwork data (`GalleryPage.tsx:3-10`):** An `Artwork` interface already exists locally in `GalleryPage.tsx` with fields `id`, `title`, `artist`, `year`, `medium`, and `imageUrl`. This will be extracted to a shared type and extended with a `description` field.

**Gallery card click (`GalleryPage.tsx:111-130`):** Cards currently open a lightbox via `onClick`. These will be converted to `<Link>` elements pointing to the detail route.

**Shared components:** `SectionHeading` and `GeometricDecor` are used across pages for consistent section styling.

**Section pattern:** Pages alternate between `bg-gallery-950` (dark) and `bg-white` (light) full-width sections with `mx-auto max-w-6xl px-6` inner containers.

**Nav links (`RootLayout.tsx:4-9`):** The `NAV_LINKS` array drives desktop nav, mobile menu, and footer. The artwork detail page is a child route — it does **not** need a nav link entry.

---

## 2. TypeScript Types & Data Model

### 2.1 Shared Artwork Interface

Extract and extend the existing `Artwork` interface into a shared type file:

```typescript
// src/types/artwork.ts
export interface Artwork {
  id: number;
  title: string;
  artist: string;
  year: string;
  medium: string;
  imageUrl: string;
  description: string;
}
```

**Changes from current interface:**
- `description` added as a **required** `string` field (each artwork gets a paragraph about the piece or artist).
- Moved from local in `GalleryPage.tsx` to shared `src/types/artwork.ts`.

### 2.2 Artwork Data

The `ARTWORKS` array in `GalleryPage.tsx` will be moved to a shared data file so both the Gallery page and the Detail page can access it:

```typescript
// src/data/artworks.ts
import type { Artwork } from '../types/artwork';

export const ARTWORKS: Artwork[] = [
  {
    id: 1,
    title: 'Starry Night',
    artist: 'Vincent van Gogh',
    year: '1889',
    medium: 'Oil on canvas',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/800px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg',
    description: 'Painted in June 1889, Starry Night depicts the view from the east-facing window of Van Gogh\'s asylum room at Saint-Remy-de-Provence. The swirling night sky, luminous stars, and crescent moon create one of the most recognized images in Western art.',
  },
  {
    id: 2,
    title: 'The Great Wave off Kanagawa',
    artist: 'Katsushika Hokusai',
    year: '1831',
    medium: 'Woodblock print',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Tsunami_by_hokusai_19th_century.jpg/800px-Tsunami_by_hokusai_19th_century.jpg',
    description: 'Part of Hokusai\'s series "Thirty-six Views of Mount Fuji," this iconic woodblock print shows a towering wave threatening boats near Kanagawa. The composition masterfully balances nature\'s power with the distant serenity of Mount Fuji.',
  },
  {
    id: 3,
    title: 'Girl with a Pearl Earring',
    artist: 'Johannes Vermeer',
    year: '1665',
    medium: 'Oil on canvas',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/1665_Girl_with_a_Pearl_Earring.jpg/800px-1665_Girl_with_a_Pearl_Earring.jpg',
    description: 'Often called the "Mona Lisa of the North," Vermeer\'s masterpiece captures a girl in a blue and gold turban, glancing over her shoulder with an enigmatic expression. The luminous pearl earring is a focal point of this intimate portrait.',
  },
  {
    id: 4,
    title: 'The Birth of Venus',
    artist: 'Sandro Botticelli',
    year: '1485',
    medium: 'Tempera on canvas',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg/800px-Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg',
    description: 'Botticelli\'s Renaissance masterpiece depicts the goddess Venus emerging from the sea as a fully grown woman. Commissioned by the Medici family, it is one of the most celebrated examples of Italian Renaissance painting.',
  },
  {
    id: 5,
    title: 'The Persistence of Memory',
    artist: 'Salvador Dali',
    year: '1931',
    medium: 'Oil on canvas',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/d/dd/The_Persistence_of_Memory.jpg',
    description: 'Dali\'s surrealist icon features melting pocket watches draped across a dreamlike landscape. The painting explores the fluidity of time and the unreliability of perception, becoming a defining image of the Surrealist movement.',
  },
  {
    id: 6,
    title: 'A Sunday Afternoon on the Island of La Grande Jatte',
    artist: 'Georges Seurat',
    year: '1886',
    medium: 'Oil on canvas',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/A_Sunday_on_La_Grande_Jatte%2C_Georges_Seurat%2C_1884.jpg/800px-A_Sunday_on_La_Grande_Jatte%2C_Georges_Seurat%2C_1884.jpg',
    description: 'Seurat\'s monumental painting pioneered the Pointillist technique, using tiny dots of color to build a luminous scene of Parisians relaxing on the banks of the Seine. The work took over two years to complete.',
  },
];
```

### 2.3 Data Source & State Management

- **Data source:** Static `const` array in `src/data/artworks.ts` (no API, no database).
- **Lookup:** A helper function `findArtworkById` or direct `.find()` on the array using the `:id` route param.
- **State:** No component state needed — the artwork is derived synchronously from the static array and the URL param. If the ID doesn't match, render the not-found fallback.

---

## 3. Components

### 3.1 New Components

```typescript
// src/pages/ArtworkDetailPage.tsx
// No props — uses useParams() to get the artwork ID
// Default export function component

// src/components/ArtworkNotFound.tsx
// No props — self-contained fallback with a "Back to Gallery" link
```

### 3.2 Modified Components

```typescript
// src/pages/GalleryPage.tsx
// - Remove local Artwork interface (use shared type)
// - Remove local ARTWORKS array (import from src/data/artworks)
// - Convert artwork card <button> to <Link to={`/artwork/${artwork.id}`}>
// - Remove Lightbox component (no longer needed)
```

### 3.3 Component Tree — ArtworkDetailPage

```
ArtworkDetailPage
├── (not-found path) ArtworkNotFound
│   └── Link → /gallery
└── (found path)
    ├── Section: dark hero (bg-gallery-950)
    │   ├── GeometricDecor
    │   ├── "Back to Gallery" Link
    │   └── Two-column grid (lg)
    │       ├── Artwork image (rounded, shadow)
    │       └── Metadata panel
    │           ├── Title (font-display, large)
    │           ├── Artist name
    │           ├── Year · Medium (accent color)
    │           └── Description paragraph
    └── Section: light (bg-white) — optional related artworks (future)
```

---

## 4. Routes & Navigation

### 4.1 New Route

```typescript
// src/App.tsx — add inside <Route element={<RootLayout />}>
<Route path="/artwork/:id" element={<ArtworkDetailPage />} />
```

This is a **child route** of the layout wrapper, so it inherits the header and footer.

### 4.2 Navigation Triggers

**Primary entry point — Gallery page cards:**

```tsx
// In GalleryPage.tsx — replace <button> with <Link>
import { Link } from 'react-router-dom';

<Link
  to={`/artwork/${artwork.id}`}
  className="group overflow-hidden rounded-xl border border-gray-200 bg-white text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
>
  {/* existing card content */}
</Link>
```

**Back navigation — Detail page:**

```tsx
// In ArtworkDetailPage.tsx
import { Link } from 'react-router-dom';

<Link
  to="/gallery"
  className="inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-accent"
>
  <svg className="h-4 w-4" /* left arrow icon */ />
  Back to Gallery
</Link>
```

### 4.3 NAV_LINKS

No changes to `NAV_LINKS` — the artwork detail page is not a top-level nav destination.

---

## 5. Error Handling — 404 Not Found

### 5.1 Invalid ID Scenarios

The `:id` route param must be validated. Three cases produce a not-found state:

| Scenario                        | Example URL          | Cause                          |
|---------------------------------|----------------------|--------------------------------|
| Non-numeric ID                  | `/artwork/abc`       | `Number(id)` returns `NaN`     |
| Numeric but no matching artwork | `/artwork/999`       | `.find()` returns `undefined`  |
| Missing param                   | `/artwork/`          | React Router won't match route |

The third case is already handled by React Router — `/artwork/` does not match `/artwork/:id`, so no extra code is needed.

### 5.2 Validation Logic in ArtworkDetailPage

```typescript
import { useParams, Link } from 'react-router-dom';
import { ARTWORKS } from '../data/artworks';
import ArtworkNotFound from '../components/ArtworkNotFound';

export default function ArtworkDetailPage() {
  const { id } = useParams<{ id: string }>();
  const numericId = Number(id);
  const artwork = Number.isNaN(numericId)
    ? undefined
    : ARTWORKS.find((a) => a.id === numericId);

  if (!artwork) {
    return <ArtworkNotFound />;
  }

  // ... render artwork detail
}
```

Key points:
- Parse `id` with `Number()` and guard against `NaN` before searching.
- If no artwork matches, render `ArtworkNotFound` immediately — no loading spinner needed since data is static.

### 5.3 ArtworkNotFound Component

A full-page fallback that matches the neo-modern aesthetic:

```typescript
// src/components/ArtworkNotFound.tsx
import { Link } from 'react-router-dom';
import GeometricDecor from './GeometricDecor';

export default function ArtworkNotFound() {
  return (
    <section className="relative overflow-hidden bg-gallery-950 py-32">
      <GeometricDecor />
      <div className="relative mx-auto max-w-6xl px-6 text-center">
        <h1 className="font-display text-6xl font-bold text-white">404</h1>
        <p className="mt-4 text-xl text-gray-400">
          Artwork not found
        </p>
        <p className="mt-2 text-gray-500">
          The piece you're looking for isn't in our collection,
          or the link may be incorrect.
        </p>
        <Link
          to="/gallery"
          className="mt-8 inline-block rounded-full bg-accent px-8 py-3 text-sm font-semibold text-gallery-950 transition-colors hover:bg-accent-light"
        >
          Browse Gallery
        </Link>
      </div>
    </section>
  );
}
```

**Design choices:**
- Uses `bg-gallery-950` dark section with `GeometricDecor` to stay on-brand.
- Large "404" heading makes it immediately clear what happened.
- Friendly copy — doesn't blame the user.
- CTA button links back to `/gallery` (not home) since the user was looking for an artwork.

---

## 6. Styling

### 6.1 Layout

The detail page uses the standard full-bleed section pattern:

- **Hero section** (`bg-gallery-950`, dark): Contains the artwork image and metadata in a responsive two-column grid (`lg:grid-cols-2`). On mobile, content stacks vertically (image on top, metadata below).
- **GeometricDecor** for subtle background visual interest.

### 6.2 Image Presentation

```
rounded-2xl shadow-2xl overflow-hidden
max-h-[70vh] w-full object-contain bg-gallery-900
```

The image uses `object-contain` so the full artwork is visible regardless of aspect ratio, with a dark background behind it.

### 6.3 Typography

| Element      | Classes                                                    |
|--------------|------------------------------------------------------------|
| Title        | `font-display text-4xl font-bold text-white sm:text-5xl`  |
| Artist       | `text-xl text-gray-300`                                    |
| Year/Medium  | `text-sm font-medium uppercase tracking-wider text-accent` |
| Description  | `text-base leading-relaxed text-gray-400`                  |
| Back link    | `text-sm text-gray-400 hover:text-accent`                  |

### 6.4 Responsive Behavior

| Breakpoint | Layout                                         |
|------------|-------------------------------------------------|
| Mobile     | Single column: image stacked above metadata     |
| `lg:` +    | Two-column grid: image left, metadata right     |

---

## 7. Testing

> **Note:** No test runner is configured yet. When Vitest is added, the following tests should be written.

```typescript
// src/pages/__tests__/ArtworkDetailPage.test.tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ArtworkDetailPage from '../ArtworkDetailPage';

describe('ArtworkDetailPage', () => {
  const renderWithRouter = (id: string) =>
    render(
      <MemoryRouter initialEntries={[`/artwork/${id}`]}>
        <Routes>
          <Route path="/artwork/:id" element={<ArtworkDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

  it('renders artwork details for a valid id', () => {
    renderWithRouter('1');
    expect(screen.getByText('Starry Night')).toBeInTheDocument();
    expect(screen.getByText('Vincent van Gogh')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'Starry Night');
  });

  it('renders 404 fallback for a numeric id with no matching artwork', () => {
    renderWithRouter('999');
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText(/artwork not found/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /browse gallery/i })).toHaveAttribute('href', '/gallery');
  });

  it('renders 404 fallback for a non-numeric id', () => {
    renderWithRouter('abc');
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText(/artwork not found/i)).toBeInTheDocument();
  });

  it('includes a back-to-gallery link', () => {
    renderWithRouter('1');
    const backLink = screen.getByRole('link', { name: /back to gallery/i });
    expect(backLink).toHaveAttribute('href', '/gallery');
  });
});
```

### 7.1 Implementation Checklist

- [ ] Create shared `Artwork` type in `src/types/artwork.ts`
- [ ] Create shared artwork data in `src/data/artworks.ts`
- [ ] Create `ArtworkDetailPage` in `src/pages/ArtworkDetailPage.tsx`
- [ ] Create `ArtworkNotFound` in `src/components/ArtworkNotFound.tsx`
- [ ] Add `/artwork/:id` route to `App.tsx`
- [ ] Update `GalleryPage.tsx` to use shared data and `<Link>` navigation
- [ ] Remove `Lightbox` component from `GalleryPage.tsx`
- [ ] 404 handling: non-numeric IDs, out-of-range IDs, friendly fallback page
- [ ] Loading and error states handled (not-found fallback)
- [ ] Responsive design verified (mobile, tablet, desktop)
- [ ] Accessibility checked (alt text, keyboard nav, semantic headings)
- [ ] Documentation updated

---

## 8. Dependencies

```bash
# No new dependencies — uses existing React Router, Tailwind CSS, and React
```

---

## 9. Security Considerations

- [x] No secrets or API keys in source code
- [x] No user-generated content — all data is static
- [x] Route param `:id` is validated (parsed to number, checked against known IDs) before use
- [x] External image URLs are used via `<img>` tags (no script injection risk)

---

## 10. Rollback Plan

1. Revert the feature branch merge.
2. Remove the `/artwork/:id` route from `App.tsx`.
3. Delete new files: `ArtworkDetailPage.tsx`, `ArtworkNotFound.tsx`, `src/types/artwork.ts`, `src/data/artworks.ts`.
4. Restore `GalleryPage.tsx` to use its local `Artwork` interface, `ARTWORKS` array, `Lightbox` component, and `<button>` cards.

---

## 11. AI Assistant Workflow

1. **Requirements:** Confirmed — detail page for individual artworks with image, metadata, description, back navigation, and neo-modern styling.
2. **Pattern Analysis:** Completed — reuses `SectionHeading`, `GeometricDecor`, full-bleed section pattern, and existing `Artwork` data structure.
3. **Design:** This document.
4. **Design Review:** Awaiting approval before implementation.
5. **Implementation:** Follow the checklist in section 7.1.
6. **Testing:** Write tests when Vitest is configured.
7. **Documentation:** Update `ARCHITECTURE.md` with new route and components.
8. **Commit:** Feature branch `feature/artwork-detail-page`.
