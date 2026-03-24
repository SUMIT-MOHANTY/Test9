// /workspace/frontend/src/App.tsx
import React from 'react';
import Home from './pages/Home';
import './styles/global.css';

/**
 * Root App component
 * Serves as the entry point for the React application
 */
const App: React.FC = () => {
  return (
    <div className="app">
      <Home />
    </div>
  );
};

export default App;
