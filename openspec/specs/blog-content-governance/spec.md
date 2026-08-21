## Purpose

Establishes a reliable publication contract for canonical blog articles, slide decks, series, supporting material, and legacy URLs so that the generated site exposes only intentional content.

## Requirements

### Requirement: Canonical collection membership
The blog collection SHALL contain only canonical article entries and canonical slide-deck entry metadata. Source projects, research notes, downloads, screenshots, test fixtures, retired drafts, and other supporting files MUST reside outside the blog collection.

#### Scenario: Supporting project is retained
- **WHEN** a blog article has an accompanying Maven, Java, or Python project
- **THEN** the project is stored outside the blog collection and the article links to its retained location where appropriate

#### Scenario: Research material is retained
- **WHEN** an intermediate research report remains useful to the author but is not a canonical reader-facing article
- **THEN** it is stored outside the blog collection and does not generate a blog route

### Requirement: Publication eligibility
The site SHALL generate blog listings, series membership, and article routes only for entries explicitly marked as published. Draft, test, retired, and archived material MUST NOT receive a public blog route.

#### Scenario: Draft entry exists
- **WHEN** a content entry is marked as a draft
- **THEN** it is absent from blog listings, series pages, slide listings, and generated article routes

#### Scenario: Published entry exists
- **WHEN** a canonical entry is explicitly marked as published and has valid metadata
- **THEN** it receives the appropriate public route and appears in its applicable navigation views

### Requirement: Content-type navigation
The blog index SHALL present normal articles and slide decks as distinct content types. A slide-deck entry MUST NOT also appear in the normal article list unless it has a separate canonical companion article.

#### Scenario: Slide entry is published
- **WHEN** a published entry uses the slide layout
- **THEN** it appears in the Slides view and is excluded from the normal Posts view

#### Scenario: Article has companion slides
- **WHEN** a topic has both a canonical article and a canonical slide deck
- **THEN** each entry appears only in its corresponding view and may cross-link to the other

### Requirement: Consistent publication metadata
Every published blog entry MUST provide the required schema fields, use the canonical author name `Abu Dhahir`, explicitly declare `draft: false`, and use normalised titles, tags, dates, filenames, and optional series metadata.

#### Scenario: Published content is validated
- **WHEN** the production site is built
- **THEN** every published entry passes the content schema without relying on an omitted publication state or an alternative author spelling

#### Scenario: Filename is normalised
- **WHEN** a canonical entry is renamed from a generated, timestamp-only, mixed-case, spaced, or non-descriptive filename
- **THEN** its new filename is descriptive kebab-case and its selected legacy URL policy is applied

### Requirement: Deterministic series ordering
Series entries SHALL be ordered by explicit series position rather than publication date or filename ordering. Series indexes and previous/next navigation MUST use the same ordering.

#### Scenario: Publication dates change
- **WHEN** the publication date of a series entry is corrected
- **THEN** its position within the series remains unchanged

#### Scenario: Series is rendered
- **WHEN** a reader opens a series page or an article within a series
- **THEN** part labels, previous links, and next links reflect the explicit series order

### Requirement: Canonical editorial coverage
The published collection SHALL expose one canonical entry for each reader intent. Substantially overlapping drafts, abridgements, research reports, slide wrappers, and redundant series indexes MUST be merged, archived, or retired instead of remaining competing public articles.

#### Scenario: Overlapping articles are consolidated
- **WHEN** two entries substantially repeat the same structure and guidance
- **THEN** one canonical entry retains the strongest material and the other entry is retired or redirected according to the URL policy

#### Scenario: Series index duplicates generated navigation
- **WHEN** a hand-authored series README duplicates the generated series page
- **THEN** the README ceases to be a published series entry

### Requirement: Selective legacy URL continuity
Meaningful URLs for established articles SHALL remain reachable after consolidation, either at their existing path or through a static-site-compatible redirect to the canonical entry. URLs belonging only to drafts, tests, link stubs, duplicate slide wrappers, or non-content files MAY be retired without redirects.

#### Scenario: Established article is renamed
- **WHEN** a published article with a meaningful existing URL moves to a normalised canonical path
- **THEN** the old path resolves to a compatibility page that directs readers and search engines to the canonical URL

#### Scenario: Test route is removed
- **WHEN** an entry exists solely to test slide rendering or hold temporary links
- **THEN** its route may be removed without a compatibility page

### Requirement: Internal link integrity
All retained articles, series navigation, downloads, slide companions, and code-example references MUST resolve after migration.

#### Scenario: Content is moved
- **WHEN** a canonical article or supporting asset changes location
- **THEN** every retained internal reference to it is updated or covered by the selected compatibility route

#### Scenario: Production validation runs
- **WHEN** the consolidated site is built for production
- **THEN** no retained blog link points to a removed entry or missing local asset
