/**
 * Shivtej Group - Main UI & Navigation JavaScript
 * Handles smooth scrolling, mobile navigation, escape keys, and Netlify form handling.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Mobile Navigation Toggle & Outside Click Handler
  // --------------------------------------------------------------------------
  const mobileToggle = document.getElementById('mobileNavToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });

    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 2. Global Escape Key Listener for Modals
  // --------------------------------------------------------------------------
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModals = document.querySelectorAll('.custom-modal-backdrop.active');
      activeModals.forEach(modal => {
        modal.classList.remove('active');
      });
      document.body.style.overflow = 'auto';
    }
  });

  // --------------------------------------------------------------------------
  // 3. Header Scroll Effect & Back-to-Top Button
  // --------------------------------------------------------------------------
  const siteHeader = document.querySelector('.site-header');
  const backToTopBtn = document.getElementById('backToTopBtn');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (siteHeader) {
      if (scrollY > 30) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }

    if (backToTopBtn) {
      if (scrollY > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --------------------------------------------------------------------------
  // 4. Netlify Form AJAX Submission Helper
  // --------------------------------------------------------------------------
  function setupAjaxForm(formId, statusId, successMsg) {
    const form = document.getElementById(formId);
    const status = document.getElementById(statusId);
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Submit';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending details...';
      }

      const formData = new FormData(form);

      fetch('/', {
        method: 'POST',
        body: formData
      })
      .then((response) => {
        if (!response.ok) throw new Error('Submission failed: ' + response.status);
        if (status) {
          status.className = 'form-status success';
          status.style.color = '#10b981';
          status.style.fontWeight = '600';
          status.innerHTML = successMsg || `✓ Thank you! Your submission has been received.`;
        }
        form.reset();
      })
      .catch(() => {
        // Genuine failure: keep the user's data and offer a fallback channel.
        if (status) {
          status.className = 'form-status error';
          status.style.color = '#ef4444';
          status.style.fontWeight = '600';
          status.innerHTML = `⚠ Sorry, we couldn't send your details right now. Please try again, or reach us on WhatsApp / call <a href="tel:+918805521152" style="color:inherit;text-decoration:underline;">+91 8805521152</a>.`;
        }
      })
      .finally(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      });
    });
  }

  setupAjaxForm('footerInquiryForm', 'footerFormStatus', '✓ Thank you! Your inquiry has been sent.');
  setupAjaxForm('contactPageForm', 'contactPageFormStatus', '✓ Thank you! Your message has been sent to our team.');
  setupAjaxForm('employerStaffingForm', 'employerFormStatus', '✓ Staffing request received! Our recruitment manager will contact you within 24 hours.');

  // --------------------------------------------------------------------------
  // 5. "Send Resume" via Email / WhatsApp (works on static hosting — no backend)
  //    A file cannot be auto-attached to mailto:/wa.me links, so we pre-fill all
  //    the candidate's details and prompt them to attach their CV in the app
  //    that opens. Event-delegated so it also covers the dynamically-injected
  //    job-application form inside the jobs modal.
  // --------------------------------------------------------------------------
  const HR_EMAIL = 'shivtejentp1575@gmail.com';
  const HR_WHATSAPP = '918805521152';

  function buildResumeMessage(form) {
    const lines = [];
    form.querySelectorAll('input, textarea, select').forEach((el) => {
      if (!el.name || el.type === 'hidden' || el.type === 'file' || el.name === 'bot-field') return;
      const value = (el.value || '').trim();
      if (!value) return;
      const label = el.id ? form.querySelector('label[for="' + el.id + '"]') : null;
      const key = (label ? label.textContent : el.name).replace('*', '').trim();
      lines.push(key + ': ' + value);
    });
    return lines;
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.send-resume-btn');
    if (!btn) return;

    const form = btn.closest('form');
    if (!form) return;

    // Validate required fields (form uses novalidate so we trigger it manually)
    const requiredFields = form.querySelectorAll('[required]');
    for (const field of requiredFields) {
      if (!field.value.trim() || (field.checkValidity && !field.checkValidity())) {
        if (field.reportValidity) field.reportValidity();
        else field.focus();
        return;
      }
    }

    const channel = btn.getAttribute('data-channel');
    const status = form.querySelector('.form-status');
    const jobTitle = form.getAttribute('data-job-title');
    const jobId = form.getAttribute('data-job-id');

    const nameField = form.querySelector('[name="candidate_name"], [name="applicant_name"]');
    const applicantName = nameField ? nameField.value.trim() : '';

    const subject = jobTitle
      ? `Job Application: ${jobTitle}${jobId ? ' (Ref: ' + jobId + ')' : ''} — ${applicantName}`
      : `Resume Submission — ${applicantName}`;

    const detailLines = buildResumeMessage(form);

    if (channel === 'email') {
      const body =
        (jobTitle ? `I would like to apply for the position of ${jobTitle}${jobId ? ' (Ref: ' + jobId + ')' : ''}.\n\n` : 'I would like to submit my profile to your talent pool.\n\n') +
        detailLines.join('\n') +
        '\n\nMy resume / CV is attached to this email.\n\nThank you.';
      const mailto = `mailto:${HR_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailto;
      if (status) {
        status.className = 'form-status success';
        status.style.color = '#10b981';
        status.innerHTML = `✓ Opening your email app — please <strong>attach your resume file</strong> before sending.`;
      }
    } else if (channel === 'whatsapp') {
      const text =
        subject + '\n\n' +
        detailLines.join('\n') +
        '\n\nI will share my resume / CV here in the chat.';
      const wa = `https://wa.me/${HR_WHATSAPP}?text=${encodeURIComponent(text)}`;
      window.open(wa, '_blank', 'noopener,noreferrer');
      if (status) {
        status.className = 'form-status success';
        status.style.color = '#10b981';
        status.innerHTML = `✓ Opening WhatsApp — please <strong>attach your resume file</strong> in the chat before sending.`;
      }
    }
  });
});
