import React from 'react';
import '../styles/components.css';

interface Feature {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

const FeatureSection: React.FC = () => {
  // Security: Static feature data to prevent injection
  const features: Feature[] = [
    {
      id: "feature-1",
      title: "Text Generation",
      description: "Create human-like text for various applications including content writing, summarization, and translation.",
      iconName: "text-generation"
    },
    {
      id: "feature-2",
      title: "Image Creation",
      description: "Transform text prompts into stunning visuals with our advanced image generation AI.",
      iconName: "image-creation"
    },
    {
      id: "feature-3",
      title: "Code Assistance",
      description: "Get help writing, debugging, and optimizing code across multiple programming languages.",
      iconName: "code-assist"
    },
    {
      id: "feature-4",
      title: "Voice Synthesis",
      description: "Convert text to natural-sounding speech in multiple languages and voices.",
      iconName: "voice-synthesis"
    },
  ];

  return (
    <section id="features" className="feature-section" aria-labelledby="features-heading">
      <div className="container">
        <h2 id="features-heading" className="section-title">GenAI Features</h2>
        <p className="section-subtitle">Powerful tools to enhance your creativity and productivity</p>

        <div className="features-grid">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="feature-card"
              // Security: Using unique, predictable IDs
              id={feature.id}
            >
              <div className="feature-icon" aria-hidden="true">
                {/* Icon rendered as CSS background or SVG component */}
                <span className={`icon icon-${feature.iconName}`}></span>
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
