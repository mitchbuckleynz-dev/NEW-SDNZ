/**
 * Shared site content — single source of truth for copy used across pages.
 */

import {
  Shield,
  Building2,
  FileText,
  Users,
  Scan,
  Zap,
  Droplets,
  BellRing,
  Flame,
  FireExtinguisher,
} from 'lucide-react';

// ─── The four design disciplines (match CRM estimator keys) ──────────────────
export const DISCIPLINES = [
  {
    key: 'sprinkler',
    icon: Droplets,
    title: 'Fire Sprinklers',
    desc: 'Automatic fire sprinkler system design to NZS 4541 and NZS 4515 — wet pipe, dry pipe, deluge, preaction and ESFR systems for every occupancy.',
  },
  {
    key: 'alarm',
    icon: BellRing,
    title: 'Fire Alarms & Detection',
    desc: 'Fire detection and alarm system design to NZS 4512 — smoke, heat and aspirating detection, zoned and analogue-addressable systems.',
  },
  {
    key: 'hydrant',
    icon: Flame,
    title: 'Hydrants',
    desc: 'Fire hydrant system design to NZS 4510 — risers, couplings, and pumping arrangements coordinated with FENZ requirements.',
  },
  {
    key: 'hoffe',
    icon: FireExtinguisher,
    title: 'Hose Reels & Extinguishers',
    desc: 'Hand-operated firefighting equipment layouts to NZS 4503 — hose reels and portable extinguishers placed for coverage and compliance.',
  },
];

// ─── Design-stage process ─────────────────────────────────────────────────────
export const PROCESS_STAGES = [
  { name: 'Concept', desc: 'System selection, water supply assessment, and budget-level scoping for feasibility.' },
  { name: 'Developed', desc: 'Preliminary layouts and coordination with architecture, structure, and services.' },
  { name: 'Detailed', desc: 'Full BIM design, hydraulic calculations, and clash-free construction documentation.' },
  { name: 'Consent', desc: 'PS1 authorship and documentation to satisfy building consent authorities.' },
  { name: 'Tender', desc: 'Precise, comparable tender packages — contractors price the same defined scope.' },
];

// ─── Capabilities (the six service offerings) ─────────────────────────────────
export const SERVICES = [
  {
    icon: Shield,
    title: 'Fire Protection Consultant',
    shortDesc: 'Independent, end-to-end fire protection consultancy from preliminary concept to detailed design.',
    detail: 'Our fire protection consulting services include water supply assessments, specifications, PS1 authorship, PS4 construction monitoring, and code compliance across all system types.',
    tags: ['Fire Sprinklers', 'Fire Alarms', 'PS1 Author', 'PS4 Monitor', 'Gas Suppression'],
  },
  {
    icon: Building2,
    title: 'BIM Fire Protection Design & Coordination',
    shortDesc: 'Precise 3D modelling and coordination using Autodesk Revit, BIM360 & Revizto.',
    detail: 'Detailed project models enabling quick and accurate shop drawings, eliminating costly redesigns. We integrate fully with your BIM environment for clash-free outcomes.',
    tags: ['Revit', 'BIM360', 'Revizto', 'Clash Detection', 'Shop Drawings'],
  },
  {
    icon: FileText,
    title: 'Fire Protection Design for Construction',
    shortDesc: 'Full lifecycle design from concept through to final construction documentation.',
    detail: 'Sprinkler Design NZ provides end-to-end fire protection design services, ranging from initial concept to the final construction stage, tailored to every project type.',
    tags: ['Deluge & Preaction', 'Foam Suppression', 'Water Spray', 'Construction Docs'],
  },
  {
    icon: Zap,
    title: 'Special Hazards',
    shortDesc: 'Bespoke fire suppression solutions for high-risk and complex environments.',
    detail: 'Our team specialises in designing comprehensive fire protection systems tailored to the unique requirements of special hazards environments including gas suppression, foam, and water spray systems.',
    tags: ['Gas Suppression', 'Foam Systems', 'Water Spray', 'Deluge'],
  },
  {
    icon: Scan,
    title: '3D Point Cloud Scanning',
    shortDesc: 'Highly detailed 3D representations of existing buildings using laser scanning technology.',
    detail: 'Point cloud scanning captures millions of measured points per second, providing exact as-built data for retrofit projects, complex co-ordination, and renovation works.',
    tags: ['Laser Scanning', 'As-Built Capture', 'BIM Integration', 'Retrofit Projects'],
  },
  {
    icon: Users,
    title: 'BIM Services Management & Coordination',
    shortDesc: 'Independent BIM management working with clients and contractors to establish BIM Execution Plans.',
    detail: 'As independent BIM Managers, we work across the project lifecycle to establish and implement BIM Execution Plans, coordinate disciplines, and maintain model integrity from design through to construction.',
    tags: ['BIM Manager', 'BEP Creation', 'Multi-discipline', 'Quality Control'],
  },
];

// ─── Sectors / building types (match CRM estimator keys) ─────────────────────
export const SECTORS = [
  { key: 'office', label: 'Office / commercial' },
  { key: 'apartment', label: 'Apartment / residential' },
  { key: 'retail', label: 'Retail / shop' },
  { key: 'hospitality', label: 'Hospitality / accommodation' },
  { key: 'aged_care', label: 'Aged care / rest home' },
  { key: 'healthcare', label: 'Hospital / healthcare' },
  { key: 'carpark', label: 'Carpark' },
  { key: 'industrial', label: 'Industrial / manufacturing' },
  { key: 'warehouse', label: 'Warehouse / storage' },
  { key: 'other', label: 'Something else' },
];

// ─── Team ─────────────────────────────────────────────────────────────────────
export const TEAM = [
  {
    name: 'Mitch Buckley',
    role: 'Director & Principal Fire Protection Designer',
    bio: 'With an early background in IT as a network engineer, Mitch made a career change in 2004 and started as a sprinkler fitter, pursuing a Level 3 & 4 fixed fire protection apprenticeship. After years across all facets of the trade, including project management, contracts management, estimating, design, and technical sales with a worldwide sprinkler manufacturer, Mitch founded Sprinkler Design NZ. Outside work, Mitch is an avid triathlete, completing Ironman NZ in Taupo.',
    image: '/team-mitch.png',
    initials: 'MB',
  },
  {
    name: 'Laura Cullen',
    role: 'Fire Protection Designer',
    bio: 'Laura is a mechanical engineer with experience in Revit modelling of MEP services, having worked in the mechanical teams at Beca and WSP Consultants. She quickly adapted her skills to fire protection modelling and is passionate about delivering accurate and precise designs. Laura is currently studying a Diploma of Fire Engineering through the Open Polytechnic of NZ.',
    image: '/team-laura.png',
    initials: 'LC',
  },
];

// ─── Stats ────────────────────────────────────────────────────────────────────
export const STATS = [
  { value: '35+', label: 'Years Industry Experience' },
  { value: '500+', label: 'Projects Completed' },
  { value: '100%', label: 'NZ Code Compliance' },
  { value: '22+', label: 'Landmark Projects' },
];

// ─── Testimonials ─────────────────────────────────────────────────────────────
export const TESTIMONIALS = [
  {
    quote: 'Sprinkler Design NZ delivered exceptional BIM coordination on our hospital project. Their attention to detail and understanding of complex multi-discipline environments is second to none.',
    author: 'Senior Project Manager',
    company: 'Major NZ Construction Contractor - Healthcare Sector',
    initials: 'SP',
  },
  {
    quote: 'Their PS1 authoring and independent consulting gave us complete confidence through the consent process. Reliable, responsive, and genuinely expert.',
    author: 'Project Director',
    company: 'Auckland Commercial Development - 2024',
    initials: 'PD',
  },
  {
    quote: "We've worked with Sprinkler Design NZ across multiple stage developments. Their BIM coordination saves us significant time on site and eliminates costly reworks.",
    author: 'Mechanical & Fire Services Contractor',
    company: 'Nationwide M&E Subcontractor',
    initials: 'MF',
  },
];

// ─── FAQs ─────────────────────────────────────────────────────────────────────
export const FAQS = [
  {
    question: 'What does a PS1 author do in fire protection?',
    answer: 'A PS1 (Producer Statement 1) author is a suitably qualified fire protection designer who provides a signed design statement confirming that, to the best of their knowledge, the proposed fire protection system design will meet the requirements of the New Zealand Building Code. Sprinkler Design NZ provides PS1 authorship across all system types.',
  },
  {
    question: 'What is BIM coordination for fire protection?',
    answer: 'BIM (Building Information Modelling) coordination involves creating a detailed 3D model of the fire protection system (sprinklers, pipes, hangers) within the wider building model using tools like Autodesk Revit. This allows clash detection with structural, mechanical, and architectural elements before construction begins, eliminating costly on-site redesigns.',
  },
  {
    question: 'Do you design residential fire sprinkler systems?',
    answer: 'Yes. While we specialise in large commercial, industrial, and government projects, we also design residential fire sprinkler systems for apartments, townhouses, rural properties, and high-rise residential buildings — all to NZS 4541, NZS 4515, and NZS 4517. We run our residential sector under a separate brand. For more information on our residential services, visit resiguard.co.nz.',
    answerNode: (<>Yes. While we specialise in large commercial, industrial, and government projects, we also design residential fire sprinkler systems for apartments, townhouses, rural properties, and high-rise residential buildings — all to NZS 4541, NZS 4515, and NZS 4517. We run our residential sector under a separate brand. For more information on our residential services, visit{' '}<a href="https://www.resiguard.co.nz" target="_blank" rel="noopener noreferrer" className="text-[#4caf22] underline underline-offset-2 transition-colors hover:opacity-80">resiguard.co.nz</a>.</>),
  },
  {
    question: 'What areas of New Zealand do you service?',
    answer: 'We provide fire protection design services nationwide across New Zealand and in the Pacific Islands. Our BIM workflow means we can work remotely on any project, wherever you are.',
  },
  {
    question: 'What is 3D point cloud scanning and when is it useful?',
    answer: 'Point cloud scanning uses laser technology to capture millions of precise measurements of an existing building in minutes, creating an accurate 3D as-built model. This is particularly valuable for retrofit and refurbishment projects where existing drawings are unavailable or inaccurate, and for complex coordination in tight ceiling spaces.',
  },
];

// ─── Software ─────────────────────────────────────────────────────────────────
export const SOFTWARE = [
  'Autodesk Revit',
  'BIM360',
  'Revizto',
  'MicroBIM Fire',
  'Navisworks',
  'FireLogic',
];

// ─── Compliance / standards ───────────────────────────────────────────────────
export const STANDARDS = [
  { code: 'NZS 4541', desc: 'Automatic fire sprinkler systems — our core design standard.' },
  { code: 'NZS 4515', desc: 'Fire sprinkler systems for life safety in sleeping occupancies.' },
  { code: 'NZS 4517', desc: 'Fire sprinkler systems for houses.' },
  { code: 'NZS 4512', desc: 'Fire detection and alarm systems in buildings.' },
  { code: 'NZS 4510', desc: 'Fire hydrant systems for buildings.' },
  { code: 'NZS 4503', desc: 'Hand-operated firefighting equipment — hose reels and extinguishers.' },
  { code: 'NZBC C1–C6', desc: 'New Zealand Building Code protection-from-fire clauses.' },
  { code: 'PS1 / PS4', desc: 'Producer statements for design and construction monitoring.' },
];
