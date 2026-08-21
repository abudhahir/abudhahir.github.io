# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

Astro 5 static site for `https://abudhahir.github.io` — a single-page portfolio plus a substantial Markdown blog with series, slide-deck posts, and Mermaid diagrams. React islands provide interactivity; Tailwind provides styling. Deployed to GitHub Pages by CI.

The blog is the part with real architecture. Most work in this repo is content authoring or content-pipeline changes.

## Commands

```bash
npm install
npm run dev      # http://localhost:4321, HMR
npm run build    # static output to dist/
npm run preview  # serve the built dist/
```

**`npm run build` is the test suite.** There is no test runner, no linter, no typecheck script. Content schema violations and the series-order invariant fail the build — that is the only automated gate. Anything else is verified by walking the dev server: home, `/blog`, a post, a series page, a slides post.

## Content collection architecture

Everything blog-related flows through `src/content.config.ts` → `src/utils/blog.js` → `src/pages/blog/[...slug].astro`.

### Slugs derive from path

A file at `src/content/blog/lgtm/part-0-fundamentals-and-setup.md` becomes `/blog/lgtm/part-0-fundamentals-and-setup/`. Subdirectories are part of the URL, and slugs are lowercased (`README.md` → `readme`). Posts are grouped in per-topic directories (`lgtm/`, `agentic-ai/`, `context-engineering/`, `prompt-engineering/`, `openapi/`, `spec-driven-development/`, `token-preservation/`) with a handful of standalone posts at the root.

### Schema invariants (`src/content.config.ts`)

Beyond the obvious required fields, three rules are enforced by `superRefine` and will fail the build:

- `series` and `seriesOrder` are **both-or-neither**. Setting one without the other is an error.
- `pageLayout: 'slides'` requires `slidesData`.
- `draft` is **required** — `z.boolean()`, not optional. Every post must set it explicitly. `getPublishedBlogEntries()` keeps only entries where `draft === false`, so a missing `draft` is a build failure and `draft: true` silently removes the post from every listing and route.

### A build-time invariant Zod does not cover

`assertValidSeriesPositions()` in `src/utils/blog.js` **throws on duplicate `seriesOrder` within the same series**. It runs inside `getPublishedBlogEntries()`, so it fires during `getStaticPaths()`. If a build dies with "Duplicate seriesOrder", two posts in one series claim the same position — this is not visible from either file alone.

Always read posts through `getPublishedBlogEntries()` (or the `src/utils/series.js` helpers built on it) rather than calling `getCollection('blog')` directly, or you lose both draft filtering and this check.

### Moving or renaming a post requires a redirect entry

`src/data/legacyBlogRedirects.js` maps old slugs to current paths. `getStaticPaths()` in `[...slug].astro` folds these entries in alongside real posts and emits interstitial pages carrying a canonical link, a meta refresh, and a `location.replace()`. Renaming a post without adding an entry here breaks every existing inbound link. Redirect targets are written with a trailing slash.

### Slide-deck posts

Set `pageLayout: 'slides'` and `slidesData: <name>`. The router substring-matches that value against `import.meta.glob('../../content/slides/*.json')` and **throws at build** if nothing matches. The post then renders through `SlideLayout` + `JsonSlideDeck` (`client:only="react"`) instead of the normal article layout — the Markdown body is ignored. JSON decks live in `src/content/slides/`; the repo has a `c-deck-skill` that knows the deck schema.

### Mermaid

The live path: `mermaidPlugin` (`src/utils/mermaid-plugin.js`, registered globally in `astro.config.mjs`) rewrites ` ```mermaid ` fences into `<div class="mermaid" data-chart="...">` at build time, and `Mermaid.jsx` — mounted `client:only="react"` in `[...slug].astro` — renders those divs in the browser.

Note the `markdown: { remarkPlugins: [] }` on the `blog` collection in `content.config.ts` does *not* override the global plugin; verified against built output. Just tag fences as `mermaid` and it works. The inline `<script>` block further down `[...slug].astro` is a separate legacy fallback that scans `pre code` for untagged diagram source; it duplicates the theme config and is not the path a new diagram takes.

## Post-authoring conventions

`.claude/skills/abu-blog-writing/SKILL.md` is the authority on voice and frontmatter for this site — British spelling, `author: "Abu Dhahir"` exactly, tag casing (Title Case for technologies, lowercase for conceptual domains), opener and subheading style, and the rule against inventing new `series:` names. Read it before drafting or revising a post.

## Frontend

- **Themes are three, not two**: `light`, `dark`, `emerald-dark` — `emerald-dark` is the default, persisted at `localStorage['theme']` by `ThemeToggle.jsx`. Colours are CSS custom properties surfaced as Tailwind semantic utilities (`bg-background`, `text-foreground`, `border-border`, `text-primary`). Use those, not raw palette values.
- **Only two env toggles are actually read**: `PUBLIC_SHOW_EXPERIENCE` and `PUBLIC_SHOW_CONTACT_FORM`, both compared against the string `"true"` in `index.astro`, `Header.jsx`, and `Hero.jsx`. `.env.example` and `README.md` also advertise `PUBLIC_SHOW_BLOG`, `PUBLIC_RESUME_URL`, and `PUBLIC_CALENDAR_URL` — **no code reads these**. Don't rely on them; wire them up or ignore them.
- **`showProjects: true` in `astro.config.mjs` is a hand-rolled config channel, not an Astro option.** Astro itself ignores the key; `src/pages/projects.astro` imports the config module directly (`import astroConfig from "../../astro.config.mjs"`) and passes `astroConfig.showProjects` into `Projects.jsx`. It works, but it only reaches `/projects` — the `Projects` island mounted anywhere else falls back to the component default of `true`.
- React islands use `client:load` for above-the-fold interactivity and `client:only="react"` where the component touches the DOM or has no meaningful SSR output (Mermaid, slide decks).

## Where things live

```
src/pages/          Astro routes: index, projects, blog/index, blog/[...slug], blog/series/[series]
src/content/blog/   Markdown posts, grouped into per-topic directories
src/content/slides/ JSON decks for pageLayout: 'slides'
src/utils/          blog.js (draft filter + series invariant), series.js, mermaid-plugin.js, github.js
src/data/           legacyBlogRedirects.js, socialLinks.js
src/layouts/        Layout.astro (site chrome), SlideLayout.astro (full-bleed deck)
examples/           Runnable sample code that accompanies posts — kept OUT of the content collection
archive/            Retired content and research notes, not built
```

Sample code for a tutorial belongs in `examples/`, never under `src/content/blog/`. Anything under `src/content/blog/` is parsed against the collection schema, so a stray `.java` or `pom.xml` there is a build hazard.

## Deployment

`.github/workflows/deploy.yml` builds and publishes to GitHub Pages on push to `master` or `main`. Note CI runs `rm -rf node_modules package-lock.json && npm install` before building — **the lockfile is not honoured in CI**, so a transitive dependency can shift between a green local build and a red deploy.

## Planning workflow

This repo uses OpenSpec (`openspec/`, `.claude/commands/opsx/`, `.claude/skills/openspec-*`) for staged changes. `openspec/changes/consolidate-blog-content/` is currently **in flight**: it flattens the old numbered/mixed-case blog directories into topic directories, moves sample code to `examples/`, and backfills `legacyBlogRedirects.js`. Expect the working tree to show large deletions under old paths alongside untracked new ones — check `git status` before assuming a post's location.

## Related docs

- `AGENTS.md` — repo conventions, commit/PR expectations. Accurate; consult rather than duplicating here.
- `README.md` — user-facing setup. Its blog section predates the current schema (it omits `draft`, `series`, `seriesOrder` and shows the wrong `author` value); trust `src/content.config.ts` over it.
