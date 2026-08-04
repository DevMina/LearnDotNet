# C# & .NET Concepts — Interactive Guide

A static, dependency-free site (plain HTML/CSS/JS) covering 70 C#/.NET concepts,
from fundamentals through design patterns — including a dedicated section on
C# 12–14 features (primary constructors, collection expressions, required
members, params collections, the `field` keyword, extension members, the
Lock type, and null-conditional assignment). Each topic has an explanation, a
syntax-highlighted code sample, and a "Run" button that simulates build output
in a console panel. It's also an installable PWA with offline support, has a
live search box (matching titles *and* explanation text) to jump straight to
a topic, per-topic "mark as learned" progress tracking, related-topic links,
a print-friendly view, and keyboard shortcuts (`/` to search, `←`/`→` to move
between topics).

## PWA notes

- `manifest.json` + `icons/` make the site installable (Add to Home Screen /
  Install App) on desktop and mobile.
- `sw.js` is a service worker using a **network-first** strategy: it always
  tries the network first (so visitors get the latest deployed files), and
  only falls back to the cached copy if the network request fails — that's
  what makes the site usable offline after a first visit.
- Because it's network-first, `CACHE_NAME` is intentionally **unversioned** —
  every successful online visit refreshes the cache automatically, so there's
  nothing to bump when you deploy an update.
- The service worker only registers over `https://` or `localhost` — opening
  `index.html` directly via `file://` will skip it (browsers block service
  workers on `file://` for security), everything else still works normally.
- **GitHub Pages serves over https automatically**, so installability and
  offline support work out of the box once deployed there.

## Progress tracking ("mark as learned")

Each topic page has a "Mark as learned" toggle. State is stored client-side
only, in `localStorage` under the key `csharp-concepts-progress`, as an array
of topic ids — there's no backend or account system involved. The sidebar
shows a checkmark next to learned topics and an `x/y` count per category; the
landing page shows an overall progress bar once at least one topic is marked.
Clearing site data/localStorage resets progress, and it doesn't sync across
devices or browsers since nothing is sent anywhere.

## Contact form

The "Contact us" link in the footer opens a simple form (`#/contact`). Since
this is a static site with no backend, submitting it builds a `mailto:` link
to **mina.abdo2030@gmail.com** with the name/email/message filled in and opens
the visitor's email app to send it — no server or API key required. The logic
lives in `renderContact()` in `js/app.js`.

## Preview locally

No build step needed — but the site now uses real ES modules (`import`/
`export`) so each topic can load on demand, and **browsers block ES module
loading over `file://`**. You must serve it over HTTP, even locally:

```bash
cd dotnet-site
python3 -m http.server 8080
# then open http://localhost:8080
```

Double-clicking `index.html` directly will not work anymore — the page will
load but the sidebar and topics won't render, since the module script gets
blocked. This is a browser security restriction on `file://` + modules, not a
bug in the site.

## Deploy to GitHub Pages

1. Push this folder's contents to the root of a GitHub repository (or to a
   `/docs` folder — either works).
2. In the repo, go to **Settings → Pages**.
3. Under "Build and deployment", choose **Deploy from a branch**, pick the
   branch (e.g. `main`) and the folder (`/ (root)` or `/docs`).
4. Save — GitHub will give you a URL like
   `https://<username>.github.io/<repo-name>/` within a minute or two.

No `.nojekyll` file or build config is required since there's no build step —
it's already static files.

## File structure

```
dotnet-site/
  index.html               ← app shell; sidebar/#main content baked in by
                               build-static.mjs, then re-rendered by app.js
                               on load for JS-enabled visitors
  sitemap.xml               ← generated: real URL per topic, for crawlers
  robots.txt                ← allows crawling, points to sitemap.xml
  topics/                   ← generated: one real static page per topic
    semaphore-slim/
      index.html             ← full readable content, no JS required
    ...
  scripts/
    validate-topics.mjs      ← CI check: manifest/content/related-id/
                                 generated-output integrity
    build-static.mjs         ← generates topics/, index.html's baked
                                 sections, sitemap.xml, and robots.txt
  .github/workflows/
    validate.yml             ← runs both scripts above on every push/PR
  css/style.css
  js/
    app.js                 ← routing, rendering, sidebar, search (ES module)
    highlight.js            ← the custom C# syntax highlighter, reused
                               as-is by build-static.mjs at build time
    topics/
      manifest.js           ← lightweight nav index: id/title/file per topic,
                               loaded eagerly so the sidebar renders instantly
      search-index.js       ← generated: id/tagline/keywords per topic, for
                               full-text sidebar search without eager-loading
                               every topic's full content
      fundamentals/
        variables-types.js  ← one small file per topic, loaded on demand
        operators.js
        ...
      oop/
        inheritance.js
        ...
      patterns/
        singleton.js
        ...
```

Only `manifest.js` (small — just id/title/file per topic) loads upfront. The
full content of a topic (explanation, code, output) is fetched with a dynamic
`import()` the moment someone opens that topic, via `loadTopic()` in
`manifest.js`. This keeps the initial page load light no matter how many
topics you add, and means adding one topic never risks breaking another. This
is unrelated to (and unaffected by) the static `topics/<id>/index.html` pages
described in "Static pages & SEO" below — those are pre-built once, not
fetched dynamically.

One trade-off: if someone is offline and opens a topic they've never loaded
on that device before, there's nothing cached for it yet, so it can't load —
the site shows a clear message and a Retry button rather than failing
silently. Topics they've already visited (online, at least once) keep working
offline via the service worker's cache, same as before.

## Adding more topics

1. Create a new file at `js/topics/<category>/<topic-id>.js`:

```js
export default {
  tagline: "One-line summary shown under the title.",
  explanation: `
    <p>HTML explanation paragraphs go here.</p>
  `,
  keyPoints: [
    "First key point",
    "Second key point"
  ],
  code: `Console.WriteLine("Hello");`,
  output: `Hello`,
  related: ["some-other-topic-id"] // optional — renders as "Related topics" chips
};
```

2. Add one entry to that category's `topics` array in `js/topics/manifest.js`:

```js
{ id: 'topic-id', title: 'Topic Title', file: './category/topic-id.js' }
```

That's it — it automatically appears in the sidebar, becomes searchable, gets
wired into prev/next navigation, and is routable at `#/topic-id`. To add a
whole new category, add a new `{ id, name, topics: [] }` object to the
`CATEGORIES` array in `manifest.js` and start adding topic files under a
matching new folder in `js/topics/`.

### After adding topics: regenerate the generated files

Three things are generated, not hand-maintained, and need regenerating
whenever topics are added, removed, or renamed:

- **`js/topics/search-index.js`** — a flat array of `{ id, tagline, keywords }`
  used by the sidebar search so it can match on tagline/key-points/explanation
  text, not just the title. Kept separate from `manifest.js` so search doesn't
  force loading every topic's full content (code/output included) on first
  paint.
- **`topics/<id>/index.html`** — one real, static, fully-readable HTML page
  per topic (see "Static pages & SEO" below), plus the sidebar/landing content
  baked into the root `index.html`, plus `sitemap.xml`/`robots.txt`.

Regenerate the static pages with:

```
node scripts/build-static.mjs
```

`search-index.js` was generated the same way this project's search index was
first built — ask an AI assistant to "regenerate search-index.js from the
current manifest" and point it at this README if you need to redo it, or
extend `build-static.mjs` to also emit it.

**Commit the generated output.** GitHub Pages serves static files with no
build step, so `topics/`, the regenerated parts of `index.html`, and
`sitemap.xml`/`robots.txt` all have to be committed, not just generated
locally and left uncommitted. CI (below) fails the build if they're out of
sync with the source topic files, specifically to catch this.

## CI

`.github/workflows/validate.yml` runs on every push/PR to `main`:

1. **`node scripts/validate-topics.mjs`** — loads every topic listed in
   `manifest.js` and checks it has the required fields (`tagline`,
   `explanation`, `keyPoints`, `code`, `output`); checks for duplicate
   topic/category ids; checks every `related` id points to a real topic
   (catches typos before they ship as a dead link); checks `search-index.js`,
   `sitemap.xml`, and `topics/<id>/` all mention/contain every topic in the
   manifest, so it's obvious in a PR if any of them were forgotten after
   adding, removing, or renaming a topic.
2. **Rebuild-and-diff** — runs `node scripts/build-static.mjs` fresh, then
   fails if that produces any changes to the already-committed `topics/`,
   `index.html`, `sitemap.xml`, or `robots.txt`. This is what actually
   enforces "commit the generated output" above — it doesn't just check that
   the files exist, it checks their *content* is current.
3. A quick structural sanity check that `sitemap.xml` is well-formed.

No npm dependencies — matching the rest of the project, both scripts only use
Node's built-in modules — so there's no `npm install` step. Run the same
checks locally before pushing:

```
node scripts/validate-topics.mjs
node scripts/build-static.mjs && git status --short
```

(if the second command prints any changed files, commit them.)

## Static pages & SEO

Every topic has a real, static HTML page at `topics/<topic-id>/index.html`,
generated by `scripts/build-static.mjs`. Each one has its own `<title>`,
meta description, canonical URL, and Open Graph/Twitter tags, and contains
the topic's full explanation, key points, syntax-highlighted code, and output
as plain readable HTML — no JavaScript required to read it or to navigate to
another topic (the sidebar, prev/next, and related-topic links are all real
`<a href>` links to other real pages). The root `index.html`'s sidebar and
landing content are generated the same way, so the whole site's link graph is
crawlable without executing JS. `sitemap.xml` lists every one of these real
URLs for search engines.

For visitors with JavaScript enabled, a small inline script at the top of
each generated page sets `location.hash` to that topic's id via
`history.replaceState` before anything else runs. `js/app.js`'s existing
router (unchanged) picks that up on load and renders the same topic through
the normal interactive SPA path — Run/Copy/Print/Mark-as-learned all become
live immediately, and further in-app navigation goes back to being
hash-based, exactly as it already worked before these pages existed. In
short: crawlers and no-JS visitors get real static content and real links;
JS visitors get hydrated into the same interactive app as always, just
arriving through a real URL instead of `#/topic-id`.

This means `#/topic-id` (via the root page) and `/topics/topic-id/` (the
static page) both exist and show the same content — that's intentional, not
duplicate-content risk in practice, since crawlers generally don't index hash
fragments as separate URLs at all; the canonical URL for each topic is always
the real `/topics/topic-id/` path.

The canonical/OG URLs baked into `index.html` and `build-static.mjs`'s
`BASE_URL` are set to `https://devmina.github.io/LearnDotNet/`, the site's
actual GitHub Pages URL. If the repo is ever renamed or moved, update
`BASE_URL` in `scripts/build-static.mjs` and rerun it — everything else
(`index.html`, every `topics/<id>/index.html`, `sitemap.xml`, `robots.txt`)
regenerates from that one constant.

## Notes on "Run"

Code samples aren't executed by a real compiler — the output shown is the
actual output of that exact snippet when run in a real .NET project, captured
ahead of time. This keeps the site fully static (no server, no API keys) while
still feeling interactive. If you'd rather wire up real execution later, the
`runSample()` function in `js/app.js` is the place to swap in a call to an
execution API (e.g. Judge0) instead of the canned `topic.output`.
