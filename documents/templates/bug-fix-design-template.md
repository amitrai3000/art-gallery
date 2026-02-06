# Bug Fix Design Document

> **Template version:** 1.0
> **Project:** Art Gallery (React / TypeScript / Vite)
> **Stack:** React 18, TypeScript 5, Vite, Tailwind CSS, React Router 6

---

## Metadata

| Field              | Value                          |
|--------------------|--------------------------------|
| **Bug title**      | _e.g., Carousel crashes on empty artwork list_ |
| **Author**         |                                |
| **Date**           |                                |
| **Status**         | Draft / In Review / Approved / Implemented |
| **Severity**       | Critical / High / Medium / Low |
| **Reference/Ticket** | _e.g., GitHub Issue #42_     |
| **Branch**         |                                |
| **PR**             |                                |

---

## 1. Bug Description

### 1.1 Summary

_One-sentence description of the bug._

> **Example:** The Carousel component throws an unhandled runtime error when the artworks array is empty, rendering a blank white page instead of the Home layout.

### 1.2 Steps to Reproduce

> **Example:**
> 1. Delete all entries from the artworks data source (or return an empty array from the stub).
> 2. Navigate to `/` (Home page).
> 3. Observe: white screen with console error.

### 1.3 Expected Behavior

> The Home page renders normally with an empty-state message such as "No artworks to display" in place of the carousel.

### 1.4 Actual Behavior

> Unhandled error: `TypeError: Cannot read properties of undefined (reading '0')` in `Carousel.tsx:18`. The React error boundary (if any) is not catching it, resulting in a blank page.

### 1.5 Environment

| Detail     | Value                  |
|------------|------------------------|
| Browser    | _e.g., Chrome 120_    |
| OS         | _e.g., macOS 14_      |
| Node       | _e.g., 20.x_          |
| Build      | _dev / production_     |

---

## 2. Pattern Analysis

> **CRITICAL:** Before fixing, search the codebase to understand how similar edge cases are handled:
> - `src/components/` — Do other list-rendering components handle empty arrays? How?
> - `src/pages/` — Is there an existing empty-state or fallback component?
> - `src/types/` — Are the relevant types nullable or optional? Should they be?
> - Check for an error boundary in `src/App.tsx` or `src/components/ErrorBoundary.tsx`.
> - Review existing design docs in `documents/` for related fixes or known issues.

_Document findings here._

> **Example:** The `EventCards` component already handles empty arrays with an early return. No shared `EmptyState` component exists yet. There is no error boundary wrapping the app.

---

## 3. Root Cause Analysis

_Explain why the bug occurs. Reference specific lines of code._

> **Example:** In `src/components/Carousel.tsx:18`, the component destructures the first element of the `artworks` prop without a guard:
> ```typescript
> // Carousel.tsx:18 — BUG
> const [current, setCurrent] = useState(artworks[0]);
> ```
> When `artworks` is an empty array, `artworks[0]` is `undefined`, and subsequent render logic accesses `current.imageUrl`, causing the `TypeError`.

---

## 4. Proposed Fix

_Show before-and-after code snippets._

### Before

```typescript
// src/components/Carousel.tsx
export function Carousel({ artworks }: CarouselProps) {
  const [current, setCurrent] = useState(artworks[0]);

  return (
    <div className="relative overflow-hidden rounded-2xl">
      <img src={current.imageUrl} alt={current.title} className="w-full h-96 object-cover" />
      {/* navigation controls */}
    </div>
  );
}
```

### After

```typescript
// src/components/Carousel.tsx
export function Carousel({ artworks }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (artworks.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 rounded-2xl bg-gray-100 text-gray-500">
        No artworks to display.
      </div>
    );
  }

  const current = artworks[currentIndex];

  return (
    <div className="relative overflow-hidden rounded-2xl">
      <img src={current.imageUrl} alt={current.title} className="w-full h-96 object-cover" />
      {/* navigation controls */}
    </div>
  );
}
```

### Diff Summary

```diff
- const [current, setCurrent] = useState(artworks[0]);
+ const [currentIndex, setCurrentIndex] = useState(0);
+
+ if (artworks.length === 0) {
+   return (
+     <div className="flex items-center justify-center h-96 rounded-2xl bg-gray-100 text-gray-500">
+       No artworks to display.
+     </div>
+   );
+ }
+
+ const current = artworks[currentIndex];
```

---

## 5. Testing

_Practice TDD: write the failing test first, then apply the fix._

### 5.1 Failing Test (Write First)

```typescript
// src/components/__tests__/Carousel.test.tsx
import { render, screen } from '@testing-library/react';
import { Carousel } from '../Carousel';

describe('Carousel', () => {
  it('renders empty state when artworks array is empty', () => {
    render(<Carousel artworks={[]} />);
    expect(screen.getByText(/no artworks to display/i)).toBeInTheDocument();
  });
});
```

### 5.2 Regression Tests

```typescript
// Ensure existing behavior still works
import userEvent from '@testing-library/user-event';

const mockArtworks = [
  { id: '1', title: 'Starry Night', artist: 'Van Gogh', medium: 'Oil', year: 1889, imageUrl: '/starry.jpg' },
  { id: '2', title: 'Water Lilies', artist: 'Monet', medium: 'Oil', year: 1906, imageUrl: '/lilies.jpg' },
];

describe('Carousel with artworks', () => {
  it('renders the first artwork by default', () => {
    render(<Carousel artworks={mockArtworks} />);
    expect(screen.getByAltText('Starry Night')).toBeInTheDocument();
  });

  it('navigates to the next artwork', async () => {
    render(<Carousel artworks={mockArtworks} />);
    await userEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(screen.getByAltText('Water Lilies')).toBeInTheDocument();
  });

  it('does not crash with a single artwork', () => {
    render(<Carousel artworks={[mockArtworks[0]]} />);
    expect(screen.getByAltText('Starry Night')).toBeInTheDocument();
  });
});
```

### 5.3 Verification Commands

```bash
npm test                    # Run all tests
npm test -- Carousel        # Run only Carousel tests
npm run build               # Verify production build succeeds
```

---

## 6. Implementation Checklist

- [ ] Root cause identified and documented
- [ ] Failing test written (TDD)
- [ ] Fix applied
- [ ] All tests passing (`npm test`)
- [ ] Build succeeds (`npm run build`)
- [ ] Manual verification in browser (reproduce steps no longer fail)
- [ ] No regressions in related components
- [ ] Edge cases covered (empty array, single item, undefined props)
- [ ] Accessibility intact (no focus traps, alt text present)
- [ ] Documentation updated

---

## 7. Dependencies

_List any new packages required (usually none for a bug fix)._

> **Example:**
> ```bash
> # No new dependencies
> ```

---

## 8. Security Considerations

- [ ] Fix does not introduce XSS vectors (no `dangerouslySetInnerHTML` on dynamic content)
- [ ] Fix does not expose internal error details to the user
- [ ] No new environment variables or secrets required

---

## 9. Rollback Plan

> **Example:**
> 1. Revert the PR branch merge.
> 2. The previous behavior (crash on empty list) is restored. This is acceptable as a temporary rollback since the empty-list scenario only occurs with misconfigured data.
> 3. No data migration to revert.

---

## 10. AI Assistant Workflow

When fixing this bug, follow this lifecycle:

1. **Requirements:** Confirm the bug description, reproduction steps, and expected behavior with the user.
2. **Pattern Analysis (CRITICAL):** Search `src/components/`, `src/pages/`, and `documents/` for how similar edge cases and error handling are done. Ensure the fix follows existing patterns (e.g., if other components use early returns for empty arrays, do the same).
3. **Root Cause Analysis:** Identify the exact code path that causes the bug. Document it in section 3.
4. **Analysis & Design:** Propose the fix with before/after code. Create or update this design doc.
5. **Design Review & Verification:** Get the fix approach approved before implementing. The user may want a different approach (e.g., error boundary vs. inline guard).
6. **Test First (TDD):** Write a failing test that reproduces the bug.
7. **Implementation:** Apply the fix as described. Keep it minimal — fix the bug, nothing more.
8. **Testing & Confirmation:** Run `npm test` and `npm run build`. Manually verify the reproduction steps no longer fail. The user should confirm.
9. **Documentation:** Update relevant docs. Ask the user if any older design documents need updating.
10. **Commit & Pull Request:** Commit the code and file a PR. Update documentation with a reference to the PR if needed.
