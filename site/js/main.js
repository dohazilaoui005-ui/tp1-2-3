/* ═══════════════════════════════════════════════════════
   NEXACORE – Main JS
   ═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Nav scroll effect ──────────────────────────────── */
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Mobile nav toggle ──────────────────────────────── */
  const toggle = document.querySelector('.nav-toggle');
  const links  = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        toggle.classList.remove('open');
        links.classList.remove('open');
      });
    });
  }

  /* ── Active nav link ────────────────────────────────── */
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href').split('/').pop();
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ── Intersection Observer → fade-in on scroll ──────── */
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.animationPlayState = 'running';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => {
    el.style.animationPlayState = 'paused';
    el.classList.add('animate');
    obs.observe(el);
  });

  /* ── Smooth counter animation ───────────────────────── */
  function animateCount(el) {
    const target = parseInt(el.dataset.count);
    const duration = 1600;
    const start = performance.now();
    const update = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(ease * target) + (el.dataset.suffix || '');
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCount(e.target);
        counterObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => counterObs.observe(el));

  /* ── Form validation ────────────────────────────────── */
  document.querySelectorAll('form[data-validate]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;
      form.querySelectorAll('[required]').forEach(field => {
        const grp = field.closest('.form-group');
        if (!field.value.trim()) {
          valid = false;
          grp && grp.classList.add('error');
        } else {
          grp && grp.classList.remove('error');
        }
      });
      if (valid) {
        const btn = form.querySelector('[type=submit]');
        const orig = btn.textContent;
        btn.textContent = '✓ Message envoyé !';
        btn.style.background = '#22c55e';
        btn.style.color = '#fff';
        setTimeout(() => { btn.textContent = orig; btn.style = ''; form.reset(); }, 3000);
      }
    });
  });

  /* ── Accordion (details/summary) ───────────────────── */
  document.querySelectorAll('details').forEach(d => {
    d.addEventListener('toggle', () => {
      if (d.open) {
        document.querySelectorAll('details[open]').forEach(other => {
          if (other !== d) other.open = false;
        });
      }
    });
  });

  /* ── Gallery lightbox ───────────────────────────────── */
  const lb = document.getElementById('lightbox');
  if (lb) {
    document.querySelectorAll('.gallery-item img').forEach(img => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => {
        lb.querySelector('img').src = img.src;
        lb.querySelector('img').alt = img.alt;
        lb.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });
    lb.addEventListener('click', () => {
      lb.classList.remove('open');
      document.body.style.overflow = '';
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') { lb.classList.remove('open'); document.body.style.overflow = ''; }
    });
  }

});
