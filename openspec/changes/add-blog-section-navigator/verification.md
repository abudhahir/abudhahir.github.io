# Verification record

Walkthrough of `specs/blog-article-navigation/spec.md` against the dev server
(`npm run dev`) and the built output (`npm run preview`), at 1440px unless
stated. All 29 scenarios were observed at least once. Two caveats are recorded
at the end.

## Scenario coverage

### Section navigator scope

| Scenario | Evidence |
|---|---|
| Reader opens a standard article | Navigator present on exactly 28 of the 32 entries - every standard article above the threshold. |
| Reader opens a slide-deck entry | `prompt-engineering-slides`: zero navigator elements in the live DOM after the deck hydrates. |
| Reader follows a legacy URL | `/blog/flowablewithspring/` (redirect branch): no navigator markup served. |
| Reader opens a non-article page | `/`, `/projects/`, `/blog/`, `/blog/series/Agentic AI Foundations/`: no navigator markup served. |

### Minimum navigable sections

| Scenario | Evidence |
|---|---|
| Article has enough sections | `openapi-code-generation-spring-boot-4` (5 sections, nearest above the threshold) renders the navigator. |
| Article has too few sections | `ai-code-smell-analysis` and `java-code-analysis-tree-sitter` (2 sections each): no affordance of any kind, and the article column measures 268–1164px, identical to an article that does have one. |

### Section hierarchy fidelity

| Scenario | Evidence |
|---|---|
| Fenced code with hash lines | `agentic-ai/part-3`: 95 parsed headings against 126 raw `^#` lines. In `copilot-cost-optimization-playbook.md`, the fenced `# Just start typing…` line is absent from the tree. |
| Shallowest heading is deeper | `openapi-code-generation-spring-boot-4`: 0 `h2`, 5 `h3` - all five promoted to top level, 5 rail ticks. |
| Body opens by restating the title | `lgtm/part-0`: leading `#` dropped, 9 top-level sections. `prompt-engineering-guide`: leading `###` dropped, 15 top-level sections (see the D3 note below). |
| Top-level headings as section dividers | `copilot-cost-optimization-playbook`: only the leading `#` dropped; the four `Tier`/`Putting it together` dividers survive as top-level sections. |
| Author renames a heading | `typescript-best-practices.md` line 57 renamed to `## Advanced Type Techniques RENAMED-PROBE`; the navigator entry and the anchor `#advanced-type-techniques-renamed-probe` both updated with no other edit. Probe reverted. |
| Article acquires a contents section | Checked before the content removals, while the ten files still carried one: `Table of Contents` absent from every built tree. |
| Two sections share heading text | `flowable-spring-bpmn-cmmn-dmn`: `Definition:` appears 4 times → `definition`, `definition-1`, `definition-2`, `definition-3`, each resolving to its own element. |

Anchor fidelity was checked exhaustively rather than by sample: all **802** tree
slugs across the 28 articles resolve to exactly one heading element in the built
HTML, with zero mismatches.

### Persistent access to navigation

| Scenario | Evidence |
|---|---|
| Scrolled deep into a long article | Rail is `position: fixed`; present and operating at 100% scroll on a 74,905px document. |
| Reader is not using the navigator | Collapsed panel computes `visibility: hidden`, `opacity: 0`; its 85 entries and filter box are out of tab order. |
| Reader is on a narrow viewport | 1024px and 375px: rail hidden, 44×44 floating control visible and within the viewport; no horizontal page scroll at 375px. |
| Reader navigates by keyboard | **Rail (1440px):** one Tab from the last chrome link reaches the rail (14th tab stop); `focus-within` alone reveals the panel; Enter pins; the next Tab lands in the filter box. **Sheet (375px):** Tab to the control, Enter opens it, Tab reaches the filter box, Tab again reaches the first section entry (`🌟 Welcome to Your AI Agent Journey`). Both variants render their control *before* the panel in the DOM, with `order` restoring the visual arrangement, so tabbing onward from the control enters the panel it just revealed rather than skipping past it. |

### Section filtering

| Scenario | Evidence |
|---|---|
| Reader filters the hierarchy | Query `sequential` narrows 18 top-level entries to the matching branch. |
| Only a nested section matches | Same query: `Understanding Multi-Agent Systems` and `Core Architecture Patterns` render as dimmed non-navigable `<span>`s; the level-2 match renders as a link. |
| Heading begins with a decorative character | Query `welcome` matches `🌟 Welcome to Your AI Agent Journey`. |
| No section matches | Query `testcontainers` shows “No sections match “testcontainers”.”, not an empty panel. |
| Reader clears the query | Full tree restored: 18 top-level, 85 entries. |

### Reading position, progress, and navigation

| Scenario | Evidence |
|---|---|
| Reader scrolls through the article | 21-point scroll sweep of `agentic-ai/part-3`: zero cases where the highlighted entry ran ahead of the section on screen. |
| Current section outside the visible area | Panel container scrolls itself to keep the active entry in view; document `scrollY` never moved by the panel. |
| Reader progresses through the article | 0% / 50% / 100%, reaching 100% at the article end (scrollY 74,451) rather than the document end (74,905). |
| Diagrams change height after load | Growing the article element with no scroll event moved progress 55% → 22% and back to 55% on removal. Reproduced against the built bundle (55% → 26% → 55%). |
| Reader selects a section | Heading lands at y=96 with the header bottom at y=69 - fully clear. |
| Reader selects from a filtered hierarchy | Same result when selecting the `welcome` match while the filter was active. |

### Theme consistency

| Scenario | Evidence |
|---|---|
| Reader switches theme | All navigator colours are token-derived and change per theme. Entry-text contrast against the page: light 17.18:1, dark 16.91:1, emerald-dark 15.02:1. |

## Caveats

1. **The four-section threshold boundary cannot be exercised against real
   content.** With all filters applied the collection's section counts are
   `0, 0, 2, 2, 5, 5, 5, 5, 6, 6, 7, 8, 8, 9 …` - no article sits at three or
   four. The two clear exclusions and the nearest inclusion were verified on
   rendered pages; the boundary itself was confirmed by inspecting the built
   tree, as `design.md` D12 anticipated.

2. **Light-theme progress fill has low non-text contrast.** The fill uses
   `--primary` and its track uses `--border`, per the requirement to use
   semantic tokens rather than fixed values. In the light theme that pairing
   measures **1.48:1** (dark 8.18:1, emerald-dark 8.64:1), below the 3:1 that
   WCAG 1.4.11 asks of non-text indicators. It remains discernible by hue and
   is accompanied by the numeric percentage at 4.54:1, so progress is still
   communicated; but if the author wants the bar itself to carry the contrast,
   that is a change to the light palette rather than to this component.

## Note on a pre-existing defect

Every page of the site logs `TypeError: Cannot read properties of null (reading
'classList')`. It originates in the theme script in `src/layouts/Layout.astro`
(and the twin in `SlideLayout.astro`), which touches `document.body` from
`<head>` before the body exists. It predates this change, is present on pages
that have no navigator, and was left alone.
