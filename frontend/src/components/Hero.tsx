import React from 'react';
import '../styles/components.css';
import { HeroProps } from '../types';

const Hero: React.FC<HeroProps> = ({
  title = 'The Future of AI-Powered Creation',
  subtitle = 'Discover how our generative AI solutions transform ideas into reality.',
  ctaText = 'Explore Features',
  backgroundImage
}) => {
  const heroStyle = backgroundImage ?
    { backgroundImage: `url(${backgroundImage})` } : {};

  return (
    <section className="hero" style={heroStyle} aria-labelledby="hero-heading">
      <div className="container">
        <div className="hero-content">
          <h1 id="hero-heading" className="hero-title">
            {title}
          </h1>

          <p className="hero-subtitle">
            {subtitle}
          </p>

          <div className="hero-cta">
            <a
              href="#features"
              className="btn btn-primary"
              aria-label="Explore our AI features"
            >
              {ctaText}
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
          <img src="/images/ai-hero.webp" alt="" loading="eager" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
