import React from 'react';
import { AboutAIProps } from '../types';

const AboutAI: React.FC<AboutAIProps> = ({
  title,
  description,
  imageUrl
}) => {
  return (
    <section id="about" className="about-section">
      <div className="container">
        <div className="about-content">
          <div className="about-text">
            <h2>{title}</h2>
            <p>{description}</p>
            <ul className="about-benefits">
              <li>Advanced natural language processing</li>
              <li>Image and video generation capabilities</li>
              <li>Custom AI solutions for businesses</li>
              <li>Scalable and secure infrastructure</li>
            </ul>
          </div>

          {imageUrl && (
            <div className="about-image">
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
