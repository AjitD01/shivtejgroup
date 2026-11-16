/**
 * Shivtej Placement Services - Public Job Board & Application System
 * 
 * Features:
 * 1. Dynamically fetches verified active job openings from Supabase database (`job_openings`).
 * 2. Executive real-time search & filtering with popular sector pills.
 * 3. Elevated recruitment card UI with vacancies badges, tech stack tags, and salary chips.
 * 4. Secure candidate application modal that saves incoming applications to Supabase (`job_applications`)
 *    and launches WhatsApp / Email with pre-filled application details.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initial State from localStorage / default catalog
  let allJobs = typeof getStoredJobs === 'function' ? getStoredJobs() : [];

  // DOM Elements - Public Job Board
  const jobListContainer = document.getElementById('jobsListContainer') || document.getElementById('jobListingsingsContainer');
  const jobCountEl = document.getElementById('jobsCountBadge') || document.getElementById('jobCountBadge');
  const searchInput = document.getElementById('jobSearchInput');
  const locationFilter = document.getElementById('filterLocation');
  const departmentFilter = document.getElementById('filterDepartment');
  const typeFilter = document.getElementById('filterType');
  const searchSubmitBtn = document.getElementById('searchSubmitBtn');
  const quickPills = document.querySelectorAll('.quick-pill');

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

  let currentFilteredJobs = [...allJobs];
  let filterUrgentOnly = false;

  // --------------------------------------------------------------------------
  // 1. Render Job Listings on Public Board
  // --------------------------------------------------------------------------
  function renderJobs(jobsToRender) {
    if (!jobListContainer) return;

    if (jobsToRender.length === 0) {
      jobListContainer.innerHTML = `
        <div class="empty-jobs-box" style="text-align: center; padding: 3.5rem 1.5rem; background: #ffffff; border-radius: 14px; border: 1px dashed #cbd5e1; grid-column: 1 / -1; box-shadow: 0 4px 12px rgba(0,0,0,0.02);">
          <svg class="ui-icon ui-icon-lg" style="margin: 0 auto 1rem; color: #94a3b8; width: 44px; height: 44px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
          <h4 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin-bottom: 0.5rem;">No active openings match your exact criteria</h4>
          <p style="color: #64748b; font-size: 0.95rem; max-width: 480px; margin: 0 auto 1.5rem; line-height: 1.6;">Try clearing your filters or search keywords, or submit your resume directly below to our talent pool for immediate recruiter matching.</p>
          <button class="btn btn-outline btn-sm" id="clearAllFiltersBtn" style="font-weight: 600;">Clear All Filters</button>
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
      const deptLower = (job.department || '').toLowerCase();
      let deptClass = 'dept-other';
      if (deptLower.includes('it') || deptLower.includes('software')) deptClass = 'dept-it';
      else if (deptLower.includes('embedded') || deptLower.includes('engineering')) deptClass = 'dept-eng';
      else if (deptLower.includes('mfg') || deptLower.includes('manufacturing') || deptLower.includes('tooling')) deptClass = 'dept-mfg';
      else if (deptLower.includes('quality') || deptLower.includes('qa')) deptClass = 'dept-qa';

      const positions = Number(job.positions) || 1;
      const positionsText = positions > 1 ? `${positions} Openings` : '1 Opening';
      const skills = Array.isArray(job.skills) && job.skills.length > 0 ? job.skills : [];

      html += `
        <article class="job-card" data-job-id="${escapeHtml(job.id)}">
          <div class="job-card-top-row">
            <span class="job-dept-chip ${deptClass}">
              ${escapeHtml(job.department)}
            </span>
            <div class="job-badges-group">
              ${job.urgent ? `
                <span class="job-urgent-pill" title="Immediate client requirement">
                  Urgent Requirement
                </span>` : ''}
              <span class="job-vacancies-pill" title="${positions} verified open positions">
                <svg class="ui-icon ui-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" style="width:12px;height:12px;"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                ${positionsText}
              </span>
            </div>
          </div>

          <h3 class="job-card-title">${escapeHtml(job.title)}</h3>
          <div class="job-company-location">
            <svg class="ui-icon ui-icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            <span>Client Partner &bull; ${escapeHtml(job.location)}</span>
          </div>

          <div class="job-specs-grid">
            <span class="job-spec-pill">
              ${escapeHtml(job.type || 'Full-time')}
            </span>
            <span class="job-spec-pill">
              ${escapeHtml(job.experience || 'Mid Level')}
            </span>
            ${job.salary ? `
            <span class="job-spec-pill salary-pill">
              ${escapeHtml(job.salary)}
            </span>` : ''}
          </div>

          ${skills.length > 0 ? `
          <div class="job-skills-list">
            ${skills.map(s => `<span class="job-skill-chip">${escapeHtml(s)}</span>`).join('')}
          </div>` : ''}

          <p class="job-card-desc">${escapeHtml(job.description)}</p>

          <div class="job-card-actions">
            <button class="btn-job-apply view-job-btn" data-job-id="${escapeHtml(job.id)}">
              Apply for Position
            </button>
            <a href="https://wa.me/918805521152?text=Hello%20Shivtej%20Placement%20Team%2C%20I%20am%20interested%20in%20applying%20for%20${encodeURIComponent(job.title)}%20(Ref%3A%20${encodeURIComponent(job.id)})" target="_blank" rel="noopener noreferrer" class="btn-job-whatsapp" title="Inquire via WhatsApp">
              <svg class="ui-icon ui-icon-xs" viewBox="0 0 24 24" fill="currentColor" style="width:14px;height:14px;"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2z"/></svg>
              WhatsApp
            </a>
          </div>
              WhatsApp
            </a>
          </div>
        </article>
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
  // 2. Dynamic Sync from Supabase
  // --------------------------------------------------------------------------
  async function syncJobsFromSupabase() {
    if (typeof fetchJobOpenings === 'function') {
      try {
        const dbJobs = await fetchJobOpenings();
        if (Array.isArray(dbJobs) && dbJobs.length > 0) {
          allJobs = dbJobs.map(dbJob => {
            const localMatch = allJobs.find(lj => lj.id === dbJob.id);
            return {
              ...dbJob,
              skills: (Array.isArray(dbJob.skills) && dbJob.skills.length > 0) ? dbJob.skills : (localMatch?.skills || []),
              positions: (dbJob.positions && Number(dbJob.positions) > 0) 
                ? Number(dbJob.positions) 
                : (localMatch?.positions || 1)
            };
          });
          if (typeof saveStoredJobs === 'function') {
            saveStoredJobs(allJobs);
          }
          applyFilters();
        }
      } catch (err) {
        console.warn('[Jobs] Error syncing from Supabase:', err);
      }
    }
  }

  renderJobs(allJobs);
  syncJobsFromSupabase();

  // --------------------------------------------------------------------------
  // 3. Filtering System
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
      const location = (job.location || '').toLowerCase();
      const skillsStr = Array.isArray(job.skills) ? job.skills.join(' ').toLowerCase() : '';

      const matchQuery = !query ||
        title.includes(query) ||
        desc.includes(query) ||
        department.includes(query) ||
        skillsStr.includes(query);

      const matchLoc = !loc || location.includes(loc.toLowerCase());
      const matchDept = !dept || job.department === dept;
      const matchType = !type || job.type === type;
      const matchUrgent = !filterUrgentOnly || Boolean(job.urgent);

      return matchQuery && matchLoc && matchDept && matchType && matchUrgent;
    });

    renderJobs(currentFilteredJobs);
  }

  function clearFilters() {
    if (searchInput) searchInput.value = '';
    if (locationFilter) locationFilter.value = '';
    if (departmentFilter) departmentFilter.value = '';
    if (typeFilter) typeFilter.value = '';
    filterUrgentOnly = false;

    quickPills.forEach(p => p.classList.remove('active'));
    const defaultAllPill = document.querySelector('.quick-pill[data-dept=""]');
    if (defaultAllPill) defaultAllPill.classList.add('active');

    applyFilters();
  }

  if (searchInput) searchInput.addEventListener('input', applyFilters);
  if (locationFilter) locationFilter.addEventListener('change', applyFilters);
  if (departmentFilter) departmentFilter.addEventListener('change', applyFilters);
  if (typeFilter) typeFilter.addEventListener('change', applyFilters);

  if (searchSubmitBtn) {
    searchSubmitBtn.addEventListener('click', () => {
      applyFilters();
      const target = document.getElementById('jobsResultsSection') || jobListContainer;
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // Quick Filter Pills Event Listeners
  quickPills.forEach(pill => {
    pill.addEventListener('click', () => {
      quickPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      if (pill.dataset.urgent === 'true') {
        filterUrgentOnly = true;
        if (departmentFilter) departmentFilter.value = '';
      } else {
        filterUrgentOnly = false;
        const targetDept = pill.dataset.dept || '';
        if (departmentFilter) departmentFilter.value = targetDept;
      }

      applyFilters();
    });
  });

  // --------------------------------------------------------------------------
  // 4. Candidate Application Modal System
  // --------------------------------------------------------------------------
  function openApplyModal(jobId) {
    const job = allJobs.find(j => j.id === jobId);
    if (!job || !applyModal) return;

    const positions = Number(job.positions) || 1;
    const positionsText = positions > 1 ? `${positions} Openings` : '1 Opening';

    if (applyModalTitle) applyModalTitle.innerText = `Apply for: ${job.title}`;
    if (applyJobDept) applyJobDept.innerText = `${job.department} • Ref: ${job.id} • ${positionsText}`;
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
