/**
 * Native fee-estimator form — two steps (project → details → done).
 *
 * Mirrors the CRM's public estimator exactly (same keys, same guard rails)
 * but renders in this site's own components, and POSTs same-origin to
 * /api/estimate — a small Vercel proxy that forwards to the CRM. All
 * pricing stays server-side in the CRM; the response carries no dollar
 * figures (the range is emailed).
 */

import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

/* ---- LinkedIn Ads conversion tracking ---- */

// Insight Tag is loaded site-wide in index.html; this is the "Estimator"
// lead conversion created in Campaign Manager.
const LINKEDIN_CONVERSION_ID = 27341660;

declare global {
  interface Window {
    lintrk?: (action: string, data: { conversion_id: number }) => void;
  }
}

/** Fire the LinkedIn conversion on successful submission. The tag's queue
 *  stub means this is safe even if insight.min.js hasn't loaded yet.
 *  Tracking must never break the form. */
function fireLinkedInConversion() {
  try {
    window.lintrk?.('track', { conversion_id: LINKEDIN_CONVERSION_ID });
  } catch {
    /* no-op */
  }
}

/** Ad-attribution params captured from the landing URL (LinkedIn appends
 *  li_fat_id to ad clicks; utm_* come from the campaign URLs). Forwarded
 *  with the lead so the CRM records the source. */
const ATTRIBUTION_PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'li_fat_id',
] as const;

/* ---- Residential hand-off ---- */

/** Building-type key for a standalone home. Residential design is run
 *  under a separate brand (Resiguard, NZS 4517) with its own fixed-price
 *  packages, so these leads get handed across once we've captured them.
 *
 *  Until the CRM carries a matching key, the engine treats this as an
 *  unknown use and routes the lead to the "we'll be in touch" path —
 *  which is the right outcome: better no number than a commercial one. */
const HOUSE_KEY = 'house';

/** Deep link to Resiguard's design packages, tagged so the referral shows
 *  up in their analytics as coming from this estimator. */
const RESIGUARD_URL =
  'https://www.resiguard.co.nz/?utm_source=sprinklerdesign&utm_medium=referral&utm_campaign=estimator_house#pricing';

/* ---- Catalogue (keys MUST match the CRM's building-types.ts) ---- */

const DISCIPLINES = [
  { key: 'sprinkler', label: 'Sprinklers', hint: 'Automatic fire sprinkler system' },
  { key: 'alarm', label: 'Fire alarms & detection', hint: 'Detection and alarm system' },
  { key: 'hydrant', label: 'Hydrants', hint: 'Fire hydrant / riser mains' },
  { key: 'hoffe', label: 'Hose reels & extinguishers', hint: 'Hand-operated firefighting equipment' },
] as const;

type DisciplineKey = (typeof DISCIPLINES)[number]['key'];

const BUILDING_TYPES = [
  { key: 'office', label: 'Office / commercial', hint: 'Offices, professional suites, fit-outs' },
  { key: HOUSE_KEY, label: 'House / single dwelling', hint: 'A standalone home — new build, alteration or rural property' },
  { key: 'apartment', label: 'Apartment / residential', hint: 'Multi-unit residential, apartments, motels' },
  { key: 'retail', label: 'Retail / shop', hint: 'Shops, showrooms, supermarkets' },
  { key: 'hospitality', label: 'Hospitality / accommodation', hint: 'Hotels, restaurants, bars, function venues' },
  { key: 'aged_care', label: 'Aged care / rest home', hint: 'Rest homes, retirement villages, care facilities' },
  { key: 'healthcare', label: 'Hospital / healthcare', hint: 'Hospitals, clinics, medical centres, laboratories' },
  { key: 'carpark', label: 'Carpark', hint: 'Enclosed or basement parking' },
  { key: 'industrial', label: 'Industrial / manufacturing', hint: 'Factories, workshops, processing' },
  { key: 'warehouse', label: 'Warehouse / storage', hint: 'Distribution, racking, cold store, logistics' },
  { key: 'other', label: 'Something else / not sure', hint: 'Mixed-use, specialist, or unusual buildings' },
];

const MAX_SECTIONS = 3;
const MAX_STOREYS = 20;
const MAX_AREA_M2 = 50_000;

/* ---- Lead-field validation (keep in sync with the CRM's
        src/lib/estimate/validation.ts — the API enforces the same rules,
        plus a DNS check that the email domain exists) ---- */

const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

function isValidEmailFormat(email: string): boolean {
  const e = email.trim();
  if (e.length < 6 || e.length > 254) return false;
  if (e.includes('..')) return false;
  return EMAIL_RE.test(e);
}

/** Plausible phone: phone-ish characters only, 7–15 digits. */
function isValidPhone(raw: string): boolean {
  const cleaned = raw.trim();
  if (cleaned.length === 0 || cleaned.length > 25) return false;
  if (!/^\+?[\d\s().-]+$/.test(cleaned)) return false;
  const digits = cleaned.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
}

type Step = 'project' | 'details' | 'done';

/**
 * What came back from the CRM.
 *
 *  range   — commercial work, priced by the fee engine; a range is emailed.
 *  fixed   — a standalone home, priced at one of Resiguard's fixed design
 *            packages; the package details are emailed.
 *  contact — too variable to price automatically; a human follows up.
 *
 * These strings are the API contract, not internal names. `fixed` must
 * match what the CRM serialises, or this screen silently falls back to the
 * "we'll be in touch" copy while a priced email is already on its way.
 */
type Outcome = 'range' | 'contact' | 'fixed';

interface SectionState {
  buildingType: string;
  area: string;
  storeys: string;
}

const emptySection = (): SectionState => ({ buildingType: '', area: '', storeys: '1' });

export function EstimateForm() {
  const [step, setStep] = useState<Step>('project');

  // Step 1 — systems + sections
  const [disciplines, setDisciplines] = useState<DisciplineKey[]>(['sprinkler']);
  const [sections, setSections] = useState<SectionState[]>([emptySection()]);

  // Step 2 — details
  const [projectName, setProjectName] = useState('');
  const [projectLocation, setProjectLocation] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  /** Resiguard package name ("Essentials" / "Standard") on a `fixed`
   *  outcome. Optional by design — the CRM may omit it, so every use
   *  falls back to generic wording rather than rendering a gap. */
  const [tier, setTier] = useState<string | null>(null);
  const [emailed, setEmailed] = useState(false);

  // Ad-campaign attribution, captured once from the landing URL so it
  // survives the two-step flow. A ref (not state) — never rendered, only
  // read at submit time.
  const attributionRef = useRef<Record<string, string>>({});
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const attr: Record<string, string> = {};
      for (const key of ATTRIBUTION_PARAMS) {
        const v = params.get(key);
        if (v) attr[key] = v;
      }
      if (Object.keys(attr).length === 0) {
        // SPA route changes drop the query string — the ads land on the
        // homepage, so fall back to the stash main.tsx saved on first load.
        const stashed = sessionStorage.getItem('sdnz_attribution');
        if (stashed) {
          attributionRef.current = JSON.parse(stashed) as Record<string, string>;
          return;
        }
      }
      if (document.referrer) attr.referrer = document.referrer;
      attributionRef.current = attr;
    } catch {
      // Attribution is best-effort only.
    }
  }, []);

  function toggleDiscipline(key: DisciplineKey) {
    setDisciplines((cur) =>
      cur.includes(key) ? cur.filter((k) => k !== key) : [...cur, key],
    );
  }

  function updateSection(i: number, patch: Partial<SectionState>) {
    setSections((cur) => cur.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  }
  function addSection() {
    setSections((cur) => (cur.length < MAX_SECTIONS ? [...cur, emptySection()] : cur));
  }
  function removeSection(i: number) {
    setSections((cur) => (cur.length > 1 ? cur.filter((_, idx) => idx !== i) : cur));
  }

  function goToDetails() {
    setError(null);
    if (disciplines.length === 0)
      return setError('Please select at least one fire system.');
    for (const [i, s] of sections.entries()) {
      if (!s.buildingType)
        return setError(`Please choose a building type for section ${i + 1}.`);
      const a = Number(s.area);
      if (!Number.isFinite(a) || a <= 0)
        return setError(`Please enter the floor area for section ${i + 1}.`);
      if (a > MAX_AREA_M2)
        return setError(
          `Section ${i + 1} is larger than we can estimate online. Please contact us directly.`,
        );
    }
    setStep('details');
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!projectName.trim())
      return setError('Please enter a project name or reference.');
    if (!name.trim()) return setError('Please enter your name.');
    if (!company.trim()) return setError('Please enter your company.');
    if (!isValidEmailFormat(email))
      return setError('Please enter a valid email address.');
    if (!isValidPhone(phone))
      return setError('Please enter a valid phone number.');

    setSubmitting(true);
    try {
      const res = await fetch('/api/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          disciplines,
          sections: sections.map((s) => ({
            buildingType: s.buildingType,
            areaM2: Number(s.area),
            storeys: Number(s.storeys) || 1,
          })),
          projectName: projectName.trim(),
          projectLocation: projectLocation.trim(),
          name: name.trim(),
          company: company.trim(),
          email: email.trim(),
          phone: phone.trim(),
          company_website: honeypot,
          ...(Object.keys(attributionRef.current).length > 0
            ? { attribution: attributionRef.current }
            : {}),
        }),
      });
      const data = (await res.json().catch(() => null)) as
        | { ok: boolean; outcome?: Outcome; tier?: string; emailed?: boolean; error?: string }
        | null;
      if (!res.ok || !data?.ok) {
        setError(data?.error ?? 'Something went wrong. Please try again.');
        setSubmitting(false);
        return;
      }
      // Lead captured — fire the LinkedIn ad conversion.
      fireLinkedInConversion();
      setOutcome(data.outcome ?? 'range');
      setTier(data.tier?.trim() ? data.tier.trim() : null);
      setEmailed(Boolean(data.emailed));
      setStep('done');
    } catch {
      setError("Couldn't reach the server. Please try again.");
      setSubmitting(false);
    }
  }

  if (step === 'done') {
    return (
      <Confirmation
        outcome={outcome ?? 'range'}
        tier={tier}
        email={email}
        emailed={emailed}
        isResidential={sections.some((s) => s.buildingType === HOUSE_KEY)}
      />
    );
  }

  return (
    <div className="card p-6 md:p-8">
      <StepBars step={step} />

      {step === 'project' && (
        <div className="space-y-6">
          {/* Systems */}
          <fieldset className="border-0 p-0 m-0">
            <legend className="field-label p-0">Which fire systems do you need designed?</legend>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {DISCIPLINES.map((d) => {
                const checked = disciplines.includes(d.key);
                return (
                  <label
                    key={d.key}
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors duration-150 ${
                      checked ? 'tint-green' : 'border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="mt-0.5 h-4 w-4"
                      checked={checked}
                      onChange={() => toggleDiscipline(d.key)}
                    />
                    <span>
                      <span className="block text-sm font-medium text-slate-800">{d.label}</span>
                      <span className="block text-xs text-slate-500">{d.hint}</span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          {/* Sections */}
          <div className="space-y-4">
            {sections.map((s, i) => (
              <div key={i} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="eyebrow !text-slate-500">
                    {sections.length > 1 ? `Section ${i + 1}` : 'Your building'}
                  </span>
                  {sections.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSection(i)}
                      className="text-xs font-medium text-slate-500 hover:text-[#e5433a] bg-transparent border-none cursor-pointer transition-colors duration-150"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="field-label" htmlFor={`bt-${i}`}>Building type</label>
                    <select
                      id={`bt-${i}`}
                      className="input-field"
                      value={s.buildingType}
                      onChange={(e) => updateSection(i, { buildingType: e.target.value })}
                    >
                      <option value="" disabled>Select building use…</option>
                      {BUILDING_TYPES.map((b) => (
                        <option key={b.key} value={b.key}>{b.label}</option>
                      ))}
                    </select>
                    {s.buildingType && (
                      <p className="mt-1.5 text-xs text-slate-500 mb-0">
                        {BUILDING_TYPES.find((b) => b.key === s.buildingType)?.hint}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="field-label" htmlFor={`area-${i}`}>Approx. floor area</label>
                      <div className="relative">
                        <input
                          id={`area-${i}`}
                          className="input-field !pr-12"
                          type="number"
                          inputMode="numeric"
                          min={1}
                          placeholder="e.g. 1200"
                          value={s.area}
                          onChange={(e) => updateSection(i, { area: e.target.value })}
                        />
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                          m²
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="field-label" htmlFor={`st-${i}`}>Storeys</label>
                      <input
                        id={`st-${i}`}
                        className="input-field"
                        type="number"
                        inputMode="numeric"
                        min={1}
                        max={MAX_STOREYS}
                        value={s.storeys}
                        onChange={(e) => updateSection(i, { storeys: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {sections.length < MAX_SECTIONS && (
              <button
                type="button"
                onClick={addSection}
                className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-300 bg-transparent py-2.5 text-sm font-medium text-slate-600 cursor-pointer transition-colors duration-150 hover:border-[#73d63b] hover:text-slate-900"
              >
                <span className="text-lg leading-none">+</span> Add another section
                <span className="text-xs text-slate-500">(e.g. office + warehouse)</span>
              </button>
            )}
          </div>

          {error && <ErrorNote>{error}</ErrorNote>}

          <button type="button" onClick={goToDetails} className="btn-primary w-full">
            Continue
          </button>
        </div>
      )}

      {step === 'details' && (
        <form className="space-y-5" onSubmit={submit}>
          <p className="text-sm text-slate-600 m-0">A little about your project, and where to send the estimate.</p>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="field-label" htmlFor="est-project-name">Project name / reference</label>
              <input
                id="est-project-name"
                className="input-field"
                placeholder="e.g. 12 High St warehouse"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>
            <div>
              <label className="field-label" htmlFor="est-project-location">
                Project location / region <span className="optional">(optional)</span>
              </label>
              <input
                id="est-project-location"
                className="input-field"
                placeholder="e.g. Tauranga"
                value={projectLocation}
                onChange={(e) => setProjectLocation(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="field-label" htmlFor="est-name">Name</label>
              <input
                id="est-name"
                className="input-field"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>
            <div>
              <label className="field-label" htmlFor="est-company">Company</label>
              <input
                id="est-company"
                className="input-field"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                autoComplete="organization"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="field-label" htmlFor="est-email">Email</label>
              <input
                id="est-email"
                className="input-field"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            <div>
              <label className="field-label" htmlFor="est-phone">Phone</label>
              <input
                id="est-phone"
                className="input-field"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
              />
            </div>
          </div>

          {/* Honeypot — off-screen, not focusable. */}
          <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', height: 0, width: 0, overflow: 'hidden' }}>
            <label htmlFor="company_website">Company website</label>
            <input
              id="company_website"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          {error && <ErrorNote>{error}</ErrorNote>}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => { setError(null); setStep('project'); }}
              className="btn-ghost"
            >
              Back
            </button>
            <button type="submit" disabled={submitting} className="btn-primary flex-1">
              {submitting ? 'Sending…' : 'Email me my estimate'}
            </button>
          </div>
          <p className="text-center text-xs text-slate-500 m-0">
            We'll only use your details to send this estimate and follow up.
          </p>
        </form>
      )}
    </div>
  );
}

function Confirmation({
  outcome,
  tier,
  email,
  emailed,
  isResidential,
}: {
  outcome: Outcome;
  /** Package name on a `fixed` outcome; null if the CRM didn't send one. */
  tier: string | null;
  email: string;
  emailed: boolean;
  /** Lead picked a standalone home — hand them across to Resiguard. */
  isResidential: boolean;
}) {
  const heading =
    outcome === 'fixed'
      ? `Your ${tier ?? 'fixed-price'} package is on its way`
      : outcome === 'range'
        ? 'Your estimate is on its way'
        : "Thanks, we'll be in touch";

  // What's landing in their inbox. Only the `contact` path has nothing.
  const emailedThing =
    outcome === 'fixed'
      ? tier
        ? `the full details of your ${tier} design package`
        : 'the full details of your design package'
      : 'your indicative fee range';

  return (
    <div className="card p-8 text-center">
      <div className="check-badge mx-auto mb-5">
        <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
      </div>
      <h2 className="text-2xl font-semibold text-slate-900 mb-2">{heading}</h2>
      <p className="mx-auto max-w-md text-sm leading-relaxed text-slate-600">
        {outcome === 'contact' ? (
          <>
            Your project needs a closer look before we can put a number on it. One
            of our team will review your details and get back to you within 1 business day.
          </>
        ) : (
          <>
            {emailed ? "We've emailed" : "We're emailing"} {emailedThing} to{' '}
            <span className="font-medium text-slate-900">{email}</span>. It should
            arrive within a couple of minutes. Check your spam folder if you don't see it.
          </>
        )}
      </p>

      {isResidential && <ResiguardHandoff priced={outcome === 'fixed'} />}
    </div>
  );
}

/**
 * Shown after a lead tells us their project is a standalone home. We design
 * those under Resiguard, where the work is sold as fixed-price packages
 * rather than a consulting fee.
 *
 * `priced` says whether they already have a number: once a package is on
 * its way, re-explaining that we price homes differently is noise — what
 * they want next is what the package covers.
 */
function ResiguardHandoff({ priced }: { priced: boolean }) {
  return (
    <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50/60 p-5 text-left">
      <span className="eyebrow !text-slate-500">One more thing</span>
      <h3 className="mt-1 text-base font-semibold text-slate-900">
        {priced ? 'Your home is designed by Resiguard' : 'We design homes under Resiguard'}
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
        {priced ? (
          <>
            Homes are designed to NZS 4517 under our residential brand,
            Resiguard — the same team, to the same standards. Your package
            covers the design, the consent documentation, and training your
            plumber to install it.
          </>
        ) : (
          <>
            Standalone homes are designed to NZS 4517 and run under our
            residential brand, Resiguard. It's the same team — but the design
            is sold as a fixed-price package rather than a consulting fee, so
            you can see what you'll pay up front.
          </>
        )}
      </p>
      <a
        href={RESIGUARD_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary mt-4 inline-block w-full text-center no-underline sm:w-auto"
      >
        {priced ? "See what's included" : "See Resiguard's design packages"}
      </a>
    </div>
  );
}

function StepBars({ step }: { step: Step }) {
  const idx = step === 'project' ? 0 : 1;
  return (
    <div className="mb-6 flex items-center gap-2">
      {[0, 1].map((i) => (
        <span key={i} className={`step-bar ${i <= idx ? 'active' : ''}`} />
      ))}
      <span className="ml-2 text-xs font-medium text-slate-500 whitespace-nowrap">
        Step {idx + 1} of 2
      </span>
    </div>
  );
}

function ErrorNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-lg border border-[#e5433a]/30 bg-[#e5433a]/5 px-3 py-2 text-sm text-[#b91c1c] m-0" role="alert">
      {children}
    </p>
  );
}
