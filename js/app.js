const sidebarEl = document.getElementById('sidebar');
const mainEl = document.getElementById('main');
const mobileToggle = document.getElementById('mobileToggle');

// ---------- Sidebar tree ----------
function renderSidebar(activeTopicId) {
  const tree = document.createElement('div');
  tree.className = 'tree';

  CATEGORIES.forEach(cat => {
    const catDiv = document.createElement('div');
    catDiv.className = 'tree-category';

    const label = document.createElement('button');
    label.type = 'button';
    label.className = 'tree-category-label';
    label.setAttribute('aria-expanded', 'true');
    label.innerHTML = `<span class="chevron">\u25BE</span><span>${cat.name}</span>`;
    label.addEventListener('click', () => {
      const collapsed = catDiv.classList.toggle('collapsed');
      label.setAttribute('aria-expanded', String(!collapsed));
    });

    const items = document.createElement('div');
    items.className = 'tree-items';

    cat.topics.forEach(t => {
      const isActive = t.id === activeTopicId;
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'tree-item' + (isActive ? ' active' : '');
      if (isActive) item.setAttribute('aria-current', 'page');
      item.innerHTML = `<span class="file-icon">cs</span><span>${t.title}</span>`;
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
      <div class="logo"><span class="dot">&bull;</span> Solution Explorer</div>
      <div class="subtitle">CSharpConcepts.sln</div>
      <div class="search-box">
        <input type="search" id="searchInput" placeholder="Search topics..." aria-label="Search topics" autocomplete="off">
      </div>
    </div>
  `;
  sidebarEl.appendChild(tree);

  const noResults = document.createElement('div');
  noResults.className = 'search-no-results';
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
      const matches = q === '' || title.includes(q);
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
  if (noResults) noResults.hidden = anyVisible || q === '';
}

const backdropEl = document.getElementById('backdrop');

function closeMobileSidebar() {
  sidebarEl.classList.remove('open');
  backdropEl.classList.remove('visible');
  mobileToggle.setAttribute('aria-expanded', 'false');
}

mobileToggle.addEventListener('click', () => {
  const isOpen = sidebarEl.classList.toggle('open');
  backdropEl.classList.toggle('visible', isOpen);
  mobileToggle.setAttribute('aria-expanded', String(isOpen));
});

backdropEl.addEventListener('click', closeMobileSidebar);

// ---------- Landing page ----------
function renderLanding() {
  const totalTopics = CATEGORIES.reduce((n, c) => n + c.topics.length, 0);

  mainEl.innerHTML = `
    <div class="landing-hero">
      <div class="eyebrow">// a tour of the language, one file at a time</div>
      <h1>C# &amp; .NET,<br>explained through running code.</h1>
      <p class="lead">${totalTopics} concepts from fundamentals to design patterns &mdash; each with a short explanation,
      a real code sample, and a console you can run to see the output. Pick a folder in Solution Explorer to start,
      or jump into a category below.</p>
      <div class="category-grid" id="categoryGrid"></div>
    </div>
  `;

  const grid = document.getElementById('categoryGrid');
  CATEGORIES.forEach(cat => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'category-card';
    card.innerHTML = `
      <div class="count">${cat.topics.length} topic${cat.topics.length === 1 ? '' : 's'}</div>
      <div class="name">${cat.name}</div>
    `;
    card.addEventListener('click', () => {
      location.hash = `#/${cat.topics[0].id}`;
    });
    grid.appendChild(card);
  });

  document.title = 'C# & .NET Concepts — Interactive Guide';
}

// Flat ordered list of every topic across all categories, for continuous prev/next.
const ALL_TOPICS_FLAT = CATEGORIES.flatMap(cat => cat.topics);

// ---------- Topic page ----------
function renderTopic(topicId) {
  const entry = TOPIC_INDEX[topicId];
  if (!entry) {
    renderLanding();
    return;
  }
  const { topic, category } = entry;

  const flatIndex = ALL_TOPICS_FLAT.findIndex(t => t.id === topicId);
  const prev = flatIndex > 0 ? ALL_TOPICS_FLAT[flatIndex - 1] : null;
  const next = flatIndex < ALL_TOPICS_FLAT.length - 1 ? ALL_TOPICS_FLAT[flatIndex + 1] : null;

  document.title = `${topic.title} — C# & .NET Concepts`;

  mainEl.innerHTML = `
    <div class="crumb">${category.name}<span class="sep">/</span>${topic.title}.cs</div>
    <h1 class="topic-title">${topic.title}</h1>
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

    <div class="topic-nav">
      ${prev ? navLink(prev, 'Previous', true) : '<span></span>'}
      ${next ? navLink(next, 'Next', false) : '<span></span>'}
    </div>
  `;

  document.getElementById('runBtn').addEventListener('click', () => runSample(topic));

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

  mainEl.innerHTML = `
    <div class="crumb">Contact</div>
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
function route() {
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
  renderTopic(hash);
  renderSidebar(hash);
  window.scrollTo(0, 0);
}

const copyrightYearEl = document.getElementById('copyrightYear');
if (copyrightYearEl) copyrightYearEl.textContent = new Date().getFullYear();

window.addEventListener('hashchange', route);
window.addEventListener('DOMContentLoaded', route);
