/* =========================================================
   NEUMÁTICOS PEPIRI — main.js
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Mobile nav toggle ---------- */
  const nav = document.getElementById('mainNav');
  const toggle = document.getElementById('menuToggle');
  const menuIcon = document.getElementById('menuIcon');

  if (nav && toggle && menuIcon) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
      menuIcon.setAttribute('href', open ? '#i-close' : '#i-menu');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', false);
      menuIcon.setAttribute('href', '#i-menu');
      document.body.style.overflow = '';
    }));
  }

  /* ---------- Reveal on scroll ---------- */
  const groups = new Map();
  document.querySelectorAll('.reveal').forEach(el => {
    const parent = el.parentElement;
    if (!groups.has(parent)) groups.set(parent, []);
    groups.get(parent).push(el);
  });
  groups.forEach(list => {
    list.forEach((el, i) => {
      el.style.transitionDelay = reduceMotion ? '0ms' : `${Math.min(i * 90, 360)}ms`;
    });
  });

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
  }

  /* ---------- Scroll gauge & Header & Back-to-top ---------- */
  const gaugeFill = document.getElementById('gaugeFill');
  const gaugeReadout = document.getElementById('gaugeReadout');
  const toTop = document.getElementById('toTop');
  const toTopRing = document.getElementById('toTopRing');
  const header = document.getElementById('siteHeader');
  const RING_CIRC = 138; // 2 * PI * r(22)

  let ticking = false;
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const doc = document.documentElement;
        const scrollTop = doc.scrollTop || document.body.scrollTop;
        const scrollHeight = doc.scrollHeight - doc.clientHeight;
        const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) : 0;
        const pct = Math.round(progress * 100);

        if (gaugeFill) gaugeFill.style.width = `${pct}%`;
        if (gaugeReadout) {
          gaugeReadout.textContent = `${pct}%`;
          if (scrollTop > 100) gaugeReadout.classList.add('show');
          else gaugeReadout.classList.remove('show');
        }

        if (header) {
          if (scrollTop > 50) header.classList.add('scrolled');
          else header.classList.remove('scrolled');
        }

        if (toTop) {
          if (scrollTop > 300) toTop.classList.add('show');
          else toTop.classList.remove('show');
        }

        if (toTopRing) {
          const offset = RING_CIRC - (progress * RING_CIRC);
          toTopRing.style.strokeDashoffset = offset;
        }

        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Cursor Spotlight ---------- */
  if (!reduceMotion) {
    window.addEventListener('mousemove', (e) => {
      const x = `${(e.clientX / window.innerWidth) * 100}%`;
      const y = `${(e.clientY / window.innerHeight) * 100}%`;
      document.documentElement.style.setProperty('--mx', x);
      document.documentElement.style.setProperty('--my', y);
    });
  }
});
