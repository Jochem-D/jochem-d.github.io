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