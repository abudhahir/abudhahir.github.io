---
name: create-slides
description: Create a new slide presentation using the JSON-driven slide engine. Provide content and get a polished, dark-themed presentation with animations, keyboard navigation, and responsive layout.
---

# Create Slides Skill

Create new slide presentations by writing a **JSON data file** and rendering it with the `JsonSlideDeck` engine component. No JSX authoring is needed — the engine recursively maps JSON objects to pre-built React template primitives.

## Quick Start

To create a new presentation, you produce **two files**:

1. A JSON data file in `src/content/slides/` (e.g., `src/content/slides/my-topic-slides.json`)
2. A rendering host. You have **two options** for hosting:
   - **Option A: Integrated Blog Post (Recommended)**: Integrates the slides seamlessly into the blog index, RSS feed, and series listings as a content collection entry.
   - **Option B: Standalone Astro Page**: A dedicated page route under `src/pages/` (e.g., `src/pages/blog/my-topic.astro`).

---

## Step 1 — Set Up the Host

### Option A: Integrated Blog Post (Recommended)

To integrate slides into the blog system and content collections:

1. Create a markdown/MDX file under `src/content/blog/` (e.g., `src/content/blog/my-topic-slides.md`).
2. Add the following frontmatter, using `pageLayout: "slides"` and pointing `slidesData` to the JSON filename (without `.json` extension):

```markdown
---
title: "My Presentation Title"
date: "2026-06-16"
excerpt: "A brief description of this presentation."
tags: ["AI", "Slides"]
author: "Abudhahir"
pageLayout: "slides"
slidesData: "my-topic-slides"
series: "Optional Series Name"
---

Interactive slide deck for My Presentation.
```

The dynamic router `src/pages/blog/[...slug].astro` will automatically load your JSON data from `src/content/slides/my-topic-slides.json` and render the deck when this entry is visited.

### Option B: Standalone Astro Page

If you want a dedicated standalone route under `src/pages/` (e.g., `src/pages/blog/my-topic.astro`), copy this template exactly:

```astro
---
import SlideLayout from '../../layouts/SlideLayout.astro';
import JsonSlideDeck from '../../components/slides/JsonSlideDeck';
import slideData from '../../content/slides/my-topic-slides.json';
---

<SlideLayout title="My Presentation Title">
  <Fragment slot="head">
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
    <style is:inline>
      body {
        background: #0E1426 !important;
        color: #E8E9F2 !important;
        font-family: 'IBM Plex Sans', sans-serif !important;
        margin: 0 !important;
        padding: 0 !important;
        overflow: hidden !important;
      }
    </style>
  </Fragment>
  <JsonSlideDeck data={slideData} client:only="react" />
</SlideLayout>
```

---

## Step 2 — The JSON Data File

The JSON file is the **only thing you need to author**. It has this top-level shape:

```json
{
  "brand": "Company Name",
  "meterLabel": "OPTIONAL PROGRESS LABEL",
  "slides": [ ... ]
}
```

| Root key | Required | Description |
|----------|----------|-------------|
| `brand` | No | Text shown top-left with a diamond gem icon |
| `meterLabel` | No | Label above the bottom progress bar (defaults to `PROGRESS`) |
| `slides` | **Yes** | Array of slide objects |

---

## Step 3 — Writing Slides

Each entry in the `slides` array is an object with a `"type"` key. There are two root slide types:

### Title Slide (first slide of a deck)

```json
{
  "type": "TitleSlide",
  "tagText": "A FIELD GUIDE · 2026",
  "chipText": "ENTERPRISE",
  "title": "Main Title<br>Can Wrap",
  "subtitle": "Descriptive subtitle text.",
  "creditBold": "One pool. Every seat draws from it.",
  "creditMuted": "govern the pool, not the person",
  "hintContent": "<kbd>&rarr;</kbd> Space advance &middot; <kbd>O</kbd> overview &middot; <kbd>F</kbd> fullscreen"
}
```

All props except `type` are optional.

### Content Slide

```json
{
  "type": "Slide",
  "content": [
    { "type": "Eyebrow", "num": "01", "text": "Section Name" },
    { "type": "Headline", "html": "Title with <span class='hl'>amber</span> highlight" },
    { "type": "Lead", "html": "A subdued introductory paragraph." }
  ]
}
```

The `content` array holds **blocks** — each block is a JSON object with its own `"type"`. Blocks are rendered in order, top to bottom.

---

## Available Block Types

### Typography Blocks

| Type | Props | Description |
|------|-------|-------------|
| `Eyebrow` | `num`, `text` | Section label with number (e.g., `"01"`) and trailing line |
| `Headline` | `html` or children | Large display heading. Use `<span class='hl'>` for amber, `<span class='cool'>` for teal, `<span class='vio'>` for violet |
| `Lead` | `html` or children | Subdued paragraph below headline |
| `Code` | children | Inline styled code snippet |
| `Mono` | children | Monospace text span |

### Card Blocks

| Type | Props | Description |
|------|-------|-------------|
| `CardGrid` | `cols` (2\|3\|4), `content` | Grid container — put `SlideCard` objects inside `content` |
| `SlideCard` | `variant`, `title`, `label`, `labelType`, `tickLabel`, `content` | Styled card |

**SlideCard `variant`**: `""` (default), `"accent"` (amber border), `"good"` (teal), `"bad"` (coral), `"vio"` (violet)
**SlideCard `labelType`**: `"lbl-free"` (teal badge), `"lbl-paid"` (coral badge), `"lbl-adm"` (violet badge)
**SlideCard `content`**: A plain string for the card body paragraph.

Example:
```json
{
  "type": "CardGrid",
  "cols": 3,
  "content": [
    { "type": "SlideCard", "variant": "good", "title": "Wins", "content": "Description text" },
    { "type": "SlideCard", "variant": "bad", "title": "Risks", "label": "PAID", "labelType": "lbl-paid", "content": "Description" },
    { "type": "SlideCard", "variant": "vio", "title": "Admin", "content": "Description" }
  ]
}
```

### Data Blocks

| Type | Props | Description |
|------|-------|-------------|
| `StatRow` | `content` | Container — put `Stat` and optionally `Headline` objects inside |
| `Stat` | `value`, `color`, `label` | Large stat number. `color`: `"teal"`, `"amber"`, `"coral"`, `"vio"` |
| `DataTable` | `headers`, `rows` | Styled comparison table |
| `Spectrum` | `markers` | Gradient horizontal bar with positioned tier markers |
| `LadderChart` | `rungs` | Horizontal comparison bars |
| `PoolReservoir` | `level`, `label`, `pctText`, `draws` | Animated fill bar |

**StatRow example:**
```json
{
  "type": "StatRow",
  "content": [
    { "type": "Stat", "value": "780K", "color": "vio", "label": "SHARED CREDITS / MONTH" },
    { "type": "Headline", "html": "It's one reservoir,<br>not 200 <span class='cool'>cups.</span>", "style": { "maxWidth": "14ch" } }
  ]
}
```

**DataTable example:**
```json
{
  "type": "DataTable",
  "headers": [
    { "label": "Model" },
    { "label": "Tier" },
    { "label": "Cost" }
  ],
  "rows": [
    {
      "cells": [
        { "name": true, "dot": "d-teal", "value": "GPT-4o" },
        { "value": "Standard" },
        { "price": "lo", "value": "$0.003" }
      ]
    },
    {
      "highlight": true,
      "cells": [
        { "name": true, "dot": "d-coral", "value": "Claude Opus" },
        { "value": "Premium" },
        { "price": "hi", "value": "$0.06" }
      ]
    }
  ]
}
```

Cell props: `name` (bold), `mono` (monospace), `dot` (`"d-teal"`, `"d-amber"`, `"d-coral"`), `price` (`"lo"` teal, `"mid"` amber, `"hi"` coral), `value` (display text).

**Spectrum example:**
```json
{
  "type": "Spectrum",
  "markers": [
    { "position": "8%", "tier": "lo", "value": "$0.003", "name": "GPT-4o mini" },
    { "position": "52%", "tier": "mid", "value": "$0.01", "name": "GPT-4o" },
    { "position": "92%", "tier": "hi", "value": "$0.06", "name": "Claude Opus" }
  ]
}
```

**LadderChart example:**
```json
{
  "type": "LadderChart",
  "rungs": [
    { "label": "GPT-4o mini", "sublabel": "auto-complete", "width": "8%", "gradient": "var(--teal)", "cost": "1 credit" },
    { "label": "Claude Opus", "sublabel": "agent mode", "width": "100%", "gradient": "linear-gradient(90deg,var(--amber),var(--coral))", "cost": "20 credits" }
  ]
}
```

**PoolReservoir example:**
```json
{
  "type": "PoolReservoir",
  "level": "72%",
  "label": "Shared credit pool",
  "pctText": "~72% remaining",
  "draws": [
    { "text": "chat", "action": "draws" },
    { "text": "agent runs", "action": "draw" }
  ]
}
```

### List / Note Blocks

| Type | Props | Description |
|------|-------|-------------|
| `TickList` | `items` | Bulleted list with `›` markers. Items are HTML strings. |
| `NoteBlock` | `variant`, `html` or children | Callout box with colored left border |

**NoteBlock `variant`**: `""` (amber, default), `"danger"` (coral), `"good"` (teal), `"vio"` (violet)

Example:
```json
{ "type": "NoteBlock", "variant": "danger", "html": "<b>Warning:</b> Credits don't roll over." }
```

### Layout Blocks

| Type | Props | Description |
|------|-------|-------------|
| `NestedLayers` | `content` | Container for `Layer` blocks |
| `Layer` | `type`, `label`, `description`, `content` | Bordered nested box. `type`: `"l-ent"` (violet), `"l-cc"` (amber), `"l-ulb"` (coral), `"l-pool"` (teal) |
| `Stages` | `content` | Container for `StageCard` blocks |
| `StageCard` | `num`, `title`, `items` | Numbered phase card. `items` is an array of HTML strings. |
| `SplitColumns` | `content` | Two-column container for `SplitCol` blocks |
| `SplitCol` | `role`, `title`, `content` | One column. `role`: `"admin"` (violet) or `"dev"` (teal) |

**Stages example:**
```json
{
  "type": "Stages",
  "content": [
    { "type": "StageCard", "num": "PHASE 1", "title": "Pilot", "items": ["Select 20 devs", "Enable Copilot Chat"] },
    { "type": "StageCard", "num": "PHASE 2", "title": "Scale", "items": ["Expand to 100 devs", "Monitor usage"] },
    { "type": "StageCard", "num": "PHASE 3", "title": "Govern", "items": ["Set budget caps", "Review monthly"] }
  ]
}
```

---

## HTML Formatting in JSON Strings

Any property that accepts HTML (`html`, `title` on TitleSlide, `subtitle`, `hintContent`, `items` array entries) is **automatically sanitized by DOMPurify** before rendering. This means:

- ✅ `<span class='hl'>`, `<b>`, `<br>`, `<kbd>`, `<em>`, `<strong>` — all safe
- ✅ `&rarr;`, `&middot;`, `&mdash;` — HTML entities work
- ❌ `<script>`, `<iframe>`, `onclick=` — stripped automatically

Use these CSS classes inside `<span>` tags for colored text in `Headline`:
- `hl` — amber highlight
- `cool` — teal highlight
- `vio` — violet highlight

---

## Design System Reference

| Token | Hex | Usage |
|-------|-----|-------|
| `--ink` | `#0E1426` | Primary background |
| `--amber` | `#F5B43C` | Default highlight, numbers, notes |
| `--teal` | `#46D4B3` | Positive / free / good accents |
| `--coral` | `#FF6F5E` | Danger / warning / expensive accents |
| `--violet` | `#9B8CFF` | Enterprise / admin / special accents |

Fonts: **Space Grotesk** (display headings), **IBM Plex Sans** (body), **IBM Plex Mono** (mono/code).

---

## Recursion Depth

The engine supports up to **3 levels** of nesting:

1. `Slide` → `content` array
2. Inside content: `CardGrid` / `Stages` / `NestedLayers` / `SplitColumns` → `content` array
3. Inside those: `SlideCard` / `StageCard` / `Layer` / `SplitCol`

Do **not** nest deeper than this. A `SlideCard` cannot contain a `CardGrid`.

---

## Files

| File | Purpose |
|------|---------|
| `src/components/slides/JsonSlideDeck.jsx` | The recursive rendering engine |
| `src/components/slides/SlideStyles.jsx` | Scoped CSS design system |
| `src/components/slides/SlideTemplates.jsx` | All React template primitives |
| `src/components/slides/README.md` | User-facing documentation |
| `src/layouts/SlideLayout.astro` | Astro layout wrapper for presentations |
| `src/content/slides/test-presentation.json` | Reference JSON data (3 slides) |
| `src/content/blog/json-test.md` | Reference slug-based host entry (draft) |
