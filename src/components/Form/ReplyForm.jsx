import { useState, useRef, useEffect } from 'react';
import { useForum } from '../../context/ForumContext.jsx';
import Avatar from '../UI/Avatar.jsx';
import LoadingSpinner from '../UI/LoadingSpinner.jsx';

function FieldError({ error, id }) {
  if (!error) return null;
  return (
    <p id={id} role="alert" className="text-xs text-rust-500 mt-1">
      {error}
    </p>
  );
}

export default function ReplyForm({ threadId, parentId, onCancel, autoFocus = false }) {
  const { submitPost, loading, getUser, currentUserId, getUser: getUserById } = useForum();
  const currentUser = getUser(currentUserId);

  // Controlled form state
  const [body, setBody] = useState('');
  const [error, setError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const textareaRef = useRef(null);

  // Auto-focus when form mounts
  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  const validate = () => {
    if (!body.trim()) {
      setError('Reply cannot be empty.');
      return false;
    }
    if (body.trim().length < 10) {
      setError('Reply must be at least 10 characters.');
      return false;
    }
    setError('');
    return true;
  };

  const handleBodyChange = (e) => {
    setBody(e.target.value);
    if (error && e.target.value.trim().length >= 10) {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitError('');

    try {
      await submitPost({ threadId, parentId, body });
      setBody('');
    } catch (err) {
      setSubmitError(err.message || 'Failed to post reply. Please try again.');
    }
  };

  const charCount = body.length;
  const maxChars = 5000;
  const isOverLimit = charCount > maxChars;

  return (
    <form
      onSubmit={handleSubmit}
      className="card p-4 animate-slide-up"
      noValidate
      aria-label={parentId ? 'Reply to comment' : 'Post a reply'}
    >
      <div className="flex gap-3">
        <Avatar user={currentUser} size="sm" />

        <div className="flex-1 min-w-0">
          {/* Textarea */}
          <div>
            <label htmlFor={`reply-body-${parentId || 'root'}`} className="sr-only">
              Your reply
            </label>
            <textarea
              id={`reply-body-${parentId || 'root'}`}
              ref={textareaRef}
              value={body}
              onChange={handleBodyChange}
              onBlur={validate}
              placeholder="Share your thoughts…"
              rows={4}
              className={`input-base resize-none ${error ? 'border-rust-400 ring-rust-400/20 ring-2' : ''}`}
              aria-describedby={error ? `reply-error-${parentId || 'root'}` : undefined}
              aria-invalid={!!error}
              disabled={loading.submitting}
              maxLength={maxChars + 100}
            />
            <div className="flex justify-between items-center mt-1">
              <FieldError
                error={error}
                id={`reply-error-${parentId || 'root'}`}
              />
              <span
                className={`text-xs ml-auto ${isOverLimit ? 'text-rust-500 font-medium' : 'text-ink-400'}`}
                aria-live="polite"
                aria-label={`${charCount} of ${maxChars} characters used`}
              >
                {charCount}/{maxChars}
              </span>
            </div>
          </div>

          {/* Submit error */}
          {submitError && (
            <p role="alert" className="text-xs text-rust-500 mt-2">
              {submitError}
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 mt-3">
            <button
              type="submit"
              className="btn-primary"
              disabled={loading.submitting || isOverLimit || !body.trim()}
              aria-busy={loading.submitting}
            >
              {loading.submitting ? (
                <>
                  <LoadingSpinner size="sm" label="Posting…" />
                  Posting…
                </>
              ) : (
                'Post Reply'
              )}
            </button>

            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="btn-ghost"
                disabled={loading.submitting}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
