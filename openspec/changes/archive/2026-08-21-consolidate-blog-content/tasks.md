## 1. Baseline and Migration Inventory

- [x] 1.1 Capture the current blog entry paths, generated slugs, publication states, series membership, slide metadata, and local references; verify every existing collection entry is represented in the inventory.
- [x] 1.2 Classify every current entry and supporting file as keep, merge, relocate, archive, or retire using the design matrix; verify no file under `src/content/blog/` remains unclassified.
- [x] 1.3 Identify established URLs that require compatibility handling and record their canonical targets; verify tests, drafts, temporary link entries, and duplicate wrappers are explicitly marked as redirect-free retirements where applicable.

## 2. Publication and Routing Behaviour

- [x] 2.1 Extend the content schema with explicit series ordering and any required validation refinements; verify valid retained frontmatter loads and invalid series-order values fail the production build.
- [x] 2.2 Introduce a shared published-entry predicate and apply it to blog listings, series utilities, slide listings, and catch-all route generation; verify a draft entry receives neither navigation visibility nor a generated route.
- [x] 2.3 Separate default-layout articles from slide-layout entries in the blog index; verify each published entry appears in exactly its intended Posts or Slides view.
- [x] 2.4 Update series utilities and article navigation to use explicit series positions; verify series pages and previous/next links retain the same order when publication dates differ.
- [x] 2.5 Add the central legacy-slug compatibility manifest and static redirect-page rendering; verify each selected legacy path generates a canonical compatibility page pointing to the intended article.

## 3. Supporting Material Relocation

- [x] 3.1 Move the LGTM Maven starter and its project documentation to a coherent `examples/` location; verify the project structure is intact and retained article references resolve.
- [x] 3.2 Move Agentic AI Python examples and requirements outside the blog collection; verify referenced examples remain accessible from their canonical article or repository location.
- [x] 3.3 Retain the Copilot presentation only under `public/downloads/`, move the research report outside public content, and remove the duplicate content-tree binary; verify the published download link resolves.
- [x] 3.4 Review `GitlabOperations.java`, the prompt-engineering screenshot, the extensionless prompt-engineering draft, and other orphan material; relocate useful items and retire the remainder, verifying none remains accidentally publishable.

## 4. Editorial Consolidation

- [x] 4.1 Keep LGTM Parts 0-5 as the canonical series and retire the tutorial README as a public entry; verify the generated series page contains exactly the six ordered parts.
- [x] 4.2 Consolidate Agentic AI content by retaining the conceptual Part 2, limiting Part 3 to MCP-specific production material, and merging the GitLab MCP articles into one canonical Part 4; verify the resulting articles do not repeat major section structures and retained examples are present.
- [x] 4.3 Keep the main Prompt Engineering guide and RAG tutorial while reducing slide content to one canonical JSON-backed entry; verify duplicate prose and MDX slide wrappers no longer generate competing routes.
- [x] 4.4 Keep the detailed Copilot cost playbook and canonical slide deck, retire the abridged duplicate, and archive the research source; verify only the two intended reader-facing entries remain.
- [x] 4.5 Normalise the Context Engineering, OpenAPI, and spec-driven-development entries and repair placeholder or path-dependent navigation; verify every retained cross-link resolves to a canonical route.
- [x] 4.6 Review the older standalone posts for specificity, uniqueness, factual currency, internal-link value, and editorial fit; retain or archive each one and verify the final decision is reflected in the migration and redirect mappings.
- [x] 4.7 Remove the JSON slide test and link-only collection from public content; verify their former routes are absent and no production page links to them.

## 5. Metadata and Canonical Paths

- [x] 5.1 Set every retained published entry to `author: "Abu Dhahir"` and explicit `draft: false`, then normalise dates, titles, tags, and supported frontmatter fields; verify the content schema accepts every retained entry.
- [x] 5.2 Rename retained generated, timestamp-only, mixed-case, spaced, and non-descriptive files to kebab-case canonical names; verify every selected old slug either remains unchanged or appears in the compatibility manifest.
- [x] 5.3 Assign unique positive series positions to every series member and align title part numbers where present; verify no series contains missing or duplicate positions.
- [x] 5.4 Update article, series, slide, download, and example links after moves and merges; verify all retained local Markdown and rendered-site links resolve.

## 6. Integrated Validation and Cleanup

- [x] 6.1 Run `npm run build` and resolve all Astro content-schema, rendering, and static-path failures; verify the command completes successfully.
- [x] 6.2 Inspect generated blog routes and confirm drafts, tests, retired duplicates, research notes, and supporting projects are absent while canonical articles, slides, series pages, and compatibility pages are present.
- [x] 6.3 Validate blog index tabs, series ordering, previous/next navigation, canonical redirect metadata, downloads, and representative internal links against the specification scenarios.
- [x] 6.4 Remove temporary migration copies and files classified for retirement only after validation succeeds, then rerun `npm run build` to verify the final state remains reproducible.
