// /workspace/frontend/src/components/Hero.tsx
import React from 'react';
import '../styles/components.css';

/**
 * Hero component
 * Displays the main banner at the top of the landing page
 */
const Hero: React.FC = () => {
  return (
    <section className="hero-section" id="home">
      <div className="container">
        <div className="hero-content">
          <h1 className="hero-title">Revolutionizing AI Technology</h1>
          <p className="hero-subtitle">
            Experience the power of next-generation artificial intelligence with GenAI.
            Our cutting-edge solutions are transforming industries and enhancing human potential.
          </p>
          <div className="hero-buttons">
            <a href="#features" className="btn btn-primary">Explore Features</a>
            <a href="#contact" className="btn btn-secondary">Get Started</a>
          </div>
        </div>

        <div className="hero-image">
          {/* Placeholder for hero image */}
          <div className="image-placeholder">
            AI Visualization
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
