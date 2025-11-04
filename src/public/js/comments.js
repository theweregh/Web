// === Carrusel de comentarios ===
const comments = document.querySelectorAll('.comment-item');
const prevBtn = document.getElementById('prevComment');
const nextBtn = document.getElementById('nextComment');

if (comments.length > 0) {
  let current = 0;

  function showComment(index) {
    comments.forEach((c, i) => c.classList.toggle('active', i === index));
  }

  prevBtn.addEventListener('click', () => {
    current = (current - 1 + comments.length) % comments.length;
    showComment(current);
  });

  nextBtn.addEventListener('click', () => {
    current = (current + 1) % comments.length;
    showComment(current);
  });

  // Cambio automático cada 6s
  setInterval(() => {
    current = (current + 1) % comments.length;
    showComment(current);
  }, 6000);
}
