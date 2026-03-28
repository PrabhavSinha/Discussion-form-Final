import { Link } from 'react-router-dom';
import NewThreadForm from '../components/Form/NewThreadForm.jsx';

export default function NewThreadPage() {
  return (
    <main id="main-content" className="max-w-3xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-2 text-sm">
          <li>
            <Link to="/" className="text-ink-400 hover:text-rust-500 transition-colors">
              Discussions
            </Link>
          </li>
          <li className="text-ink-300 dark:text-ink-600" aria-hidden="true">/</li>
          <li className="text-ink-700 dark:text-parchment-200 font-medium" aria-current="page">
            New Thread
          </li>
        </ol>
      </nav>

      {/* Header */}
      <header className="mb-8 pb-6 border-b border-parchment-200 dark:border-ink-700">
        <h1 className="font-display text-2xl font-semibold text-ink-900 dark:text-parchment-100 mb-2">
          Start a Discussion
        </h1>
        <p className="text-ink-500 dark:text-ink-400 text-sm">
          Share a question, idea, or topic with the community. Be clear and specific to get the best responses.
        </p>
      </header>

      {/* Guidelines */}
      <div className="card p-4 mb-8 bg-parchment-50 dark:bg-ink-800/50 border-parchment-200">
        <h2 className="font-semibold text-sm text-ink-700 dark:text-parchment-200 mb-2">
          Community Guidelines
        </h2>
        <ul className="text-xs text-ink-500 dark:text-ink-400 space-y-1">
          <li>• Be respectful and constructive in your discussion</li>
          <li>• Search before posting to avoid duplicates</li>
          <li>• Choose the most relevant category</li>
          <li>• Add context and background to your question</li>
        </ul>
      </div>

      {/* Form */}
      <NewThreadForm />
    </main>
  );
}
