import { memo, useState, useCallback } from 'react';
import { useForum } from '../../context/ForumContext.jsx';
import Avatar from '../UI/Avatar.jsx';
import { formatRelativeTime } from '../../utils/index.js';
import clsx from 'clsx';

const MAX_DEPTH_DISPLAYED = 4;

const PostItem = memo(function PostItem({ post, onReply, depth = 0, threadId }) {
  const { getUser, votePost } = useForum();
  const [collapsed, setCollapsed] = useState(false);

  const author = getUser(post.authorId);
  const isCurrentUser = post.authorId === 'currentUser';
  const hasChildren = post.children && post.children.length > 0;

  const handleVote = useCallback(
    (dir) => {
      votePost(post.id, dir);
    },
    [post.id, votePost]
  );

  const handleToggleCollapse = () => setCollapsed((c) => !c);

  return (
    <div
      className={clsx(
        'relative flex gap-0',
        depth > 0 && 'ml-4 sm:ml-6'
      )}
      id={`post-${post.id}`}
      aria-label={`Reply by ${author?.name}`}
    >
      {/* Thread line (collapse trigger) */}
      {hasChildren && (
        <div className="relative flex flex-col items-center mr-3 flex-shrink-0">
          <button
            onClick={handleToggleCollapse}
            className="thread-line relative w-0.5 mt-10 mb-0"
            aria-label={collapsed ? 'Expand replies' : 'Collapse replies'}
            title={collapsed ? 'Expand' : 'Collapse'}
            style={{ height: 'calc(100% - 2.5rem)' }}
          />
        </div>
      )}

      {!hasChildren && depth > 0 && <div className="w-0.5 mr-3 flex-shrink-0" />}

      <div className="flex-1 min-w-0">
        {/* Post card */}
        <div
          className={clsx(
            'card p-4 mb-3 transition-all duration-200',
            !post.isRead && 'border-l-2 border-l-rust-300',
            isCurrentUser && 'bg-parchment-50 dark:bg-ink-750'
          )}
        >
          {/* Author info */}
          <div className="flex items-start gap-3 mb-3">
            <Avatar user={author} size="sm" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <span className="font-semibold text-sm text-ink-900 dark:text-parchment-100">
                    {author?.name}
                    {isCurrentUser && (
                      <span className="ml-1 text-xs text-rust-500 font-normal">(you)</span>
                    )}
                  </span>
                </div>
                <time
                  className="text-xs text-ink-400 dark:text-ink-500 flex-shrink-0"
                  dateTime={post.createdAt}
                  title={new Date(post.createdAt).toLocaleString()}
                >
                  {formatRelativeTime(post.createdAt)}
                </time>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="text-sm text-ink-700 dark:text-parchment-200 leading-relaxed whitespace-pre-wrap break-words mb-3">
            {post.body}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 -ml-1" role="group" aria-label="Post actions">
            {/* Upvote */}
            <button
              onClick={() => handleVote(1)}
              className={clsx(
                'btn-ghost text-xs',
                post.userVote === 1 && 'text-rust-500 bg-rust-50 dark:bg-rust-900/20'
              )}
              aria-label={`Upvote (${post.votes > 0 ? post.votes : 0} votes)`}
              aria-pressed={post.userVote === 1}
            >
              ▲
            </button>

            {/* Vote count */}
            <span
              className={clsx(
                'text-xs font-mono font-medium px-1',
                post.votes > 0
                  ? 'text-rust-600 dark:text-rust-400'
                  : post.votes < 0
                  ? 'text-ink-400'
                  : 'text-ink-500'
              )}
              aria-live="polite"
            >
              {post.votes}
            </span>

            {/* Downvote */}
            <button
              onClick={() => handleVote(-1)}
              className={clsx(
                'btn-ghost text-xs',
                post.userVote === -1 && 'text-ink-500 bg-ink-100 dark:bg-ink-700'
              )}
              aria-label="Downvote"
              aria-pressed={post.userVote === -1}
            >
              ▼
            </button>

            {/* Reply */}
            {depth < MAX_DEPTH_DISPLAYED && (
              <button
                onClick={() => onReply(post.id)}
                className="btn-ghost text-xs ml-2"
                aria-label={`Reply to ${author?.name}`}
              >
                ↩ Reply
              </button>
            )}

            {/* Collapse toggle */}
            {hasChildren && (
              <button
                onClick={handleToggleCollapse}
                className="btn-ghost text-xs ml-auto"
                aria-label={collapsed ? `Expand ${post.children.length} replies` : 'Collapse replies'}
                aria-expanded={!collapsed}
              >
                {collapsed
                  ? `▶ ${post.children.length} ${post.children.length === 1 ? 'reply' : 'replies'}`
                  : '▼ Collapse'}
              </button>
            )}
          </div>
        </div>

        {/* Nested replies */}
        {hasChildren && !collapsed && (
          <div className="animate-slide-down" role="list" aria-label="Nested replies">
            {post.children.map((child) => (
              <div key={child.id} role="listitem">
                <PostItem
                  post={child}
                  onReply={onReply}
                  depth={depth + 1}
                  threadId={threadId}
                />
              </div>
            ))}
          </div>
        )}

        {/* Collapsed indicator */}
        {hasChildren && collapsed && (
          <button
            onClick={handleToggleCollapse}
            className="text-xs text-ink-400 dark:text-ink-500 hover:text-rust-500 ml-4 mb-3 transition-colors"
            aria-label={`Expand ${post.children.length} collapsed replies`}
          >
            [{post.children.length} {post.children.length === 1 ? 'reply' : 'replies'} hidden — click to expand]
          </button>
        )}
      </div>
    </div>
  );
});

export default PostItem;
