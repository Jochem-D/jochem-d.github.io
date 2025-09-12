const slidesWrapper = document.querySelector('.slides-wrapper');
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');

let currentSlide = 0;
const totalSlides = slides.length;

function goToSlide(index) {
  currentSlide = (index + totalSlides) % totalSlides;
  slidesWrapper.style.transform = `translateY(-${100 * currentSlide}%)`;
  updateDots();
}

function updateDots() {
  dots.forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));
}

// Dots click
dots.forEach((dot, i) => dot.addEventListener('click', () => goToSlide(i)));

// Arrow keys
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowDown') goToSlide(currentSlide + 1);
  if (e.key === 'ArrowUp') goToSlide(currentSlide - 1);
});

// Mouse wheel
let scrollTimeout;
slidesWrapper.addEventListener('wheel', e => {
  e.preventDefault();
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    if (e.deltaY > 0) goToSlide(currentSlide + 1);
    else goToSlide(currentSlide - 1);
  }, 50);
}, { passive: false });

// Touch swipe
let startY = 0;
slidesWrapper.addEventListener('touchstart', e => startY = e.touches[0].clientY);
slidesWrapper.addEventListener('touchend', e => {
  const endY = e.changedTouches[0].clientY;
  if (endY - startY > 50) goToSlide(currentSlide - 1);
  else if (startY - endY > 50) goToSlide(currentSlide + 1);
});
