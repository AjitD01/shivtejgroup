/**
 * Shivtej Industries - Authentic Website JavaScript
 * Matching https://shivtejgroup.com/
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Navigation Toggle
  const mobileToggle = document.getElementById('mobileNavToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = mobileToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      mobileToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // 2. Header shadow on scroll
  const siteHeader = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (siteHeader) {
      if (window.scrollY > 20) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }
  }, { passive: true });

  // 3. Form submissions (Footer Inquiry & Contact Forms)
  const forms = document.querySelectorAll('form[data-netlify="true"], form.ajax-form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      // If deployed on netlify, allow normal submission or handle gracefully
      const feedback = form.querySelector('.form-feedback') || document.getElementById('formFeedback');
      const submitBtn = form.querySelector('button[type="submit"]');

      if (submitBtn) {
        submitBtn.disabled = true;
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Submitting...';

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
          form.reset();
          if (feedback) {
            feedback.style.display = 'block';
            feedback.textContent = 'Thank you! Your inquiry has been received. Our team will contact you shortly.';
            setTimeout(() => {
              feedback.style.display = 'none';
            }, 6000);
          } else {
            alert('Thank you! Your inquiry has been received. Our team will contact you shortly.');
          }
        }, 800);
      }
    });
  });
});
