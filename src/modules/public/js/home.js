(() => {
  const carousel = document.querySelector('.carousel');
  const track = carousel.querySelector('.carousel-track');
  const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
  const dots = Array.from(carousel.querySelectorAll('.carousel-dots .dot'));

  const visibleSlides = 3;
  const middleOffset = Math.floor(visibleSlides / 2); // 👉 el índice del slide medio
  const originalSlidesCount = slides.length;

  let index = 0;
  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let dragging = false;
  let isMoving = false;

  // Clonamos para efecto infinito
  for (let i = 0; i < visibleSlides; i++) {
    const cloneStart = slides[originalSlidesCount - 1 - i]?.cloneNode(true);
    if (cloneStart) track.insertBefore(cloneStart, slides[0]);
  }
  for (let i = 0; i < visibleSlides; i++) {
    const cloneEnd = slides[i]?.cloneNode(true);
    if (cloneEnd) track.appendChild(cloneEnd);
  }

  const allSlides = Array.from(track.children);
  const links = Array.from(document.querySelectorAll('.carousel-slide a'));

  function getSlideWidth() {
    const slide = document.querySelector('.carousel-slide');
    return slide ? slide.offsetWidth : window.innerWidth / visibleSlides;
  }

  function setSlide(i, immediate = false) {
    index = i;

    // 🔧 Centramos el slide medio, no el primero visible
    const transformIndex = index + visibleSlides - middleOffset;

    currentTranslate = -(transformIndex) * getSlideWidth();
    track.style.transition = immediate ? 'none' : 'transform 0.6s ease';
    track.style.transform = `translateX(${currentTranslate}px)`;

    // 🔧 Dots: el activo corresponde al central
    dots.forEach((d, j) => d.classList.toggle('active', j === index));

    // Centrado visual
    const centeredSlide = allSlides[transformIndex + middleOffset];
    allSlides.forEach(slide => slide.classList.remove('is-centered'));

    setTimeout(() => {
      if (centeredSlide) centeredSlide.classList.add('is-centered');
    }, immediate ? 0 : 80);

    // Loop infinito
    if (i === -1) setTimeout(() => setSlide(originalSlidesCount - 1, true), 600);
    else if (i === originalSlidesCount) setTimeout(() => setSlide(0, true), 600);
  }

  // Eventos de drag
  track.addEventListener('mousedown', startDrag);
  window.addEventListener('mouseup', endDrag);
  window.addEventListener('mousemove', drag);
  track.addEventListener('touchstart', startDrag, { passive: true });
  track.addEventListener('touchend', endDrag);
  track.addEventListener('touchmove', drag, { passive: true });

  function startDrag(e) {
    dragging = true;
    isMoving = false;
    if (e.type === 'mousedown') e.preventDefault();
    startX = e.pageX || e.touches[0].pageX;
    prevTranslate = currentTranslate;
    track.style.transition = 'none';
  }

  function drag(e) {
    if (!dragging) return;
    const currentX = e.pageX || e.touches[0].pageX;
    const diff = currentX - startX;
    if (Math.abs(diff) > 5) isMoving = true;
    currentTranslate = prevTranslate + diff;
    track.style.transform = `translateX(${currentTranslate}px)`;
  }

  function endDrag() {
    if (!dragging) return;
    dragging = false;
    const slideWidth = getSlideWidth();
    const movedBy = currentTranslate - prevTranslate;

    if (movedBy < -100) index++;
    else if (movedBy > 100) index--;

    if (index < -1) index = -1;
    if (index > originalSlidesCount) index = originalSlidesCount;

    setSlide(index);
  }

  // Bloqueo de click mientras arrastras
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      if (isMoving || index === -1 || index === originalSlidesCount) {
        e.preventDefault();
      }
    });
  });

  // Dots + resize
  dots.forEach((dot, i) => dot.addEventListener('click', () => setSlide(i)));
  window.addEventListener('resize', () => setSlide(index, true));

  window.addEventListener('load', () => {
    console.log("Carrusel centrado ✅");
    // 🧭 Empezamos con el primer slide centrado correctamente
    setTimeout(() => setSlide(0, true), 100);
  });
})();
