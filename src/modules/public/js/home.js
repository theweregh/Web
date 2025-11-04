const track = document.querySelector('.carousel-track');
const slides = Array.from(document.querySelectorAll('.carousel-slide'));
const dots = Array.from(document.querySelectorAll('.dot'));

// 💡 Variables para el bucle infinito
const visibleSlides = 3;
const originalSlidesCount = slides.length;
let index = 0; 
let startX = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let dragging = false;
let isMoving = false;
let links = []; 

// 💡 1. Clonar slides para el efecto infinito
for (let i = 0; i < visibleSlides; i++) {
    const clone = slides[originalSlidesCount - 1 - i].cloneNode(true);
    track.insertBefore(clone, slides[0]);
}
for (let i = 0; i < visibleSlides; i++) {
    const clone = slides[i].cloneNode(true);
    track.appendChild(clone);
}

// 💡 2. Recargar la lista de enlaces y slides después de clonar
links = Array.from(document.querySelectorAll('.carousel-slide a'));
const allSlides = Array.from(track.children); 

function getSlideWidth() {
    // Retorna el ancho de un solo slide (100% de la vista / 3)
    return window.innerWidth / 3;
}

function setSlide(i, immediate = false) {
    index = i;
    
    // El slide real que queremos mostrar es: (Clones iniciales) + (Índice del proyecto)
    const transformIndex = index + visibleSlides; 
    
    // 💥 CÁLCULO CRÍTICO PARA EL CENTRADO 💥
    // Para que el slide "transformIndex" quede en el centro de las 3 vistas, 
    // debemos mover el track para que el primer slide visible sea transformIndex - 1.
    currentTranslate = -(transformIndex - 1) * getSlideWidth(); 

    // Aplicar la transformación y la transición
    track.style.transition = immediate ? 'none' : 'transform 0.5s ease';
    track.style.transform = `translateX(${currentTranslate}px)`;
    
    // Actualizar los dots
    dots.forEach((d, j) => d.classList.toggle('active', j === index));
    
    // 💡 CLAVE JS: Lógica para el slide centrado (quita el filtro negro)
    const centeredSlideElement = allSlides[transformIndex]; 
    
    allSlides.forEach(slide => slide.classList.remove('is-centered'));

    setTimeout(() => {
        if (centeredSlideElement) {
            centeredSlideElement.classList.add('is-centered');
        }
    }, immediate ? 0 : 50); 
    
    
    // Lógica del Bucle (Salto Instantáneo para simular el infinito)
    if (i === -1) {
        setTimeout(() => setSlide(originalSlidesCount - 1, true), 500);
    } else if (i === originalSlidesCount) {
        setTimeout(() => setSlide(0, true), 500);
    }
}

/* 🔹 Eventos de Drag */

// Event listeners para ratón y táctil
track.addEventListener('mousedown', startDrag);
window.addEventListener('mouseup', endDrag); 
window.addEventListener('mousemove', drag); 
track.addEventListener('touchstart', startDrag, { passive: true });
track.addEventListener('touchend', endDrag);
track.addEventListener('touchmove', drag, { passive: true });

function startDrag(e) {
    dragging = true;
    isMoving = false;
    
    if (e.type === 'mousedown') {
        e.preventDefault(); 
    }
    
    startX = e.pageX || e.touches[0].pageX;
    prevTranslate = currentTranslate; 
    track.style.transition = 'none';
}

function drag(e) {
    if (!dragging) return;
    
    const currentX = e.pageX || e.touches[0].pageX;
    const diff = currentX - startX;
    
    if (Math.abs(diff) > 5) {
        isMoving = true;
    }

    currentTranslate = prevTranslate + diff; 
    track.style.transform = `translateX(${currentTranslate}px)`;
}

function endDrag(e) {
    if (!dragging) return;
    dragging = false;
    
    const slideWidth = getSlideWidth();
    
    // Calculamos la nueva posición de la pista
    // El índice que está más cerca de la posición central (transformIndex - 1).
    let targetIndex = Math.round(Math.abs(currentTranslate / slideWidth)) + 1;
    
    // Convertimos de índice de la pista (clones incluidos) a índice del proyecto (0 a N-1)
    let newIndex = targetIndex - visibleSlides;

    // Aseguramos que el índice no se salga de los límites (excepto -1 y originalSlidesCount para el bucle)
    if (newIndex < 0) newIndex = 0; 
    if (newIndex >= originalSlidesCount) newIndex = originalSlidesCount - 1;

    setSlide(newIndex);
}

// Bloqueo de navegación accidental
links.forEach(link => {
    link.addEventListener('click', (e) => {
        // Bloqueamos si hubo arrastre
        if (isMoving || index === -1 || index === originalSlidesCount) {
            e.preventDefault();
        }
    });
});

// Dots y Resize
dots.forEach((dot, i) => dot.addEventListener('click', () => setSlide(i)));
window.addEventListener('resize', () => setSlide(index));

// 💡 INICIALIZACIÓN CRÍTICA: setSlide(0, true) centra el primer proyecto de inmediato
setSlide(0, true);