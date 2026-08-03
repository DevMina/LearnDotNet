# C# & .NET Concepts — Interactive Guide

A static, dependency-free site (plain HTML/CSS/JS) covering 56 C#/.NET concepts,
from fundamentals through design patterns — including a dedicated section on
C# 12–14 features (primary constructors, collection expressions, required
members, params collections, the `field` keyword, extension members, the
Lock type, and null-conditional assignment). Each topic has an explanation, a
syntax-highlighted code sample, and a "Run" button that simulates build output
in a console panel. It's also an installable PWA with offline support, and the
sidebar has a live search box to jump straight to a topic.

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
  index.html               ← the only HTML file
  css/style.css
  js/
    app.js                 ← routing, rendering, sidebar, search (ES module)
    highlight.js            ← the custom C# syntax highlighter
    topics/
      manifest.js           ← lightweight nav index: id/title/file per topic,
                               loaded eagerly so the sidebar renders instantly
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
topics you add, and means adding one topic never risks breaking another.

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
  output: `Hello`
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

## Notes on "Run"

Code samples aren't executed by a real compiler — the output shown is the
actual output of that exact snippet when run in a real .NET project, captured
ahead of time. This keeps the site fully static (no server, no API keys) while
still feeling interactive. If you'd rather wire up real execution later, the
`runSample()` function in `js/app.js` is the place to swap in a call to an
execution API (e.g. Judge0) instead of the canned `topic.output`.
