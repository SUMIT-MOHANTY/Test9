import React, { useState } from 'react';
import '../styles/components.css';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Security: Prevent tab-nabbing with noopener/noreferrer for external links
  const safeRelAttribute = "noopener noreferrer";

  return (
    <header className="header" role="banner">
      <div className="container header-container">
        <div className="logo">
          <a href="/" aria-label="GenAI Home">
            <span className="logo-text">GenAI</span>
          </a>
        </div>

        {/* Accessible mobile menu toggle */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
          aria-controls="navigation"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          <span className="sr-only">Menu</span>
          <span className="hamburger"></span>
        </button>

        <nav
          id="navigation"
          className={`navigation ${isMenuOpen ? 'is-open' : ''}`}
          role="navigation"
          aria-label="Main navigation"
        >
          <ul>
            <li><a href="#features" onClick={() => setIsMenuOpen(false)}>Features</a></li>
            <li><a href="#about" onClick={() => setIsMenuOpen(false)}>About AI</a></li>
            <li><a href="#contact" onClick={() => setIsMenuOpen(false)}>Contact</a></li>
            <li>
              <a
                href="/privacy-policy"
                className="privacy-link"
                onClick={() => setIsMenuOpen(false)}
              >
                Privacy Policy
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
