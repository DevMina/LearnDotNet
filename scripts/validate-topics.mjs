// Validates the topic content pipeline before it ships. Run with:
//   node scripts/validate-topics.mjs
//
// Checks:
//  1. Every topic in manifest.js resolves to a file with the required fields
//     (tagline, explanation, keyPoints, code, output).
//  2. No duplicate topic ids across the whole manifest.
//  3. Every `related` id on a topic points to a real topic id (no typos/dead links).
//  4. search-index.js has an entry for every topic in the manifest (and no
//     stale entries for topics that no longer exist) — catches forgetting to
//     regenerate it after adding/removing/renaming a topic.
//  5. sitemap.xml mentions every topic id — catches forgetting to regenerate
//     it after adding/removing/renaming a topic.
//
// Exits with a non-zero status (and prints every failure found, not just the
// first) if anything is wrong, so CI fails loudly instead of shipping a
// broken topic silently.

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const { CATEGORIES, ALL_TOPICS_FLAT, loadTopic } = await import(
  path.join(root, 'js/topics/manifest.js')
);
const { SEARCH_INDEX } = await import(
  path.join(root, 'js/topics/search-index.js')
);

const errors = [];
const REQUIRED_FIELDS = ['tagline', 'explanation', 'keyPoints', 'code', 'output'];

// ---------- 1 & 3: per-topic content + related-id validity ----------
const allIds = new Set(ALL_TOPICS_FLAT.map(t => t.id));
const seenIds = new Set();

for (const topic of ALL_TOPICS_FLAT) {
  // 2. duplicate ids
  if (seenIds.has(topic.id)) {
    errors.push(`Duplicate topic id "${topic.id}" in manifest.js`);
  }
  seenIds.add(topic.id);

  let content;
  try {
    content = await loadTopic(topic.file);
  } catch (err) {
    errors.push(`Failed to load "${topic.id}" (${topic.file}): ${err.message}`);
    continue;
  }

  for (const field of REQUIRED_FIELDS) {
    const value = content[field];
    const isMissing =
      value === undefined ||
      value === null ||
      (typeof value === 'string' && value.trim() === '') ||
      (Array.isArray(value) && value.length === 0);
    if (isMissing) {
      errors.push(`Topic "${topic.id}" (${topic.file}) is missing required field "${field}"`);
    }
  }

  if (content.keyPoints && !Array.isArray(content.keyPoints)) {
    errors.push(`Topic "${topic.id}": keyPoints must be an array`);
  }

  if (content.related !== undefined) {
    if (!Array.isArray(content.related)) {
      errors.push(`Topic "${topic.id}": related must be an array of topic ids`);
    } else {
      for (const relatedId of content.related) {
        if (!allIds.has(relatedId)) {
          errors.push(`Topic "${topic.id}" has related id "${relatedId}", which doesn't exist in the manifest`);
        }
        if (relatedId === topic.id) {
          errors.push(`Topic "${topic.id}" lists itself in its own related array`);
        }
      }
    }
  }
}

// ---------- 4: search-index.js in sync with manifest ----------
const searchIds = new Set(SEARCH_INDEX.map(r => r.id));
for (const id of allIds) {
  if (!searchIds.has(id)) {
    errors.push(`search-index.js is missing an entry for topic "${id}" — regenerate it (see README § "Adding more topics")`);
  }
}
for (const id of searchIds) {
  if (!allIds.has(id)) {
    errors.push(`search-index.js has a stale entry for "${id}", which no longer exists in the manifest`);
  }
}

// ---------- 5: sitemap.xml in sync with manifest ----------
let sitemapText = '';
try {
  sitemapText = await readFile(path.join(root, 'sitemap.xml'), 'utf-8');
} catch {
  errors.push('sitemap.xml is missing from the repo root');
}
if (sitemapText) {
  for (const id of allIds) {
    if (!sitemapText.includes(id)) {
      errors.push(`sitemap.xml doesn't mention topic "${id}" — regenerate it`);
    }
  }
}

// ---------- 6: generated static pages (topics/<id>/index.html) in sync ----------
// GitHub Pages has no build step, so scripts/build-static.mjs's output has to
// be committed. This just checks the output exists and matches the current
// topic list — it doesn't re-run the generator (the CI workflow does that
// separately, via `git diff --exit-code`, to also catch stale *content*).
let topicDirs = [];
try {
  const { readdir } = await import('node:fs/promises');
  topicDirs = await readdir(path.join(root, 'topics'));
} catch {
  errors.push('topics/ directory is missing — run `node scripts/build-static.mjs`');
}
if (topicDirs.length) {
  for (const id of allIds) {
    if (!topicDirs.includes(id)) {
      errors.push(`topics/${id}/ is missing — run \`node scripts/build-static.mjs\``);
    }
  }
  for (const dir of topicDirs) {
    if (!allIds.has(dir)) {
      errors.push(`topics/${dir}/ exists but "${dir}" is no longer a topic — run \`node scripts/build-static.mjs\` to remove stale output`);
    }
  }
}

// ---------- Category sanity ----------
const categoryIds = new Set();
for (const cat of CATEGORIES) {
  if (categoryIds.has(cat.id)) {
    errors.push(`Duplicate category id "${cat.id}" in manifest.js`);
  }
  categoryIds.add(cat.id);
  if (!Array.isArray(cat.topics) || cat.topics.length === 0) {
    errors.push(`Category "${cat.id}" has no topics`);
  }
}

// ---------- Report ----------
if (errors.length > 0) {
  console.error(`\n✗ ${errors.length} problem${errors.length === 1 ? '' : 's'} found:\n`);
  for (const e of errors) console.error(`  - ${e}`);
  console.error('');
  process.exit(1);
} else {
  console.log(`✓ ${ALL_TOPICS_FLAT.length} topics across ${CATEGORIES.length} categories validated. search-index.js and sitemap.xml are in sync.`);
}
