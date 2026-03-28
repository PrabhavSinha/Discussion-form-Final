import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useForum } from '../context/ForumContext.jsx';
import PostTree from '../components/Post/PostTree.jsx';
import ReplyForm from '../components/Form/ReplyForm.jsx';
import Avatar from '../components/UI/Avatar.jsx';
import Badge from '../components/UI/Badge.jsx';
import { LoadingState, EmptyState } from '../components/UI/LoadingSpinner.jsx';
import { formatRelativeTime, formatDate, formatCount } from '../utils/index.js';

export default function ThreadPage() {
  const { threadId } = useParams();
  const navigate = useNavigate();
  const {
    getThread,
    getUser,
    getCategory,
    getPostsByThread,
    markThreadRead,
    loading,
  } = useForum();

  // Local state
  const [isLoading, setIsLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState(null); // null = root, postId = nested
  const [showRootReply, setShowRootReply] = useState(false);

  // Async: simulate loading thread data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      markThreadRead(threadId);
    }, 600);
    return () => clearTimeout(timer);
  }, [threadId, markThreadRead]);

  const thread = getThread(threadId);
  const author = getUser(thread?.authorId);
  const category = getCategory(thread?.categoryId);

  // Derived: posts for this thread
  const posts = useMemo(
    () => getPostsByThread(threadId),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [threadId, getPostsByThread]
  );

  const handleReply = useCallback((parentId) => {
    setReplyingTo(parentId);
    setShowRootReply(false);
    // Scroll to form
    setTimeout(() => {
      document.getElementById(`reply-form-${parentId}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }, 100);
  }, []);

  const handleRootReply = () => {
    setShowRootReply(true);
    setReplyingTo(null);
    setTimeout(() => {
      document.getElementById('root-reply-form')?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }, 100);
  };

  const handlePostSuccess = useCallback(() => {
    setReplyingTo(null);
    setShowRootReply(false);
  }, []);

  if (isLoading) return <LoadingState message="Loading discussion…" />;

  if (!thread) {
    return (
      <main id="main-content" className="max-w-4xl mx-auto px-4 py-16">
        <EmptyState
          icon="🔍"
          title="Thread not found"
          description="This thread may have been removed."
          action={<Link to="/" className="btn-primary">Back to Home</Link>}
        />
      </main>
    );
  }

  return (
    <main id="main-content" className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-2 text-sm flex-wrap">
          <li>
            <Link to="/" className="text-ink-400 hover:text-rust-500 transition-colors">
              Discussions
            </Link>
          </li>
          {category && (
            <>
              <li className="text-ink-300 dark:text-ink-600" aria-hidden="true">/</li>
              <li>
                <Link
                  to={`/category/${category.id}`}
                  className="text-ink-400 hover:text-rust-500 transition-colors"
                >
                  {category.icon} {category.name}
                </Link>
              </li>
            </>
          )}
          <li className="text-ink-300 dark:text-ink-600" aria-hidden="true">/</li>
          <li
            className="text-ink-600 dark:text-parchment-300 truncate max-w-xs"
            aria-current="page"
            title={thread.title}
          >
            {thread.title}
          </li>
        </ol>
      </nav>

      {/* Thread header */}
      <article aria-labelledby="thread-title">
        <header className="mb-8">
          {/* Badges */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {thread.isPinned && <Badge variant="pinned">📌 Pinned</Badge>}
            {category && (
              <Link
                to={`/category/${category.id}`}
                className={`badge ${category.color} hover:opacity-80 transition-opacity`}
              >
                {category.icon} {category.name}
              </Link>
            )}
          </div>

          {/* Title */}
          <h1
            id="thread-title"
            className="font-display text-2xl sm:text-3xl font-semibold text-ink-900 dark:text-parchment-100 mb-4 text-balance"
          >
            {thread.title}
          </h1>

          {/* Author info */}
          <div className="flex items-center gap-3 mb-4">
            <Avatar user={author} size="md" />
            <div>
              <p className="font-medium text-sm text-ink-800 dark:text-parchment-200">
                {author?.name}
              </p>
              <p className="text-xs text-ink-400 dark:text-ink-500">
                <time dateTime={thread.createdAt} title={new Date(thread.createdAt).toLocaleString()}>
                  {formatDate(thread.createdAt)}
                </time>
                {' · '}
                {formatCount(thread.views)} views
                {' · '}
                {posts.length} {posts.length === 1 ? 'reply' : 'replies'}
              </p>
            </div>
          </div>

          {/* Tags */}
          {thread.tags?.length > 0 && (
            <div className="flex gap-1.5 flex-wrap" aria-label="Thread tags">
              {thread.tags.map((tag) => (
                <Badge key={tag} variant="tag">#{tag}</Badge>
              ))}
            </div>
          )}
        </header>

        {/* Thread body */}
        <div className="card p-6 mb-8">
          <div className="prose-like text-ink-700 dark:text-parchment-200 leading-relaxed whitespace-pre-wrap break-words font-body">
            {thread.body}
          </div>

          {/* Thread actions */}
          <div className="flex items-center gap-3 mt-6 pt-4 border-t border-parchment-200 dark:border-ink-700">
            <button
              onClick={handleRootReply}
              className="btn-primary"
              aria-label="Write a reply to this thread"
            >
              ↩ Reply
            </button>
            <button
              onClick={() => navigate(-1)}
              className="btn-ghost"
              aria-label="Go back"
            >
              ← Back
            </button>
          </div>
        </div>
      </article>

      {/* Replies section */}
      <section aria-labelledby="replies-heading">
        <h2
          id="replies-heading"
          className="font-display text-xl font-semibold text-ink-800 dark:text-parchment-100 mb-6"
        >
          {posts.length > 0
            ? `${posts.length} ${posts.length === 1 ? 'Reply' : 'Replies'}`
            : 'Discussion'}
        </h2>

        {/* Root reply form */}
        {showRootReply && (
          <div id="root-reply-form" className="mb-6">
            <ReplyForm
              threadId={threadId}
              parentId={null}
              onCancel={() => setShowRootReply(false)}
              autoFocus
            />
          </div>
        )}

        {/* Post tree */}
        <PostTree
          posts={posts}
          threadId={threadId}
          onReply={(parentId) => handleReply(parentId)}
        />

        {/* Inline reply form for nested replies */}
        {replyingTo && (
          <div id={`reply-form-${replyingTo}`} className="mt-6 ml-10">
            <p className="text-xs text-ink-400 mb-2">
              Replying to a comment…{' '}
              <button
                onClick={() => setReplyingTo(null)}
                className="text-rust-500 hover:text-rust-600 underline"
              >
                Cancel
              </button>
            </p>
            <ReplyForm
              threadId={threadId}
              parentId={replyingTo}
              onCancel={() => setReplyingTo(null)}
              autoFocus
            />
          </div>
        )}

        {/* Bottom reply CTA */}
        {!showRootReply && !replyingTo && (
          <div className="mt-8 pt-6 border-t border-parchment-200 dark:border-ink-700">
            <button onClick={handleRootReply} className="btn-secondary">
              ↩ Add a Reply
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
