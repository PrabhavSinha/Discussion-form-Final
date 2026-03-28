import { useMemo } from 'react';
import PostItem from './PostItem.jsx';
import { buildPostTree } from '../../utils/index.js';
import { EmptyState } from '../UI/LoadingSpinner.jsx';

export default function PostTree({ posts, onReply, threadId }) {
  // Build nested tree structure (derived from flat posts array)
  const tree = useMemo(() => buildPostTree(posts), [posts]);

  if (tree.length === 0) {
    return (
      <EmptyState
        icon="🌿"
        title="No replies yet"
        description="Be the first to share your thoughts on this thread."
      />
    );
  }

  return (
    <div role="list" aria-label="Discussion replies" className="space-y-1">
      {tree.map((post) => (
        <div key={post.id} role="listitem">
          <PostItem
            post={post}
            onReply={onReply}
            depth={0}
            threadId={threadId}
          />
        </div>
      ))}
    </div>
  );
}
