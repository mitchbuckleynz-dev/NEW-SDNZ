/**
 * Services — the four disciplines, the design-stage process, and the
 * full capability set (consulting, BIM, scanning, special hazards).
 */

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { Navbar, Footer, CtaBand, usePageMeta } from '../components/site';
import { DISCIPLINES, PROCESS_STAGES, SERVICES } from '../data/content';

export function ServicesPage() {
  usePageMeta(
    'Services | Sprinkler Design NZ',
    'Fire sprinkler, alarm & detection, hydrant, and hose reel & extinguisher design to NZ standards — plus BIM coordination, consulting, and 3D scanning.',
  );

  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <Navbar />
      <main id="main">
        {/* ── Header ── */}
        <section className="py-16 md:py-20 bg-gradient-to-b from-white to-slate-50 border-b border-slate-200">
          <div className="max-w-3xl mx-auto px-5 text-center">
            <p className="eyebrow justify-center mb-4">Our Services</p>
            <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight leading-tight mb-4">
              Fire protection design, end to end
            </h1>
            <p className="text-[15px] md:text-lg text-slate-600 leading-relaxed">
              Four active fire protection disciplines, one coordinated BIM workflow — from first concept to consented, tender-ready documentation.
            </p>
          </div>
        </section>

        {/* ── The four disciplines ── */}
        <section className="py-20 md:py-24 bg-white" aria-labelledby="disciplines-heading">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <p className="eyebrow justify-center mb-4">What We Design</p>
              <h2 id="disciplines-heading" className="text-2xl font-semibold text-slate-900 tracking-tight">
                The four disciplines
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
              {DISCIPLINES.map((d) => (
                <article key={d.key} className="card p-6 md:p-8 transition-colors duration-150 hover:border-slate-300">
                  <div className="w-11 h-11 flex items-center justify-center mb-5 rounded-lg tint-green">
                    <d.icon className="w-5 h-5 text-[#3e7d1c]" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2 leading-snug">{d.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed m-0">{d.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Design-stage process ── */}
        <section className="py-20 md:py-24 bg-slate-50" aria-labelledby="process-heading">
          <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="eyebrow justify-center mb-4">How We Work</p>
              <h2 id="process-heading" className="text-2xl font-semibold text-slate-900 tracking-tight mb-4">
                A design process that de-risks your programme
              </h2>
              <p className="text-[15px] text-slate-600 leading-relaxed">
                Fire protection designed early and staged deliberately — so consent, tender, and construction each get exactly what they need.
              </p>
            </div>

            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-8" aria-hidden="true">
              {PROCESS_STAGES.map((s) => (
                <div key={s.name} className="step-bar active" />
              ))}
            </div>

            <ol className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 list-none p-0 m-0">
              {PROCESS_STAGES.map((stage, i) => (
                <li key={stage.name} className="card p-5">
                  <p className="eyebrow mb-2">Step {i + 1}</p>
                  <h3 className="text-[15px] font-semibold text-slate-900 mb-1.5">{stage.name}</h3>
                  <p className="text-slate-600 text-xs leading-relaxed m-0">{stage.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── Full capabilities ── */}
        <section className="py-20 md:py-24 bg-white" aria-labelledby="capabilities-heading">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <p className="eyebrow justify-center mb-4">Beyond the Drawings</p>
              <h2 id="capabilities-heading" className="text-2xl font-semibold text-slate-900 tracking-tight mb-4">
                Full-service capabilities
              </h2>
              <p className="text-[15px] text-slate-600 leading-relaxed">
                Consulting, coordination, and capture services that wrap around the core design work.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {SERVICES.map((service, index) => {
                const isOpen = expanded === service.title;
                return (
                  <article
                    key={service.title}
                    className="card p-6 cursor-pointer transition-colors duration-150 hover:border-slate-300"
                    onClick={() => setExpanded(isOpen ? null : service.title)}
                    role="button"
                    aria-expanded={isOpen}
                    aria-controls={`service-detail-${index}`}
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && setExpanded(isOpen ? null : service.title)}
                  >
                    <div className="w-11 h-11 flex items-center justify-center mb-5 rounded-lg tint-green">
                      <service.icon className="w-5 h-5 text-[#3e7d1c]" aria-hidden="true" />
                    </div>

                    <h3 className="text-lg font-semibold text-slate-900 mb-2 leading-snug">{service.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">{service.shortDesc}</p>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          id={`service-detail-${index}`}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.15 }}
                          className="overflow-hidden"
                        >
                          <p className="text-slate-600 text-sm leading-relaxed mb-4 border-t border-slate-200 pt-4">
                            {service.detail}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex flex-wrap gap-1.5 mt-2 mb-4">
                      {service.tags.map((tag) => (
                        <span key={tag} className="tag">{tag}</span>
                      ))}
                    </div>

                    <button
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-[#3e7d1c] bg-transparent border-none p-0 cursor-pointer transition-opacity duration-150 hover:opacity-80"
                      aria-label={`${isOpen ? 'Show less' : 'Learn more'} about ${service.title}`}
                    >
                      {isOpen ? 'Show Less' : 'Learn More'}
                      <ChevronRight
                        className={`w-4 h-4 transition-transform duration-150 ${isOpen ? 'rotate-90' : ''}`}
                        aria-hidden="true"
                      />
                    </button>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <CtaBand />
      </main>
      <Footer />
    </div>
  );
}
