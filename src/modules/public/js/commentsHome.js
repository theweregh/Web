(() => {
  const carousel = document.querySelector('.comment-carousel');
  const track = carousel.querySelector('.comment-track');
  const slides = Array.from(carousel.querySelectorAll('.comment-slide'));
  const dots = Array.from(carousel.querySelectorAll('.comment-dots .dot'));
  let index = 0;

  function setSlide(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;

    slides.forEach((s, j) => s.classList.toggle('active', j === index));
    dots.forEach((d, j) => d.classList.toggle('active', j === index));
  }

  setInterval(() => setSlide(index + 1), 60000);

  dots.forEach((dot, i) => dot.addEventListener('click', () => setSlide(i)));

  setSlide(0);
})();
