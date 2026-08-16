/**
 * Turn the built SPA into static HTML, one file per route.
 *
 * Runs after `vite build` (client) and `vite build --ssr` (server). For each
 * route it renders the React tree to a string, drops it into the #root div of
 * the built index.html, and rewrites the <head> so the static file carries the
 * right title/description/canonical/OG tags — the same values usePageMeta()
 * applies after hydration.
 *
 * Why this exists: without it the server sends <div id="root"></div> and
 * nothing else, so any crawler that doesn't execute JavaScript (GPTBot,
 * ClaudeBot, PerplexityBot, every link-preview scraper) reads an empty page.
 *
 * Usage: node scripts/prerender.mjs
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const SSR_ENTRY = join(ROOT, 'dist-ssr', 'entry-server.js');
const ORIGIN = 'https://www.sprinklerdesign.co.nz';

/** Escape a string for use inside a double-quoted HTML attribute. */
const attr = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Escape a string for use as element text. */
const text = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * Replace a tag matched by `re`, or append `fallback` to <head> if it's absent.
 * Throws if the pattern matches more than once, which would mean the template
 * changed shape and we'd be silently editing the wrong tag.
 */
function replaceTag(html, re, replacement, label) {
  const matches = html.match(new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g'));
  if (!matches) {
    return html.replace('</head>', `    ${replacement}\n  </head>`);
  }
  if (matches.length > 1) {
    throw new Error(`prerender: expected one "${label}" tag in index.html, found ${matches.length}`);
  }
  return html.replace(re, replacement);
}

function applyMeta(html, { title, description, canonical }) {
  html = replaceTag(html, /<title>[\s\S]*?<\/title>/, `<title>${text(title)}</title>`, 'title');
  html = replaceTag(
    html,
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${attr(description)}" />`,
    'description',
  );
  html = replaceTag(
    html,
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${attr(canonical)}" />`,
    'canonical',
  );
  html = replaceTag(
    html,
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:url" content="${attr(canonical)}" />`,
    'og:url',
  );
  html = replaceTag(
    html,
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:title" content="${attr(title)}" />`,
    'og:title',
  );
  html = replaceTag(
    html,
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:description" content="${attr(description)}" />`,
    'og:description',
  );
  html = replaceTag(
    html,
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/,
    `<meta name="twitter:title" content="${attr(title)}" />`,
    'twitter:title',
  );
  html = replaceTag(
    html,
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="twitter:description" content="${attr(description)}" />`,
    'twitter:description',
  );
  return html;
}

/** Put the rendered markup inside the (empty) #root div. */
function injectApp(html, appHtml) {
  const re = /(<div id="root">)(\s*)(<\/div>)/;
  if (!re.test(html)) {
    throw new Error('prerender: could not find <div id="root"></div> in dist/index.html');
  }
  return html.replace(re, `$1${appHtml}$3`);
}

/** '/'-> dist/index.html, '/services' -> dist/services.html (cleanUrls serves it at /services). */
const outFile = (route) => join(DIST, route === '/' ? 'index.html' : `${route.replace(/^\//, '')}.html`);

async function main() {
  const template = await readFile(join(DIST, 'index.html'), 'utf8');
  const { render, PAGE_META, PRERENDER_ROUTES, NOT_FOUND_META } = await import(
    pathToFileURL(SSR_ENTRY).href
  );

  const missing = PRERENDER_ROUTES.filter((r) => !PAGE_META[r]);
  if (missing.length) {
    throw new Error(`prerender: no PAGE_META entry for ${missing.join(', ')}`);
  }

  const written = [];
  for (const route of PRERENDER_ROUTES) {
    const appHtml = render(route);
    if (!appHtml || appHtml.length < 500) {
      throw new Error(`prerender: ${route} rendered only ${appHtml?.length ?? 0} chars — expected a full page`);
    }
    const { title, description } = PAGE_META[route];
    const canonical = ORIGIN + (route === '/' ? '/' : route);
    const html = applyMeta(injectApp(template, appHtml), { title, description, canonical });

    const dest = outFile(route);
    await mkdir(dirname(dest), { recursive: true });
    await writeFile(dest, html, 'utf8');
    written.push([route, dest, html.length]);
  }

  // Vercel serves dist/404.html with a real 404 status for anything unmatched.
  const notFoundHtml = applyMeta(injectApp(template, render('/__not-found__')), {
    ...NOT_FOUND_META,
    canonical: `${ORIGIN}/404`,
  }).replace(
    /<meta\s+name="robots"\s+content="[^"]*"\s*\/?>/,
    '<meta name="robots" content="noindex, follow" />',
  );
  await writeFile(join(DIST, '404.html'), notFoundHtml, 'utf8');
  written.push(['404', join(DIST, '404.html'), notFoundHtml.length]);

  console.log('\nPrerendered:');
  for (const [route, dest, size] of written) {
    console.log(`  ${route.padEnd(16)} -> ${dest.replace(ROOT + '\\', '').replace(ROOT + '/', '')}  ${(size / 1024).toFixed(1)} KB`);
  }
  console.log(`\n${written.length} static pages written.\n`);
}

main().catch((err) => {
  console.error('\nPrerender failed:', err.message, '\n');
  process.exit(1);
});
