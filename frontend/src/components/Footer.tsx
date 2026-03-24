import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>GenAI</h3>
            <p>Transforming industries with cutting-edge AI technology</p>
          </div>

          <div className="footer-section">
            <h3>Links</h3>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#about">About AI</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Connect</h3>
            <div className="social-links">
              <a href="https://twitter.com/genai" target="_blank" rel="noopener noreferrer">Twitter</a>
              <a href="https://linkedin.com/company/genai" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href="https://github.com/genai" target="_blank" rel="noopener noreferrer">GitHub</a>
            </div>
          </div>
        </div>

        <div className="copyright">
          &copy; {currentYear} GenAI. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
