import React from 'react';
import '../styles/components.css';

const AboutAI: React.FC = () => {
  return (
    <section id="about" className="about-section" aria-labelledby="about-heading">
      <div className="container">
        <div className="about-content">
          <h2 id="about-heading" className="section-title">About Generative AI</h2>

          <div className="about-text">
            <p>
              Generative AI refers to artificial intelligence systems that can create new content,
              including text, images, music, code, and more. These systems learn patterns from
              existing data and use that knowledge to generate novel outputs.
            </p>

            <p>
              Our platform leverages state-of-the-art generative AI models to help businesses
              and individuals unlock new creative possibilities and streamline workflows.
            </p>

            {/* Security: Using static content to prevent injection risks */}
            <div className="about-highlight">
              <h3>Responsible AI Commitment</h3>
              <p>
                We prioritize ethical AI development, with built-in safeguards against misuse,
                bias mitigation systems, and transparent operations. Our AI systems are designed
                with privacy and security at their core.
              </p>
            </div>
          </div>

          <div className="about-image" role="img" aria-label="Visualization of AI neural networks">
            <img src="/images/ai-network.webp" alt="" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutAI;
