import React from 'react';
import { HeroProps } from '../types';

const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  ctaText,
  backgroundImage
}) => {
  const heroStyle = backgroundImage ?
    { backgroundImage: `url(${backgroundImage})` } : {};

  return (
    <section className="hero" style={heroStyle}>
      <div className="container">
        <div className="hero-content">
          <h1>{title}</h1>
          <p>{subtitle}</p>
          <button className="cta-button">{ctaText}</button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
