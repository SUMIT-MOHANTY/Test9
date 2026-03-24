import React from 'react';

const Hero: React.FC = () => {
  return (
    <section id="home" className="hero">
      <div className="container">
        <div className="hero-content">
          <h1>Next Generation AI Solutions</h1>
          <p>Empowering businesses with intelligent automation and predictive analytics</p>

          <div className="hero-buttons">
            <a href="#features" className="btn btn-primary">Explore Features</a>
            <a href="#contact" className="btn btn-secondary">Contact Us</a>
          </div>
        </div>

        <div className="hero-image">
          {/* Placeholder for hero image */}
          <div className="ai-animation"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
