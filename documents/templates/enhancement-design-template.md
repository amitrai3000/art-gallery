# Enhancement Design Document

> **Template version:** 1.0
> **Project:** Art Gallery (React / TypeScript / Vite)
> **Stack:** React 18, TypeScript 5, Vite, Tailwind CSS, React Router 6

---

## Metadata

| Field                | Value                          |
|----------------------|--------------------------------|
| **Enhancement name** | _e.g., Add Search to Gallery_  |
| **Author**           |                                |
| **Date**             |                                |
| **Status**           | Draft / In Review / Approved / Implemented |
| **Branch**           |                                |
| **PR**               |                                |

---

## 1. Core Concept & Pattern Analysis

### 1.1 Current Behavior

_Describe how the feature works today._

> **Example:** The Home page carousel displays all artworks in a fixed order. There is no way to filter or search artworks by title, artist, or medium.

### 1.2 Proposed Behavior

_Describe the enhanced behavior._

> **Example:** A search input appears above the carousel. As the user types, the displayed artworks filter in real time by title or artist name (case-insensitive). Clearing the input restores the full list.

### 1.3 Motivation

_Why is this enhancement needed? Link to user feedback, issue, or metric._

### 1.4 Existing Pattern Analysis

> **CRITICAL:** Before designing, search the codebase for related patterns:
> - `src/components/` — How are existing input elements styled? Is there a shared `Input` component?
> - `src/pages/HomePage.tsx` — How is the artwork list currently rendered and filtered?
> - `src/types/` — What types already exist for artworks?
> - `src/hooks/` — Are there custom hooks for debouncing, fetching, or filtering?
> - `documents/` — Check for prior design docs that touch the same area.

_Document what you found. Note patterns to follow and anything to refactor._

### 1.5 Impact Analysis

_What existing functionality could this change affect?_

> **Example:**
> - **Carousel component:** Must accept a filtered list instead of the full list.
> - **Performance:** Filtering 50+ items on every keystroke — consider `useMemo` or debounce.
> - **URL state:** Should the search query be reflected in the URL (e.g., `?q=monet`) for shareability?
> - **Accessibility:** The search input needs a label, and results should be announced to screen readers.

---

## 2. Type Changes

_Show the before and after for any changed types._

> **Example:**
> ```typescript
> // No changes to Artwork type itself.
>
> // NEW: src/hooks/useArtworkSearch.ts
> interface UseArtworkSearchResult {
>   query: string;
>   setQuery: (q: string) => void;
>   filtered: Artwork[];
> }
> ```

---

## 3. Component Changes

_Use diff-style annotations to highlight what changes in existing components._

### 3.1 Modified Components

> **Example — `src/pages/HomePage.tsx`:**
> ```diff
>  import { Carousel } from '../components/Carousel';
> +import { SearchBar } from '../components/SearchBar';
> +import { useArtworkSearch } from '../hooks/useArtworkSearch';
>
>  export function HomePage() {
>    const artworks = useArtworks();
> +  const { query, setQuery, filtered } = useArtworkSearch(artworks);
>
>    return (
>      <main className="max-w-6xl mx-auto px-4 py-12">
> +      <SearchBar value={query} onChange={setQuery} placeholder="Search by title or artist..." />
> -      <Carousel artworks={artworks} />
> +      <Carousel artworks={filtered} />
>      </main>
>    );
>  }
> ```

### 3.2 New Components

> **Example — `src/components/SearchBar.tsx`:**
> ```typescript
> interface SearchBarProps {
>   value: string;
>   onChange: (value: string) => void;
>   placeholder?: string;
> }
>
> export function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
>   return (
>     <div className="mb-8">
>       <label htmlFor="search" className="sr-only">Search artworks</label>
>       <input
>         id="search"
>         type="search"
>         value={value}
>         onChange={e => onChange(e.target.value)}
>         placeholder={placeholder}
>         className="w-full rounded-lg border border-gray-300 px-4 py-2
>                    focus:outline-none focus:ring-2 focus:ring-indigo-500"
>       />
>     </div>
>   );
> }
> ```

### 3.3 New Hooks

> **Example — `src/hooks/useArtworkSearch.ts`:**
> ```typescript
> import { useMemo, useState } from 'react';
> import type { Artwork } from '../types/artwork';
>
> export function useArtworkSearch(artworks: Artwork[]) {
>   const [query, setQuery] = useState('');
>
>   const filtered = useMemo(() => {
>     if (!query.trim()) return artworks;
>     const lower = query.toLowerCase();
>     return artworks.filter(
>       a => a.title.toLowerCase().includes(lower) ||
>            a.artist.toLowerCase().includes(lower)
>     );
>   }, [artworks, query]);
>
>   return { query, setQuery, filtered };
> }
> ```

---

## 4. Route Changes

_If routes change, document them here. Otherwise note "No route changes."_

> **Example:** No route changes. Optionally sync query to URL via `useSearchParams`:
> ```typescript
> const [params, setParams] = useSearchParams();
> const query = params.get('q') ?? '';
> const setQuery = (q: string) => setParams(q ? { q } : {});
> ```

---

## 5. Styling Changes

_Describe Tailwind updates. Reference existing design tokens._

> **Example:** The `SearchBar` uses the same `rounded-lg` and `border-gray-300` pattern as the Contact form inputs. Add `focus:ring-indigo-500` to match the site's accent color.

---

## 6. Backward Compatibility

_Confirm nothing breaks for existing users._

> **Example:**
> - The Carousel component now accepts an `artworks` prop instead of fetching internally — verify all call sites are updated.
> - Empty search state shows all artworks (same as before the enhancement).
> - No data migration needed.

---

## 7. Testing

_Write tests covering the enhancement's key behaviors._

> **Example:**
> ```typescript
> // src/hooks/__tests__/useArtworkSearch.test.ts
> import { renderHook, act } from '@testing-library/react';
> import { useArtworkSearch } from '../useArtworkSearch';
> import type { Artwork } from '../../types/artwork';
>
> const mockArtworks: Artwork[] = [
>   { id: '1', title: 'Starry Night', artist: 'Van Gogh', medium: 'Oil', year: 1889, imageUrl: '' },
>   { id: '2', title: 'Water Lilies', artist: 'Monet', medium: 'Oil', year: 1906, imageUrl: '' },
>   { id: '3', title: 'The Scream', artist: 'Munch', medium: 'Tempera', year: 1893, imageUrl: '' },
> ];
>
> describe('useArtworkSearch', () => {
>   it('returns all artworks when query is empty', () => {
>     const { result } = renderHook(() => useArtworkSearch(mockArtworks));
>     expect(result.current.filtered).toHaveLength(3);
>   });
>
>   it('filters by title (case-insensitive)', () => {
>     const { result } = renderHook(() => useArtworkSearch(mockArtworks));
>     act(() => result.current.setQuery('starry'));
>     expect(result.current.filtered).toEqual([mockArtworks[0]]);
>   });
>
>   it('filters by artist', () => {
>     const { result } = renderHook(() => useArtworkSearch(mockArtworks));
>     act(() => result.current.setQuery('monet'));
>     expect(result.current.filtered).toEqual([mockArtworks[1]]);
>   });
>
>   it('returns empty array when nothing matches', () => {
>     const { result } = renderHook(() => useArtworkSearch(mockArtworks));
>     act(() => result.current.setQuery('xyz'));
>     expect(result.current.filtered).toHaveLength(0);
>   });
> });
> ```

> **Integration test — `src/pages/__tests__/HomePage.test.tsx`:**
> ```typescript
> import { render, screen } from '@testing-library/react';
> import userEvent from '@testing-library/user-event';
> import { MemoryRouter } from 'react-router-dom';
> import { HomePage } from '../HomePage';
>
> describe('HomePage search', () => {
>   it('filters carousel cards as user types', async () => {
>     render(<MemoryRouter><HomePage /></MemoryRouter>);
>     const input = screen.getByPlaceholderText(/search/i);
>
>     await userEvent.type(input, 'Van Gogh');
>     expect(screen.getByText('Starry Night')).toBeInTheDocument();
>     expect(screen.queryByText('Water Lilies')).not.toBeInTheDocument();
>   });
> });
> ```

### 7.1 Implementation Checklist

- [ ] Existing pattern analysis completed
- [ ] Type changes applied
- [ ] Existing components updated (no regressions)
- [ ] New components created
- [ ] Tests written and passing (`npm test`)
- [ ] Build succeeds (`npm run build`)
- [ ] Responsive design verified
- [ ] Accessibility verified (label, focus, keyboard navigation)
- [ ] Backward compatibility confirmed
- [ ] Documentation updated

---

## 8. Dependencies

_List any new packages required._

> **Example:**
> ```bash
> # No new dependencies for this enhancement
> ```
>
> If a debounce utility is needed:
> ```bash
> npm install use-debounce
> ```

---

## 9. Security Considerations

- [ ] Search input is text-only; no HTML rendering of query values
- [ ] No API calls with unsanitized user input
- [ ] No new environment variables or secrets required

---

## 10. Rollback Plan

> **Example:**
> 1. Revert the PR branch merge.
> 2. Restore `HomePage.tsx` to use the unfiltered artworks list directly.
> 3. Remove `SearchBar.tsx` and `useArtworkSearch.ts`.
> 4. No data changes to revert.

---

## 11. AI Assistant Workflow

When implementing this enhancement, follow this lifecycle:

1. **Requirements:** Confirm the current vs. proposed behavior with the user.
2. **Pattern Analysis (CRITICAL):** Search `src/`, `documents/`, `ARCHITECTURE.md`, and `CODING_STANDARDS.md` for existing patterns in the area being enhanced. Ensure the enhancement aligns with established conventions.
3. **Impact Analysis:** Identify every component, hook, and test file touched. Confirm backward compatibility.
4. **Analysis & Design:** Propose the design. Create or update this design doc.
5. **Design Review & Verification:** Get the design approved before writing implementation code.
6. **Implementation:** Apply changes as described. Update all affected files, not just the new ones.
7. **Testing & Confirmation:** Write tests with Vitest + React Testing Library. Run `npm test` and `npm run build`. The user should test and confirm.
8. **Documentation:** Update relevant docs. Ask the user if any older design documents need updating.
9. **Commit & Pull Request:** Commit the code and file a PR. Update documentation with a reference to the PR if needed.
