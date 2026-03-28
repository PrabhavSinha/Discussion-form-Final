import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForum } from '../context/ForumContext.jsx';
import ThreadList from '../components/Thread/ThreadList.jsx';

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'unread', label: 'Unread' },
];

const FILTER_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'unread', label: 'Unread only' },
];

export default function HomePage() {
  const { threads, categories } = useForum();
  const navigate = useNavigate();
  const [sort, setSort] = useState('latest');
  const [filter, setFilter] = useState('all');

  const processedThreads = useMemo(() => {
    let result = [...threads];

    if (filter === 'unread') {
      result = result.filter((t) => !t.isRead);
    }

    if (sort === 'popular') {
      result.sort((a, b) => b.views - a.views);
    } else if (sort === 'latest') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sort === 'unread') {
      result.sort((a, b) => {
        if (a.isRead !== b.isRead) return a.isRead ? 1 : -1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    }

    return result;
  }, [threads, sort, filter]);

  return (
    <main id="main-content" className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main feed */}
        <div className="lg:col-span-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-display text-2xl font-semibold text-ink-900 dark:text-parchment-100">
                All Discussions
              </h1>
              <p className="text-sm text-ink-500 dark:text-ink-400 mt-0.5">
                {threads.length} threads across {categories.length} categories
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Filter */}
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="input-base h-9 py-0 text-sm w-auto"
                aria-label="Filter threads"
              >
                {FILTER_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="input-base h-9 py-0 text-sm w-auto"
                aria-label="Sort threads"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          <ThreadList
            threads={processedThreads}
            onNewThread={() => navigate('/new')}
          />
        </div>

        {/* Sidebar */}
        <aside className="space-y-6" aria-label="Categories and stats">
          {/* Categories */}
          <div className="card p-4">
            <h2 className="font-display text-base font-semibold text-ink-800 dark:text-parchment-100 mb-3">
              Categories
            </h2>
            <nav aria-label="Browse by category">
              <ul className="space-y-1">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      to={`/category/${cat.id}`}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-parchment-100 dark:hover:bg-ink-700 transition-colors group"
                    >
                      <span aria-hidden="true" className="text-lg">{cat.icon}</span>
                      <span className="flex-1 text-sm text-ink-700 dark:text-parchment-200 group-hover:text-rust-600 dark:group-hover:text-rust-400 transition-colors">
                        {cat.name}
                      </span>
                      <span className="text-xs text-ink-400 dark:text-ink-500 font-mono">
                        {cat.threadCount}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Quick stats */}
          <div className="card p-4">
            <h2 className="font-display text-base font-semibold text-ink-800 dark:text-parchment-100 mb-3">
              Forum Stats
            </h2>
            <dl className="space-y-2">
              {[
                { label: 'Threads', value: threads.length },
                { label: 'Categories', value: categories.length },
                { label: 'Unread', value: threads.filter((t) => !t.isRead).length },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm">
                  <dt className="text-ink-500 dark:text-ink-400">{label}</dt>
                  <dd className="font-mono font-medium text-ink-800 dark:text-parchment-200">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Start thread CTA */}
          <div className="card p-4 bg-parchment-100 dark:bg-ink-800 border-parchment-300 dark:border-ink-600">
            <h2 className="font-display text-base font-semibold text-ink-800 dark:text-parchment-100 mb-2">
              Start a Discussion
            </h2>
            <p className="text-xs text-ink-500 dark:text-ink-400 mb-3">
              Have something to share? Start a new thread and get the conversation going.
            </p>
            <Link to="/new" className="btn-primary w-full justify-center">
              + New Thread
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
