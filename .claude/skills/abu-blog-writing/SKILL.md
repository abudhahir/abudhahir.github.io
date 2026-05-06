---
name: abu-blog-writing
description: Use when drafting, revising, or researching a blog post for abudhahir.github.io - covers Java, Spring Boot, coding agents (Claude Code, agentic AI, RAG, MCP), context/prompt engineering, and developer tooling customisations. Enforces this site's frontmatter schema, author voice, British spelling, and structural conventions. Skip for unrelated content or marketing copy.
---

# Abu Dhahir's Blog Writing Skill

This skill captures the voice and conventions of `src/content/blog/` on this Astro site. Apply it whenever drafting a new post or revising an existing one. The corpus that grounds these rules: `context-engineering/`, `part-1-Agentic-AI-foundations/`, `prompt-engineering/`, `06-lgtm-stack/lgtm-tutorial/`, and `10-openapi.generators/`.

## When to Use

- Drafting a post about Java/Spring Boot, coding agents, agentic AI, prompt or context engineering, MCP, RAG, observability, or developer-tool customisation.
- Revising a post that drifts from the established voice.
- Researching a topic to add to the existing series (`Agentic AI Foundations`, `Context Engineering Mastery`, `Prompt Engineering Mastery`, `Building a Spring Boot Starter for LGTM`, `OpenAPI Generators for Spring Boot 4`).

**Skip when:** writing the homepage, project descriptions, README, or any non-blog content.

## Frontmatter - Required Schema

The schema is enforced by `src/content.config.ts`. Validate every draft against this template before finishing:

```yaml
---
title: "Specific, descriptive, Title Case - no clickbait"
subtitle: "Tactical reframing or scope qualifier"   # optional but used in tutorial-style posts
excerpt: "One dense sentence stating what the reader will be able to do or understand."
date: 2025-09-03                                    # ISO unquoted, OR "Sep 03 2025" quoted
author: "Abu Dhahir"                                # exact, with space
tags: ["Spring Boot", "Loki", "Observability"]      # see tag conventions below
series: "Building a Spring Boot Starter for LGTM"   # optional, only if part of a series
draft: false                                        # always set explicitly
---
```

**Hard rules:**
- `author` is `"Abu Dhahir"` (with space). Never `"Abudhahir"`, `"Abu"`, or `"abudhahir"`.
- Field names are `date` and `excerpt` - not `pubDate`, `published`, `description`, or `summary`.
- `draft: false` appears on every published post. Set it explicitly.
- For multi-part posts, set `series:` and prefix the title with `Part N:` (e.g., `"Part 1: Loki Integration for Centralized Logging"`).
- **Never invent a series name.** Use only series that already exist in the corpus, or omit the field. Existing series: `"Agentic AI Foundations"`, `"Context Engineering Mastery"`, `"Prompt Engineering Mastery"`, `"Building a Spring Boot Starter for LGTM"`, `"OpenAPI Generators for Spring Boot 4"`. To start a new series, ask the user first.
- Optional fields not used on newer posts: `featured`, `readTime`. Don't add them unless asked.

**Tag conventions:**
- Technologies and frameworks: Title Case - `"Spring Boot"`, `"Loki"`, `"OpenAPI"`, `"Java"`, `"TypeScript"`.
- Conceptual domains: lowercase phrases - `"context engineering"`, `"prompt engineering"`, `"agentic AI"`, `"AI foundations"`, `"machine learning"`.
- Acronyms stay capitalised: `"LLM"`, `"AI"`, `"RAG"`, `"MCP"`, `"CDSS"`.
- Never use kebab-case (`"spring-boot"`, `"ai-agents"`) - that is not the project's convention.

## Voice Rules

### Spelling: British English

Use British spellings throughout. The corpus is consistent on this:

| Use | Don't use |
|---|---|
| optimise, optimising | optimize, optimizing |
| prioritise, prioritising | prioritize, prioritizing |
| centre | center |
| behaviour | behavior |
| utilisation | utilization |
| organisation | organization |
| analyse | analyze |
| summarise | summarize |

Code, library names, and quoted text keep their original spelling (`@CenterAlign`, `tokenize()`).

### Opening: Name the Problem, No Preamble

Open by naming what is broken or under-specified in current practice. No "In this post we will…", no "If you've spent any time with X…", no "Welcome to…". The first sentence states a fact about the world that the post will resolve.

**Examples from the corpus:**
- *"The fundamental architecture of the World Wide Web was designed for human consumption."*
- *"As Large Language Models are increasingly deployed as autonomous coding agents within enterprise environments, one approach has proven repeatedly ineffective: dumping entire codebases into a prompt."*
- *"In Spring Boot 4.x and Java 21, OpenAPI source code generation follows a 'Contract-First' approach…"*

The second paragraph names symptoms (token burn, latency, hallucinations). The third introduces the resolving concept in **bold first-mention**.

### Person and Pronoun

- Default to impersonal or second-person (`you`, `your team`, `the agent`).
- Use first-person plural (`we`) for shared workflow framing - sparingly.
- Avoid heavy `I will cover…` / `I have settled on…`. State the thing directly.

### Subheadings: Descriptive Noun Phrases

Subheadings name the *thing being discussed*, not the *act of discussing it*. Prefer:
- `## The Anatomical Structure and Markdown Schema`
- `## Strategic Deployment: llms.txt vs llms-full.txt`
- `## Layer 1 - The Root Index`

Avoid:
- `## Be Specific or Be Useless` (listicle voice)
- `## Why Subagents?` (generic reach-around)
- `## Let's Get Started` (filler)

## Structural Template

```markdown
[H1 already in frontmatter title - do not repeat as #]

[1–3 paragraph hook: name the problem, list the symptoms, introduce the resolving concept in **bold**.]

---

## First Substantive Section (descriptive noun phrase)

[Substance: code, table, or worked example. Bold the first mention of any term of art.]

> **Why this matters:** Callout for the non-obvious - conditions, trade-offs, or pitfalls.

---

## Second Section

[More substance. Use a comparison table for any "X vs Y" content.]

| Feature | Option A | Option B |
| --- | --- | --- |
| ... | ... | ... |

---

## Section with Bad/Good Examples

\`\`\`language
# Bad
[example showing the wrong way]
\`\`\`

\`\`\`language
# Good
[example showing the right way, ideally with inline annotations]
\`\`\`

---

## Closing Section

[End on a strong technical statement, a deployment checklist, or the next step in a series. NOT on meta-reflection ("Closing Thought", "Final Words"). NOT on a marketing footer.]
```

### Section dividers

Place a horizontal rule (`---`) between every major section. The corpus uses these consistently to give the post a scannable rhythm.

### Tutorial posts (parts in a series)

Tutorial-style posts add a Table of Contents below the H1:

```markdown
## Table of Contents
1. [Understanding X](#understanding-x)
2. [Integration Strategy](#integration-strategy)
3. [Implementation](#implementation)

---
```

## Code Conventions

- Always tag the language: ` ```java`, ` ```yaml`, ` ```bash`, ` ```typescript`.
- Inline annotations in code use `// HIGH SIGNAL` or `<!-- comment -->` to flag the part being made.
- Show real file paths and module/package names that match the conventions on this site (e.g., `com.yourorg.lgtm.autoconfigure`, `src/content/blog/...`).
- For Java: include version-specific details (Spring Boot 4.x, Jakarta EE 11, Jackson 3, Java 21 records). Generic Java 8 examples are off-tone.
- For Claude Code / coding agents: name the actual primitives - `.claude/agents/`, `.claude/settings.json`, `Skill` tool, `client:load` directives - not vague "the AI tool".

## Callouts

Use blockquote callouts for non-obvious points. Two patterns:

```markdown
> **Caution:** Serving a document exceeding 100,000 tokens degrades retrieval accuracy - a phenomenon known as the **"lost in the middle" problem**.

> **Why link descriptions matter:** Rather than writing "API Reference", an optimised description reads: *"Complete REST API reference including endpoint schemas…"* - this lets agents make precise retrieval decisions.
```

The bolded lead label is mandatory: `**Caution:**`, `**Why X matters:**`, `**Note:**`, `**Trade-off:**`.

## Validation Checklists

Use checkmark/cross prefixes for requirements lists. The corpus uses these for deployment validation, characteristic checklists, and good/bad pattern lists.

```markdown
**Validation checklist:**
- Served from root directory
- Content-Type: text/plain or text/markdown
- No CDN-induced redirects or navigation injection
```

(Render with the same ✅/❌ markers used in `context-engineering/part-1-Standardizing_Machine_Readable_Web_Context.md`.)

## Research Workflow (when topic is not yet drafted)

The corpus is dense with version-specific facts (Spring Boot 4.x flags, Jackson 3 namespaces, Claude Code primitives). Training-data recollection drifts. Use the MCP servers below - in this order - before drafting prose.

### Step 1 - Search the corpus first

Grep `src/content/blog/` for the topic and adjacent terms. If a series exists (e.g., Context Engineering Mastery), the new post should slot into it via the `series:` field. Never duplicate ground already covered by an existing post; cross-link instead.

### Step 2 - Fetch authoritative library and framework docs (Context7 MCP)

For any library, framework, or API named in the post, use the Context7 MCP **before** writing version-specific claims. Training data is months stale on Spring Boot 4, Astro 5+, Claude API, OpenAPI Generator, etc. - Context7 is current.

```
mcp__plugin_everything-claude-code_context7__resolve-library-id  → find library ID
mcp__plugin_everything-claude-code_context7__query-docs          → fetch up-to-date docs
```

Or invoke the wrapper skill: `Skill(everything-claude-code:documentation-lookup)`.

**When to use:** any time the post will state "in version X, configure flag Y" or show a code snippet that depends on current API.

### Step 3 - Web search for primary sources

For RFCs, vendor announcements, benchmark posts, and emerging-protocol documentation (e.g., `llms.txt`, MCP, A2A), search the open web. Multiple providers may be installed in the environment; pick the one best suited to the query and fall back to the next if it returns thin results.

| Provider | Strength | Typical tool prefix |
|---|---|---|
| **Exa** | Neural / semantic search; finds conceptual matches | `mcp__*_exa__web_search_exa`, `mcp__*_exa__web_fetch_exa` |
| **Brave Search** | Independent index; good for vendor sites and recent news | `mcp__*_brave-search__*` |
| **Tavily** | Research-optimised; returns synthesised summaries with sources | `mcp__*_tavily__*` |
| **Firecrawl** | Site-wide crawl; extracts clean Markdown from documentation portals | `mcp__*_firecrawl__*` |
| **Scientific Papers** | arXiv / academic indices; for research-backed AI/ML claims | `mcp__*_scientific-papers__*` (or similar arxiv MCP) |

**Selection rule:**
- Concept or pattern lookup → **Exa** first.
- Vendor announcement, recent news, blog post → **Brave** first.
- Multi-source synthesis on a question → **Tavily** first.
- Need clean Markdown from a docs site → **Firecrawl**.
- Claim depends on a specific paper, benchmark, or empirical finding → **Scientific Papers** before Exa.

**Graceful degradation:** these MCPs are optional. If a provider is not installed, skip it silently - do not announce missing tooling, and do not re-derive the answer from training data. Always use **at least one** web-search provider for any claim about external standards, libraries, or empirical results. If none are installed, ask the user before stating the claim.

**When to use:** the post references a standard, protocol, vendor announcement, benchmark, or research finding. Cite the primary source, not the training-data summary.

### Step 4 - Reference real OSS code (GitHub MCP)

When the post discusses a real project (e.g., `loki4j/loki-logback-appender`, `openapi-generator`, `langchain-ai/langgraph`), pull actual file content or issues from GitHub instead of paraphrasing:

```
mcp__plugin_everything-claude-code_github__get_file_contents   → exact code from a repo
mcp__plugin_everything-claude-code_github__search_code         → find usage patterns
mcp__plugin_everything-claude-code_github__list_issues         → real bug reports / RFCs
```

**When to use:** the post claims "library X handles case Y this way" - verify by reading the source.

### Step 5 - Structure complex multi-part outlines (Sequential Thinking MCP)

For tutorial parts that need to decompose a workflow into sequenced steps (e.g., "Building a Spring Boot Starter for LGTM"), use the sequential-thinking MCP to draft the section spine before prose:

```
mcp__plugin_everything-claude-code_sequential-thinking__sequentialthinking
```

**When to use:** the post has more than five sections, or the section order is non-obvious.

### Step 6 - Parallel research fan-out (preferred for new posts)

For any post that is not a quick revision, **dispatch research subagents in parallel** rather than running every MCP call sequentially. Each subagent owns one research lane, returns a structured finding, and the main agent synthesises the post from the combined output.

**Standard fan-out for a technical post:**

| Lane | Agent type | Mandate | Tools |
|---|---|---|---|
| **Corpus** | `Explore` | Find every prior post on this topic; list overlap and gaps; identify the right `series:` if any | Read, Grep, Glob |
| **Library docs** | `general-purpose` | Pull current API / config / version-pinned facts for every library named in the brief | Context7 MCP |
| **Primary sources** | `general-purpose` | Surface RFCs, vendor announcements, primary-source blog posts | Exa / Brave / Tavily MCPs (whichever are installed) |
| **OSS code** | `general-purpose` | Pull real code, issues, and PRs from named repos to verify claims | GitHub MCP |
| **Site crawl** *(optional)* | `general-purpose` | Extract clean Markdown from a specific docs portal | Firecrawl MCP |
| **Research papers** *(optional, AI/ML topics)* | `general-purpose` | Find the canonical paper for a benchmark, finding, or technique | Scientific Papers MCP |

**Dispatch in a single message** with multiple `Agent` tool calls so they run concurrently. Each subagent prompt must:

- State the post's topic and the lane's specific mandate (one or two sentences).
- Specify the exact tool(s) the subagent should use (so it does not fan out further into unrelated MCPs).
- Demand a structured return: bullet findings, each with a source URL, library ID, file path, or repo reference.
- Cap output length (≤ 400 words) so the main context absorbs the synthesis cleanly.

**Synthesis discipline:**

- Wait for all lanes to return before drafting prose. Partial synthesis tends to over-weight whichever lane finished first.
- Reconcile contradictions explicitly. If Context7 says one thing and a vendor blog says another, name the discrepancy in the post or pick the primary source (usually the vendor's own docs).
- Drop lanes that returned nothing. Do not pad the post with weak material.
- The post itself does not list sources; the research trail stays in your working notes. Only inline-link a source when the post explicitly asks the reader to follow it (e.g., a tutorial pointing to a quickstart guide).

**Anti-patterns:**

- Running all MCP calls in the main agent's context - burns the context window with raw tool output.
- Spawning subagents one at a time - defeats the latency win of parallelism.
- Skipping the corpus lane - produces posts that duplicate or contradict existing work on the site.

### Step 7 - Build an outline, not a body

Outline first as a list of subheadings (descriptive noun phrases), then a one-line claim per section, then prose. This keeps the post structurally sound before the voice work starts.

### Step 8 - Pull a real example into every section

Code, config, table, or comparison - the corpus carries weight through concrete artefacts, not abstract description. Every example must be traceable to one of the sources surfaced in Steps 2–6.

### MCP usage discipline

- **Do not invoke an MCP server speculatively.** Each call costs context and tokens. Decide what you need before calling.
- **Capture the source URL or library ID inline** in your draft notes. The post itself does not need a bibliography, but the research trail prevents the author from later asking "where did this number come from".
- **Prefer Context7 over Exa for library/framework docs** - Context7 is curated and version-aware; Exa is broader but noisier.
- **Skip MCPs when the topic is purely opinion or workflow** (e.g., "how I structure my Claude Code sessions"). The corpus's strongest posts are technical - pure-opinion posts are rare and should still ground claims with at least one concrete artefact from this repo.

## Length and Density

- Conceptual / overview posts: 1500–2500 words.
- Tutorial parts in a series: 2000–4000+ words with full code listings.
- Short technical notes (like the OpenAPI generators post): 800–1200 words but very dense - version numbers, plugin flags, and exact config snippets in every section.

## Common Mistakes

| Mistake | Fix |
|---|---|
| Using `pubDate`, `description`, `summary` | Use `date`, `excerpt` per `src/content.config.ts` |
| `author: "Abudhahir"` or `"Abu"` | `author: "Abu Dhahir"` |
| kebab-case tags (`"spring-boot"`) | Title Case for tech, lowercase phrases for domains |
| American spelling | Convert to British (see table above) |
| "In this post, I'll cover…" | Open by naming the problem in the world |
| Listicle subheadings ("Why X Matters", "Let's Begin") | Descriptive noun phrases |
| Heavy `I` voice | `you` / `we` / impersonal |
| No `---` section dividers | One between every major section |
| No callout blockquotes | At least one `> **Label:**` per major section where there is a non-obvious point |
| Marketing footer ("Connect on LinkedIn") | Strong technical close - checklist, next step, or a direct claim |
| Forgetting `draft: false` | Always set explicitly |
| Generic Java examples | Pin to versions: Spring Boot 4.x, Jakarta EE 11, Java 21 records, etc. |
| Vague "the AI tool" / "the agent framework" | Name the primitive: `.claude/agents/`, MCP server, `client:load` |
| Inventing a `series:` value | Use an existing series from the corpus, or omit the field |

## Red Flags - Stop and Revise

- Frontmatter has any field not in the schema → schema validation will fail at build.
- Author is anything other than `"Abu Dhahir"` → wrong attribution.
- The first sentence starts with "In this post" / "Welcome to" / "If you've ever" → rewrite the opener.
- Subheadings sound like blog titles for separate posts → collapse to noun phrases.
- No code or table for two consecutive sections → the post is too abstract for the corpus.
- Closing with a personal reflection or LinkedIn link → replace with technical close.

## Verification Before Publishing

Before saving the file:

1. Run `npm run build` (or check that the dev server reloads cleanly) - schema violations will surface here.
2. Confirm the file lives under `src/content/blog/` (or an appropriate sub-directory if part of a multi-asset series).
3. Spot-check spelling against the British/American table above.
4. Confirm every major section has a callout, code block, or table.
