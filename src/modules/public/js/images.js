(() => {
  const track = document.getElementById('project-images-track');
  const slides = Array.from(track.children);
  const prevBtn = document.getElementById('prevImage');
  const nextBtn = document.getElementById('nextImage');
  let index = 0;

  const slideWidth = slides[0].offsetWidth + 16; // incluye gap

  function updateCarousel() {
    track.style.transform = `translateX(-${index * slideWidth}px)`;
  }

  prevBtn.addEventListener('click', () => {
    index = Math.max(index - 1, 0);
    updateCarousel();
  });

  nextBtn.addEventListener('click', () => {
    index = Math.min(index + 1, slides.length - 1);
    updateCarousel();
  });

  window.addEventListener('resize', () => {
    updateCarousel();
  });
})();
