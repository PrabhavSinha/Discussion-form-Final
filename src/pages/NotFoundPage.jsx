import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <main id="main-content" className="max-w-2xl mx-auto px-4 py-24 text-center">
      <p className="font-mono text-8xl font-bold text-parchment-300 dark:text-ink-700 mb-4" aria-hidden="true">
        404
      </p>
      <h1 className="font-display text-3xl font-semibold text-ink-900 dark:text-parchment-100 mb-3">
        Page Not Found
      </h1>
      <p className="text-ink-500 dark:text-ink-400 mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex items-center justify-center gap-3">
        <Link to="/" className="btn-primary">
          Back to Home
        </Link>
        <Link to="/new" className="btn-secondary">
          Start a Discussion
        </Link>
      </div>
    </main>
  );
}
