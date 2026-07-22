// Faculty Career Advancement System (FCAS) Data Store & UGC CAS Rules Engine

const CAS_LEVEL_RULES = {
  "10_to_11": {
    fromLevel: 10,
    toLevel: 11,
    titleFrom: "Assistant Professor (Level 10 / AGP 6000)",
    titleTo: "Assistant Professor Senior Scale (Level 11 / AGP 7000)",
    minServiceYears: 4,
    minCat1Points: 80,
    minCat2Points: 35,
    minCat3Points: 20,
    minTotalApi: 135,
    minPublications: 1,
    requiredFdpCount: 1,
    description: "Screening/Evaluation Committee recommendation based on verified API scores and 1 Refresher/FDP course."
  },
  "11_to_12": {
    fromLevel: 11,
    toLevel: 12,
    titleFrom: "Assistant Professor Senior Scale (Level 11 / AGP 7000)",
    titleTo: "Assistant Professor Selection Grade (Level 12 / AGP 8000)",
    minServiceYears: 5,
    minCat1Points: 85,
    minCat2Points: 40,
    minCat3Points: 50,
    minTotalApi: 175,
    minPublications: 2,
    requiredFdpCount: 2,
    description: "Screening Committee evaluation with mandatory peer-reviewed research publications and 2 FDP/workshop certificates."
  },
  "12_to_13A": {
    fromLevel: 12,
    toLevel: "13A",
    titleFrom: "Assistant Professor Selection Grade (Level 12 / AGP 8000)",
    titleTo: "Associate Professor (Level 13A / AGP 9000)",
    minServiceYears: 3,
    minCat1Points: 90,
    minCat2Points: 45,
    minCat3Points: 75,
    minTotalApi: 210,
    minPublications: 3,
    requiredFdpCount: 2,
    minPhdGuided: 1,
    description: "Selection Committee interview assessment with 3 peer-reviewed research papers and PhD guidance record."
  },
  "13A_to_14": {
    fromLevel:"13A",
    toLevel: 14,
    titleFrom: "Associate Professor (Level 13A / AGP 9000)",
    titleTo: "Professor (Level 14 / AGP 10000)",
    minServiceYears: 3,
    minCat1Points: 95,
    minCat2Points: 45,
    minCat3Points: 110,
    minTotalApi: 250,
    minPublications: 5,
    requiredFdpCount: 3,
    minPhdGuided: 2,
    description: "University Selection Committee evaluation with 5 high-impact publications, patents, and successful PhD completions."
  }
};

const INITIAL_FACULTY_MEMBERS = [
  {
    id: "fac-101",
    name: "Dr. Sarah Jenkins",
    designation: "Associate Professor",
    department: "Computer Science & Engineering",
    email: "s.jenkins@apex.edu",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    currentLevel: "13A",
    targetLevel: "14",
    yearsInCurrentGrade: 3.5,
    qualification: "Ph.D. in Computer Science (MIT, 2017)",
    dateOfJoining: "2018-08-15",
    lastPromotionDate: "2022-12-01",
    applicationStatus: "SUBMITTED", // DRAFT, SUBMITTED, HOD_APPROVED, IQAC_VERIFIED, PROMOTED, REJECTED
    hodEndorsement: {
      status: "APPROVED",
      comments: "Dr. Jenkins has demonstrated exemplary research output in Quantum ML and led 2 major DST research grants. Highly recommended for Level 14 Professor promotion.",
      evaluatedDate: "2026-06-10",
      evaluatorName: "Prof. Marcus Vance (HOD)"
    },
    iqacAudit: null,
    cat1Teaching: [
      { id: "t1", title: "CS701: Advanced Machine Learning & Neural Networks", hoursPerWeek: 6, semesters: "Odd & Even 2024-25", points: 40 },
      { id: "t2", title: "CS302: Operating Systems & Kernel Design", hoursPerWeek: 4, semesters: "Odd 2024-25", points: 30 },
      { id: "t3", title: "CS804: Quantum Computing Systems", hoursPerWeek: 3, semesters: "Even 2024-25", points: 25 }
    ],
    cat2Development: [
      { id: "d1", title: "Convener, University Research & Ethics Committee", role: "Convener", points: 15, year: "2024-2025" },
      { id: "d2", title: "Faculty Development Program on Generative AI Architectures", role: "Coordinator", points: 15, year: "2024" },
      { id: "d3", title: "IEEE Senior Member & Student Branch Counselor", role: "Mentor", points: 18, year: "2023-2025" }
    ],
    cat3Research: [
      {
        id: "r1",
        title: "Quantum Machine Learning Algorithms for High-Dimensional Optimization",
        journal: "IEEE Transactions on Pattern Analysis and Machine Intelligence (TPAMI)",
        type: "SCI Journal",
        year: 2024,
        impactFactor: 23.6,
        doi: "10.1109/TPAMI.2024.339812",
        authorship: "First Author",
        points: 25,
        status: "VERIFIED"
      },
      {
        id: "r2",
        title: "Distributed Deep Learning Models in Edge Computing Networks",
        journal: "ACM Computing Surveys",
        type: "SCI Journal",
        year: 2023,
        impactFactor: 16.6,
        doi: "10.1145/3589120",
        authorship: "Corresponding Author",
        points: 25,
        status: "VERIFIED"
      },
      {
        id: "r3",
        title: "Privacy-Preserving Federated Learning for Medical Diagnostics",
        journal: "Nature Machine Intelligence",
        type: "SCI Journal",
        year: 2025,
        impactFactor: 18.8,
        doi: "10.1038/s42256-025-00912-x",
        authorship: "First & Corresponding Author",
        points: 30,
        status: "VERIFIED"
      },
      {
        id: "r4",
        title: "Neural Architecture Search for Autonomous Robotics",
        journal: "IEEE Robotics and Automation Letters",
        type: "SCI Journal",
        year: 2022,
        impactFactor: 5.2,
        doi: "10.1109/LRA.2022.31456",
        authorship: "Co-Author",
        points: 20,
        status: "VERIFIED"
      },
      {
        id: "r5",
        title: "Patent: Decentralized Zero-Knowledge Authentication for Edge Devices",
        journal: "US Patent Office",
        type: "Patent (Granted)",
        year: 2024,
        impactFactor: 0,
        doi: "US11849201B2",
        authorship: "Lead Inventor",
        points: 22,
        status: "VERIFIED"
      },
      {
        id: "r6",
        title: "SERB Grant: AI-Driven Smart Grid Energy Optimization",
        journal: "DST-SERB Sanctioned Project ($85,000)",
        type: "Sponsored Project",
        year: 2023,
        impactFactor: 0,
        doi: "SERB/CRG/2023/00412",
        authorship: "Principal Investigator",
        points: 20,
        status: "VERIFIED"
      }
    ],
    phdGuidance: [
      { studentName: "David K. Miller", topic: "Federated Learning in Edge IoT", status: "AWARDED", year: 2024 },
      { studentName: "Aria Thorne", topic: "Quantum Approximate Optimization", status: "AWARDED", year: 2025 },
      { studentName: "Kevin Patel", topic: "Neuromorphic Computing Hardware", status: "ONGOING", year: 2026 }
    ],
    fdps: [
      { title: "AICTE-UKIERI Technical Leadership Program", duration: "2 Weeks", issuer: "AICTE & British Council", year: 2023 },
      { title: "Advanced Quantum Computing & Qiskit SDK", duration: "1 Week", issuer: "IBM Quantum Research", year: 2024 },
      { title: "Curriculum Design & NBA Accreditation Framework", duration: "1 Week", issuer: "NITTTR", year: 2025 }
    ]
  },

  {
    id: "fac-102",
    name: "Dr. Rajesh Kumar",
    designation: "Assistant Professor",
    department: "Electrical Engineering",
    email: "r.kumar@apex.edu",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    currentLevel: "11",
    targetLevel: "12",
    yearsInCurrentGrade: 4.8,
    qualification: "Ph.D. in Power Systems (IIT Bombay, 2019)",
    dateOfJoining: "2019-07-10",
    lastPromotionDate: "2021-08-01",
    applicationStatus: "SUBMITTED",
    hodEndorsement: null,
    iqacAudit: null,
    cat1Teaching: [
      { id: "t101", title: "EE401: High Voltage Engineering & Smart Grids", hoursPerWeek: 5, semesters: "Odd 2024-25", points: 35 },
      { id: "t102", title: "EE204: Signals and Systems Analysis", hoursPerWeek: 4, semesters: "Even 2024-25", points: 30 },
      { id: "t103", title: "EE509: Renewable Microgrid Control", hoursPerWeek: 3, semesters: "Odd 2024-25", points: 23 }
    ],
    cat2Development: [
      { id: "d101", title: "Department Training & Placement Officer", role: "TPO Coordinator", points: 20, year: "2024-2025" },
      { id: "d102", title: "Organizing Secretary, National Smart Grid Symposium", role: "Secretary", points: 12, year: "2024" },
      { id: "d103", title: "NPTEL Online Course Mentor", role: "Mentor", points: 10, year: "2023" }
    ],
    cat3Research: [
      {
        id: "r101",
        title: "Adaptive Sliding Mode Control for Grid-Tied Inverters under Fault Conditions",
        journal: "IEEE Transactions on Power Electronics",
        type: "SCI Journal",
        year: 2024,
        impactFactor: 6.7,
        doi: "10.1109/TPEL.2024.32890",
        authorship: "First Author",
        points: 25,
        status: "VERIFIED"
      },
      {
        id: "r102",
        title: "Resilient Microgrid Energy Storage Management via Deep Reinforcement Learning",
        journal: "Elsevier Applied Energy",
        type: "SCI Journal",
        year: 2023,
        impactFactor: 11.2,
        doi: "10.1016/j.apenergy.2023.12091",
        authorship: "Corresponding Author",
        points: 25,
        status: "VERIFIED"
      },
      {
        id: "r103",
        title: "Design of Solar-Biomass Hybrid Controller for Rural Electrification",
        journal: "Renewable Energy Focus",
        type: "Scopus Journal",
        year: 2022,
        impactFactor: 3.8,
        doi: "10.1016/j.ref.2022.04.008",
        authorship: "First Author",
        points: 18,
        status: "VERIFIED"
      }
    ],
    phdGuidance: [
      { studentName: "Sanjay Singhania", topic: "Solid State Battery Management", status: "ONGOING", year: 2025 }
    ],
    fdps: [
      { title: "AICTE Training on Electric Vehicle Systems & Charging Tech", duration: "2 Weeks", issuer: "NITTTR Chandigarh", year: 2022 },
      { title: "Advanced Power Quality Monitoring & DSP", duration: "1 Week", issuer: "IIT Delhi", year: 2024 }
    ]
  },

  {
    id: "fac-103",
    name: "Dr. Elena Rostova",
    designation: "Assistant Professor",
    department: "Biotechnology & Bioengineering",
    email: "e.rostova@apex.edu",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200",
    currentLevel: "10",
    targetLevel: "11",
    yearsInCurrentGrade: 4.2,
    qualification: "Ph.D. in Molecular Biology (Oxford, 2020)",
    dateOfJoining: "2022-01-15",
    lastPromotionDate: "None",
    applicationStatus: "HOD_APPROVED", // Approved by HOD, ready for IQAC Audit
    hodEndorsement: {
      status: "APPROVED",
      comments: "Outstanding early career researcher with 2 CRISPR publications. Fully endorses Level 11 Senior Scale promotion.",
      evaluatedDate: "2026-05-18",
      evaluatorName: "Prof. Ananya Sharma (HOD BioTech)"
    },
    iqacAudit: null,
    cat1Teaching: [
      { id: "t201", title: "BT301: Genetic Engineering & Recombinant DNA Tech", hoursPerWeek: 5, semesters: "Odd 2024-25", points: 38 },
      { id: "t202", title: "BT202: Microbiology & Enzymology Lab", hoursPerWeek: 6, semesters: "Even 2024-25", points: 34 },
      { id: "t203", title: "BT604: Bioinformatics & Systems Biology", hoursPerWeek: 3, semesters: "Odd 2024-25", points: 20 }
    ],
    cat2Development: [
      { id: "d201", title: "Department Biosafety Officer", role: "Safety Incharge", points: 15, year: "2023-2025" },
      { id: "d202", title: "Biotech Student Association Staff Advisor", role: "Advisor", points: 15, year: "2024" },
      { id: "d203", title: "Organized International Workshop on Gene Editing", role: "Convener", points: 10, year: "2024" }
    ],
    cat3Research: [
      {
        id: "r201",
        title: "Targeted CRISPR-Cas12a Editing in Crop Resistance Pathways",
        journal: "Nature Communications",
        type: "SCI Journal",
        year: 2024,
        impactFactor: 16.6,
        doi: "10.1038/s41467-024-49021",
        authorship: "First Author",
        points: 25,
        status: "VERIFIED"
      },
      {
        id: "r202",
        title: "Structural Insights into Bacterial Enzyme Diagnostics",
        journal: "Journal of Biological Chemistry",
        type: "SCI Journal",
        year: 2023,
        impactFactor: 4.8,
        doi: "10.1016/j.jbc.2023.104921",
        authorship: "Co-Author",
        points: 13,
        status: "VERIFIED"
      }
    ],
    phdGuidance: [],
    fdps: [
      { title: "AICTE Training on Molecular Docking & Drug Discovery", duration: "2 Weeks", issuer: "NIPER", year: 2023 }
    ]
  },

  {
    id: "fac-104",
    name: "Prof. Marcus Vance",
    designation: "Professor & Head of Department",
    department: "Mechanical Engineering",
    email: "m.vance@apex.edu",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    currentLevel: "14",
    targetLevel: "14",
    yearsInCurrentGrade: 5.2,
    qualification: "Ph.D. in Aerospace Engineering (Caltech, 2012)",
    dateOfJoining: "2013-09-01",
    lastPromotionDate: "2021-02-15",
    applicationStatus: "PROMOTED",
    hodEndorsement: null,
    iqacAudit: null,
    cat1Teaching: [
      { id: "t301", title: "ME501: Computational Fluid Dynamics", hoursPerWeek: 4, semesters: "Odd 2024-25", points: 40 },
      { id: "t302", title: "ME602: Advanced Thermodynamics & Jet Propulsion", hoursPerWeek: 4, semesters: "Even 2024-25", points: 40 },
      { id: "t303", title: "ME809: Hypersonic Aerodynamics", hoursPerWeek: 3, semesters: "Odd 2024-25", points: 20 }
    ],
    cat2Development: [
      { id: "d301", title: "Head of Department, Mechanical Engineering", role: "HOD", points: 25, year: "2022-2026" },
      { id: "d302", title: "Chairman, University NAAC Steering Committee", role: "Chairman", points: 25, year: "2024-2025" }
    ],
    cat3Research: [
      {
        id: "r301",
        title: "Supersonic Combustion Stabilization in Dual-Mode Scramjets",
        journal: "Progress in Energy and Combustion Science",
        type: "SCI Journal",
        year: 2023,
        impactFactor: 32.4,
        doi: "10.1016/j.pecs.2023.101092",
        authorship: "First Author",
        points: 30,
        status: "VERIFIED"
      },
      {
        id: "r302",
        title: "Additive Manufacturing of Nickel Superalloys for Turbine Blades",
        journal: "Acta Materialia",
        type: "SCI Journal",
        year: 2024,
        impactFactor: 9.4,
        doi: "10.1016/j.actamat.2024.119802",
        authorship: "Corresponding Author",
        points: 25,
        status: "VERIFIED"
      }
    ],
    phdGuidance: [
      { studentName: "Dr. Vikram Seth", topic: "Turbulent Flame Diagnostics", status: "AWARDED", year: 2021 },
      { studentName: "Dr. Chloe Bennett", topic: "Plasma Assisted Combustion", status: "AWARDED", year: 2023 }
    ],
    fdps: [
      { title: "Global Academic Leadership Seminar", duration: "2 Weeks", issuer: "Harvard Higher Ed Institute", year: 2022 }
    ]
  }
];

function calculateFacultyScores(faculty) {
  const cat1Total = faculty.cat1Teaching.reduce((acc, curr) => acc + (curr.points || 0), 0);
  const cat2Total = faculty.cat2Development.reduce((acc, curr) => acc + (curr.points || 0), 0);
  const cat3Total = faculty.cat3Research.reduce((acc, curr) => acc + (curr.points || 0), 0);
  const grandTotal = cat1Total + cat2Total + cat3Total;

  const ruleKey = `${faculty.currentLevel}_to_${faculty.targetLevel}`;
  const rule = CAS_LEVEL_RULES[ruleKey] || null;

  let isEligible = false;
  let eligibilityChecklist = [];

  if (rule) {
    const pubCount = faculty.cat3Research.filter(r => r.type.includes("Journal") || r.type.includes("SCI") || r.type.includes("Scopus")).length;
    const fdpCount = faculty.fdps.length;
    const phdCount = faculty.phdGuidance.filter(p => p.status === "AWARDED").length;

    eligibilityChecklist = [
      {
        criterion: `Service Tenure in Grade (${rule.minServiceYears} yrs min)`,
        met: faculty.yearsInCurrentGrade >= rule.minServiceYears,
        current: `${faculty.yearsInCurrentGrade} yrs`,
        required: `${rule.minServiceYears} yrs`
      },
      {
        criterion: `Category I Score (Teaching - ${rule.minCat1Points} pts min)`,
        met: cat1Total >= rule.minCat1Points,
        current: `${cat1Total} pts`,
        required: `${rule.minCat1Points} pts`
      },
      {
        criterion: `Category II Score (Development - ${rule.minCat2Points} pts min)`,
        met: cat2Total >= rule.minCat2Points,
        current: `${cat2Total} pts`,
        required: `${rule.minCat2Points} pts`
      },
      {
        criterion: `Category III Score (Research - ${rule.minCat3Points} pts min)`,
        met: cat3Total >= rule.minCat3Points,
        current: `${cat3Total} pts`,
        required: `${rule.minCat3Points} pts`
      },
      {
        criterion: `Peer-Reviewed Publications (${rule.minPublications} required)`,
        met: pubCount >= rule.minPublications,
        current: `${pubCount} papers`,
        required: `${rule.minPublications} papers`
      },
      {
        criterion: `FDP / Refresher Courses (${rule.requiredFdpCount} required)`,
        met: fdpCount >= rule.requiredFdpCount,
        current: `${fdpCount} completed`,
        required: `${rule.requiredFdpCount} completed`
      }
    ];

    if (rule.minPhdGuided) {
      eligibilityChecklist.push({
        criterion: `PhD Guidance Awarded (${rule.minPhdGuided} required)`,
        met: phdCount >= rule.minPhdGuided,
        current: `${phdCount} awarded`,
        required: `${rule.minPhdGuided} awarded`
      });
    }

    isEligible = eligibilityChecklist.every(item => item.met);
  }

  return {
    cat1Total,
    cat2Total,
    cat3Total,
    grandTotal,
    rule,
    isEligible,
    eligibilityChecklist
  };
}
