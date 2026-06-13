/* ============================================
   LOADING SCREEN
============================================ */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => loader.classList.add('hidden'), 600);
});

/* ============================================
   THEME TOGGLE (Dark/Light + Local Storage)
============================================ */
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('i');
const root = document.documentElement;

function applyTheme(theme) {
  if (theme === 'light') {
    root.setAttribute('data-theme', 'light');
    themeIcon.className = 'fa-solid fa-moon';
  } else {
    root.removeAttribute('data-theme');
    themeIcon.className = 'fa-solid fa-sun';
  }
}

const savedTheme = localStorage.getItem('theme') || 'dark';
applyTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  const next = current === 'light' ? 'dark' : 'light';
  applyTheme(next);
  localStorage.setItem('theme', next);
});

/* ============================================
   NAVBAR: sticky + active link highlighting
============================================ */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id], header[id]');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);

  // back to top visibility
  document.getElementById('backToTop').classList.toggle('show', window.scrollY > 400);

  // active section highlight
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) current = section.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
});

/* ============================================
   MOBILE MENU
============================================ */
const hamburger = document.getElementById('hamburger');
const navLinksList = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinksList.classList.toggle('active');
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinksList.classList.remove('active');
  });
});

/* ============================================
   TYPING EFFECT
============================================ */
const typedTextEl = document.getElementById('typed-text');
const phrases = [
  'Full Stack Developer',
  'UI/UX Enthusiast',
  'Problem Solver',
  'Open Source Contributor'
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
  const currentPhrase = phrases[phraseIndex];

  if (isDeleting) {
    charIndex--;
  } else {
    charIndex++;
  }

  typedTextEl.textContent = currentPhrase.substring(0, charIndex);

  let speed = isDeleting ? 50 : 100;

  if (!isDeleting && charIndex === currentPhrase.length) {
    speed = 1800; // pause at full phrase
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    speed = 400;
  }

  setTimeout(typeEffect, speed);
}
typeEffect();

/* ============================================
   SCROLL REVEAL ANIMATION
============================================ */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => revealObserver.observe(el));

/* ============================================
   ANIMATED COUNTERS
============================================ */
const counters = document.querySelectorAll('.counter');

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counter = entry.target;
      const target = +counter.getAttribute('data-target');
      let current = 0;
      const increment = target / 60;

      const updateCounter = () => {
        current += increment;
        if (current < target) {
          counter.textContent = Math.ceil(current);
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      };
      updateCounter();
      counterObserver.unobserve(counter);
    }
  });
}, { threshold: 0.5 });

counters.forEach(counter => counterObserver.observe(counter));

/* ============================================
   ANIMATED PROGRESS BARS
============================================ */
const progressFills = document.querySelectorAll('.progress-fill');

const progressObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target;
      const width = fill.getAttribute('data-width');
      fill.style.width = width + '%';
      progressObserver.unobserve(fill);
    }
  });
}, { threshold: 0.3 });

progressFills.forEach(fill => progressObserver.observe(fill));

/* ============================================
   SKILLS FILTER (progress bars + tech cards)
============================================ */
const skillFilterBtns = document.querySelectorAll('.skills-filter .filter-btn');
const progressItems = document.querySelectorAll('.progress-item');
const techCards = document.querySelectorAll('.tech-card');

skillFilterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    skillFilterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.getAttribute('data-filter');

    progressItems.forEach(item => {
      const match = filter === 'all' || item.getAttribute('data-category') === filter;
      item.classList.toggle('hidden', !match);
    });
    techCards.forEach(card => {
      const match = filter === 'all' || card.getAttribute('data-category') === filter;
      card.classList.toggle('hidden', !match);
    });
  });
});

/* ============================================
   PROJECTS FILTER + SEARCH
============================================ */
const projectFilterBtns = document.querySelectorAll('.projects-filter .filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const projectSearch = document.getElementById('projectSearch');
const noResults = document.getElementById('noResults');
let activeProjectFilter = 'all';

function applyProjectFilters() {
  const searchTerm = projectSearch.value.trim().toLowerCase();
  let visibleCount = 0;

  projectCards.forEach(card => {
    const matchesFilter = activeProjectFilter === 'all' || card.getAttribute('data-category') === activeProjectFilter;
    const matchesSearch = card.getAttribute('data-title').includes(searchTerm);
    const show = matchesFilter && matchesSearch;
    card.classList.toggle('hidden', !show);
    if (show) visibleCount++;
  });

  noResults.hidden = visibleCount !== 0;
}

projectFilterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    projectFilterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeProjectFilter = btn.getAttribute('data-pfilter');
    applyProjectFilters();
  });
});

projectSearch.addEventListener('input', applyProjectFilters);

/* ============================================
   CONTACT FORM VALIDATION
============================================ */
const contactForm = document.getElementById('contactForm');

function showError(id, message) {
  const errorEl = document.getElementById(id + 'Error');
  const inputEl = document.getElementById(id);
  errorEl.textContent = message;
  inputEl.classList.toggle('invalid', !!message);
}

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name) { showError('name', 'Please enter your name.'); valid = false; }
  else showError('name', '');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) { showError('email', 'Please enter your email.'); valid = false; }
  else if (!emailRegex.test(email)) { showError('email', 'Please enter a valid email.'); valid = false; }
  else showError('email', '');

  if (!subject) { showError('subject', 'Please enter a subject.'); valid = false; }
  else showError('subject', '');

  if (!message) { showError('message', 'Please enter a message.'); valid = false; }
  else if (message.length < 10) { showError('message', 'Message must be at least 10 characters.'); valid = false; }
  else showError('message', '');

  if (valid) {
    showToast('Message sent successfully! I\'ll get back to you soon.', 'success');
    contactForm.reset();
  } else {
    showToast('Please fix the errors in the form.', 'error');
  }
});

/* ============================================
   TOAST NOTIFICATIONS
============================================ */
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation';
  toast.innerHTML = `<i class="fa-solid ${icon}"></i><span>${message}</span>`;
  toast.className = `toast show ${type}`;

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

/* ============================================
   BACK TO TOP
============================================ */
document.getElementById('backToTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ============================================
   FOOTER YEAR
============================================ */
document.getElementById('year').textContent = new Date().getFullYear();

/* ============================================
   AUTH STATE (reflect login on navbar)
============================================ */
(function reflectAuthState() {
  const authBtn = document.getElementById('authBtn');
  const session = JSON.parse(localStorage.getItem('session') || 'null');
  if (session) {
    authBtn.textContent = 'Dashboard';
    authBtn.href = 'dashboard.html';
  } else {
    authBtn.textContent = 'Login';
    authBtn.href = 'login.html';
  }
})();
