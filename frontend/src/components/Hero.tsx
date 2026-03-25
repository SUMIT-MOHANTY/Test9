import React from 'react';
import '../styles/components.css';

const Hero: React.FC = () => {
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="container">
        <div className="hero-content">
          <h1 id="hero-heading" className="hero-title">
            The Future of AI-Powered Creation
          </h1>

          {/* Security: Using safe, static content to prevent injection */}
          <p className="hero-subtitle">
            Discover how our generative AI solutions transform ideas into reality.
          </p>

          <div className="hero-cta">
            {/* Adding aria-label for better accessibility */}
            <a
              href="#features"
              className="btn btn-primary"
              aria-label="Explore our AI features"
            >
              Explore Features
            </a>

            <a
              href="#contact"
              className="btn btn-secondary"
              aria-label="Contact us about AI solutions"
            >
              Get Started
            </a>
          </div>
        </div>

        <div className="hero-image" role="img" aria-label="AI-generated abstract visualization">
          {/* Alt text provided via aria-label on parent div */}
          <img src="/images/ai-hero.webp" alt="" loading="eager" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
