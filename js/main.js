/* =========================================================
   NEUMÁTICOS PEPIRI — main.js
   Interacciones: nav móvil, reveals, gauge de scroll,
   header dinámico, botones magnéticos, spotlight, back-to-top
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

  /* ---------- Reveal on scroll (staggered) ---------- */
  // Compute a stagger index per visual group so siblings cascade in.
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

  /* ---------- Scroll gauge ("odómetro" de la página) ---------- */
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
        const scrollH = doc.scrollHeight - doc.clientHeight;
        const pct = scrollH > 0 ? Math.min(100, Math.max(0, (scrollTop / scrollH) * 100)) : 0;

        if (gaugeFill) gaugeFill.style.width = pct + '%';
        if (gaugeReadout) {
          gaugeReadout.textContent = Math.round(pct) + '%';
          gaugeReadout.classList.toggle('show', scrollTop > 80);
        }
        if (header) header.classList.toggle('scrolled', scrollTop > 40);
        if (toTop) {
          const visible = scrollTop > 480;
          toTop.classList.toggle('show', visible);
        }
        if (toTopRing) {
          const offset = RING_CIRC - (pct / 100) * RING_CIRC;
          toTopRing.style.strokeDashoffset = offset;
        }
        ticking = false;
      });
      ticking = true;
    }
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------- Magnetic buttons ---------- */
  if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.magnetic').forEach(btn => {
      let rect;
      btn.addEventListener('mouseenter', () => { rect = btn.getBoundingClientRect(); });
      btn.addEventListener('mousemove', (e) => {
        if (!rect) rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.18}px, ${y * 0.32}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0,0)';
      });
    });
  }

  /* ---------- Cursor spotlight on dark sections ---------- */
  if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
    const spotlightEls = document.querySelectorAll('.hero, .contact-card, footer.site');
    spotlightEls.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        el.style.setProperty('--mx', x + '%');
        el.style.setProperty('--my', y + '%');
      });
    });
  }

  /* ---------- Image placeholder shimmer stagger ---------- */
  document.querySelectorAll('.ph').forEach((el, i) => {
    el.style.animationDelay = (i % 6) * 0.35 + 's';
  });

});
