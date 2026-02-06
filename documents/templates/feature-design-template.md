# Feature Design Document

> **Template version:** 1.0
> **Project:** Art Gallery (React / TypeScript / Vite)
> **Stack:** React 18, TypeScript 5, Vite, Tailwind CSS, React Router 6

---

## Metadata

| Field              | Value                          |
|--------------------|--------------------------------|
| **Feature name**   | _e.g., Artwork Detail Page_    |
| **Author**         |                                |
| **Date**           |                                |
| **Status**         | Draft / In Review / Approved / Implemented |
| **Branch**         |                                |
| **PR**             |                                |

---

## 1. Overview & Pattern Analysis

### 1.1 Feature Goal

_Describe what the feature does and why it exists. One or two sentences._

> **Example:** Allow visitors to view a full-size artwork with title, artist, medium, and year. Clicking a card on the Home carousel navigates to this detail page.

### 1.2 Expected Behavior

_Describe the user-visible behavior end to end._

> **Example:**
> 1. User clicks an artwork card on the Home page carousel.
> 2. App navigates to `/artworks/:id`.
> 3. The detail page shows the full artwork image, title, artist, medium, year, and a "Back to Gallery" link.
> 4. If the artwork ID is invalid, the user sees a 404-style fallback component.

### 1.3 Existing Pattern Analysis

> **CRITICAL:** Before designing, search the codebase for similar patterns. Check:
> - `src/pages/` for existing page components and routing conventions.
> - `src/components/` for reusable UI patterns (cards, layouts, loading states).
> - `src/types/` for existing TypeScript interfaces.
> - `src/App.tsx` for route definitions and layout structure.
> - Any existing design docs in `documents/`.

_Document findings here. Note which patterns to reuse and which are new._

---

## 2. TypeScript Types & Data Model

_Define the types and interfaces this feature introduces or extends._

> **Example:**
> ```typescript
> // src/types/artwork.ts
> export interface Artwork {
>   id: string;
>   title: string;
>   artist: string;
>   medium: string;
>   year: number;
>   imageUrl: string;
>   description?: string;
> }
> ```

### 2.1 Data Source

_Where does the data come from? Local state, context, MCP server, external API?_

> **Example:** Artwork data is fetched from the PostgreSQL MCP server via a `get_artwork` tool call. During development, a local JSON fixture in `src/data/artworks.json` is used as a stub.

### 2.2 State Management

_Describe how state is managed. Prefer the simplest approach that works._

> **Example:** Component-local state via `useState` and `useEffect` for the fetch. No global store needed.
> ```typescript
> const [artwork, setArtwork] = useState<Artwork | null>(null);
> const [loading, setLoading] = useState(true);
> const [error, setError] = useState<string | null>(null);
>
> useEffect(() => {
>   fetchArtwork(id).then(setArtwork).catch(e => setError(e.message)).finally(() => setLoading(false));
> }, [id]);
> ```

---

## 3. Components

_List every new or modified component with its props interface._

> **Example:**
> ```typescript
> // src/pages/ArtworkDetailPage.tsx
> interface ArtworkDetailPageProps {}  // uses useParams() for id
>
> // src/components/ArtworkDetail.tsx
> interface ArtworkDetailProps {
>   artwork: Artwork;
> }
>
> // src/components/ErrorFallback.tsx  (reusable)
> interface ErrorFallbackProps {
>   title: string;
>   message: string;
> }
> ```

### 3.1 Component Tree

_Show the nesting for this feature._

> **Example:**
> ```
> ArtworkDetailPage
> ├── LoadingSpinner        (existing, reused)
> ├── ErrorFallback         (new, reusable)
> └── ArtworkDetail         (new)
>     ├── img               (artwork image)
>     └── metadata section  (title, artist, medium, year)
> ```

---

## 4. Routes & Navigation

_Define new or modified routes._

> **Example:**
> ```typescript
> // src/App.tsx – add to <Routes>
> <Route path="/artworks/:id" element={<ArtworkDetailPage />} />
> ```

### 4.1 Navigation Triggers

_How does the user reach this route?_

> **Example:**
> ```tsx
> // In CarouselCard component
> import { Link } from 'react-router-dom';
>
> <Link to={`/artworks/${artwork.id}`} className="block">
>   {/* card content */}
> </Link>
> ```

---

## 5. Styling

_Describe the Tailwind approach. Reference existing design tokens or patterns._

> **Example:** Follow the neo-modern / abstract aesthetic. Use `max-w-4xl mx-auto` for centering, `rounded-2xl shadow-lg` for the image container, and `font-serif` for the artwork title to match the Home page typography.

---

## 6. Testing

_Write tests using Vitest and React Testing Library._

> **Example:**
> ```typescript
> // src/pages/__tests__/ArtworkDetailPage.test.tsx
> import { render, screen, waitFor } from '@testing-library/react';
> import { MemoryRouter, Route, Routes } from 'react-router-dom';
> import { ArtworkDetailPage } from '../ArtworkDetailPage';
> import { vi } from 'vitest';
>
> // Mock the data fetch
> vi.mock('../../data/artworks', () => ({
>   fetchArtwork: vi.fn().mockResolvedValue({
>     id: '1', title: 'Starry Night', artist: 'Van Gogh',
>     medium: 'Oil on canvas', year: 1889,
>     imageUrl: '/images/starry-night.jpg',
>   }),
> }));
>
> describe('ArtworkDetailPage', () => {
>   const renderWithRouter = (id: string) =>
>     render(
>       <MemoryRouter initialEntries={[`/artworks/${id}`]}>
>         <Routes>
>           <Route path="/artworks/:id" element={<ArtworkDetailPage />} />
>         </Routes>
>       </MemoryRouter>
>     );
>
>   it('renders artwork details after loading', async () => {
>     renderWithRouter('1');
>     await waitFor(() => {
>       expect(screen.getByText('Starry Night')).toBeInTheDocument();
>       expect(screen.getByText('Van Gogh')).toBeInTheDocument();
>     });
>   });
>
>   it('shows error fallback for invalid id', async () => {
>     // override mock to reject
>     renderWithRouter('999');
>     await waitFor(() => {
>       expect(screen.getByText(/not found/i)).toBeInTheDocument();
>     });
>   });
> });
> ```

### 6.1 Implementation Checklist

- [ ] TypeScript types defined
- [ ] Components created
- [ ] Route added to `App.tsx`
- [ ] Navigation links wired up
- [ ] Loading and error states handled
- [ ] Tests written and passing
- [ ] Responsive design verified (mobile, tablet, desktop)
- [ ] Accessibility checked (alt text, keyboard nav, focus management)
- [ ] Documentation updated

---

## 7. Dependencies

_List any new packages._

> **Example:**
> ```bash
> # No new dependencies for this feature
> ```
>
> If dependencies are needed:
> ```bash
> npm install some-package
> npm install -D @types/some-package
> ```

---

## 8. Security Considerations

- [ ] No secrets or API keys in source code (use `.env` and `VITE_` prefix)
- [ ] User-generated content is sanitized before rendering (avoid `dangerouslySetInnerHTML`)
- [ ] External URLs use `rel="noopener noreferrer"` on `target="_blank"` links
- [ ] Route params are validated before use

---

## 9. Rollback Plan

_How to revert if something goes wrong._

> **Example:**
> 1. Revert the PR branch merge.
> 2. Remove the route from `App.tsx`.
> 3. Delete new component files (`ArtworkDetailPage.tsx`, `ArtworkDetail.tsx`).
> 4. No data migration needed; data source is unchanged.

---

## 10. AI Assistant Workflow

When implementing this feature, follow this lifecycle:

1. **Requirements:** Confirm the feature goal and acceptance criteria with the user.
2. **Pattern Analysis (CRITICAL):** Search `src/`, `documents/`, and any `ARCHITECTURE.md` or `CODING_STANDARDS.md` for existing patterns. Reuse what exists.
3. **Analysis & Design:** Propose a design aligned with the React/TypeScript architecture, existing component patterns, and Tailwind styling conventions. Create or update this design doc.
4. **Design Review & Verification:** Get the design reviewed and approved before writing any implementation code.
5. **Implementation:** Implement the feature as described. Follow existing file and naming conventions.
6. **Testing & Confirmation:** Write tests with Vitest + React Testing Library. Run `npm test` and `npm run build` to verify. The user should then test and confirm.
7. **Documentation:** Update relevant docs (README, ARCHITECTURE.md, etc.). Ask the user if any older design documents need updating.
8. **Commit & Pull Request:** Commit the code and file a PR. Update documentation with a reference to the PR if needed.
