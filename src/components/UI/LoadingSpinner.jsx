export default function LoadingSpinner({ size = 'md', label = 'Loading...' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' };

  return (
    <div className="flex items-center justify-center gap-3" role="status" aria-label={label}>
      <svg
        className={`${sizes[size]} animate-spin text-rust-500`}
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <span className="text-ink-500 dark:text-ink-400 text-sm sr-only">{label}</span>
    </div>
  );
}

export function LoadingState({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <LoadingSpinner size="lg" label={message} />
      <p className="text-ink-500 dark:text-ink-400 text-sm animate-pulse-soft">{message}</p>
    </div>
  );
}

export function EmptyState({ icon = '💬', title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-4 animate-fade-in">
      <span className="text-5xl" aria-hidden="true">{icon}</span>
      <div>
        <h3 className="font-display text-xl text-ink-700 dark:text-parchment-200 mb-1">{title}</h3>
        {description && (
          <p className="text-ink-500 dark:text-ink-400 text-sm max-w-sm">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-4 animate-fade-in">
      <span className="text-5xl" aria-hidden="true">⚠️</span>
      <div>
        <h3 className="font-display text-xl text-rust-600 dark:text-rust-400 mb-1">Something went wrong</h3>
        <p className="text-ink-500 dark:text-ink-400 text-sm">{message}</p>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary">
          Try again
        </button>
      )}
    </div>
  );
}
