-- ============================================================================
-- SHIVTEJ PLACEMENT SERVICES - COMPLETE SUPABASE SCHEMA & SEED DATA
-- Project: oyqtaytychzjhxlzbnyf
--
-- Tables:
-- 1. public.job_openings: Stores & manages vacancies/jobs (editable in Supabase & Portal)
-- 2. public.job_applications: Stores candidate incoming job applications
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. TABLE: job_openings (Manage, store, and edit job vacancies)
-- ----------------------------------------------------------------------------
create table if not exists public.job_openings (
  id text primary key,
  title text not null,
  department text not null,
  location text not null,
  type text default 'Full-time',
  experience text default 'Mid Level',
  salary text,
  posted_date date default current_date,
  urgent boolean default false,
  description text not null,
  responsibilities jsonb default '[]'::jsonb,
  requirements jsonb default '[]'::jsonb,
  is_active boolean default true,
  display_order integer default 0,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Enable Row Level Security (RLS)
alter table public.job_openings enable row level security;

-- Policies for job_openings: full select, insert, update, delete
drop policy if exists "Enable read access for all" on public.job_openings;
create policy "Enable read access for all"
  on public.job_openings
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Enable insert access for all" on public.job_openings;
create policy "Enable insert access for all"
  on public.job_openings
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Enable update access for all" on public.job_openings;
create policy "Enable update access for all"
  on public.job_openings
  for update
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "Enable delete access for all" on public.job_openings;
create policy "Enable delete access for all"
  on public.job_openings
  for delete
  to anon, authenticated
  using (true);

-- Indexes for fast filtering
create index if not exists idx_job_openings_active on public.job_openings (is_active);
create index if not exists idx_job_openings_dept on public.job_openings (department);
create index if not exists idx_job_openings_loc on public.job_openings (location);
create index if not exists idx_job_openings_order on public.job_openings (display_order, created_at desc);

-- ----------------------------------------------------------------------------
-- 2. TABLE: job_applications (Store candidate application requests)
-- ----------------------------------------------------------------------------
create table if not exists public.job_applications (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now() not null,
  job_id text not null,
  job_title text not null,
  candidate_name text not null,
  candidate_phone text not null,
  candidate_email text not null,
  experience text,
  notice_period text,
  skills_summary text,
  channel_preferred text default 'whatsapp',
  status text default 'new' check (status in ('new', 'reviewed', 'contacted', 'archived')),
  notes text
);

alter table public.job_applications enable row level security;

drop policy if exists "Enable insert for all" on public.job_applications;
drop policy if exists "Enable insert for candidates" on public.job_applications;
create policy "Enable insert for all"
  on public.job_applications
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Enable select for authenticated recruiters" on public.job_applications;
drop policy if exists "Enable select for all" on public.job_applications;
create policy "Enable select for all"
  on public.job_applications
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Enable update for authenticated recruiters" on public.job_applications;
drop policy if exists "Enable update for all" on public.job_applications;
create policy "Enable update for all"
  on public.job_applications
  for update
  to anon, authenticated
  using (true);

create index if not exists idx_job_applications_created_at on public.job_applications (created_at desc);
create index if not exists idx_job_applications_job_id on public.job_applications (job_id);

-- ----------------------------------------------------------------------------
-- 3. INITIAL SEED DATA: Populates all current job openings into Supabase
-- ----------------------------------------------------------------------------
insert into public.job_openings (id, title, department, location, type, experience, salary, posted_date, urgent, description, responsibilities, requirements, is_active, display_order)
values
(
  'JOB-101',
  'Full Stack Web Developer (Node.js & React / TypeScript)',
  'IT & Software Development',
  'Pune (PCMC / Remote)',
  'Full-time',
  'Mid Level (2-5 yrs)',
  '₹45,000 - ₹75,000 / month',
  '2025-03-01',
  true,
  'Shivtej Placement Services is hiring a Full Stack Developer on behalf of a leading technology client in Pune. You will build and scale web applications, APIs, and client portals.',
  '["Develop responsive, high-performance web frontends using modern JavaScript/TypeScript and React.", "Design and maintain scalable REST APIs and backend microservices using Node.js.", "Integrate SQL/NoSQL databases, authentication systems, and cloud deployment pipelines.", "Collaborate with product designers and engineering teams to deliver mission-critical software."]'::jsonb,
  '["B.Tech / B.E. / MCA in Computer Science or related field.", "2+ years experience in React, Node.js, and TypeScript.", "Proficiency with RESTful APIs, Git, and modern CI/CD workflows."]'::jsonb,
  true,
  1
),
(
  'JOB-102',
  'QA Automation & Software Test Engineer',
  'IT & Software Development',
  'Pune (Hinjawadi / Wakad)',
  'Full-time',
  'Junior to Mid (2-4 yrs)',
  '₹35,000 - ₹55,000 / month',
  '2025-02-28',
  false,
  'Seeking a detail-oriented QA Automation Engineer to design, script, and maintain end-to-end automated testing suites for enterprise client platforms.',
  '["Write and execute automated test scripts using Playwright, Selenium, or Cypress.", "Perform regression, functional, API, and load testing.", "Track defects, generate quality metrics, and collaborate with developers on rapid fixes."]'::jsonb,
  '["Bachelor''s degree in IT/Computer Science.", "2+ years experience in software testing with automated testing frameworks.", "Familiarity with Postman, CI/CD pipelines, and bug-tracking tools (Jira)."]'::jsonb,
  true,
  2
),
(
  'JOB-103',
  'Embedded Systems & Firmware Engineer',
  'Engineering & Embedded Tech',
  'Bhosari, Pune',
  'Full-time',
  'Mid Level (3-6 yrs)',
  '₹40,000 - ₹65,000 / month',
  '2025-02-26',
  true,
  'Urgent opening for an Embedded Systems Engineer to develop firmware and control systems for industrial automation and automotive sensors.',
  '["Develop embedded C/C++ firmware for microcontrollers (ARM Cortex, STM32, ESP32).", "Interface sensors, CAN bus, Modbus, and IoT communication protocols.", "Perform hardware-software debugging using oscilloscopes and logic analyzers."]'::jsonb,
  '["Degree in Electronics & Telecommunication / Electrical Engineering.", "3+ years hands-on embedded firmware development experience.", "Knowledge of communication protocols (CAN, UART, SPI, I2C)."]'::jsonb,
  true,
  3
),
(
  'JOB-104',
  'Production Supervisor – Foam & Rubber Molding',
  'Manufacturing Operations',
  'Chikhli, Pune',
  'Full-time',
  'Mid Level (3-5 yrs)',
  '₹30,000 - ₹45,000 / month',
  '2025-02-25',
  true,
  'We are seeking an experienced Production Supervisor to oversee foam die-cutting, gasket fabrication, and sheet extrusion lines at our manufacturing facility in Chikhli.',
  '["Supervise daily foam cutting, laminating, and die-punching production schedules.", "Ensure adherence to dimensional tolerances and ISO quality standards.", "Manage machine operators, shift planning, and raw material utilization.", "Troubleshoot equipment setup and minimize scrap rate."]'::jsonb,
  '["Diploma / Degree in Mechanical, Polymer, or Production Engineering.", "Minimum 3+ years experience in foam, rubber, packaging, or sheet fabrication.", "Strong leadership, communication, and shift management skills."]'::jsonb,
  true,
  4
),
(
  'JOB-105',
  'Quality Control Inspector (Dimensional & Visual)',
  'Quality Engineering',
  'Bhosari, Pune',
  'Full-time',
  'Junior (1-3 yrs)',
  '₹22,000 - ₹32,000 / month',
  '2025-02-22',
  false,
  'Responsible for in-process inspection and final QA testing of precision die-cut gaskets, foam tapes, and thermal insulation pads.',
  '["Conduct visual, dimensional, and density checks using vernier calipers, micrometers, and gauges.", "Maintain inspection log reports and rejection documentation.", "Coordinate with production team to address non-conformances."]'::jsonb,
  '["ITI / Diploma in Mechanical or Quality Assurance.", "1-3 years experience in industrial inspection, automotive parts, or rubber components.", "Proficiency with measuring instruments."]'::jsonb,
  true,
  5
),
(
  'JOB-106',
  'Business Development Executive (BDE) – Industrial & IT Accounts',
  'Sales & Marketing',
  'Pune (PCMC Area)',
  'Full-time',
  'Mid (2-4 yrs)',
  '₹25,000 - ₹40,000 + Incentives',
  '2025-02-20',
  true,
  'Drive corporate business growth by acquiring automotive OEM, IT client staffing, and electronics packaging clients across Maharashtra.',
  '["Identify corporate clients requiring specialized staffing, IT talent, and engineering products.", "Present product capabilities, prepare technical quotes, and close client contracts.", "Maintain active client relationships and track repeat accounts."]'::jsonb,
  '["Any Graduate / MBA in Marketing with B2B sales or staffing recruitment experience.", "Good communication skills in Marathi, Hindi, and English.", "Valid two-wheeler license for client visits in Pune/PCMC."]'::jsonb,
  true,
  6
),
(
  'JOB-107',
  'HR & Payroll Executive',
  'Human Resources',
  'Bhosari, Pune',
  'Full-time',
  'Mid (2-5 yrs)',
  '₹25,000 - ₹38,000 / month',
  '2025-02-18',
  false,
  'Oversee client manpower payroll calculations, PF/ESIC statutory compliance, contractor attendance, and worker onboarding for client companies.',
  '["Process monthly payroll for 200+ contractual and permanent workforce.", "Handle statutory compliance including PF, ESIC, PT, and Labour Law records.", "Manage employee onboarding, documentation, and attendance systems."]'::jsonb,
  '["Degree in HR / MBA HR / M.Com.", "Hands-on experience with payroll software, MS Excel, and statutory portals.", "2+ years experience in staffing or corporate HR operations."]'::jsonb,
  true,
  7
),
(
  'JOB-108',
  'Tool & Die Maker / Machinist (Die-Cutting Stamping)',
  'Tooling & Fabrication',
  'Chikhli, Pune',
  'Full-time',
  'Mid to Senior (3-6 yrs)',
  '₹28,000 - ₹42,000 / month',
  '2025-02-15',
  false,
  'Fabricate, maintain, and sharpen rotary and flatbed cutting dies, wooden punch dies, and steel rule tooling for custom foam gasket shapes.',
  '["Operate die making machinery, bending tools, and rule cutting jigs.", "Inspect CAD drawings and fabricate precise wooden and steel dies.", "Conduct routine maintenance and repairs on stamping toolsets."]'::jsonb,
  '["ITI Tool & Die Maker or equivalent technical trade.", "3+ years experience with flatbed die tooling, stamping, or gasket presses."]'::jsonb,
  true,
  8
)
on conflict (id) do update set
  title = excluded.title,
  department = excluded.department,
  location = excluded.location,
  type = excluded.type,
  experience = excluded.experience,
  salary = excluded.salary,
  description = excluded.description,
  responsibilities = excluded.responsibilities,
  requirements = excluded.requirements,
  urgent = excluded.urgent,
  is_active = excluded.is_active,
  display_order = excluded.display_order,
  updated_at = now();
