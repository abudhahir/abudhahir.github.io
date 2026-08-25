## 1. Expose the heading data

- [x] 1.1 Destructure `headings` alongside `Content` from `post.render()` in the frontmatter of `src/pages/blog/[...slug].astro` and verify by temporarily logging the array length for `agentic-ai/part-3-production-mcp-patterns.md`, confirming it is well under the 126 raw `#` lines that a regex count reports
- [x] 1.2 Write a pure hierarchy-building helper in `src/utils/` that takes `MarkdownHeading[]` and returns a nested tree, applying in order: the leading title-duplicate `h1` drop (D3 step 1 - drop a depth-1 heading only when it is the first heading in the document), relative depth normalisation against the shallowest remaining heading (D3 step 2), the `Table of Contents` exclusion (D11), and the normalised search text for each node (D8)
- [x] 1.3 Verify the helper from a temporary script against four articles chosen for different shapes, checking the stated expectation for each: `agentic-ai/part-3-production-mcp-patterns.md` (deep, over a hundred headings - top level has 19 entries); `openapi/openapi-code-generation-spring-boot-4.md` (no `##` at all - top level is non-empty, with its 5 `###` sections promoted); `lgtm/part-0-fundamentals-and-setup.md` (leading title duplicate plus a hand-written contents section - neither appears in the tree, and its 10 `##` sections form the top level); and `token-preservation/copilot-cost-optimization-playbook.md` (five `#` headings - the leading title duplicate is dropped and the four `Tier`/`Putting it together` dividers survive as top-level sections)

## 2. Anchor targeting

- [x] 2.1 Add `scroll-margin-top: 6rem` for headings inside `.markdown-content` and verify in the dev server by clicking a raw `#slug` anchor on a long article that the target heading sits fully below the fixed header rather than behind it
- [x] 2.2 Verify anchor slugs match by picking three headings that begin with an emoji and three whose text repeats within one article, and confirming each `headings[].slug` resolves to a distinct element in the rendered DOM

## 3. The navigator component

- [x] 3.1 Create the navigator island under `src/components/`, accepting the heading tree as a prop and rendering the collapsed rail - one tick per top-level section - using only semantic theme tokens; verify it renders in the right gutter without overlapping article text at 1440px
- [x] 3.2 Implement the expanded panel with the filter box at the top and the level 0/1 tree, capped in width and height with its own `overflow-y-auto`; verify on the largest article that the panel scrolls internally and the document behind it does not
- [x] 3.3 Implement the expansion triggers - hover, `focus-within`, click-to-pin, Escape and outside-click to unpin (D9); verify each of the four paths individually, including reaching and opening the panel using only Tab and Enter
- [x] 3.4 Implement level-2 reveal beneath the active top-level section only (D3); verify on `agentic-ai/part-3-production-mcp-patterns.md` that the deepest headings appear when their parent section is active and are hidden otherwise
- [x] 3.5 Implement filtering with ancestor retention (D8) and verify four cases: a query matching only a nested section keeps its parent visible and non-navigable, a query matching words after a leading emoji returns a match, a query matching nothing shows an explicit empty-state message, and clearing the query restores the full tree

## 4. Position and progress

- [x] 4.1 Implement scroll-spy with `IntersectionObserver` over the heading elements, resolving to the last heading whose top has passed the header offset when several intersect at once; verify by scrolling a long article and confirming the highlighted entry never jumps ahead of the section actually on screen
- [x] 4.2 Auto-scroll the panel container so the active entry stays visible, without moving the document; verify on the largest article that scrolling from the first to the last section keeps the active entry in view and never scrolls the page itself
- [x] 4.3 Implement progress from scroll position against the measured article height, recomputed under a `ResizeObserver` on the article element (D6); verify on `java-call-hierarchy-mermaid.md` that progress reaches completion at the true end of the article *after* the Mermaid diagrams have rendered, not before
- [x] 4.4 Fill the collapsed rail spine to the read position so it doubles as the progress indicator (D4); verify the spine fill and the progress figure in the panel agree at the top, middle, and end of an article

## 5. Scope and breakpoints

- [x] 5.1 Mount the island `client:load` in the standard-article branch of `[...slug].astro` only, passing the tree built in 1.2; verify by loading `/`, `/projects`, `/blog`, a series page, a slide-deck post, and a legacy redirect URL and confirming no navigator appears on any of them
- [x] 5.2 Apply the four-section minimum after the title-duplicate drop, depth normalisation, and `Table of Contents` exclusion (D12); verify no navigator affordance of any kind renders on `ai-code-smell-analysis.md` and `java-code-analysis-tree-sitter.md` - the only two standard articles that fall below the threshold, at two sections each - and that their layout is unchanged from before
- [x] 5.3 Verify the threshold does not fire where it should not, by confirming the navigator does render on `openapi/openapi-code-generation-spring-boot-4.md` (5 sections, the nearest article above the threshold) and `openapi/scaling-openapi-generation-multiple-specs.md` (7 sections), both of which have no `##` at all and would show an empty or absent navigator if depth normalisation were keyed to absolute heading level; because no article in the collection sits at three or four sections, exercise the boundary itself by inspecting the built tree rather than a rendered page
- [x] 5.4 Implement the sub-`xl` fallback - a persistent floating control opening the hierarchy as a sheet (D10); verify at 1280px, 1024px, and 375px that the affordance is reachable and that article text is never permanently obscured

## 6. Remove the hand-written contents sections

- [x] 6.1 Remove the `## Table of Contents` heading and the list that follows it from the six LGTM parts (`lgtm/part-0-fundamentals-and-setup.md` through `part-5-testing-and-deployment.md`), bounding the deletion at the next heading of any level and leaving the surrounding `---` separators untouched (D11); verify each file still opens with its title heading followed by its first real section
- [x] 6.2 Remove the same section from `agentic-ai/part-2-agentic-ai-and-rag.md`, `agentic-ai/part-3-production-mcp-patterns.md`, and `prompt-engineering/rag-and-agentic-rag-tutorial.md`; verify as above
- [x] 6.3 Remove the same section from `flowable-spring-bpmn-cmmn-dmn.md`, taking care that its list runs straight into `## 1: Introduction to BPMN, CMMN, and DMN` with no `---` between; verify that first section survives intact, since a deletion bounded by the next `---` would consume it
- [x] 6.4 Verify no file gained a stray artefact from the removals by checking that none of the ten now contains two consecutive `---` rules, and that none opens with a `---` immediately after the frontmatter
- [x] 6.5 Verify no link broke by confirming `table-of-contents` still appears as an anchor target nowhere under `src/`, and that the diff for each of the ten files touches nothing but the removed contents block - frontmatter, filename, and every remaining heading unchanged - so no slug, series position, or redirect entry moved

## 7. Verification

- [x] 7.1 Run `npm run build` and verify it completes with no schema or series-order failures
- [x] 7.2 Walk the dev server across all three themes (`light`, `dark`, `emerald-dark`) on one long article and verify the rail, panel, filter box, active highlight, and progress fill are all legible in each
- [x] 7.3 Confirm every scenario in `specs/blog-article-navigation/spec.md` has been observed at least once during the walkthrough, and record any that could not be verified manually - all 29 scenarios observed; recorded in `verification.md`, with two caveats (the 3-vs-4 threshold boundary has no matching content, and the light-theme progress fill measures 1.48:1 against its track)
- [x] 7.4 Run `npm run preview` against the built output and verify the navigator behaves identically to the dev server on one long article, one zero-`##` article, and one diagram-heavy article
