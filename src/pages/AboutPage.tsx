/**
 * About — team, approach, compliance, FAQ, and careers.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Award, CheckCircle2, ChevronDown, Users, Zap } from 'lucide-react';
import { Navbar, Footer, usePageMeta } from '../components/site';
import { TEAM, FAQS, SOFTWARE, STANDARDS } from '../data/content';

export function AboutPage() {
  usePageMeta(
    'About Us | Sprinkler Design NZ',
    "Meet the team behind New Zealand's leading independent BIM fire protection design consultancy — our approach, compliance credentials, and careers.",
  );

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <Navbar />
      <main>
        {/* ── Header / approach ── */}
        <section className="py-16 md:py-20 bg-gradient-to-b from-white to-slate-50 border-b border-slate-200">
          <div className="max-w-3xl mx-auto px-5 text-center">
            <p className="eyebrow justify-center mb-4">About Us</p>
            <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight leading-tight mb-4">
              Fire protection design consultancy
            </h1>
            <p className="text-[15px] md:text-lg text-slate-600 leading-relaxed">
              Sprinkler Design NZ is New Zealand's leading independent fire protection design consultancy, combining deep trade knowledge with the latest BIM technology.
            </p>
          </div>
        </section>

        {/* ── Approach ── */}
        <section className="py-20 md:py-24 bg-white" aria-labelledby="approach-heading">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div className="relative">
                <img
                  src="/images/nz_fire_pump_room_transition_render.png"
                  alt="BIM fire protection model in Revit - Sprinkler Design NZ"
                  className="w-full rounded-2xl border border-slate-200 shadow-sm object-cover"
                  style={{ minHeight: '360px', maxHeight: '480px' }}
                />
                <div className="absolute -bottom-5 right-6 figure-block !py-3 !px-5 bg-white">
                  <p className="eyebrow justify-center mb-0.5">Years Expertise</p>
                  <p className="text-2xl font-bold text-slate-900 tabular-nums">30+</p>
                </div>
              </div>

              <div>
                <p className="eyebrow mb-4">Our Approach</p>
                <h2 id="approach-heading" className="text-2xl font-semibold text-slate-900 tracking-tight mb-4 leading-snug">
                  From trade floor to BIM model
                </h2>
                <p className="text-slate-600 text-[15px] leading-relaxed mb-7">
                  We started on the tools — fitting, estimating, and managing fire protection installations — before bringing that knowledge into design. It means our documentation is buildable, our coordination is realistic, and our advice is independent, with no conflicts of interest.
                </p>

                <div className="space-y-3">
                  {[
                    'High-quality, efficient fire protection services',
                    'Cost-effective solutions tailored to your unique needs',
                    'Decades of deep industry knowledge across all facets',
                    'Advanced BIM coordination & clash detection using Revit',
                    'Independent consultancy with no conflicts of interest',
                    'PS1 authorship and PS4 construction monitoring',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="text-[#4caf22] w-5 h-5 flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <span className="text-slate-700 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Team ── */}
        <section className="py-20 md:py-24 bg-slate-50" aria-labelledby="team-heading">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="eyebrow justify-center mb-4">The People</p>
              <h2 id="team-heading" className="text-2xl font-semibold text-slate-900 tracking-tight">Meet the team</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {TEAM.map((member) => (
                <article key={member.name} className="card p-6 md:p-8">
                  <div className="w-20 h-20 rounded-full overflow-hidden mb-5 border border-slate-200">
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-0.5">{member.name}</h3>
                  <p className="text-[#4caf22] text-sm font-medium mb-4">{member.role}</p>
                  <p className="text-slate-600 text-sm leading-relaxed m-0">{member.bio}</p>
                </article>
              ))}
            </div>

            {/* Software */}
            <div className="mt-16 text-center">
              <p className="eyebrow justify-center mb-6">Industry-Leading Software We Use</p>
              <div className="flex flex-wrap justify-center gap-2">
                {SOFTWARE.map((sw) => (
                  <span key={sw} className="tag !text-sm !px-4 !py-1.5 cursor-default">{sw}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Compliance ── */}
        <section className="py-20 md:py-24 bg-white" aria-labelledby="compliance-heading">
          <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="eyebrow justify-center mb-4">Compliance</p>
              <h2 id="compliance-heading" className="text-2xl font-semibold text-slate-900 tracking-tight mb-4">
                Designed to the standards that matter
              </h2>
              <p className="text-[15px] text-slate-600 leading-relaxed">
                Every design is produced against the applicable New Zealand standard and documented for a clean consent pathway.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {STANDARDS.map((s) => (
                <div key={s.code} className="card p-5 flex items-start gap-4">
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg tint-green flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-[#4caf22]" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-slate-900 font-semibold text-sm m-0">{s.code}</p>
                    <p className="text-slate-600 text-sm mt-1 m-0 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-20 md:py-24 bg-slate-50" aria-labelledby="faq-heading">
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
          <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="eyebrow justify-center mb-4">Common Questions</p>
              <h2 id="faq-heading" className="text-2xl font-semibold text-slate-900 tracking-tight">
                Frequently asked questions
              </h2>
            </div>
            <div className="space-y-3">
              {FAQS.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                  <div
                    key={faq.question}
                    className={`card overflow-hidden transition-colors duration-150 ${isOpen ? '!border-[#73d63b]' : ''}`}
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer bg-transparent border-none"
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${index}`}
                    >
                      <span className="font-medium text-sm text-slate-900">{faq.question}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-[#4caf22] flex-shrink-0 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`}
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
                          transition={{ duration: 0.15 }}
                          className="overflow-hidden"
                        >
                          <p className="px-6 pb-6 text-slate-600 text-sm leading-relaxed border-t border-slate-200 pt-4 m-0">
                            {'answerNode' in faq ? (faq as any).answerNode : faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Careers ── */}
        <section id="careers" className="py-20 md:py-24 bg-white" aria-labelledby="careers-heading">
          <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
            <p className="eyebrow justify-center mb-4">Join Our Team</p>
            <h2 id="careers-heading" className="text-2xl font-semibold text-slate-900 tracking-tight mb-4">
              Propel your career
            </h2>
            <p className="text-slate-600 text-[15px] mb-10 max-w-xl mx-auto leading-relaxed">
              We are currently looking for passionate <strong className="text-slate-900 font-semibold">Sprinkler Designers</strong>. If you have experience in fire protection design or BIM coordination, we'd love to hear from you.
            </p>

            <div className="grid md:grid-cols-3 gap-5 mb-10 text-left">
              {[
                { icon: Award, title: 'Industry Leaders', desc: 'Work on landmark NZ projects including hospitals, arenas, prisons, and civic centres.' },
                { icon: Zap, title: 'Cutting-Edge Tech', desc: 'Use the latest BIM tools - Revit, BIM360, Revizto, and point cloud scanning.' },
                { icon: Users, title: 'Great Team Culture', desc: 'A tight-knit, experienced team that values learning, mentorship, and work-life balance.' },
              ].map((item) => (
                <div key={item.title} className="card p-6">
                  <div className="w-11 h-11 flex items-center justify-center mb-4 rounded-lg tint-green">
                    <item.icon className="w-5 h-5 text-[#4caf22]" aria-hidden="true" />
                  </div>
                  <h3 className="text-slate-900 font-semibold mb-2">{item.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed m-0">{item.desc}</p>
                </div>
              ))}
            </div>

            <Link to="/contact" id="careers-apply-cta" className="btn-primary">
              Apply Now
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
