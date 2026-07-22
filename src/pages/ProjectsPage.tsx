import React, { useState, useEffect } from 'react';
import { ArrowRight, Building2, MapPin, Calendar, CheckCircle2, BarChart3, Clock, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Navbar, Footer, usePageMeta } from '../components/site';
import { SECTORS } from '../data/content';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Highlight {
  label: string;
  value: string;
}

interface Project {
  slug: string;
  title: string;
  category: string | null;
  description: string | null;
  short_desc: string | null;
  location: string | null;
  year: string | null;
  cover_image: string | null;
  services: string[];
  highlights_json: string | null;
}

function parseHighlights(json: string | null): Highlight[] {
  if (!json) return [];
  try {
    return JSON.parse(json);
  } catch {
    return [];
  }
}

// ─── Sub-components ──────────────────────────────────────────────────────────

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
    className={`px-4 py-1.5 text-sm font-medium rounded-full border cursor-pointer whitespace-nowrap transition-colors duration-150 ${
      active
        ? 'border-[#73d63b] tint-green text-slate-900'
        : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50'
    }`}
  >
    {label}
  </button>
);

const StatCard = ({ icon: Icon, value, label }: { icon: React.ElementType; value: string; label: string }) => (
  <div className="card p-5 flex items-center gap-4">
    <div className="w-10 h-10 flex items-center justify-center rounded-lg tint-green flex-shrink-0">
      <Icon className="w-4 h-4 text-[#4caf22]" />
    </div>
    <div>
      <p className="text-2xl font-semibold text-slate-900 leading-none tabular-nums m-0">{value}</p>
      <p className="text-slate-500 text-sm mt-1 m-0">{label}</p>
    </div>
  </div>
);

// ─── Main Component ──────────────────────────────────────────────────────────

export const ProjectsPage = () => {
  usePageMeta(
    'Project Portfolio | Sprinkler Design NZ',
    'A selection of landmark New Zealand projects showcasing our BIM fire protection design expertise — hospitals, arenas, warehouses, civic buildings and more.',
  );

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    async function fetchProjects() {
      const { data, error } = await supabase
        .from('portfolio_projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setProjects(data);
      }
      setLoading(false);
    }
    fetchProjects();
  }, []);

  const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean) as string[]))];

  const filtered =
    activeCategory === 'All'
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-white text-slate-900">

      {/* ── Shared nav ── */}
      <Navbar />

      {/* ── Hero ── */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-white to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <p className="eyebrow mb-4">Our Work</p>
          <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight leading-tight mb-4">
            Project portfolio
          </h1>
          <p className="text-[15px] md:text-lg text-slate-600 max-w-2xl leading-relaxed">
            From landmark hospitals to major infrastructure — here's a selection of the projects
            that showcase our expertise in BIM fire protection design across New Zealand.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
            <StatCard icon={BarChart3} value="500+" label="Projects completed" />
            <StatCard icon={Clock} value="35+" label="Years experience" />
            <StatCard icon={CheckCircle2} value="100%" label="NZ code compliance" />
            <StatCard icon={Building2} value="22+" label="Landmark projects" />
          </div>

          {/* Sectors we serve */}
          <div className="mt-10">
            <p className="eyebrow mb-4">Sectors We Serve</p>
            <div className="flex flex-wrap gap-2">
              {SECTORS.filter((s) => s.key !== 'other').map((s) => (
                <span key={s.key} className="tag !text-sm !px-4 !py-1.5 cursor-default">
                  {s.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Loading state ── */}
      {loading && (
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 mb-10">
          <div className="flex items-center justify-center py-24 gap-3 text-slate-500">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span className="text-sm font-medium">Loading projects…</span>
          </div>
        </div>
      )}

      {/* ── Filter Bar ── */}
      {!loading && (
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 mt-10 mb-8">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <CategoryPill
                  key={cat}
                  label={cat}
                  active={activeCategory === cat}
                  onClick={() => setActiveCategory(cat)}
                />
              ))}
            </div>
            <div className="flex items-center gap-4 ml-auto">
              {/* Admin sync link — noindex on /projects-sync keeps this internal */}
              <Link
                to="/projects-sync"
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-[#4caf22] transition-colors duration-150 font-medium whitespace-nowrap"
                title="Sync projects from Notion"
              >
                <RefreshCw className="w-3 h-3" aria-hidden="true" />
                Sync
              </Link>
              <p className="text-slate-500 text-sm font-medium whitespace-nowrap m-0 tabular-nums">
                {filtered.length} project{filtered.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Project Grid ── */}
      {!loading && (
        <main className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pb-24">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((project) => {
              const highlights = parseHighlights(project.highlights_json);
              return (
                <article
                  key={project.slug}
                  className="card overflow-hidden group transition-colors duration-150 hover:border-slate-300"
                >
                  {/* Image */}
                  <div className="relative overflow-hidden border-b border-slate-200" style={{ aspectRatio: '16/9' }}>
                    {project.cover_image ? (
                      <img
                        src={project.cover_image}
                        alt={`${project.title} — ${project.category} fire protection project`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                        <Building2 className="w-12 h-12 text-slate-300" />
                      </div>
                    )}
                    {/* Category badge */}
                    {project.category && (
                      <div className="absolute top-3 left-3 z-10">
                        <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.16em] px-2.5 py-1 rounded-full bg-white/95 border border-slate-200 text-slate-700">
                          {project.category}
                        </span>
                      </div>
                    )}
                    {/* Year badge */}
                    {project.year && (
                      <div className="absolute top-3 right-3 z-10">
                        <span className="inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/95 border border-slate-200 text-slate-500 tabular-nums">
                          {project.year}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Location */}
                    {project.location && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3 font-medium">
                        <MapPin className="w-3 h-3 text-[#4caf22]" />
                        {project.location}
                        {project.year && (
                          <>
                            <span className="mx-1 text-slate-300">·</span>
                            <Calendar className="w-3 h-3" />
                            <span className="tabular-nums">{project.year}</span>
                          </>
                        )}
                      </div>
                    )}

                    <h2 className="text-slate-900 font-semibold text-lg leading-snug mb-2">
                      {project.title}
                    </h2>
                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 mb-4">
                      {project.description || project.short_desc}
                    </p>

                    {/* Highlights */}
                    {highlights.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {highlights.slice(0, 2).map((h) => (
                          <span key={h.label} className="inline-flex items-center text-xs px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200">
                            <span className="text-slate-500">{h.label}:</span>
                            <span className="text-slate-900 font-semibold ml-1 tabular-nums">{h.value}</span>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Services */}
                    {project.services && project.services.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-200">
                        {project.services.slice(0, 4).map((s) => (
                          <span key={s} className="tag">
                            {s}
                          </span>
                        ))}
                        {project.services.length > 4 && (
                          <span className="tag">+{project.services.length - 4}</span>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="text-center py-28">
              <div className="w-20 h-20 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto mb-6">
                <Building2 className="w-8 h-8 text-slate-300" />
              </div>
              {activeCategory === 'All' ? (
                <>
                  <p className="text-lg font-semibold text-slate-700">No projects synced yet.</p>
                  <p className="text-slate-500 text-sm mt-2">
                    Add projects to your Notion database and run a sync.
                  </p>
                  <Link
                    to="/projects-sync"
                    className="mt-6 inline-flex items-center gap-2 text-[#4caf22] text-sm font-medium hover:opacity-80 transition-opacity"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Sync projects now →
                  </Link>
                </>
              ) : (
                <>
                  <p className="text-lg font-semibold text-slate-700">No projects in this category yet.</p>
                  <button
                    onClick={() => setActiveCategory('All')}
                    className="mt-4 text-[#4caf22] text-sm font-medium hover:opacity-80 cursor-pointer bg-transparent border-none transition-opacity"
                  >
                    View all projects →
                  </button>
                </>
              )}
            </div>
          )}

          {/* ── CTA ── */}
          <div className="card mt-20 p-10 md:p-14 text-center bg-gradient-to-b from-white to-slate-50">
            <p className="eyebrow justify-center mb-4">Start Your Project</p>
            <h2 className="text-2xl font-semibold text-slate-900 tracking-tight mb-3">
              Ready to start your next project?
            </h2>
            <p className="text-slate-600 mb-8 max-w-xl mx-auto text-[15px] leading-relaxed">
              Get an instant fee estimate, or talk to our team for an obligation-free consultation on your fire protection design needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/estimate" className="btn-primary">
                Get an instant estimate
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/contact" className="btn-ghost">
                Talk to us
              </Link>
            </div>
          </div>
        </main>
      )}

      {/* ── Footer ── */}
      <Footer />
    </div>
  );
};
