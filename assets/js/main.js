// Portfolio interactions
const Portfolio = (() => {
  const init = () => {
    setupSmoothScroll();
    setupAnalytics();
  };

  const setupSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      });
    });
  };

  const setupAnalytics = () => {
    // Track page visits (optional)
    console.log(`Loaded: ${window.location.pathname}`);
  };

  return { init };
})();

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', Portfolio.init);

