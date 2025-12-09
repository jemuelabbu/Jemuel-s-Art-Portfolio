window.addEventListener('DOMContentLoaded', () => {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.querySelector('.lightbox-img');
  const closeBtn = document.querySelector('.lightbox-close');
  const prevBtn = document.querySelector('.lightbox-prev');
  const nextBtn = document.querySelector('.lightbox-next');
  let currentIndex = 0;

  function getAllPanels() {
    return Array.from(document.querySelectorAll('.carousel-panel img'));
  }

  function openLightbox(i) {
    const panels = getAllPanels();
    lightboxImg.src = panels[i].src;
    currentIndex = i;
    lightbox.style.display = 'flex';
  }

  function showImage(i) {
    const panels = getAllPanels();
    if (i < 0) i = panels.length - 1;
    if (i >= panels.length) i = 0;
    lightboxImg.src = panels[i].src;
    currentIndex = i;
  }

  closeBtn.addEventListener('click', () => lightbox.style.display = 'none');
  nextBtn.addEventListener('click', () => showImage(currentIndex + 1));
  prevBtn.addEventListener('click', () => showImage(currentIndex - 1));

  document.addEventListener('keydown', (e) => {
    if (lightbox.style.display !== 'flex') return;
    if (e.key === 'Escape') lightbox.style.display = 'none';
    else if (e.key === 'ArrowRight') showImage(currentIndex + 1);
    else if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
  });

  // Listen for carousel updates to reattach click events
  document.addEventListener('carouselUpdated', () => {
    if (window.attachLightboxEvents) window.attachLightboxEvents();
  });

  // Listen for lightboxOpen events
  document.addEventListener('lightboxOpen', (e) => openLightbox(e.detail));
});