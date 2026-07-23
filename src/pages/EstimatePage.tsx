/**
 * Estimate — the native fee-estimator form (posts same-origin to
 * /api/estimate, which proxies to the CRM). No iframe: the form renders
 * as a first-class section of this page in the site's own components.
 */

import { Link } from 'react-router-dom';
import { Navbar, Footer, usePageMeta } from '../components/site';
import { EstimateForm } from '../components/EstimateForm';

const SCOPE_TEXT =
  'This estimate is for fire protection consulting and design, including ' +
  'coordination at design stages, documentation for tender and consent, ' +
  'and the PS1 design producer statement.';

// Standard-inclusion callout — keep in sync with the CRM's estimate email.
const BIM_INCLUSION_TEXT =
  'Our design includes a BIM-coordinated design to LOD 300 ' +
  '(Level of Development 300).';

const DISCLAIMER_TEXT =
  'This is an indicative estimate only, generated automatically from the ' +
  'limited information provided. It is not a formal fee proposal, offer, or ' +
  'quotation, and is subject to a full design review of the actual project. ' +
  'Your final fee may be higher or lower.';

export function EstimatePage() {
  usePageMeta(
    'Get an Instant Estimate | Sprinkler Design NZ',
    'Get an instant, indicative fire protection design fee range for your project — sprinklers, alarms, hydrants, hose reels & extinguishers.',
  );

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <Navbar />
      <main id="main">
        {/* ── Header ── */}
        <section className="py-16 md:py-20 bg-gradient-to-b from-white to-slate-50">
          <div className="max-w-2xl mx-auto px-5 text-center">
            <p className="eyebrow justify-center mb-4">Fee Estimator</p>
            <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight leading-tight mb-4">
              Get an instant estimate
            </h1>
            <p className="text-[15px] md:text-lg text-slate-600 leading-relaxed mb-3">
              Tell us about your building and we'll email you an indicative design
              fee range in under a minute — no obligation.
            </p>
            <p className="text-slate-500 text-sm m-0">
              {SCOPE_TEXT}{' '}
              <span className="font-medium text-slate-700">{BIM_INCLUSION_TEXT}</span>
            </p>
          </div>
        </section>

        {/* ── Estimator ── */}
        <section className="pb-20 md:pb-24 bg-white" aria-label="Fee estimator">
          <div className="max-w-2xl mx-auto px-5">
            <EstimateForm />

            {/* Fallback / reassurance */}
            <p className="text-center text-slate-500 text-sm mt-6">
              Prefer to talk it through? Call{' '}
              <a href="tel:0800113996" className="text-[#3e7d1c] font-medium">0800 113 996</a>
              {' '}or{' '}
              <Link to="/contact" className="text-[#3e7d1c] font-medium">send us a message</Link>.
            </p>

            {/* Disclaimer */}
            <p className="text-[11px] leading-relaxed text-slate-500 border-t border-slate-200 pt-5 mt-8">
              {DISCLAIMER_TEXT}
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
