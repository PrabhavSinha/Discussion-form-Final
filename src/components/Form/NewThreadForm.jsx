import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForum } from '../../context/ForumContext.jsx';
import LoadingSpinner from '../UI/LoadingSpinner.jsx';
import { parseTags } from '../../utils/index.js';

function FormField({ label, id, error, required, hint, children }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-ink-700 dark:text-parchment-200 mb-1.5">
        {label}
        {required && <span className="text-rust-500 ml-1" aria-label="required">*</span>}
      </label>
      {hint && <p className="text-xs text-ink-400 mb-2">{hint}</p>}
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-rust-500 mt-1.5">
          {error}
        </p>
      )}
    </div>
  );
}

const VALIDATORS = {
  title: (v) => {
    if (!v?.trim()) return 'Title is required.';
    if (v.trim().length < 10) return 'Title must be at least 10 characters.';
    if (v.trim().length > 300) return 'Title must be under 300 characters.';
    return null;
  },
  categoryId: (v) => {
    if (!v) return 'Please select a category.';
    return null;
  },
  body: (v) => {
    if (!v?.trim()) return 'Post content is required.';
    if (v.trim().length < 30) return 'Content must be at least 30 characters.';
    return null;
  },
};

export default function NewThreadForm() {
  const { categories, submitThread, loading } = useForum();
  const navigate = useNavigate();

  const [values, setValues] = useState({
    title: '',
    categoryId: '',
    body: '',
    tagsRaw: '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitError, setSubmitError] = useState('');

  const handleChange = useCallback((field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  }, [errors]);

  const handleBlur = useCallback((field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const validator = VALIDATORS[field];
    if (validator) {
      const err = validator(values[field]);
      setErrors((prev) => ({ ...prev, [field]: err }));
    }
  }, [values]);

  const validate = () => {
    const newErrors = {};
    Object.keys(VALIDATORS).forEach((field) => {
      const err = VALIDATORS[field](values[field]);
      if (err) newErrors[field] = err;
    });
    setErrors(newErrors);
    setTouched({ title: true, categoryId: true, body: true });
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitError('');

    try {
      const thread = await submitThread({
        title: values.title,
        body: values.body,
        categoryId: values.categoryId,
        tags: parseTags(values.tagsRaw),
      });
      navigate(`/thread/${thread.id}`);
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit. Please try again.');
    }
  };

  const charCounts = {
    title: values.title.length,
    body: values.body.length,
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Create new discussion thread"
      className="space-y-6"
    >
      {/* Category */}
      <FormField
        label="Category"
        id="thread-category"
        error={touched.categoryId ? errors.categoryId : null}
        required
      >
        <select
          id="thread-category"
          value={values.categoryId}
          onChange={(e) => handleChange('categoryId', e.target.value)}
          onBlur={() => handleBlur('categoryId')}
          className={`input-base ${touched.categoryId && errors.categoryId ? 'border-rust-400 ring-2 ring-rust-400/20' : ''}`}
          aria-describedby={touched.categoryId && errors.categoryId ? 'thread-category-error' : undefined}
          aria-invalid={!!(touched.categoryId && errors.categoryId)}
        >
          <option value="">Select a category…</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.icon} {cat.name}
            </option>
          ))}
        </select>
      </FormField>

      {/* Title */}
      <FormField
        label="Thread Title"
        id="thread-title"
        error={touched.title ? errors.title : null}
        required
        hint="Write a clear, descriptive title that summarizes your question or topic."
      >
        <div className="relative">
          <input
            id="thread-title"
            type="text"
            value={values.title}
            onChange={(e) => handleChange('title', e.target.value)}
            onBlur={() => handleBlur('title')}
            placeholder="What's on your mind?"
            className={`input-base pr-16 ${touched.title && errors.title ? 'border-rust-400 ring-2 ring-rust-400/20' : ''}`}
            aria-describedby={touched.title && errors.title ? 'thread-title-error' : undefined}
            aria-invalid={!!(touched.title && errors.title)}
            maxLength={310}
          />
          <span
            className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs ${charCounts.title > 280 ? 'text-rust-500' : 'text-ink-400'}`}
            aria-live="polite"
          >
            {charCounts.title}/300
          </span>
        </div>
      </FormField>

      {/* Body */}
      <FormField
        label="Content"
        id="thread-body"
        error={touched.body ? errors.body : null}
        required
        hint="Provide context, background, and what you're hoping to discuss. Be specific."
      >
        <textarea
          id="thread-body"
          value={values.body}
          onChange={(e) => handleChange('body', e.target.value)}
          onBlur={() => handleBlur('body')}
          placeholder="Share your thoughts in detail…"
          rows={10}
          className={`input-base resize-y font-body ${touched.body && errors.body ? 'border-rust-400 ring-2 ring-rust-400/20' : ''}`}
          aria-describedby={touched.body && errors.body ? 'thread-body-error' : undefined}
          aria-invalid={!!(touched.body && errors.body)}
        />
        <div className="flex justify-end mt-1">
          <span
            className={`text-xs ${charCounts.body > 4500 ? 'text-rust-500' : 'text-ink-400'}`}
            aria-live="polite"
          >
            {charCounts.body.toLocaleString()} characters
          </span>
        </div>
      </FormField>

      {/* Tags */}
      <FormField
        label="Tags"
        id="thread-tags"
        hint="Comma-separated tags (optional, max 5). E.g., 'react, performance, ux'"
      >
        <input
          id="thread-tags"
          type="text"
          value={values.tagsRaw}
          onChange={(e) => handleChange('tagsRaw', e.target.value)}
          placeholder="react, performance, ux"
          className="input-base"
        />
        {/* Tag preview */}
        {values.tagsRaw && (
          <div className="flex gap-1.5 flex-wrap mt-2">
            {parseTags(values.tagsRaw).map((tag) => (
              <span
                key={tag}
                className="badge bg-parchment-200 text-ink-700 dark:bg-ink-700 dark:text-parchment-200"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </FormField>

      {/* Submit error */}
      {submitError && (
        <div role="alert" className="text-sm text-rust-600 dark:text-rust-400 bg-rust-50 dark:bg-rust-900/20 border border-rust-200 dark:border-rust-800 rounded-md px-4 py-3">
          {submitError}
        </div>
      )}

      {/* Submit */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          className="btn-primary"
          disabled={loading.submitting}
          aria-busy={loading.submitting}
        >
          {loading.submitting ? (
            <>
              <LoadingSpinner size="sm" label="Posting…" />
              Posting…
            </>
          ) : (
            'Post Thread'
          )}
        </button>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="btn-secondary"
          disabled={loading.submitting}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
