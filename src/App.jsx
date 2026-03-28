import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ForumProvider } from './context/ForumContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import Navigation from './components/Navigation/Navigation.jsx';
import NotificationContainer from './components/UI/Notifications.jsx';
import { LoadingState } from './components/UI/LoadingSpinner.jsx';
import RequireAuth from './components/UI/RequireAuth.jsx';

// Lazy load pages for code splitting and performance
const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const CategoryPage = lazy(() => import('./pages/CategoryPage.jsx'));
const ThreadPage = lazy(() => import('./pages/ThreadPage.jsx'));
const NewThreadPage = lazy(() => import('./pages/NewThreadPage.jsx'));
const SearchPage = lazy(() => import('./pages/SearchPage.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));
const SignInPage = lazy(() => import('./pages/SignInPage.jsx'));
const SignUpPage = lazy(() => import('./pages/SignUpPage.jsx'));

function PageLoader() {
  return <LoadingState message="Loading page…" />;
}

function AppLayout() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] paper-texture">
      <Navigation />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Auth routes — public */}
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* Protected routes */}
          <Route path="/" element={<RequireAuth><HomePage /></RequireAuth>} />
          <Route path="/category/:categoryId" element={<RequireAuth><CategoryPage /></RequireAuth>} />
          <Route path="/thread/:threadId" element={<RequireAuth><ThreadPage /></RequireAuth>} />
          <Route path="/new" element={<RequireAuth><NewThreadPage /></RequireAuth>} />
          <Route path="/search" element={<RequireAuth><SearchPage /></RequireAuth>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <NotificationContainer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <ForumProvider>
            <AppLayout />
          </ForumProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
