window.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.carousel-track');
  const originalPanels = Array.from(track.children).map(p => p.cloneNode(true));
  let panels = [];
  let index = 0;
  let isTransitioning = false;
  let autoScrollInterval;

  // Get how many cards are visible depending on screen width
  function getVisibleCards() {
    if (window.innerWidth <= 600) return 1;
    if (window.innerWidth <= 1000) return 2;
    return 3;
  }

  // Width of one panel including margin
  function getPanelWidth() {
    if (!panels[0]) return 0;
    const style = window.getComputedStyle(panels[0]);
    const margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight);
    return panels[0].getBoundingClientRect().width + margin;
  }

  // Build the carousel with clones for infinite effect
  function clonePanels() {
    const visibleCards = getVisibleCards();
    clearInterval(autoScrollInterval);
    isTransitioning = true;

    track.style.transition = 'none';
    track.innerHTML = '';

    // Append clones: [clones of original] + [original] + [clones of original]
    originalPanels.forEach(p => track.appendChild(p.cloneNode(true)));
    originalPanels.forEach(p => track.appendChild(p.cloneNode(true)));
    originalPanels.forEach(p => track.appendChild(p.cloneNode(true)));

    panels = Array.from(track.children);

    // Start at the middle set (the real originals)
    index = originalPanels.length;
    track.style.transform = `translateX(-${index * getPanelWidth()}px)`;

    // Let other scripts know carousel has been updated (for lightbox)
    document.dispatchEvent(new CustomEvent('carouselUpdated'));

    requestAnimationFrame(() => {
      track.style.transition = 'transform 0.4s ease';
      isTransitioning = false;
    });

    startAutoScroll();
  }

  // Move to a new index
  function moveToIndex(newIndex) {
    if (isTransitioning) return;
    isTransitioning = true;
    index = newIndex;
    track.style.transform = `translateX(-${index * getPanelWidth()}px)`;
  }

  function nextSlide() { moveToIndex(index + 1); }
  function prevSlide() { moveToIndex(index - 1); }

  // Infinite scroll logic
  track.addEventListener('transitionend', () => {
    const panelCount = originalPanels.length;
    const panelWidth = getPanelWidth();

    // Moved past last real panel
    if (index >= panelCount * 2) {
      track.style.transition = 'none';
      index = panelCount;
      track.style.transform = `translateX(-${index * panelWidth}px)`;
      requestAnimationFrame(() => track.style.transition = 'transform 0.4s ease');
    }
    // Moved before first real panel
    else if (index < panelCount) {
      track.style.transition = 'none';
      index = panelCount * 2 - 1;
      track.style.transform = `translateX(-${index * panelWidth}px)`;
      requestAnimationFrame(() => track.style.transition = 'transform 0.4s ease');
    }

    isTransitioning = false;
  });

  // Buttons
  document.querySelector('.carousel-btn.next').addEventListener('click', () => { nextSlide(); resetAutoScroll(); });
  document.querySelector('.carousel-btn.prev').addEventListener('click', () => { prevSlide(); resetAutoScroll(); });

  // Auto-scroll
  function startAutoScroll() {
    autoScrollInterval = setInterval(() => { if (!isTransitioning) nextSlide(); }, 3000);
  }

  function resetAutoScroll() {
    clearInterval(autoScrollInterval);
    startAutoScroll();
  }

  // Handle resizing
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(clonePanels, 200);
  });

  // Initial setup
  clonePanels();

  // Lightbox integration
  window.attachLightboxEvents = function() {
    const panelsImgs = Array.from(document.querySelectorAll('.carousel-panel img'));
    panelsImgs.forEach((img, i) => img.onclick = () => {
      document.dispatchEvent(new CustomEvent('lightboxOpen', { detail: i % originalPanels.length }));
    });
  };

  // Attach lightbox to cloned panels
  window.attachLightboxEvents();
});