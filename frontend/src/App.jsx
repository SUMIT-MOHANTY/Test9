import React, { Suspense, lazy } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

// Lazy load components for better performance
const Header = lazy(() => import('./components/Header'));
const Hero = lazy(() => import('./components/Hero'));
const Features = lazy(() => import('./components/Features'));
const ContactForm = lazy(() => import('./components/ContactForm'));
const Footer = lazy(() => import('./components/Footer'));

// Loading fallback
const LoadingFallback = () => (
  <div className="loading-container">
    <div className="spinner"></div>
    <p>Loading...</p>
  </div>
);

function App() {
  return (
    <div className="App">
      <ErrorBoundary componentName="App">
        <Suspense fallback={<LoadingFallback />}>
          <Header />

          <main>
            <ErrorBoundary componentName="Hero">
              <Hero />
            </ErrorBoundary>

            <ErrorBoundary componentName="Features">
              <Features />
            </ErrorBoundary>

            <ErrorBoundary componentName="ContactForm">
              <ContactForm />
            </ErrorBoundary>
          </main>

          <Footer />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

export default App;
