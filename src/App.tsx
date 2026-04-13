/**
 * Sprinkler Design NZ â€” New Website
 * Merged from GitHub AI Studio base + sprinklerdesign.co.nz content
 * Enhanced with SEO schema, premium UI/UX, and full content from old site.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPublishedProjects } from './data/projects';
import { motion, AnimatePresence, useInView } from 'motion/react';
import {
  Flame,
  Shield,
  Building2,
  FileText,
  Users,
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Scan,
  Zap,
  Award,
  Briefcase,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';

// ============================================================
// DATA
// ============================================================

const NAV_LINKS = [
  { name: 'Home', href: '#home' },
  { name: 'Services', href: '#services' },
  { name: 'About', href: '#about' },
  { name: 'Projects', href: '#projects' },
  { name: 'Careers', href: '#careers' },
  { name: 'Contact', href: '#contact' },
];

const SERVICES = [
  {
    icon: Shield,
    title: 'Fire Protection Consultant',
    shortDesc: 'Independent, end-to-end fire protection consultancy from preliminary concept to detailed design.',
    detail: 'Our fire protection consulting services include water supply assessments, specifications, PS1 authorship, PS4 construction monitoring, and code compliance across all system types.',
    tags: ['Fire Sprinklers', 'Fire Alarms', 'PS1 Author', 'PS4 Monitor', 'Gas Suppression'],
    color: 'from-green-500/20 to-emerald-600/10',
    accentColor: '#4ade80',
    href: '#services',
  },
  {
    icon: Building2,
    title: 'BIM Fire Protection Design & Coordination',
    shortDesc: 'Precise 3D modelling and coordination using Autodesk Revit, BIM360 & Revizto.',
    detail: 'Detailed project models enabling quick and accurate shop drawings, eliminating costly redesigns. We integrate fully with your BIM environment for clash-free outcomes.',
    tags: ['Revit', 'BIM360', 'Revizto', 'Clash Detection', 'Shop Drawings'],
    color: 'from-cyan-500/20 to-blue-600/10',
    accentColor: '#22d3ee',
    href: '#services',
  },
  {
    icon: FileText,
    title: 'Fire Protection Design for Construction',
    shortDesc: 'Full lifecycle design from concept through to final construction documentation.',
    detail: 'Sprinkler Design NZ provides end-to-end fire protection design services, ranging from initial concept to the final construction stage, tailored to every project type.',
    tags: ['Deluge & Preaction', 'Foam Suppression', 'Water Spray', 'Construction Docs'],
    color: 'from-orange-500/20 to-red-600/10',
    accentColor: '#fb923c',
    href: '#services',
  },
  {
    icon: Zap,
    title: 'Special Hazards',
    shortDesc: 'Bespoke fire suppression solutions for high-risk and complex environments.',
    detail: 'Our team specialises in designing comprehensive fire protection systems tailored to the unique requirements of special hazards environments including gas suppression, foam, and water spray systems.',
    tags: ['Gas Suppression', 'Foam Systems', 'Water Spray', 'Deluge'],
    color: 'from-yellow-500/20 to-amber-600/10',
    accentColor: '#facc15',
    href: '#services',
  },
  {
    icon: Scan,
    title: '3D Point Cloud Scanning',
    shortDesc: 'Highly detailed 3D representations of existing buildings using laser scanning technology.',
    detail: 'Point cloud scanning captures millions of measured points per second, providing exact as-built data for retrofit projects, complex co-ordination, and renovation works.',
    tags: ['Laser Scanning', 'As-Built Capture', 'BIM Integration', 'Retrofit Projects'],
    color: 'from-violet-500/20 to-purple-600/10',
    accentColor: '#a78bfa',
    href: '#services',
  },
  {
    icon: Users,
    title: 'BIM Services Management & Coordination',
    shortDesc: 'Independent BIM management working with clients and contractors to establish BIM Execution Plans.',
    detail: 'As independent BIM Managers, we work across the project lifecycle to establish and implement BIM Execution Plans, coordinate disciplines, and maintain model integrity from design through to construction.',
    tags: ['BIM Manager', 'BEP Creation', 'Multi-discipline', 'Quality Control'],
    color: 'from-pink-500/20 to-rose-600/10',
    accentColor: '#f472b6',
    href: '#services',
  },
];

// PROJECTS now imported from src/data/projects.ts â€” edit that file to add/remove projects.
const PROJECTS = getPublishedProjects();

const TEAM = [
  {
    name: 'Mitch Buckley',
    role: 'Director & Principal Fire Protection Designer',
    bio: 'With an early background in IT as a network engineer, Mitch made a career change in 2004 and started as a sprinkler fitter, pursuing a Level 3 & 4 fixed fire protection apprenticeship. After years across all facets of the trade â€” project management, contracts management, estimating, design, and technical sales with a worldwide sprinkler manufacturer â€” Mitch founded Sprinkler Design NZ. Outside work, Mitch is an avid triathlete, completing Ironman NZ in Taupo.',
    image: '/team-mitch.png',
    initials: 'MB',
    color: 'from-green-400 to-emerald-600',
  },
  {
    name: 'Josef Thompson-Smith',
    role: 'Senior Fire Protection Designer & BIM Manager',
    bio: 'Josef brings over 7 years of experience in fire protection design with extensive expertise in 3D modelling and coordination using Revit, BIM360 & Revizto platforms. As our in-house BIM Manager, Josef works across his own design projects while providing team training, maintaining templates, and overseeing project coordination. In his spare time he enjoys surfing and snowboarding.',
    image: '/team-josef.png',
    initials: 'JT',
    color: 'from-cyan-400 to-blue-600',
  },
  {
    name: 'Laura Cullen',
    role: 'Fire Protection Designer',
    bio: 'Laura is a mechanical engineer with experience in Revit modelling of MEP services, having worked in the mechanical teams at Beca and WSP Consultants. She quickly adapted her skills to fire protection modelling and is passionate about delivering accurate and precise designs. Laura is currently studying a Diploma of Fire Engineering through the Open Polytechnic of NZ.',
    image: '/team-laura.png',
    initials: 'LC',
    color: 'from-violet-400 to-purple-600',
  },
];

const STATS = [
  { value: '20+', label: 'Years Industry Experience' },
  { value: '500+', label: 'Projects Completed' },
  { value: '100%', label: 'NZ Code Compliance' },
  { value: '8', label: 'Landmark Projects' },
];

const TESTIMONIALS = [
  {
    quote: 'Sprinkler Design NZ delivered exceptional BIM coordination on our hospital project. Their attention to detail and understanding of complex multi-discipline environments is second to none.',
    author: 'Senior Project Manager',
    company: 'Major NZ Construction Contractor â€” Healthcare Sector',
    initials: 'SP',
    color: 'from-green-400 to-emerald-600',
  },
  {
    quote: 'Their PS1 authoring and independent consulting gave us complete confidence through the consent process. Reliable, responsive, and genuinely expert.',
    author: 'Project Director',
    company: 'Auckland Commercial Development â€” 2024',
    initials: 'PD',
    color: 'from-cyan-400 to-blue-600',
  },
  {
    quote: "We've worked with Sprinkler Design NZ across multiple stage developments. Their BIM coordination saves us significant time on site and eliminates costly reworks.",
    author: 'Mechanical & Fire Services Contractor',
    company: 'Nationwide M&E Subcontractor',
    initials: 'MF',
    color: 'from-violet-400 to-purple-600',
  },
];

const FAQS = [
  {
    question: 'What does a PS1 author do in fire protection?',
    answer: 'A PS1 (Producer Statement 1) author is a suitably qualified fire protection designer who provides a signed design statement confirming that, to the best of their knowledge, the proposed fire protection system design will meet the requirements of the New Zealand Building Code. Sprinkler Design NZ provides PS1 authorship across all system types.',
  },
  {
    question: 'What is BIM coordination for fire protection?',
    answer: 'BIM (Building Information Modelling) coordination involves creating a detailed 3D model of the fire protection system (sprinklers, pipes, hangers) within the wider building model using tools like Autodesk Revit. This allows clash detection with structural, mechanical, and architectural elements before construction begins â€” eliminating costly on-site redesigns.',
  },
  {
    question: 'Do you design residential fire sprinkler systems?',
    answer: 'Yes. While we specialise in large commercial, industrial, and government projects, we also design residential fire sprinkler systems for apartments, townhouses, and high-rise residential buildings â€” all to NZS 4541 and relevant standards.',
  },
  {
    question: 'What areas of New Zealand do you service?',
    answer: 'We provide fire protection design services nationwide across New Zealand, including Auckland, Wellington, Christchurch, Hamilton, Tauranga, Dunedin, and all regions. Our BIM workflow means we can work remotely on any project across New Zealand.',
  },
  {
    question: 'What is 3D point cloud scanning and when is it useful?',
    answer: 'Point cloud scanning uses laser technology to capture millions of precise measurements of an existing building in minutes, creating an accurate 3D as-built model. This is particularly valuable for retrofit and refurbishment projects where existing drawings are unavailable or inaccurate, and for complex coordination in tight ceiling spaces.',
  },
];

const SOFTWARE = [
  'Autodesk Revit',
  'BIM360',
  'Revizto',
  'MicroBIM Fire',
  'Navisworks',
  'FireLogic',
];

// ============================================================
// ANIMATED COUNTER
// ============================================================
const AnimatedStat = ({ value, label }: { value: string; label: string }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="text-center"
    >
      <p className="stat-number text-4xl md:text-5xl font-bold mb-2">{value}</p>
      <p className="text-slate-400 text-sm uppercase tracking-wider font-medium">{label}</p>
    </motion.div>
  );
};

// ============================================================
// NAVBAR
// ============================================================
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
      // Active section tracking
      const sections = NAV_LINKS.map(l => l.href.replace('#', ''));
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      id="navbar"
      className={`fixed w-full z-50 transition-all duration-500 ${isScrolled ? 'nav-scrolled py-3' : 'nav-transparent py-5'}`}
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-3 group" aria-label="Sprinkler Design NZ - Home">
            <div className="relative">
              <img
                src="/logo.png"
                alt="Sprinkler Design NZ logo"
                className="w-32 h-32 object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Sprinkler<span className="text-green-400">Design</span>
              <span className="ml-1 text-xs font-normal uppercase tracking-widest text-slate-500">NZ</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8" role="menubar">
            {NAV_LINKS.map((link) => {
              const id = link.href.replace('#', '');
              const isActive = activeSection === id;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  role="menuitem"
                  className={`relative text-sm font-medium transition-colors duration-200 cursor-pointer pb-1 ${
                    isActive ? 'nav-link-active' : 'text-slate-400 hover:text-green-400'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
            <a
              href="#contact"
              id="navbar-cta"
              className="btn-primary px-6 py-2.5 text-sm font-bold cursor-pointer rounded-sm"
            >
              Get a Quote
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white p-2 cursor-pointer transition-colors hover:text-green-400"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden mobile-menu-bg border-t border-white/5 overflow-hidden"
            role="menu"
          >
            <div className="px-4 pt-4 pb-8 space-y-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  role="menuitem"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 text-base font-medium text-slate-300 hover:text-green-400 hover:bg-white/5 transition-colors cursor-pointer"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-4">
                <a
                  href="#contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="btn-primary block w-full text-center px-5 py-4 font-bold cursor-pointer"
                >
                  Get a Quote
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// ============================================================
// HERO
// ============================================================
const Hero = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-20 overflow-hidden"
      aria-label="Hero section"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0 bg-hero-dark" />
      <div className="absolute inset-0 z-0 dot-grid opacity-60" />
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=2000"
          alt=""
          role="presentation"
          className="w-full h-full object-cover opacity-10"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-950/80 to-emerald-950/20" />
      </div>

      {/* Glow orbs - richer */}
      <div className="absolute top-1/4 -left-60 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/3 -right-60 w-[400px] h-[400px] bg-cyan-500/8 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/4 rounded-full blur-[120px] pointer-events-none" />

      {/* Beam decoration */}
      <div className="hero-beam top-1/3 left-0" style={{ animationDelay: '0s' }} aria-hidden="true" />
      <div className="hero-beam top-2/3 left-0 opacity-50" style={{ animationDelay: '3.5s', width: '140px' }} aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-16">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <div className="section-label mb-8">
              <Shield className="w-3 h-3" aria-hidden="true" />
              Trusted Fire Protection Experts Â· New Zealand
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-extrabold text-white leading-[0.93] mb-8 tracking-tight">
              Your trusted partner for top-notch{' '}
              <span className="text-gradient">BIM Fire Protection</span>{' '}
              Design &amp; Consulting.
            </h1>

            <p className="text-lg md:text-xl text-slate-400 mb-10 leading-relaxed max-w-2xl font-light">
              Unleashing the power of BIM â€” we ignite excellence in fire protection across New Zealand with decades of industry expertise.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#services"
                id="hero-services-cta"
                className="btn-primary inline-flex items-center justify-center gap-2 px-10 py-4 font-bold text-base cursor-pointer rounded-sm"
              >
                Explore Our Services
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </a>
              <a
                href="#projects"
                id="hero-projects-cta"
                className="btn-secondary inline-flex items-center justify-center gap-2 px-10 py-4 font-bold text-base cursor-pointer rounded-sm"
              >
                View Our Work
              </a>
            </div>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 stats-bar pt-10"
          >
            {STATS.map((stat) => (
              <AnimatedStat key={stat.label} value={stat.value} label={stat.label} />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
      >
        <div className="scroll-track" />
        <span className="text-slate-600 text-[10px] uppercase tracking-[0.2em] mt-1">Scroll</span>
      </motion.div>
    </section>
  );
};

// ============================================================
// SERVICES
// ============================================================
const Services = () => {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section id="services" className="py-28 bg-slate-950 relative overflow-hidden" aria-labelledby="services-heading">
      <div className="dot-grid absolute inset-0 opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="section-label mb-6 inline-flex">
            <Flame className="w-3 h-3" aria-hidden="true" />
            What We Do
          </div>
          <h2 id="services-heading" className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            Comprehensive Fire<br />
            <span className="text-gradient">Protection Solutions</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            From initial concept to final construction documentation â€” leveraging the very best in BIM technology to deliver precise, compliant fire protection across New Zealand.
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((service, index) => {
            const isOpen = expanded === service.title;
            return (
              <motion.article
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.07, duration: 0.5, ease: 'easeOut' }}
                className="card-glass card-glow p-8 cursor-pointer group relative overflow-hidden"
                onClick={() => setExpanded(isOpen ? null : service.title)}
                role="button"
                aria-expanded={isOpen}
                aria-controls={`service-detail-${index}`}
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setExpanded(isOpen ? null : service.title)}
              >
                {/* Top accent line on hover */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(90deg, transparent, ${service.accentColor}, transparent)` }}
                  aria-hidden="true"
                />

                {/* Icon â€” uses per-service accent */}
                <div
                  className="w-14 h-14 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border"
                  style={{
                    background: `linear-gradient(135deg, ${service.accentColor}18, ${service.accentColor}08)`,
                    borderColor: `${service.accentColor}30`,
                  }}
                >
                  <service.icon className="w-7 h-7" style={{ color: service.accentColor }} aria-hidden="true" />
                </div>

                <h3 className="text-lg font-bold text-white mb-3 leading-snug">{service.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">{service.shortDesc}</p>

                {/* Expanded detail */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      id={`service-detail-${index}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="text-slate-300 text-sm leading-relaxed mb-4 border-t border-white/10 pt-4">
                        {service.detail}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-2 mb-5">
                  {service.tags.map((tag) => (
                    <span key={tag} className="service-tag">{tag}</span>
                  ))}
                </div>

                {/* Learn more */}
                <button
                  className="inline-flex items-center gap-1.5 text-sm font-semibold transition-all duration-200 hover:gap-2.5"
                  style={{ color: service.accentColor }}
                  aria-label={`${isOpen ? 'Show less' : 'Learn more'} about ${service.title}`}
                >
                  {isOpen ? 'Show Less' : 'Learn More'}
                  <ChevronRight
                    className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}
                    aria-hidden="true"
                  />
                </button>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ============================================================
// ABOUT
// ============================================================
const About = () => {
  return (
    <section id="about" className="py-28 relative overflow-hidden bg-slate-900" aria-labelledby="about-heading">
      {/* Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section intro */}
        <div className="text-center mb-20">
          <div className="section-label mb-6 inline-flex">
            <Users className="w-3 h-3" aria-hidden="true" />
            About Us
          </div>
          <h2 id="about-heading" className="text-4xl md:text-6xl font-extrabold text-white mb-6">
            Fire Protection Design{' '}
            <span className="text-gradient">Consultancy</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Sprinkler Design NZ is New Zealand's leading independent fire protection design consultancy, combining deep trade knowledge with the latest BIM technology.
          </p>
        </div>

        {/* Company overview */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative overflow-hidden shadow-2xl shadow-black/50" style={{ minHeight: '480px' }}>
              <img
                src="/images/pump room.jfif"
                alt="BIM fire protection model in Revit â€” Sprinkler Design NZ"
                className="w-full h-full object-cover"

              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-green-400 to-emerald-600 p-6 shadow-xl shadow-green-500/30">
              <p className="text-4xl font-bold font-serif text-white mb-0.5">30+</p>
              <p className="text-xs font-bold text-white/80 uppercase tracking-wider">Years Expertise</p>
            </div>

          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <h3 className="text-3xl font-extrabold text-white mb-6 leading-tight">
              Your Reliable Partner for Exceptional BIM Fire Protection Design
            </h3>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              With decades of industry expertise, Sprinkler Design NZ provides comprehensive solutions including professional consulting, BIM coordination, and construction documentation. We pride ourselves on attention to detail and precision, ensuring each project is executed to the highest standard.
            </p>

            <div className="space-y-4 mb-10">
              {[
                'High-quality, efficient fire protection services',
                'Cost-effective solutions tailored to your unique needs',
                'Decades of deep industry knowledge across all facets',
                'Advanced BIM coordination & clash detection using Revit',
                'Independent consultancy â€” no conflicts of interest',
                'PS1 authorship and PS4 construction monitoring',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="text-green-400 w-5 h-5 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-slate-300 text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>

            <a
              href="#contact"
              id="about-cta"
              className="btn-primary inline-flex items-center gap-2 px-8 py-4 font-bold cursor-pointer"
            >
              Work With Us
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
          </motion.div>
        </div>

        {/* Team */}
        <div>
          <h3 className="text-3xl font-extrabold text-white mb-12 text-center">Meet the Team</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {TEAM.map((member, index) => (
              <motion.article
                key={member.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="team-card p-8"
              >
                {/* Avatar */}
                <div className="w-24 h-24 rounded-full overflow-hidden mb-6 shadow-lg ring-2 ring-white/10">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="text-xl font-bold text-white mb-1">{member.name}</h4>
                <p className="text-green-400 text-sm font-semibold mb-4">{member.role}</p>
                <p className="text-slate-400 text-sm leading-relaxed">{member.bio}</p>
              </motion.article>
            ))}
          </div>
        </div>

        {/* Software */}
        <div className="mt-24 text-center">
          <p className="text-slate-500 text-xs uppercase tracking-[0.18em] mb-8 font-semibold">Industry-Leading Software We Use</p>
          <div className="flex flex-wrap justify-center gap-3">
            {SOFTWARE.map((sw) => (
              <span
                key={sw}
                className="software-pill px-5 py-2.5 text-slate-300 text-sm font-medium cursor-default"
              >
                {sw}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================================
// PROJECTS â€” Split-layout carousel (image fan + info panel)
// ============================================================

const ProjectsCarousel = ({ featured, navigate }: { featured: typeof PROJECTS; navigate: ReturnType<typeof useNavigate> }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [containerW, setContainerW] = useState(600);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const n = featured.length;
  const project = featured[activeIndex];

  // Measure image container width for responsive gap
  useEffect(() => {
    const el = imageContainerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setContainerW(el.offsetWidth));
    ro.observe(el);
    setContainerW(el.offsetWidth);
    return () => ro.disconnect();
  }, []);

  // Autoplay
  useEffect(() => {
    autoplayRef.current = setInterval(() => setActiveIndex(i => (i + 1) % n), 5000);
    return () => { if (autoplayRef.current) clearInterval(autoplayRef.current); };
  }, [n]);

  // Keyboard nav
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const resetAutoplay = () => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => setActiveIndex(i => (i + 1) % n), 5000);
  };

  const handleNext = () => { setActiveIndex(i => (i + 1) % n); resetAutoplay(); };
  const handlePrev = () => { setActiveIndex(i => (i - 1 + n) % n); resetAutoplay(); };

  // 3-card fan: active centred, prev/next angled behind
  const getImgStyle = (idx: number): React.CSSProperties => {
    const gap = Math.min(80, containerW * 0.13);
    const isActive = idx === activeIndex;
    const isLeft = (activeIndex - 1 + n) % n === idx;
    const isRight = (activeIndex + 1) % n === idx;
    if (isActive) return {
      zIndex: 3, opacity: 1, pointerEvents: 'auto',
      transform: 'translateX(0) translateY(0) scale(1) rotateY(0deg)',
      transition: 'all 0.75s cubic-bezier(.4,2,.3,1)',
    };
    if (isLeft) return {
      zIndex: 2, opacity: 1, pointerEvents: 'auto',
      transform: `translateX(-${gap}px) translateY(-${gap * 0.65}px) scale(0.84) rotateY(14deg)`,
      transition: 'all 0.75s cubic-bezier(.4,2,.3,1)',
    };
    if (isRight) return {
      zIndex: 2, opacity: 1, pointerEvents: 'auto',
      transform: `translateX(${gap}px) translateY(-${gap * 0.65}px) scale(0.84) rotateY(-14deg)`,
      transition: 'all 0.75s cubic-bezier(.4,2,.3,1)',
    };
    return { zIndex: 1, opacity: 0, pointerEvents: 'none', transition: 'all 0.75s cubic-bezier(.4,2,.3,1)' };
  };

  return (
    <div className="grid md:grid-cols-2 gap-10 lg:gap-20 items-center">

      {/* â”€â”€ LEFT: stacked images â”€â”€ */}
      <div ref={imageContainerRef} className="relative h-[340px] sm:h-[420px]" style={{ perspective: '1200px' }}>
        {featured.map((p, idx) => {
          const isActive = idx === activeIndex;
          const imgStyle = getImgStyle(idx);
          return (
            <div
              key={p.slug || p.title}
              onClick={() => { setActiveIndex(idx); resetAutoplay(); }}
              style={{
                ...imgStyle,
                position: 'absolute',
                inset: 0,
                borderRadius: '1rem',
                overflow: 'hidden',
                cursor: 'pointer',
                boxShadow: isActive
                  ? '0 32px 64px -12px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.08), 0 8px 24px -4px rgba(0,0,0,0.6)'
                  : '0 20px 40px -8px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.04)',
              }}
            >
              <img
                src={p.image}
                alt={p.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          );
        })}
        {/* Slide counter badge */}
        <div className="absolute bottom-4 left-4 z-10 bg-slate-950/70 backdrop-blur-sm border border-white/10 px-3 py-1.5 rounded-full text-slate-400 text-xs font-mono">
          {String(activeIndex + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
        </div>
      </div>

      {/* â”€â”€ RIGHT: project info â”€â”€ */}
      <div className="flex flex-col justify-between min-h-[340px] sm:min-h-[420px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="flex-1"
          >
            {/* Category badge */}
            <div className="project-category-badge mb-4 inline-block">{project.category}</div>

            {/* Title */}
            <h3 className="text-white text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight mb-3">
              {project.title}
            </h3>

            {/* Location Â· Year */}
            {'location' in project && 'year' in project && (
              <p className="text-slate-500 text-sm mb-5 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-green-500" aria-hidden="true" />
                {(project as any).location}
                <span className="text-slate-700">Â·</span>
                {(project as any).year}
              </p>
            )}

            {/* Description â€” word-by-word blur entrance */}
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              {project.description.split(' ').map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ filter: 'blur(8px)', opacity: 0, y: 4 }}
                  animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, ease: 'easeOut', delay: 0.02 * i }}
                  style={{ display: 'inline-block', marginRight: '0.25em' }}
                >
                  {word}
                </motion.span>
              ))}
            </p>

            {/* Highlights */}
            {'highlights' in project && Array.isArray((project as any).highlights) && (project as any).highlights.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {(project as any).highlights.map((h: { label: string; value: string }, i: number) => (
                  <div key={i} className="flex flex-col items-start bg-slate-900 border border-slate-800 px-3 py-2 rounded-lg">
                    <span className="text-green-400 text-sm font-extrabold leading-none">{h.value}</span>
                    <span className="text-slate-500 text-xs mt-0.5">{h.label}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Nav controls + CTA */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              className="w-10 h-10 flex items-center justify-center border border-slate-700 hover:border-green-500/50 hover:bg-green-500/10 text-slate-400 hover:text-green-400 transition-all duration-200 rounded-full cursor-pointer bg-transparent"
              aria-label="Previous project"
            >
              <ChevronRight className="w-4 h-4 rotate-180" aria-hidden="true" />
            </button>
            <button
              onClick={handleNext}
              className="w-10 h-10 flex items-center justify-center border border-slate-700 hover:border-green-500/50 hover:bg-green-500/10 text-slate-400 hover:text-green-400 transition-all duration-200 rounded-full cursor-pointer bg-transparent"
              aria-label="Next project"
            >
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>

            {/* Dot indicators */}
            <div className="flex items-center gap-1.5 ml-1">
              {featured.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setActiveIndex(i); resetAutoplay(); }}
                  className={`rounded-full transition-all duration-300 cursor-pointer border-0 p-0 ${i === activeIndex ? 'w-5 h-2 bg-green-400' : 'w-2 h-2 bg-slate-700 hover:bg-slate-500'}`}
                  aria-label={`Go to project ${i + 1}`}
                />
              ))}
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

const Projects = () => {
  const navigate = useNavigate();
  const featured = PROJECTS.slice(0, 4);

  return (
    <section id="projects" className="py-28 bg-slate-950 relative overflow-hidden" aria-labelledby="projects-heading">
      {/* Background depth */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-green-500/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[400px] bg-blue-500/3 rounded-full blur-[100px]" />
        <div className="dot-grid absolute inset-0 opacity-20" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <div className="section-label mb-6 inline-flex">
              <Building2 className="w-3 h-3" aria-hidden="true" />
              Our Work
            </div>
            <h2 id="projects-heading" className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">
              Featured <span className="text-gradient">Projects</span>
            </h2>
          </div>
          <button
            onClick={() => { navigate('/projects'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            id="projects-view-all"
            className="group flex items-center gap-2 px-5 py-2.5 border border-green-500/40 text-green-400 hover:bg-green-500 hover:text-slate-900 hover:border-green-500 font-bold text-sm transition-all duration-200 cursor-pointer bg-transparent"
            aria-label="View all projects"
          >
            View All Projects
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" aria-hidden="true" />
          </button>
        </div>

        {/* â”€â”€ Split-layout carousel â”€â”€ */}
        <ProjectsCarousel featured={featured} navigate={navigate} />
      </div>
    </section>
  );
};

// ============================================================
// CAREERS
// ============================================================
const Careers = () => (
  <section id="careers" className="py-28 bg-slate-900 relative overflow-hidden" aria-labelledby="careers-heading">
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-green-500/6 rounded-full blur-3xl" />
    </div>

    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
      <div className="section-label mb-6 inline-flex">
        <Briefcase className="w-3 h-3" aria-hidden="true" />
        Join Our Team
      </div>
      <h2 id="careers-heading" className="text-4xl md:text-6xl font-extrabold text-white mb-6">
        Propel Your <span className="text-gradient">Career</span>
      </h2>
      <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
        At Sprinkler Design NZ, we combine extensive expertise with a genuine care for your growth. Join a team that's shaping the future of fire protection in New Zealand.
      </p>
      <p className="text-slate-400 mb-12 max-w-xl mx-auto">
        We are currently looking for passionate <strong className="text-white">Sprinkler Designers</strong>. If you have experience in fire protection design or BIM coordination, we'd love to hear from you.
      </p>

      <div className="grid md:grid-cols-3 gap-5 mb-12 text-left">
        {[
          { icon: Award, title: 'Industry Leaders', desc: 'Work on landmark NZ projects including hospitals, arenas, prisons, and civic centres.' },
          { icon: Zap, title: 'Cutting-Edge Tech', desc: 'Use the latest BIM tools â€” Revit, BIM360, Revizto, and point cloud scanning.' },
          { icon: Users, title: 'Great Team Culture', desc: 'A tight-knit, experienced team that values learning, mentorship, and work-life balance.' },
        ].map((item) => (
          <div key={item.title} className="benefit-card p-6">
            <div className="w-12 h-12 flex items-center justify-center mb-4 border border-green-500/20" style={{ background: 'rgba(74,222,128,0.08)' }}>
              <item.icon className="w-6 h-6 text-green-400" aria-hidden="true" />
            </div>
            <h3 className="text-white font-bold mb-2">{item.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      <a
        href="mailto:info@sprinklerdesign.co.nz?subject=Career Enquiry â€” Sprinkler Designer"
        id="careers-apply-cta"
        className="btn-primary inline-flex items-center gap-2 px-10 py-5 font-bold text-lg cursor-pointer"
      >
        Apply Now
        <ArrowRight className="w-5 h-5" aria-hidden="true" />
      </a>
    </div>
  </section>
);

// ============================================================
// TESTIMONIALS
// ============================================================
const Testimonials = () => (
  <section id="testimonials" className="py-28 bg-slate-950 relative overflow-hidden" aria-labelledby="testimonials-heading">
    <div className="dot-grid absolute inset-0 opacity-20 pointer-events-none" />
    {/* Ambient glow */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-green-500/5 rounded-full blur-[80px] pointer-events-none" />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="text-center mb-16">
        <div className="section-label mb-6 inline-flex">
          <Award className="w-3 h-3" aria-hidden="true" />
          Client Feedback
        </div>
        <h2 id="testimonials-heading" className="text-4xl md:text-5xl font-extrabold text-white">
          Trusted by <span className="text-gradient">New Zealand's Best</span>
        </h2>
        <p className="text-slate-500 mt-4 max-w-xl mx-auto text-sm">What project managers, directors, and contractors say about working with us.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-5">
        {TESTIMONIALS.map((item, index) => (
          <motion.blockquote
            key={item.author}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.12, duration: 0.5 }}
            className="card-glass testimonial-card p-8 flex flex-col gap-6 hover:border-green-500/20 transition-colors duration-300"
          >
            <p className="text-slate-300 text-sm leading-[1.85] flex-1 pt-6">{item.quote}</p>
            <footer className="flex items-center gap-4 border-t border-white/6 pt-5">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg`}>
                {item.initials}
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{item.author}</p>
                <p className="text-slate-500 text-xs mt-0.5">{item.company}</p>
              </div>
            </footer>
          </motion.blockquote>
        ))}
      </div>
    </div>
  </section>
);

// ============================================================
// FAQ
// ============================================================
const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <section id="faq" className="py-28 bg-slate-900 relative overflow-hidden" aria-labelledby="faq-heading">
      {/* FAQPage JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQS.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: { '@type': 'Answer', text: faq.answer },
            })),
          }),
        }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="section-label mb-6 inline-flex">
            <ChevronDown className="w-3 h-3" aria-hidden="true" />
            Common Questions
          </div>
          <h2 id="faq-heading" className="text-4xl md:text-5xl font-extrabold text-white">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
        </div>
        <div className="space-y-2.5">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06, duration: 0.4 }}
                className="card-glass faq-item overflow-hidden"
                data-open={isOpen}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer group"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className={`font-semibold text-sm transition-colors duration-200 ${isOpen ? 'text-green-400' : 'text-white group-hover:text-green-300'}`}>
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-green-400 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${index}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-6 text-slate-400 text-sm leading-relaxed border-t border-white/8 pt-4">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ============================================================
// CONTACT
// ============================================================
const Contact = () => {
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '', submitted: false });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In production, wire to a form backend or Netlify Forms
    setFormState((prev) => ({ ...prev, submitted: true }));
  };

  return (
    <section id="contact" className="py-28 bg-slate-950 relative overflow-hidden" aria-labelledby="contact-heading">
      {/* Background pattern */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 right-0 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-start">
          {/* Info column */}
          <div>
            <div className="section-label mb-6 inline-flex">
              <Phone className="w-3 h-3" aria-hidden="true" />
              Get In Touch
            </div>
            <h2 id="contact-heading" className="text-4xl md:text-6xl font-extrabold text-white mb-6">
              Let's Discuss Your <span className="text-gradient">Next Project</span>
            </h2>
            <p className="text-xl text-slate-400 mb-12 leading-relaxed">
              Ready to elevate your fire protection design? Get in touch with our experts today for an obligation-free consultation.
            </p>

            <div className="space-y-6">
              {[
                { icon: Phone, label: 'Call Us', value: '0800 113 996', href: 'tel:0800113996' },
                { icon: Mail, label: 'Email Us', value: 'info@sprinklerdesign.co.nz', href: 'mailto:info@sprinklerdesign.co.nz' },
                { icon: MapPin, label: 'Location', value: 'Auckland Â· Wellington Â· Christchurch Â· Nationwide', href: null },
              ].map((item) => (
                <div key={item.label} className="contact-icon-block flex items-start gap-5">
                  <div
                    className="w-12 h-12 flex items-center justify-center flex-shrink-0 border border-green-500/20 transition-all duration-300 hover:border-green-500/50"
                    style={{ background: 'rgba(74,222,128,0.07)' }}
                  >
                    <item.icon className="text-green-400 w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-slate-500 text-[10px] uppercase tracking-[0.15em] mb-1.5 font-semibold">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="text-base font-semibold text-white hover:text-green-400 transition-colors cursor-pointer">
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-base font-semibold text-white">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="card-glass p-8 md:p-12"
          >
            {formState.submitted ? (
              <div className="text-center py-12">
                <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" aria-hidden="true" />
                <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                <p className="text-slate-400">Thank you for reaching out. We'll be in touch shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6" noValidate aria-label="Contact form">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="contact-name" className="block text-sm font-semibold text-slate-300 mb-2">Full Name *</label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      autoComplete="name"
                      className="input-dark w-full px-4 py-3 text-white"
                      placeholder="John Smith"
                      value={formState.name}
                      onChange={(e) => setFormState((p) => ({ ...p, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-sm font-semibold text-slate-300 mb-2">Email Address *</label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      autoComplete="email"
                      className="input-dark w-full px-4 py-3 text-white"
                      placeholder="john@company.co.nz"
                      value={formState.email}
                      onChange={(e) => setFormState((p) => ({ ...p, email: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="contact-subject" className="block text-sm font-semibold text-slate-300 mb-2">Subject</label>
                  <input
                    id="contact-subject"
                    type="text"
                    className="input-dark w-full px-4 py-3 text-white"
                    placeholder="Project Inquiry / Quote Request"
                    value={formState.subject}
                    onChange={(e) => setFormState((p) => ({ ...p, subject: e.target.value }))}
                  />
                </div>
                <div>
                  <label htmlFor="contact-message" className="block text-sm font-semibold text-slate-300 mb-2">Message *</label>
                  <textarea
                    id="contact-message"
                    required
                    rows={5}
                    className="input-dark w-full px-4 py-3 text-white resize-none"
                    placeholder="Tell us about your project â€” type, location, stage, timeline..."
                    value={formState.message}
                    onChange={(e) => setFormState((p) => ({ ...p, message: e.target.value }))}
                  />
                </div>
                <button
                  type="submit"
                  id="contact-submit"
                  className="btn-primary w-full py-4 text-lg font-bold cursor-pointer"
                >
                  Send Message
                </button>
                <p className="text-slate-500 text-xs text-center">
                  We typically respond within 1 business day.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ============================================================
// FOOTER
// ============================================================
const Footer = () => (
  <footer className="bg-slate-950 border-t border-white/5 pt-20 pb-10" aria-label="Site footer">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        {/* Brand */}
        <div className="space-y-5">
          <a href="#home" className="flex items-center gap-3" aria-label="Sprinkler Design NZ - Back to top">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
              <Flame className="text-white w-5 h-5" aria-hidden="true" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              Sprinkler<span className="text-green-400">Design</span>
              <span className="ml-1 text-xs font-normal uppercase tracking-widest text-slate-500">NZ</span>
            </span>
          </a>
          <p className="text-slate-500 text-sm leading-relaxed">
            Leading the way in BIM-driven fire protection design and consulting across New Zealand. Decades of expertise at your service.
          </p>
          <div className="flex gap-3">
            <a href="tel:0800113996" className="text-slate-400 hover:text-green-400 transition-colors text-sm cursor-pointer" aria-label="Call us">
              <Phone className="w-4 h-4" aria-hidden="true" />
            </a>
            <a href="mailto:info@sprinklerdesign.co.nz" className="text-slate-400 hover:text-green-400 transition-colors text-sm cursor-pointer" aria-label="Email us">
              <Mail className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <nav aria-label="Footer quick links">
          <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-6">Quick Links</h3>
          <ul className="space-y-3">
            {NAV_LINKS.map((link) => (
              <li key={link.name}>
                <a href={link.href} className="text-slate-400 hover:text-green-400 transition-colors text-sm cursor-pointer">
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Services */}
        <nav aria-label="Footer services links">
          <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-6">Services</h3>
          <ul className="space-y-3">
            {['Fire Protection Consulting', 'BIM Design & Coordination', 'Construction Docs', '3D Point Cloud Scanning', 'Special Hazards', 'BIM Management'].map((s) => (
              <li key={s}>
                <a href="#services" className="text-slate-400 hover:text-green-400 transition-colors text-sm cursor-pointer">
                  {s}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact + CTA */}
        <div>
          <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-6">Contact</h3>
          <div className="space-y-3 mb-6">
            <a href="tel:0800113996" className="block text-slate-400 hover:text-green-400 transition-colors text-sm cursor-pointer">
              0800 113 996
            </a>
            <a href="mailto:info@sprinklerdesign.co.nz" className="block text-slate-400 hover:text-green-400 transition-colors text-sm cursor-pointer">
              info@sprinklerdesign.co.nz
            </a>
            <p className="text-slate-500 text-sm">New Zealand â€” Nationwide</p>
          </div>
          <a
            href="#contact"
            id="footer-cta"
            className="btn-primary block text-center w-full px-5 py-3 text-sm font-bold cursor-pointer"
          >
            Request a Quote
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="footer-legal-text text-sm">
          Â© {new Date().getFullYear()} Sprinkler Design Ltd. All rights reserved.
        </p>
        <div className="flex gap-6 text-sm">
          <a href="https://www.sprinklerdesign.co.nz/privacy-policy" target="_blank" rel="noopener noreferrer" className="footer-legal-link cursor-pointer">
            Privacy Policy
          </a>
          <a href="https://www.sprinklerdesign.co.nz/terms-of-use" target="_blank" rel="noopener noreferrer" className="footer-legal-link cursor-pointer">
            Terms of Use
          </a>
        </div>
      </div>
    </div>
  </footer>
);

// ============================================================
// APP ROOT
// ============================================================
export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 font-sans selection:bg-green-500/20 selection:text-green-300">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <About />
        <Projects />
        <Testimonials />
        <Careers />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
