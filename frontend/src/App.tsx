import React from 'react';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import ErrorBoundary from './components/ErrorBoundary';
import './styles/global.css';

function App(): JSX.Element {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <div className="app">
          <Helmet>
            <title>GenAI Landing Page</title>
            <meta name="description" content="Secure GenAI Landing Page" />
            {/* CSP can also be set here programmatically */}
          </Helmet>

          <header className="app-header">
            <h1>GenAI Landing Page</h1>
            <nav>
              <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/about">About</a></li>
                <li><a href="/contact">Contact</a></li>
              </ul>
            </nav>
          </header>

          <main className="app-content">
            <section className="hero">
              <h2>Welcome to GenAI Landing Page</h2>
              <p>Secure, reliable, and cutting-edge AI solutions</p>
            </section>
          </main>

          <footer className="app-footer">
            <p>&copy; {new Date().getFullYear()} GenAI Landing Page. All rights reserved.</p>
          </footer>
        </div>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
