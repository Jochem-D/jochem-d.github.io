// This script powers: active link highlighting, mobile menu, year, Konami egg.

const links = Array.from(document.querySelectorAll('.nav__link'));
const sections = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
const nav = document.querySelector('.nav');
const navLinks = document.getElementById('nav-links');
const navToggle = document.getElementById('nav-toggle');


// Active link via IntersectionObserver
const observer = new IntersectionObserver((entries) => {
entries.forEach(entry => {
if(entry.isIntersecting){
const id = '#' + entry.target.id;
links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === id));
}
});
}, { rootMargin: '-50% 0px -50% 0px', threshold: [0, 0.25, 0.5, 0.75, 1]});


sections.forEach(sec => observer.observe(sec));


// Mobile menu toggle
navToggle?.addEventListener('click', () => {
const isOpen = navLinks.classList.toggle('open');
navToggle.setAttribute('aria-expanded', String(isOpen));
});


// Close mobile menu when clicking a link
links.forEach(a => a.addEventListener('click', () => {
if(navLinks.classList.contains('open')){
navLinks.classList.remove('open');
navToggle.setAttribute('aria-expanded', 'false');
}
}));


// Current year
document.getElementById('year').textContent = new Date().getFullYear();


// Konami code easter egg (↑ ↑ ↓ ↓ ← → ← → B A)
(() => {
const seq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let i = 0;
window.addEventListener('keydown', (e) => {
if (e.key === seq[i]) {
i++;
if (i === seq.length) {
i = 0;
document.body.classList.toggle('egg');
}
} else {
i = 0;
}
});
})();

// --- Listening: horizontal playlist shelf controls ---
(() => {
  const row = document.getElementById('playlistRow');
  if (!row) return;

  const buttons = document.querySelectorAll('.scroll-btn');

  function cardStep() {
    const card = row.querySelector('.playlist-card');
    return card ? card.getBoundingClientRect().width + 14 /* gap */ : 360;
  }

  // Button click: scroll by one card
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const step = cardStep();
      row.scrollBy({ left: btn.dataset.dir === 'left' ? -step : step, behavior: 'smooth' });
    });
  });

  // Arrow keys when row is focused
  row.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      const dir = e.key === 'ArrowLeft' ? -1 : 1;
      row.scrollBy({ left: dir * cardStep(), behavior: 'smooth' });
    }
  });

  // Make vertical wheel map to horizontal when hovering the row
  row.addEventListener('wheel', (e) => {
    const atRow = e.currentTarget.matches(':hover');
    if (!atRow) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      row.scrollBy({ left: e.deltaY, behavior: 'auto' });
    }
  }, { passive: false });

  // Drag-to-scroll (nice on desktop)
  let isDown = false, startX = 0, startScroll = 0;
  row.addEventListener('pointerdown', (e) => {
    isDown = true;
    startX = e.clientX;
    startScroll = row.scrollLeft;
    row.setPointerCapture(e.pointerId);
  });
  row.addEventListener('pointermove', (e) => {
    if (!isDown) return;
    const dx = e.clientX - startX;
    row.scrollLeft = startScroll - dx;
  });
  row.addEventListener('pointerup', () => { isDown = false; });
  row.addEventListener('pointercancel', () => { isDown = false; });
})();
