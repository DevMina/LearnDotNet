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
import { highlightCSharp } from '../js/highlight.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE_URL = 'https://devmina.github.io/LearnDotNet/';
const SITE_NAME = 'C# & .NET Concepts';
const SITE_DESCRIPTION = 'An interactive tour of C# and .NET concepts, from fundamentals to design patterns, with runnable code samples.';
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
  <div class="tree-category-label" aria-expanded="true"><span class="chevron">&#9662;</span><span>${escapeHtml(cat.name)}</span><span class="tree-category-progress">${cat.topics.length} topic${cat.topics.length === 1 ? '' : 's'}</span></div>
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

  const prevHTML = prev
    ? `<a href="${siblingPrefix}${prev.id}/"><span class="dir">Previous &larr;</span>${escapeHtml(prev.title)}</a>`
    : '<span></span>';
  const nextHTML = next
    ? `<a href="${siblingPrefix}${next.id}/"><span class="dir">Next</span>${escapeHtml(next.title)} &rarr;</a>`
    : '<span></span>';

  const escapedOutput = escapeHtml(content.output);

  return `<div class="crumb"><a href="${rootPrefix}">Home</a><span class="sep">/</span>${escapeHtml(category.name)}<span class="sep">/</span>${escapeHtml(topic.title)}.cs</div>
    <div class="topic-title-row">
      <h1 class="topic-title">${escapeHtml(topic.title)}</h1>
      <button type="button" class="learned-toggle" id="learnedToggle" aria-pressed="false">
        <span class="check">&#10003;</span> Mark as learned
      </button>
    </div>
    <div class="topic-tagline">${content.tagline}</div>

    <div class="prose">${content.explanation}</div>

    <div class="key-points">
      <div class="kp-title">Key points</div>
      <ul>${content.keyPoints.map(kp => `<li>${kp}</li>`).join('')}</ul>
    </div>

    <div class="workbench">
      <div class="workbench-tabs">
        <div class="workbench-tab file-tab">${escapeHtml(toPascalFileName(topic.title))}.cs</div>
        <button class="copy-btn" id="copyBtn" type="button">Copy</button>
        <button class="print-btn" id="printBtn" type="button">Print</button>
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

  return `<div class="landing-hero">
      <h1>C# &amp; .NET,<br>explained through running code.</h1>
      <p class="lead">${totalTopics} concepts from fundamentals to design patterns &mdash; each with a short explanation,
      a real code sample, and a console you can run to see the output. Pick a folder in Solution Explorer to start,
      or jump into a category below.</p>
      <div class="category-grid" id="categoryGrid">
    ${cardsHTML}
      </div>
    </div>`;
}

// ---------- Full HTML page wrapper ----------
function buildPage({ title, description, canonical, assetPrefix, sidebarHTML, mainHTML, bootstrapHash }) {
  const bootstrapScript = bootstrapHash
    ? `<script>history.replaceState(null, '', location.pathname + location.search + '#/${bootstrapHash}');</script>\n`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
${bootstrapScript}<meta charset="UTF-8">
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
</head>
<body>

  <button class="mobile-toggle" id="mobileToggle" aria-label="Toggle navigation" aria-expanded="false" aria-controls="sidebar">&#9776;</button>

  <div class="backdrop" id="backdrop"></div>

  <nav class="sidebar" id="sidebar" aria-label="Topic navigation">
${sidebarHTML}
  </nav>

  <div class="content-column">
    <main class="main" id="main">
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
      bootstrapHash: navMeta.id
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
  const mainRe = /(<main class="main" id="main">)[\s\S]*?(<\/main>)/;

  if (!sidebarRe.test(html) || !mainRe.test(html)) {
    throw new Error('Could not find the #sidebar or #main markers in index.html — has the shell markup changed?');
  }

  html = html.replace(sidebarRe, `$1\n${sidebarHTML}\n  $2`);
  html = html.replace(mainRe, `$1\n    ${mainHTML}\n    $2`);

  await writeFile(indexPath, html, 'utf-8');
}

// ---------- Regenerate sitemap.xml / robots.txt with real per-topic URLs ----------
async function updateSitemap() {
  const LASTMOD = new Date().toISOString().slice(0, 10);
  const urls = [
    BASE_URL,
    `${BASE_URL}#/contact`,
    ...ALL_TOPICS_FLAT.map(t => `${BASE_URL}topics/${t.id}/`)
  ];

  const entries = urls.map(u =>
    `  <url>\n    <loc>${u}</loc>\n    <lastmod>${LASTMOD}</lastmod>\n  </url>`
  ).join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
  await writeFile(path.join(root, 'sitemap.xml'), sitemap, 'utf-8');

  const robots = `User-agent: *\nAllow: /\n\nSitemap: ${BASE_URL}sitemap.xml\n`;
  await writeFile(path.join(root, 'robots.txt'), robots, 'utf-8');

  return urls.length;
}

const topicCount = await buildTopicPages();
await updateRootIndex();
const urlCount = await updateSitemap();

console.log(`✓ Generated ${topicCount} static topic pages under topics/<id>/`);
console.log(`✓ Regenerated sidebar + landing content in index.html`);
console.log(`✓ Regenerated sitemap.xml (${urlCount} URLs) and robots.txt with real paths`);
