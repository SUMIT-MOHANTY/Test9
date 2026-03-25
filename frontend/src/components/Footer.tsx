import React from 'react';
import '../styles/components.css';
import { FooterProps } from '../types';

const Footer: React.FC<FooterProps> = ({
  companyName = 'GenAI',
  year = new Date().getFullYear()
}) => {
  // Security: Use safe external link attributes
  const safeRelAttribute = "noopener noreferrer";

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <a href="/" aria-label={`${companyName} Home`}>
              <span className="logo-text">{companyName}</span>
            </a>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h4>Product</h4>
              <ul>
                <li><a href="#features">Features</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#use-cases">Use Cases</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Resources</h4>
              <ul>
                <li><a href="#">Documentation</a></li>
                <li><a href="#">Tutorials</a></li>
                <li><a href="#">Blog</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Company</h4>
              <ul>
                <li><a href="#contact">Contact</a></li>
                <li><a href="/privacy-policy">Privacy Policy</a></li>
                <li><a href="/terms-of-service">Terms of Service</a></li>
                <li><a href="/cookie-policy">Cookie Policy</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Connect</h4>
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
            &copy; {year} {companyName}. All rights reserved.
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
