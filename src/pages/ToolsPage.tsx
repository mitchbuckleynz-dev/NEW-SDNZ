/**
 * Head Start launch page — /tools
 *
 * Written to this repo's conventions: shared chrome from components/site,
 * the recipe classes from index.css (.eyebrow, .card, .btn-primary, .tag),
 * lucide-react icons, and 15px body copy. No new dependencies.
 */

import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Mail, Smartphone, UserPlus } from 'lucide-react';
import { Navbar, Footer, usePageMeta } from '../components/site';
import { ToolIcon } from '../components/ToolIcon';

const APP_URL = 'https://app.sprinklerdesign.co.nz';

// ─── Content ──────────────────────────────────────────────────────────────────
const TOOLS = [
  {
    id: 'spacing',
    name: 'Sprinkler Spacer',
    standard: 'Spacing & coverage',
    blurb:
      'Room dimensions in, head count and spacings out — with every wall and between-head distance checked against the standard.',
    onsite: 'Know how many heads a room takes before you start setting out.',
  },
  {
    id: 'obstruction',
    name: 'Obstruction Calculator',
    standard: 'Obstruction rules',
    blurb:
      'One sprinkler against one obstruction, resolved against the published obstruction rules — and it tells you how far to move the head if it fails.',
    onsite: 'Settle the beam argument on the spot, with the reasoning shown.',
  },
  {
    id: 'scale',
    name: 'Drawing Scale',
    standard: 'Site measurement',
    blurb:
      'Calibrate off a known dimension, then measure anything on the sheet. It warns you when a drawing is not a standard scale.',
    onsite: 'Catches the reduced print before you set out to a wrong dimension.',
  },
  {
    id: 'slope',
    name: 'Sloped Pipe Solver',
    standard: 'Site trigonometry',
    blurb:
      'The plan dimensions the flat run; the pipe runs the hypotenuse. Enter the run and the pitch, get the length to cut.',
    onsite: 'Stops you cutting to the plan dimension and coming up short.',
  },
];

const STEPS = [
  { icon: UserPlus, title: 'Register', text: 'Name, company, region, phone, email. Takes a minute.' },
  { icon: Mail, title: 'Confirm your email', text: 'Tap the link we send you. That link is the key — no approval queue, no waiting on us.' },
  { icon: Smartphone, title: 'Add to home screen', text: 'It installs like an app. No store, no download, no updates to chase.' },
];

const STANDARDS = [
  { code: 'Spacing & coverage', desc: 'Maximum head spacings, wall distances and coverage areas for automatic fire sprinkler systems.' },
  { code: 'Obstruction distances', desc: 'Sprinkler distances from obstructions, including conventional upright heads.' },
  { code: 'Sectional check', desc: 'The obstruction tool draws the section and dimensions it the way the standard does.' },
  { code: 'Guidance only', desc: 'Head Start is a check, not a design. Always verify independently and consult a qualified fire protection engineer.' },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export function ToolsPage() {
  usePageMeta(
    'Head Start | Free tools for NZ sprinkler fitters',
    'Four free fire protection tools for New Zealand sprinkler fitters — head spacing, obstruction rules, drawing scale and sloped pipe cut lengths. Built by Sprinkler Design NZ.',
  );

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <Navbar />
      <main id="main">
        {/* ── Hero ── */}
        <section className="py-20 md:py-24 bg-gradient-to-b from-white to-slate-50">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <p className="eyebrow mb-5">Free for the NZ Fire Protection Industry</p>
              <h1 className="text-3xl md:text-5xl font-semibold text-slate-900 tracking-tight leading-[1.05] mb-5">
                The sprinkler maths,
                <br />
                in your pocket.
              </h1>
              <p className="text-[15px] md:text-lg text-slate-600 leading-relaxed mb-5 max-w-xl">
                Head spacing. Obstruction rules. Drawing scale. Sloped pipe cut lengths. Four tools that
                answer the questions you actually stop and work out on site — on the phone that&apos;s
                already in your pocket.
              </p>
              <p className="text-[15px] text-slate-500 leading-relaxed mb-8 max-w-xl">
                Built by a fire protection designer who spent years on the tools first.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href={APP_URL} className="btn-primary" id="tools-hero-cta">
                  Register free
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </a>
                <a href="#tools" className="btn-ghost">
                  See the four tools
                </a>
              </div>
              <p className="mt-6 text-sm font-semibold text-[#3e7d1c]">All four tools live 10 August</p>
            </div>

            {/* Replace with a real screenshot export once you have one. */}
            <div className="flex justify-center">
              <img
                src="/images/head-start-launcher.png"
                alt="Head Start app showing its four tools"
                width={300}
                height={560}
                className="w-[300px] rounded-2xl border border-slate-200 shadow-lg"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* ── The four tools ── */}
        <section id="tools" className="py-20 md:py-24 bg-white" aria-labelledby="tools-heading">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <p className="eyebrow justify-center mb-4">What&apos;s In It</p>
              <h2 id="tools-heading" className="text-2xl font-semibold text-slate-900 tracking-tight mb-4">
                Four tools, one login
              </h2>
              <p className="text-[15px] text-slate-600 leading-relaxed">
                Each one does a job you&apos;d otherwise do on a calculator, on the back of a duct offcut,
                or by ringing the designer.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {TOOLS.map((tool) => (
                <article key={tool.id} className="card p-6 md:p-8 flex gap-5 transition-colors duration-150 hover:border-slate-300">
                  <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center rounded-lg tint-green text-[#3e7d1c]">
                    <ToolIcon id={tool.id} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-1.5 leading-snug">{tool.name}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-3">{tool.blurb}</p>
                    <p className="text-slate-500 text-sm leading-relaxed mb-4">
                      <strong className="text-slate-700 font-semibold">On site:</strong> {tool.onsite}
                    </p>
                    <span className="tag">{tool.standard}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Why it exists ── */}
        <section className="py-20 md:py-24 bg-slate-50" aria-labelledby="why-heading">
          <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
            <p className="eyebrow justify-center mb-6">Why It Exists</p>
            <blockquote id="why-heading" className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight leading-snug mb-7 m-0">
              &ldquo;I would have paid for this myself when I was on the tools.&rdquo;
            </blockquote>
            <div className="flex items-center justify-center gap-3.5">
              <img src="/team-mitch.png" alt="Mitch Buckley" className="w-14 h-14 rounded-full object-cover border border-slate-200" />
              <div className="text-left">
                <p className="text-slate-900 font-medium text-[15px] m-0">Mitch Buckley</p>
                <p className="text-slate-500 text-sm mt-0.5 m-0">
                  Director, Sprinkler Design NZ · 20+ years in fire protection
                </p>
              </div>
            </div>
            <p className="mt-8 text-[15px] text-slate-600 leading-relaxed max-w-xl mx-auto">
              Mitch started as a sprinkler fitter in 2004 and worked through the trade — fitting,
              estimating, contracts, then design. Head Start is the set of tools he wanted on the job and
              never had. It&apos;s free to the industry because the industry is better when the numbers are
              right the first time.
            </p>
          </div>
        </section>

        {/* ── Getting in ── */}
        <section className="py-20 md:py-24 bg-white" aria-labelledby="steps-heading">
          <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="eyebrow justify-center mb-4">Getting In</p>
              <h2 id="steps-heading" className="text-2xl font-semibold text-slate-900 tracking-tight">
                Three steps, about two minutes
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {STEPS.map((step, i) => (
                <div key={step.title} className="card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 flex items-center justify-center rounded-lg tint-green">
                      <step.icon className="w-5 h-5 text-[#3e7d1c]" aria-hidden="true" />
                    </div>
                    <p className="eyebrow">Step {i + 1}</p>
                  </div>
                  <h3 className="text-slate-900 font-semibold mb-2">{step.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed m-0">{step.text}</p>
                </div>
              ))}
            </div>
            <p className="mt-7 text-center text-sm text-slate-500 leading-relaxed max-w-xl mx-auto">
              We ask who you are so we know who&apos;s using it — that&apos;s the whole reason for the
              login. Your details are only ever used to contact you about Head Start.
            </p>
          </div>
        </section>

        {/* ── Standards ── */}
        <section className="py-20 md:py-24 bg-slate-50" aria-labelledby="standards-heading">
          <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="eyebrow justify-center mb-4">Straight From The Standard</p>
              <h2 id="standards-heading" className="text-2xl font-semibold text-slate-900 tracking-tight mb-4">
                Built on the printed tables, not rules of thumb
              </h2>
              <p className="text-[15px] text-slate-600 leading-relaxed">
                The rules come from the same standard your design is assessed against — transcribed,
                tested, and shown with their working on screen.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {STANDARDS.map((s) => (
                <div key={s.code} className="card p-5 flex items-start gap-4">
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg tint-green flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-[#3e7d1c]" aria-hidden="true" />
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

        {/* ── Register ── */}
        <section className="py-20 md:py-24 bg-white">
          <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="card p-10 md:p-14 text-center bg-gradient-to-b from-white to-slate-50">
              <p className="eyebrow justify-center mb-4">Live 10 August</p>
              <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight mb-3">
                Free. Register once, use all four.
              </h2>
              <p className="text-slate-600 mb-8 max-w-xl mx-auto text-[15px] leading-relaxed">
                The Sprinkler Spacer is live now. Obstruction, Drawing Scale and Sloped Pipe join it on
                10 August — register today and they&apos;ll just appear.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href={APP_URL} className="btn-primary" id="tools-footer-cta">
                  Register free
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </a>
                <Link to="/contact" className="btn-ghost">
                  Talk to us
                </Link>
              </div>
              <p className="mt-6 text-xs text-slate-500">
                app.sprinklerdesign.co.nz · works on any phone · no app store needed
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
