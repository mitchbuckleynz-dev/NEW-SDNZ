import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Building2, MapPin, Calendar, CheckCircle2, BarChart3, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getPublishedProjects } from '../data/projects';

const ALL_CATEGORIES = ['All', ...Array.from(new Set(getPublishedProjects().map((p) => p.category)))];

const CategoryPill = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`category-pill ${active ? 'category-pill-active' : 'category-pill-inactive'}`}
  >
    {label}
  </button>
);

const StatCard = ({ icon: Icon, value, label }: { icon: React.ElementType; value: string; label: string }) => (
  <div className="stat-card">
    <div className="stat-card-icon">
      <Icon className="w-4 h-4" />
    </div>
    <div>
      <p className="text-3xl font-extrabold text-white leading-none">{value}</p>
      <p className="text-slate-500 text-sm mt-1">{label}</p>
    </div>
  </div>
);

export const ProjectsPage = () => {
  const projects = getPublishedProjects();
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered =
    activeCategory === 'All'
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 border-b border-slate-800/60 bg-slate-950/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group" aria-label="Back to home">
            <img
              src="/logo.png"
              alt="Sprinkler Design NZ logo"
              className="w-16 h-16 object-contain group-hover:scale-105 transition-transform duration-300"
            />
            <span className="text-base font-bold tracking-tight text-white">
              Sprinkler<span className="text-green-400">Design</span>
              <span className="ml-1 text-xs font-normal uppercase tracking-widest text-slate-500">NZ</span>
            </span>
          </Link>

          <Link
            to="/"
            className="flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium transition-colors duration-200 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
            Back to home
          </Link>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        {/* Layered background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-green-500/7 rounded-full blur-[120px]" />
          <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-blue-500/4 rounded-full blur-[100px]" />
          <div className="dot-grid absolute inset-0 opacity-20" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="section-label mb-6 inline-flex">
              <Building2 className="w-3 h-3" aria-hidden="true" />
              Our Work
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-none mb-6 tracking-tight">
              Project <span className="text-gradient">Portfolio</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed">
              From landmark hospitals to major infrastructure — here's a selection of the projects
              that showcase our expertise in BIM fire protection design across New Zealand.
            </p>
          </motion.div>

          {/* Stats — card treatment */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12"
          >
            <StatCard icon={BarChart3} value="500+" label="Projects completed" />
            <StatCard icon={Clock} value="35+" label="Years experience" />
            <StatCard icon={CheckCircle2} value="100%" label="NZ code compliance" />
            <StatCard icon={Building2} value="22+" label="Landmark projects" />
          </motion.div>
        </div>
      </section>

      {/* ── Filter Bar ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="filter-bar"
        >
          <div className="flex flex-wrap gap-2">
            {ALL_CATEGORIES.map((cat) => (
              <CategoryPill
                key={cat}
                label={cat}
                active={activeCategory === cat}
                onClick={() => setActiveCategory(cat)}
              />
            ))}
          </div>
          <p className="text-slate-500 text-sm font-medium ml-auto whitespace-nowrap">
            {filtered.length} project{filtered.length !== 1 ? 's' : ''}
          </p>
        </motion.div>
      </div>

      {/* ── Project Grid ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((project, index) => (
              <motion.article
                key={project.slug}
                layout
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ delay: index * 0.06, duration: 0.45 }}
                className="project-card group"
              >
                {/* Image with overlay */}
                <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
                  <img
                    src={project.image}
                    alt={`${project.title} — ${project.category} fire protection project`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-107"
                    loading="lazy"
                  />
                  {/* Gradient overlay always-on */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                  {/* Hover overlay */}
                  <div className="project-card-image-overlay" />
                  {/* Category badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="project-category-badge">{project.category}</span>
                  </div>
                  {/* Year badge */}
                  {project.year && (
                    <div className="absolute top-3 right-3 z-10">
                      <span className="year-badge">{project.year}</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Location */}
                  {project.location && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3 font-medium">
                      <MapPin className="w-3 h-3 text-green-500/70" />
                      {project.location}
                      {project.year && (
                        <>
                          <span className="mx-1 text-slate-700">·</span>
                          <Calendar className="w-3 h-3" />
                          {project.year}
                        </>
                      )}
                    </div>
                  )}

                  <h2 className="text-white font-bold text-lg leading-snug mb-2 group-hover:text-green-400 transition-colors duration-200">
                    {project.title}
                  </h2>
                  <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 mb-4">
                    {project.description}
                  </p>

                  {/* Highlights */}
                  {project.highlights && project.highlights.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.highlights.slice(0, 2).map((h) => (
                        <span key={h.label} className="highlight-pill">
                          <span className="text-slate-400">{h.label}:</span>
                          <span className="text-white font-semibold ml-1">{h.value}</span>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Services */}
                  {project.services && project.services.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-800/80">
                      {project.services.slice(0, 4).map((s) => (
                        <span key={s} className="service-tag">
                          {s}
                        </span>
                      ))}
                      {project.services.length > 4 && (
                        <span className="service-tag text-slate-600">+{project.services.length - 4}</span>
                      )}
                    </div>
                  )}
                </div>
              </motion.article>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty state */}
        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-28"
          >
            <div className="w-20 h-20 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto mb-6">
              <Building2 className="w-8 h-8 text-slate-600" />
            </div>
            <p className="text-lg font-semibold text-slate-400">No projects in this category yet.</p>
            <button
              onClick={() => setActiveCategory('All')}
              className="mt-4 text-green-400 text-sm font-medium hover:text-green-300 cursor-pointer bg-transparent border-none"
            >
              View all projects →
            </button>
          </motion.div>
        )}

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="cta-block mt-24"
        >
          <div className="cta-block-glow" />
          <div className="relative z-10 text-center">
            <div className="section-label mb-6 inline-flex justify-center">
              <Building2 className="w-3 h-3" aria-hidden="true" />
              Start Your Project
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
              Ready to start your <span className="text-gradient">next project?</span>
            </h2>
            <p className="text-slate-400 mb-10 max-w-xl mx-auto text-lg leading-relaxed">
              Get in touch with our team for an obligation-free consultation on your fire protection design needs.
            </p>
            <Link
              to="/#contact"
              className="btn-primary inline-flex items-center gap-2 px-10 py-4 font-bold text-base"
            >
              Get a Free Quote
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-800 py-8 text-center text-slate-600 text-sm">
        © {new Date().getFullYear()} Sprinkler Design NZ Ltd. All rights reserved.
      </footer>
    </div>
  );
};
