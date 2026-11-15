/**
 * Shivtej Placement Services - Interactive Job Board & In-Browser Job Manager (CMS)
 * 100% Frontend-driven, Netlify compatible, with live Supabase Database integration
 * for storing & editing Job Openings, plus candidate application handling.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initial State from localStorage / default catalog
  let allJobs = typeof getStoredJobs === 'function' ? getStoredJobs() : [];

  // DOM Elements - Job Board
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

  // DOM Elements - Recruiter Admin Manager
  const openAdminBtn = document.getElementById('openJobAdminBtn');
  const adminModal = document.getElementById('jobAdminModal');
  const closeAdminBtn = document.getElementById('closeJobAdminBtn');
  const createJobForm = document.getElementById('createJobForm') || document.getElementById('addNewJobForm');
  const adminJobListContainer = document.getElementById('adminJobList');
  const adminJobCountEl = document.getElementById('adminJobCount');
  const editJobIdInput = document.getElementById('editJobId');
  const adminFormModeTitle = document.getElementById('adminFormModeTitle');
  const editingBadge = document.getElementById('editingBadge');
  const saveJobBtn = document.getElementById('saveJobBtn');
  const cancelEditJobBtn = document.getElementById('cancelEditJobBtn');
  const createJobStatus = document.getElementById('createJobStatus');

  let currentFilteredJobs = [...allJobs];

  // --------------------------------------------------------------------------
  // 1. Render Job Listings on Public Board
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
      if (clearBtn) {
        clearBtn.addEventListener('click', clearFilters);
      }
      if (jobCountEl) jobCountEl.innerText = '0';
      return;
    }

    if (jobCountEl) {
      jobCountEl.innerText = `${jobsToRender.length}`;
    }

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

    // Attach click listeners to view detail / apply buttons
    jobListContainer.querySelectorAll('.view-job-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const jobId = btn.getAttribute('data-job-id');
        openApplyModal(jobId);
      });
    });
  }

  // --------------------------------------------------------------------------
  // 2. Dynamic Fetch from Supabase (Database Sync)
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
          if (adminModal && adminModal.classList.contains('active')) {
            renderAdminJobList();
          }
        }
      } catch (err) {
        console.warn('[Jobs] Error syncing from Supabase:', err);
      }
    }
  }

  // Initial render with cached/default data, then sync live from Supabase
  renderJobs(allJobs);
  syncJobsFromSupabase();

  // --------------------------------------------------------------------------
  // 3. Filter System
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
  // 4. Candidate Application Modal
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

  // Handle Resume Application via WhatsApp or Email
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
      applyModalStatus.innerText = 'Logging application request to Supabase database...';
    }

    // Store candidate application request into Supabase
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
      applyModalStatus.innerText = `✓ Application request recorded in database! Opening ${channel === 'whatsapp' ? 'WhatsApp' : 'your Email'} to send CV...`;
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
  // 5. In-Browser Recruiter Admin Manager (Create, Edit, Delete with Supabase)
  // --------------------------------------------------------------------------
  if (openAdminBtn) {
    openAdminBtn.addEventListener('click', () => {
      if (adminModal) {
        adminModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        resetAdminForm();
        renderAdminJobList();
      }
    });
  }

  function closeAdminModal() {
    if (adminModal) {
      adminModal.classList.remove('active');
      document.body.style.overflow = 'auto';
      resetAdminForm();
    }
  }

  if (closeAdminBtn) closeAdminBtn.addEventListener('click', closeAdminModal);
  if (adminModal) {
    adminModal.addEventListener('click', (e) => {
      if (e.target === adminModal) closeAdminModal();
    });
  }

  function resetAdminForm() {
    if (createJobForm) createJobForm.reset();
    if (editJobIdInput) editJobIdInput.value = '';
    if (adminFormModeTitle) adminFormModeTitle.innerText = 'Add New Job Opening';
    if (editingBadge) editingBadge.style.display = 'none';
    if (saveJobBtn) saveJobBtn.innerText = 'Publish Job Opening';
    if (cancelEditJobBtn) cancelEditJobBtn.style.display = 'none';
    if (createJobStatus) {
      createJobStatus.innerHTML = '';
      createJobStatus.style.display = 'none';
    }
  }

  if (cancelEditJobBtn) {
    cancelEditJobBtn.addEventListener('click', resetAdminForm);
  }

  function startEditingJob(jobId) {
    const job = allJobs.find(j => j.id === jobId);
    if (!job) return;

    if (editJobIdInput) editJobIdInput.value = job.id;
    const titleInput = document.getElementById('newJobTitle');
    const deptInput = document.getElementById('newJobDept');
    const locInput = document.getElementById('newJobLoc');
    const typeInput = document.getElementById('newJobType');
    const expInput = document.getElementById('newJobExp');
    const salaryInput = document.getElementById('newJobSalary');
    const descInput = document.getElementById('newJobDesc');
    const urgentInput = document.getElementById('newJobUrgent');

    if (titleInput) titleInput.value = job.title || '';
    if (deptInput) deptInput.value = job.department || 'IT & Software Development';
    if (locInput) locInput.value = job.location || 'Pune';
    if (typeInput) typeInput.value = job.type || 'Full-time';
    if (expInput) expInput.value = job.experience || '';
    if (salaryInput) salaryInput.value = job.salary || '';
    if (descInput) descInput.value = job.description || '';
    if (urgentInput) urgentInput.checked = Boolean(job.urgent);

    if (adminFormModeTitle) adminFormModeTitle.innerText = `Edit Opening: ${job.title.substring(0, 32)}...`;
    if (editingBadge) editingBadge.style.display = 'inline-block';
    if (saveJobBtn) saveJobBtn.innerText = 'Save Changes (Update in Supabase)';
    if (cancelEditJobBtn) cancelEditJobBtn.style.display = 'block';

    if (createJobStatus) {
      createJobStatus.style.display = 'block';
      createJobStatus.style.background = '#eff6ff';
      createJobStatus.style.color = '#1e40af';
      createJobStatus.style.border = '1px solid #bfdbfe';
      createJobStatus.style.padding = '0.5rem 0.75rem';
      createJobStatus.style.borderRadius = '6px';
      createJobStatus.style.fontSize = '0.85rem';
      createJobStatus.innerHTML = `Editing job <strong>${escapeHtml(job.id)}</strong>. Modify fields and click "Save Changes".`;
    }

    createJobForm?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function renderAdminJobList() {
    if (!adminJobListContainer) return;
    if (adminJobCountEl) adminJobCountEl.innerText = `${allJobs.length}`;

    if (allJobs.length === 0) {
      adminJobListContainer.innerHTML = `<p style="color: #94a3b8; padding: 1rem;">No jobs listed currently.</p>`;
      return;
    }

    let html = '';
    allJobs.forEach(job => {
      html += `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:0.75rem 0.5rem; border-bottom:1px solid #e2e8f0; gap:0.5rem;">
          <div style="flex:1; min-width:0;">
            <div style="font-weight:600; color:#0f172a; font-size:0.92rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
              ${escapeHtml(job.title)}
            </div>
            <div style="font-size:0.78rem; color:#64748b; margin-top:2px;">
              <span style="color:#2563eb; font-weight:500;">${escapeHtml(job.department)}</span> • ${escapeHtml(job.location)} • <span style="font-family:monospace;">${escapeHtml(job.id)}</span>
            </div>
          </div>
          <div style="display:flex; gap:0.4rem; flex-shrink:0;">
            <button type="button" class="btn btn-outline btn-sm edit-job-btn" data-job-id="${escapeHtml(job.id)}" style="padding:0.25rem 0.6rem; font-size:0.75rem; border-color:#94a3b8; color:#334155;">
              Edit
            </button>
            <button type="button" class="btn btn-outline btn-sm delete-job-btn" data-job-id="${escapeHtml(job.id)}" style="color: #ef4444; border-color: #fca5a5; padding:0.25rem 0.6rem; font-size:0.75rem;">
              Delete
            </button>
          </div>
        </div>
      `;
    });

    adminJobListContainer.innerHTML = html;

    // Attach Edit button listeners
    adminJobListContainer.querySelectorAll('.edit-job-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const jid = btn.getAttribute('data-job-id');
        startEditingJob(jid);
      });
    });

    // Attach Delete button listeners
    adminJobListContainer.querySelectorAll('.delete-job-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const jid = btn.getAttribute('data-job-id');
        const job = allJobs.find(j => j.id === jid);
        const jobTitle = job ? job.title : jid;

        if (confirm(`Are you sure you want to delete "${jobTitle}"? This will delete it from the website and Supabase database.`)) {
          btn.disabled = true;
          btn.innerText = 'Deleting...';

          if (typeof deleteJobOpening === 'function') {
            await deleteJobOpening(jid);
          }

          allJobs = allJobs.filter(j => j.id !== jid);
          if (typeof saveStoredJobs === 'function') {
            saveStoredJobs(allJobs);
          }

          renderAdminJobList();
          applyFilters();

          if (editJobIdInput && editJobIdInput.value === jid) {
            resetAdminForm();
          }
        }
      });
    });
  }

  // Handle New Job or Edit Submission from Recruiter Form
  if (createJobForm) {
    createJobForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const editId = (editJobIdInput ? editJobIdInput.value : '').trim();
      const title = (document.getElementById('newJobTitle')?.value || '').trim();
      const dept = (document.getElementById('newJobDept')?.value || 'IT & Software Development').trim();
      const loc = (document.getElementById('newJobLoc')?.value || 'Pune').trim();
      const type = (document.getElementById('newJobType')?.value || 'Full-time').trim();
      const exp = (document.getElementById('newJobExp')?.value || 'Mid Level').trim();
      const salary = (document.getElementById('newJobSalary')?.value || '').trim();
      const desc = (document.getElementById('newJobDesc')?.value || '').trim();
      const urgent = Boolean(document.getElementById('newJobUrgent')?.checked);

      if (!title || !desc) {
        alert('Please provide at least a Job Title and Description.');
        return;
      }

      if (saveJobBtn) {
        saveJobBtn.disabled = true;
        saveJobBtn.innerText = 'Saving to database...';
      }

      let targetJob = null;

      if (editId) {
        // Update existing job
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
        // Create new job
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

      // 1. Sync to Supabase table `job_openings`
      if (typeof saveJobOpening === 'function' && targetJob) {
        try {
          await saveJobOpening(targetJob);
        } catch (err) {
          console.warn('[Jobs] Error syncing job to Supabase:', err);
        }
      }

      // 2. Persist locally
      if (typeof saveStoredJobs === 'function') {
        saveStoredJobs(allJobs);
      }

      if (saveJobBtn) {
        saveJobBtn.disabled = false;
      }

      if (createJobStatus) {
        createJobStatus.style.display = 'block';
        createJobStatus.style.background = '#f0fdf4';
        createJobStatus.style.color = '#15803d';
        createJobStatus.style.border = '1px solid #bbf7d0';
        createJobStatus.style.padding = '0.75rem';
        createJobStatus.style.borderRadius = '6px';
        createJobStatus.style.fontSize = '0.9rem';
        createJobStatus.innerHTML = `✓ Job <strong>"${escapeHtml(targetJob.title)}"</strong> was successfully ${editId ? 'updated' : 'published'} and saved to Supabase!`;
      }

      renderAdminJobList();
      applyFilters();

      setTimeout(() => {
        resetAdminForm();
      }, 1800);
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
