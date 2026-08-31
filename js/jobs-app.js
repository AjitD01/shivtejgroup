/**
 * Shivtej Placement Services - Interactive Job Board & In-Browser Job Manager (CMS)
 * 100% Frontend-driven, Netlify compatible, with live filtering, application handling,
 * and Recruiter Admin Management.
 */

document.addEventListener('DOMContentLoaded', () => {
  let allJobs = getStoredJobs();

  // DOM Elements
  const jobListContainer = document.getElementById('jobListingsingsContainer');
  const jobCountEl = document.getElementById('jobCountBadge');
  const searchInput = document.getElementById('jobSearchInput');
  const locationFilter = document.getElementById('filterLocation');
  const departmentFilter = document.getElementById('filterDepartment');
  const typeFilter = document.getElementById('filterType');

  // Modals
  const jobDetailModal = document.getElementById('jobDetailModal');
  const jobDetailContent = document.getElementById('jobDetailModalBody');
  const closeJobDetailBtn = document.getElementById('closeJobDetailBtn');

  // Recruiter Admin Elements
  const openAdminBtn = document.getElementById('openJobAdminBtn');
  const adminModal = document.getElementById('jobAdminModal');
  const closeAdminBtn = document.getElementById('closeJobAdminBtn');
  const adminAuthSection = document.getElementById('adminAuthSection');
  const adminPanelSection = document.getElementById('adminPanelSection');
  const adminPinInput = document.getElementById('adminPinInput');
  const adminPinSubmit = document.getElementById('adminPinSubmit');
  const adminPinError = document.getElementById('adminPinError');
  const newJobForm = document.getElementById('addNewJobForm');
  const exportJobsBtn = document.getElementById('exportJobsJsonBtn');
  const resetJobsBtn = document.getElementById('resetDefaultJobsBtn');
  const adminJobListContainer = document.getElementById('adminJobList');

  let currentFilteredJobs = [...allJobs];

  // --------------------------------------------------------------------------
  // 1. Render Job Listings
  // --------------------------------------------------------------------------
  function renderJobs(jobsToRender) {
    if (!jobListContainer) return;

    if (jobsToRender.length === 0) {
      jobListContainer.innerHTML = `
        <div class="empty-jobs-box">
          <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <h4>No job openings found matching your criteria</h4>
          <p>Try clearing filters or search for other keywords, or submit your resume directly below.</p>
          <button class="btn btn-outline btn-sm" id="clearAllFiltersBtn" style="margin-top: 1rem;">Clear All Filters</button>
        </div>
      `;
      const clearBtn = document.getElementById('clearAllFiltersBtn');
      if (clearBtn) {
        clearBtn.addEventListener('click', clearFilters);
      }
      if (jobCountEl) jobCountEl.innerText = `0 Openings`;
      return;
    }

    if (jobCountEl) {
      jobCountEl.innerText = `${jobsToRender.length} Verified Openings`;
    }

    let html = '';
    jobsToRender.forEach(job => {
      html += `
        <div class="job-card" data-job-id="${job.id}">
          <div class="job-card-header">
            <div>
              <div class="job-department-tag">${escapeHtml(job.department)}</div>
              <h3 class="job-title">${escapeHtml(job.title)}</h3>
            </div>
            ${job.urgent ? `<span class="job-urgent-badge">Urgent Requirement</span>` : ''}
          </div>

          <div class="job-meta-row">
            <span class="job-meta-item">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path></svg>
              ${escapeHtml(job.location)}
            </span>
            <span class="job-meta-item">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
              ${escapeHtml(job.type)}
            </span>
            <span class="job-meta-item">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path></svg>
              ${escapeHtml(job.experience)}
            </span>
            ${job.salary ? `
            <span class="job-meta-item salary-tag">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"></path><path fill-rule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clip-rule="evenodd"></path></svg>
              ${escapeHtml(job.salary)}
            </span>` : ''}
          </div>

          <p class="job-brief-desc">${escapeHtml(job.description)}</p>

          <div class="job-card-actions">
            <button class="btn btn-primary btn-sm view-job-btn" data-job-id="${job.id}">View Details & Apply</button>
            <a href="https://wa.me/918805521152?text=Hello%20Shivtej%20Placement%2C%20I%20am%20interested%20in%20applying%20for%20the%20position%20of%20${encodeURIComponent(job.title)}%20(Ref%3A%20${job.id})" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm job-wa-btn">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2z"/></svg>
              Apply via WhatsApp
            </a>
          </div>
        </div>
      `;
    });

    jobListContainer.innerHTML = html;

    // Attach click listeners to view detail buttons
    document.querySelectorAll('.view-job-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const jobId = btn.getAttribute('data-job-id');
        openJobDetails(jobId);
      });
    });
  }

  // --------------------------------------------------------------------------
  // 2. Filter System
  // --------------------------------------------------------------------------
  function applyFilters() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const loc = locationFilter ? locationFilter.value : '';
    const dept = departmentFilter ? departmentFilter.value : '';
    const type = typeFilter ? typeFilter.value : '';

    currentFilteredJobs = allJobs.filter(job => {
      const title = (job.title || '').toLowerCase();
      const desc = (job.description || '').toLowerCase();
      const department = (job.department || '').toLowerCase();
      const location = job.location || '';

      const matchQuery = !query ||
        title.includes(query) ||
        desc.includes(query) ||
        department.includes(query);

      const matchLoc = !loc || location.includes(loc);
      const matchDept = !dept || job.department === dept;
      const matchType = !type || job.type === type;

      return matchQuery && matchLoc && matchDept && matchType;
    });

    renderJobs(currentFilteredJobs);
  }

  function clearFilters() {
    if (searchInput) searchInput.value = '';
    if (locationFilter) locationFilter.value = '';
    if (departmentFilter) departmentFilter.value = '';
    if (typeFilter) typeFilter.value = '';
    applyFilters();
  }

  if (searchInput) searchInput.addEventListener('input', applyFilters);
  if (locationFilter) locationFilter.addEventListener('change', applyFilters);
  if (departmentFilter) departmentFilter.addEventListener('change', applyFilters);
  if (typeFilter) typeFilter.addEventListener('change', applyFilters);

  // --------------------------------------------------------------------------
  // 3. Open Job Details Modal & Application Form
  // --------------------------------------------------------------------------
  function openJobDetails(jobId) {
    const job = allJobs.find(j => j.id === jobId);
    if (!job || !jobDetailModal || !jobDetailContent) return;

    let respHtml = '';
    if (job.responsibilities && job.responsibilities.length) {
      respHtml = `
        <div class="job-detail-section">
          <h4>Key Responsibilities:</h4>
          <ul>
            ${job.responsibilities.map(r => `<li>${escapeHtml(r)}</li>`).join('')}
          </ul>
        </div>
      `;
    }

    let reqHtml = '';
    if (job.requirements && job.requirements.length) {
      reqHtml = `
        <div class="job-detail-section">
          <h4>Requirements & Qualifications:</h4>
          <ul>
            ${job.requirements.map(req => `<li>${escapeHtml(req)}</li>`).join('')}
          </ul>
        </div>
      `;
    }

    jobDetailContent.innerHTML = `
      <div class="job-modal-header">
        <span class="job-department-tag">${escapeHtml(job.department)}</span>
        <h2>${escapeHtml(job.title)}</h2>
        <div class="job-modal-meta">
          <span>📍 ${escapeHtml(job.location)}</span>
          <span>💼 ${escapeHtml(job.type)}</span>
          <span>⏳ ${escapeHtml(job.experience)}</span>
          ${job.salary ? `<span>💰 ${escapeHtml(job.salary)}</span>` : ''}
          <span>🆔 Ref: ${escapeHtml(job.id)}</span>
        </div>
      </div>

      <div class="job-modal-body">
        <div class="job-detail-section">
          <h4>Job Description:</h4>
          <p>${escapeHtml(job.description)}</p>
        </div>

        ${respHtml}
        ${reqHtml}

        <!-- Send Resume (Email / WhatsApp) — no backend required -->
        <div class="job-application-box">
          <h3>Apply for this Position</h3>
          <p>Send your resume directly to the Shivtej Placement recruitment team.</p>

          <form id="modalJobApplicationForm" novalidate data-job-id="${escapeHtml(job.id)}" data-job-title="${escapeHtml(job.title)}">
            <div class="form-grid-2">
              <div class="form-group">
                <label for="applicant_name">Full Name *</label>
                <input type="text" id="applicant_name" name="applicant_name" required placeholder="Your full name">
              </div>
              <div class="form-group">
                <label for="applicant_phone">Phone / WhatsApp Number *</label>
                <input type="tel" id="applicant_phone" name="applicant_phone" required placeholder="+91 98765 43210">
              </div>
            </div>

            <div class="form-grid-2">
              <div class="form-group">
                <label for="applicant_email">Email Address *</label>
                <input type="email" id="applicant_email" name="applicant_email" required placeholder="your.email@gmail.com">
              </div>
              <div class="form-group">
                <label for="applicant_experience">Current Experience *</label>
                <input type="text" id="applicant_experience" name="applicant_experience" required placeholder="e.g. 2.5 Years">
              </div>
            </div>

            <div class="form-group">
              <label for="applicant_location">Current / Preferred Location</label>
              <input type="text" id="applicant_location" name="applicant_location" placeholder="e.g. Pune, Chikhli, Bhosari, PCMC">
            </div>

            <div class="form-group">
              <label for="applicant_message">Brief Message / Notice Period</label>
              <textarea id="applicant_message" name="applicant_message" rows="2" placeholder="Mention notice period, current CTC / expected CTC..."></textarea>
            </div>

            <p style="color: #64748b; font-size: 0.85rem; margin: 0.5rem 0 1rem;">
              Your details are pre-filled automatically — just <strong>attach your resume / CV</strong> in the email or WhatsApp chat that opens.
            </p>

            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
              <button type="button" class="btn btn-primary send-resume-btn" data-channel="email" style="flex: 1; min-width: 150px;">Send Resume via Email</button>
              <button type="button" class="btn send-resume-btn" data-channel="whatsapp" style="flex: 1; min-width: 150px; background: #25d366; color: #fff;">Send via WhatsApp</button>
            </div>

            <div class="form-status" id="jobAppStatus" style="margin-top: 1rem;"></div>
          </form>
        </div>
      </div>
    `;

    jobDetailModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeJobDetails() {
    if (jobDetailModal) {
      jobDetailModal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  }

  if (closeJobDetailBtn) closeJobDetailBtn.addEventListener('click', closeJobDetails);
  if (jobDetailModal) {
    jobDetailModal.addEventListener('click', (e) => {
      if (e.target === jobDetailModal) closeJobDetails();
    });
  }

  // --------------------------------------------------------------------------
  // 4. In-Browser Frontend Job Admin Manager (CMS)
  // --------------------------------------------------------------------------
  if (openAdminBtn) {
    openAdminBtn.addEventListener('click', () => {
      if (adminModal) {
        adminModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (sessionStorage.getItem('shivtej_admin_auth') === 'true') {
          showAdminPanel();
        } else {
          showAdminAuth();
        }
      }
    });
  }

  function closeAdminModal() {
    if (adminModal) {
      adminModal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  }

  if (closeAdminBtn) closeAdminBtn.addEventListener('click', closeAdminModal);

  function showAdminAuth() {
    if (adminAuthSection) adminAuthSection.style.display = 'block';
    if (adminPanelSection) adminPanelSection.style.display = 'none';
    if (adminPinInput) adminPinInput.value = '';
    if (adminPinError) adminPinError.style.display = 'none';
  }

  function showAdminPanel() {
    if (adminAuthSection) adminAuthSection.style.display = 'none';
    if (adminPanelSection) adminPanelSection.style.display = 'block';
    renderAdminJobList();
  }

  if (adminPinSubmit) {
    adminPinSubmit.addEventListener('click', () => {
      const pin = adminPinInput ? adminPinInput.value.trim() : '';
      if (pin === 'shivtej' || pin === '1234' || pin === 'admin') {
        sessionStorage.setItem('shivtej_admin_auth', 'true');
        showAdminPanel();
      } else {
        if (adminPinError) {
          adminPinError.style.display = 'block';
          adminPinError.innerText = "Incorrect passcode. (Default: shivtej or 1234)";
        }
      }
    });
  }

  function renderAdminJobList() {
    if (!adminJobListContainer) return;
    allJobs = getStoredJobs();

    if (allJobs.length === 0) {
      adminJobListContainer.innerHTML = `<p style="color: #94a3b8;">No jobs listed currently.</p>`;
      return;
    }

    let html = '';
    allJobs.forEach(job => {
      html += `
        <div class="admin-job-item">
          <div>
            <strong>${escapeHtml(job.title)}</strong> (${escapeHtml(job.department)})
            <br><small style="color: #64748b;">${escapeHtml(job.location)} • ${escapeHtml(job.type)} • ID: ${job.id}</small>
          </div>
          <button class="btn btn-outline btn-sm delete-job-btn" data-job-id="${job.id}" style="color: #ef4444; border-color: #ef4444;">
            Delete
          </button>
        </div>
      `;
    });

    adminJobListContainer.innerHTML = html;

    document.querySelectorAll('.delete-job-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const jid = btn.getAttribute('data-job-id');
        if (confirm(`Are you sure you want to delete job opening (${jid})?`)) {
          allJobs = allJobs.filter(j => j.id !== jid);
          saveStoredJobs(allJobs);
          renderAdminJobList();
          applyFilters();
        }
      });
    });
  }

  // Handle New Job Submission
  if (newJobForm) {
    newJobForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(newJobForm);

      const respLines = (formData.get('job_resp') || '').split('\n').map(s => s.trim()).filter(Boolean);
      const reqLines = (formData.get('job_req') || '').split('\n').map(s => s.trim()).filter(Boolean);

      let newId;
      do {
        newId = "JOB-" + Math.floor(100 + Math.random() * 900);
      } while (allJobs.some(j => j.id === newId));

      const newJob = {
        id: newId,
        title: formData.get('job_title') || '',
        department: formData.get('job_department') || 'General',
        location: formData.get('job_location') || 'Pune',
        type: formData.get('job_type') || 'Full-time',
        experience: formData.get('job_exp') || 'Mid Level',
        salary: formData.get('job_salary') || 'As per industry standards',
        postedDate: new Date().toISOString().split('T')[0],
        urgent: formData.get('job_urgent') === 'on',
        description: formData.get('job_desc') || '',
        responsibilities: respLines.length ? respLines : ['As per role specifications.'],
        requirements: reqLines.length ? reqLines : ['Relevant experience in the required domain.']
      };

      allJobs.unshift(newJob);
      saveStoredJobs(allJobs);
      newJobForm.reset();
      alert(`Job "${newJob.title}" added successfully!`);
      renderAdminJobList();
      applyFilters();
    });
  }

  // Export JSON Database
  if (exportJobsBtn) {
    exportJobsBtn.addEventListener('click', () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allJobs, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", "jobs-data.json");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    });
  }

  // Reset to default
  if (resetJobsBtn) {
    resetJobsBtn.addEventListener('click', () => {
      if (confirm("Reset all job listings to the default company catalog?")) {
        allJobs = [...DEFAULT_JOBS];
        saveStoredJobs(allJobs);
        renderAdminJobList();
        applyFilters();
      }
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Initial Render
  renderJobs(allJobs);
});
