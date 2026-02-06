# Art Gallery — Coding Standards

This document defines the coding conventions for the Art Gallery React application. Every contributor — human or AI — should follow these standards to keep the codebase consistent and maintainable.

---

## 1. Naming Conventions

### Files and Folders

| Item | Convention | Example |
|------|-----------|---------|
| React component files | PascalCase `.tsx` | `ArtworkCard.tsx` |
| Hook files | camelCase, prefixed with `use` | `useArtworkSearch.ts` |
| Utility / helper files | camelCase `.ts` | `formatDate.ts` |
| Type / interface files | camelCase `.ts` | `artwork.ts` |
| Test files | Same name + `.test` suffix | `ArtworkCard.test.tsx` |
| Folders | kebab-case | `src/components/`, `src/artwork-detail/` |
| CSS files | kebab-case | `index.css` |
| Constants files | camelCase `.ts` | `routes.ts` |

### Components

```tsx
// PascalCase for component names — must match the filename
export default function ArtworkCard({ title, artist }: ArtworkCardProps) {
  return <article>...</article>;
}
```

### Functions and Variables

```tsx
// camelCase for functions, variables, and hook return values
const [isLoading, setIsLoading] = useState(false);
const artworkCount = artworks.length;

function handleSubmit(event: React.FormEvent) { ... }
```

### Constants

```tsx
// UPPER_SNAKE_CASE for true constants (compile-time, never changes)
const MAX_CAROUSEL_ITEMS = 12;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// camelCase for derived or runtime values, even if assigned with const
const defaultArtwork = artworks[0];
```

### Booleans

Prefix with `is`, `has`, `should`, or `can` to signal intent:

```tsx
const isVisible = true;
const hasError = error !== null;
const canSubmit = name.length > 0 && email.length > 0;
```

### Event Handlers

Prefix with `handle` in the component that owns the logic. Prefix callback props with `on`:

```tsx
// In the parent
function handleSearch(query: string) { ... }
<SearchBar onSearch={handleSearch} />

// In SearchBar's props interface
interface SearchBarProps {
  onSearch: (query: string) => void;
}
```

---

## 2. File and Folder Structure

```
src/
├── assets/              # Static files imported by components (images, SVGs)
├── components/          # Shared, reusable UI components
│   ├── SearchBar.tsx
│   └── LoadingSpinner.tsx
├── hooks/               # Shared custom hooks
│   └── useArtworkSearch.ts
├── layouts/             # Page layouts (shell components with <Outlet />)
│   └── RootLayout.tsx
├── pages/               # Routable page components (one per route)
│   ├── HomePage.tsx
│   ├── AboutPage.tsx
│   └── ContactPage.tsx
├── types/               # Shared TypeScript interfaces and types
│   └── artwork.ts
├── utils/               # Pure utility functions (no React imports)
│   └── formatDate.ts
├── App.tsx              # Router and route definitions
├── main.tsx             # Entry point
└── index.css            # Tailwind CSS import and theme customization
```

### Rules

- **One component per file.** The filename must match the default export.
- **Co-locate tests.** Place test files next to the code they test, either as siblings (`ArtworkCard.test.tsx`) or in a `__tests__/` folder within the same directory.
- **Keep it flat.** Avoid nesting beyond two levels. If a component needs multiple sub-files (sub-components, hooks, utils), create a folder named after the component:

```
src/components/
└── Carousel/
    ├── Carousel.tsx          # Main component
    ├── CarouselSlide.tsx     # Sub-component (internal)
    ├── useCarousel.ts        # Hook (internal to this component)
    └── Carousel.test.tsx     # Tests
```

- **Pages are thin.** A page component composes shared components and hooks. It should contain layout concerns and data-fetching orchestration, not complex UI logic.
- **`utils/` has no React imports.** If a function uses hooks or JSX, it belongs in `hooks/` or `components/`.

---

## 3. Component Patterns

### Functional Components Only

Use function declarations with default exports. Do not use class components.

```tsx
// Preferred: function declaration
export default function ArtworkCard({ title, artist }: ArtworkCardProps) {
  return (
    <article className="rounded-lg border p-4">
      <h3 className="font-bold">{title}</h3>
      <p className="text-gray-600">{artist}</p>
    </article>
  );
}
```

Do **not** use `React.FC`. It adds an implicit `children` prop and provides no real benefit:

```tsx
// Avoid
const ArtworkCard: React.FC<ArtworkCardProps> = ({ title }) => { ... };

// Prefer
export default function ArtworkCard({ title }: ArtworkCardProps) { ... }
```

### Props

- Define props as an `interface` directly above the component in the same file (or in `src/types/` if shared across many files).
- Destructure props in the function signature.
- Keep required props required. Use optional (`?`) sparingly.

```tsx
interface ArtworkCardProps {
  title: string;
  artist: string;
  imageUrl: string;
  year?: number; // optional only when genuinely not always present
}

export default function ArtworkCard({ title, artist, imageUrl, year }: ArtworkCardProps) { ... }
```

### Hooks

- Always prefix custom hooks with `use`.
- Extract logic into a custom hook when: the same stateful logic appears in two or more components, or a single component's hook section exceeds ~15 lines.
- A hook should do one thing. Prefer `useArtworkSearch` and `useArtworkFetch` over a monolithic `useArtwork`.

```tsx
// src/hooks/useArtworkSearch.ts
import { useMemo, useState } from 'react';
import type { Artwork } from '../types/artwork';

export function useArtworkSearch(artworks: Artwork[]) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return artworks;
    const lower = query.toLowerCase();
    return artworks.filter(
      a => a.title.toLowerCase().includes(lower) ||
           a.artist.toLowerCase().includes(lower)
    );
  }, [artworks, query]);

  return { query, setQuery, filtered };
}
```

### Conditional Rendering

Use early returns for guard clauses. Use ternaries or `&&` for inline conditionals:

```tsx
// Early return for loading/error states
if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage message={error} />;

// Inline conditional for optional elements
return (
  <div>
    <h1>{title}</h1>
    {subtitle && <p>{subtitle}</p>}
  </div>
);
```

### Memoization

Do not add `React.memo`, `useMemo`, or `useCallback` by default. Add them only when you have measured a performance problem. Premature memoization adds complexity without benefit.

---

## 4. TypeScript Guidelines

### Compiler Settings (already configured)

The project uses TypeScript strict mode (`tsconfig.app.json`). These flags are enforced:

- `strict: true` — enables all strict type-checking options
- `noUnusedLocals: true` — errors on unused variables
- `noUnusedParameters: true` — errors on unused function parameters
- `noFallthroughCasesInSwitch: true` — errors on switch fallthrough

### Core Rules

**Never use `any`.** If the type is truly unknown, use `unknown` and narrow it:

```tsx
// Bad
function parse(data: any) { return data.name; }

// Good
function parse(data: unknown): string {
  if (typeof data === 'object' && data !== null && 'name' in data) {
    return String((data as { name: unknown }).name);
  }
  throw new Error('Invalid data');
}
```

**Prefer `interface` over `type` for object shapes.** Use `type` for unions, intersections, and mapped types:

```tsx
// Object shape — use interface
interface Artwork {
  id: string;
  title: string;
  artist: string;
}

// Union — use type
type Status = 'loading' | 'error' | 'success';

// Intersection — use type
type ArtworkWithMeta = Artwork & { fetchedAt: Date };
```

**Use `type` imports when importing only types.** This is enforced by `verbatimModuleSyntax`:

```tsx
import type { Artwork } from '../types/artwork';
```

**Prefer `string[]` over `Array<string>`.** Use the shorthand array syntax:

```tsx
// Preferred
const ids: string[] = [];

// Avoid
const ids: Array<string> = [];
```

**Let TypeScript infer when the type is obvious.** Add explicit annotations at function boundaries and for complex types:

```tsx
// Inference is fine here
const [count, setCount] = useState(0);
const name = 'Gallery';

// Explicit annotation needed — not obvious from the initializer
const [artwork, setArtwork] = useState<Artwork | null>(null);

// Always annotate function return types in public APIs / hooks
function useArtworkSearch(artworks: Artwork[]): UseArtworkSearchResult { ... }
```

**Use `Readonly` for props that should not be mutated:**

```tsx
interface CarouselProps {
  artworks: readonly Artwork[];
}
```

---

## 5. Testing Approach

### Stack

| Tool | Purpose |
|------|---------|
| Vitest | Test runner (Vite-native, Jest-compatible API) |
| React Testing Library | Component rendering and user-centric queries |
| `@testing-library/user-event` | Simulating real user interactions |

### Principles

1. **Test behavior, not implementation.** Query by role, text, or label — not by class name, test ID, or component internals.
2. **Write tests from the user's perspective.** "When I click the Next button, the second artwork appears" — not "when `currentIndex` increments, the `src` prop changes."
3. **Prefer `screen` queries.** Use `screen.getByRole(...)` instead of destructuring from `render()`.
4. **Use `userEvent` over `fireEvent`.** `userEvent` simulates full browser interaction (focus, keydown, keyup, click) while `fireEvent` dispatches a single synthetic event.

### File Placement

Co-locate test files next to the source:

```
src/components/
├── ArtworkCard.tsx
└── ArtworkCard.test.tsx
```

Or use a `__tests__/` folder for pages with multiple test files:

```
src/pages/
├── HomePage.tsx
└── __tests__/
    └── HomePage.test.tsx
```

### Test Structure

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import ArtworkCard from '../ArtworkCard';

describe('ArtworkCard', () => {
  it('renders the artwork title and artist', () => {
    render(
      <MemoryRouter>
        <ArtworkCard title="Starry Night" artist="Van Gogh" imageUrl="/starry.jpg" />
      </MemoryRouter>
    );

    expect(screen.getByText('Starry Night')).toBeInTheDocument();
    expect(screen.getByText('Van Gogh')).toBeInTheDocument();
  });

  it('navigates to detail page on click', async () => {
    render(
      <MemoryRouter>
        <ArtworkCard title="Starry Night" artist="Van Gogh" imageUrl="/starry.jpg" />
      </MemoryRouter>
    );

    await userEvent.click(screen.getByRole('link'));
    // assert navigation target
  });
});
```

### What to Test

| Always test | Skip |
|-------------|------|
| User-visible output (rendered text, accessible roles) | Internal state values |
| User interactions (clicks, form submissions, keyboard) | Implementation details (hook internals) |
| Conditional rendering (loading, error, empty states) | Styling / CSS classes |
| Edge cases (empty arrays, missing optional props) | Third-party library internals |

---

## 6. Import Ordering

Group imports in this order, separated by blank lines:

1. **React** — `react`, `react-dom`
2. **External libraries** — `react-router-dom`, any npm packages
3. **Internal aliases / absolute paths** — (if configured)
4. **Parent imports** — `../`
5. **Sibling / local imports** — `./`
6. **Type-only imports** — `import type { ... }`
7. **Side-effect imports** — CSS, polyfills

```tsx
import { useState, useMemo } from 'react';

import { Link, useParams } from 'react-router-dom';

import { useArtworkSearch } from '../hooks/useArtworkSearch';
import ArtworkCard from '../components/ArtworkCard';
import LoadingSpinner from '../components/LoadingSpinner';

import type { Artwork } from '../types/artwork';

import '../styles/gallery.css';
```

### Rules

- **One import per source module.** Combine multiple named imports into a single statement.
- **Alphabetize** within each group when there are many imports.
- **No unused imports.** TypeScript's `noUnusedLocals` will flag these as compile errors.

---

## 7. Error Handling Patterns

### Rendering Errors — Error Boundaries

Use the `react-error-boundary` library for declarative error boundaries. Place them strategically around independent UI sections, not just at the app root:

```tsx
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-6">
      <h2 className="font-bold text-red-800">Something went wrong</h2>
      <p className="mt-2 text-red-600">{error.message}</p>
      <button onClick={resetErrorBoundary} className="mt-4 text-sm underline">
        Try again
      </button>
    </div>
  );
}

// In the layout or page
<ErrorBoundary FallbackComponent={ErrorFallback}>
  <Carousel artworks={artworks} />
</ErrorBoundary>
```

### Async Errors — Fetch / Data Loading

Handle loading, error, and success states explicitly. Never let a component render with `undefined` data:

```tsx
export default function ArtworkDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchArtwork(id!)
      .then(setArtwork)
      .catch(e => setError(e instanceof Error ? e.message : 'Unknown error'))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!artwork) return <NotFound />;

  return <ArtworkDetail artwork={artwork} />;
}
```

### Event Handler Errors

Catch errors in event handlers with try/catch. Error boundaries do **not** catch errors in event handlers:

```tsx
async function handleSubmit(event: React.FormEvent) {
  event.preventDefault();
  try {
    await submitContactForm(formData);
    setSuccess(true);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Submission failed');
  }
}
```

### Form Validation

Validate at the boundary — where user input enters the system. Use early returns to surface errors before any side effects:

```tsx
function handleSubmit(event: React.FormEvent) {
  event.preventDefault();

  if (!name.trim()) {
    setError('Name is required');
    return;
  }
  if (!email.includes('@')) {
    setError('Please enter a valid email');
    return;
  }

  setError(null);
  submitForm({ name, email, message });
}
```

### Rules

- **Never silently swallow errors.** Always show the user a meaningful message or log to a monitoring service.
- **Type your error states.** Use `string | null` for simple error messages. For complex cases, define an error type:

```tsx
interface FetchState<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
}
```

- **Guard against `undefined`.** Check for empty arrays, null values, and missing route params before rendering.
- **Fail gracefully.** A single broken component should not take down the entire page. Wrap independent sections in their own error boundaries.

---

## 8. General Rules

- **No `console.log` in committed code.** Use it for debugging, remove before committing.
- **No commented-out code.** Delete it. Git has the history.
- **No magic numbers or strings.** Extract repeated values into named constants.
- **Keep components small.** If a component exceeds ~150 lines, look for pieces to extract.
- **Prefer composition over configuration.** Build flexible UIs by composing small components rather than adding optional props to large ones.
- **Accessibility.** Use semantic HTML elements (`<nav>`, `<main>`, `<article>`, `<button>`). Add `alt` text to images. Ensure interactive elements are keyboard-accessible.

---

## References

- [Using TypeScript — React official docs](https://react.dev/learn/typescript)
- [TypeScript Style Guide — Marko Kosir](https://mkosir.github.io/typescript-style-guide/)
- [React + TypeScript Style Guide](https://react-typescript-style-guide.com/)
- [ReactBlueprint — React Best Practices 2026](https://react-blueprint.dev/)
- [Vitest Component Testing Guide](https://vitest.dev/guide/browser/component-testing)
- [React Error Boundaries — react-error-boundary](https://blog.logrocket.com/react-error-handling-react-error-boundary/)
- [React Design Patterns and Best Practices — Telerik](https://www.telerik.com/blogs/react-design-patterns-best-practices)
- [ESLint import ordering — eslint-plugin-import](https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md)
