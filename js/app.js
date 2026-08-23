import { CATEGORIES, TOPIC_INDEX, ALL_TOPICS_FLAT, loadTopic } from './topics/manifest.js';
import { SEARCH_INDEX } from './topics/search-index.js';
import { TRACKS } from './topics/tracks.js';
import { highlightCSharp } from './highlight.js';
import { buildQuestion, buildQuiz } from './quiz.js';

// Reverse lookup: topic id -> array of tracks it belongs to (usually 0 or 1,
// but a topic can appear in more than one track without any duplication of
// content — tracks are just orderings over the same underlying topics).
const TRACKS_BY_TOPIC = new Map();
for (const track of TRACKS) {
  for (const topicId of track.topicIds) {
    if (!TRACKS_BY_TOPIC.has(topicId)) TRACKS_BY_TOPIC.set(topicId, []);
    TRACKS_BY_TOPIC.get(topicId).push(track);
  }
}

const sidebarEl = document.getElementById('sidebar');
const mainEl = document.getElementById('main');
const mobileToggle = document.getElementById('mobileToggle');

// Map of topic id -> lowercase searchable text (tagline + key points + explanation),
// so the sidebar search can match on meaning, not just the title shown in the tree.
const SEARCH_TEXT_BY_ID = new Map(SEARCH_INDEX.map(r => [r.id, r.keywords]));

// ---------- Progress tracking ("mark as learned") ----------
const PROGRESS_KEY   = 'csharp-concepts-progress';
const TIMESTAMPS_KEY = 'csharp-concepts-timestamps';
const BOOKMARKS_KEY  = 'csharp-concepts-bookmarks';
const RECENTS_KEY    = 'csharp-concepts-recents';
const RUN_COUNT_KEY  = 'csharp-concepts-run-count';
const QUIZ_CORRECT_KEY = 'csharp-concepts-quiz-correct';
const RECENTS_MAX    = 8;

function getLearnedSet() {
  try { return new Set(JSON.parse(localStorage.getItem(PROGRESS_KEY) || '[]')); }
  catch { return new Set(); }
}
function saveLearnedSet(set) {
  try { localStorage.setItem(PROGRESS_KEY, JSON.stringify([...set])); } catch {}
}
function getTimestamps() {
  try { return JSON.parse(localStorage.getItem(TIMESTAMPS_KEY) || '{}'); } catch { return {}; }
}
function saveTimestamp(topicId, markingLearned) {
  try {
    const ts = getTimestamps();
    if (markingLearned) ts[topicId] = new Date().toISOString().slice(0, 10);
    else delete ts[topicId];
    localStorage.setItem(TIMESTAMPS_KEY, JSON.stringify(ts));
  } catch {}
}
function getRunCount() {
  try { return parseInt(localStorage.getItem(RUN_COUNT_KEY) || '0', 10); } catch { return 0; }
}
function incrementRunCount() {
  try { localStorage.setItem(RUN_COUNT_KEY, String(getRunCount() + 1)); } catch {}
}
function getQuizCorrect() {
  try { return parseInt(localStorage.getItem(QUIZ_CORRECT_KEY) || '0', 10); } catch { return 0; }
}
function incrementQuizCorrect() {
  try { localStorage.setItem(QUIZ_CORRECT_KEY, String(getQuizCorrect() + 1)); } catch {}
}

// Record any learning activity for streak (called by: markLearned, Run button, quiz correct)
function recordActivityToday() {
  const today = new Date().toISOString().slice(0, 10);
  // Use a sentinel key so activity-only days (run/quiz without marking learned) also count
  try {
    const ts = getTimestamps();
    const key = `__activity__${today}`;
    if (!ts[key]) { ts[key] = today; localStorage.setItem(TIMESTAMPS_KEY, JSON.stringify(ts)); }
  } catch {}
}

// Returns { current, longest } streak from all dates in the timestamp map
function getStreaks() {
  const ts = getTimestamps();
  const dates = [...new Set(Object.values(ts))].sort();
  if (!dates.length) return { current: 0, longest: 0 };
  let longest = 1, run = 1;
  for (let i = 1; i < dates.length; i++) {
    const diff = (new Date(dates[i]) - new Date(dates[i-1])) / 86400000;
    if (diff === 1) { run++; longest = Math.max(longest, run); }
    else if (diff > 1) run = 1;
  }
  const today     = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const last = dates[dates.length - 1];
  let current = 0;
  if (last === today || last === yesterday) {
    current = 1;
    for (let i = dates.length - 2; i >= 0; i--) {
      if ((new Date(dates[i+1]) - new Date(dates[i])) / 86400000 === 1) current++;
      else break;
    }
  }
  return { current, longest: Math.max(longest, current) };
}

// Last 7 calendar days as { label, active } for the streak calendar
function getWeekCalendar() {
  const ts = getTimestamps();
  const activeDates = new Set(Object.values(ts));
  const labels = ['Su','Mo','Tu','We','Th','Fr','Sa'];
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - (6 - i) * 86400000);
    return { label: labels[d.getDay()], active: activeDates.has(d.toISOString().slice(0, 10)) };
  });
}

// ---------- Achievements ----------
const ACHIEVEMENTS = [
  { id: 'first-step',    emoji: '🎯', title: 'First Step',
    desc: 'Complete your first concept',
    check: d => d.learnedCount >= 1 },
  { id: 'getting-started', emoji: '📚', title: 'Getting Started',
    desc: 'Complete 5 concepts',
    progress: d => ({ value: Math.min(d.learnedCount, 5), max: 5 }),
    check: d => d.learnedCount >= 5 },
  { id: 'cs-apprentice', emoji: '🧠', title: 'C# Apprentice',
    desc: 'Complete all C# Fundamentals',
    progress: d => ({ value: d.fundamentalsLearned, max: d.fundamentalsTotal }),
    check: d => d.fundamentalsLearned >= d.fundamentalsTotal },
  { id: 'async-master',  emoji: '⚡', title: 'Async Master',
    desc: 'Complete the Async & Concurrency track',
    progress: d => ({ value: d.asyncLearned, max: d.asyncTotal }),
    check: d => d.asyncLearned >= d.asyncTotal },
  { id: 'pattern-master',emoji: '🎨', title: 'Pattern Master',
    desc: 'Complete all Design Patterns',
    progress: d => ({ value: d.patternsLearned, max: d.patternsTotal }),
    check: d => d.patternsLearned >= d.patternsTotal },
  { id: 'explorer',      emoji: '🚀', title: '.NET Explorer',
    desc: 'Complete 25 concepts',
    progress: d => ({ value: Math.min(d.learnedCount, 25), max: 25 }),
    check: d => d.learnedCount >= 25 },
  { id: 'dotnet-master', emoji: '🏆', title: '.NET Master',
    desc: 'Complete 50 concepts',
    progress: d => ({ value: Math.min(d.learnedCount, 50), max: 50 }),
    check: d => d.learnedCount >= 50 },
  { id: 'completionist', emoji: '💯', title: 'Completionist',
    desc: 'Complete every concept',
    progress: d => ({ value: d.learnedCount, max: d.totalTopics }),
    check: d => d.learnedCount >= d.totalTopics },
  { id: 'code-runner',   emoji: '🧪', title: 'Code Runner',
    desc: 'Run 20 code examples',
    progress: d => ({ value: Math.min(d.runCount, 20), max: 20 }),
    check: d => d.runCount >= 20 },
  { id: 'quiz-master',   emoji: '🎓', title: 'Quiz Master',
    desc: 'Get 10 quiz questions correct',
    progress: d => ({ value: Math.min(d.quizCorrect, 10), max: 10 }),
    check: d => d.quizCorrect >= 10 },
];

function getAchievementData() {
  const learnedSet = getLearnedSet();
  const fundamentalIds = CATEGORIES.find(c => c.id === 'fundamentals')?.topics.map(t => t.id) || [];
  const asyncTrack     = TRACKS.find(t => t.id === 'async-deep-dive')?.topicIds || [];
  const patternsIds    = CATEGORIES.find(c => c.id === 'patterns')?.topics.map(t => t.id) || [];
  return {
    learnedCount:       learnedSet.size,
    totalTopics:        ALL_TOPICS_FLAT.length,
    fundamentalsLearned: fundamentalIds.filter(id => learnedSet.has(id)).length,
    fundamentalsTotal:  fundamentalIds.length,
    asyncLearned:       asyncTrack.filter(id => learnedSet.has(id)).length,
    asyncTotal:         asyncTrack.length,
    patternsLearned:    patternsIds.filter(id => learnedSet.has(id)).length,
    patternsTotal:      patternsIds.length,
    runCount:           getRunCount(),
    quizCorrect:        getQuizCorrect(),
  };
}

function isLearned(topicId) { return getLearnedSet().has(topicId); }
function toggleLearned(topicId) {
  const set = getLearnedSet();
  const nowLearned = !set.has(topicId);
  if (nowLearned) { set.add(topicId); recordActivityToday(); }
  else set.delete(topicId);
  saveLearnedSet(set);
  saveTimestamp(topicId, nowLearned);
  return nowLearned;
}
function learnedCountFor(topicIds) {
  const set = getLearnedSet();
  return topicIds.reduce((n, id) => n + (set.has(id) ? 1 : 0), 0);
}

// ---------- Bookmarks ----------
function getBookmarks() {
  try { return new Set(JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || '[]')); }
  catch { return new Set(); }
}
function saveBookmarks(set) {
  try { localStorage.setItem(BOOKMARKS_KEY, JSON.stringify([...set])); } catch {}
}
function isBookmarked(id) { return getBookmarks().has(id); }
function toggleBookmark(id) {
  const set = getBookmarks();
  if (set.has(id)) set.delete(id); else set.add(id);
  saveBookmarks(set);
  return set.has(id);
}

// ---------- Recently viewed ----------
function getRecents() {
  try { return JSON.parse(localStorage.getItem(RECENTS_KEY) || '[]'); }
  catch { return []; }
}
function recordRecent(topicId) {
  const recents = getRecents().filter(id => id !== topicId);
  recents.unshift(topicId);
  try { localStorage.setItem(RECENTS_KEY, JSON.stringify(recents.slice(0, RECENTS_MAX))); } catch {}
}
function getLastVisited() {
  return getRecents()[0] || null;
}

// ---------- Sidebar tree ----------
// ---------- Theme & font-size preferences ----------
// Both are stored in localStorage and applied as CSS classes on <html>.
// Applied before first render so there's no flash of the wrong theme.
const THEME_KEY = 'csharp-concepts-theme';
const FS_KEY    = 'csharp-concepts-fs';

function getTheme()    { return localStorage.getItem(THEME_KEY)    || 'dark'; }
function getFontSize() { return localStorage.getItem(FS_KEY)        || 'medium'; }

function applyTheme(theme) {
  document.documentElement.classList.toggle('theme-light', theme === 'light');
  localStorage.setItem(THEME_KEY, theme);
}

function applyFontSize(size) {
  document.documentElement.classList.remove('fs-small', 'fs-large');
  if (size !== 'medium') document.documentElement.classList.add(`fs-${size}`);
  localStorage.setItem(FS_KEY, size);
}

// Apply immediately so there's no visible flash on load.
applyTheme(getTheme());
applyFontSize(getFontSize());

function wireSettingsButtons() {
  const buttons = {
    themeDark:  () => { applyTheme('dark');   updateSettingsActive(); },
    themeLight: () => { applyTheme('light');  updateSettingsActive(); },
    fsSmall:    () => { applyFontSize('small');  updateSettingsActive(); },
    fsMedium:   () => { applyFontSize('medium'); updateSettingsActive(); },
    fsLarge:    () => { applyFontSize('large');  updateSettingsActive(); },
  };
  for (const [id, fn] of Object.entries(buttons)) {
    document.getElementById(id)?.addEventListener('click', fn);
  }
}

function updateSettingsActive() {
  const theme = getTheme();
  const fs    = getFontSize();
  document.getElementById('themeDark') ?.classList.toggle('active', theme === 'dark');
  document.getElementById('themeLight')?.classList.toggle('active', theme === 'light');
  document.getElementById('fsSmall')   ?.classList.toggle('active', fs === 'small');
  document.getElementById('fsMedium')  ?.classList.toggle('active', fs === 'medium');
  document.getElementById('fsLarge')   ?.classList.toggle('active', fs === 'large');
}

function renderSidebar(activeTopicId) {
  // Find which category contains the active topic
  const activeCatId = activeTopicId
    ? CATEGORIES.find(c => c.topics.some(t => t.id === activeTopicId))?.id
    : null;

  const tree = document.createElement('div');
  tree.className = 'tree';

  CATEGORIES.forEach(cat => {
    const catDiv = document.createElement('div');
    catDiv.className = 'tree-category';

    const catTopicIds = cat.topics.map(t => t.id);
    const learnedInCat = learnedCountFor(catTopicIds);

    // Collapse all categories except the one containing the active topic.
    // When there's no active topic (landing, quiz, track pages), collapse all.
    const isExpanded = activeCatId !== null && cat.id === activeCatId;
    if (!isExpanded) catDiv.classList.add('collapsed');

    const label = document.createElement('button');
    label.type = 'button';
    label.className = 'tree-category-label';
    label.setAttribute('aria-expanded', String(isExpanded));
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
      item.dataset.title = t.title;
      if (isActive) item.setAttribute('aria-current', 'page');
      item.innerHTML = `<span class="file-icon">cs</span><span>${t.title}</span><span class="learned-check" aria-hidden="true">&#10003;</span>`;
      item.addEventListener('click', () => {
        // Collapse every category except the one that was just clicked
        tree.querySelectorAll('.tree-category').forEach(div => {
          const containsTarget = div.querySelector(`[data-topic-id="${t.id}"]`);
          const lbl = div.querySelector('.tree-category-label');
          if (containsTarget) {
            div.classList.remove('collapsed');
            lbl?.setAttribute('aria-expanded', 'true');
          } else {
            div.classList.add('collapsed');
            lbl?.setAttribute('aria-expanded', 'false');
          }
        });
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
        <input type="search" id="searchInput" placeholder="Search topics... (/ or Ctrl+K)" aria-label="Search topics" autocomplete="off">
      </div>
      <div class="sidebar-settings" role="toolbar" aria-label="Display settings">
        <div class="settings-group" aria-label="Theme">
          <button type="button" class="settings-btn${getTheme() === 'dark' ? ' active' : ''}" id="themeDark" title="Dark theme">&#9681;</button>
          <button type="button" class="settings-btn${getTheme() === 'light' ? ' active' : ''}" id="themeLight" title="Light theme">&#9728;</button>
        </div>
        <div class="settings-group" aria-label="Font size">
          <button type="button" class="settings-btn${getFontSize() === 'small' ? ' active' : ''}" id="fsSmall" title="Small text">A&#8209;</button>
          <button type="button" class="settings-btn${getFontSize() === 'medium' ? ' active' : ''}" id="fsMedium" title="Default text">A</button>
          <button type="button" class="settings-btn${getFontSize() === 'large' ? ' active' : ''}" id="fsLarge" title="Large text">A+</button>
        </div>
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

  wireSettingsButtons();

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

function highlightMatch(text, query) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return text.slice(0, idx) +
    `<mark class="search-highlight">${text.slice(idx, idx + query.length)}</mark>` +
    text.slice(idx + query.length);
}

function filterSidebar(query) {
  const q = query.trim().toLowerCase();
  const categories = sidebarEl.querySelectorAll('.tree-category');
  let anyVisible = false;

  categories.forEach(catDiv => {
    const items = catDiv.querySelectorAll('.tree-item');
    let categoryHasMatch = false;

    items.forEach(item => {
      const titleEl = item.querySelector('span:not(.file-icon):not(.learned-check)');
      const rawTitle = item.dataset.title || titleEl?.textContent || '';
      if (!item.dataset.title && rawTitle) item.dataset.title = rawTitle; // cache

      const titleLower = rawTitle.toLowerCase();
      const extra = SEARCH_TEXT_BY_ID.get(item.dataset.topicId) || '';
      const matches = q === '' || titleLower.includes(q) || extra.includes(q);
      item.classList.toggle('search-hidden', !matches);
      if (matches) categoryHasMatch = true;

      // Highlight the title text when there's a match in the title itself
      if (titleEl) {
        titleEl.innerHTML = (q && titleLower.includes(q))
          ? highlightMatch(rawTitle, q)
          : rawTitle;
      }
    });

    catDiv.hidden = !categoryHasMatch;
    if (categoryHasMatch) anyVisible = true;

    // While searching: expand all matching categories.
    // When query is cleared: restore — collapse all except the active topic's category.
    if (q !== '') {
      if (categoryHasMatch) catDiv.classList.remove('collapsed');
    } else {
      const hasActive = catDiv.querySelector('.tree-item.active');
      if (hasActive) {
        catDiv.classList.remove('collapsed');
        catDiv.querySelector('.tree-category-label')?.setAttribute('aria-expanded', 'true');
      } else {
        catDiv.classList.add('collapsed');
        catDiv.querySelector('.tree-category-label')?.setAttribute('aria-expanded', 'false');
      }
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

// ---------- Random topic ----------
function goToRandomTopic() {
  const idx = Math.floor(Math.random() * ALL_TOPICS_FLAT.length);
  location.hash = `#/${ALL_TOPICS_FLAT[idx].id}`;
}

// ---------- Landing page ----------
function renderLanding() {
  const totalTopics = CATEGORIES.reduce((n, c) => n + c.topics.length, 0);
  const totalLearned = learnedCountFor(ALL_TOPICS_FLAT.map(t => t.id));
  const pct = totalTopics ? Math.round((totalLearned / totalTopics) * 100) : 0;

  // Continue learning: last visited topic that isn't fully learned (or just last visited)
  const lastVisited = getLastVisited();
  const lastMeta = lastVisited ? TOPIC_INDEX[lastVisited] : null;

  // Recently viewed: last 8, excluding the very first (shown as "continue")
  const recents = getRecents().map(id => TOPIC_INDEX[id]).filter(Boolean);
  const recentDisplay = lastMeta ? recents.slice(1, 6) : recents.slice(0, 6);

  // Bookmarks
  const bookmarkIds = [...getBookmarks()];
  const bookmarkMetas = bookmarkIds.map(id => TOPIC_INDEX[id]).filter(Boolean);

  const { current: streakCurrent, longest: streakLongest } = getStreaks();
  const calendar = getWeekCalendar();
  const calendarHtml = `<div class="streak-calendar" aria-label="Activity this week">
    ${calendar.map(d => `<div class="streak-cal-day">
      <span class="streak-cal-dot${d.active ? ' streak-cal-dot--active' : ''}"></span>
      <span class="streak-cal-label">${d.label}</span>
    </div>`).join('')}
  </div>`;

  const streakHtml = streakCurrent >= 2
    ? `<div class="streak-bar" role="status" aria-label="${streakCurrent}-day learning streak">
        <span class="streak-flame" aria-hidden="true">🔥</span>
        <span class="streak-count">${streakCurrent}-day streak</span>
        ${streakLongest > streakCurrent ? `<span class="streak-best">Best: ${streakLongest}</span>` : '<span class="streak-best">Personal best!</span>'}
        ${calendarHtml}
       </div>`
    : streakCurrent === 1
      ? `<div class="streak-bar streak-bar--day1" role="status" aria-label="Day 1 learning streak">
          <span class="streak-flame" aria-hidden="true">⚡</span>
          <span class="streak-count">Day 1 — come back tomorrow to start a streak!</span>
          ${calendarHtml}
         </div>`
      : streakLongest >= 2
        ? `<div class="streak-bar streak-bar--cold" role="status" aria-label="No active streak">
            <span class="streak-flame" aria-hidden="true">❄️</span>
            <span class="streak-count">Start a new streak — best was ${streakLongest} days</span>
            ${calendarHtml}
           </div>`
        : '';

  // Achievements
  const achData = getAchievementData();
  const unlockedCount = ACHIEVEMENTS.filter(a => a.check(achData)).length;
  const achievementsHtml = `
    <h2 class="section-heading">🏆 Achievements <span class="ach-unlocked-count">${unlockedCount} / ${ACHIEVEMENTS.length} unlocked</span></h2>
    <div class="achievement-grid">
      ${ACHIEVEMENTS.map(a => {
        const unlocked = a.check(achData);
        const prog = a.progress ? a.progress(achData) : null;
        return `<div class="achievement-card${unlocked ? ' achievement-card--unlocked' : ''}">
          <span class="ach-emoji" aria-hidden="true">${a.emoji}</span>
          <div class="ach-title">${a.title}</div>
          <div class="ach-desc">${a.desc}</div>
          ${unlocked
            ? '<div class="ach-status ach-status--done">✓ Unlocked</div>'
            : prog
              ? `<div class="ach-status">🔒 ${prog.value} / ${prog.max}</div>`
              : '<div class="ach-status">🔒 Locked</div>'
          }
        </div>`;
      }).join('')}
    </div>`;

  mainEl.innerHTML = `
    <div class="landing-hero">
      <h1>C# &amp; .NET,<br>explained through running code.</h1>
      <p class="lead">${totalTopics} concepts from fundamentals to design patterns &mdash; each with a short explanation,
      a real code sample, and a console you can run to see the output.</p>

      <div class="hero-actions">
        <a class="hero-btn hero-btn--primary" href="#/variables-types">&#9654; Start Learning C#</a>
        <a class="hero-btn" href="#/track/interview-prep">&#128196; Interview Prep</a>
        <a class="hero-btn" href="#/track/aspnet-core-essentials">&#127760; ASP.NET Core</a>
        <a class="hero-btn" href="#/quiz">&#128172; Take a Quiz</a>
      </div>

      ${streakHtml}

      ${totalLearned > 0 ? `
      <div class="progress-summary">
        <div class="progress-summary-label">${totalLearned} of ${totalTopics} topics marked as learned</div>
        <div class="progress-bar" role="progressbar" aria-valuenow="${totalLearned}" aria-valuemin="0" aria-valuemax="${totalTopics}" aria-label="Overall learning progress"><div class="progress-bar-fill" style="width:${pct}%"></div></div>
      </div>` : ''}

      ${lastMeta ? `
      <div class="continue-bar">
        <span class="continue-label">Continue where you left off</span>
        <a class="continue-link" href="#/${lastMeta.id}">
          <span class="continue-cat">${lastMeta.category.name}</span>
          <span class="continue-title">${lastMeta.title} &rarr;</span>
        </a>
      </div>` : ''}

      <h2 class="section-heading">Learning paths</h2>
      <p class="section-subhead">Choose a goal and follow a curated sequence — same topics as below, deliberate order.</p>
      <div class="track-grid" id="trackGrid"></div>

      <h2 class="section-heading">Explore all ${totalTopics} concepts</h2>
      <div class="category-grid" id="categoryGrid"></div>

      <div class="random-topic-row">
        <button class="random-btn" id="randomTopicBtn" type="button">&#127922; Random topic</button>
        <span class="random-hint">or press <kbd>R</kbd></span>
      </div>

      ${achievementsHtml}

      ${recentDisplay.length ? `
      <h2 class="section-heading">Recently viewed</h2>
      <div class="pill-list" id="recentsList">
        ${recentDisplay.map(m => `<a class="topic-pill" href="#/${m.id}">${m.title}</a>`).join('')}
      </div>` : ''}

      ${bookmarkMetas.length ? `
      <h2 class="section-heading">&#9733; Bookmarks</h2>
      <div class="pill-list" id="bookmarksList">
        ${bookmarkMetas.map(m => `<a class="topic-pill topic-pill--bookmarked" href="#/${m.id}">${m.title}</a>`).join('')}
        <button class="pill-clear-btn" id="clearBookmarksBtn" type="button">Clear all</button>
      </div>` : ''}
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

  const trackGrid = document.getElementById('trackGrid');
  TRACKS.forEach(track => {
    const learnedInTrack = learnedCountFor(track.topicIds);
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'track-card';
    card.innerHTML = `
      <div class="count">${track.topicIds.length} topics${learnedInTrack > 0 ? ` &middot; ${learnedInTrack} learned` : ''}</div>
      <div class="name">${track.title}</div>
      <div class="track-card-desc">${track.description}</div>
    `;
    card.addEventListener('click', () => {
      location.hash = `#/track/${track.id}`;
    });
    trackGrid.appendChild(card);
  });

  document.getElementById('randomTopicBtn')?.addEventListener('click', goToRandomTopic);

  document.getElementById('clearBookmarksBtn')?.addEventListener('click', () => {
    saveBookmarks(new Set());
    renderLanding(); // re-render to remove the section
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

  // Record the visit immediately, before the async load, so fast navigators
  // don't miss their history even if they leave before the content loads.
  recordRecent(topicId);

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
  const bookmarked = isBookmarked(topicId);
  const related = (topic.related || [])
    .map(id => TOPIC_INDEX[id])
    .filter(Boolean);
  const memberTracks = TRACKS_BY_TOPIC.get(topicId) || [];

  // Difficulty: per-topic field overrides category default
  const difficultyMap = {
    fundamentals:    { label: 'Beginner',     cls: 'diff-beginner' },
    oop:             { label: 'Beginner',     cls: 'diff-beginner' },
    intermediate:    { label: 'Intermediate', cls: 'diff-intermediate' },
    async:           { label: 'Intermediate', cls: 'diff-intermediate' },
    patterns:        { label: 'Intermediate', cls: 'diff-intermediate' },
    'modern-dotnet': { label: 'Intermediate', cls: 'diff-intermediate' },
    'csharp-latest': { label: 'Intermediate', cls: 'diff-intermediate' },
    aspnet:          { label: 'Advanced',     cls: 'diff-advanced' },
  };
  const DIFF_LABELS = {
    beginner:     { label: 'Beginner',     cls: 'diff-beginner' },
    intermediate: { label: 'Intermediate', cls: 'diff-intermediate' },
    advanced:     { label: 'Advanced',     cls: 'diff-advanced' },
  };
  const diff = (topic.difficulty && DIFF_LABELS[topic.difficulty])
    || difficultyMap[category.id]
    || DIFF_LABELS.intermediate;

  // Reading time: ~200 words per minute, counting explanation + keyPoints text
  const wordCount = [topic.explanation, topic.tagline, ...(topic.keyPoints || [])]
    .join(' ').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  const readMins = Math.max(1, Math.round(wordCount / 200));
  const readLabel = `${readMins} min read`;

  mainEl.innerHTML = `
    <div class="crumb"><a href="#/">Home</a><span class="sep">/</span>${category.name}<span class="sep">/</span>${topic.title}.cs</div>
    <div class="topic-title-row">
      <h1 class="topic-title">${topic.title}</h1>
      <div class="topic-actions">
        <button type="button" class="bookmark-btn${bookmarked ? ' is-bookmarked' : ''}" id="bookmarkBtn" aria-pressed="${bookmarked}" title="${bookmarked ? 'Remove bookmark' : 'Bookmark this topic'}">
          ${bookmarked ? '&#9733;' : '&#9734;'}
        </button>
        <button type="button" class="learned-toggle${learned ? ' is-learned' : ''}" id="learnedToggle" aria-pressed="${learned}">
          <span class="check">&#10003;</span> ${learned ? 'Learned' : 'Mark as learned'}
        </button>
      </div>
    </div>
    <div class="topic-meta">
      <span class="difficulty-badge ${diff.cls}">${diff.label}</span>
      ${topic.versionLabel ? `<span class="version-badge">${topic.versionLabel}</span>` : ''}
      <span class="reading-time">&#128337; ${readLabel}</span>
    </div>
    <div class="topic-tagline">${topic.tagline}</div>
    ${memberTracks.length ? `<div class="track-badges">${memberTracks.map(t => `<a class="track-badge" href="#/track/${t.id}">&#8227; Part of: ${t.title}</a>`).join('')}</div>` : ''}

    ${topic.prerequisites && topic.prerequisites.length ? (() => {
      const preqMetas = topic.prerequisites.map(id => TOPIC_INDEX[id]).filter(Boolean);
      return preqMetas.length ? `
    <div class="prerequisites-box">
      <div class="kp-title">&#128279; Prerequisites</div>
      <div class="prereq-chips">
        ${preqMetas.map(p => `<a class="prereq-chip" href="#/${p.id}">${p.title}</a>`).join('')}
      </div>
    </div>` : '';
    })() : ''}

    <div class="prose">${topic.explanation}</div>

    ${topic.whyItMatters ? `
    <div class="key-points why-matters-box">
      <div class="kp-title kp-title--why">&#128161; Why it matters</div>
      <p class="why-matters-text">${topic.whyItMatters}</p>
    </div>` : ''}

    <div class="key-points">
      <div class="kp-title">Key points</div>
      <ul>${topic.keyPoints.map(kp => `<li>${kp}</li>`).join('')}</ul>
    </div>

    ${topic.mistakes && topic.mistakes.length ? `
    <div class="key-points mistakes-box">
      <div class="kp-title kp-title--mistakes">&#9888; Common mistakes</div>
      <ul>${topic.mistakes.map(m => `<li>${m}</li>`).join('')}</ul>
    </div>` : ''}

    ${topic.interviewQ ? `
    <details class="interview-q-box">
      <summary class="interview-q-summary">&#128196; Interview question</summary>
      <div class="interview-q-body">
        <p class="interview-question">${topic.interviewQ}</p>
        ${topic.interviewA ? `<div class="interview-answer">${topic.interviewA}</div>` : ''}
      </div>
    </details>` : ''}

    <div class="quiz-box" id="quickCheck">
      <div class="kp-title">Quick check</div>
      <div class="quiz-loading">Preparing a question&hellip;</div>
    </div>

    <div class="workbench">
      <div class="workbench-tabs">
        <div class="workbench-tab file-tab">${toPascalFileName(topic.title)}.cs</div>
        <button class="copy-btn" id="copyBtn" type="button">Copy</button>
        <button class="print-btn" id="printBtn" type="button">&#8659; PDF</button>
        <a class="sharplab-btn" id="sharplabBtn" href="https://sharplab.io/" target="_blank" rel="noopener noreferrer" title="Copy code, then open SharpLab to run it">&#9654; SharpLab</a>
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
    <div class="keyboard-hint">Tip: use &larr; &rarr; to move between topics &middot; / or Ctrl+K to search &middot; R for a random topic.</div>
  `;

  document.getElementById('runBtn').addEventListener('click', () => runSample(topic));
  document.getElementById('printBtn').addEventListener('click', () => window.print());

  // SharpLab: copy code to clipboard then open SharpLab in a new tab.
  // We can't pre-fill SharpLab's editor via URL (they use a proprietary binary
  // format), so the next best thing is copying the code so the user can paste
  // it immediately when the tab opens. The button text confirms this.
  document.getElementById('sharplabBtn').addEventListener('click', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('sharplabBtn');
    try {
      await navigator.clipboard.writeText(topic.code);
      const original = btn.textContent;
      btn.textContent = '&#10003; Copied — pasting in SharpLab';
      btn.innerHTML = '&#10003; Copied!';
      window.open('https://sharplab.io/', '_blank', 'noopener,noreferrer');
      setTimeout(() => { btn.innerHTML = '&#9654; SharpLab'; }, 2000);
    } catch {
      window.open('https://sharplab.io/', '_blank', 'noopener,noreferrer');
    }
  });

  const bookmarkBtn = document.getElementById('bookmarkBtn');
  bookmarkBtn.addEventListener('click', () => {
    const nowBookmarked = toggleBookmark(topicId);
    bookmarkBtn.classList.toggle('is-bookmarked', nowBookmarked);
    bookmarkBtn.setAttribute('aria-pressed', String(nowBookmarked));
    bookmarkBtn.innerHTML = nowBookmarked ? '&#9733;' : '&#9734;';
    bookmarkBtn.title = nowBookmarked ? 'Remove bookmark' : 'Bookmark this topic';
  });

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

  initQuickCheck(navMeta, content, myToken);
}

// ---------- Quick check (per-topic quiz widget) ----------
// Renders a single multiple-choice question built from this topic's own
// keyPoints (correct answer) plus keyPoints borrowed from other topics in
// the same category (wrong answers) — see js/quiz.js. Runs after the main
// topic content is already on screen, since it needs a few more topics'
// content loaded and shouldn't block the page the person actually asked for.
function renderQuizChoices(container, question, onAnswered) {
  const choicesHTML = question.choices.map((c, i) =>
    `<button class="quiz-choice" type="button" data-idx="${i}">${c.text}</button>`
  ).join('');

  container.innerHTML = `
    <div class="quiz-prompt">${question.prompt}</div>
    <div class="quiz-choices">${choicesHTML}</div>
    <div class="quiz-feedback" aria-live="polite"></div>
  `;

  const buttons = [...container.querySelectorAll('.quiz-choice')];
  let answered = false;

  buttons.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      if (answered) return;
      answered = true;
      const wasCorrect = question.choices[i].correct;
      buttons.forEach((b, j) => {
        b.disabled = true;
        if (question.choices[j].correct) {
          b.classList.add('correct');
          b.innerHTML = `<span class="quiz-choice-icon" aria-hidden="true">&#10003;</span>${b.innerHTML}`;
        } else if (j === i) {
          b.classList.add('incorrect');
          b.innerHTML = `<span class="quiz-choice-icon" aria-hidden="true">&#10007;</span>${b.innerHTML}`;
        }
      });
      const feedback = container.querySelector('.quiz-feedback');
      feedback.textContent = wasCorrect
        ? 'Correct!'
        : 'Not quite — the correct answer is highlighted above.';
      feedback.classList.add(wasCorrect ? 'correct' : 'incorrect');
      onAnswered(wasCorrect);
    });
  });
}

async function initQuickCheck(navMeta, content, myToken) {
  const container = document.getElementById('quickCheck');
  if (!container || !content.keyPoints || content.keyPoints.length === 0) {
    if (container) container.remove();
    return;
  }

  let usedIndices = [];

  async function loadNext(isRegeneration = false) {
    if (usedIndices.length >= content.keyPoints.length) usedIndices = [];
    const available = content.keyPoints.map((_, i) => i).filter(i => !usedIndices.includes(i));
    const correctIndex = available[Math.floor(Math.random() * available.length)];
    usedIndices.push(correctIndex);

    const question = await buildQuestion({
      subjectMeta: navMeta,
      subjectContent: content,
      poolMetas: navMeta.category.topics,
      loadTopic,
      correctIndex
    });

    if (myToken !== renderToken) return; // navigated away while this was loading
    const el = document.getElementById('quickCheck');
    if (!el) return;

    if (!question) {
      el.innerHTML = `<div class="kp-title">Quick check</div><div class="quiz-loading">Not enough other topics in this category yet to build a fair question here.</div>`;
      return;
    }

    el.innerHTML = `<div class="kp-title">Quick check</div><div class="quiz-question"></div><button class="quiz-another-btn" type="button">Try another question</button>`;
    el.setAttribute('tabindex', '-1');
    renderQuizChoices(el.querySelector('.quiz-question'), question, () => {});
    el.querySelector('.quiz-another-btn').addEventListener('click', () => {
      loadNext(true);
    });
    if (isRegeneration) el.focus({ preventScroll: true });
  }

  await loadNext();
}

function navLink(topic, label, isPrev) {
  return isPrev
    ? `<a href="#/${topic.id}"><span class="dir">&larr; ${label}</span>${topic.title}</a>`
    : `<a href="#/${topic.id}"><span class="dir">${label} &rarr;</span>${topic.title}</a>`;
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
    incrementRunCount();
    recordActivityToday();
  }, 450);
}

// ---------- Guided track page ----------
function renderTrack(trackId) {
  const track = TRACKS.find(t => t.id === trackId);
  if (!track) {
    renderLanding();
    return;
  }

  const trackTopics = track.topicIds.map(id => TOPIC_INDEX[id]).filter(Boolean);
  const learnedInTrack = learnedCountFor(track.topicIds);
  const pct = trackTopics.length ? Math.round((learnedInTrack / trackTopics.length) * 100) : 0;
  const firstUnlearned = trackTopics.find(t => !isLearned(t.id)) || trackTopics[0];

  document.title = `${track.title} — C# & .NET Concepts`;
  updateMetaTags({
    description: track.description,
    url: `${location.origin}${location.pathname}#/track/${track.id}`
  });

  const stepsHTML = trackTopics.map((t, i) => {
    const learned = isLearned(t.id);
    return `<a class="track-step${learned ? ' learned' : ''}" href="#/${t.id}">
      <span class="track-step-num">${learned ? '&#10003;' : i + 1}</span>
      <span class="track-step-title">${t.title}</span>
      <span class="track-step-cat">${t.category.name}</span>
    </a>`;
  }).join('');

  mainEl.innerHTML = `
    <div class="crumb"><a href="#/">Home</a><span class="sep">/</span>Guided track</div>
    <h1 class="topic-title">${track.title}</h1>
    <div class="topic-tagline">${track.description}</div>

    ${learnedInTrack > 0 ? `
    <div class="progress-summary">
      <div class="progress-summary-label">${learnedInTrack} of ${trackTopics.length} topics in this track marked as learned</div>
      <div class="progress-bar" role="progressbar" aria-valuenow="${learnedInTrack}" aria-valuemin="0" aria-valuemax="${trackTopics.length}" aria-label="Track progress"><div class="progress-bar-fill" style="width:${pct}%"></div></div>
    </div>` : ''}

    <a class="track-start-btn" href="#/${firstUnlearned.id}">
      <span class="play">&#9654;</span> ${learnedInTrack > 0 ? 'Continue' : 'Start'} track
    </a>

    <div class="track-steps">
      ${stepsHTML}
    </div>
  `;
}

// ---------- Quiz mode page (#/quiz) ----------
// Three states rendered in place (no sub-routes, so the browser's back
// button returns to wherever the person was before starting a quiz, not to
// individual questions): pick a scope, answer questions, see results.
const QUIZ_QUESTION_COUNT = 10;

// These state transitions are deliberately NOT hash-based navigations (see
// above), so they don't go through route()'s scrollTo(0,0) — without this,
// "Next question" or reaching results could leave the person scrolled to
// wherever they were reading the previous question, looking at nothing
// relevant. Focusing <main> (tabindex="-1" in the page shell) also gives
// screen reader users a sensible landing point after each transition.
function resetQuizViewport() {
  window.scrollTo(0, 0);
  // Note: we deliberately do NOT call mainEl.focus() here.
  // Programmatically focusing the <main> element (even with preventScroll)
  // can trigger spurious hashchange events in some browsers, which fires
  // route() and re-renders renderQuizScopeSelect(), clobbering the in-progress
  // quiz session. The scroll-to-top is the meaningful part anyway.
}

function renderQuizScopeSelect() {
  const totalTopics = ALL_TOPICS_FLAT.length;

  document.title = 'Test yourself — C# & .NET Concepts';
  updateMetaTags({
    description: 'Multiple-choice questions built from the key points of every topic — pick a category or mix the whole site.',
    url: `${location.origin}${location.pathname}#/quiz`
  });

  mainEl.innerHTML = `
    <div class="crumb"><a href="#/">Home</a><span class="sep">/</span>Quiz</div>
    <h1 class="topic-title">Test yourself</h1>
    <div class="topic-tagline">Multiple-choice, built from the same key points on every topic page. Pick a category, or mix the whole site.</div>
    <div class="quiz-scope-grid" id="quizScopeGrid"></div>
  `;

  const grid = document.getElementById('quizScopeGrid');

  const allCard = document.createElement('button');
  allCard.type = 'button';
  allCard.className = 'quiz-scope-card';
  allCard.innerHTML = `<div class="count">${totalTopics} topics</div><div class="name">All topics (mixed)</div>`;
  allCard.addEventListener('click', () => startQuizSession(ALL_TOPICS_FLAT, 'All topics (mixed)'));
  grid.appendChild(allCard);

  CATEGORIES.forEach(cat => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'quiz-scope-card';
    card.innerHTML = `<div class="count">${cat.topics.length} topics</div><div class="name">${cat.name}</div>`;
    card.addEventListener('click', () => startQuizSession(cat.topics, cat.name));
    grid.appendChild(card);
  });
}

async function startQuizSession(poolMetas, scopeLabel) {
  const myToken = ++renderToken;

  mainEl.innerHTML = `
    <div class="crumb"><a href="#/">Home</a><span class="sep">/</span><a href="#/quiz">Quiz</a><span class="sep">/</span>${scopeLabel}</div>
    <h1 class="topic-title">Test yourself</h1>
    <div class="quiz-progress" id="quizProgress">Building your quiz&hellip;</div>
    <div class="quiz-session-box" id="quizSessionBox"></div>
  `;

  const questions = await buildQuiz({ poolMetas, loadTopic, questionCount: QUIZ_QUESTION_COUNT });
  if (myToken !== renderToken) return; // navigated away while building

  if (questions.length === 0) {
    document.getElementById('quizProgress').textContent = '';
    document.getElementById('quizSessionBox').innerHTML = `<p class="topic-tagline">This scope doesn't have enough topics to build a fair quiz yet.</p>`;
    return;
  }

  let index = 0;
  const results = [];

  function showQuestion() {
    window.scrollTo(0, 0);
    document.getElementById('quizProgress').textContent = `Question ${index + 1} of ${questions.length} \u2014 ${scopeLabel}`;
    const box = document.getElementById('quizSessionBox');
    box.innerHTML = '';
    renderQuizChoices(box, questions[index], (wasCorrect) => {
      results.push({ topicId: questions[index].topicId, topicTitle: questions[index].topicTitle, correct: wasCorrect });
      if (wasCorrect) { incrementQuizCorrect(); recordActivityToday(); }
      const nextBtn = document.createElement('button');
      nextBtn.type = 'button';
      nextBtn.className = 'quiz-next-btn';
      nextBtn.textContent = index === questions.length - 1 ? 'See results' : 'Next question';
      nextBtn.addEventListener('click', () => {
        index++;
        if (index >= questions.length) renderQuizResults(results, poolMetas, scopeLabel);
        else showQuestion();
      });
      box.appendChild(nextBtn);
    });
  }

  showQuestion();
}

function renderQuizResults(results, poolMetas, scopeLabel) {
  resetQuizViewport();
  const correctCount = results.filter(r => r.correct).length;
  const wrongResults = results.filter(r => !r.correct);
  const rightResults = results.filter(r => r.correct);

  document.title = 'Quiz results — C# & .NET Concepts';

  mainEl.innerHTML = `
    <div class="crumb"><a href="#/">Home</a><span class="sep">/</span><a href="#/quiz">Quiz</a><span class="sep">/</span>Results</div>
    <h1 class="topic-title">Quiz results</h1>
    <div class="topic-tagline">${scopeLabel}</div>
    <div class="quiz-results-score">${correctCount} / ${results.length}</div>

    ${wrongResults.length ? `
    <div class="quiz-results-list">
      <div class="kp-title">Worth another look</div>
      ${wrongResults.map(r => `<div class="quiz-result-row wrong"><span class="quiz-result-icon">&#10007;</span><a href="#/${r.topicId}">${r.topicTitle}</a></div>`).join('')}
    </div>` : ''}

    <div class="quiz-actions">
      <button class="quiz-next-btn" id="retakeBtn" type="button">Retake this quiz</button>
      <button class="run-btn" id="chooseAnotherBtn" type="button">Choose a different scope</button>
      ${rightResults.length ? `<button class="learned-toggle" id="markLearnedBtn" type="button"><span class="check">&#10003;</span> Mark ${rightResults.length} correct topic${rightResults.length === 1 ? '' : 's'} as learned</button>` : ''}
    </div>
  `;

  document.getElementById('retakeBtn').addEventListener('click', () => startQuizSession(poolMetas, scopeLabel));
  document.getElementById('chooseAnotherBtn').addEventListener('click', () => renderQuizScopeSelect());

  const markBtn = document.getElementById('markLearnedBtn');
  if (markBtn) {
    markBtn.addEventListener('click', () => {
      const set = getLearnedSet();
      rightResults.forEach(r => set.add(r.topicId));
      saveLearnedSet(set);
      markBtn.textContent = 'Marked as learned!';
      markBtn.disabled = true;
      renderSidebar(null);
    }, { once: true });
  }
}


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
  if (hash.startsWith('track/')) {
    renderTrack(hash.slice('track/'.length));
    renderSidebar(null);
    window.scrollTo(0, 0);
    return;
  }
  if (hash === 'quiz') {
    renderQuizScopeSelect();
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
  // Ctrl+K / Cmd+K → focus search
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
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

  if (e.key === 'r' && !isTypingTarget(document.activeElement)) {
    e.preventDefault();
    goToRandomTopic();
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

// ---------- Service worker update notification ----------
// When a new SW has installed and is waiting to activate, show a small
// non-intrusive banner. The user can dismiss it or click "Reload" to
// activate the new SW immediately. We deliberately don't auto-reload —
// that would interrupt a quiz session or a topic mid-read.
(function initSwUpdateNotification() {
  if (!('serviceWorker' in navigator)) return;

  // Create the banner element and inject it into the page now (hidden),
  // so it's ready when the SW signals an update.
  const banner = document.createElement('div');
  banner.id = 'sw-update-banner';
  banner.setAttribute('role', 'status');
  banner.setAttribute('aria-live', 'polite');
  banner.innerHTML = `
    <span class="sw-update-msg">&#9432; New content available.</span>
    <button class="sw-update-btn" id="swReloadBtn" type="button">Reload to update</button>
    <button class="sw-update-dismiss" id="swDismissBtn" type="button" aria-label="Dismiss">&#10005;</button>
  `;
  document.body.appendChild(banner);

  let waitingWorker = null;

  function showBanner(worker) {
    waitingWorker = worker;
    banner.classList.add('visible');
  }

  document.getElementById('swReloadBtn').addEventListener('click', () => {
    banner.classList.remove('visible');
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    }
  });

  document.getElementById('swDismissBtn').addEventListener('click', () => {
    banner.classList.remove('visible');
  });

  // When the new SW activates (after skipWaiting), reload all clients.
  // Guard: only reload if there was already a controller — the first time a SW
  // installs and calls clients.claim(), controllerchange fires too, but that's
  // not an update (there was no previous controller), so we must not reload.
  let hadController = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (hadController) window.location.reload();
    hadController = true;
  });

  // Check on registration: if a SW is already waiting, show the banner.
  navigator.serviceWorker.ready.then(reg => {
    if (reg.waiting) showBanner(reg.waiting);

    reg.addEventListener('updatefound', () => {
      const newWorker = reg.installing;
      if (!newWorker) return;
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          showBanner(newWorker);
        }
      });
    });
  });

  // Also listen for the postMessage from the SW itself (triggered during
  // install when other tabs are already open).
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data?.type === 'SW_WAITING') {
      navigator.serviceWorker.ready.then(reg => {
        if (reg.waiting) showBanner(reg.waiting);
      });
    }
  });
}());

// ---------- PWA install prompt ----------
// The browser fires 'beforeinstallprompt' when all PWA criteria are met
// (HTTPS, manifest, service worker) and the app isn't already installed.
// We hold the event and show a small non-intrusive banner. The user can
// dismiss it permanently (stored in localStorage) or tap to install.
// We never show it again after dismissal or after a successful install.
(function initPwaInstallPrompt() {
  const DISMISSED_KEY = 'csharp-concepts-pwa-dismissed';
  if (localStorage.getItem(DISMISSED_KEY)) return; // already dismissed

  let deferredPrompt = null;

  const banner = document.createElement('div');
  banner.id = 'pwa-install-banner';
  banner.setAttribute('role', 'status');
  banner.setAttribute('aria-live', 'polite');
  banner.innerHTML = `
    <span class="pwa-install-msg">&#128187; Install this site as an app for offline access.</span>
    <button class="pwa-install-btn" id="pwaInstallBtn" type="button">Install</button>
    <button class="pwa-install-dismiss" id="pwaDismissBtn" type="button" aria-label="Dismiss">&#10005;</button>
  `;
  document.body.appendChild(banner);

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault(); // stop the automatic mini-infobar
    deferredPrompt = e;
    banner.classList.add('visible');
  });

  document.getElementById('pwaInstallBtn').addEventListener('click', async () => {
    if (!deferredPrompt) return;
    banner.classList.remove('visible');
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;
    if (outcome === 'accepted') {
      localStorage.setItem(DISMISSED_KEY, '1');
    }
  });

  document.getElementById('pwaDismissBtn').addEventListener('click', () => {
    banner.classList.remove('visible');
    localStorage.setItem(DISMISSED_KEY, '1');
  });

  // If the app gets installed through any other path, hide and suppress future prompts.
  window.addEventListener('appinstalled', () => {
    banner.classList.remove('visible');
    localStorage.setItem(DISMISSED_KEY, '1');
    deferredPrompt = null;
  });
}());
