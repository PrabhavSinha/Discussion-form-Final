import { memo } from 'react';
import { Link } from 'react-router-dom';
import { useForum } from '../../context/ForumContext.jsx';
import Avatar from '../UI/Avatar.jsx';
import Badge from '../UI/Badge.jsx';
import { formatRelativeTime, truncate, formatCount } from '../../utils/index.js';

const ThreadCard = memo(function ThreadCard({ thread, style }) {
  const { getUser, getCategory, getPostsByThread } = useForum();

  const author = getUser(thread.authorId);
  const category = getCategory(thread.categoryId);
  const posts = getPostsByThread(thread.id);
  const replyCount = posts.length;
  const lastPost = posts[posts.length - 1];
  const lastActivity = lastPost
    ? formatRelativeTime(lastPost.createdAt)
    : formatRelativeTime(thread.createdAt);

  return (
    <article
      className={`card p-4 hover:shadow-md transition-all duration-200 ${!thread.isRead ? 'border-l-2 border-l-rust-400' : ''}`}
      style={style}
      aria-label={`Thread: ${thread.title}`}
    >
      <div className="flex gap-3">
        {/* Author avatar */}
        <div className="flex-shrink-0 pt-0.5">
          <Avatar user={author} size="sm" />
        </div>

        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex items-center gap-2 flex-wrap">
              {thread.isPinned && (
                <Badge variant="pinned">
                  <span aria-hidden="true">📌</span> Pinned
                </Badge>
              )}
              {!thread.isRead && <Badge variant="unread">New</Badge>}
              {category && (
                <Link
                  to={`/category/${category.id}`}
                  className={`badge ${category.color} hover:opacity-80 transition-opacity`}
                  aria-label={`Category: ${category.name}`}
                >
                  {category.icon} {category.name}
                </Link>
              )}
            </div>

            <time
              className="text-xs text-ink-400 dark:text-ink-500 flex-shrink-0"
              dateTime={thread.createdAt}
              title={new Date(thread.createdAt).toLocaleString()}
            >
              {formatRelativeTime(thread.createdAt)}
            </time>
          </div>

          {/* Title */}
          <h2 className="font-display text-base font-semibold text-ink-900 dark:text-parchment-100 leading-snug mb-1">
            <Link
              to={`/thread/${thread.id}`}
              className="hover:text-rust-600 dark:hover:text-rust-400 transition-colors focus-visible:underline"
            >
              {thread.title}
            </Link>
          </h2>

          {/* Excerpt */}
          <p className="text-sm text-ink-500 dark:text-ink-400 mb-3 leading-relaxed">
            {truncate(thread.body, 120)}
          </p>

          {/* Footer */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Author */}
            <span className="text-xs text-ink-500 dark:text-ink-400">
              by <span className="font-medium text-ink-700 dark:text-parchment-300">{author?.name}</span>
            </span>

            {/* Stats */}
            <div className="flex items-center gap-3 ml-auto text-xs text-ink-400 dark:text-ink-500">
              <span
                className="flex items-center gap-1"
                aria-label={`${replyCount} replies`}
              >
                <span aria-hidden="true">💬</span> {formatCount(replyCount)}
              </span>
              <span
                className="flex items-center gap-1"
                aria-label={`${thread.views} views`}
              >
                <span aria-hidden="true">👁</span> {formatCount(thread.views)}
              </span>
              <span
                className="flex items-center gap-1"
                aria-label={`Last activity ${lastActivity}`}
              >
                <span aria-hidden="true">⏱</span> {lastActivity}
              </span>
            </div>

            {/* Tags */}
            {thread.tags?.length > 0 && (
              <div className="flex gap-1 flex-wrap w-full mt-1">
                {thread.tags.map((tag) => (
                  <Badge key={tag} variant="tag">#{tag}</Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
});

export default ThreadCard;
