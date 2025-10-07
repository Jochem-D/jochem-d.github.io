// This script powers: active link highlighting, mobile menu, year, Konami egg,
// playlist shelf controls, hero image lightbox, and preloader.

// ------- Nav: active link via IntersectionObserver -------
const links = Array.from(document.querySelectorAll('.nav__link'));
const sections = links
  .map(a => document.querySelector(a.getAttribute('href')))
  .filter(Boolean);

const navLinks = document.getElementById('nav-links');
const navToggle = document.getElementById('nav-toggle');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = '#' + entry.target.id;
        links.forEach((a) =>
          a.classList.toggle('active', a.getAttribute('href') === id)
        );
      }
    });
  },
  { rootMargin: '-50% 0px -50% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
);

sections.forEach((sec) => observer.observe(sec));

// ------- Mobile menu toggle -------
navToggle?.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

// Close mobile menu when clicking a link
links.forEach((a) =>
  a.addEventListener('click', () => {
    if (navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  })
);

// ------- Current year -------
document.getElementById('year').textContent = new Date().getFullYear();

// ------- Konami code easter egg (↑ ↑ ↓ ↓ ← → ← → B A) -------
(() => {
  const seq = [
    'ArrowUp',
    'ArrowUp',
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowLeft',
    'ArrowRight',
    'b',
    'a',
  ];
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

// ------- Listening: horizontal playlist shelf controls -------
(() => {
  const row = document.getElementById('playlistRow');
  if (!row) return;

  const buttons = document.querySelectorAll('.scroll-btn');

  function cardStep() {
    const card = row.querySelector('.playlist-card');
    return card ? card.getBoundingClientRect().width + 14 /* gap */ : 360;
    }

  // Button click: scroll by one card
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const step = cardStep();
      row.scrollBy({
        left: btn.dataset.dir === 'left' ? -step : step,
        behavior: 'smooth',
      });
    });
  });

  // Arrow keys when the row is focused
  row.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      const dir = e.key === 'ArrowLeft' ? -1 : 1;
      row.scrollBy({ left: dir * cardStep(), behavior: 'smooth' });
    }
  });

  // Vertical wheel -> horizontal scroll when hovering the row
  row.addEventListener(
    'wheel',
    (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        row.scrollBy({ left: e.deltaY, behavior: 'auto' });
      }
    },
    { passive: false }
  );

  // Drag-to-scroll
  let isDown = false,
    startX = 0,
    startScroll = 0;
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
  row.addEventListener('pointerup', () => {
    isDown = false;
  });
  row.addEventListener('pointercancel', () => {
    isDown = false;
  });
})();

// ------- Lightbox for hero images (delegated & robust) -------
(() => {
  const heroImages = document.querySelector('.hero__images');
  const lb = document.getElementById('lightbox');
  if (!heroImages || !lb) return;

  const img = lb.querySelector('.lightbox__img');
  const closeBtn = lb.querySelector('.lightbox__close');

  // ensure .pop items are focusable/accessible
  heroImages.querySelectorAll('.pop').forEach(p => {
    if (!p.hasAttribute('tabindex')) p.setAttribute('tabindex', '0');
    if (!p.hasAttribute('role')) p.setAttribute('role', 'button');
    if (!p.getAttribute('aria-label')) {
      const t = p.querySelector('img')?.alt || 'Open image';
      p.setAttribute('aria-label', t);
    }
  });

  function open(src, alt) {
    if (!src) return;
    img.src = src;
    img.alt = alt || '';
    lb.classList.add('open');
    document.body.classList.add('noscroll');
    // focus close button for accessibility
    closeBtn?.focus?.({ preventScroll: true });
  }

  function close() {
    lb.classList.remove('open');
    document.body.classList.remove('noscroll');
    img.removeAttribute('src'); // free memory on mobile
  }

  // Click/tap anywhere on a .pop (event delegation)
  heroImages.addEventListener('click', (e) => {
    const card = e.target.closest('.pop');
    if (!card || !heroImages.contains(card)) return;
    const thumb = card.querySelector('img');
    const full = card.getAttribute('data-full') || thumb?.src;
    open(full, thumb?.alt);
  });

  // Keyboard: Enter/Space on focused .pop
  heroImages.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const card = e.target.closest('.pop');
    if (!card) return;
    e.preventDefault();
    const thumb = card.querySelector('img');
    const full = card.getAttribute('data-full') || thumb?.src;
    open(full, thumb?.alt);
  });

  // Close interactions
  closeBtn.addEventListener('click', close);
  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && lb.classList.contains('open')) close(); });
})();

// ------- Preloader: hide once page is ready -------
(() => {
  const pre = document.getElementById('preloader');
  if (!pre) return;

  const MIN = 400; // ms minimum display so it feels intentional
  const start = performance.now();

  const done = () => {
    const delta = performance.now() - start;
    const wait = Math.max(0, MIN - delta);
    setTimeout(() => pre.classList.add('hidden'), wait);
  };

  if (document.readyState === 'complete') {
    done();
  } else {
    window.addEventListener('load', done);
  }
})();

(() => {
  const carousel = document.querySelector('.hero__images');
  if (!carousel) return;

  let index = 0;
  const slides = carousel.querySelectorAll('.pop');
  if (slides.length <= 1) return;

  const scrollCarousel = () => {
    index = (index + 1) % slides.length;
    // smooth horizontal scroll INSIDE the element
    carousel.scrollTo({
      left: slides[index].offsetLeft,
      behavior: 'smooth'
    });
  };

  let timer;

  const startAutoScroll = () => {
    stopAutoScroll();
    timer = setInterval(scrollCarousel, 4000); // every 4s
  };

  const stopAutoScroll = () => {
    if (timer) clearInterval(timer);
  };

  // Start on load (mobile only)
  const mq = window.matchMedia('(max-width: 880px)');
  const checkAndStart = () => {
    if (mq.matches) startAutoScroll();
    else stopAutoScroll();
  };

  checkAndStart();
  mq.addEventListener ? mq.addEventListener('change', checkAndStart)
                      : mq.addListener(checkAndStart); // fallback

  // stop when user interacts (so it doesn’t fight you)
  carousel.addEventListener('touchstart', stopAutoScroll, { passive: true });
  carousel.addEventListener('pointerdown', stopAutoScroll);
})();
