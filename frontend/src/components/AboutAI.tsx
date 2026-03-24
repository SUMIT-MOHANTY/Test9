import React from 'react';

const AboutAI: React.FC = () => {
  return (
    <section id="about" className="about-ai">
      <div className="container">
        <div className="about-content">
          <div className="about-text">
            <h2>About Our AI Technology</h2>
            <p>
              At GenAI, we're pioneering the next generation of artificial intelligence solutions
              designed to solve complex business problems and drive innovation across industries.
            </p>
            <p>
              Our proprietary algorithms are built on cutting-edge research in deep learning,
              neural networks, and reinforcement learning. We combine these technologies with
              domain expertise to create AI systems that deliver real business value.
            </p>
            <p>
              With a focus on ethical AI development and transparent processes, we ensure our
              technology is not only powerful but also responsible and accessible.
            </p>

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

          <div className="about-image">
            {/* Placeholder for about section image */}
            <div className="tech-diagram"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutAI;
