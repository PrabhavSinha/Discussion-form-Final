import { memo, useMemo } from 'react';
import ThreadCard from './ThreadCard.jsx';
import { EmptyState } from '../UI/LoadingSpinner.jsx';

const ThreadList = memo(function ThreadList({ threads, emptyMessage, onNewThread }) {
  // Sort: pinned first, then by date (derived state - not stored)
  const sorted = useMemo(() => {
    return [...threads].sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [threads]);

  if (sorted.length === 0) {
    return (
      <EmptyState
        icon="🌱"
        title="No threads yet"
        description={emptyMessage || 'Be the first to start a discussion in this category.'}
        action={
          onNewThread && (
            <button onClick={onNewThread} className="btn-primary">
              Start a Discussion
            </button>
          )
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-3" role="feed" aria-label="Discussion threads">
      {sorted.map((thread, index) => (
        <div
          key={thread.id}
          className="stagger-item"
          style={{ animationDelay: `${index * 60}ms` }}
        >
          <ThreadCard thread={thread} />
        </div>
      ))}
    </div>
  );
});

export default ThreadList;
