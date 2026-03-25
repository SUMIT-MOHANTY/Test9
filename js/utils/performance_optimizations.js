/**
 * Performance optimization utilities for GenAI Landing Page
 */

// Lazy loading for images
const setupLazyLoading = () => {
  if ('loading' in HTMLImageElement.prototype) {
    // Browser supports native lazy loading
    document.querySelectorAll('img[data-src]').forEach(img => {
      img.src = img.dataset.src;
      img.loading = 'lazy';
      delete img.dataset.src;
    });
  } else {
    // Fallback lazy loading with Intersection Observer
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const image = entry.target;
          image.src = image.dataset.src;
          delete image.dataset.src;
          imageObserver.unobserve(image);
        }
      });
    });

    lazyImages.forEach(image => imageObserver.observe(image));
  }
};

// Defer non-critical CSS
const loadDeferredStyles = () => {
  const deferredStyles = document.querySelectorAll('link[rel="preload"][as="style"]');
  deferredStyles.forEach(styleLink => {
    styleLink.rel = 'stylesheet';
  });
};

// Initialize performance optimizations
const initPerformanceOptimizations = () => {
  // Run optimizations when DOM is fully loaded
  document.addEventListener('DOMContentLoaded', () => {
    setupLazyLoading();
    loadDeferredStyles();

    // Register any other performance optimizations
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        // Run non-critical operations during browser idle time
        console.log('Performing additional optimizations during idle time');
      });
    }
  });
};

export { initPerformanceOptimizations, setupLazyLoading, loadDeferredStyles };
