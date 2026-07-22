/**
 * Shared site chrome — Navbar, Footer, and per-page meta helper.
 * White sticky nav with hairline border; the CTA button is the only
 * coloured element (design system rule).
 */

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, Mail, Menu, X } from 'lucide-react';

export const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services' },
  { name: 'Projects', href: '/projects' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

/** Set document title + meta description for a page (SPA-level SEO). */
export function usePageMeta(title: string, description?: string) {
  useEffect(() => {
    document.title = title;
    if (description) {
      let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'description';
        document.head.appendChild(meta);
      }
      meta.content = description;
    }
    window.scrollTo(0, 0);
  }, [title, description]);
}

// ============================================================
// NAVBAR
// ============================================================
export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close the mobile menu on navigation
  useEffect(() => { setIsMobileMenuOpen(false); }, [pathname]);

  return (
    <nav
      id="navbar"
      className={`sticky top-0 w-full z-50 bg-white/90 backdrop-blur-md transition-colors duration-150 ${isScrolled ? 'border-b border-slate-200 shadow-sm' : 'border-b border-slate-100'}`}
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5" aria-label="Sprinkler Design NZ - Home">
            <img
              src="/logo.png"
              alt="Sprinkler Design NZ logo"
              className="w-10 h-10 object-contain"
            />
            <span className="text-lg font-semibold tracking-tight text-slate-900">
              Sprinkler<span className="text-[#4caf22]">Design</span>
              <span className="ml-1 text-[11px] font-normal uppercase tracking-widest text-slate-400">NZ</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-7" role="menubar">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  role="menuitem"
                  aria-current={isActive ? 'page' : undefined}
                  className={`text-sm font-medium transition-colors duration-150 cursor-pointer ${
                    isActive ? 'text-[#4caf22]' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <Link to="/estimate" id="navbar-cta" className="btn-primary text-sm">
              Get an Estimate
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-slate-700 p-2 cursor-pointer transition-colors hover:text-slate-900 bg-transparent border-none"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
            className="md:hidden bg-white border-t border-slate-200 overflow-hidden"
            role="menu"
          >
            <div className="px-5 pt-3 pb-6 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  role="menuitem"
                  className="block px-3 py-3 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-3">
                <Link to="/estimate" className="btn-primary w-full">
                  Get an Estimate
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// ============================================================
// FOOTER
// ============================================================
export const Footer = () => (
  <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8" aria-label="Site footer">
    <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
        {/* Brand */}
        <div className="space-y-4">
          <Link to="/" className="flex items-center gap-2.5" aria-label="Sprinkler Design NZ - Home">
            <img
              src="/logo.png"
              alt="Sprinkler Design NZ logo"
              className="w-10 h-10 object-contain"
            />
            <span className="text-lg font-semibold text-slate-900 tracking-tight">
              Sprinkler<span className="text-[#4caf22]">Design</span>
              <span className="ml-1 text-[11px] font-normal uppercase tracking-widest text-slate-400">NZ</span>
            </span>
          </Link>
          <p className="text-slate-500 text-sm leading-relaxed">
            Leading the way in BIM-driven fire protection design and consulting across New Zealand. Decades of expertise at your service.
          </p>
          <div className="flex gap-3">
            <a href="tel:0800113996" className="text-slate-400 hover:text-[#4caf22] transition-colors cursor-pointer" aria-label="Call us">
              <Phone className="w-4 h-4" aria-hidden="true" />
            </a>
            <a href="mailto:info@sprinklerdesign.co.nz" className="text-slate-400 hover:text-[#4caf22] transition-colors cursor-pointer" aria-label="Email us">
              <Mail className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <nav aria-label="Footer quick links">
          <h3 className="eyebrow !text-slate-400 mb-5">Quick Links</h3>
          <ul className="space-y-2.5 list-none p-0 m-0">
            {[...NAV_LINKS, { name: 'Get an Estimate', href: '/estimate' }].map((link) => (
              <li key={link.name}>
                <Link to={link.href} className="text-slate-600 hover:text-slate-900 transition-colors text-sm cursor-pointer">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Services */}
        <nav aria-label="Footer services links">
          <h3 className="eyebrow !text-slate-400 mb-5">Services</h3>
          <ul className="space-y-2.5 list-none p-0 m-0">
            {['Fire Sprinklers', 'Fire Alarms & Detection', 'Hydrants', 'Hose Reels & Extinguishers', 'BIM Design & Coordination', '3D Point Cloud Scanning'].map((s) => (
              <li key={s}>
                <Link to="/services" className="text-slate-600 hover:text-slate-900 transition-colors text-sm cursor-pointer">
                  {s}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact + CTA */}
        <div>
          <h3 className="eyebrow !text-slate-400 mb-5">Contact</h3>
          <div className="space-y-2.5 mb-6">
            <a href="tel:0800113996" className="block text-slate-600 hover:text-slate-900 transition-colors text-sm cursor-pointer">
              0800 113 996
            </a>
            <a href="mailto:info@sprinklerdesign.co.nz" className="block text-slate-600 hover:text-slate-900 transition-colors text-sm cursor-pointer">
              info@sprinklerdesign.co.nz
            </a>
            <p className="text-slate-500 text-sm m-0">New Zealand - Nationwide</p>
          </div>
          <Link to="/estimate" id="footer-cta" className="btn-primary w-full text-sm">
            Get an Estimate
          </Link>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-200 pt-7 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-slate-400 text-sm m-0">
          © {new Date().getFullYear()} Sprinkler Design Ltd. All rights reserved.
        </p>
        <div className="flex gap-6 text-sm">
          <a href="https://www.sprinklerdesign.co.nz/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
            Privacy Policy
          </a>
          <a href="https://www.sprinklerdesign.co.nz/terms-of-use" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
            Terms of Use
          </a>
        </div>
      </div>
    </div>
  </footer>
);

// ============================================================
// CTA BAND — reused on several pages
// ============================================================
export const CtaBand = ({ heading, sub }: { heading?: string; sub?: string }) => (
  <section className="py-20 md:py-24 bg-white">
    <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
      <div className="card p-10 md:p-14 text-center bg-gradient-to-b from-white to-slate-50">
        <p className="eyebrow justify-center mb-4">Ready When You Are</p>
        <h2 className="text-2xl font-semibold text-slate-900 tracking-tight mb-3">
          {heading ?? 'Know your fire protection costs in minutes'}
        </h2>
        <p className="text-slate-600 mb-8 max-w-xl mx-auto text-[15px] leading-relaxed">
          {sub ?? 'Get an instant, indicative design fee range for your project — or talk to our team for an obligation-free consultation.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/estimate" className="btn-primary">
            Get an instant estimate
          </Link>
          <Link to="/contact" className="btn-ghost">
            Talk to us
          </Link>
        </div>
      </div>
    </div>
  </section>
);
