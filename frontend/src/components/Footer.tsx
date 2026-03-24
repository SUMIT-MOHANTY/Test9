// /workspace/frontend/src/components/Footer.tsx
import React, { useState, useEffect } from 'react';
import apiService, { ContactInfo } from '../services/api';
import '../styles/components.css';

/**
 * Footer component
 * Displays footer with links and contact information
 */
const Footer: React.FC = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        setLoading(true);
        const info = await apiService.getContactInfo();
        setContactInfo(info);
      } catch (err) {
        console.error('Error fetching contact info for footer:', err);
        // Use fallback contact info in case of error
        setContactInfo({
          email: "info@genai.example.com",
          phone: "+1 (555) 000-0000",
          address: "AI Technology Park, Tech City"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>GenAI</h3>
            <p>Leading the way in artificial intelligence innovation and solutions.</p>
          </div>

          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><a href="#home">Home</a></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Contact Us</h3>
            {loading ? (
              <p>Loading contact information...</p>
            ) : contactInfo ? (
              <ul className="contact-list">
                <li>{contactInfo.email}</li>
                <li>{contactInfo.phone}</li>
                <li>{contactInfo.address}</li>
              </ul>
            ) : (
              <p>Contact information unavailable</p>
            )}
          </div>

          <div className="footer-section">
            <h3>Follow Us</h3>
            <div className="social-links">
              <a href="https://twitter.com/genai" target="_blank" rel="noopener noreferrer">Twitter</a>
              <a href="https://linkedin.com/company/genai" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href="https://github.com/genai" target="_blank" rel="noopener noreferrer">GitHub</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} GenAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
