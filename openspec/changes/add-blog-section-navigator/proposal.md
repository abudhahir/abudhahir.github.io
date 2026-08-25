## Why

Long-form tutorial articles on this site have outgrown linear scrolling. The largest published article carries well over a hundred headings, and readers arriving from search or from a series page have no way to see the shape of an article, jump to a named section, or tell how far through it they are.

Ten of the thirty-two published articles already work around this by hand-writing a `## Table of Contents` section into the Markdown body. That workaround is unmaintainable (it drifts whenever a heading is renamed), it is invisible once the reader has scrolled past it, and it offers no search. The site should provide section navigation as a reading affordance rather than as duplicated content each author has to maintain by hand.

## What Changes

- Published blog articles gain a persistent **section navigator**: an always-visible affordance in the right margin that reveals the article's section hierarchy on demand.
- The navigator exposes a **filter box** so a reader can narrow a long hierarchy to matching sections rather than scanning it.
- The navigator indicates the **section currently being read** and the reader's **progress through the article**.
- Section entries are derived from the article's parsed headings, so they stay correct automatically when headings are edited, and they exclude heading-like lines that appear inside fenced code blocks.
- The navigator appears **only on standard published articles**. Slide-deck entries and legacy-redirect pages do not receive it.
- Articles with fewer than **four** navigable sections do not display the navigator at all, on the grounds that navigation is not useful at that length.
- The ten articles that hand-maintain a `## Table of Contents` section have it **removed from the Markdown body**, so section navigation across the collection comes from one uniform generated source rather than from a per-article duplicate the author has to keep in step with the headings.
- A literal `Table of Contents` heading is also excluded from the generated hierarchy, so an article that acquires one in future never lists it as a navigable section.
- Published articles are henceforth expected not to hand-maintain a contents section - recorded as a requirement against the existing content-governance capability rather than left to convention.

**Non-goals:** this change does not full-text search article bodies and does not add a global keyboard shortcut.

## Capabilities

### New Capabilities

- `blog-article-navigation`: how a reader navigates within a published article - the availability and scope of section navigation, filtering of the section hierarchy, indication of reading position and progress, and which entry types receive these affordances.

### Modified Capabilities

- `blog-content-governance`: gains a requirement that a published article must not hand-maintain a table of contents in its body, since section navigation is now generated. No existing requirement in that capability changes.

## Impact

- **Routes:** the standard-article branch of `src/pages/blog/[...slug].astro`. The redirect branch and the `pageLayout: 'slides'` branch are untouched.
- **Components:** one new client-side island, mounted alongside the existing `Mermaid` island. No change to `src/layouts/Layout.astro`, so no other page in the site is affected.
- **Content:** ten Markdown files lose their hand-written `## Table of Contents` section - all six LGTM parts, `agentic-ai` parts 2 and 3, `flowable-spring-bpmn-cmmn-dmn.md`, and `prompt-engineering/rag-and-agentic-rag-tutorial.md`. No frontmatter, slug, or heading is altered, so no URL or series position moves and no redirect entry is needed. Nothing in the repository links to those sections: `table-of-contents` appears in no anchor anywhere under `src/`, and none of the ten files carry "back to top" links. Beyond those removals the hierarchy is derived from already-parsed heading metadata that the route currently discards.
- **Styling:** additive only, using the existing semantic theme tokens so all three themes (`light`, `dark`, `emerald-dark`) are covered. One in-page anchor-offset rule is added for article headings.
- **Dependencies:** none added.
- **Risk:** the article column has no reserved side margin today, so the navigator's collapsed and expanded states must be designed around the existing layout rather than assuming a sidebar exists. Detail in `design.md`.
