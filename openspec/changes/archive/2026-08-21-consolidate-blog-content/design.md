## Context

See `proposal.md` for motivation and `specs/blog-content-governance/spec.md` for the publication contract.

Astro currently derives blog routes from the physical path of Markdown and MDX entries. Listings filter drafts, but the catch-all route generates paths for every collection entry. Series order is date-based, and slide entries are included in both the normal post list and the slide list. The content directory also contains complete source projects, research material, duplicate slide representations, a duplicated downloadable presentation, and entries that are editorially redundant.

The site is deployed as static output, so server-side HTTP redirect rules cannot be assumed.

## Goals / Non-Goals

**Goals:**

- Make the collection boundary describe what is intentionally publishable.
- Preserve selected established URLs without retaining duplicate content entries.
- Make publication state, content type, and series position explicit and testable.
- Consolidate overlapping material while retaining useful source and research artefacts outside the public collection.
- Keep the migration reversible until the production build and link audit pass.

**Non-Goals:**

- Rewriting every retained article to a new editorial voice in this change.
- Introducing a CMS, database, search service, or new content framework.
- Preserving routes for obvious tests, drafts, temporary link collections, or generated intermediate material.
- Inventing additional blog series solely to group isolated posts.

## Decisions

### Published content remains in one constrained collection

`src/content/blog/` will hold only canonical `.md` or `.mdx` entries. Supporting material will use these destinations:

| Material | Destination |
| --- | --- |
| Runnable Maven and Python examples | `examples/` grouped by topic |
| Public downloadable files | `public/downloads/` |
| JSON slide data | `src/content/slides/` |
| Retained research and editorial source notes | an archive or research directory outside `src/content/blog/` |
| Obsolete tests, duplicate binaries, and unneeded intermediates | remove after classification |

Physical separation is preferred over broad ignore rules because it makes accidental publication harder and keeps Astro content validation focused on reader-facing entries.

### Publication is explicit at every routing surface

All retained entries will declare `draft: false`; unpublished entries will declare `draft: true` only while they remain in a content-aware drafting location. The blog index, series utilities, slide list, and catch-all route generation will share the same publication predicate.

This corrects the current gap where drafts are hidden from listings but still receive generated routes.

### Existing layout metadata distinguishes articles from slides

The existing `pageLayout` field will remain the content-type discriminator. Normal post listings will include only `pageLayout: default`; the Slides view will include only `pageLayout: slides`.

Adding a second `contentType` field was considered but rejected because it would duplicate the existing layout distinction without adding required behaviour.

### Series position becomes schema metadata

Add an optional positive integer such as `seriesOrder`, required by convention whenever `series` is present. Series utilities will sort by this value and fail visibly or exclude invalid series membership according to the repository's existing schema-validation pattern.

Using dates or parsing numeric title prefixes was rejected because both are editorial presentation data rather than stable ordering keys.

### Legacy redirects use a central compatibility manifest

Selected old slugs will map to canonical slugs in a single data structure. The static catch-all route will emit lightweight compatibility pages containing a canonical link and immediate client/meta navigation suitable for GitHub Pages.

Thin duplicate Markdown redirect entries were rejected because they would remain collection members, distort listings unless specially filtered, and weaken the canonical-entry rule. Preserving every old physical path was rejected because it prevents meaningful filename and taxonomy cleanup.

### Editorial consolidation follows a fixed migration matrix

| Content group | Canonical outcome |
| --- | --- |
| LGTM | Keep Parts 0-5; remove the tutorial README from published content; relocate the starter project and its project documentation |
| Agentic AI | Keep the foundations entry; retain Part 2 as the conceptual Agentic RAG article; reduce Part 3 to MCP-specific production material; merge the two GitLab MCP articles into one canonical Part 4 |
| Prompt Engineering | Keep the main guide and RAG tutorial; retain one canonical JSON-backed slide entry; archive or retire duplicate prose/MDX slide wrappers |
| Copilot cost | Keep the detailed playbook and JSON-backed slide deck; retire the abridged duplicate; move the research report outside public content; remove the duplicate PPTX from the content tree |
| Context Engineering | Keep all three entries; normalise filenames and repair placeholder navigation links |
| OpenAPI | Keep all three entries; normalise generated-looking filenames and preserve selected legacy URLs |
| Spec-driven development | Keep the article and replace `11.md` with a descriptive canonical filename |
| Root standalone posts | Keep the two code-analysis posts, call-hierarchy article, object-difference article, and provisionally the Flowable article; individually review generic Astro, TypeScript, Docker/Kubernetes, enterprise Java, and AI-tools posts before retaining |
| Utility entries | Retire the JSON slide test and link-only collection from public routing |
| Orphan support files | Relocate only when referenced or useful; otherwise remove after verification |

The older standalone review will use technical specificity, uniqueness, current accuracy, internal-link relevance, and fit with the site's editorial voice as retention criteria. This review may retire an entry but will not expand into complete rewrites of every retained legacy article.

### Canonical metadata is normalised in place

Published entries will use `author: "Abu Dhahir"`, explicit `draft: false`, supported schema fields, consistent tag casing, valid dates, descriptive titles, and kebab-case filenames. Existing meaningful slugs selected for preservation will be entered in the redirect manifest before files move.

## Risks / Trade-offs

- **[Static redirects are not true HTTP 301 responses]** → Emit canonical metadata, immediate navigation, and a visible fallback link; avoid renaming established paths without a compatibility entry.
- **[Large editorial merges can accidentally drop useful examples]** → Build a section-level merge checklist before editing and compare headings and code blocks before retiring a source entry.
- **[Moving examples breaks relative references]** → Inventory local Markdown links first, move examples as coherent directories, then run link checks.
- **[Series metadata can become inconsistent]** → Validate positive unique order values within each series during the migration and add a build-time consistency check if schema validation alone cannot enforce uniqueness.
- **[Older posts may contain stale technical claims]** → Treat factual modernisation as a retention gate; archive posts that cannot be responsibly retained within this change's bounded editorial effort.
- **[Removing files before validation loses recovery context]** → Perform moves and merges in reviewable batches and defer final deletion of retired source material until the build and link audit pass.

## Migration Plan

1. Record all current published and directly routable slugs, internal links, and supporting-file references.
2. Add publication, content-type, series-order, and redirect behaviour before moving content.
3. Move non-content projects, downloads, research notes, and retained examples outside the blog collection.
4. Consolidate each editorial group independently, adding compatibility mappings before canonical paths change.
5. Review and classify each older standalone article using the agreed retention criteria.
6. Normalise metadata and filenames across all retained entries.
7. Update internal links, series positions, slide companions, and downloadable references.
8. Run the production build and validate generated routes, redirects, series ordering, listings, and local links.
9. Remove temporary migration copies and unneeded retired files only after validation.

Rollback consists of restoring the previous content paths and removing compatibility mappings. Because the site is statically generated, no persistent data migration is involved.
