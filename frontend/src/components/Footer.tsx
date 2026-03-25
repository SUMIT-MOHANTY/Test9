import React from 'react';
import { FooterProps } from '../types';

const Footer: React.FC<FooterProps> = ({
  companyName = 'GenAI',
  year = new Date().getFullYear()
}) => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <h3>{companyName}</h3>
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
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {year} {companyName}. All rights reserved.</p>
          <div className="social-icons">
            <a href="#" aria-label="Twitter"><span>Twitter</span></a>
            <a href="#" aria-label="LinkedIn"><span>LinkedIn</span></a>
            <a href="#" aria-label="GitHub"><span>GitHub</span></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
