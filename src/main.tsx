import { StrictMode } from 'react';
import { hydrateRoot, createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { MotionConfig } from 'motion/react';
import { Analytics } from '@vercel/analytics/react';
import { AppRoutes } from './routes';
import './index.css';

// To enable maintenance mode, add VITE_MAINTENANCE=true to your environment variables
const isMaintenance = import.meta.env.VITE_MAINTENANCE === 'true';

// Stash ad-campaign attribution (utm_* / li_fat_id) from the landing URL in
// sessionStorage. The LinkedIn ads land on the homepage; SPA routing drops
// the query string on the way to /estimate, so the estimator form falls back
// to this stash (see EstimateForm). Session-scoped: dies with the tab.
try {
  const params = new URLSearchParams(window.location.search);
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'li_fat_id'];
  const attr: Record<string, string> = {};
  for (const k of keys) {
    const v = params.get(k);
    if (v) attr[k] = v;
  }
  if (Object.keys(attr).length > 0) {
    if (document.referrer) attr.referrer = document.referrer;
    sessionStorage.setItem('sdnz_attribution', JSON.stringify(attr));
  }
} catch {
  // Attribution is best-effort only.
}

const tree = (
  <StrictMode>
    {/* Respect the OS "reduce motion" setting for all motion/react animations */}
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <AppRoutes maintenance={isMaintenance} />
      </BrowserRouter>
    </MotionConfig>
    <Analytics />
  </StrictMode>
);

// Prerendered routes ship with server-rendered markup in #root, so hydrate
// those instead of throwing the existing DOM away. Everything else (and the
// dev server, which serves the bare shell) still gets a fresh client render.
const container = document.getElementById('root')!;
if (container.hasChildNodes()) {
  hydrateRoot(container, tree);
} else {
  createRoot(container).render(tree);
}
