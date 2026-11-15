/**
 * Shivtej Placement Services - Interactive Job Board & Password-Protected Recruiter Portal
 * 
 * Access Architecture:
 * 1. Public Candidates:
 *    - Unlisted page accessed directly via specific URL (e.g. /jobs.html).
 *    - Not linked from any public website navigation bar.
 *    - Browse active job openings from Supabase database.
 *    - Apply via WhatsApp or Email (stored in Supabase `job_applications`).
 * 
 * 2. Recruiter / Admin:
 *    - ID & Password Protected.
 *    - Accessible via "Recruiter Admin" button or URL hash `#admin`.
 *    - Authenticates against configured credentials.
 *    - Post new job openings directly to Supabase (`job_openings`).
 *    - Edit existing openings (title, department, salary, requirements, description).
 *    - Delete or close job openings.
 *    - Change admin login credentials anytime.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Initial State & Supabase Jobs
  // --------------------------------------------------------------------------
  let allJobs = typeof getStoredJobs === 'function' ? getStoredJobs() : [];

  // DOM Elements - Public Job Board
  const jobListContainer = document.getElementById('jobsListContainer') || document.getElementById('jobListingsingsContainer');
  const jobCountEl = document.getElementById('jobsCountBadge') || document.getElementById('jobCountBadge');
  const searchInput = document.getElementById('jobSearchInput');
  const locationFilter = document.getElementById('filterLocation');
  const departmentFilter = document.getElementById('filterDepartment');
  const typeFilter = document.getElementById('filterType');

  // DOM Elements - Candidate Application Modal
  const applyModal = document.getElementById('jobApplyModal') || document.getElementById('jobDetailModal');
  const closeApplyBtn = document.getElementById('closeApplyModalBtn') || document.getElementById('closeJobDetailBtn');
  const applyModalTitle = document.getElementById('applyModalTitle');
  const applyJobDept = document.getElementById('applyJobDept');
  const applyJobIdInput = document.getElementById('applyJobIdInput');
  const applyJobTitleInput = document.getElementById('applyJobTitleInput');
  const submitResumeWhatsAppBtn = document.getElementById('submitResumeWhatsAppBtn');
  const submitResumeEmailBtn = document.getElementById('submitResumeEmailBtn');
  const applyModalStatus = document.getElementById('applyModalStatus');

  // DOM Elements - Recruiter Admin Authentication
  const openAdminLoginBtn = document.getElementById('openAdminLoginBtn');
  const adminAuthModal = document.getElementById('adminAuthModal');
  const closeAdminAuthBtn = document.getElementById('closeAdminAuthBtn');
  const adminLoginForm = document.getElementById('adminLoginForm');
  const adminLoginId = document.getElementById('adminLoginId');
  const adminLoginPassword = document.getElementById('adminLoginPassword');
  const adminLoginFeedback = document.getElementById('adminLoginFeedback');

  // DOM Elements - Recruiter Management Dashboard
  const adminManagerModal = document.getElementById('adminManagerModal');
  const closeAdminDashboardBtn = document.getElementById('closeAdminDashboardBtn');
  const adminLogoutBtn = document.getElementById('adminLogoutBtn');
  const adminSessionUser = document.getElementById('adminSessionUser');
  const adminJobCountBadge = document.getElementById('adminJobCountBadge');

  // Tabs
  const tabCreateJobBtn = document.getElementById('tabCreateJobBtn');
  const tabManageJobsBtn = document.getElementById('tabManageJobsBtn');
  const tabSettingsBtn = document.getElementById('tabSettingsBtn');
  const adminPanelCreateJob = document.getElementById('adminPanelCreateJob');
  const adminPanelManageJobs = document.getElementById('adminPanelManageJobs');
  const adminPanelSettings = document.getElementById('adminPanelSettings');

  // Admin Job Form
  const adminJobForm = document.getElementById('adminJobForm');
  const adminEditJobId = document.getElementById('adminEditJobId');
  const adminFormActionTitle = document.getElementById('adminFormActionTitle');
  const adminEditingPill = document.getElementById('adminEditingPill');
  const adminJobTitle = document.getElementById('adminJobTitle');
  const adminJobDept = document.getElementById('adminJobDept');
  const adminJobLoc = document.getElementById('adminJobLoc');
  const adminJobType = document.getElementById('adminJobType');
  const adminJobExp = document.getElementById('adminJobExp');
  const adminJobSalary = document.getElementById('adminJobSalary');
  const adminJobDesc = document.getElementById('adminJobDesc');
  const adminJobUrgent = document.getElementById('adminJobUrgent');
  const adminSaveJobBtn = document.getElementById('adminSaveJobBtn');
  const adminCancelEditBtn = document.getElementById('adminCancelEditBtn');
  const adminJobFeedback = document.getElementById('adminJobFeedback');
  const adminJobsTableContainer = document.getElementById('adminJobsTableContainer');
  const adminRefreshJobsBtn = document.getElementById('adminRefreshJobsBtn');

  // Admin Settings Form
  const adminChangePasswordForm = document.getElementById('adminChangePasswordForm');
  const adminNewLoginId = document.getElementById('adminNewLoginId');
  const adminNewPassword = document.getElementById('adminNewPassword');
  const adminSettingsFeedback = document.getElementById('adminSettingsFeedback');

  let currentFilteredJobs = [...allJobs];

  // --------------------------------------------------------------------------
  // 2. Render Public Job Board
  // --------------------------------------------------------------------------
  function renderJobs(jobsToRender) {
    if (!jobListContainer) return;

    if (jobsToRender.length === 0) {
      jobListContainer.innerHTML = `
        <div class="empty-jobs-box" style="text-align: center; padding: 3rem 1.5rem; background: var(--color-surface, #ffffff); border-radius: 12px; border: 1px dashed var(--color-border, #cbd5e1); grid-column: 1 / -1;">
          <svg class="ui-icon ui-icon-lg" style="margin: 0 auto 1rem; color: #94a3b8;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
          <h4 style="font-size: 1.15rem; font-weight: 700; color: var(--color-text-main, #0f172a); margin-bottom: 0.5rem;">No job openings found matching your criteria</h4>
          <p style="color: var(--color-text-muted, #64748b); font-size: 0.95rem; max-width: 450px; margin: 0 auto 1.25rem;">Try clearing filters or search for other keywords, or submit your resume directly below to our talent pool.</p>
          <button class="btn btn-outline btn-sm" id="clearAllFiltersBtn">Clear All Filters</button>
        </div>
      `;
      const clearBtn = document.getElementById('clearAllFiltersBtn');
      if (clearBtn) clearBtn.addEventListener('click', clearFilters);
      if (jobCountEl) jobCountEl.innerText = '0';
      return;
    }

    if (jobCountEl) jobCountEl.innerText = `${jobsToRender.length}`;

    let html = '';
    jobsToRender.forEach(job => {
      const isTech = job.department && (job.department.toLowerCase().includes('it') || job.department.toLowerCase().includes('software'));
      html += `
        <div class="job-card" data-job-id="${escapeHtml(job.id)}">
          <div class="job-card-header">
            <div>
              <div class="job-department-tag" style="${isTech ? 'background: #eff6ff; color: #2563eb; border-color: #bfdbfe;' : ''}">
                ${escapeHtml(job.department)}
              </div>
              <h3 class="job-title">${escapeHtml(job.title)}</h3>
            </div>
            ${job.urgent ? `<span class="job-urgent-badge">Urgent Hiring</span>` : ''}
          </div>

          <div class="job-meta-row">
            <span class="job-meta-item">
              <svg class="ui-icon ui-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              ${escapeHtml(job.location)}
            </span>
            <span class="job-meta-item">
              <svg class="ui-icon ui-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              ${escapeHtml(job.type || 'Full-time')}
            </span>
            <span class="job-meta-item">
              <svg class="ui-icon ui-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              ${escapeHtml(job.experience || 'Mid Level')}
            </span>
            ${job.salary ? `
            <span class="job-meta-item salary-tag">
              <svg class="ui-icon ui-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12"/><path d="M6 8h12"/><path d="m6 13 8.5 8"/><path d="M6 13h3a4 4 0 0 0 0-8"/></svg>
              ${escapeHtml(job.salary)}
            </span>` : ''}
          </div>

          <p class="job-brief-desc">${escapeHtml(job.description)}</p>

          <div class="job-card-actions">
            <button class="btn btn-primary btn-sm view-job-btn" data-job-id="${escapeHtml(job.id)}">
              View Details &amp; Apply
            </button>
            <a href="https://wa.me/918805521152?text=Hello%20Shivtej%20Placement%20Team%2C%20I%20am%20interested%20in%20applying%20for%20${encodeURIComponent(job.title)}%20(Ref%3A%20${encodeURIComponent(job.id)})" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm job-wa-btn" style="display:inline-flex; align-items:center; gap:0.4rem;">
              <svg class="ui-icon ui-icon-xs" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2z"/></svg>
              WhatsApp Apply
            </a>
          </div>
        </div>
      `;
    });

    jobListContainer.innerHTML = html;

    jobListContainer.querySelectorAll('.view-job-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const jobId = btn.getAttribute('data-job-id');
        openApplyModal(jobId);
      });
    });
  }

  // --------------------------------------------------------------------------
  // 3. Sync from Supabase Database
  // --------------------------------------------------------------------------
  async function syncJobsFromSupabase() {
    if (typeof fetchJobOpenings === 'function') {
      try {
        const dbJobs = await fetchJobOpenings();
        if (Array.isArray(dbJobs) && dbJobs.length > 0) {
          allJobs = dbJobs;
          if (typeof saveStoredJobs === 'function') {
            saveStoredJobs(allJobs);
          }
          applyFilters();
          renderAdminJobsTable();
        }
      } catch (err) {
        console.warn('[Jobs] Error syncing from Supabase:', err);
      }
    }
  }

  renderJobs(allJobs);
  syncJobsFromSupabase();

  // --------------------------------------------------------------------------
  // 4. Live Filtering
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
  // 5. Candidate Application Modal System
  // --------------------------------------------------------------------------
  function openApplyModal(jobId) {
    const job = allJobs.find(j => j.id === jobId);
    if (!job || !applyModal) return;

    if (applyModalTitle) applyModalTitle.innerText = `Apply for: ${job.title}`;
    if (applyJobDept) applyJobDept.innerText = `${job.department} • Ref: ${job.id}`;
    if (applyJobIdInput) applyJobIdInput.value = job.id;
    if (applyJobTitleInput) applyJobTitleInput.value = job.title;

    if (applyModalStatus) {
      applyModalStatus.style.display = 'none';
      applyModalStatus.innerHTML = '';
    }

    applyModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeApplyModal() {
    if (applyModal) {
      applyModal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  }

  if (closeApplyBtn) closeApplyBtn.addEventListener('click', closeApplyModal);
  if (applyModal) {
    applyModal.addEventListener('click', (e) => {
      if (e.target === applyModal) closeApplyModal();
    });
  }

  async function handleApplicationSubmission(channel) {
    const jobId = applyJobIdInput ? applyJobIdInput.value : 'GENERAL';
    const jobTitle = applyJobTitleInput ? applyJobTitleInput.value : 'General Application';
    const name = (document.getElementById('candName')?.value || '').trim();
    const phone = (document.getElementById('candPhone')?.value || '').trim();
    const email = (document.getElementById('candEmail')?.value || '').trim();
    const exp = (document.getElementById('candExp')?.value || '').trim();
    const notice = (document.getElementById('candNotice')?.value || '').trim();
    const summary = (document.getElementById('candSummary')?.value || '').trim();

    if (!name || !phone || !email || !exp) {
      if (applyModalStatus) {
        applyModalStatus.style.display = 'block';
        applyModalStatus.style.background = '#fef2f2';
        applyModalStatus.style.color = '#dc2626';
        applyModalStatus.style.padding = '0.75rem';
        applyModalStatus.style.borderRadius = '6px';
        applyModalStatus.style.border = '1px solid #fecaca';
        applyModalStatus.innerText = 'Please complete all required fields (Name, Phone, Email, Experience).';
      }
      return;
    }

    if (submitResumeWhatsAppBtn) submitResumeWhatsAppBtn.disabled = true;
    if (submitResumeEmailBtn) submitResumeEmailBtn.disabled = true;

    if (applyModalStatus) {
      applyModalStatus.style.display = 'block';
      applyModalStatus.style.background = '#f8fafc';
      applyModalStatus.style.color = '#334155';
      applyModalStatus.style.padding = '0.75rem';
      applyModalStatus.style.borderRadius = '6px';
      applyModalStatus.style.border = '1px solid #e2e8f0';
      applyModalStatus.innerText = 'Logging application to Supabase database...';
    }

    if (typeof saveJobApplicationRequest === 'function') {
      try {
        await saveJobApplicationRequest({
          job_id: jobId,
          job_title: jobTitle,
          candidate_name: name,
          candidate_phone: phone,
          candidate_email: email,
          experience: exp,
          notice_period: notice,
          skills_summary: summary,
          channel_preferred: channel
        });
      } catch (err) {
        console.warn('[Jobs] Storage warning:', err);
      }
    }

    const subject = `Job Application: ${jobTitle} [Ref: ${jobId}] - ${name}`;
    const messageBody = `Hello Shivtej Placement Team,\n\nI wish to apply for "${jobTitle}" (Ref: ${jobId}).\n\nCandidate Details:\n- Name: ${name}\n- Phone: ${phone}\n- Email: ${email}\n- Experience: ${exp}\n- Notice Period: ${notice || 'Immediate / 15 Days'}\n- Background/Skills: ${summary || 'Provided in CV'}\n\nI am attaching my resume / CV for your immediate review.\n\nThank you,\n${name}`;

    if (applyModalStatus) {
      applyModalStatus.style.background = '#f0fdf4';
      applyModalStatus.style.color = '#15803d';
      applyModalStatus.style.border = '1px solid #bbf7d0';
      applyModalStatus.innerText = `✓ Application request recorded! Opening ${channel === 'whatsapp' ? 'WhatsApp' : 'your Email'} to send CV...`;
    }

    setTimeout(() => {
      if (channel === 'whatsapp') {
        const waUrl = `https://wa.me/918805521152?text=${encodeURIComponent(messageBody)}`;
        window.open(waUrl, '_blank');
      } else {
        const mailUrl = `mailto:shivtejentp1575@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(messageBody)}`;
        window.location.href = mailUrl;
      }

      setTimeout(() => {
        if (submitResumeWhatsAppBtn) submitResumeWhatsAppBtn.disabled = false;
        if (submitResumeEmailBtn) submitResumeEmailBtn.disabled = false;
        closeApplyModal();
        document.getElementById('jobApplicationForm')?.reset();
      }, 1500);
    }, 600);
  }

  if (submitResumeWhatsAppBtn) {
    submitResumeWhatsAppBtn.addEventListener('click', () => handleApplicationSubmission('whatsapp'));
  }

  if (submitResumeEmailBtn) {
    submitResumeEmailBtn.addEventListener('click', () => handleApplicationSubmission('email'));
  }

  // --------------------------------------------------------------------------
  // 6. ID & PASSWORD PROTECTED RECRUITER PORTAL
  // --------------------------------------------------------------------------

  // Credentials storage (Default: admin / Shivtej@2025)
  function getAdminCredentials() {
    try {
      const stored = localStorage.getItem('shivtej_admin_creds');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {}
    return { loginId: 'admin', password: 'Shivtej@2025' };
  }

  function setAdminCredentials(newId, newPassword) {
    localStorage.setItem('shivtej_admin_creds', JSON.stringify({
      loginId: newId,
      password: newPassword
    }));
  }

  function isAdminAuthenticated() {
    return sessionStorage.getItem('shivtej_admin_auth') === 'true';
  }

  function setAdminSession(user) {
    sessionStorage.setItem('shivtej_admin_auth', 'true');
    sessionStorage.setItem('shivtej_admin_user', user);
  }

  function clearAdminSession() {
    sessionStorage.removeItem('shivtej_admin_auth');
    sessionStorage.removeItem('shivtej_admin_user');
  }

  function openRecruiterPortal() {
    if (isAdminAuthenticated()) {
      showAdminDashboard();
    } else {
      showAdminAuthModal();
    }
  }

  if (openAdminLoginBtn) {
    openAdminLoginBtn.addEventListener('click', openRecruiterPortal);
  }

  // Auto-trigger if URL contains #admin or ?admin
  if (window.location.hash === '#admin' || window.location.search.includes('admin')) {
    setTimeout(openRecruiterPortal, 400);
  }

  // Auth Modal Controls
  function showAdminAuthModal() {
    if (!adminAuthModal) return;
    if (adminLoginFeedback) {
      adminLoginFeedback.style.display = 'none';
      adminLoginFeedback.innerHTML = '';
    }
    if (adminLoginForm) adminLoginForm.reset();
    adminAuthModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    adminLoginId?.focus();
  }

  function closeAdminAuthModal() {
    if (adminAuthModal) {
      adminAuthModal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  }

  if (closeAdminAuthBtn) closeAdminAuthBtn.addEventListener('click', closeAdminAuthModal);
  if (adminAuthModal) {
    adminAuthModal.addEventListener('click', (e) => {
      if (e.target === adminAuthModal) closeAdminAuthModal();
    });
  }

  // Handle Login Form Submission
  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const enteredId = (adminLoginId?.value || '').trim();
      const enteredPassword = (adminLoginPassword?.value || '').trim();
      const creds = getAdminCredentials();

      if (enteredId === creds.loginId && enteredPassword === creds.password) {
        setAdminSession(enteredId);
        closeAdminAuthModal();
        showAdminDashboard();
      } else {
        if (adminLoginFeedback) {
          adminLoginFeedback.style.display = 'block';
          adminLoginFeedback.style.background = '#fef2f2';
          adminLoginFeedback.style.color = '#dc2626';
          adminLoginFeedback.style.border = '1px solid #fecaca';
          adminLoginFeedback.innerHTML = '<strong>Access Denied:</strong> Invalid Login ID or Password.';
        }
      }
    });
  }

  // Admin Dashboard Controls
  function showAdminDashboard() {
    if (!adminManagerModal) return;
    const user = sessionStorage.getItem('shivtej_admin_user') || 'admin';
    if (adminSessionUser) adminSessionUser.innerText = user;
    switchAdminTab('create');
    resetAdminJobForm();
    renderAdminJobsTable();
    adminManagerModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeAdminDashboard() {
    if (adminManagerModal) {
      adminManagerModal.classList.remove('active');
      document.body.style.overflow = 'auto';
      resetAdminJobForm();
    }
  }

  if (closeAdminDashboardBtn) closeAdminDashboardBtn.addEventListener('click', closeAdminDashboard);
  if (adminManagerModal) {
    adminManagerModal.addEventListener('click', (e) => {
      if (e.target === adminManagerModal) closeAdminDashboard();
    });
  }

  if (adminLogoutBtn) {
    adminLogoutBtn.addEventListener('click', () => {
      clearAdminSession();
      closeAdminDashboard();
      alert('You have been signed out from the Recruiter Portal.');
    });
  }

  // Tab switching
  function switchAdminTab(tab) {
    if (tabCreateJobBtn) {
      tabCreateJobBtn.style.background = tab === 'create' ? '#eff6ff' : 'transparent';
      tabCreateJobBtn.style.color = tab === 'create' ? '#1e40af' : '#64748b';
    }
    if (tabManageJobsBtn) {
      tabManageJobsBtn.style.background = tab === 'manage' ? '#eff6ff' : 'transparent';
      tabManageJobsBtn.style.color = tab === 'manage' ? '#1e40af' : '#64748b';
    }
    if (tabSettingsBtn) {
      tabSettingsBtn.style.background = tab === 'settings' ? '#eff6ff' : 'transparent';
      tabSettingsBtn.style.color = tab === 'settings' ? '#1e40af' : '#64748b';
    }

    if (adminPanelCreateJob) adminPanelCreateJob.style.display = tab === 'create' ? 'block' : 'none';
    if (adminPanelManageJobs) {
      adminPanelManageJobs.style.display = tab === 'manage' ? 'block' : 'none';
      if (tab === 'manage') renderAdminJobsTable();
    }
    if (adminPanelSettings) adminPanelSettings.style.display = tab === 'settings' ? 'block' : 'none';
  }

  if (tabCreateJobBtn) tabCreateJobBtn.addEventListener('click', () => switchAdminTab('create'));
  if (tabManageJobsBtn) tabManageJobsBtn.addEventListener('click', () => switchAdminTab('manage'));
  if (tabSettingsBtn) tabSettingsBtn.addEventListener('click', () => switchAdminTab('settings'));
  if (adminRefreshJobsBtn) adminRefreshJobsBtn.addEventListener('click', () => syncJobsFromSupabase());

  // Reset Job Form
  function resetAdminJobForm() {
    if (adminJobForm) adminJobForm.reset();
    if (adminEditJobId) adminEditJobId.value = '';
    if (adminFormActionTitle) adminFormActionTitle.innerText = 'Create New Job Opening';
    if (adminEditingPill) adminEditingPill.style.display = 'none';
    if (adminSaveJobBtn) adminSaveJobBtn.innerText = 'Publish Job Opening to Supabase';
    if (adminCancelEditBtn) adminCancelEditBtn.style.display = 'none';
    if (adminJobFeedback) {
      adminJobFeedback.style.display = 'none';
      adminJobFeedback.innerHTML = '';
    }
  }

  if (adminCancelEditBtn) adminCancelEditBtn.addEventListener('click', resetAdminJobForm);

  // Edit Job Clicked
  function startEditingJobInAdmin(jobId) {
    const job = allJobs.find(j => j.id === jobId);
    if (!job) return;

    switchAdminTab('create');
    if (adminEditJobId) adminEditJobId.value = job.id;
    if (adminJobTitle) adminJobTitle.value = job.title || '';
    if (adminJobDept) adminJobDept.value = job.department || 'IT & Software Development';
    if (adminJobLoc) adminJobLoc.value = job.location || 'Pune';
    if (adminJobType) adminJobType.value = job.type || 'Full-time';
    if (adminJobExp) adminJobExp.value = job.experience || '';
    if (adminJobSalary) adminJobSalary.value = job.salary || '';
    if (adminJobDesc) adminJobDesc.value = job.description || '';
    if (adminJobUrgent) adminJobUrgent.checked = Boolean(job.urgent);

    if (adminFormActionTitle) adminFormActionTitle.innerText = `Edit Job Opening (${job.id})`;
    if (adminEditingPill) adminEditingPill.style.display = 'inline-block';
    if (adminSaveJobBtn) adminSaveJobBtn.innerText = 'Save Changes to Supabase';
    if (adminCancelEditBtn) adminCancelEditBtn.style.display = 'inline-block';

    adminJobForm?.scrollIntoView({ behavior: 'smooth' });
  }

  // Render Admin Job Table / List
  function renderAdminJobsTable() {
    if (!adminJobsTableContainer) return;
    if (adminJobCountBadge) adminJobCountBadge.innerText = `${allJobs.length}`;

    if (allJobs.length === 0) {
      adminJobsTableContainer.innerHTML = `<p style="color:#94a3b8; padding:1.5rem; text-align:center;">No job openings in database.</p>`;
      return;
    }

    let html = '';
    allJobs.forEach(job => {
      html += `
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:0.85rem 1rem; display:flex; justify-content:space-between; align-items:center; gap:0.75rem;">
          <div style="flex:1; min-width:0;">
            <div style="font-weight:700; color:#0f172a; font-size:0.95rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
              ${escapeHtml(job.title)}
            </div>
            <div style="font-size:0.8rem; color:#64748b; margin-top:2px;">
              <span style="color:#2563eb; font-weight:600;">${escapeHtml(job.department)}</span> &bull; ${escapeHtml(job.location)} &bull; <code style="font-size:0.75rem;">${escapeHtml(job.id)}</code> &bull; ${escapeHtml(job.salary || 'As per norms')}
            </div>
          </div>
          <div style="display:flex; gap:0.5rem; flex-shrink:0;">
            <button type="button" class="btn btn-outline btn-sm admin-table-edit-btn" data-job-id="${escapeHtml(job.id)}" style="font-size:0.78rem; padding:0.3rem 0.65rem;">
              Edit
            </button>
            <button type="button" class="btn btn-outline btn-sm admin-table-delete-btn" data-job-id="${escapeHtml(job.id)}" style="color:#ef4444; border-color:#fca5a5; font-size:0.78rem; padding:0.3rem 0.65rem;">
              Delete
            </button>
          </div>
        </div>
      `;
    });

    adminJobsTableContainer.innerHTML = html;

    adminJobsTableContainer.querySelectorAll('.admin-table-edit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const jid = btn.getAttribute('data-job-id');
        startEditingJobInAdmin(jid);
      });
    });

    adminJobsTableContainer.querySelectorAll('.admin-table-delete-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const jid = btn.getAttribute('data-job-id');
        const job = allJobs.find(j => j.id === jid);
        const title = job ? job.title : jid;

        if (confirm(`Are you sure you want to permanently delete "${title}" (${jid}) from the website and Supabase?`)) {
          btn.disabled = true;
          btn.innerText = 'Deleting...';

          if (typeof deleteJobOpening === 'function') {
            await deleteJobOpening(jid);
          }

          allJobs = allJobs.filter(j => j.id !== jid);
          if (typeof saveStoredJobs === 'function') {
            saveStoredJobs(allJobs);
          }

          renderAdminJobsTable();
          applyFilters();

          if (adminEditJobId && adminEditJobId.value === jid) {
            resetAdminJobForm();
          }
        }
      });
    });
  }

  // Handle Create / Edit Job Form Submit
  if (adminJobForm) {
    adminJobForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const editId = (adminEditJobId?.value || '').trim();
      const title = (adminJobTitle?.value || '').trim();
      const dept = (adminJobDept?.value || 'IT & Software Development').trim();
      const loc = (adminJobLoc?.value || 'Pune').trim();
      const type = (adminJobType?.value || 'Full-time').trim();
      const exp = (adminJobExp?.value || 'Mid Level').trim();
      const salary = (adminJobSalary?.value || '').trim();
      const desc = (adminJobDesc?.value || '').trim();
      const urgent = Boolean(adminJobUrgent?.checked);

      if (!title || !desc) {
        alert('Please fill out at least Job Title and Description.');
        return;
      }

      if (adminSaveJobBtn) {
        adminSaveJobBtn.disabled = true;
        adminSaveJobBtn.innerText = 'Saving to Supabase...';
      }

      let targetJob = null;

      if (editId) {
        const index = allJobs.findIndex(j => j.id === editId);
        if (index !== -1) {
          allJobs[index] = {
            ...allJobs[index],
            title,
            department: dept,
            location: loc,
            type,
            experience: exp,
            salary,
            description: desc,
            urgent
          };
          targetJob = allJobs[index];
        }
      } else {
        let newId;
        do {
          newId = "JOB-" + Math.floor(100 + Math.random() * 900);
        } while (allJobs.some(j => j.id === newId));

        targetJob = {
          id: newId,
          title,
          department: dept,
          location: loc,
          type,
          experience: exp,
          salary,
          postedDate: new Date().toISOString().split('T')[0],
          urgent,
          description: desc,
          responsibilities: ['Execute assigned engineering and business deliverables with high quality.'],
          requirements: ['Relevant experience in the required technological domain.']
        };

        allJobs.unshift(targetJob);
      }

      // Sync to Supabase
      if (typeof saveJobOpening === 'function' && targetJob) {
        try {
          await saveJobOpening(targetJob);
        } catch (err) {
          console.warn('[Jobs] Error syncing to Supabase:', err);
        }
      }

      if (typeof saveStoredJobs === 'function') {
        saveStoredJobs(allJobs);
      }

      if (adminSaveJobBtn) {
        adminSaveJobBtn.disabled = false;
        adminSaveJobBtn.innerText = editId ? 'Save Changes to Supabase' : 'Publish Job Opening to Supabase';
      }

      if (adminJobFeedback) {
        adminJobFeedback.style.display = 'block';
        adminJobFeedback.style.background = '#f0fdf4';
        adminJobFeedback.style.color = '#15803d';
        adminJobFeedback.style.border = '1px solid #bbf7d0';
        adminJobFeedback.innerHTML = `✓ Job <strong>"${escapeHtml(targetJob.title)}"</strong> was successfully ${editId ? 'updated' : 'published'} and saved to Supabase!`;
      }

      applyFilters();
      renderAdminJobsTable();

      setTimeout(() => {
        resetAdminJobForm();
      }, 1600);
    });
  }

  // Handle Change Admin Credentials
  if (adminChangePasswordForm) {
    adminChangePasswordForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newId = (adminNewLoginId?.value || '').trim();
      const newPassword = (adminNewPassword?.value || '').trim();

      if (!newId || newPassword.length < 6) {
        if (adminSettingsFeedback) {
          adminSettingsFeedback.style.display = 'block';
          adminSettingsFeedback.style.background = '#fef2f2';
          adminSettingsFeedback.style.color = '#dc2626';
          adminSettingsFeedback.style.border = '1px solid #fecaca';
          adminSettingsFeedback.innerText = 'Login ID cannot be empty and password must be at least 6 characters.';
        }
        return;
      }

      setAdminCredentials(newId, newPassword);
      setAdminSession(newId);
      if (adminSessionUser) adminSessionUser.innerText = newId;

      if (adminSettingsFeedback) {
        adminSettingsFeedback.style.display = 'block';
        adminSettingsFeedback.style.background = '#f0fdf4';
        adminSettingsFeedback.style.color = '#15803d';
        adminSettingsFeedback.style.border = '1px solid #bbf7d0';
        adminSettingsFeedback.innerHTML = `✓ Credentials updated successfully! Next time sign in with ID: <strong>${escapeHtml(newId)}</strong>.`;
      }

      adminChangePasswordForm.reset();
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
});
