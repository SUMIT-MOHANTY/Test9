import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.css';
import ErrorBoundary from './components/ErrorBoundary';

// Error handling for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  // In production, you would report this to your error monitoring service
  event.preventDefault();
});

// Global error handler
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  // In production, you would report this to your error monitoring service
  event.preventDefault();
});

// Safe render method with error handling
const renderApp = () => {
  const rootElement = document.getElementById('root');

  // Validate root element exists
  if (!rootElement) {
    console.error('Root element not found in DOM');
    return;
  }

  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Failed to render app:', error);

    // Fallback render in case of critical error
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="text-align: center; padding: 20px;">
          <h2>Unable to load the application</h2>
          <p>Please try refreshing the page or contact support if the problem persists.</p>
          <button onclick="window.location.reload()">Refresh Page</button>
        </div>
      `;
    }
  }
};

// Start the application
renderApp();
