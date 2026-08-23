## Purpose

Defines how a reader orients themselves within a single published blog article: what section navigation is available, how the section hierarchy is derived and filtered, and how reading position and progress are communicated.

## ADDED Requirements

### Requirement: Section navigator scope
The site SHALL present a section navigator on standard published articles only. Slide-deck entries and legacy-redirect compatibility pages MUST NOT present a section navigator, and no other page of the site may present one.

#### Scenario: Reader opens a standard article
- **WHEN** a reader opens a published article that renders its Markdown body
- **THEN** a section navigator is available for that article

#### Scenario: Reader opens a slide-deck entry
- **WHEN** a reader opens a published entry that renders as a slide deck instead of an article body
- **THEN** no section navigator is presented

#### Scenario: Reader follows a legacy URL
- **WHEN** a reader arrives at a retired URL that serves a compatibility page
- **THEN** no section navigator is presented

#### Scenario: Reader opens a non-article page
- **WHEN** a reader opens the home page, the projects page, the blog index, or a series page
- **THEN** no section navigator is presented

### Requirement: Minimum navigable sections
The section navigator SHALL be presented only when the article contains at least four navigable sections. An article below that threshold MUST render as it does today, with no navigator affordance of any kind.

#### Scenario: Article has enough sections
- **WHEN** a published article contains four or more navigable sections
- **THEN** the section navigator is presented

#### Scenario: Article has too few sections
- **WHEN** a published article contains fewer than four navigable sections
- **THEN** no navigator affordance is rendered and the article layout is unchanged

### Requirement: Section hierarchy fidelity
The section hierarchy SHALL be derived from the parsed headings of the article and MUST reflect the nesting the author actually used. Heading-like lines occurring inside fenced code blocks MUST NOT appear as sections. The hierarchy MUST remain correct without any author-maintained duplicate of it in the article body.

#### Scenario: Article contains fenced code with comment lines
- **WHEN** an article contains fenced code blocks whose lines begin with a hash character
- **THEN** those lines are absent from the section hierarchy

#### Scenario: Shallowest heading is deeper than in other articles
- **WHEN** the sections of an article are authored entirely at a deeper heading level, with no heading at the level other articles use
- **THEN** the navigator presents those sections as the top-level sections of that article rather than presenting an empty hierarchy

#### Scenario: Article body opens by restating the title
- **WHEN** the body of an article opens with a top-level heading that restates the title the page already displays
- **THEN** that heading is excluded from the section hierarchy, and the sections following it are presented as the top-level sections of the article rather than as subsections of a single entry repeating the title

#### Scenario: Article uses top-level headings as section dividers
- **WHEN** an article uses top-level headings as genuine section dividers after an opening heading that restates the title
- **THEN** only the opening heading is excluded and each divider remains a navigable top-level section

#### Scenario: Author renames a heading
- **WHEN** an author edits the text of a heading in an article
- **THEN** the section navigator reflects the new text on the next build with no other edit required

#### Scenario: Article acquires a hand-written contents section
- **WHEN** an article contains a heading whose text is "Table of Contents"
- **THEN** that heading is excluded from the section hierarchy, so the navigator never presents a contents section as a navigable section of the article

#### Scenario: Two sections share the same heading text
- **WHEN** an article repeats the same heading text in more than one place
- **THEN** each entry navigates to its own distinct section

### Requirement: Persistent access to navigation
The section navigator SHALL remain reachable at any scroll position within the article without the reader scrolling to find it, and MUST NOT permanently obscure article text at any viewport width. Where the viewport is too narrow to display the hierarchy alongside the article, the navigator MUST remain reachable through a persistent control that reveals it on demand.

#### Scenario: Reader has scrolled deep into a long article
- **WHEN** a reader has scrolled far past the top of a long article
- **THEN** the navigator is still reachable without scrolling back up

#### Scenario: Reader is not using the navigator
- **WHEN** the reader has not requested the section hierarchy
- **THEN** the full width of the article text remains readable and unobscured

#### Scenario: Reader is on a narrow viewport
- **WHEN** the viewport is too narrow to place the hierarchy beside the article
- **THEN** a persistent control remains visible that reveals the hierarchy on demand

#### Scenario: Reader navigates by keyboard
- **WHEN** a reader moves focus through the page using the keyboard
- **THEN** the navigator can be reached, revealed, filtered, and used to jump to a section without a pointing device

### Requirement: Section filtering
The section navigator SHALL provide a filter control at the top of the hierarchy that narrows the displayed sections to those matching the query of the reader. When a nested section matches, its ancestor sections MUST remain visible as context and MUST be visually distinguishable from actual matches. Matching MUST NOT be defeated by decorative leading characters in the heading text.

#### Scenario: Reader filters the hierarchy
- **WHEN** a reader types a query that matches some section titles
- **THEN** only matching sections and their ancestors are displayed

#### Scenario: Only a nested section matches
- **WHEN** the query matches a nested section but not its parent
- **THEN** the parent remains visible as non-navigable context and the nested match remains navigable

#### Scenario: Heading text begins with a decorative character
- **WHEN** the text of a heading begins with an emoji or other decorative character and the reader queries the words that follow it
- **THEN** that section is reported as a match

#### Scenario: No section matches
- **WHEN** the query matches no section title
- **THEN** the reader is told that nothing matched rather than being shown an empty panel

#### Scenario: Reader clears the query
- **WHEN** the reader clears the filter
- **THEN** the full section hierarchy is restored

### Requirement: Reading position indication
The section navigator SHALL indicate which section the reader is currently reading, and MUST keep that indication visible without the reader scrolling the navigator by hand.

#### Scenario: Reader scrolls through the article
- **WHEN** the reader scrolls from one section into the next
- **THEN** the indication of the current section updates to the section now being read

#### Scenario: Current section is outside the visible area of the navigator
- **WHEN** the entry for the current section falls outside the visible area of a hierarchy too long to display at once
- **THEN** the navigator brings that entry into view without moving the article

### Requirement: Reading progress indication
The section navigator SHALL indicate how far through the article the reader has progressed. The indication MUST remain accurate after the rendered height of the article changes, including after diagrams finish rendering.

#### Scenario: Reader progresses through the article
- **WHEN** the reader scrolls from the start of the article towards the end
- **THEN** the progress indication increases correspondingly and reaches completion at the end of the article

#### Scenario: Diagrams change the height of the article after load
- **WHEN** the diagrams of an article finish rendering and the article becomes substantially taller than it was at page load
- **THEN** the progress indication reflects the new height of the article rather than its height before rendering

### Requirement: Navigating to a section
Selecting a section in the navigator SHALL move the reader to that section with the heading of that section fully visible and not concealed behind fixed page chrome.

#### Scenario: Reader selects a section
- **WHEN** a reader selects a section from the navigator
- **THEN** the article moves to that section and the heading of that section is fully visible

#### Scenario: Reader selects a section from a filtered hierarchy
- **WHEN** a reader selects a matching section while a filter query is active
- **THEN** the article moves to that section and the heading of that section is fully visible

### Requirement: Theme consistency
The section navigator SHALL render legibly in every theme the site supports, using the semantic colour tokens of the site rather than fixed colour values.

#### Scenario: Reader switches theme
- **WHEN** a reader switches between the supported themes of the site while reading an article
- **THEN** the text, borders, and indicators of the navigator remain legible and consistent with the surrounding page in each theme
