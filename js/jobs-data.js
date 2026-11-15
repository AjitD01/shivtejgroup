/**
 * Shivtej Placement Services - Initial Verified Job Openings Catalog
 * Can be managed, edited, and expanded dynamically directly from the Frontend Job Manager!
 */

const DEFAULT_JOBS = [
  {
    id: "JOB-101",
    title: "Full Stack Web Developer (Node.js & React / TypeScript)",
    department: "IT & Software Development",
    location: "Pune (PCMC / Remote)",
    type: "Full-time",
    experience: "Mid Level (2-5 yrs)",
    salary: "₹45,000 - ₹75,000 / month",
    positions: 4,
    postedDate: "2025-03-01",
    urgent: true,
    description: "Shivtej Placement Services is hiring a Full Stack Developer on behalf of a leading technology client in Pune. You will build and scale web applications, APIs, and client portals.",
    responsibilities: [
      "Develop responsive, high-performance web frontends using modern JavaScript/TypeScript and React.",
      "Design and maintain scalable REST APIs and backend microservices using Node.js.",
      "Integrate SQL/NoSQL databases, authentication systems, and cloud deployment pipelines.",
      "Collaborate with product designers and engineering teams to deliver mission-critical software."
    ],
    requirements: [
      "B.Tech / B.E. / MCA in Computer Science or related field.",
      "2+ years experience in React, Node.js, and TypeScript.",
      "Proficiency with RESTful APIs, Git, and modern CI/CD workflows."
    ]
  },
  {
    id: "JOB-102",
    title: "QA Automation & Software Test Engineer",
    department: "IT & Software Development",
    location: "Pune (Hinjawadi / Wakad)",
    type: "Full-time",
    experience: "Junior to Mid (2-4 yrs)",
    salary: "₹35,000 - ₹55,000 / month",
    positions: 2,
    postedDate: "2025-02-28",
    urgent: false,
    description: "Seeking a detail-oriented QA Automation Engineer to design, script, and maintain end-to-end automated testing suites for enterprise client platforms.",
    responsibilities: [
      "Write and execute automated test scripts using Playwright, Selenium, or Cypress.",
      "Perform regression, functional, API, and load testing.",
      "Track defects, generate quality metrics, and collaborate with developers on rapid fixes."
    ],
    requirements: [
      "Bachelor's degree in IT/Computer Science.",
      "2+ years experience in software testing with automated testing frameworks.",
      "Familiarity with Postman, CI/CD pipelines, and bug-tracking tools (Jira)."
    ]
  },
  {
    id: "JOB-103",
    title: "Embedded Systems & Firmware Engineer",
    department: "Engineering & Embedded Tech",
    location: "Bhosari, Pune",
    type: "Full-time",
    experience: "Mid Level (3-6 yrs)",
    salary: "₹40,000 - ₹65,000 / month",
    positions: 3,
    postedDate: "2025-02-26",
    urgent: true,
    description: "Urgent opening for an Embedded Systems Engineer to develop firmware and control systems for industrial automation and automotive sensors.",
    responsibilities: [
      "Develop embedded C/C++ firmware for microcontrollers (ARM Cortex, STM32, ESP32).",
      "Interface sensors, CAN bus, Modbus, and IoT communication protocols.",
      "Perform hardware-software debugging using oscilloscopes and logic analyzers."
    ],
    requirements: [
      "Degree in Electronics & Telecommunication / Electrical Engineering.",
      "3+ years hands-on embedded firmware development experience.",
      "Knowledge of communication protocols (CAN, UART, SPI, I2C)."
    ]
  },
  {
    id: "JOB-104",
    title: "Production Supervisor – Foam & Rubber Molding",
    department: "Manufacturing Operations",
    location: "Chikhli, Pune",
    type: "Full-time",
    experience: "Mid Level (3-5 yrs)",
    salary: "₹30,000 - ₹45,000 / month",
    positions: 2,
    postedDate: "2025-02-25",
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
    id: "JOB-105",
    title: "Quality Control Inspector (Dimensional & Visual)",
    department: "Quality Engineering",
    location: "Bhosari, Pune",
    type: "Full-time",
    experience: "Junior (1-3 yrs)",
    salary: "₹22,000 - ₹32,000 / month",
    positions: 3,
    postedDate: "2025-02-22",
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
    id: "JOB-106",
    title: "Business Development Executive (BDE) – Industrial & IT Accounts",
    department: "Sales & Marketing",
    location: "Pune (PCMC Area)",
    type: "Full-time",
    experience: "Mid (2-4 yrs)",
    salary: "₹25,000 - ₹40,000 + Incentives",
    positions: 4,
    postedDate: "2025-02-20",
    urgent: true,
    description: "Drive corporate business growth by acquiring automotive OEM, IT client staffing, and electronics packaging clients across Maharashtra.",
    responsibilities: [
      "Identify corporate clients requiring specialized staffing, IT talent, and engineering products.",
      "Present product capabilities, prepare technical quotes, and close client contracts.",
      "Maintain active client relationships and track repeat accounts."
    ],
    requirements: [
      "Any Graduate / MBA in Marketing with B2B sales or staffing recruitment experience.",
      "Good communication skills in Marathi, Hindi, and English.",
      "Valid two-wheeler license for client visits in Pune/PCMC."
    ]
  },
  {
    id: "JOB-107",
    title: "HR & Payroll Executive",
    department: "Human Resources",
    location: "Bhosari, Pune",
    type: "Full-time",
    experience: "Mid (2-5 yrs)",
    salary: "₹25,000 - ₹38,000 / month",
    positions: 2,
    postedDate: "2025-02-18",
    urgent: false,
    description: "Oversee client manpower payroll calculations, PF/ESIC statutory compliance, contractor attendance, and worker onboarding for client companies.",
    responsibilities: [
      "Process monthly payroll for 200+ contractual and permanent workforce.",
      "Handle statutory compliance including PF, ESIC, PT, and Labour Law records.",
      "Manage employee onboarding, documentation, and attendance systems."
    ],
    requirements: [
      "Degree in HR / MBA HR / M.Com.",
      "Hands-on experience with payroll software, MS Excel, and statutory portals.",
      "2+ years experience in staffing or corporate HR operations."
    ]
  },
  {
    id: "JOB-108",
    title: "Tool & Die Maker / Machinist (Die-Cutting Stamping)",
    department: "Tooling & Fabrication",
    location: "Chikhli, Pune",
    type: "Full-time",
    experience: "Mid to Senior (3-6 yrs)",
    salary: "₹28,000 - ₹42,000 / month",
    positions: 3,
    postedDate: "2025-02-15",
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
        return parsed.map(j => ({
          ...j,
          positions: Number(j.positions) || (j.id === 'JOB-101' ? 4 : (j.id === 'JOB-106' ? 4 : (j.id === 'JOB-103' ? 3 : (j.id === 'JOB-105' ? 3 : (j.id === 'JOB-108' ? 3 : (j.id === 'JOB-102' ? 2 : (j.id === 'JOB-104' ? 2 : (j.id === 'JOB-107' ? 2 : 1))))))))
        }));
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
