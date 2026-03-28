import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function SignInPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [form, setForm] = useState({ usernameOrEmail: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.usernameOrEmail.trim() || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    const result = signIn(form);
    setLoading(false);
    if (result.error) setError(result.error);
    else navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] paper-texture flex items-center justify-center px-4">
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
            Welcome back. Sign in to continue.
          </p>
        </div>

        {/* Card */}
        <div className="bg-parchment-50 dark:bg-ink-900 rounded-2xl border border-parchment-200 dark:border-ink-700 shadow-sm p-8">
          <h1 className="font-display text-2xl text-ink-800 dark:text-parchment-100 mb-6">Sign In</h1>

          {error && (
            <div role="alert" className="mb-5 px-4 py-3 rounded-lg bg-rust-400/10 border border-rust-400/30 text-rust-600 dark:text-rust-400 text-sm font-body">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="usernameOrEmail" className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5 font-body">
                Username or Email
              </label>
              <input
                id="usernameOrEmail"
                name="usernameOrEmail"
                type="text"
                autoComplete="username"
                value={form.usernameOrEmail}
                onChange={handleChange}
                placeholder="john or john@example.com"
                className="input-base"
                aria-invalid={!!error}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5 font-body">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="input-base"
                aria-invalid={!!error}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-500 dark:text-ink-400 font-body">
            Don't have an account?{' '}
            <Link to="/signup" className="text-rust-500 hover:text-rust-600 font-semibold transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
