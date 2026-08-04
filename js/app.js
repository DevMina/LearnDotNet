import { CATEGORIES, TOPIC_INDEX, ALL_TOPICS_FLAT, loadTopic } from './topics/manifest.js';
import { SEARCH_INDEX } from './topics/search-index.js';
import { highlightCSharp } from './highlight.js';

const sidebarEl = document.getElementById('sidebar');
const mainEl = document.getElementById('main');
const mobileToggle = document.getElementById('mobileToggle');

// Map of topic id -> lowercase searchable text (tagline + key points + explanation),
// so the sidebar search can match on meaning, not just the title shown in the tree.
const SEARCH_TEXT_BY_ID = new Map(SEARCH_INDEX.map(r => [r.id, r.keywords]));

// ---------- Progress tracking ("mark as learned") ----------
// Stored client-side only, per browser, as a plain array of topic ids.
const PROGRESS_KEY = 'csharp-concepts-progress';

function getLearnedSet() {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function saveLearnedSet(set) {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify([...set]));
  } catch {
    // Storage unavailable (private browsing, quota, etc.) — progress just won't persist.
  }
}

function isLearned(topicId) {
  return getLearnedSet().has(topicId);
}

function toggleLearned(topicId) {
  const set = getLearnedSet();
  if (set.has(topicId)) set.delete(topicId);
  else set.add(topicId);
  saveLearnedSet(set);
  return set.has(topicId);
}

function learnedCountFor(topicIds) {
  const set = getLearnedSet();
  return topicIds.reduce((n, id) => n + (set.has(id) ? 1 : 0), 0);
}

// ---------- Sidebar tree ----------
function renderSidebar(activeTopicId) {
  const tree = document.createElement('div');
  tree.className = 'tree';

  CATEGORIES.forEach(cat => {
    const catDiv = document.createElement('div');
    catDiv.className = 'tree-category';

    const catTopicIds = cat.topics.map(t => t.id);
    const learnedInCat = learnedCountFor(catTopicIds);

    const label = document.createElement('button');
    label.type = 'button';
    label.className = 'tree-category-label';
    label.setAttribute('aria-expanded', 'true');
    label.innerHTML = `<span class="chevron">\u25BE</span><span>${cat.name}</span><span class="tree-category-progress">${learnedInCat}/${catTopicIds.length}</span>`;
    label.addEventListener('click', () => {
      const collapsed = catDiv.classList.toggle('collapsed');
      label.setAttribute('aria-expanded', String(!collapsed));
    });

    const items = document.createElement('div');
    items.className = 'tree-items';

    cat.topics.forEach(t => {
      const isActive = t.id === activeTopicId;
      const learned = isLearned(t.id);
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'tree-item' + (isActive ? ' active' : '') + (learned ? ' learned' : '');
      item.dataset.topicId = t.id;
      if (isActive) item.setAttribute('aria-current', 'page');
      item.innerHTML = `<span class="file-icon">cs</span><span>${t.title}</span><span class="learned-check" aria-hidden="true">&#10003;</span>`;
      item.addEventListener('click', () => {
        location.hash = `#/${t.id}`;
        closeMobileSidebar();
      });
      items.appendChild(item);
    });

    catDiv.appendChild(label);
    catDiv.appendChild(items);
    tree.appendChild(catDiv);
  });

  sidebarEl.innerHTML = `
    <div class="sidebar-header">
      <button type="button" class="sidebar-close" id="sidebarClose" aria-label="Close navigation">&times;</button>
      <button type="button" class="logo" id="homeLink" aria-label="Go to home page"><span class="dot">&bull;</span> Solution Explorer</button>
      <div class="subtitle">CSharpConcepts.sln</div>
      <div class="search-box">
        <input type="search" id="searchInput" placeholder="Search topics... (press /)" aria-label="Search topics" autocomplete="off">
      </div>
    </div>
  `;
  sidebarEl.appendChild(tree);

  document.getElementById('sidebarClose').addEventListener('click', closeMobileSidebar);

  document.getElementById('homeLink').addEventListener('click', () => {
    if (location.hash === '' || location.hash === '#/' || location.hash === '#') {
      route();
    } else {
      location.hash = '#/';
    }
    closeMobileSidebar();
  });

  const noResults = document.createElement('div');
  noResults.className = 'search-no-results';
  noResults.setAttribute('role', 'status');
  noResults.setAttribute('aria-live', 'polite');
  noResults.textContent = 'No topics match your search.';
  noResults.hidden = true;
  sidebarEl.appendChild(noResults);

  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', () => filterSidebar(searchInput.value));
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      searchInput.value = '';
      filterSidebar('');
    }
  });
}

function filterSidebar(query) {
  const q = query.trim().toLowerCase();
  const categories = sidebarEl.querySelectorAll('.tree-category');
  let anyVisible = false;

  categories.forEach(catDiv => {
    const items = catDiv.querySelectorAll('.tree-item');
    let categoryHasMatch = false;

    items.forEach(item => {
      const title = item.textContent.toLowerCase();
      const extra = SEARCH_TEXT_BY_ID.get(item.dataset.topicId) || '';
      const matches = q === '' || title.includes(q) || extra.includes(q);
      item.classList.toggle('search-hidden', !matches);
      if (matches) categoryHasMatch = true;
    });

    catDiv.hidden = !categoryHasMatch;
    if (categoryHasMatch) anyVisible = true;

    // Auto-expand categories with matches while searching, restore otherwise.
    if (q !== '' && categoryHasMatch) {
      catDiv.classList.remove('collapsed');
    }
  });

  const noResults = sidebarEl.querySelector('.search-no-results');
  if (noResults) {
    const willShow = !anyVisible && q !== '';
    if (willShow) {
      noResults.textContent = `No topics match "${query.trim()}".`;
    }
    noResults.hidden = !willShow;
  }
}

// ---------- Per-page SEO / social meta tags ----------
// This is a client-rendered SPA using hash routing, so most crawlers only ever
// see index.html's static <head> — updating these tags here mainly helps
// share-preview tools and browsers that do execute JS, and keeps each visited
// page's title/description accurate. It is not a substitute for server-side
// rendering or prerendering if search-engine indexing of individual topics
// becomes a priority later.
function setMetaTag(selector, attr, value) {
  let el = document.querySelector(selector);
  if (!el) return;
  el.setAttribute(attr, value);
}

function updateMetaTags({ description, url }) {
  setMetaTag('meta[name="description"]', 'content', description);
  setMetaTag('link[rel="canonical"]', 'href', url);
  setMetaTag('meta[property="og:title"]', 'content', document.title);
  setMetaTag('meta[property="og:description"]', 'content', description);
  setMetaTag('meta[property="og:url"]', 'content', url);
  setMetaTag('meta[name="twitter:title"]', 'content', document.title);
  setMetaTag('meta[name="twitter:description"]', 'content', description);
}

const backdropEl = document.getElementById('backdrop');

function closeMobileSidebar() {
  sidebarEl.classList.remove('open');
  backdropEl.classList.remove('visible');
  mobileToggle.setAttribute('aria-expanded', 'false');
  mobileToggle.classList.remove('is-hidden');
}

mobileToggle.addEventListener('click', () => {
  const isOpen = sidebarEl.classList.toggle('open');
  backdropEl.classList.toggle('visible', isOpen);
  mobileToggle.setAttribute('aria-expanded', String(isOpen));
  mobileToggle.classList.toggle('is-hidden', isOpen);
});

backdropEl.addEventListener('click', closeMobileSidebar);

// ---------- Landing page ----------
function renderLanding() {
  const totalTopics = CATEGORIES.reduce((n, c) => n + c.topics.length, 0);
  const totalLearned = learnedCountFor(ALL_TOPICS_FLAT.map(t => t.id));
  const pct = totalTopics ? Math.round((totalLearned / totalTopics) * 100) : 0;

  mainEl.innerHTML = `
    <div class="landing-hero">
      <h1>C# &amp; .NET,<br>explained through running code.</h1>
      <p class="lead">${totalTopics} concepts from fundamentals to design patterns &mdash; each with a short explanation,
      a real code sample, and a console you can run to see the output. Pick a folder in Solution Explorer to start,
      or jump into a category below.</p>
      ${totalLearned > 0 ? `
      <div class="progress-summary">
        <div class="progress-summary-label">${totalLearned} of ${totalTopics} topics marked as learned</div>
        <div class="progress-bar" role="progressbar" aria-valuenow="${totalLearned}" aria-valuemin="0" aria-valuemax="${totalTopics}" aria-label="Overall learning progress"><div class="progress-bar-fill" style="width:${pct}%"></div></div>
      </div>` : ''}
      <div class="category-grid" id="categoryGrid"></div>
    </div>
  `;

  const grid = document.getElementById('categoryGrid');
  CATEGORIES.forEach(cat => {
    const catTopicIds = cat.topics.map(t => t.id);
    const learnedInCat = learnedCountFor(catTopicIds);
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'category-card';
    card.innerHTML = `
      <div class="count">${cat.topics.length} topic${cat.topics.length === 1 ? '' : 's'}${learnedInCat > 0 ? ` &middot; ${learnedInCat} learned` : ''}</div>
      <div class="name">${cat.name}</div>
    `;
    card.addEventListener('click', () => {
      location.hash = `#/${cat.topics[0].id}`;
    });
    grid.appendChild(card);
  });

  document.title = 'C# & .NET Concepts — Interactive Guide';
  updateMetaTags({
    description: 'An interactive tour of C# and .NET concepts, from fundamentals to design patterns, with runnable code samples.',
    url: `${location.origin}${location.pathname}`
  });
}

// ---------- Loading state ----------
function renderTopicSkeleton() {
  mainEl.innerHTML = `
    <div class="crumb">Loading&hellip;</div>
    <div class="topic-skeleton" aria-hidden="true">
      <div class="skel skel-title"></div>
      <div class="skel skel-line"></div>
      <div class="skel skel-line short"></div>
      <div class="skel skel-block"></div>
    </div>
  `;
}

// ---------- Topic page ----------
// renderToken guards against a slower-loading topic finishing after the
// person has already navigated elsewhere (e.g. clicking two topics quickly).
let renderToken = 0;

async function renderTopic(topicId, myToken) {
  const navMeta = TOPIC_INDEX[topicId];
  if (!navMeta) {
    renderLanding();
    return;
  }

  renderTopicSkeleton();

  let content;
  try {
    content = await loadTopic(navMeta.file);
  } catch (err) {
    if (myToken !== renderToken) return; // navigated away while loading
    const offline = 'onLine' in navigator && !navigator.onLine;
    mainEl.innerHTML = `
      <div class="crumb"><a href="#/">Home</a></div>
      <h1 class="topic-title">Couldn't load this topic</h1>
      <p class="topic-tagline">${
        offline
          ? `You appear to be offline, and "${navMeta.title}" hasn't been loaded on this device before, so there's nothing cached to show.`
          : `There was a problem loading "${navMeta.title}". Check your connection and try again.`
      }</p>
      <button type="button" class="run-btn" id="retryTopicBtn"><span class="play">&#9654;</span> Retry</button>
    `;
    document.getElementById('retryTopicBtn').addEventListener('click', () => route());
    console.error('Failed to load topic', topicId, err);
    return;
  }

  if (myToken !== renderToken) return; // a newer navigation has since started

  const topic = { ...navMeta, ...content };
  const category = navMeta.category;

  const flatIndex = ALL_TOPICS_FLAT.findIndex(t => t.id === topicId);
  const prev = flatIndex > 0 ? ALL_TOPICS_FLAT[flatIndex - 1] : null;
  const next = flatIndex < ALL_TOPICS_FLAT.length - 1 ? ALL_TOPICS_FLAT[flatIndex + 1] : null;

  document.title = `${topic.title} — C# & .NET Concepts`;
  updateMetaTags({
    description: topic.tagline,
    url: `${location.origin}${location.pathname}#/${topicId}`
  });

  const learned = isLearned(topicId);
  const related = (topic.related || [])
    .map(id => TOPIC_INDEX[id])
    .filter(Boolean);

  mainEl.innerHTML = `
    <div class="crumb"><a href="#/">Home</a><span class="sep">/</span>${category.name}<span class="sep">/</span>${topic.title}.cs</div>
    <div class="topic-title-row">
      <h1 class="topic-title">${topic.title}</h1>
      <button type="button" class="learned-toggle${learned ? ' is-learned' : ''}" id="learnedToggle" aria-pressed="${learned}">
        <span class="check">&#10003;</span> ${learned ? 'Learned' : 'Mark as learned'}
      </button>
    </div>
    <div class="topic-tagline">${topic.tagline}</div>

    <div class="prose">${topic.explanation}</div>

    <div class="key-points">
      <div class="kp-title">Key points</div>
      <ul>${topic.keyPoints.map(kp => `<li>${kp}</li>`).join('')}</ul>
    </div>

    <div class="workbench">
      <div class="workbench-tabs">
        <div class="workbench-tab file-tab">${toPascalFileName(topic.title)}.cs</div>
        <button class="copy-btn" id="copyBtn" type="button">Copy</button>
        <button class="print-btn" id="printBtn" type="button">Print</button>
        <button class="run-btn" id="runBtn" type="button"><span class="play">&#9654;</span> Run</button>
      </div>
      <pre class="code-block"><code>${highlightCSharp(topic.code)}</code></pre>
      <div class="console">
        <div class="console-header" id="consoleHeader">
          <span class="light"></span> Output
        </div>
        <div class="console-body" id="consoleBody">
          <span class="placeholder">Click Run to build and execute this example &hellip;</span>
        </div>
      </div>
    </div>

    ${related.length ? `
    <div class="related-topics">
      <div class="kp-title">Related topics</div>
      <div class="related-chips">
        ${related.map(r => `<a class="related-chip" href="#/${r.id}">${r.title}</a>`).join('')}
      </div>
    </div>` : ''}

    <div class="topic-nav">
      ${prev ? navLink(prev, 'Previous', true) : '<span></span>'}
      ${next ? navLink(next, 'Next', false) : '<span></span>'}
    </div>
    <div class="keyboard-hint">Tip: use &larr; &rarr; to move between topics, or press / to search.</div>
  `;

  document.getElementById('runBtn').addEventListener('click', () => runSample(topic));
  document.getElementById('printBtn').addEventListener('click', () => window.print());

  const learnedBtn = document.getElementById('learnedToggle');
  learnedBtn.addEventListener('click', () => {
    const nowLearned = toggleLearned(topicId);
    learnedBtn.classList.toggle('is-learned', nowLearned);
    learnedBtn.setAttribute('aria-pressed', String(nowLearned));
    learnedBtn.innerHTML = `<span class="check">&#10003;</span> ${nowLearned ? 'Learned' : 'Mark as learned'}`;
    // Reflect the change in the sidebar (checkmark + category count) without a full re-render.
    renderSidebar(topicId);
  });

  const copyBtn = document.getElementById('copyBtn');
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(topic.code);
      const original = copyBtn.textContent;
      copyBtn.textContent = 'Copied!';
      setTimeout(() => { copyBtn.textContent = original; }, 1500);
    } catch {
      copyBtn.textContent = 'Press Ctrl+C';
      setTimeout(() => { copyBtn.textContent = 'Copy'; }, 1500);
    }
  });
}

function navLink(topic, label, isPrev) {
  return `<a href="#/${topic.id}"><span class="dir">${label}${isPrev ? ' \u2190' : ''}</span>${topic.title}${isPrev ? '' : ' \u2192'}</a>`;
}

function toPascalFileName(title) {
  return title.replace(/[^A-Za-z0-9]+/g, '');
}

function runSample(topic) {
  const header = document.getElementById('consoleHeader');
  const body = document.getElementById('consoleBody');
  const btn = document.getElementById('runBtn');

  btn.disabled = true;
  header.classList.remove('built');
  body.innerHTML = '<span class="placeholder">Building...</span>';

  setTimeout(() => {
    header.classList.add('built');
    const escaped = topic.output
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    body.innerHTML = `<span class="build-line">Build succeeded.</span>${escaped}`;
    btn.disabled = false;
  }, 450);
}

// ---------- Contact page ----------
const CONTACT_EMAIL = 'mina.abdo2030@gmail.com';

function renderContact() {
  document.title = 'Contact — C# & .NET Concepts';
  updateMetaTags({
    description: 'Spotted an error, have a suggestion, or want a topic added to the C# & .NET Concepts guide? Get in touch.',
    url: `${location.origin}${location.pathname}#/contact`
  });

  mainEl.innerHTML = `
    <div class="crumb"><a href="#/">Home</a><span class="sep">/</span>Contact</div>
    <h1 class="topic-title">Contact us</h1>
    <div class="topic-tagline">Spotted an error, have a suggestion, or want a topic added? Send a note.</div>

    <form class="contact-form" id="contactForm">
      <label>Name
        <input type="text" name="name" required autocomplete="name">
      </label>
      <label>Email
        <input type="email" name="email" required autocomplete="email">
      </label>
      <label>Message
        <textarea name="message" rows="6" required></textarea>
      </label>
      <button type="submit" class="run-btn"><span class="play">&#9654;</span> Send message</button>
      <div class="contact-sent" id="contactSent" hidden>Opening your email app with this message ready to send &hellip;</div>
    </form>

    <p class="contact-direct">Prefer to email directly? Write to
      <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>.
    </p>
  `;

  document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    const subject = encodeURIComponent(`Message from ${name} via C# Concepts site`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);

    document.getElementById('contactSent').hidden = false;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  });
}

// ---------- Router ----------
async function route() {
  const myToken = ++renderToken;
  const hash = location.hash.replace(/^#\/?/, '');

  if (!hash) {
    renderLanding();
    renderSidebar(null);
    window.scrollTo(0, 0);
    return;
  }
  if (hash === 'contact') {
    renderContact();
    renderSidebar(null);
    window.scrollTo(0, 0);
    return;
  }

  await renderTopic(hash, myToken);
  if (myToken !== renderToken) return; // superseded by a newer navigation
  renderSidebar(hash);
  window.scrollTo(0, 0);
}

// ---------- Keyboard shortcuts ----------
// "/" focuses the sidebar search. Left/Right arrows move to the previous/next
// topic when a topic page is open. Both are ignored while typing in a field
// so they never hijack normal text entry.
function isTypingTarget(el) {
  if (!el) return false;
  const tag = el.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable;
}

document.addEventListener('keydown', (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;

  if (e.key === '/' && !isTypingTarget(document.activeElement)) {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      e.preventDefault();
      if (window.innerWidth <= 900 && !sidebarEl.classList.contains('open')) {
        sidebarEl.classList.add('open');
        backdropEl.classList.add('visible');
        mobileToggle.setAttribute('aria-expanded', 'true');
      }
      searchInput.focus();
    }
    return;
  }

  if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && !isTypingTarget(document.activeElement)) {
    const hash = location.hash.replace(/^#\/?/, '');
    const flatIndex = ALL_TOPICS_FLAT.findIndex(t => t.id === hash);
    if (flatIndex === -1) return;
    const targetIndex = e.key === 'ArrowLeft' ? flatIndex - 1 : flatIndex + 1;
    const target = ALL_TOPICS_FLAT[targetIndex];
    if (target) {
      e.preventDefault();
      location.hash = `#/${target.id}`;
    }
  }
});

const copyrightYearEl = document.getElementById('copyrightYear');
if (copyrightYearEl) copyrightYearEl.textContent = new Date().getFullYear();

window.addEventListener('hashchange', route);
window.addEventListener('DOMContentLoaded', route);
