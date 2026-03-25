/**
 * Browser compatibility helpers for GenAI Landing Page
 * Detects browser features and provides fallbacks
 */

// Check if browser supports modern features
const checkBrowserSupport = () => {
  const features = {
    flexbox: typeof document.createElement('div').style.flexBasis !== 'undefined',
    grid: typeof document.createElement('div').style.grid !== 'undefined',
    fetch: typeof window.fetch !== 'undefined',
    intersectionObserver: 'IntersectionObserver' in window,
    webAnimations: 'animate' in document.createElement('div'),
    customProperties: window.CSS && CSS.supports('color', 'var(--primary)'),
    webp: false // Will be tested asynchronously
  };

  // Test WebP support
  const testWebP = () => {
    const webP = new Image();
    webP.onload = () => { features.webp = true; };
    webP.onerror = () => { features.webp = false; };
    webP.src = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=';
  };

  testWebP();
  return features;
};

// Add fallback classes to HTML element based on feature support
const applyBrowserFallbacks = () => {
  const features = checkBrowserSupport();
  const html = document.documentElement;

  if (!features.flexbox) html.classList.add('no-flexbox');
  if (!features.grid) html.classList.add('no-grid');
  if (!features.customProperties) html.classList.add('no-css-variables');

  // Apply webp support class when test completes
  setTimeout(() => {
    if (features.webp) {
      html.classList.add('webp');
    } else {
      html.classList.add('no-webp');
    }
  }, 100);

  return features;
};

// Load polyfills for missing features
const loadPolyfills = async () => {
  const features = checkBrowserSupport();
  const polyfills = [];

  if (!features.fetch) {
    polyfills.push(import('whatwg-fetch'));
  }

  if (!features.intersectionObserver) {
    polyfills.push(import('intersection-observer'));
  }

  if (!features.customProperties) {
    console.log('CSS custom properties not supported. Using fallback values.');
    // This would load a CSS variables polyfill in a real implementation
  }

  if (polyfills.length > 0) {
    try {
      await Promise.all(polyfills);
      console.log('Polyfills loaded successfully');
    } catch (error) {
      console.error('Error loading polyfills:', error);
    }
  }
};

export { checkBrowserSupport, applyBrowserFallbacks, loadPolyfills };
