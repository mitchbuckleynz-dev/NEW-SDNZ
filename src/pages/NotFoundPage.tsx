/**
 * 404 page.
 *
 * Vercel rewrites every unmatched path to index.html, so the server always
 * answers 200 and React Router decides what to render. Previously the catch-all
 * route redirected to "/", which made every typo'd or dead URL look like a
 * second copy of the home page to Google. Rendering a real 404 here — with
 * robots noindex — stops that, and keeps genuine 404s visible in Search Console.
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, Mail } from 'lucide-react';
import { Navbar, Footer, usePageMeta } from '../components/site';

export function NotFoundPage() {
  usePageMeta(
    'Page not found | Sprinkler Design NZ',
    'That page does not exist. Browse our fire protection design services or get in touch with the team.',
  );

  // Tell crawlers not to index this page, and undo it on unmount so the tag
  // doesn't leak onto the next route in a client-side navigation.
  useEffect(() => {
    const robots = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const previous = robots?.content ?? 'index, follow';
    if (robots) robots.content = 'noindex, follow';
    return () => {
      if (robots) robots.content = previous;
    };
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 flex flex-col">
      <Navbar />

      <main id="main" className="flex-grow flex items-center justify-center px-5 py-20 md:py-28">
        <div className="max-w-xl mx-auto text-center">
          <p className="eyebrow justify-center mb-5">Error 404</p>

          <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight leading-tight mb-6">
            We couldn't find that page.
          </h1>

          <p className="text-[15px] md:text-lg text-slate-600 leading-relaxed mb-10">
            The link may be out of date, or the address may have been mistyped. Everything
            else is still where you left it.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="btn-primary inline-flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Back to home
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-slate-200 font-medium hover:bg-slate-50 transition-colors duration-150"
            >
              <Mail className="w-4 h-4" />
              Contact us
            </Link>
          </div>

          <div className="pt-10 mt-10 border-t border-slate-200">
            <p className="text-slate-500 text-sm mb-3">Looking for something specific?</p>
            <div className="flex flex-wrap gap-x-5 gap-y-2 justify-center text-sm">
              <Link to="/services" className="text-slate-600 hover:text-slate-900 underline underline-offset-4">Services</Link>
              <Link to="/projects" className="text-slate-600 hover:text-slate-900 underline underline-offset-4">Projects</Link>
              <Link to="/tools" className="text-slate-600 hover:text-slate-900 underline underline-offset-4">Free tools</Link>
              <Link to="/about" className="text-slate-600 hover:text-slate-900 underline underline-offset-4">About</Link>
              <Link to="/estimate" className="text-slate-600 hover:text-slate-900 underline underline-offset-4">Get an estimate</Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
