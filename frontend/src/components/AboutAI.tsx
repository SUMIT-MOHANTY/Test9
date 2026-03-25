import React from 'react';
import '../styles/components.css';
import { AboutAIProps } from '../types';

const AboutAI: React.FC<AboutAIProps> = ({
  title = "About Generative AI",
  description = "Generative AI refers to artificial intelligence systems that can create new content, including text, images, music, code, and more. These systems learn patterns from existing data and use that knowledge to generate novel outputs.",
  imageUrl = "/images/ai-network.webp"
}) => {
  return (
    <section id="about" className="about-section" aria-labelledby="about-heading">
      <div className="container">
        <div className="about-content">
          <h2 id="about-heading" className="section-title">{title}</h2>

          <div className="about-text">
            <p>{description}</p>

            <p>
              Our platform leverages state-of-the-art generative AI models to help businesses
              and individuals unlock new creative possibilities and streamline workflows.
            </p>

            <ul className="about-benefits">
              <li>Advanced natural language processing</li>
              <li>Image and video generation capabilities</li>
              <li>Custom AI solutions for businesses</li>
              <li>Scalable and secure infrastructure</li>
            </ul>

            <div className="about-highlight">
              <h3>Responsible AI Commitment</h3>
              <p>
                We prioritize ethical AI development, with built-in safeguards against misuse,
                bias mitigation systems, and transparent operations. Our AI systems are designed
                with privacy and security at their core.
              </p>
            </div>

            <div className="about-stats">
              <div className="stat">
                <h3>99.8%</h3>
                <p>Accuracy Rate</p>
              </div>
              <div className="stat">
                <h3>500+</h3>
                <p>Enterprise Clients</p>
              </div>
              <div className="stat">
                <h3>24/7</h3>
                <p>AI Availability</p>
              </div>
            </div>
          </div>

          {imageUrl && (
            <div className="about-image" role="img" aria-label="Visualization of AI neural networks">
              <img
                src={imageUrl}
                alt="AI Capabilities Visualization"
                loading="lazy"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AboutAI;
