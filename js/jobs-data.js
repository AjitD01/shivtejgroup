/**
 * Shivtej Placement Services - Initial Verified Job Openings Catalog
 * Can be managed, edited, and expanded dynamically directly from the Frontend Job Manager!
 */

const DEFAULT_JOBS = [
  {
    id: "JOB-101",
    title: "Production Supervisor – Foam & Rubber Molding",
    department: "Manufacturing Operations",
    location: "Chikhli, Pune",
    type: "Full-time",
    experience: "Mid Level (3-5 yrs)",
    salary: "₹30,000 - ₹45,000 / month",
    postedDate: "2025-02-28",
    urgent: true,
    description: "We are seeking an experienced Production Supervisor to oversee foam die-cutting, gasket fabrication, and sheet extrusion lines at our manufacturing facility in Chikhli.",
    responsibilities: [
      "Supervise daily foam cutting, laminating, and die-punching production schedules.",
      "Ensure adherence to dimensional tolerances and ISO quality standards.",
      "Manage machine operators, shift planning, and raw material utilization.",
      "Troubleshoot equipment setup and minimize scrap rate."
    ],
    requirements: [
      "Diploma / Degree in Mechanical, Polymer, or Production Engineering.",
      "Minimum 3+ years experience in foam, rubber, packaging, or sheet fabrication.",
      "Strong leadership, communication, and shift management skills."
    ]
  },
  {
    id: "JOB-102",
    title: "Quality Control Inspector (Dimensional & Visual)",
    department: "Quality Engineering",
    location: "Bhosari, Pune",
    type: "Full-time",
    experience: "Junior (1-3 yrs)",
    salary: "₹22,000 - ₹32,000 / month",
    postedDate: "2025-02-25",
    urgent: false,
    description: "Responsible for in-process inspection and final QA testing of precision die-cut gaskets, foam tapes, and thermal insulation pads.",
    responsibilities: [
      "Conduct visual, dimensional, and density checks using vernier calipers, micrometers, and gauges.",
      "Maintain inspection log reports and rejection documentation.",
      "Coordinate with production team to address non-conformances."
    ],
    requirements: [
      "ITI / Diploma in Mechanical or Quality Assurance.",
      "1-3 years experience in industrial inspection, automotive parts, or rubber components.",
      "Proficiency with measuring instruments."
    ]
  },
  {
    id: "JOB-103",
    title: "Business Development Executive (BDE) – Industrial Accounts",
    department: "Sales & Marketing",
    location: "Pune (PCMC Area)",
    type: "Full-time",
    experience: "Mid (2-4 yrs)",
    salary: "₹25,000 - ₹40,000 + Incentives",
    postedDate: "2025-02-20",
    urgent: true,
    description: "Drive corporate business growth by acquiring automotive OEM, HVAC, and electronics packaging clients across Maharashtra.",
    responsibilities: [
      "Identify B2B clients requiring specialized foam, gaskets, and packaging solutions.",
      "Present product capabilities, prepare technical quotes, and close client contracts.",
      "Maintain active client relationships and track repeat orders."
    ],
    requirements: [
      "Any Graduate / MBA in Marketing with B2B industrial sales experience.",
      "Good communication skills in Marathi, Hindi, and English.",
      "Valid two-wheeler license for client visits in Pune/PCMC."
    ]
  },
  {
    id: "JOB-104",
    title: "HR & Payroll Executive",
    department: "Human Resources",
    location: "Bhosari, Pune",
    type: "Full-time",
    experience: "Mid (2-5 yrs)",
    salary: "₹25,000 - ₹38,000 / month",
    postedDate: "2025-02-18",
    urgent: false,
    description: "Oversee client manpower payroll calculations, PF/ESIC statutory compliance, contractor attendance, and worker onboarding for client manufacturing plants.",
    responsibilities: [
      "Process monthly payroll for 200+ contractual and permanent workforce.",
      "Handle statutory compliance including PF, ESIC, PT, and Labour Law records.",
      "Manage employee onboarding, documentation, and attendance systems."
    ],
    requirements: [
      "Degree in HR / MBA HR / M.Com.",
      "Hands-on experience with payroll software, MS Excel, and statutory portals.",
      "2+ years experience in staffing or manufacturing HR operations."
    ]
  },
  {
    id: "JOB-105",
    title: "Commercial Facility & Housekeeping Supervisor",
    department: "Facility Management",
    location: "PCMC / Chakan / Bhosari",
    type: "Full-time",
    experience: "Mid (2-5 yrs)",
    salary: "₹20,000 - ₹30,000 / month",
    postedDate: "2025-02-15",
    urgent: false,
    description: "Lead on-site commercial housekeeping, hygiene teams, and facility maintenance for industrial client complexes and corporate offices.",
    responsibilities: [
      "Supervise daily housekeeping staff rosters, checklists, and chemical inventory.",
      "Conduct regular audits to ensure clean, hygienic workspaces and safety protocols.",
      "Act as primary point of contact for client administration managers."
    ],
    requirements: [
      "High School / Diploma / Hotel Management / Facility Certification.",
      "Proven track record in commercial facility supervision or housekeeping management.",
      "Strong problem solving and team coordination skills."
    ]
  },
  {
    id: "JOB-106",
    title: "Tool & Die Maker / Machinist (Die-Cutting Stamping)",
    department: "Tooling & Fabrication",
    location: "Chikhli, Pune",
    type: "Full-time",
    experience: "Mid to Senior (3-6 yrs)",
    salary: "₹28,000 - ₹42,000 / month",
    postedDate: "2025-02-10",
    urgent: false,
    description: "Fabricate, maintain, and sharpen rotary and flatbed cutting dies, wooden punch dies, and steel rule tooling for custom foam gasket shapes.",
    responsibilities: [
      "Operate die making machinery, bending tools, and rule cutting jigs.",
      "Inspect CAD drawings and fabricate precise wooden and steel dies.",
      "Conduct routine maintenance and repairs on stamping toolsets."
    ],
    requirements: [
      "ITI Tool & Die Maker or equivalent technical trade.",
      "3+ years experience with flatbed die tooling, stamping, or gasket presses."
    ]
  }
];

// Initialize LocalStorage with default jobs if empty
function getStoredJobs() {
  const stored = localStorage.getItem('shivtej_jobs_db');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // Only trust a well-formed, non-empty array of job objects.
      if (Array.isArray(parsed) && parsed.length && parsed.every(j => j && typeof j === 'object')) {
        return parsed;
      }
      console.warn("Stored jobs are malformed; restoring default catalog.");
    } catch (e) {
      console.error("Error parsing stored jobs", e);
    }
  }
  localStorage.setItem('shivtej_jobs_db', JSON.stringify(DEFAULT_JOBS));
  return [...DEFAULT_JOBS];
}

function saveStoredJobs(jobsArray) {
  localStorage.setItem('shivtej_jobs_db', JSON.stringify(jobsArray));
}
