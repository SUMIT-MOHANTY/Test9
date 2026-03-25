import React from 'react';
import '../styles/components.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  // Security: Use safe external link attributes
  const safeRelAttribute = "noopener noreferrer";

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <a href="/" aria-label="GenAI Home">
              <span className="logo-text">GenAI</span>
            </a>
          </div>

          <div className="footer-links">
            <div className="footer-links-column">
              <h3>Navigation</h3>
              <ul>
                <li><a href="#features">Features</a></li>
                <li><a href="#about">About AI</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>

            <div className="footer-links-column">
              <h3>Legal</h3>
              <ul>
                <li><a href="/privacy-policy">Privacy Policy</a></li>
                <li><a href="/terms-of-service">Terms of Service</a></li>
                <li><a href="/cookie-policy">Cookie Policy</a></li>
              </ul>
            </div>

            <div className="footer-links-column">
              <h3>Connect</h3>
              <ul className="social-links">
                <li>
                  <a
                    href="https://twitter.com/genai"
                    target="_blank"
                    rel={safeRelAttribute}
                    aria-label="Twitter"
                  >
                    <span className="icon icon-twitter" aria-hidden="true"></span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://linkedin.com/company/genai"
                    target="_blank"
                    rel={safeRelAttribute}
                    aria-label="LinkedIn"
                  >
                    <span className="icon icon-linkedin" aria-hidden="true"></span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/genai"
                    target="_blank"
                    rel={safeRelAttribute}
                    aria-label="GitHub"
                  >
                    <span className="icon icon-github" aria-hidden="true"></span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">
            &copy; {currentYear} GenAI. All rights reserved.
          </p>

          {/* Security: Add cookie consent reminder */}
          <div className="cookie-notice">
            <p>
              This site uses cookies for analytics and personalized content.
              <button className="cookie-settings-button">Cookie Settings</button>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
