/* ==========================================
   JULITO PORTFOLIO — MAIN JAVASCRIPT v2.0
   ========================================== */

'use strict';

// Respect prefers-reduced-motion (ux-guidelines row 9)
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ===== LOADER =====
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (!loader) return;
  if (prefersReducedMotion) {
    loader.classList.add('hidden');
    return;
  }
  setTimeout(() => loader.classList.add('hidden'), 2000);
});

// ===== CUSTOM CURSOR =====
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursor-follower');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (cursor) {
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  }
});

function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  if (cursorFollower) {
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';
  }
  requestAnimationFrame(animateFollower);
}
animateFollower();

// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNavLink();
  toggleBackToTop();
});

function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.scrollY + 120;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${sectionId}"]`);

    if (link) {
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    }
  });
}

// ===== MOBILE MENU =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const mobileClose = document.getElementById('mobile-close');
const mobileLinks = document.querySelectorAll('.mobile-link');

function openMobileMenu() {
  mobileMenu.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}

hamburger?.addEventListener('click', openMobileMenu);
mobileClose?.addEventListener('click', closeMobileMenu);
mobileLinks.forEach(link => link.addEventListener('click', closeMobileMenu));

// Close mobile menu on outside click
document.addEventListener('click', (e) => {
  if (mobileMenu.classList.contains('open') &&
      !mobileMenu.contains(e.target) &&
      !hamburger.contains(e.target)) {
    closeMobileMenu();
  }
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ===== TYPED TEXT EFFECT =====
const roles = [
  'beautiful UIs',
  'full-stack apps',
  'scalable APIs',
  'great UX',
  'clean code',
  'web experiences',
];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedEl = document.getElementById('typed');

function typeEffect() {
  if (!typedEl) return;
  const currentRole = roles[roleIndex];

  if (isDeleting) {
    typedEl.textContent = currentRole.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typedEl.textContent = currentRole.substring(0, charIndex + 1);
    charIndex++;
  }

  let speed = isDeleting ? 60 : 100;

  if (!isDeleting && charIndex === currentRole.length) {
    speed = 1800;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    speed = 400;
  }

  setTimeout(typeEffect, speed);
}

setTimeout(() => { if (!prefersReducedMotion) typeEffect(); else if (typedEl) typedEl.textContent = roles[0]; }, 800);

// ===== PARTICLES CANVAS =====
const canvas = document.getElementById('particles-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
  });

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 2 + 0.5;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.5 ? '99,102,241' : '168,85,247';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > canvas.width ||
          this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
      ctx.fill();
    }
  }

  function initParticles() {
    const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
    particles = Array.from({ length: count }, () => new Particle());
  }

  function drawConnections() {
    const maxDist = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(99,102,241,${(1 - dist / maxDist) * 0.12})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animateParticles);
  }

  if (prefersReducedMotion) {
    initParticles();
    // skip animation loop when motion is reduced
  } else {
    initParticles();
    animateParticles();
  }
}

// ===== STATS COUNTER =====
function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  let current = 0;
  const duration = 1800;
  const step = target / (duration / 16);

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current);
  }, 16);
}

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);

      // Trigger counters
      entry.target.querySelectorAll('.stat-number[data-count]').forEach(animateCounter);

      // Trigger skill bars
      entry.target.querySelectorAll('.skill-fill[data-width]').forEach(fill => {
        setTimeout(() => {
          fill.style.width = fill.dataset.width + '%';
        }, 200);
      });
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Counters on hero (special case)
const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-number[data-count]').forEach(animateCounter);
      heroObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) heroObserver.observe(heroStats);

// ===== SKILLS TABS =====
const skillTabs = document.querySelectorAll('.skills-tab');
const skillPanels = document.querySelectorAll('.skills-panel');

skillTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const targetId = 'tab-' + tab.dataset.tab;

    skillTabs.forEach(t => t.classList.remove('active'));
    skillPanels.forEach(p => p.classList.remove('active'));

    tab.classList.add('active');
    const panel = document.getElementById(targetId);
    if (panel) {
      panel.classList.add('active');

      // Animate skill bars in newly visible panel
      panel.querySelectorAll('.skill-fill[data-width]').forEach(fill => {
        fill.style.width = '0';
        setTimeout(() => {
          fill.style.width = fill.dataset.width + '%';
        }, 100);
      });
    }
  });
});

// Trigger initial visible tab bars
document.querySelectorAll('.skills-panel.active .skill-fill[data-width]').forEach(fill => {
  setTimeout(() => {
    fill.style.width = fill.dataset.width + '%';
  }, 500);
});

// ===== PROJECT FILTERS =====
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card[data-category]');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    projectCards.forEach(card => {
      const category = card.dataset.category;
      if (filter === 'all' || category === filter) {
        card.classList.remove('hidden');
        card.style.animation = 'none';
        void card.offsetWidth;
        card.style.animation = 'fadeInUp 0.5s ease forwards';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ===== TESTIMONIALS SLIDER =====
const track = document.getElementById('testimonial-track');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const dotsContainer = document.getElementById('slider-dots');
const testimonialCards = document.querySelectorAll('.testimonial-card');

let currentSlide = 0;
let autoSlideInterval;

function createDots() {
  if (!dotsContainer) return;
  testimonialCards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });
}

function updateDots() {
  const dots = dotsContainer?.querySelectorAll('.slider-dot');
  dots?.forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });
}

function goToSlide(index) {
  currentSlide = index;
  if (track) {
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    track.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';
  }
  updateDots();
}

function nextSlide() {
  goToSlide((currentSlide + 1) % testimonialCards.length);
}

function prevSlide() {
  goToSlide((currentSlide - 1 + testimonialCards.length) % testimonialCards.length);
}

function startAutoSlide() {
  autoSlideInterval = setInterval(nextSlide, 5000);
}

function stopAutoSlide() {
  clearInterval(autoSlideInterval);
}

if (testimonialCards.length > 0) {
  createDots();
  prevBtn?.addEventListener('click', () => { stopAutoSlide(); prevSlide(); startAutoSlide(); });
  nextBtn?.addEventListener('click', () => { stopAutoSlide(); nextSlide(); startAutoSlide(); });
  startAutoSlide();

  // Pause on hover
  track?.parentElement?.addEventListener('mouseenter', stopAutoSlide);
  track?.parentElement?.addEventListener('mouseleave', startAutoSlide);

  // Swipe support
  let touchStartX = 0;
  track?.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  track?.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      stopAutoSlide();
      diff > 0 ? nextSlide() : prevSlide();
      startAutoSlide();
    }
  });
}

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const btnText = document.getElementById('btn-text');
const btnIcon = document.getElementById('btn-icon');
const formSuccess = document.getElementById('form-success');

function validateField(id, errorId, validationFn, message) {
  const field = document.getElementById(id);
  const error = document.getElementById(errorId);
  if (!field || !error) return true;

  if (!validationFn(field.value.trim())) {
    field.classList.add('invalid');
    error.textContent = message;
    error.classList.add('visible');
    return false;
  } else {
    field.classList.remove('invalid');
    error.classList.remove('visible');
    return true;
  }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

contactForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const validName    = validateField('name',    'name-error',    v => v.length >= 2, 'Please enter your full name.');
  const validEmail   = validateField('email',   'email-error',   v => isValidEmail(v), 'Please enter a valid email.');
  const validSubject = validateField('subject', 'subject-error', v => v.length >= 3, 'Please enter a subject.');
  const validMessage = validateField('message', 'message-error', v => v.length >= 10, 'Message must be at least 10 characters.');

  if (!validName || !validEmail || !validSubject || !validMessage) return;

  // Simulate submission
  submitBtn.disabled = true;
  if (btnText) btnText.textContent = 'Sending...';
  if (btnIcon) btnIcon.className = 'fas fa-spinner fa-spin';

  await new Promise(r => setTimeout(r, 1800));

  submitBtn.disabled = false;
  if (btnText) btnText.textContent = 'Send Message';
  if (btnIcon) btnIcon.className = 'fas fa-paper-plane';
  contactForm.reset();
  formSuccess?.classList.add('visible');

  setTimeout(() => {
    formSuccess?.classList.remove('visible');
  }, 5000);
});

// Real-time validation clear
['name', 'email', 'subject', 'message'].forEach(id => {
  const field = document.getElementById(id);
  const error = document.getElementById(id + '-error');
  field?.addEventListener('input', () => {
    if (field.classList.contains('invalid') && field.value.trim()) {
      field.classList.remove('invalid');
      error?.classList.remove('visible');
    }
  });
});

// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

let currentTheme = localStorage.getItem('portfolio-theme') || 'dark';
document.documentElement.setAttribute('data-theme', currentTheme);
updateThemeIcon();

themeToggle?.addEventListener('click', () => {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  localStorage.setItem('portfolio-theme', currentTheme);
  updateThemeIcon();
});

function updateThemeIcon() {
  if (!themeIcon) return;
  if (currentTheme === 'dark') {
    themeIcon.className = 'fas fa-moon';
  } else {
    themeIcon.className = 'fas fa-sun';
  }
}

// ===== BACK TO TOP =====
const backToTop = document.getElementById('back-to-top');

function toggleBackToTop() {
  if (window.scrollY > 400) {
    backToTop?.classList.add('visible');
  } else {
    backToTop?.classList.remove('visible');
  }
}

backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== YEAR =====
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
