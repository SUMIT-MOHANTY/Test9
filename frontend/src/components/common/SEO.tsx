import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: 'website' | 'article';
  twitterCard?: 'summary' | 'summary_large_image';
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  ogImage,
  ogUrl,
  ogType = 'website',
  twitterCard = 'summary_large_image'
}) => {
  // Ensure all content is properly sanitized for security
  const sanitizeContent = (content: string): string => {
    // Basic sanitization - in production, use a proper HTML sanitizer
    return content.replace(/[<>&"']/g, (char) => {
      switch (char) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '"': return '&quot;';
        case "'": return '&#39;';
        default: return char;
      }
    });
  };

  const sanitizedTitle = sanitizeContent(title);
  const sanitizedDescription = sanitizeContent(description);

  return (
    <Helmet>
      <title>{sanitizedTitle}</title>
      <meta name="description" content={sanitizedDescription} />
      {keywords && <meta name="keywords" content={sanitizeContent(keywords)} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={sanitizedTitle} />
      <meta property="og:description" content={sanitizedDescription} />
      {ogImage && <meta property="og:image" content={sanitizeContent(ogImage)} />}
      {ogUrl && <meta property="og:url" content={sanitizeContent(ogUrl)} />}

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={sanitizedTitle} />
      <meta name="twitter:description" content={sanitizedDescription} />
      {ogImage && <meta name="twitter:image" content={sanitizeContent(ogImage)} />}

      {/* Security headers */}
      <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; connect-src 'self' https://api.example.com;" />
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
    </Helmet>
  );
};

export default SEO;
