/**
 * Native fee-estimator form — two steps (project → details → done).
 *
 * Mirrors the CRM's public estimator exactly (same keys, same guard rails)
 * but renders in this site's own components, and POSTs same-origin to
 * /api/estimate — a small Vercel proxy that forwards to the CRM. All
 * pricing stays server-side in the CRM; the response carries no dollar
 * figures (the range is emailed).
 */

import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

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

type Step = 'project' | 'details' | 'done';
type Outcome = 'range' | 'contact';

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
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [emailed, setEmailed] = useState(false);

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
          `Section ${i + 1} is larger than we can estimate online — please contact us directly.`,
        );
    }
    setStep('details');
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      return setError('Please enter a valid email address.');
    if (!name.trim()) return setError('Please enter your name.');

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
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          company_website: honeypot,
        }),
      });
      const data = (await res.json().catch(() => null)) as
        | { ok: boolean; outcome?: Outcome; emailed?: boolean; error?: string }
        | null;
      if (!res.ok || !data?.ok) {
        setError(data?.error ?? 'Something went wrong. Please try again.');
        setSubmitting(false);
        return;
      }
      setOutcome(data.outcome ?? 'range');
      setEmailed(Boolean(data.emailed));
      setStep('done');
    } catch {
      setError("Couldn't reach the server. Please try again.");
      setSubmitting(false);
    }
  }

  if (step === 'done') {
    return <Confirmation outcome={outcome ?? 'range'} email={email} emailed={emailed} />;
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
                      className="text-xs font-medium text-slate-400 hover:text-[#e5433a] bg-transparent border-none cursor-pointer transition-colors duration-150"
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
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
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
                <span className="text-xs text-slate-400">(e.g. office + warehouse)</span>
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
          <p className="text-sm text-slate-600 m-0">Where should we send your estimate?</p>

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
              <label className="field-label" htmlFor="est-phone">
                Phone <span className="optional">(optional)</span>
              </label>
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
          <p className="text-center text-xs text-slate-400 m-0">
            We'll only use your details to send this estimate and follow up.
          </p>
        </form>
      )}
    </div>
  );
}

function Confirmation({
  outcome,
  email,
  emailed,
}: {
  outcome: Outcome;
  email: string;
  emailed: boolean;
}) {
  const isRange = outcome === 'range';
  return (
    <div className="card p-8 text-center">
      <div className="check-badge mx-auto mb-5">
        <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
      </div>
      <h2 className="text-2xl font-semibold text-slate-900 mb-2">
        {isRange ? 'Your estimate is on its way' : "Thanks — we'll be in touch"}
      </h2>
      <p className="mx-auto max-w-md text-sm leading-relaxed text-slate-600">
        {isRange ? (
          <>
            {emailed ? "We've emailed" : "We're emailing"} your indicative fee range to{' '}
            <span className="font-medium text-slate-900">{email}</span>. It should
            arrive within a couple of minutes — check your spam folder if you don't see it.
          </>
        ) : (
          <>
            Your project needs a closer look before we can put a number on it. One
            of our team will review your details and get back to you within 1 business day.
          </>
        )}
      </p>
      <p className="mt-6 text-sm text-slate-500 mb-0">
        Prefer to talk now? Call us on{' '}
        <a href="tel:0800113996" className="font-medium text-[#4caf22]">0800 113 996</a>.
      </p>
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
      <span className="ml-2 text-xs font-medium text-slate-400 whitespace-nowrap">
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
