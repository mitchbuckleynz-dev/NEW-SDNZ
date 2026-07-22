/**
 * Contact — form (Turnstile-protected, posts to /api/contact) + direct details.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Phone, Mail, MapPin, CheckCircle2 } from 'lucide-react';
import { Navbar, Footer, usePageMeta } from '../components/site';

export function ContactPage() {
  usePageMeta(
    'Contact Us | Sprinkler Design NZ',
    'Get in touch with Sprinkler Design NZ — call 0800 113 996 or send us a message for an obligation-free consultation on your fire protection design.',
  );

  const [formState, setFormState] = useState({ firstName: '', lastName: '', email: '', phone: '', subject: '', message: '', submitted: false });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Cloudflare Turnstile (bot challenge). The site key is public; the
  // secret lives only in the /api/contact serverless function.
  const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const tokenRef = useRef('');
  const honeypotRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!turnstileSiteKey) return;
    let cancelled = false;
    const tryRender = () => {
      if (cancelled || widgetIdRef.current || !turnstileRef.current || !window.turnstile) {
        return;
      }
      widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
        sitekey: turnstileSiteKey,
        theme: 'light',
        callback: (token) => { tokenRef.current = token; },
        'expired-callback': () => { tokenRef.current = ''; },
        'error-callback': () => { tokenRef.current = ''; },
      });
    };
    // The script loads async — poll briefly until window.turnstile exists.
    tryRender();
    const interval = window.setInterval(tryRender, 300);
    return () => { cancelled = true; window.clearInterval(interval); };
  }, [turnstileSiteKey]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg('');

    // Honeypot — if a bot filled the hidden field, pretend success.
    if (honeypotRef.current?.value) {
      setFormState((prev) => ({ ...prev, submitted: true }));
      return;
    }

    if (turnstileSiteKey && !tokenRef.current) {
      setErrorMsg('Please complete the verification check, then try again.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { firstName, lastName, email, phone, subject, message } = formState;
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName, lastName, email, phone, subject, message,
          turnstileToken: tokenRef.current,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error || 'Submission failed');
      }
      setFormState((prev) => ({ ...prev, submitted: true }));
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorMsg(
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please email info@sprinklerdesign.co.nz.',
      );
      // Reset the challenge so the user can retry cleanly.
      tokenRef.current = '';
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <Navbar />
      <main id="main">
        <section className="py-16 md:py-20 bg-white" aria-labelledby="contact-heading">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
              {/* Info column */}
              <div>
                <p className="eyebrow mb-4">Get In Touch</p>
                <h1 id="contact-heading" className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight leading-tight mb-4">
                  Let's discuss your next project
                </h1>
                <p className="text-[15px] md:text-lg text-slate-600 mb-10 leading-relaxed">
                  Ready to elevate your fire protection design? Get in touch with our experts today for an obligation-free consultation.
                </p>

                <div className="space-y-6">
                  {[
                    { icon: Phone, label: 'Call Us', value: '0800 113 996', href: 'tel:0800113996' },
                    { icon: Mail, label: 'Email Us', value: 'info@sprinklerdesign.co.nz', href: 'mailto:info@sprinklerdesign.co.nz' },
                    { icon: MapPin, label: 'Location', value: 'Auckland · Wellington · Christchurch · Nationwide', href: null },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-4">
                      <div className="w-11 h-11 flex items-center justify-center flex-shrink-0 rounded-lg tint-green">
                        <item.icon className="text-[#3e7d1c] w-5 h-5" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="eyebrow !flex !text-slate-500 mb-1">{item.label}</p>
                        {item.href ? (
                          <a href={item.href} className="text-[15px] font-medium text-slate-900 hover:text-[#3e7d1c] transition-colors cursor-pointer">
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-[15px] font-medium text-slate-900 m-0">{item.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form */}
              <div className="card p-6 md:p-8">
                {formState.submitted ? (
                  <div className="text-center py-12">
                    <div className="check-badge mx-auto mb-5">
                      <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
                    </div>
                    <h2 className="text-2xl font-semibold text-slate-900 mb-2">Message sent</h2>
                    <p className="text-slate-600 text-[15px] mb-4">Thank you for reaching out. We'll be in touch shortly.</p>
                    <p className="text-slate-500 text-sm">
                      Need us sooner? Call <a href="tel:0800113996" className="text-[#3e7d1c] font-medium">0800 113 996</a>.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5" noValidate aria-label="Contact form">
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="contact-first-name" className="field-label">First Name *</label>
                        <input
                          id="contact-first-name"
                          type="text"
                          required
                          autoComplete="given-name"
                          className="input-field"
                          placeholder="John"
                          value={formState.firstName}
                          onChange={(e) => setFormState((p) => ({ ...p, firstName: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label htmlFor="contact-last-name" className="field-label">Last Name *</label>
                        <input
                          id="contact-last-name"
                          type="text"
                          required
                          autoComplete="family-name"
                          className="input-field"
                          placeholder="Smith"
                          value={formState.lastName}
                          onChange={(e) => setFormState((p) => ({ ...p, lastName: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="contact-email" className="field-label">Email Address *</label>
                        <input
                          id="contact-email"
                          type="email"
                          required
                          autoComplete="email"
                          className="input-field"
                          placeholder="john@company.co.nz"
                          value={formState.email}
                          onChange={(e) => setFormState((p) => ({ ...p, email: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label htmlFor="contact-phone" className="field-label">Phone Number *</label>
                        <input
                          id="contact-phone"
                          type="tel"
                          required
                          autoComplete="tel"
                          className="input-field"
                          placeholder="021 123 4567"
                          value={formState.phone}
                          onChange={(e) => setFormState((p) => ({ ...p, phone: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="contact-subject" className="field-label">Subject <span className="optional">(optional)</span></label>
                      <input
                        id="contact-subject"
                        type="text"
                        className="input-field"
                        placeholder="Project Inquiry / Quote Request"
                        value={formState.subject}
                        onChange={(e) => setFormState((p) => ({ ...p, subject: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-message" className="field-label">Message *</label>
                      <textarea
                        id="contact-message"
                        required
                        rows={5}
                        className="input-field"
                        placeholder="Tell us about your project - type, location, stage, timeline..."
                        value={formState.message}
                        onChange={(e) => setFormState((p) => ({ ...p, message: e.target.value }))}
                      />
                    </div>
                    {/* Honeypot — hidden from users; bots tend to fill it. */}
                    <input
                      ref={honeypotRef}
                      type="text"
                      name="company_website"
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                      className="hidden"
                      style={{ position: 'absolute', left: '-9999px' }}
                    />
                    {/* Cloudflare Turnstile widget */}
                    <div ref={turnstileRef} className="flex justify-center" />
                    {errorMsg && (
                      <p className="text-[#e5433a] text-sm text-center" role="alert">
                        {errorMsg}
                      </p>
                    )}
                    <button
                      type="submit"
                      id="contact-submit"
                      disabled={isSubmitting}
                      className="btn-primary w-full"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                    <p className="text-slate-500 text-xs text-center m-0">
                      We typically respond within 1 business day.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
