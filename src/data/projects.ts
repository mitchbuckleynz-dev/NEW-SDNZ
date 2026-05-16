/**
 * SDNZ Projects Data
 * ==================
 * SOURCE OF TRUTH: Edit PROJECTS.md in the project root, then ask Antigravity to sync.
 *
 * Image tips:
 *  - Drop images into /public/images/ and reference as "/images/my-project.jpg"
 *  - Recommended size: 960×640px minimum
 */

export interface Project {
  slug: string;
  title: string;
  category: string;
  description: string;
  /** One-liner shown on the homepage card hover */
  shortDesc: string;
  image: string;
  /** Optional: year the project was completed */
  year?: string;
  /** Optional: location */
  location?: string;
  /** Optional: highlight stats shown on the project detail */
  highlights?: { label: string; value: string }[];
  /** Optional: list of key services delivered */
  services?: string[];
  /** Set false to hide from the projects page (keeps it in code for reference) */
  published?: boolean;
}

export const PROJECTS: Project[] = [
  {
    slug: 'taranaki-base-hospital',
    title: 'Taranaki Base Hospital – Stage Two',
    category: 'Healthcare',
    year: '2024-2026',
    location: 'New Plymouth',
    description:
      'Major hospital redevelopment requiring complex multi-discipline BIM coordination and fully code-compliant fire protection design across critical care, surgical, and inpatient wings.',
    shortDesc:
      'Complex multi-discipline BIM coordination and fire protection design for a major hospital redevelopment.',
    image: '/images/taranakihospital.jpg',
    highlights: [
      { label: 'Project Value', value: '$300M+' },
      { label: 'Systems', value: 'Wet, Dry, Hydrant, Pumps, Tanks, Fabrication' },
      { label: 'BIM Platform', value: 'Revit + Revizto' },
    ],
    services: ['BIM Fire Protection Design', 'PS1 Authorship', 'Clash Detection', 'Shop Drawings'],
    published: true,
  },
  {
    slug: 'te-kaha-arena',
    title: 'Te Kaha – Canterbury Multi-Use Arena',
    category: 'Sports & Entertainment',
    year: '2024-2026',
    location: 'Christchurch',
    description:
      "One of New Zealand's most significant infrastructure projects, a world-class multi-use arena for Christchurch requiring bespoke fire suppression design for large-assembly public spaces.",
    shortDesc:
      "World-class multi-use arena, one of NZ's most significant infrastructure projects.",
    image: '/images/ONE NZ Stadium.png',
    highlights: [
      { label: 'Capacity', value: '35,000 seats' },
      { label: 'Systems', value: 'Wet, Dry, Hydrant, Tanks, Pumps' },
      { label: 'BIM Platform', value: 'Revit + Revizto' },
    ],
    services: [
      'Fire Protection Consulting',
      'Fire Protection Construction Design',
      'Specifications',
      'BIM Coordination',
      'Special Hazards',
    ],
    published: true,
  },
  {
    slug: 'the-living-pa',
    title: 'The Living Pā',
    category: 'Cultural',
    year: '2023-2025',
    location: 'Auckland',
    description:
      'A landmark cultural facility integrating traditional Māori design with modern fire protection systems to meet both heritage and compliance requirements. A unique challenge requiring sensitivity and technical precision.',
    shortDesc:
      'Heritage fire protection design for a landmark Māori cultural facility.',
    image: '/images/thelivingpa.jpg',
    highlights: [
      { label: 'Challenge', value: 'Cultural Integration' },
      { label: 'Systems', value: 'Wet Pipe, Misting' },
    ],
    services: ['Fire Protection Consulting', 'PS1 Authorship', 'Heritage Compliance'],
    published: true,
  },
  {
    slug: 'project-punga-kmart-rurakura',
    title: 'Project Punga – Kmart Rūrākura',
    category: 'Retail & Logistics',
    year: '2023',
    location: 'Hamilton',
    description:
      'Large-scale retail distribution centre fire protection design, including special hazards for high-piled storage and comprehensive BIM coordination with structural and mechanical trades.',
    shortDesc: 'Large-scale distribution centre with special hazards and full BIM coordination.',
    image: '/images/kmartpunga.png',
    highlights: [
      { label: 'Floor Area', value: '40,000m²+' },
      { label: 'Systems', value: 'ESFR, In-Rack, Special Hazards, Hydrants, 17,000 LPM' },
      { label: 'BIM Platform', value: 'Revit + Revizto' },
    ],
    services: ['BIM Coordination', 'ESFR Systems', 'Clash Detection'],
    published: true,
  },
  {
    slug: 'the-crossing-stage-2',
    title: 'The Crossing – Stage 2A & 2B',
    category: 'Commercial',
    year: '2022',
    location: 'Christchurch',
    description:
      'Mixed-use commercial development requiring staged fire protection design across multiple tenancies, with phased delivery to meet staggered construction timelines.',
    shortDesc:
      'Staged fire protection design across multiple mixed-use commercial tenancies.',
    image: '/images/thecrossing.png',
    highlights: [
      { label: 'Stages', value: '2A & 2B' },
      { label: 'Systems', value: 'Sprinklers, Fire Alarms' },
    ],
    services: ['Fire Protection Design', 'PS1 Authorship', 'Multi-tenancy Coordination'],
    published: true,
  },
  {
    slug: 'waikeria-prison',
    title: 'Waikeria Prison Development',
    category: 'Government',
    year: '2022',
    location: 'Waikeria',
    description:
      'High-security government facility requiring complex bespoke fire protection design, compliance with stringent Crown specifications, and careful coordination with security systems.',
    shortDesc:
      'Bespoke fire protection for a high-security government corrections facility.',
    image: '/images/Waikeria-6.jpg',
    highlights: [
      { label: 'Security Level', value: 'High-Security' },
      { label: 'Systems', value: 'Wet, Dry, Gaseous, Special Hazards' },
    ],
    services: ['Fire Protection Consulting', 'Government Compliance', 'PS1 & PS4'],
    published: true,
  },
  {
    slug: 'whangarei-civic-centre',
    title: 'Whangārei Civic Centre',
    category: 'Civic',
    year: '2023',
    location: 'Whangārei',
    description:
      'New civic precinct requiring detailed BIM coordination and fire protection design for public assembly buildings, council chambers, and associated car parking structures.',
    shortDesc:
      'BIM-led fire protection design for a new civic precinct and public assembly buildings.',
    image: '/images/whangareicivi.png',
    highlights: [
      { label: 'Type', value: 'Public Assembly' },
      { label: 'BIM Platform', value: 'Revit + Revizto' },
    ],
    services: ['BIM Coordination', 'Fire Protection Design', 'Clash Detection'],
    published: true,
  },
  {
    slug: 'aalto',
    title: 'AALTO',
    category: 'Residential',
    year: '2022',
    location: 'Auckland',
    description:
      'Premium high-rise residential development with integrated BIM fire protection design and multi-discipline coordination across structural, mechanical, and electrical trades.',
    shortDesc:
      'Premium high-rise residential BIM fire protection design and multi-discipline coordination.',
    image: '/images/aalto.jpg',
    highlights: [
      { label: 'Type', value: 'High-Rise Residential' },
      { label: 'Systems', value: 'Wet Pipe, Misting' },
      { label: 'BIM Platform', value: 'Revit + BIM360' },
    ],
    services: ['BIM Fire Protection Design', 'Multi-discipline Coordination', 'Shop Drawings'],
    published: true,
  },
];

/** Helper: get only published projects */
export const getPublishedProjects = () =>
  PROJECTS.filter((p) => p.published !== false);
