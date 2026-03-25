import React, { useState, useEffect } from 'react';
import Header from './Header';
import Hero from './Hero';
import Features from './Features';
import Demo from './Demo';
import Testimonials from './Testimonials';
import Pricing from './Pricing';
import Contact from './Contact';
import Footer from './Footer';
import ErrorBoundary from './ErrorBoundary';
import LoadingSpinner from './LoadingSpinner';
import { checkApiConnection } from '../utils/api';

const App = () => {
  const [apiStatus, setApiStatus] = useState('checking');

  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        const isConnected = await checkApiConnection();
        setApiStatus(isConnected ? 'connected' : 'error');
      } catch (err) {
        setApiStatus('error');
        console.error('Backend connection error:', err);
      }
    };

    checkBackendStatus();
  }, []);

  return (
    <div className="app">
      <Header />

      {apiStatus === 'checking' ? (
        <div className="api-checking">
          <LoadingSpinner />
          <p>Connecting to services...</p>
        </div>
      ) : apiStatus === 'error' ? (
        <div className="api-error">
          <p>Warning: Some features may be limited due to connection issues.</p>
        </div>
      ) : null}

      <main>
        <ErrorBoundary>
          <Hero />
        </ErrorBoundary>

        <ErrorBoundary>
          <Features />
        </ErrorBoundary>

        <ErrorBoundary>
          <Demo />
        </ErrorBoundary>

        <ErrorBoundary>
          <Testimonials />
        </ErrorBoundary>

        <ErrorBoundary>
          <Pricing />
        </ErrorBoundary>

        <ErrorBoundary>
          <Contact />
        </ErrorBoundary>
      </main>

      <Footer />
    </div>
  );
};

export default App;
