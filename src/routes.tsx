/**
 * The route table, shared by the browser entry (main.tsx) and the build-time
 * prerenderer (entry-server.tsx).
 *
 * Keeping one copy matters: if these diverge, a route can prerender to static
 * HTML that doesn't match what React hydrates, which is worse than no
 * prerendering at all.
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import { ServicesPage } from './pages/ServicesPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { EstimatePage } from './pages/EstimatePage';
import { DemoPage } from './pages/DemoPage';
import { MaintenancePage } from './pages/MaintenancePage';
import { ProjectsSyncPage } from './pages/ProjectsSyncPage';
import { ToolsPage } from './pages/ToolsPage';
import { NotFoundPage } from './pages/NotFoundPage';

/**
 * Every route that gets prerendered to a static file at build time.
 *
 * This list must stay exhaustive. vercel.json no longer has a catch-all
 * rewrite, so a live route missing from here would 404 in production instead of
 * falling back to the SPA shell. /demo and /projects-sync are internal and are
 * kept out of the index by X-Robots-Tag headers, not by omitting them here.
 *
 * /news and /sync are absent on purpose — they're 301s in vercel.json now.
 */
export const PRERENDER_ROUTES = [
  '/',
  '/services',
  '/projects',
  '/about',
  '/contact',
  '/estimate',
  '/tools',
  '/demo',
  '/projects-sync',
] as const;

export function AppRoutes({ maintenance = false }: { maintenance?: boolean }) {
  if (maintenance) {
    return (
      <Routes>
        {/* Public maintenance page */}
        <Route path="/" element={<MaintenancePage />} />

        {/* Development routes (for you to test) */}
        <Route path="/dev" element={<App />} />
        <Route path="/dev/services" element={<ServicesPage />} />
        <Route path="/dev/projects" element={<ProjectsPage />} />
        <Route path="/dev/about" element={<AboutPage />} />
        <Route path="/dev/contact" element={<ContactPage />} />
        <Route path="/dev/estimate" element={<EstimatePage />} />
        <Route path="/dev/demo" element={<DemoPage />} />
        <Route path="/dev/projects-sync" element={<ProjectsSyncPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/estimate" element={<EstimatePage />} />
      <Route path="/demo" element={<DemoPage />} />
      <Route path="/projects-sync" element={<ProjectsSyncPage />} />
      <Route path="/tools" element={<ToolsPage />} />

      {/* Retired URLs we still want to land somewhere useful. Keep these
          explicit — anything not listed should 404, not silently become a
          duplicate of the home page. */}
      <Route path="/news" element={<Navigate to="/" replace />} />
      <Route path="/sync" element={<Navigate to="/projects-sync" replace />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
