# Discourse — Discussion Forum

A production-grade discussion forum SPA built with **React 18 + Vite**, demonstrating advanced frontend architecture for the 25CS1201E Frontend Development Frameworks course.

---

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI framework with hooks |
| Vite 5 | Build tool + dev server |
| React Router v6 | SPA routing |
| Tailwind CSS v3 | Utility-first styling |
| Vitest | Unit testing |
| @testing-library/react | Component testing |

---

## Architecture

### Component Hierarchy
```
App
├── ThemeProvider (context)
├── ForumProvider (context: global state via useReducer)
│   ├── Navigation
│   │   ├── Search (controlled input)
│   │   └── Category nav links
│   └── Routes
│       ├── HomePage
│       │   ├── ThreadList (memoized, sorted derived state)
│       │   │   └── ThreadCard (memo, prop contracts)
│       │   └── Sidebar
│       ├── CategoryPage
│       │   └── ThreadList
│       ├── ThreadPage
│       │   ├── PostTree (hierarchical)
│       │   │   └── PostItem (recursive, collapsible)
│       │   └── ReplyForm (controlled)
│       ├── NewThreadPage
│       │   └── NewThreadForm (controlled, validated)
│       ├── SearchPage (debounced, derived results)
│       └── NotFoundPage
```

### State Architecture
- **Global state**: `useReducer` inside `ForumContext` — pure, immutable updates
- **Derived state**: `useMemo` for sorted threads, filtered posts, post trees — never stored
- **Local state**: `useState` for form inputs, UI toggles, collapse state
- **Controlled components**: All inputs use `value` + `onChange` pattern
- **Side effects**: `useEffect` for theme persistence, intersection observer, timers

### Routing Structure
```
/                     → HomePage (all threads)
/category/:categoryId → CategoryPage (filtered by category)
/thread/:threadId     → ThreadPage (full thread + replies)
/new                  → NewThreadPage (controlled form)
/search               → SearchPage (debounced search)
*                     → NotFoundPage
```

### Async & Performance
- **Loading states**: Every async op shows loading spinner + aria-busy
- **Error states**: All async calls wrapped in try/catch with user-visible errors
- **Empty states**: Meaningful empty state components
- **Memoization**: `memo()` on ThreadCard, PostItem; `useMemo` for derived lists
- **Code splitting**: Lazy-loaded pages via `React.lazy()` + `Suspense`
- **Debouncing**: Search input debounced 300ms via `useDebounce` hook

### Accessibility
- Skip to main content link
- All interactive elements keyboard accessible
- `aria-label`, `aria-live`, `aria-busy`, `aria-expanded`, `aria-invalid` attributes
- `role="feed"`, `role="list"`, `role="search"`, `role="alert"` landmarks
- `<time>` elements with proper `dateTime` attributes
- Color contrast meeting WCAG AA
- Screen reader announcements for dynamic content

---

## Testing
```
src/test/
├── setup.js          — Jest DOM setup
├── utils.test.js     — Pure utility function tests (25 tests)
├── components.test.jsx — UI component tests
└── reducer.test.js   — State reducer tests (immutability, correctness)
```

Run tests:
```bash
npm test              # watch mode
npm test -- --run     # single run
```

---

## Rubric Coverage

| Criteria | Implementation |
|---|---|
| **Front-End Architecture** | Clear component hierarchy, prop contracts, reusable components (ThreadCard, PostItem, Avatar, Badge, forms) |
| **State Architecture** | useReducer with ACTIONS, base vs derived state, immutable updates, controlled components |
| **Routing & View Composition** | React Router v6, nested dynamic routes, clean view separation, smooth navigation |
| **Async Data Handling** | Simulated async with loading/error/empty states, memoization, render optimization |
| **Testing** | 30+ unit/component tests with Vitest, covers reducers, utilities, and components |
