// Generates a real, crawlable static HTML page per topic at
// topics/<id>/index.html — full content, correct <title>/description/
// canonical/OG tags, no JavaScript required to read it — while keeping the
// existing hash-routed SPA fully intact for JS-enabled visitors.
//
// How the hybrid works: each generated page's <head> includes a tiny inline
// script that sets `location.hash = '#/<id>'` via history.replaceState
// before anything else loads. When JS is available, js/app.js's existing
// router (unchanged) picks up that hash on DOMContentLoaded and renders the
// exact same topic through the normal interactive SPA path — Run/Copy/Print/
// Mark as learned all work immediately, and further in-app navigation stays
// hash-based, exactly as it already did before this script existed. When JS
// is unavailable (or hasn't executed yet, e.g. for a crawler), the person
// still sees the full topic content, a working sidebar, and real prev/next/
// related links to other real pages — nothing depends on JS to be readable
// or to navigate between topics.
//
// Also regenerates the sidebar + landing content baked into the root
// index.html (same reasoning — real links, readable without JS) and rewrites
// sitemap.xml / robots.txt to point at the new real per-topic URLs instead
// of hash fragments.
//
// Run with: node scripts/build-static.mjs

import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { CATEGORIES, ALL_TOPICS_FLAT, TOPIC_INDEX, loadTopic } from '../js/topics/manifest.js';
import { TRACKS } from '../js/topics/tracks.js';
import { highlightCSharp } from '../js/highlight.js';

const TRACKS_BY_TOPIC = new Map();
for (const track of TRACKS) {
  for (const topicId of track.topicIds) {
    if (!TRACKS_BY_TOPIC.has(topicId)) TRACKS_BY_TOPIC.set(topicId, []);
    TRACKS_BY_TOPIC.get(topicId).push(track);
  }
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE_URL = 'https://devmina.github.io/LearnDotNet/';
const SITE_NAME = 'C# & .NET Concepts';
const SITE_DESCRIPTION = '100 interactive C# and .NET concepts with runnable code, 9 guided tracks, quizzes, and interview prep — from fundamentals to ASP.NET Core.';
const OG_IMAGE = `${BASE_URL}icons/icon-512.png`;

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function toPascalFileName(title) {
  return title.replace(/[^A-Za-z0-9]+/g, '');
}

// ---------- Shared sidebar markup (real <a href> links, no JS required) ----------
// `topicHrefFor(id)` lets the same builder serve both the root page (links
// point into topics/<id>/) and topic pages (links point to ../<id>/).
function buildSidebarHTML({ activeId, topicHrefFor, homeHref }) {
  const categoriesHTML = CATEGORIES.map(cat => {
    const itemsHTML = cat.topics.map(t => {
      const isActive = t.id === activeId;
      return `<a class="tree-item${isActive ? ' active' : ''}" href="${topicHrefFor(t.id)}"${isActive ? ' aria-current="page"' : ''}><span class="file-icon">cs</span><span>${escapeHtml(t.title)}</span></a>`;
    }).join('\n');

    return `<div class="tree-category">
  <div class="tree-category-label static" aria-expanded="true"><span class="chevron">&#9662;</span><span>${escapeHtml(cat.name)}</span><span class="tree-category-progress">${cat.topics.length} topic${cat.topics.length === 1 ? '' : 's'}</span></div>
  <div class="tree-items">
${itemsHTML}
  </div>
</div>`;
  }).join('\n');

  return `<div class="sidebar-header">
  <a class="logo" href="${homeHref}" aria-label="Go to home page"><span class="dot">&bull;</span> Solution Explorer</a>
  <div class="subtitle">CSharpConcepts.sln</div>
</div>
<div class="tree">
${categoriesHTML}
</div>`;
}

// ---------- Topic page main content ----------
function buildTopicMainHTML({ topic, content, category, prev, next, related, rootPrefix, siblingPrefix }) {
  const related_ = related.map(r =>
    `<a class="related-chip" href="${siblingPrefix}${r.id}/">${escapeHtml(r.title)}</a>`
  ).join('\n        ');

  const memberTracks = TRACKS_BY_TOPIC.get(topic.id) || [];
  const trackBadgesHTML = memberTracks.length
    ? `<div class="track-badges">${memberTracks.map(t => `<a class="track-badge" href="${rootPrefix}tracks/${t.id}/">&#8227; Part of: ${escapeHtml(t.title)}</a>`).join('')}</div>`
    : '';

  const prevHTML = prev
    ? `<a href="${siblingPrefix}${prev.id}/"><span class="dir">&larr; Previous</span>${escapeHtml(prev.title)}</a>`
    : '<span></span>';
  const nextHTML = next
    ? `<a href="${siblingPrefix}${next.id}/"><span class="dir">Next &rarr;</span>${escapeHtml(next.title)}</a>`
    : '<span></span>';

  const escapedOutput = escapeHtml(content.output);
  const mistakesHTML = content.mistakes && content.mistakes.length
    ? `<div class="key-points mistakes-box">
      <div class="kp-title kp-title--mistakes">&#9888; Common mistakes</div>
      <ul>${content.mistakes.map(m => `<li>${escapeHtml(m)}</li>`).join('')}</ul>
    </div>`
    : '';

  return `<div class="crumb"><a href="${rootPrefix}">Home</a><span class="sep">/</span>${escapeHtml(category.name)}<span class="sep">/</span>${escapeHtml(topic.title)}.cs</div>
    <div class="topic-title-row">
      <h1 class="topic-title">${escapeHtml(topic.title)}</h1>
      <button type="button" class="learned-toggle" id="learnedToggle" aria-pressed="false">
        <span class="check">&#10003;</span> Mark as learned
      </button>
    </div>
    <div class="topic-tagline">${content.tagline}</div>
    ${trackBadgesHTML}

    <div class="prose">${content.explanation}</div>

    <div class="key-points">
      <div class="kp-title">Key points</div>
      <ul>${content.keyPoints.map(kp => `<li>${kp}</li>`).join('')}</ul>
    </div>

    ${mistakesHTML}

    <div class="workbench">
      <div class="workbench-tabs">
        <div class="workbench-tab file-tab">${escapeHtml(toPascalFileName(topic.title))}.cs</div>
        <button class="copy-btn" id="copyBtn" type="button">Copy</button>
        <button class="print-btn" id="printBtn" type="button">&#8659; PDF</button>
        <button class="run-btn" id="runBtn" type="button"><span class="play">&#9654;</span> Run</button>
      </div>
      <pre class="code-block"><code>${highlightCSharp(content.code)}</code></pre>
      <div class="console">
        <div class="console-header built" id="consoleHeader">
          <span class="light"></span> Output
        </div>
        <div class="console-body" id="consoleBody"><span class="build-line">Build succeeded.</span>${escapedOutput}</div>
      </div>
    </div>

    ${related.length ? `<div class="related-topics">
      <div class="kp-title">Related topics</div>
      <div class="related-chips">
        ${related_}
      </div>
    </div>` : ''}

    <div class="topic-nav">
      ${prevHTML}
      ${nextHTML}
    </div>
    <div class="keyboard-hint">Tip: use &larr; &rarr; to move between topics, or press / to search.</div>`;
}

// ---------- Track page main content ----------
function buildTrackMainHTML({ track, trackTopics, rootPrefix }) {
  const topicHref = id => `${rootPrefix}topics/${id}/`;

  const stepsHTML = trackTopics.map((t, i) => {
    return `<a class="track-step" href="${topicHref(t.id)}">
      <span class="track-step-num">${i + 1}</span>
      <span class="track-step-title">${escapeHtml(t.title)}</span>
      <span class="track-step-cat">${escapeHtml(t.category.name)}</span>
    </a>`;
  }).join('\n      ');

  return `<div class="crumb"><a href="${rootPrefix}">Home</a><span class="sep">/</span>Guided track</div>
    <h1 class="topic-title">${escapeHtml(track.title)}</h1>
    <div class="topic-tagline">${escapeHtml(track.description)}</div>

    <a class="track-start-btn" href="${topicHref(trackTopics[0].id)}">
      <span class="play">&#9654;</span> Start track
    </a>

    <div class="track-steps">
      ${stepsHTML}
    </div>`;
}

// ---------- Landing page main content (baked into root index.html) ----------
function buildLandingMainHTML() {
  const totalTopics = CATEGORIES.reduce((n, c) => n + c.topics.length, 0);
  const cardsHTML = CATEGORIES.map(cat => {
    const firstTopicId = cat.topics[0].id;
    return `<a class="category-card" href="topics/${firstTopicId}/">
      <div class="count">${cat.topics.length} topic${cat.topics.length === 1 ? '' : 's'}</div>
      <div class="name">${escapeHtml(cat.name)}</div>
    </a>`;
  }).join('\n    ');

  const trackCardsHTML = TRACKS.map(track => {
    return `<a class="track-card" href="tracks/${track.id}/">
      <div class="count">${track.topicIds.length} topics</div>
      <div class="name">${escapeHtml(track.title)}</div>
      <div class="track-card-desc">${escapeHtml(track.description)}</div>
    </a>`;
  }).join('\n    ');

  return `<div class="landing-hero">
      <h1>C# &amp; .NET,<br>explained through running code.</h1>
      <p class="lead">${totalTopics} interactive C# &amp; .NET concepts — runnable code, guided learning paths, quizzes, and interview prep, from fundamentals to ASP.NET Core.</p>

      <div class="hero-actions">
        <a class="hero-btn hero-btn--primary" href="topics/variables-types/">&#9654; Start Learning C#</a>
        <a class="hero-btn" href="tracks/interview-prep/">&#128196; Interview Prep</a>
        <a class="hero-btn" href="tracks/aspnet-core-essentials/">&#127760; ASP.NET Core</a>
        <a class="hero-btn" href="#/quiz">&#128172; Take a Quiz</a>
      </div>

      <h2 class="section-heading">Learning paths</h2>
      <p class="section-subhead">Choose a goal and follow a curated sequence — same topics as below, deliberate order.</p>
      <div class="track-grid" id="trackGrid">
    ${trackCardsHTML}
      </div>

      <h2 class="section-heading">Explore all ${totalTopics} concepts</h2>
      <div class="category-grid" id="categoryGrid">
    ${cardsHTML}
      </div>

      <div class="random-topic-row">
        <button class="random-btn" id="randomTopicBtn" type="button">&#127922; Random topic</button>
        <span class="random-hint">or press <kbd>R</kbd></span>
      </div>
    </div>`;
}

// ---------- Full HTML page wrapper ----------
function buildPage({ title, description, canonical, assetPrefix, sidebarHTML, mainHTML, bootstrapHash, jsonLd }) {
  const hashScript = bootstrapHash
    ? `history.replaceState(null, '', location.pathname + location.search + '#/${bootstrapHash}');`
    : '';
  const jsonLdScript = jsonLd
    ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>\n`
    : '';

  return `<!DOCTYPE html>
<html lang="en" class="no-js">
<head>
<script>document.documentElement.className = 'js';${hashScript}</script>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${escapeHtml(SITE_NAME)}">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${OG_IMAGE}">
<meta name="twitter:card" content="summary">
<meta name="twitter:image" content="${OG_IMAGE}">
<meta name="twitter:title" content="${escapeHtml(title)}">
<meta name="twitter:description" content="${escapeHtml(description)}">
<meta name="theme-color" content="#0D1117">
<link rel="manifest" href="${assetPrefix}manifest.json">
<link rel="apple-touch-icon" href="${assetPrefix}icons/apple-touch-icon-180.png">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='18' fill='%230D1117'/%3E%3Ctext x='50' y='68' font-family='monospace' font-size='52' font-weight='700' fill='%23E8A33D' text-anchor='middle'%3EC%23%3C/text%3E%3C/svg%3E">
<link rel="stylesheet" href="${assetPrefix}css/style.css">
${jsonLdScript}</head>
<body>

  <button type="button" class="mobile-toggle" id="mobileToggle" aria-label="Toggle navigation" aria-expanded="false" aria-controls="sidebar">&#9776;</button>

  <div class="backdrop" id="backdrop"></div>

  <nav class="sidebar" id="sidebar" aria-label="Topic navigation">
${sidebarHTML}
  </nav>

  <div class="content-column">
    <main class="main" id="main" tabindex="-1">
    ${mainHTML}
    </main>

    <footer class="site-footer">
      <span>&copy; <span id="copyrightYear">2026</span> Mina Abdo</span>
      <span class="sep">&middot;</span>
      <a href="#/contact">Contact us</a>
    </footer>
  </div>

  <script type="module" src="${assetPrefix}js/app.js"></script>
  <script>
    if ('serviceWorker' in navigator && location.protocol !== 'file:') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('${assetPrefix}sw.js').catch(() => {});
      });
    }
  </script>
</body>
</html>
`;
}

// ---------- Structured data (JSON-LD) ----------
// Deliberately no datePublished/dateModified: there's no real per-topic
// modification date available without wiring up git history, and the same
// reasoning that killed sitemap.xml's <lastmod> applies here — a fabricated
// "today's date" would make every generated page change every single day
// for no real reason, which is worse than just omitting an optional field.
function buildTopicJsonLd({ topic, content, category, canonical }) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle',
        headline: topic.title,
        description: content.tagline,
        articleSection: category.name,
        image: OG_IMAGE,
        url: canonical,
        mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
        isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: BASE_URL },
        author: { '@type': 'Person', name: 'Mina Abdo' },
        publisher: {
          '@type': 'Organization',
          name: SITE_NAME,
          logo: { '@type': 'ImageObject', url: OG_IMAGE }
        }
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
          { '@type': 'ListItem', position: 2, name: topic.title, item: canonical }
        ]
      }
    ]
  };
}

function buildHomeJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: BASE_URL
  };
}


// ---------- Generate track pages ----------
async function buildTrackPages() {
  const tracksDir = path.join(root, 'tracks');
  await rm(tracksDir, { recursive: true, force: true });
  await mkdir(tracksDir, { recursive: true });

  const rootPrefix = '../../';

  for (const track of TRACKS) {
    const trackTopics = track.topicIds.map(id => TOPIC_INDEX[id]).filter(Boolean);

    const sidebarHTML = buildSidebarHTML({
      activeId: null,
      topicHrefFor: id => `${rootPrefix}topics/${id}/`,
      homeHref: rootPrefix
    });

    const mainHTML = buildTrackMainHTML({ track, trackTopics, rootPrefix });

    const page = buildPage({
      title: `${track.title} — ${SITE_NAME}`,
      description: track.description,
      canonical: `${BASE_URL}tracks/${track.id}/`,
      assetPrefix: rootPrefix,
      sidebarHTML,
      mainHTML,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: track.title,
        description: track.description,
        itemListElement: trackTopics.map((t, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: t.title,
          url: `${BASE_URL}topics/${t.id}/`
        }))
      }
    });

    const dir = path.join(tracksDir, track.id);
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, 'index.html'), page, 'utf-8');
  }
  return TRACKS.length;
}

// ---------- Generate topic pages ----------
async function buildTopicPages() {
  const topicsDir = path.join(root, 'topics');
  await rm(topicsDir, { recursive: true, force: true });
  await mkdir(topicsDir, { recursive: true });

  let count = 0;
  for (let i = 0; i < ALL_TOPICS_FLAT.length; i++) {
    const navMeta = TOPIC_INDEX[ALL_TOPICS_FLAT[i].id];
    const content = await loadTopic(navMeta.file);
    const category = navMeta.category;
    const prev = i > 0 ? ALL_TOPICS_FLAT[i - 1] : null;
    const next = i < ALL_TOPICS_FLAT.length - 1 ? ALL_TOPICS_FLAT[i + 1] : null;
    const related = (content.related || []).map(id => TOPIC_INDEX[id]).filter(Boolean);

    const rootPrefix = '../../';
    const siblingPrefix = '../';

    const sidebarHTML = buildSidebarHTML({
      activeId: navMeta.id,
      topicHrefFor: id => `${siblingPrefix}${id}/`,
      homeHref: rootPrefix
    });

    const mainHTML = buildTopicMainHTML({
      topic: navMeta, content, category, prev, next, related, rootPrefix, siblingPrefix
    });

    const page = buildPage({
      title: `${navMeta.title} — ${SITE_NAME}`,
      description: content.tagline,
      canonical: `${BASE_URL}topics/${navMeta.id}/`,
      assetPrefix: rootPrefix,
      sidebarHTML,
      mainHTML,
      bootstrapHash: navMeta.id,
      jsonLd: buildTopicJsonLd({ topic: navMeta, content, category, canonical: `${BASE_URL}topics/${navMeta.id}/` })
    });

    const dir = path.join(topicsDir, navMeta.id);
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, 'index.html'), page, 'utf-8');
    count++;
  }
  return count;
}

// ---------- Regenerate the sidebar + landing content baked into root index.html ----------
async function updateRootIndex() {
  const indexPath = path.join(root, 'index.html');
  let html = await readFile(indexPath, 'utf-8');

  const sidebarHTML = buildSidebarHTML({
    activeId: null,
    topicHrefFor: id => `topics/${id}/`,
    homeHref: './'
  });
  const mainHTML = buildLandingMainHTML();

  const sidebarRe = /(<nav class="sidebar" id="sidebar" aria-label="Topic navigation">)[\s\S]*?(<\/nav>)/;
  const mainRe = /(<main class="main" id="main" tabindex="-1">)[\s\S]*?(<\/main>)/;

  if (!sidebarRe.test(html) || !mainRe.test(html)) {
    throw new Error('Could not find the #sidebar or #main markers in index.html — has the shell markup changed?');
  }

  html = html.replace(sidebarRe, `$1\n${sidebarHTML}\n  $2`);
  html = html.replace(mainRe, `$1\n    ${mainHTML}\n    $2`);

  await writeFile(indexPath, html, 'utf-8');
}

// ---------- Regenerate sitemap.xml / robots.txt with real per-topic URLs ----------
// Deliberately no <lastmod> here. It's optional in the sitemap spec, and the
// only value available at generation time (today's date) isn't a real
// "last modified" date — it would make the file change every single day
// even when nothing in the site actually changed, which would make CI's
// rebuild-and-diff staleness check (see .github/workflows/validate.yml)
// fail constantly for no real reason. Omitting it keeps generation fully
// deterministic: the file only changes when the actual set of topics does.
async function updateSitemap() {
  // The contact "page" is only reachable as a hash fragment (#/contact) on
  // the same homepage document, so it isn't a distinct URL a crawler could
  // index separately — listing it here would just be noise (and could read
  // as a duplicate-URL warning in tools like Search Console). Real topic
  // and track pages are genuinely distinct documents, so those are the only
  // entries.
  const urls = [
    BASE_URL,
    ...ALL_TOPICS_FLAT.map(t => `${BASE_URL}topics/${t.id}/`),
    ...TRACKS.map(t => `${BASE_URL}tracks/${t.id}/`)
  ];

  const entries = urls.map(u => `  <url>\n    <loc>${u}</loc>\n  </url>`).join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
  await writeFile(path.join(root, 'sitemap.xml'), sitemap, 'utf-8');

  const robots = `User-agent: *\nAllow: /\n\nSitemap: ${BASE_URL}sitemap.xml\n`;
  await writeFile(path.join(root, 'robots.txt'), robots, 'utf-8');

  return urls.length;
}

// ---------- Generate sw.js with full offline pre-cache list ----------
// The service worker is generated (not hand-maintained) so it always knows
// the complete list of files to pre-cache, including all 84+ topic JS
// modules and every static page. A cache-version string is stamped at build
// time so the browser installs the new SW (and fetches updated files) after
// every deploy, not just when it happens to visit a changed page.
async function buildServiceWorker() {
  // Deterministic version: a hash of all topic/track ids — changes whenever
  // a topic is added, removed, or renamed, stays the same otherwise.
  // This is the same principle used in the DevBox project's cache versioning.
  const versionInput = [
    ...ALL_TOPICS_FLAT.map(t => t.id),
      ...TRACKS.map(t => t.id),
      'v7'
  ].join(',');
  const version = versionInput.split('').reduce((h, c) => (Math.imul(31, h) + c.charCodeAt(0)) | 0, 0)
    .toString(16).replace('-', '');

  const shellUrls = [
    './',
    './index.html',
    './manifest.json',
    './css/style.css',
    './js/highlight.js',
    './js/app.js',
    './js/quiz.js',
    './js/topics/manifest.js',
    './js/topics/search-index.js',
    './js/topics/tracks.js',
    './icons/icon-192.png',
    './icons/icon-512.png',
    './icons/maskable-192.png',
    './icons/maskable-512.png',
    './icons/apple-touch-icon-180.png',
  ];

  const topicModuleUrls = ALL_TOPICS_FLAT.map(t =>
    './' + t.file.replace(/^\.\//, 'js/topics/')
  );

  const staticPageUrls = [
    ...ALL_TOPICS_FLAT.map(t => `./topics/${t.id}/index.html`),
    ...TRACKS.map(t => `./tracks/${t.id}/index.html`),
  ];

  const allUrls = [...shellUrls, ...topicModuleUrls, ...staticPageUrls];

  const sw = `// AUTO-GENERATED by scripts/build-static.mjs — do not edit by hand.
// Re-run \`node scripts/build-static.mjs\` to update after adding/removing topics.
//
// Strategy:
//   Install  — pre-cache every file in PRECACHE_URLS (shell + all topic JS
//               modules + all static pages) so the site works fully offline
//               from the first visit, not just after visiting each page.
//   Activate — delete any old caches from previous builds, claim all clients
//               immediately so the new SW takes effect without a reload.
//   Fetch    — network-first for all GET requests: always try the network so
//               visitors get the latest content; fall back to cache when the
//               network fails (offline or flaky connection). Fresh responses
//               are always written back to the cache. Navigation requests that
//               fail fall back to the cached index.html so the SPA shell loads
//               even fully offline.
//   Update   — when a new SW installs and is waiting, postMessage all open
//               clients so app.js can show a non-intrusive "update available"
//               banner. The banner's "Reload" button sends SKIP_WAITING back,
//               which triggers activate and a page reload.

const CACHE_VERSION = 'v-${version}';
const CACHE_NAME = \`csharp-concepts-\${CACHE_VERSION}\`;

const PRECACHE_URLS = ${JSON.stringify(allUrls, null, 2)};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      // Don't skipWaiting automatically — wait for the user to confirm the
      // update via the "Reload to update" banner (see postMessage below).
      // This prevents in-progress quiz sessions from being disrupted.
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k.startsWith('csharp-concepts-') && k !== CACHE_NAME)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// Tell all open tabs there's a new version waiting — app.js listens for
// this and shows the update banner.
self.addEventListener('install', () => {
  self.clients.matchAll({ includeUncontrolled: true, type: 'window' })
    .then(clients => clients.forEach(c => c.postMessage({ type: 'SW_WAITING' })));
});

// app.js sends SKIP_WAITING when the user clicks "Reload to update".
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || !req.url.startsWith(self.location.origin)) return;

  // Network-first for all requests — always try the network first so visitors
  // always get the latest content. Fall back to cache when offline or when
  // the network fails. For navigation requests (page loads), fall back to
  // the cached index.html so the SPA shell loads offline.
  event.respondWith(
    fetch(req)
      .then(res => {
        // Clone synchronously before any async operation — once we enter
        // caches.open()'s .then() the original response body may already
        // be consumed by the browser, making res.clone() throw.
        if (res.ok) {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(req, resClone));
        }
        return res;
      })
      .catch(() =>
        caches.match(req).then(cached => {
          if (cached) return cached;
          if (req.mode === 'navigate') return caches.match('./index.html');
        })
      )
  );
});
`;

  await writeFile(path.join(root, 'sw.js'), sw, 'utf-8');
}


const trackCount = await buildTrackPages();
const topicCount = await buildTopicPages();
await updateRootIndex();
const urlCount = await updateSitemap();
await buildServiceWorker();

// Regenerate search-index.js from current topic content
async function buildSearchIndex() {
  const entries = [];
  for (const t of ALL_TOPICS_FLAT) {
    const topic = await loadTopic(t.file);
    const strip = s => String(s || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    entries.push({
      id: t.id,
      title: t.title,
      category: t.category?.name ?? '',
      tagline: topic.tagline || '',
      keywords: [
        strip(topic.explanation),
        (topic.keyPoints || []).join(' '),
        (topic.mistakes || []).join(' '),
      ].join(' ').slice(0, 800),
    });
  }
  const out = `// Auto-generated by build-static.mjs — do not edit by hand.\nexport const SEARCH_INDEX = ${JSON.stringify(entries, null, 2)};\n`;
  await writeFile(path.join(root, 'js/topics/search-index.js'), out, 'utf-8');
  return entries.length;
}

const searchCount = await buildSearchIndex();

console.log(`✓ Generated ${trackCount} static track pages under tracks/<id>/`);
console.log(`✓ Generated ${topicCount} static topic pages under topics/<id>/`);
console.log(`✓ Regenerated sidebar + landing content in index.html`);
console.log(`✓ Regenerated sitemap.xml (${urlCount} URLs) and robots.txt with real paths`);
console.log(`✓ Regenerated sw.js with ${topicCount + trackCount} pre-cached pages + ${topicCount} topic modules`);
console.log(`✓ Regenerated search-index.js (${searchCount} entries)`);
