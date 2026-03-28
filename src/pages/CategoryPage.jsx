import { useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForum } from '../context/ForumContext.jsx';
import ThreadList from '../components/Thread/ThreadList.jsx';
import { EmptyState } from '../components/UI/LoadingSpinner.jsx';

export default function CategoryPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { getCategory, getThreadsByCategory } = useForum();

  const category = getCategory(categoryId);
  const threads = useMemo(() => getThreadsByCategory(categoryId), [categoryId, getThreadsByCategory]);

  if (!category) {
    return (
      <main id="main-content" className="max-w-4xl mx-auto px-4 py-16">
        <EmptyState
          icon="🔍"
          title="Category not found"
          description="This category doesn't exist."
          action={
            <Link to="/" className="btn-primary">Back to Home</Link>
          }
        />
      </main>
    );
  }

  return (
    <main id="main-content" className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-2 text-sm">
          <li>
            <Link to="/" className="text-ink-400 hover:text-rust-500 transition-colors">
              All Discussions
            </Link>
          </li>
          <li className="text-ink-300 dark:text-ink-600" aria-hidden="true">/</li>
          <li className="text-ink-700 dark:text-parchment-200 font-medium" aria-current="page">
            {category.name}
          </li>
        </ol>
      </nav>

      {/* Category header */}
      <header className="mb-8 pb-6 border-b border-parchment-200 dark:border-ink-700">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl" aria-hidden="true">{category.icon}</span>
            <div>
              <h1 className="font-display text-2xl font-semibold text-ink-900 dark:text-parchment-100">
                {category.name}
              </h1>
              <p className="text-ink-500 dark:text-ink-400 mt-0.5">{category.description}</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/new', { state: { categoryId } })}
            className="btn-primary flex-shrink-0"
          >
            + New Thread
          </button>
        </div>

        <div className="flex items-center gap-4 mt-4 text-sm text-ink-500 dark:text-ink-400">
          <span>{threads.length} {threads.length === 1 ? 'thread' : 'threads'}</span>
          <span>{threads.filter((t) => !t.isRead).length} unread</span>
        </div>
      </header>

      <ThreadList
        threads={threads}
        onNewThread={() => navigate('/new', { state: { categoryId } })}
        emptyMessage={`No threads in ${category.name} yet. Start the first one!`}
      />
    </main>
  );
}
