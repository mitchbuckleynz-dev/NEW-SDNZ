/**
 * Sprinkler Design NZ — Home page
 * Hero → services overview → why-us → sectors → testimonials → CTA band.
 * Design system: white space, hairline borders, one green accent (#73d63b).
 */

import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'motion/react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Navbar, Footer, CtaBand, usePageMeta } from './components/site';
import { DISCIPLINES, SECTORS, STATS, TESTIMONIALS } from './data/content';

// ============================================================
// ANIMATED COUNTER
// ============================================================
const AnimatedStat = ({ value, label }: { value: string; label: string }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.4 }}
      className="text-center"
    >
      <p className="stat-number text-2xl md:text-3xl font-bold text-slate-900 mb-1">{value}</p>
      <p className="text-slate-500 text-xs uppercase tracking-wider font-medium">{label}</p>
    </motion.div>
  );
};

// ============================================================
// HERO
// ============================================================
const Hero = () => (
  <section
    id="home"
    className="relative pt-20 pb-20 md:pt-28 md:pb-24 bg-gradient-to-b from-white to-slate-50"
    aria-label="Hero section"
  >
    <div className="max-w-3xl mx-auto px-5 text-center">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <p className="eyebrow justify-center mb-5">Trusted Fire Protection Experts · New Zealand</p>

        <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight leading-tight mb-6">
          Fire protection design that keeps your project moving.
        </h1>

        <p className="text-[15px] md:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto mb-9">
          Sprinklers, fire alarms &amp; detection, hydrants, and hose reels &amp; extinguishers — designed in BIM, compliant with NZ standards, delivered by decades of industry expertise.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/estimate" id="hero-estimate-cta" className="btn-primary">
            Get an instant estimate
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
          <Link to="/contact" id="hero-contact-cta" className="btn-ghost">
            Talk to us
          </Link>
        </div>
      </motion.div>
    </div>

    {/* Stats bar */}
    <div className="max-w-4xl mx-auto px-5 mt-16 md:mt-20">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-slate-200 pt-10">
        {STATS.map((stat) => (
          <AnimatedStat key={stat.label} value={stat.value} label={stat.label} />
        ))}
      </div>
    </div>
  </section>
);

// ============================================================
// SERVICES OVERVIEW — the four disciplines
// ============================================================
const ServicesOverview = () => (
  <section id="services" className="py-20 md:py-24 bg-white" aria-labelledby="services-heading">
    <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <p className="eyebrow justify-center mb-4">What We Design</p>
        <h2 id="services-heading" className="text-2xl font-semibold text-slate-900 tracking-tight mb-4">
          Four disciplines, one coordinated design
        </h2>
        <p className="text-[15px] text-slate-600 leading-relaxed">
          Every active fire protection system your building needs, designed together in BIM so nothing clashes and nothing is missed.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {DISCIPLINES.map((d) => (
          <article key={d.key} className="card p-6 transition-colors duration-150 hover:border-slate-300">
            <div className="w-11 h-11 flex items-center justify-center mb-5 rounded-lg tint-green">
              <d.icon className="w-5 h-5 text-[#3e7d1c]" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2 leading-snug">{d.title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed m-0">{d.desc}</p>
          </article>
        ))}
      </div>

      <div className="text-center mt-10">
        <Link
          to="/services"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#3e7d1c] transition-opacity duration-150 hover:opacity-80"
        >
          Explore all services — consulting, BIM coordination, scanning &amp; more
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  </section>
);

// ============================================================
// WHY US / CREDENTIALS
// ============================================================
const WhyUs = () => (
  <section id="about" className="py-20 md:py-24 bg-slate-50" aria-labelledby="why-heading">
    <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className="relative">
          <img
            src="/images/nz_fire_pump_room_transition_render.png"
            alt="BIM fire protection model in Revit - Sprinkler Design NZ"
            width={640}
            height={640}
            className="w-full rounded-2xl border border-slate-200 shadow-sm object-cover"
            style={{ minHeight: '360px', maxHeight: '480px' }}
          />
          <div className="absolute -bottom-5 right-6 figure-block !py-3 !px-5 bg-white">
            <p className="eyebrow justify-center mb-0.5">Years Expertise</p>
            <p className="text-2xl font-bold text-slate-900 tabular-nums">30+</p>
          </div>
        </div>

        <div>
          <p className="eyebrow mb-4">Why Sprinkler Design NZ</p>
          <h2 id="why-heading" className="text-2xl font-semibold text-slate-900 tracking-tight mb-4 leading-snug">
            Independent expertise, from trade floor to BIM model
          </h2>
          <p className="text-slate-600 text-[15px] leading-relaxed mb-7">
            With decades of industry expertise, Sprinkler Design NZ provides comprehensive solutions including professional consulting, BIM coordination, and construction documentation. We pride ourselves on attention to detail and precision, ensuring each project is executed to the highest standard.
          </p>

          <div className="space-y-3 mb-8">
            {[
              'High-quality, efficient fire protection services',
              'Cost-effective solutions tailored to your unique needs',
              'Advanced BIM coordination & clash detection using Revit',
              'Independent consultancy with no conflicts of interest',
              'PS1 authorship and PS4 construction monitoring',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle2 className="text-[#3e7d1c] w-5 h-5 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-slate-700 text-sm">{item}</span>
              </div>
            ))}
          </div>

          <Link to="/about" id="about-cta" className="btn-ghost">
            More about us
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  </section>
);

// ============================================================
// SECTORS STRIP
// ============================================================
const Sectors = () => (
  <section id="sectors" className="py-20 md:py-24 bg-white" aria-labelledby="sectors-heading">
    <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
      <p className="eyebrow justify-center mb-4">Sectors We Serve</p>
      <h2 id="sectors-heading" className="text-2xl font-semibold text-slate-900 tracking-tight mb-4">
        Every building type, nationwide
      </h2>
      <p className="text-[15px] text-slate-600 leading-relaxed max-w-2xl mx-auto mb-10">
        From landmark hospitals and stadiums to warehouses and apartment towers — our portfolio spans New Zealand's most demanding occupancies.
      </p>

      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {SECTORS.filter((s) => s.key !== 'other').map((s) => (
          <span key={s.key} className="tag !text-sm !px-4 !py-1.5 cursor-default">
            {s.label}
          </span>
        ))}
      </div>

      <Link
        to="/projects"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#3e7d1c] transition-opacity duration-150 hover:opacity-80"
      >
        See our project portfolio
        <ArrowRight className="w-4 h-4" aria-hidden="true" />
      </Link>
    </div>
  </section>
);

// ============================================================
// TESTIMONIALS
// ============================================================
const Testimonials = () => (
  <section id="testimonials" className="py-20 md:py-24 bg-slate-50" aria-labelledby="testimonials-heading">
    <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <p className="eyebrow justify-center mb-4">Client Feedback</p>
        <h2 id="testimonials-heading" className="text-2xl font-semibold text-slate-900 tracking-tight mb-3">
          Trusted by New Zealand's best
        </h2>
        <p className="text-slate-500 text-sm">What project managers, directors, and contractors say about working with us.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-5">
        {TESTIMONIALS.map((item) => (
          <blockquote key={item.author} className="card p-6 md:p-8 flex flex-col gap-5 m-0">
            <p className="text-slate-600 text-[15px] leading-relaxed flex-1 m-0">“{item.quote}”</p>
            <footer className="flex items-center gap-3.5 border-t border-slate-200 pt-5">
              <div className="w-10 h-10 rounded-full tint-green flex items-center justify-center text-[#3e7d1c] font-semibold text-sm flex-shrink-0">
                {item.initials}
              </div>
              <div>
                <p className="text-slate-900 font-medium text-sm m-0">{item.author}</p>
                <p className="text-slate-500 text-xs mt-0.5 m-0">{item.company}</p>
              </div>
            </footer>
          </blockquote>
        ))}
      </div>
    </div>
  </section>
);

// ============================================================
// APP ROOT — Home page
// ============================================================
export default function App() {
  usePageMeta(
    'Sprinkler Design NZ | Expert BIM Fire Protection Design & Consulting',
    "New Zealand's leading BIM fire protection design and consulting firm. Fire sprinklers, alarms, hydrants, and hose reels designed to NZ standards.",
  );

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <Navbar />
      <main id="main">
        <Hero />
        <ServicesOverview />
        <WhyUs />
        <Sectors />
        <Testimonials />
        <CtaBand />
      </main>
      <Footer />
    </div>
  );
}
