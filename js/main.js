/* =============================================
   AMPIXEL MEDIA — MAIN JAVASCRIPT
   Premium interactions, animations & effects
   ============================================= */

(function () {
  'use strict';

  /* =========================================
     1. LOADING SCREEN
     ========================================= */
  const loader = document.getElementById('loader');

  window.addEventListener('load', () => {
    setTimeout(() => {
      if (loader) loader.classList.add('done');
      // trigger reveals after load
      triggerRevealOnLoad();
    }, 2200);
  });

  /* =========================================
     2. CUSTOM CURSOR
     ========================================= */
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;
  let animFrame;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (dot) {
      dot.style.left = mouseX + 'px';
      dot.style.top  = mouseY + 'px';
    }
  });

  function animateCursorRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;

    if (ring) {
      ring.style.left = ringX + 'px';
      ring.style.top  = ringY + 'px';
    }
    animFrame = requestAnimationFrame(animateCursorRing);
  }
  animateCursorRing();

  // Hover effect on interactive elements
  const hoverables = document.querySelectorAll(
    'a, button, .service-card, .testimonial-card, .portfolio-card, .faq-item, .why-card, .team-card'
  );

  hoverables.forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (ring) ring.classList.add('hovered');
      if (dot)  dot.style.transform = 'translate(-50%, -50%) scale(2)';
    });
    el.addEventListener('mouseleave', () => {
      if (ring) ring.classList.remove('hovered');
      if (dot)  dot.style.transform = 'translate(-50%, -50%) scale(1)';
    });
  });

  /* =========================================
     3. SCROLL PROGRESS BAR
     ========================================= */
  const progressBar = document.getElementById('scrollProgress');

  window.addEventListener('scroll', () => {
    const scrollTop    = window.scrollY;
    const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled     = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = scrolled + '%';
  }, { passive: true });

  /* =========================================
     4. BACK TO TOP BUTTON
     ========================================= */
  const backToTopBtn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    if (backToTopBtn) {
      if (window.scrollY > 500) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  }, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* =========================================
     5. NAVBAR — SCROLL BEHAVIOUR
     ========================================= */
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    if (navbar) {
      if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  }, { passive: true });

  /* =========================================
     6. HAMBURGER MENU
     ========================================= */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('open');
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
      });
    });
  }

  /* =========================================
     7. SMOOTH SCROLL FOR NAV LINKS
     ========================================= */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80; // navbar height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* =========================================
     8. MOUSE GLOW ON HERO
     ========================================= */
  const mouseGlow = document.getElementById('mouseGlow');
  const hero      = document.querySelector('.hero');

  if (mouseGlow && hero) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      mouseGlow.style.left = (e.clientX - rect.left) + 'px';
      mouseGlow.style.top  = (e.clientY - rect.top)  + 'px';
    });
  }

  /* =========================================
     9. PARTICLE CANVAS
     ========================================= */
  const canvas = document.getElementById('particleCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let W, H;

    function resizeCanvas() {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    class Particle {
      constructor() { this.reset(); }

      reset() {
        this.x    = Math.random() * W;
        this.y    = Math.random() * H;
        this.size = Math.random() * 1.8 + 0.3;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.color = Math.random() > 0.5
          ? `rgba(99, 102, 241, ${this.opacity})`
          : `rgba(0, 212, 255, ${this.opacity})`;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) {
          this.reset();
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    // Create particles
    const PARTICLE_COUNT = Math.min(120, Math.floor((W * H) / 10000));
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }

    // Draw connecting lines between nearby particles
    function drawLines() {
      const maxDist = 120;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx   = particles[i].x - particles[j].x;
          const dy   = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.12;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => { p.update(); p.draw(); });
      drawLines();
      requestAnimationFrame(animateParticles);
    }

    animateParticles();
  }

  /* =========================================
     10. SCROLL REVEAL
     ========================================= */
  function setupReveal() {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger within grid containers
          const parent = entry.target.parentElement;
          const siblings = parent ? Array.from(parent.querySelectorAll('.reveal')) : [];
          const index = siblings.indexOf(entry.target);
          const delay = (index % 4) * 0.12;

          entry.target.style.transitionDelay = delay + 's';
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -60px 0px'
    });

    reveals.forEach(el => observer.observe(el));
  }

  function triggerRevealOnLoad() {
    // Immediately reveal hero elements
    document.querySelectorAll('.hero .reveal').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 150);
    });
    setupReveal();
  }

  // Fallback if load already fired
  if (document.readyState === 'complete') {
    setTimeout(triggerRevealOnLoad, 2200);
  }

  /* =========================================
     11. ANIMATED COUNTERS
     ========================================= */
  function animateCounter(el) {
    const target  = parseInt(el.dataset.count);
    const suffix  = el.dataset.suffix || '';
    const prefix  = el.dataset.prefix || '';
    const duration = 2200;
    const start   = performance.now();

    function easeOut(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function update(timestamp) {
      const elapsed  = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      const current  = Math.floor(easeOut(progress) * target);

      el.textContent = prefix + current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = prefix + target.toLocaleString() + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  // Observe counter elements
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = 'true';
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => {
    counterObserver.observe(el);
  });

  /* =========================================
     12. FAQ ACCORDION
     ========================================= */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');

    function toggle() {
      const isOpen = item.classList.contains('open');

      // Close all others
      faqItems.forEach(other => {
        if (other !== item) other.classList.remove('open');
      });

      item.classList.toggle('open', !isOpen);
    }

    question.addEventListener('click', toggle);

    // Keyboard accessibility
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  });

  /* =========================================
     13. SERVICE CARD — TILT EFFECT
     ========================================= */
  const serviceCards = document.querySelectorAll('.service-card');

  serviceCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const centerX = rect.left + rect.width  / 2;
      const centerY = rect.top  + rect.height / 2;
      const rotateX = (e.clientY - centerY) / rect.height * -8;
      const rotateY = (e.clientX - centerX) / rect.width  *  8;

      card.style.transform = `translateY(-6px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* =========================================
     14. PARALLAX — HERO BLOBS ON SCROLL
     ========================================= */
  const blob1 = document.querySelector('.hero-blob-1');
  const blob2 = document.querySelector('.hero-blob-2');
  const blob3 = document.querySelector('.hero-blob-3');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (blob1) blob1.style.transform = `translate(${scrollY * 0.08}px, ${scrollY * 0.12}px) scale(1)`;
    if (blob2) blob2.style.transform = `translate(${-scrollY * 0.06}px, ${-scrollY * 0.08}px) scale(1)`;
    if (blob3) blob3.style.transform = `translate(-50%, calc(-50% + ${scrollY * 0.05}px)) scale(1)`;
  }, { passive: true });

  /* =========================================
     15. SECTION HEADER — PARALLAX TEXT
     ========================================= */
  const sectionTitles = document.querySelectorAll('.section-title');

  if (window.innerWidth > 768) {
    const titleObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
        }
      });
    }, { threshold: 0.2 });

    sectionTitles.forEach(title => titleObserver.observe(title));
  }

  /* =========================================
     16. NAVBAR — ACTIVE LINK ON SCROLL
     ========================================= */
  const sections   = document.querySelectorAll('section[id]');
  const navLinks   = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.style.color = '';
      if (link.getAttribute('href') === '#' + current) {
        link.style.color = 'white';
      }
    });
  }, { passive: true });

  /* =========================================
     17. NEWSLETTER FORM
     ========================================= */
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input  = newsletterForm.querySelector('input');
      const btn    = newsletterForm.querySelector('button');
      const email  = input.value.trim();

      if (email) {
        btn.textContent = '✓';
        btn.style.background = 'linear-gradient(135deg, #10B981, #06B6D4)';
        input.value = '';
        input.placeholder = 'You\'re subscribed!';

        setTimeout(() => {
          btn.textContent = '→';
          btn.style.background = '';
          input.placeholder = 'your@email.com';
        }, 3000);
      }
    });
  }

  /* =========================================
     18. GLOW BORDER ON GRADIENT CARDS (hover)
     ========================================= */
  document.querySelectorAll('.result-card, .why-card, .team-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = ((e.clientX - rect.left) / rect.width)  * 100;
      const y      = ((e.clientY - rect.top)  / rect.height) * 100;
      card.style.setProperty('--glow-x', x + '%');
      card.style.setProperty('--glow-y', y + '%');
    });
  });

  /* =========================================
     19. TESTIMONIAL AUTO-SCROLL PAUSE
     ========================================= */
  const testimonialsTrack = document.getElementById('testimonialsTrack');
  if (testimonialsTrack) {
    testimonialsTrack.addEventListener('mouseenter', () => {
      testimonialsTrack.style.animationPlayState = 'paused';
    });
    testimonialsTrack.addEventListener('mouseleave', () => {
      testimonialsTrack.style.animationPlayState = 'running';
    });

    // Touch support
    testimonialsTrack.addEventListener('touchstart', () => {
      testimonialsTrack.style.animationPlayState = 'paused';
    }, { passive: true });
    testimonialsTrack.addEventListener('touchend', () => {
      setTimeout(() => {
        testimonialsTrack.style.animationPlayState = 'running';
      }, 1500);
    }, { passive: true });
  }

  /* =========================================
     20. PORTFOLIO CARD — MAGNETIC CTA BUTTON
     ========================================= */
  document.querySelectorAll('.portfolio-btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect    = btn.getBoundingClientRect();
      const centerX = rect.left + rect.width  / 2;
      const centerY = rect.top  + rect.height / 2;
      const deltaX  = (e.clientX - centerX) * 0.3;
      const deltaY  = (e.clientY - centerY) * 0.3;
      btn.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  /* =========================================
     21. CTA SECTION — GLOW ON MOUSE
     ========================================= */
  const ctaSection = document.querySelector('.final-cta');
  if (ctaSection) {
    ctaSection.addEventListener('mousemove', (e) => {
      const rect = ctaSection.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width)  * 100;
      const y = ((e.clientY - rect.top)  / rect.height) * 100;
      ctaSection.style.setProperty('--mouse-x', x + '%');
      ctaSection.style.setProperty('--mouse-y', y + '%');
    });
  }

  /* =========================================
     22. PROCESS STEPS — HIGHLIGHT ON SCROLL
     ========================================= */
  const processSteps = document.querySelectorAll('.process-step');
  if (processSteps.length) {
    const stepObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          entry.target.querySelector('.step-number').style.boxShadow
            = '0 0 50px rgba(99, 102, 241, 0.8)';
        } else {
          const numEl = entry.target.querySelector('.step-number');
          if (numEl) numEl.style.boxShadow = '0 0 30px rgba(99, 102, 241, 0.4)';
        }
      });
    }, { threshold: 0.8 });

    processSteps.forEach(step => stepObserver.observe(step));
  }

  /* =========================================
     23. PAGE-LEVEL ANIMATED GRADIENT BORDER
         on primary CTA buttons
     ========================================= */
  document.querySelectorAll('.btn-primary-glow').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect  = btn.getBoundingClientRect();
      const x     = e.clientX - rect.left;
      const y     = e.clientY - rect.top;
      btn.style.setProperty('--btn-x', x + 'px');
      btn.style.setProperty('--btn-y', y + 'px');
    });
  });

  /* =========================================
     24. DYNAMIC YEAR IN FOOTER
     ========================================= */
  const yearEl = document.querySelector('.footer-bottom p');
  if (yearEl) {
    yearEl.innerHTML = yearEl.innerHTML.replace(
      '2025',
      new Date().getFullYear()
    );
  }

  /* =========================================
     25. INTERSECTION OBSERVER — SECTION FADE
     ========================================= */
  // Enhanced reveal for section headers
  const sectionHeaders = document.querySelectorAll('.section-header');
  const headerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.3 });

  sectionHeaders.forEach(header => {
    headerObserver.observe(header);
  });

  console.log(
    '%c⚡ Ampixel Media\n%cBuilt with passion. Powered by ambition.',
    'color: #6366F1; font-size: 18px; font-weight: 800; font-family: Space Grotesk, sans-serif;',
    'color: #06B6D4; font-size: 12px;'
  );

})();
