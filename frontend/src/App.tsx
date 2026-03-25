import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import ErrorBoundary from './components/common/ErrorBoundary';
import LoadingFallback from './components/common/LoadingFallback';

// Lazy load pages for better performance and smaller initial bundle size
const Home = React.lazy(() => import('./pages/Home'));
// Other pages would be imported similarly
const NotFound = React.lazy(() => import('./pages/NotFound'));

// Create a secure layout wrapper that can be extended for auth checks
interface LayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="app-container">
      <header className="app-header">
        <nav className="nav-container">
          {/* Navigation content would go here */}
        </nav>
      </header>
      <main className="main-content">
        <ErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>
            {children}
          </Suspense>
        </ErrorBoundary>
      </main>
      <footer className="app-footer">
        {/* Footer content would go here */}
      </footer>
    </div>
  );
};

// Create protected route component for future use
interface ProtectedRouteProps {
  element: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  // This would check authentication in a real app
  const isAuthenticated = true; // Replace with actual auth check

  return isAuthenticated ? (
    <>{element}</>
  ) : (
    <Navigate to="/login" replace />
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <Router>
          <MainLayout>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />

              {/* Protected routes - for future use */}
              {/*
              <Route
                path="/dashboard"
                element={<ProtectedRoute element={<Dashboard />} />}
              />
              */}

              {/* Catch-all route for 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MainLayout>
        </Router>
      </HelmetProvider>
    </ErrorBoundary>
  );
};

export default App;
