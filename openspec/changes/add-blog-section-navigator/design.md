## Context

See `proposal.md` - Why. Requirements live in `specs/blog-article-navigation/spec.md`; this document covers only how they are met.

Constraints discovered in the current codebase that shape the approach:

- **No side margin is reserved.** The article renders as `max-w-4xl` (896px) inside `container mx-auto px-4` in `src/pages/blog/[...slug].astro`. Because the article is centred, the free space on each side is `(viewport − 896) / 2`:

  | Viewport | Gutter each side | Usable for a panel? |
  |---|---|---|
  | 1920px | 512px | yes, comfortably |
  | 1440px | 272px | yes, with nothing to spare |
  | 1280px | 192px | too narrow for a hierarchy plus a filter box |
  | 1024px | 64px | no |
  | ≤ 928px | 0 | no |

- **Fixed page chrome.** `src/components/Header.jsx:46` renders `fixed top-0 left-0 right-0 z-50`. The article wrapper compensates with `pt-24` (96px), but that does nothing for in-page anchor jumps.
- **Three themes**, not two: `light`, `dark`, `emerald-dark` (default), switched by class on `<html>`. Colours must come from the semantic tokens (`bg-background`, `text-foreground`, `border-border`, `text-primary`, `.glass`).
- **Heading metadata is already produced and currently discarded.** `[...slug].astro:32` destructures only `Content` from `post.render()`. The Astro 5 render result is `{ Content, headings, remarkPluginFrontmatter }` where `headings` is `MarkdownHeading[] = { depth, slug, text }[]` (verified in `node_modules/astro/dist/content/runtime.d.ts:92-96`).
- **Heading levels are inconsistent between articles.** Most use `##` for top-level sections, but `openapi/openapi-code-generation-spring-boot-4.md` and `openapi/scaling-openapi-generation-multiple-specs.md` have **zero** `##` (verified by `grep -c '^## '`; `spec-driven-development-with-openspec-and-copilot.md`, named here previously, in fact has one) - their sections are `###` and `####`. Any depth policy keyed to absolute `h2` renders an empty panel on those articles.
- **Most articles repeat their title as a body `h1`.** The route already renders the title as `<h1 class="text-4xl font-bold mb-4">{post.data.title}</h1>`, yet 17 of the 32 articles also open their Markdown with a single `# ` restating it. One further article, `token-preservation/copilot-cost-optimization-playbook.md`, carries five `# ` headings: the first restates the title, and the remaining four (`Tier 1 - Basic`, `Tier 2 - Intermediate`, `Tier 3 - Advanced`, `Putting it together`) are genuine section dividers. A further article restates its title at a *deeper* level: `prompt-engineering/prompt-engineering-guide.md` opens with a single `###` restating the title and authors all fifteen of its sections at `####`.
- **The route has three render branches** - legacy redirect, `pageLayout: 'slides'`, and standard article. Only the third has a Markdown body.
- **Article height grows after load.** `MermaidRenderer` (`client:only="react"`) and the inline fallback script in `[...slug].astro` replace `<pre>` blocks with rendered SVG after `DOMContentLoaded`. Diagrams are substantially taller than the code they replace.

## Goals / Non-Goals

**Goals:**

- Derive the hierarchy at build time so nothing is scraped from the DOM at runtime.
- Keep the reading measure of the article exactly as it is today - no reflow of existing content.
- Degrade honestly: where the hierarchy cannot fit beside the article, keep the *affordance* visible rather than pretending the panel fits.
- Confine the change to one route branch and one component, so it cannot leak onto other pages.

**Non-Goals:**

- No global keyboard shortcut and no global key capture (the author declined it).
- No persistence of navigator state between page loads.
- No animation framework; CSS transitions only.

## Decisions

### D1 - Source the hierarchy from `post.render().headings`, not the DOM

Destructure `headings` alongside `Content` in the route frontmatter and pass it to the component as a prop.

*Why:* it is parser-derived, so heading-like lines inside fenced code blocks are already excluded. A naive `grep '^#'` over the content directory counts 196 `#` "H1s"; nearly all are shell comments inside code fences (for example `agentic-ai/part-3-production-mcp-patterns.md:412-443`). Crucially, `headings[].slug` and the `id` attribute Astro emits on the rendered heading come from the **same** slugger pass, so anchors match exactly - including emoji-stripped forms such as `id="-welcome-to-your-ai-agent-journey"` and the deterministic `-1`/`-2` suffixes applied to repeated headings like the five `### Step 1:` occurrences in one article.

*Alternatives rejected:* querying `document.querySelectorAll('h2, h3')` at runtime (would have to reimplement slug disambiguation, and runs after Mermaid has already mutated the DOM); a custom remark plugin (duplicates work Astro already does).

### D2 - Right-hand rail that expands, rather than an overlay or a narrowed article

Chosen by the author from three options. A thin always-visible spine sits in the right gutter and expands leftward over the edge of the article on demand.

*Why this over the alternatives:* an overlay panel would sit on top of article text from 1280px down. Narrowing the article to `max-w-3xl` would buy a real gutter but costs roughly 128px of width on every code block in the tutorial-heavy content, which is the wrong trade for this site.

*Trade-off accepted:* more states to build (collapsed, expanded, pinned, narrow-viewport) than a plain overlay.

### D3 - Drop a leading title-duplicate `h1`, then normalise depth relative to the shallowest heading

Two steps, in order:

1. **Drop the first heading of the document when it merely restates the title.** That is the case when it is at depth 1, or when it stands alone at the shallowest depth in the document. All later headings are kept.
2. Compute `minDepth` as the smallest `depth` remaining, then treat each heading level as `depth − minDepth`. Show levels 0 and 1 always; reveal level 2 only beneath the active level-0 section.

*Why step 1 is needed:* the page title is already rendered as an `h1` by the template, and 17 of the 32 articles restate it as the first heading of the body. Without this step those 17 articles normalise against that duplicate, producing a single top-level entry that reads back the page title while every real section is demoted one rank - the collapsed rail would show one tick on the majority of the collection.

*Why the rule also covers a lone shallowest heading:* `prompt-engineering/prompt-engineering-guide.md` restates its title as a `###` and authors its fifteen sections as `####`. Keyed to depth 1 alone, that restatement survives, becomes the only top-level entry, and demotes all fifteen sections beneath it - leaving the article below the D12 threshold and showing no navigator at all. Requiring the heading to be *alone* at its depth is what keeps this from touching an article that genuinely uses its shallowest level as a section divider. Verified across all 32 articles: widening the rule changes this one article (1 top-level section to 15) and no other.

*Why the rule is "first heading" rather than "all `h1` headings":* `copilot-cost-optimization-playbook.md` uses `h1` as a genuine section level, with four real dividers after the title duplicate. Dropping every depth-1 heading would delete those four sections. Keying on document position removes exactly the duplicate and keeps the dividers.

*Why step 2:* an absolute `h2`/`h3` policy produces an empty panel on the two articles that have no `##` at all. Relative normalisation makes both conventions work without touching content. Distribution across the collection is roughly 282 `##`, 456 `###`, and 92 `####`, and the largest article has well over a hundred headings, so showing every level flat is unreadable regardless.

*Alternatives rejected:* normalising the Markdown across all 32 articles (content churn in service of a UI decision); matching the heading text against the frontmatter title to detect the duplicate (brittle - titles and body headings differ in wording and punctuation across the collection, whereas document position does not).

### D4 - The rail doubles as the progress indicator

Collapsed, the rail is one tick per top-level section with the current section marked. Filling the spine from the top down to the read position provides reading progress with no additional chrome. A numeric or bar form appears only in the expanded panel.

*Why:* it satisfies both the reading-position and reading-progress requirements with one visual element, and keeps the collapsed footprint minimal in a 272px gutter.

### D5 - A single React island mounted `client:load`

One component receiving `headings` as a prop, mounted in the standard-article branch of `[...slug].astro` only - **not** in `Layout.astro`.

*Why:* everything the navigator does is client-side and DOM-observing, matching the existing pattern (`Mermaid.jsx`, `Header.jsx`). Mounting it in the layout would leak it onto `/`, `/projects`, `/blog`, and the series pages, violating the scope requirement. `client:load` rather than `client:only` because the collapsed rail has meaningful static output.

### D6 - Scroll-spy via `IntersectionObserver`; progress via scroll position plus `ResizeObserver`

Observe the heading elements for active-section tracking. Compute progress from scroll position against the measured height of the article element, and recompute that height under a `ResizeObserver` on the article.

*Why the `ResizeObserver` is not optional:* the article grows substantially after Mermaid renders. Progress computed once against a height captured at mount reads wrong on exactly the diagram-heavy articles, and the defect is silent, because scroll-spy itself is unaffected (`IntersectionObserver` reports position at intersection time). Without the observer this ships looking correct on a casual walkthrough and is wrong on the articles that most need it.

### D7 - `scroll-margin-top` on article headings

Add `scroll-margin-top: 6rem` to the headings within `.markdown-content`.

*Why:* the header is `fixed top-0` and 96px tall. Without this, every anchor jump from the navigator lands with the target heading hidden behind the header. The `pt-24` on the wrapper does not help, because it only offsets the initial page position. This is the single most likely "shipped and immediately wrong" detail, and it must be checked against a real article during verification rather than inferred from the CSS.

### D8 - Filtering: case-insensitive substring over normalised heading text, with ancestors retained

Normalise each heading text once - strip leading non-alphanumeric characters (emoji, numbering, punctuation) and lowercase - and match the query against that. A heading matches when its normalised text contains the query. Ancestors of a match are retained in the tree but rendered dimmed and non-navigable; descendants of a match are hidden unless they match themselves.

*Why:* headings in this collection routinely begin with an emoji (for example `🎯 Welcome to Your AI Agent Journey`), so matching from character zero fails on the most natural queries. Retaining ancestors keeps a filtered result readable as a tree rather than a flat jumble of orphaned subsections.

*Alternative rejected:* fuzzy matching. It adds a dependency or a hand-rolled scorer and produces confusing results on a list this size; substring is predictable.

### D9 - Expansion triggers: hover, focus-within, and click-to-pin

Hover to peek, `:focus-within` so the keyboard reaches it without a pointing device, and an explicit click that pins the panel open while the reader scans. Escape or a click outside unpins.

*Why:* hover alone fails the keyboard requirement and fails on touch. The author declined a global shortcut, so there is no key capture.

### D10 - Breakpoint behaviour

The rail is visible from the `xl` breakpoint (1280px) upward, where the gutter is at least 192px. Below that it is replaced by a persistent floating control at the bottom-right that opens the hierarchy as a sheet. The expanded panel is capped at roughly 320px wide and overlaps the edge of the article, which is acceptable because that state is transient and dismissible.

*Why 1280px rather than 1440px:* at 192px the *collapsed* rail fits comfortably; only the expanded panel overlaps, and that state is deliberate and temporary.

### D11 - Remove the ten hand-written contents sections, and keep an exclusion as a standing guard

Two parts, and both are wanted:

1. **Remove the sections from the Markdown.** Ten of the 32 articles hand-write one - all six LGTM parts, `agentic-ai` parts 2 and 3, `flowable-spring-bpmn-cmmn-dmn.md`, and `prompt-engineering/rag-and-agentic-rag-tutorial.md`.
2. **Keep filtering headings whose normalised text is `table of contents`** when building the tree.

*Why both:* the removal makes navigation uniform across the collection today; the filter is what stops the pattern silently returning in a future article and being listed as a navigable section inside a table of contents. The removal alone leaves nothing enforcing the outcome; the filter alone leaves ten articles carrying a stale duplicate below the navigator.

**Removal rule.** Delete the contents heading and the list that follows it, bounded by **the next heading of any level** - not by the next `---`. The surrounding separator convention is left exactly as it is.

*Why bounded by the next heading:* the shape is near-identical in nine of the ten files (heading, numbered anchor list, blank line, `---`, next `##`), but `flowable-spring-bpmn-cmmn-dmn.md` runs its list straight into the next heading with no rule between. A "delete through the next `---`" rule would consume that article's entire first section.

*Why the `---` stays:* it is not orphaned debris. In `lgtm/part-0-fundamentals-and-setup.md` there are ten horizontal rules and ten `##` headings - the file separates every section that way, and the rule following the contents section is the ordinary separator before section one.

*Safe to remove:* `table-of-contents` appears as an anchor target nowhere under `src/`, and none of the ten files carry "back to top" links, so no internal link breaks. No frontmatter, filename, or heading changes, so no slug, series position, or URL moves, and `legacyBlogRedirects.js` is untouched.

### D12 - Threshold of four, applied after filtering

The four-section minimum is evaluated against the tree *after* the D3 title-duplicate drop and depth normalisation and the D11 `Table of Contents` exclusion, not against the raw heading count.

*Why filter first:* otherwise an article whose headings are a title duplicate, a `Table of Contents`, and two real sections would clear a raw threshold and render a two-entry navigator.

*Why four rather than three:* an author decision. Measured against the current collection it changes nothing - with all filters applied the section counts sort as `2, 2, 5, 5, 5, 5, 6, 6, 7, …`, so no article sits at three or four and the same two are excluded either way. The higher number is slack for future short posts rather than a correction to today's content.

Exactly two standard articles fall below the threshold: `ai-code-smell-analysis.md` and `java-code-analysis-tree-sitter.md`, at two sections each. Every other standard article has five or more. The two entries with no headings at all are slide decks, already excluded by scope.

*Consequence for verification:* because nothing in the collection sits near the boundary, the threshold cannot be exercised at three-versus-four against real content. Task 5.2 therefore verifies the two clear exclusions and the nearest inclusion (five sections), and the boundary itself is left to inspection of the tree rather than to a rendered article.

## Risks / Trade-offs

- **Anchor jumps land behind the fixed header** → `scroll-margin-top` (D7), verified manually against a real article at a real viewport, not assumed from the CSS.
- **Progress goes stale after Mermaid renders** → `ResizeObserver` on the article element (D6). Verify specifically on a diagram-heavy article such as `java-call-hierarchy-mermaid.md`.
- **Two coupled scroll containers.** The panel is itself a long scroller on an article with over a hundred headings, and scroll-spy must keep the active entry in view without moving the article → scroll the container of the panel only, never the document.
- **`IntersectionObserver` ambiguity when several headings are on screen at once.** Short sections mean multiple headings intersect simultaneously → resolve to the last heading whose top has passed the header offset, rather than to the first intersecting entry.
- **Relative depth normalisation can surprise.** An article whose first heading is unusually deep will have its levels shifted → accepted; the alternative is an empty panel, which is worse.
- **The rail occupies gutter space that nothing else uses today.** If a future change adds anything else to the margin, the two will collide → keep the `z-index` of the navigator below the `z-50` of the header and confine it to a single positioned wrapper.
- **No test runner exists in this repo.** `npm run build` is the only automated gate and it cannot catch any of the above → verification is a manual walk of the dev server, enumerated in `tasks.md`.

## Migration Plan

No schema, route, or URL changes and no new dependencies. `getStaticPaths()` and the collection schema are untouched, so the build gate behaves exactly as before.

The content edits (D11) touch ten Markdown bodies but no frontmatter, filename, or heading, so no slug, series position, or redirect entry is affected. They are independently reversible through version control and are the only part of this change that is not purely additive.

Rollback of the feature is removing the component mount from the standard-article branch of `[...slug].astro`; the `scroll-margin-top` rule is harmless if left behind. Reverting the feature does not require reverting the content edits - the articles read correctly without a hand-written contents section either way.

## Open Questions

None. Both previously deferred items have been decided by the author: the ten hand-written contents sections are removed as part of this change (D11), and the section threshold is four (D12).
