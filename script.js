/* ============================================
   Rule of Law — Main JavaScript
   No frameworks, vanilla JS only
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ------- Page Loader -------
  const loader = document.querySelector('.page-loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('hidden'), 400);
    });
    // Fallback: hide after 2s even if load event already fired
    setTimeout(() => loader.classList.add('hidden'), 2000);
  }

  // ------- Scroll Progress Indicator -------
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    window.addEventListener('scroll', () => {
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = (scrollTop / scrollHeight) * 100;
      scrollIndicator.style.width = progress + '%';
    });
  }

  // ------- Header Scroll -------
  const header = document.querySelector('.header');
  if (header && !header.classList.contains('header-solid')) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 60);
    });
    // On load check
    header.classList.toggle('scrolled', window.scrollY > 60);
  }

  // ------- Mobile Navigation -------
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const navOverlay = document.querySelector('.nav-overlay');

  function closeNav() {
    hamburger?.classList.remove('open');
    navLinks?.classList.remove('open');
    navOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.contains('open');
      if (isOpen) {
        closeNav();
      } else {
        hamburger.classList.add('open');
        navLinks.classList.add('open');
        navOverlay?.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  }

  navOverlay?.addEventListener('click', closeNav);

  // Close nav on link click (mobile)
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', closeNav);
  });

  // ------- Scroll Reveal Animations -------
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ------- Back to Top Button -------
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 500);
    });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ------- Counter Animation -------
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));
  }

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  // ------- Floating Particles -------
  const particleContainer = document.querySelector('.particles');
  if (particleContainer) {
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      particle.style.left = Math.random() * 100 + '%';
      particle.style.width = (Math.random() * 4 + 2) + 'px';
      particle.style.height = particle.style.width;
      particle.style.animationDuration = (Math.random() * 10 + 8) + 's';
      particle.style.animationDelay = (Math.random() * 5) + 's';
      particleContainer.appendChild(particle);
    }
  }

  // ------- Form Tabs -------
  const formTabs = document.querySelectorAll('.form-tab');
  const formPanels = document.querySelectorAll('.form-panel');

  formTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');
      formTabs.forEach(t => t.classList.remove('active'));
      formPanels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(target)?.classList.add('active');
    });
  });

  // ------- Dynamic Form Sections (Intake Form) -------
  const caseTypeSelect = document.getElementById('case-type');
  if (caseTypeSelect) {
    caseTypeSelect.addEventListener('change', () => {
      // Hide all dynamic sections
      document.querySelectorAll('.dynamic-section').forEach(s => {
        s.classList.remove('active');
      });
      const value = caseTypeSelect.value;
      if (value) {
        const section = document.getElementById('section-' + value);
        if (section) section.classList.add('active');
      }
    });
  }

  // ------- Form Validation & Submission -------
  // Contact Form
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validateForm(contactForm)) return;
      submitForm(contactForm, 'contact-success');
    });
  }

  // Intake Form
  const intakeForm = document.getElementById('intake-form');
  if (intakeForm) {
    intakeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validateForm(intakeForm)) return;
      submitForm(intakeForm, 'intake-success');
    });
  }

  function validateForm(form) {
    let isValid = true;
    // Clear previous errors
    form.querySelectorAll('.form-group').forEach(g => g.classList.remove('has-error'));
    form.querySelectorAll('input, select, textarea').forEach(field => {
      field.classList.remove('error');
    });

    // Required fields
    form.querySelectorAll('[required]').forEach(field => {
      if (!field.value.trim()) {
        markError(field, 'This field is required');
        isValid = false;
      }
    });

    // Email validation
    const emailFields = form.querySelectorAll('input[type="email"]');
    emailFields.forEach(email => {
      if (email.value.trim() && !isValidEmail(email.value)) {
        markError(email, 'Please enter a valid email address');
        isValid = false;
      }
    });

    // Phone validation (basic)
    const phoneFields = form.querySelectorAll('input[type="tel"]');
    phoneFields.forEach(phone => {
      if (phone.value.trim() && phone.value.trim().length < 7) {
        markError(phone, 'Please enter a valid phone number');
        isValid = false;
      }
    });

    // Checkbox validation
    const requiredCheckboxes = form.querySelectorAll('input[type="checkbox"][required]');
    requiredCheckboxes.forEach(cb => {
      if (!cb.checked) {
        markError(cb, 'You must agree to continue');
        isValid = false;
      }
    });

    // Scroll to first error
    if (!isValid) {
      const firstError = form.querySelector('.has-error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    return isValid;
  }

  function markError(field, message) {
    const group = field.closest('.form-group') || field.closest('.form-checkbox');
    if (group) {
      group.classList.add('has-error');
      const errorMsg = group.querySelector('.error-msg');
      if (errorMsg) errorMsg.textContent = message;
    }
    field.classList.add('error');
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function submitForm(form, successId) {
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';
    }

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData).toString()
    })
    .then(response => {
      if (response.ok) {
        form.style.display = 'none';
        const success = document.getElementById(successId);
        if (success) success.classList.add('visible');
      } else {
        alert('Something went wrong. Please try again or contact us directly.');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message';
        }
      }
    })
    .catch(() => {
      alert('Network error. Please check your connection and try again.');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      }
    });
  }

  // Real-time field validation (remove error on input)
  document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(field => {
    field.addEventListener('input', () => {
      const group = field.closest('.form-group');
      if (group) {
        group.classList.remove('has-error');
        field.classList.remove('error');
      }
    });
  });

  // ------- Smooth anchor links -------
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ------- Typing Effect for Hero (optional enrichment) -------
  const typingEl = document.querySelector('.typing-effect');
  if (typingEl) {
    const words = JSON.parse(typingEl.getAttribute('data-words') || '[]');
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeLoop() {
      const current = words[wordIndex];
      if (isDeleting) {
        typingEl.textContent = current.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typingEl.textContent = current.substring(0, charIndex + 1);
        charIndex++;
      }

      let delay = isDeleting ? 50 : 100;

      if (!isDeleting && charIndex === current.length) {
        delay = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        delay = 300;
      }

      setTimeout(typeLoop, delay);
    }

    if (words.length) typeLoop();
  }
});
