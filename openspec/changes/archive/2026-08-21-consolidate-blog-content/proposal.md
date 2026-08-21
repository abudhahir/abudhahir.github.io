## Why

The blog collection currently mixes canonical articles with duplicate drafts, slide wrappers, test entries, research notes, downloadable assets, and complete source-code projects. This creates duplicate or low-quality public routes, inconsistent metadata, fragile series ordering, and URL risk whenever files are reorganised.

## What Changes

- Restrict the Astro blog collection to canonical published articles and slide entry metadata.
- Relocate sample applications, source files, downloads, research notes, and retired drafts to purpose-specific locations outside the collection.
- Consolidate overlapping Agentic AI, Prompt Engineering, LGTM, and Copilot cost content around one canonical entry per reader intent.
- Retire test, link-only, redundant series-index, and intermediate research entries from public navigation and routing.
- Standardise filenames, authorship, explicit publication state, tags, titles, and series metadata.
- Separate normal articles from slide decks in blog navigation.
- Introduce deterministic series ordering instead of relying on publication dates.
- Prevent draft entries from receiving public static routes.
- Preserve meaningful existing URLs where practical and provide static-site-compatible redirects for renamed canonical articles; obvious tests, drafts, and non-content routes may be retired without redirects.

## Capabilities

### New Capabilities

- `blog-content-governance`: Defines canonical blog entry types, publication eligibility, metadata consistency, series ordering, content consolidation, supporting-file placement, and URL migration behaviour.

### Modified Capabilities

None.

## Impact

- Affects `src/content/blog/`, `src/content.config.ts`, blog listing and dynamic route generation, series utilities, slide entry handling, and internal article links.
- Moves supporting material into locations such as `examples/`, `public/downloads/`, and an archive or research area outside the Astro content collection.
- Changes the set of generated blog pages and may add compatibility pages for selected legacy URLs.
- Requires editorial review of older standalone posts and merged articles, followed by a full Astro production build and link validation.
