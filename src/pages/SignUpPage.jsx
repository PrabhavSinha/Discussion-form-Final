import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function SignUpPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(err => ({ ...err, [e.target.name]: '', general: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.username.trim()) e.username = 'Username is required.';
    else if (form.username.trim().length < 3) e.username = 'At least 3 characters.';
    else if (!/^[a-zA-Z0-9_]+$/.test(form.username.trim())) e.username = 'Letters, numbers, and underscores only.';
    if (!form.email.trim()) e.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address.';
    if (!form.password) e.password = 'Password is required.';
    else if (form.password.length < 6) e.password = 'At least 6 characters.';
    if (!form.confirm) e.confirm = 'Please confirm your password.';
    else if (form.confirm !== form.password) e.confirm = 'Passwords do not match.';
    return e;
  };

  const handleSubmit = e => {
    e.preventDefault();
    const fieldErrors = validate();
    if (Object.keys(fieldErrors).length > 0) { setErrors(fieldErrors); return; }
    setLoading(true);
    const result = signUp({ username: form.username.trim(), email: form.email.trim(), password: form.password });
    setLoading(false);
    if (result.error) setErrors({ general: result.error });
    else navigate('/', { replace: true });
  };

  const Field = ({ id, label, type = 'text', placeholder, autoComplete }) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5 font-body">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        value={form[id]}
        onChange={handleChange}
        placeholder={placeholder}
        className={`input-base ${errors[id] ? 'border-rust-400 focus:ring-rust-400/30' : ''}`}
        aria-invalid={!!errors[id]}
        aria-describedby={errors[id] ? `${id}-error` : undefined}
      />
      {errors[id] && (
        <p id={`${id}-error`} className="mt-1 text-xs text-rust-500 font-body" role="alert">
          {errors[id]}
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] paper-texture flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-slide-up">

        {/* Brand */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2" aria-label="Discourse — Home">
            <span className="text-3xl text-ink-700 dark:text-parchment-200" aria-hidden="true">◈</span>
            <span className="font-display text-3xl font-semibold text-ink-900 dark:text-parchment-100">
              Discourse
            </span>
          </Link>
          <p className="mt-2 text-sm text-ink-500 dark:text-ink-400 font-body">
            Join the conversation. Create your free account.
          </p>
        </div>

        {/* Card */}
        <div className="bg-parchment-50 dark:bg-ink-900 rounded-2xl border border-parchment-200 dark:border-ink-700 shadow-sm p-8">
          <h1 className="font-display text-2xl text-ink-800 dark:text-parchment-100 mb-6">Create Account</h1>

          {errors.general && (
            <div role="alert" className="mb-5 px-4 py-3 rounded-lg bg-rust-400/10 border border-rust-400/30 text-rust-600 dark:text-rust-400 text-sm font-body">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Field id="username" label="Username" placeholder="johndoe" autoComplete="username" />
            <Field id="email" label="Email" type="email" placeholder="john@example.com" autoComplete="email" />
            <Field id="password" label="Password" type="password" placeholder="Min. 6 characters" autoComplete="new-password" />
            <Field id="confirm" label="Confirm Password" type="password" placeholder="••••••••" autoComplete="new-password" />

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-500 dark:text-ink-400 font-body">
            Already have an account?{' '}
            <Link to="/signin" className="text-rust-500 hover:text-rust-600 font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
