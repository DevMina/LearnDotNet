# C# & .NET Concepts — Interactive Guide

A static, dependency-free site (plain HTML/CSS/JS) covering 27 C#/.NET concepts,
from fundamentals through design patterns. Each topic has an explanation, a
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

No build step needed — just serve the folder over HTTP (opening `index.html`
directly with `file://` will work too, but a local server avoids any browser
quirks with relative paths):

```bash
cd dotnet-site
python3 -m http.server 8080
# then open http://localhost:8080
```

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

## Adding more topics

All content lives in `js/topics.js` as a single `CATEGORIES` array. Add a new
object to a category's `topics` array (or a new category) with `id`, `title`,
`tagline`, `explanation`, `keyPoints`, `code`, and `output` fields, and it will
automatically appear in the sidebar and become routable at `#/<id>`.

## Notes on "Run"

Code samples aren't executed by a real compiler — the output shown is the
actual output of that exact snippet when run in a real .NET project, captured
ahead of time. This keeps the site fully static (no server, no API keys) while
still feeling interactive. If you'd rather wire up real execution later, the
`runSample()` function in `js/app.js` is the place to swap in a call to an
execution API (e.g. Judge0) instead of the canned `topic.output`.
