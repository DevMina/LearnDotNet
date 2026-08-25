# C# & .NET Concepts — Interactive Guide

A static, dependency-free site (plain HTML/CSS/JS) covering **100 C#/.NET concepts** across 9 categories — fundamentals through ASP.NET Core, including a dedicated section on C# 12–14 features. Each topic has a short explanation, a syntax-highlighted code sample with a "Run" button that shows pre-captured output, and a collapsible interview question with a detailed answer.

**Features:**
- 9 guided learning tracks (Getting Started, C# Fundamentals, OOP, Async, Patterns, Modern C#, Advanced C#, Interview Prep, ASP.NET Core)
- Per-topic difficulty badge, version label, prerequisite chips, and "Why it matters" section
- Quiz mode — multiple-choice questions drawn from key points across all topics
- "Mark as learned" progress tracking with streak detection (stored in `localStorage`)
- Bookmarks, recently-viewed list, and a random-topic button
- Full-text search (`/` or `Ctrl+K` to focus, `R` for a random topic, `←`/`→` to move between topics)
- Installable PWA with offline support via service worker
- Print-friendly layout with a "Print this topic" button per topic
- All 100 topics + 9 tracks have real static HTML pages for crawlers and no-JS visitors

## PWA notes

- `manifest.json` + `icons/` make the site installable (Add to Home Screen / Install App) on desktop and mobile.
- `sw.js` is a service worker using a **network-first** strategy: it always tries the network first (so visitors get the latest deployed files), and only falls back to the cached copy if the network request fails — that's what makes the site usable offline after a first visit.
- `CACHE_VERSION` in `sw.js` is auto-bumped by `build-static.mjs` on every build (it hashes the current timestamp), so deploying an update automatically invalidates any stale service worker caches on clients' next online visit. You never need to update it manually.
- The service worker only registers over `https://` or `localhost` — opening `index.html` directly via `file://` will skip it (browsers block service workers on `file://` for security), everything else still works normally.
- **GitHub Pages serves over https automatically**, so installability and offline support work out of the box once deployed there.

## Progress tracking & streaks

Each topic page has a "Mark as learned" toggle. State is stored client-side only in `localStorage`:

- `csharp-concepts-progress` — array of learned topic ids
- `csharp-concepts-timestamps` — `{ topicId: "YYYY-MM-DD" }` map used to compute streaks; also contains `__activity__YYYY-MM-DD` sentinel keys written when a code example is run or a quiz question is answered correctly (so those activities extend the streak even without marking a topic learned)
- `csharp-concepts-run-count` — integer count of code examples run (used for the Code Runner achievement)
- `csharp-concepts-quiz-correct` — integer count of quiz questions answered correctly (used for the Quiz Master achievement)
- `csharp-concepts-bookmarks` — array of bookmarked topic ids
- `csharp-concepts-recents` — recently viewed topic ids

The sidebar shows a checkmark next to learned topics and an `x/y` count per category. The landing page shows an overall progress bar and a streak badge (🔥 for active streaks ≥2 days, ⚡ for Day 1, ❄️ when a streak has lapsed). Nothing is sent anywhere — clearing site data/`localStorage` resets everything, and state does not sync across devices.

## Contact form

The "Contact us" link in the footer opens a simple form (`#/contact`). Since this is a static site with no backend, submitting it builds a `mailto:` link to **mina.abdo2030@gmail.com** with the name/email/message filled in and opens the visitor's email app to send it — no server or API key required. The logic lives in `renderContact()` in `js/app.js`.

## Preview locally

No build step needed — but the site uses real ES modules (`import`/`export`) so each topic can load on demand, and **browsers block ES module loading over `file://`**. You must serve it over HTTP, even locally:

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

Double-clicking `index.html` directly will not work — the page will load but topics won't render. This is a browser security restriction on `file://` + modules, not a bug.

## Deploy to GitHub Pages

1. Push this folder's contents to the root of a GitHub repository (or to a `/docs` folder).
2. In the repo, go to **Settings → Pages**.
3. Under "Build and deployment", choose **Deploy from a branch**, pick the branch (e.g. `main`) and the folder (`/ (root)` or `/docs`).
4. Save — GitHub will give you a URL like `https://<username>.github.io/<repo-name>/` within a minute or two.

No `.nojekyll` file or build config is required — it's already static files.

## File structure

```
LearnDotNet/
  index.html               ← app shell; sidebar/landing baked in by build-static.mjs,
                               then re-rendered by app.js on load for JS visitors
  sitemap.xml               ← generated: real URL per topic + track, for crawlers
  robots.txt                ← allows crawling, points to sitemap.xml
  sw.js                     ← generated: service worker with versioned precache list
  topics/                   ← generated: one real static page per topic
    ef-core/index.html
    span/index.html
    ...
  tracks/                   ← generated: one real static page per track
    aspnet-core-essentials/index.html
    ...
  scripts/
    validate-topics.mjs      ← CI check: manifest/content/cross-link/generated-output integrity
    build-static.mjs         ← generates everything: topics/, tracks/, index.html,
                                 sitemap.xml, robots.txt, sw.js, search-index.js
  .github/workflows/
    validate.yml             ← runs both scripts above on every push/PR
  css/style.css
  js/
    app.js                 ← routing, rendering, sidebar, search, quiz, streaks
    highlight.js            ← C# syntax highlighter, reused by build-static.mjs
    quiz.js                 ← quiz question builder and scoring logic
    topics/
      manifest.js           ← lightweight nav index: id/title/file per topic
      search-index.js       ← generated: id/tagline/keywords per topic for full-text search
      tracks.js             ← 9 guided track definitions (ids + descriptions)
      fundamentals/
        variables-types.js
        operators.js
        ...
      oop/
        inheritance.js
        ...
      aspnet/
        ef-core.js
        controllers.js
        ...
```

Only `manifest.js` (small — just id/title/file per topic) loads upfront. The full content of a topic is fetched with a dynamic `import()` the moment someone opens it, via `loadTopic()` in `manifest.js`. This keeps the initial page load light no matter how many topics exist.

## Adding more topics

1. Create a new file at `js/topics/<category>/<topic-id>.js` using this template:

```js
export default {
  // Required fields
  tagline: "One-line summary shown under the title and in search results.",
  explanation: `
    <p>HTML explanation paragraphs go here. Can use <strong>bold</strong>,
    <code>inline code</code>, and other inline HTML.</p>
  `,
  keyPoints: [
    "First key point — also used as quiz question pool",
    "Second key point",
  ],
  code: `// C# code sample
Console.WriteLine("Hello, World!");`,
  output: `Hello, World!`,
  mistakes: [
    "Common mistake developers make with this topic",
    "Another one",
  ],
  related: ["some-topic-id", "another-topic-id"],

  // Enrichment fields (strongly recommended — all render as UI elements)
  difficulty: 'beginner',        // 'beginner' | 'intermediate' | 'advanced'
  versionLabel: 'C# 12',        // shown as a teal badge next to difficulty (omit if not version-specific)
  prerequisites: ["variables-types", "classes-objects"], // render as linked chips above explanation
  whyItMatters: `One or two sentences on why a developer should care about this topic.`,
  interviewQ: `The interview question, can include <code>inline code</code>.`,
  interviewA: `Detailed answer — supports <code>inline code</code> and <strong>bold</strong>.`,
};
```

2. Add one entry to that category's `topics` array in `js/topics/manifest.js`:

```js
{ id: 'topic-id', title: 'Topic Title', file: './category/topic-id.js' }
```

3. Optionally add the topic id to one or more tracks in `js/topics/tracks.js`.

4. Run the build:

```
node scripts/build-static.mjs
```

This single command regenerates everything: static topic pages, track pages, `index.html` sidebar/landing, `sitemap.xml`, `robots.txt`, `sw.js`, and `search-index.js`. Commit all generated output — GitHub Pages serves static files with no build step, so generated files must be committed. CI fails if they are out of sync.

## Adding a new track

Add an entry to the `TRACKS` array in `js/topics/tracks.js`:

```js
{
  id: 'my-track',
  title: 'My Learning Track',
  description: 'One sentence describing the goal and audience of this track.',
  topicIds: ['variables-types', 'operators', 'control-flow']
}
```

Then run `node scripts/build-static.mjs` to generate the track's static page and update `sitemap.xml`. The track will appear automatically in the landing page's "Learning paths" grid and the sidebar.

## CI

`.github/workflows/validate.yml` runs on every push/PR to `main`:

1. **`node scripts/validate-topics.mjs`** — checks every topic has required fields; checks for duplicate ids; checks every `related`/`prerequisites` id points to a real topic; checks `search-index.js`, `sitemap.xml`, and `topics/<id>/` are all in sync with the manifest.
2. **Rebuild-and-diff** — runs `node scripts/build-static.mjs` fresh, then fails if that produces any changes to already-committed generated files. This enforces "commit the generated output" — it checks content, not just existence.
3. Structural sanity check that `sitemap.xml` is well-formed.

No npm dependencies — both scripts only use Node's built-in modules. Run the same checks locally:

```
node scripts/validate-topics.mjs
node scripts/build-static.mjs && git status --short
```

If the second command prints changed files, commit them.

## Static pages & SEO

Every topic and track has a real, static HTML page generated by `build-static.mjs`. Each one has its own `<title>`, meta description, canonical URL, and Open Graph/Twitter tags, and contains full readable content — no JavaScript required to read it or navigate to another page. `sitemap.xml` lists every URL.

For JS-enabled visitors, a tiny inline script sets `location.hash` to the topic's id on load, which `js/app.js`'s router picks up to render the full interactive experience. Crawlers and no-JS visitors get real static content; JS visitors get hydrated into the SPA.

The canonical/OG URLs are set to `https://devmina.github.io/LearnDotNet/`. If the repo is renamed, update `BASE_URL` in `scripts/build-static.mjs` and rerun it.

## Notes on "Run"

Code samples aren't executed by a real compiler — the output shown is the actual output of that exact snippet, captured ahead of time. This keeps the site fully static with no server or API keys. To wire up real execution later, `runSample()` in `js/app.js` is the place to swap in a call to an execution API (e.g. Judge0) instead of the canned `topic.output`.
