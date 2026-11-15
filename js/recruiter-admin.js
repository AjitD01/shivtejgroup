/**
 * Shivtej Placement Services - Recruiter Admin Console Logic
 * Dedicated to creating, editing, and managing job openings with ID/Password authentication.
 */

document.addEventListener('DOMContentLoaded', () => {
  let allJobs = typeof getStoredJobs === 'function' ? getStoredJobs() : [];

  // Screens
  const authScreen = document.getElementById('authScreen');
  const dashboardScreen = document.getElementById('dashboardScreen');
  const currentAdminName = document.getElementById('currentAdminName');

  // Auth Elements
  const recruiterLoginForm = document.getElementById('recruiterLoginForm');
  const loginIdInput = document.getElementById('loginId');
  const loginPasswordInput = document.getElementById('loginPassword');
  const loginFeedback = document.getElementById('loginFeedback');
  const adminSignOutBtn = document.getElementById('adminSignOutBtn');

  // Tabs
  const tabPostJob = document.getElementById('tabPostJob');
  const tabManageJobs = document.getElementById('tabManageJobs');
  const tabSettings = document.getElementById('tabSettings');
  const panelPostJob = document.getElementById('panelPostJob');
  const panelManageJobs = document.getElementById('panelManageJobs');
  const panelSettings = document.getElementById('panelSettings');

  // Form Elements
  const jobOpeningForm = document.getElementById('jobOpeningForm');
  const editOpeningId = document.getElementById('editOpeningId');
  const formModeHeading = document.getElementById('formModeHeading');
  const editingIndicator = document.getElementById('editingIndicator');
  const jobTitleInput = document.getElementById('jobTitleInput');
  const jobPositionsInput = document.getElementById('jobPositionsInput');
  const jobDeptSelect = document.getElementById('jobDeptSelect');
  const jobLocInput = document.getElementById('jobLocInput');
  const jobTypeSelect = document.getElementById('jobTypeSelect');
  const jobExpInput = document.getElementById('jobExpInput');
  const jobSalaryInput = document.getElementById('jobSalaryInput');
  const jobDescText = document.getElementById('jobDescText');
  const jobUrgentCheck = document.getElementById('jobUrgentCheck');
  const saveOpeningBtn = document.getElementById('saveOpeningBtn');
  const cancelEditBtn = document.getElementById('cancelEditBtn');
  const formFeedback = document.getElementById('formFeedback');

  // List & Settings Elements
  const openingsListContainer = document.getElementById('openingsListContainer');
  const totalOpeningsCount = document.getElementById('totalOpeningsCount');
  const refreshListBtn = document.getElementById('refreshListBtn');
  const changePasswordForm = document.getElementById('changePasswordForm');
  const newLoginId = document.getElementById('newLoginId');
  const newPassword = document.getElementById('newPassword');
  const settingsFeedback = document.getElementById('settingsFeedback');

  // --------------------------------------------------------------------------
  // 1. Authentication System
  // --------------------------------------------------------------------------
  function getCredentials() {
    try {
      const stored = localStorage.getItem('shivtej_admin_creds');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return { loginId: 'admin', password: 'Shivtej@2025' };
  }

  function setCredentials(id, pass) {
    localStorage.setItem('shivtej_admin_creds', JSON.stringify({ loginId: id, password: pass }));
  }

  function isAuthenticated() {
    return sessionStorage.getItem('shivtej_recruiter_auth') === 'true';
  }

  function setSession(user) {
    sessionStorage.setItem('shivtej_recruiter_auth', 'true');
    sessionStorage.setItem('shivtej_recruiter_user', user);
  }

  function clearSession() {
    sessionStorage.removeItem('shivtej_recruiter_auth');
    sessionStorage.removeItem('shivtej_recruiter_user');
  }

  function updateView() {
    if (isAuthenticated()) {
      authScreen.style.display = 'none';
      dashboardScreen.style.display = 'block';
      const user = sessionStorage.getItem('shivtej_recruiter_user') || 'admin';
      if (currentAdminName) currentAdminName.innerText = user;
      loadJobsFromDatabase();
    } else {
      authScreen.style.display = 'block';
      dashboardScreen.style.display = 'none';
      loginIdInput?.focus();
    }
  }

  // Handle Login
  if (recruiterLoginForm) {
    recruiterLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const enteredId = (loginIdInput?.value || '').trim();
      const enteredPass = (loginPasswordInput?.value || '').trim();
      const creds = getCredentials();

      if (enteredId === creds.loginId && enteredPass === creds.password) {
        setSession(enteredId);
        updateView();
      } else {
        if (loginFeedback) {
          loginFeedback.style.display = 'block';
          loginFeedback.style.background = '#fef2f2';
          loginFeedback.style.color = '#dc2626';
          loginFeedback.style.border = '1px solid #fecaca';
          loginFeedback.innerHTML = '<strong>Invalid Credentials:</strong> Login ID or Password is incorrect.';
        }
      }
    });
  }

  // Handle Logout
  if (adminSignOutBtn) {
    adminSignOutBtn.addEventListener('click', () => {
      clearSession();
      updateView();
      alert('You have successfully signed out.');
    });
  }

  // --------------------------------------------------------------------------
  // 2. Tab Navigation
  // --------------------------------------------------------------------------
  function switchTab(tab) {
    if (tabPostJob) tabPostJob.classList.toggle('active', tab === 'post');
    if (tabManageJobs) tabManageJobs.classList.toggle('active', tab === 'manage');
    if (tabSettings) tabSettings.classList.toggle('active', tab === 'settings');

    if (panelPostJob) panelPostJob.style.display = tab === 'post' ? 'block' : 'none';
    if (panelManageJobs) {
      panelManageJobs.style.display = tab === 'manage' ? 'block' : 'none';
      if (tab === 'manage') renderOpeningsList();
    }
    if (panelSettings) panelSettings.style.display = tab === 'settings' ? 'block' : 'none';
  }

  if (tabPostJob) tabPostJob.addEventListener('click', () => switchTab('post'));
  if (tabManageJobs) tabManageJobs.addEventListener('click', () => switchTab('manage'));
  if (tabSettings) tabSettings.addEventListener('click', () => switchTab('settings'));
  if (refreshListBtn) refreshListBtn.addEventListener('click', () => loadJobsFromDatabase());

  // --------------------------------------------------------------------------
  // 3. Database Sync & Render
  // --------------------------------------------------------------------------
  async function loadJobsFromDatabase() {
    if (typeof fetchJobOpenings === 'function') {
      try {
        const dbJobs = await fetchJobOpenings();
        if (Array.isArray(dbJobs) && dbJobs.length > 0) {
          allJobs = dbJobs.map(dbJob => {
            const localMatch = allJobs.find(lj => lj.id === dbJob.id);
            return {
              ...dbJob,
              positions: (dbJob.positions && dbJob.positions > 1) 
                ? dbJob.positions 
                : (localMatch?.positions || dbJob.positions || 1)
            };
          });
          if (typeof saveStoredJobs === 'function') saveStoredJobs(allJobs);
        }
      } catch (err) {
        console.warn('Error loading jobs:', err);
      }
    }
    renderOpeningsList();
  }

  function renderOpeningsList() {
    if (!openingsListContainer) return;
    if (totalOpeningsCount) totalOpeningsCount.innerText = `${allJobs.length}`;

    if (allJobs.length === 0) {
      openingsListContainer.innerHTML = `<p style="color: #94a3b8; padding: 2rem; text-align: center;">No job openings found in Supabase.</p>`;
      return;
    }

    let html = '';
    allJobs.forEach(job => {
      const positionsCount = Number(job.positions) || 1;
      const positionsBadge = positionsCount > 1 ? `${positionsCount} Openings` : '1 Opening';

      html += `
        <div class="job-admin-row">
          <div style="flex: 1; min-width: 0;">
            <div style="font-weight: 700; color: #0f172a; font-size: 1rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              ${escapeHtml(job.title)}
            </div>
            <div style="font-size: 0.82rem; color: #64748b; margin-top: 3px; display: flex; flex-wrap: wrap; align-items: center; gap: 6px;">
              <span style="color: #2563eb; font-weight: 600;">${escapeHtml(job.department)}</span> &bull; 
              <span style="background: #fff7ed; color: #c2410c; padding: 1px 7px; border-radius: 4px; font-weight: 700; font-size: 0.78rem; border: 1px solid #fed7aa;">${positionsBadge}</span> &bull;
              <span>${escapeHtml(job.location)}</span> &bull; 
              <code>${escapeHtml(job.id)}</code> &bull; 
              <span>${escapeHtml(job.salary || 'As per norms')}</span>
            </div>
          </div>
          <div style="display: flex; gap: 0.5rem; flex-shrink: 0;">
            <button type="button" class="btn btn-outline btn-sm edit-job-row-btn" data-job-id="${escapeHtml(job.id)}" style="font-size: 0.8rem; padding: 0.35rem 0.75rem;">
              Edit
            </button>
            <button type="button" class="btn btn-outline btn-sm delete-job-row-btn" data-job-id="${escapeHtml(job.id)}" style="color: #ef4444; border-color: #fca5a5; font-size: 0.8rem; padding: 0.35rem 0.75rem;">
              Delete
            </button>
          </div>
        </div>
      `;
    });

    openingsListContainer.innerHTML = html;

    // Attach Edit Listeners
    openingsListContainer.querySelectorAll('.edit-job-row-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const jid = btn.getAttribute('data-job-id');
        startEditing(jid);
      });
    });

    // Attach Delete Listeners
    openingsListContainer.querySelectorAll('.delete-job-row-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const jid = btn.getAttribute('data-job-id');
        const job = allJobs.find(j => j.id === jid);
        const title = job ? job.title : jid;

        if (confirm(`Are you sure you want to permanently delete "${title}" (${jid}) from Supabase?`)) {
          btn.disabled = true;
          btn.innerText = 'Deleting...';

          if (typeof deleteJobOpening === 'function') {
            await deleteJobOpening(jid);
          }

          allJobs = allJobs.filter(j => j.id !== jid);
          if (typeof saveStoredJobs === 'function') saveStoredJobs(allJobs);
          renderOpeningsList();

          if (editOpeningId && editOpeningId.value === jid) {
            resetForm();
          }
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 4. Create & Edit Job Openings
  // --------------------------------------------------------------------------
  function resetForm() {
    if (jobOpeningForm) jobOpeningForm.reset();
    if (editOpeningId) editOpeningId.value = '';
    if (jobPositionsInput) jobPositionsInput.value = '1';
    if (formModeHeading) formModeHeading.innerText = 'Create New Job Vacancy';
    if (editingIndicator) editingIndicator.style.display = 'none';
    if (saveOpeningBtn) saveOpeningBtn.innerText = 'Publish Job Opening to Supabase';
    if (cancelEditBtn) cancelEditBtn.style.display = 'none';
    if (formFeedback) {
      formFeedback.style.display = 'none';
      formFeedback.innerHTML = '';
    }
  }

  if (cancelEditBtn) cancelEditBtn.addEventListener('click', resetForm);

  function startEditing(jobId) {
    const job = allJobs.find(j => j.id === jobId);
    if (!job) return;

    switchTab('post');
    if (editOpeningId) editOpeningId.value = job.id;
    if (jobTitleInput) jobTitleInput.value = job.title || '';
    if (jobPositionsInput) jobPositionsInput.value = job.positions || 1;
    if (jobDeptSelect) jobDeptSelect.value = job.department || 'IT & Software Development';
    if (jobLocInput) jobLocInput.value = job.location || 'Pune';
    if (jobTypeSelect) jobTypeSelect.value = job.type || 'Full-time';
    if (jobExpInput) jobExpInput.value = job.experience || '';
    if (jobSalaryInput) jobSalaryInput.value = job.salary || '';
    if (jobDescText) jobDescText.value = job.description || '';
    if (jobUrgentCheck) jobUrgentCheck.checked = Boolean(job.urgent);

    if (formModeHeading) formModeHeading.innerText = `Edit Job Vacancy: ${job.title.substring(0, 35)}...`;
    if (editingIndicator) editingIndicator.style.display = 'inline-block';
    if (saveOpeningBtn) saveOpeningBtn.innerText = 'Save Changes to Supabase';
    if (cancelEditBtn) cancelEditBtn.style.display = 'inline-block';

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Form Submit (Create or Update)
  if (jobOpeningForm) {
    jobOpeningForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const editId = (editOpeningId?.value || '').trim();
      const title = (jobTitleInput?.value || '').trim();
      const positions = parseInt(jobPositionsInput?.value, 10) || 1;
      const dept = (jobDeptSelect?.value || 'IT & Software Development').trim();
      const loc = (jobLocInput?.value || 'Pune').trim();
      const type = (jobTypeSelect?.value || 'Full-time').trim();
      const exp = (jobExpInput?.value || 'Mid Level').trim();
      const salary = (jobSalaryInput?.value || '').trim();
      const desc = (jobDescText?.value || '').trim();
      const urgent = Boolean(jobUrgentCheck?.checked);

      if (!title || !desc) {
        alert('Please fill out Title and Description.');
        return;
      }

      if (saveOpeningBtn) {
        saveOpeningBtn.disabled = true;
        saveOpeningBtn.innerText = 'Syncing to Supabase...';
      }

      let targetJob = null;

      if (editId) {
        const index = allJobs.findIndex(j => j.id === editId);
        if (index !== -1) {
          allJobs[index] = {
            ...allJobs[index],
            title,
            positions,
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
          positions,
          department: dept,
          location: loc,
          type,
          experience: exp,
          salary,
          postedDate: new Date().toISOString().split('T')[0],
          urgent,
          description: desc,
          responsibilities: ['Execute assigned deliverables with high quality.'],
          requirements: ['Relevant experience in domain.']
        };

        allJobs.unshift(targetJob);
      }

      // Save to Supabase
      if (typeof saveJobOpening === 'function' && targetJob) {
        try {
          await saveJobOpening(targetJob);
        } catch (err) {
          console.warn('Error saving to Supabase:', err);
        }
      }

      if (typeof saveStoredJobs === 'function') saveStoredJobs(allJobs);

      if (saveOpeningBtn) {
        saveOpeningBtn.disabled = false;
        saveOpeningBtn.innerText = editId ? 'Save Changes to Supabase' : 'Publish Job Opening to Supabase';
      }

      if (formFeedback) {
        formFeedback.style.display = 'block';
        formFeedback.style.background = '#f0fdf4';
        formFeedback.style.color = '#15803d';
        formFeedback.style.border = '1px solid #bbf7d0';
        formFeedback.innerHTML = `✓ Job <strong>"${escapeHtml(targetJob.title)}"</strong> (${targetJob.positions > 1 ? `${targetJob.positions} Openings` : '1 Opening'}) was successfully ${editId ? 'updated' : 'published'} in Supabase database!`;
      }

      renderOpeningsList();

      setTimeout(() => {
        resetForm();
      }, 1600);
    });
  }

  // --------------------------------------------------------------------------
  // 5. Change Password Form
  // --------------------------------------------------------------------------
  if (changePasswordForm) {
    changePasswordForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newIdVal = (newLoginId?.value || '').trim();
      const newPassVal = (newPassword?.value || '').trim();

      if (!newIdVal || newPassVal.length < 6) {
        if (settingsFeedback) {
          settingsFeedback.style.display = 'block';
          settingsFeedback.style.background = '#fef2f2';
          settingsFeedback.style.color = '#dc2626';
          settingsFeedback.style.border = '1px solid #fecaca';
          settingsFeedback.innerText = 'Login ID cannot be empty and password must be at least 6 characters.';
        }
        return;
      }

      setCredentials(newIdVal, newPassVal);
      setSession(newIdVal);
      if (currentAdminName) currentAdminName.innerText = newIdVal;

      if (settingsFeedback) {
        settingsFeedback.style.display = 'block';
        settingsFeedback.style.background = '#f0fdf4';
        settingsFeedback.style.color = '#15803d';
        settingsFeedback.style.border = '1px solid #bbf7d0';
        settingsFeedback.innerHTML = `✓ Credentials updated! Next time log in with ID: <strong>${escapeHtml(newIdVal)}</strong>.`;
      }

      changePasswordForm.reset();
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

  // Initial View
  updateView();
});
