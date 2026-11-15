-- ============================================================================
-- SHIVTEJ PLACEMENT SERVICES - SECURE PRODUCTION RLS POLICIES
-- Project: oyqtaytychzjhxlzbnyf
-- 
-- Security Architecture:
-- 1. public.job_openings:
--    - PUBLIC (anon): READ-ONLY (can view active job vacancies)
--    - ADMINS (authenticated): Full access (Create, Edit, Delete via Supabase Dashboard)
--    * Nobody on the public internet can post or modify jobs!
--
-- 2. public.job_applications:
--    - PUBLIC (anon): INSERT-ONLY (can submit their own job application)
--    - PUBLIC (anon): BLOCKED from SELECT (cannot see other candidates' details)
--    - ADMINS (authenticated): Full SELECT & UPDATE access in Supabase Dashboard
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. SECURE POLICIES FOR: job_openings
-- ----------------------------------------------------------------------------
alter table public.job_openings enable row level security;

-- Drop any loose open policies
drop policy if exists "Enable read access for all" on public.job_openings;
drop policy if exists "Enable insert access for all" on public.job_openings;
drop policy if exists "Enable update access for all" on public.job_openings;
drop policy if exists "Enable delete access for all" on public.job_openings;
drop policy if exists "Public can view active job openings" on public.job_openings;
drop policy if exists "Admins can insert job openings" on public.job_openings;
drop policy if exists "Admins can update job openings" on public.job_openings;
drop policy if exists "Admins can delete job openings" on public.job_openings;

-- Policy 1: Public visitors can ONLY view active job openings
create policy "Public can view active job openings"
  on public.job_openings
  for select
  to anon, authenticated
  using (is_active = true);

-- Policy 2: ONLY logged-in Supabase admins can create new job openings
create policy "Admins can insert job openings"
  on public.job_openings
  for insert
  to authenticated
  with check (true);

-- Policy 3: ONLY logged-in Supabase admins can edit / update job openings
create policy "Admins can update job openings"
  on public.job_openings
  for update
  to authenticated
  using (true)
  with check (true);

-- Policy 4: ONLY logged-in Supabase admins can delete job openings
create policy "Admins can delete job openings"
  on public.job_openings
  for delete
  to authenticated
  using (true);

-- ----------------------------------------------------------------------------
-- 2. SECURE POLICIES FOR: job_applications
-- ----------------------------------------------------------------------------
alter table public.job_applications enable row level security;

-- Drop any loose open policies
drop policy if exists "Enable insert for all" on public.job_applications;
drop policy if exists "Enable select for all" on public.job_applications;
drop policy if exists "Enable update for all" on public.job_applications;
drop policy if exists "Enable insert for candidates" on public.job_applications;
drop policy if exists "Enable select for authenticated recruiters" on public.job_applications;
drop policy if exists "Enable update for authenticated recruiters" on public.job_applications;

-- Policy 1: Candidates on the website can submit (insert) their application
create policy "Enable insert for candidates"
  on public.job_applications
  for insert
  to anon, authenticated
  with check (true);

-- Policy 2: ONLY logged-in Supabase admins can view candidate applications (protects PII)
create policy "Enable select for authenticated recruiters"
  on public.job_applications
  for select
  to authenticated
  using (true);

-- Policy 3: ONLY logged-in Supabase admins can update application status or notes
create policy "Enable update for authenticated recruiters"
  on public.job_applications
  for update
  to authenticated
  using (true);
