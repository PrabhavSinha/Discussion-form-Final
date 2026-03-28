import { useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useForum } from '../context/ForumContext.jsx';
import ThreadList from '../components/Thread/ThreadList.jsx';
import { EmptyState } from '../components/UI/LoadingSpinner.jsx';
import { useDebounce } from '../hooks/index.js';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, 300);
  const { threads } = useForum();

  const results = useMemo(() => {
    const q = debouncedQuery.toLowerCase().trim();
    if (!q) return [];
    return threads.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.body.toLowerCase().includes(q) ||
        t.tags?.some((tag) => tag.includes(q))
    );
  }, [debouncedQuery, threads]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (val.trim()) {
      setSearchParams({ q: val });
    } else {
      setSearchParams({});
    }
  };

  return (
    <main id="main-content" className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-2 text-sm">
          <li>
            <Link to="/" className="text-ink-400 hover:text-rust-500 transition-colors">Discussions</Link>
          </li>
          <li className="text-ink-300 dark:text-ink-600" aria-hidden="true">/</li>
          <li className="text-ink-700 dark:text-parchment-200 font-medium" aria-current="page">Search</li>
        </ol>
      </nav>

      <header className="mb-8">
        <h1 className="font-display text-2xl font-semibold text-ink-900 dark:text-parchment-100 mb-4">
          Search Discussions
        </h1>
        <form role="search">
          <label htmlFor="search-input" className="sr-only">Search discussions</label>
          <input
            id="search-input"
            type="search"
            value={query}
            onChange={handleSearchChange}
            placeholder="Search by title, content, or tag…"
            className="input-base text-base"
            autoFocus
            aria-describedby="search-results-summary"
          />
        </form>
      </header>

      {/* Results summary */}
      <div id="search-results-summary" aria-live="polite" className="mb-4">
        {debouncedQuery && (
          <p className="text-sm text-ink-500 dark:text-ink-400">
            {results.length > 0
              ? `${results.length} result${results.length !== 1 ? 's' : ''} for "${debouncedQuery}"`
              : `No results for "${debouncedQuery}"`}
          </p>
        )}
      </div>

      {/* Results */}
      {!debouncedQuery ? (
        <EmptyState
          icon="⌕"
          title="Start searching"
          description="Enter a keyword to search through all discussions, posts, and tags."
        />
      ) : results.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No results found"
          description={`Try different keywords or browse by category.`}
          action={<Link to="/" className="btn-secondary">Browse All Threads</Link>}
        />
      ) : (
        <ThreadList threads={results} />
      )}
    </main>
  );
}
