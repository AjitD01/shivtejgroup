/**
 * Shivtej Placement Services - Supabase Client Integration
 * 
 * Manages:
 * 1. Job Openings / Vacancies (fetch, add, edit, delete in real-time with Supabase)
 * 2. Candidate Job Application Requests (stored in Supabase, response via WhatsApp/Email)
 */

window.SUPABASE_CONFIG = window.SUPABASE_CONFIG || {
  url: 'https://oyqtaytychzjhxlzbnyf.supabase.co',
  anonKey: 'sb_publishable_8MAnTZ6SIgIRv8oE6WUSAA_JGgEp9lt'
};

let supabaseClient = null;

function getSupabaseClient() {
  if (supabaseClient) return supabaseClient;

  const url = window.SUPABASE_CONFIG.url;
  const key = window.SUPABASE_CONFIG.anonKey;

  const isValidUrl = url && url.startsWith('https://') && !url.includes('YOUR_PROJECT_ID');
  const isValidKey = key && key !== 'YOUR_SUPABASE_ANON_KEY' && key.length > 20;

  if (isValidUrl && isValidKey && window.supabase && typeof window.supabase.createClient === 'function') {
    try {
      supabaseClient = window.supabase.createClient(url, key);
      console.log('[Supabase] Initialized successfully for:', url);
    } catch (e) {
      console.error('[Supabase] Initialization failed:', e);
    }
  }

  return supabaseClient;
}

function isSupabaseConfigured() {
  return getSupabaseClient() !== null;
}

// ----------------------------------------------------------------------------
// Job Openings Management (Supabase)
// ----------------------------------------------------------------------------

function mapSupabaseJobToApp(item) {
  let responsibilities = [];
  try {
    responsibilities = Array.isArray(item.responsibilities) 
      ? item.responsibilities 
      : (typeof item.responsibilities === 'string' ? JSON.parse(item.responsibilities || '[]') : []);
  } catch (e) {
    responsibilities = [];
  }

  let requirements = [];
  try {
    requirements = Array.isArray(item.requirements) 
      ? item.requirements 
      : (typeof item.requirements === 'string' ? JSON.parse(item.requirements || '[]') : []);
  } catch (e) {
    requirements = [];
  }

  let parsedPositions = item.positions ? Number(item.positions) : null;
  const rawDesc = item.description || '';
  if (!parsedPositions && rawDesc) {
    const match = rawDesc.match(/<!--pos:(\d+)-->/) || rawDesc.match(/(?:positions?|openings?|vacancies):\s*(\d+)/i);
    if (match) parsedPositions = parseInt(match[1], 10);
  }
  const cleanDescription = rawDesc.replace(/<!--pos:\d+-->/g, '').trim();

  // Smart defaults for standard catalog roles if positions not explicitly set
  if (!parsedPositions) {
    if (item.id === 'JOB-101' || item.id === 'JOB-106') parsedPositions = 4;
    else if (item.id === 'JOB-103' || item.id === 'JOB-105' || item.id === 'JOB-108') parsedPositions = 3;
    else if (item.id === 'JOB-102' || item.id === 'JOB-104' || item.id === 'JOB-107') parsedPositions = 2;
    else parsedPositions = 1;
  }

  return {
    id: item.id,
    title: item.title,
    department: item.department,
    location: item.location,
    type: item.type || 'Full-time',
    experience: item.experience || 'Mid Level',
    salary: item.salary || '',
    positions: parsedPositions,
    postedDate: item.posted_date || (item.created_at ? item.created_at.split('T')[0] : new Date().toISOString().split('T')[0]),
    urgent: Boolean(item.urgent),
    description: cleanDescription,
    responsibilities: responsibilities.length ? responsibilities : ['Execute assigned engineering and business deliverables with high quality.'],
    requirements: requirements.length ? requirements : ['Relevant experience in the required technological domain.'],
    is_active: item.is_active !== false,
    display_order: item.display_order || 0
  };
}

function mapAppJobToSupabase(job) {
  const cleanDesc = (job.description || '').replace(/<!--pos:\d+-->/g, '').trim();
  const descWithMeta = cleanDesc + (job.positions ? ` <!--pos:${job.positions}-->` : '');

  return {
    id: job.id,
    title: job.title,
    department: job.department,
    location: job.location,
    type: job.type || 'Full-time',
    experience: job.experience || 'Mid Level',
    salary: job.salary || '',
    positions: Number(job.positions) || 1,
    posted_date: job.postedDate || new Date().toISOString().split('T')[0],
    urgent: Boolean(job.urgent),
    description: descWithMeta,
    responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities : [job.responsibilities || 'Execute assigned deliverables.'],
    requirements: Array.isArray(job.requirements) ? job.requirements : [job.requirements || 'Relevant experience in domain.'],
    is_active: job.is_active !== false,
    display_order: job.display_order || 0,
    updated_at: new Date().toISOString()
  };
}

/**
 * Fetch all active job openings from Supabase
 * @returns {Promise<Array|null>} Array of jobs, or null if fetch failed / table not yet migrated
 */
async function fetchJobOpenings() {
  const client = getSupabaseClient();
  if (!client) {
    console.warn('[Supabase] Client not initialized. Using local/fallback jobs.');
    return null;
  }

  try {
    const { data, error } = await client
      .from('job_openings')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[Supabase] Could not fetch job openings (table may need schema run):', error.message);
      return null;
    }

    if (Array.isArray(data) && data.length > 0) {
      console.log(`[Supabase] Successfully fetched ${data.length} job openings from database.`);
      return data.map(mapSupabaseJobToApp);
    }
    return [];
  } catch (err) {
    console.error('[Supabase] fetchJobOpenings exception:', err);
    return null;
  }
}

/**
 * Save or update a job opening in Supabase
 * @param {Object} job
 * @returns {Promise<{success: boolean, id?: string, error?: string}>}
 */
async function saveJobOpening(job) {
  const client = getSupabaseClient();
  const record = mapAppJobToSupabase(job);

  if (client) {
    try {
      let { error } = await client
        .from('job_openings')
        .upsert([record], { onConflict: 'id' });

      // Fallback: If 'positions' column is not yet migrated in Supabase, retry without positions column
      if (error && error.message && error.message.toLowerCase().includes('positions')) {
        console.warn('[Supabase] "positions" column not found in database yet. Falling back without positions column.');
        const fallbackRecord = { ...record };
        delete fallbackRecord.positions;
        const retryResult = await client
          .from('job_openings')
          .upsert([fallbackRecord], { onConflict: 'id' });
        error = retryResult.error;
      }

      if (error) {
        console.error('[Supabase] Upsert error:', error);
        return { success: false, error: error.message };
      }

      console.log('[Supabase] Job opening synced:', record.id, 'positions:', record.positions);
      return { success: true, id: record.id };
    } catch (err) {
      console.error('[Supabase] saveJobOpening exception:', err);
      return { success: false, error: err.message };
    }
  }

  return { success: true, localOnly: true };
}

/**
 * Delete a job opening from Supabase
 * @param {string} jobId
 * @returns {Promise<{success: boolean, error?: string}>}
 */
async function deleteJobOpening(jobId) {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { error } = await client
        .from('job_openings')
        .delete()
        .eq('id', jobId);

      if (error) {
        console.error('[Supabase] Delete error:', error);
        return { success: false, error: error.message };
      }

      console.log('[Supabase] Job opening deleted from database:', jobId);
      return { success: true };
    } catch (err) {
      console.error('[Supabase] deleteJobOpening exception:', err);
      return { success: false, error: err.message };
    }
  }
  return { success: true, localOnly: true };
}

// ----------------------------------------------------------------------------
// Candidate Job Application Requests Management
// ----------------------------------------------------------------------------

async function saveJobApplicationRequest(applicationData) {
  const client = getSupabaseClient();

  const record = {
    job_id: applicationData.job_id || 'GENERAL',
    job_title: applicationData.job_title || 'General Application',
    candidate_name: applicationData.candidate_name,
    candidate_phone: applicationData.candidate_phone,
    candidate_email: applicationData.candidate_email,
    experience: applicationData.experience || '',
    notice_period: applicationData.notice_period || '',
    skills_summary: applicationData.skills_summary || '',
    channel_preferred: applicationData.channel_preferred || 'whatsapp',
    status: 'new',
    created_at: new Date().toISOString()
  };

  if (client) {
    try {
      const { error } = await client
        .from('job_applications')
        .insert([record]);

      if (error) {
        console.error('[Supabase] Insert application error:', error);
        backupLocally(record);
        return { success: false, error: error.message };
      }

      console.log('[Supabase] Application stored successfully');
      return { success: true };
    } catch (err) {
      console.error('[Supabase] Network exception:', err);
      backupLocally(record);
      return { success: false, error: err.message };
    }
  }

  backupLocally(record);
  return { success: true, localOnly: true };
}

function backupLocally(record) {
  try {
    const existing = JSON.parse(localStorage.getItem('shivtej_job_applications_backup') || '[]');
    existing.push(record);
    localStorage.setItem('shivtej_job_applications_backup', JSON.stringify(existing));
    console.log('[Local Backup] Total saved applications in browser:', existing.length);
  } catch (e) {
    console.warn('[Local Backup] Could not save to localStorage:', e);
  }
}
