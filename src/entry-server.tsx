/**
 * Build-time render entry. Not shipped to the browser.
 *
 * `scripts/prerender.mjs` imports this from the SSR bundle, renders each route
 * to an HTML string and writes it into dist/ as a real static file, so crawlers
 * (and anything else that doesn't run JavaScript) get a fully-formed page
 * instead of an empty <div id="root">.
 */

import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { MotionConfig } from 'motion/react';
import { AppRoutes, PRERENDER_ROUTES } from './routes';

import { meta as homeMeta } from './App';
import { meta as servicesMeta } from './pages/ServicesPage';
import { meta as projectsMeta } from './pages/ProjectsPage';
import { meta as aboutMeta } from './pages/AboutPage';
import { meta as contactMeta } from './pages/ContactPage';
import { meta as estimateMeta } from './pages/EstimatePage';
import { meta as toolsMeta } from './pages/ToolsPage';

export type PageMeta = { title: string; description: string };

/**
 * Per-route <head> content, re-exported from the page modules themselves so the
 * static HTML can never drift from what usePageMeta() sets after hydration.
 */
export const PAGE_META: Record<string, PageMeta> = {
  '/': homeMeta,
  '/services': servicesMeta,
  '/projects': projectsMeta,
  '/about': aboutMeta,
  '/contact': contactMeta,
  '/estimate': estimateMeta,
  '/tools': toolsMeta,

  // Internal pages. They still need static HTML because there's no catch-all
  // rewrite any more, but they're held out of the index by X-Robots-Tag.
  '/demo': { title: 'Demo | Sprinkler Design NZ', description: 'Internal demo page.' },
  '/projects-sync': {
    title: 'Projects Sync | Sprinkler Design NZ',
    description: 'Internal project sync tool.',
  },
};

/** Head content for the generated 404.html. */
export const NOT_FOUND_META: PageMeta = {
  title: 'Page not found | Sprinkler Design NZ',
  description:
    'That page does not exist. Browse our fire protection design services or get in touch with the team.',
};

export { PRERENDER_ROUTES };

export function render(url: string): string {
  return renderToString(
    <StrictMode>
      <MotionConfig reducedMotion="user">
        <StaticRouter location={url}>
          <AppRoutes />
        </StaticRouter>
      </MotionConfig>
    </StrictMode>,
  );
}
