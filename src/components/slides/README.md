# Slide Presentation System

A reusable, React-based presentation system integrated with Astro. This system provides a consistent dark-themed design language with pre-built slide layouts, typography primitives, and interactive elements.

## 🚀 Getting Started

To create a new presentation, you need two files:
1. A **React Component** for the slide deck (e.g., `src/components/MySlides.jsx`)
2. An **Astro Page** to host it (e.g., `src/pages/my-presentation.astro`)

### 1. The JSON Data Approach (Recommended)
We've built a powerful engine that can render an entire presentation from a simple JSON file.

1. **Create your JSON data file** (e.g., `src/data/my-presentation.json`):
```json
{
  "brand": "My Company",
  "slides": [
    {
      "type": "TitleSlide",
      "tagText": "Overview",
      "title": "My Presentation"
    },
    {
      "type": "Slide",
      "content": [
        { "type": "Eyebrow", "num": "01", "text": "Section One" },
        { "type": "Headline", "html": "Hello <span class='hl'>World</span>" }
      ]
    }
  ]
}
```
*(Note: HTML strings are automatically sanitized using DOMPurify to prevent XSS).*

2. **Render it in an Astro page**:
```astro
---
import SlideLayout from '../layouts/SlideLayout.astro';
import JsonSlideDeck from '../components/slides/JsonSlideDeck';
import myData from '../data/my-presentation.json';
---
<SlideLayout title="My JSON Presentation">
  <!-- (Include head slot with font links and body resets as shown below) -->
  <JsonSlideDeck data={myData} client:only="react" />
</SlideLayout>
```

### 2. The JSX Approach (Manual)

```jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import SlideStyles from './slides/SlideStyles';
import { Slide, TitleSlide, Eyebrow, Headline } from './slides/SlideTemplates';

export default function MySlides() {
  const [cur, setCur] = useState(0);
  const TOTAL = 3; // Number of slides

  // Navigation Logic
  const go = useCallback((i) => setCur(Math.max(0, Math.min(TOTAL - 1, i))), []);
  const next = useCallback(() => go(cur + 1), [cur, go]);
  const prev = useCallback(() => go(cur - 1), [cur, go]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (['ArrowRight', ' ', 'PageDown'].includes(e.key)) { next(); e.preventDefault(); }
      if (['ArrowLeft', 'PageUp'].includes(e.key)) { prev(); e.preventDefault(); }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [next, prev]);

  return (
    <div className="slide-deck" style={{ position: 'fixed', inset: 0 }}>
      {/* 1. Global Styles */}
      <SlideStyles />

      {/* 2. Slide Content */}
      <TitleSlide active={cur === 0} title="My Presentation" subtitle="A quick guide" />
      
      <Slide active={cur === 1}>
        <Eyebrow num="01" text="First Topic" />
        <Headline>Welcome to the <span className="hl">future</span></Headline>
      </Slide>

      {/* 3. Navigation UI (Optional) */}
      <div className="sd-counter">{cur + 1} / {TOTAL}</div>
    </div>
  );
}
```

### 2. Create the Astro Page

Ensure you use `client:only="react"` to properly hydrate the presentation on the client side.

```astro
---
import SlideLayout from '../layouts/SlideLayout.astro';
import MySlides from '../components/MySlides';
---

<SlideLayout title="My Presentation">
  <Fragment slot="head">
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
    <style is:inline>
      body {
        background: #0E1426 !important;
        color: #E8E9F2 !important;
        font-family: 'IBM Plex Sans', sans-serif !important;
        margin: 0 !important;
        overflow: hidden !important;
      }
    </style>
  </Fragment>
  
  <MySlides client:only="react" />
</SlideLayout>
```

---

## 🎨 Component Library (`SlideTemplates.jsx`)

All visual components are exported from `SlideTemplates.jsx`. They are designed to be composable.

### Layouts
- `<Slide active={boolean}>`: The base container for a standard slide. Automatically animates children on entry.
- `<TitleSlide>`: Specialized hero slide for the start of the deck.
  - *Props*: `title`, `subtitle`, `tagText` (top left), `chipText` (badge), `creditBold` (bottom box), `hintContent` (keyboard hints).

### Typography
- `<Eyebrow num="01" text="Section Name" />`: Small uppercase label usually placed at the top of a slide.
- `<Headline>`: Large display text. Can use `html` prop for inner HTML, or wrap children.
  - *Modifiers*: Wrap text in `<Hl>`, `<Cool>`, or `<Vio>` for amber, teal, or violet highlights.
- `<Lead>`: A subdued, slightly larger paragraph for introductory text.
- `<Mono>`: Monospaced text span.
- `<Code>`: Styled inline code snippet block.

### Grids & Cards
- `<CardGrid cols={2 | 3 | 4}>`: Responsive grid container for cards.
- `<SlideCard>`: A stylized box. 
  - *Props*: `title`, `variant` (`'good'` | `'bad'` | `'vio'` | `'accent'`), `label` (top right badge), `labelType` (`'lbl-free'` | `'lbl-paid'` | `'lbl-adm'`).

### Data Display
- `<StatRow>`: Container for large statistics and side headlines.
- `<Stat value="42" label="users" color="teal" />`: A massive number display.
- `<DataTable>`: A clean, dark-themed comparison table.
  - *Props*: `headers` array, `rows` array (supports highlights, pricing colors, and colored dots).
- `<LadderChart>`: Horizontal comparison bars (good for pricing/cost visualizations).
- `<Spectrum>`: Gradient horizontal bar with marked tiers (low/mid/high).
- `<PoolReservoir>`: Animated fill bar showing a percentage level.

### Special Layouts
- `<NoteBlock variant="vio">`: A callout box with a colored left border.
- `<TickList items={['Point 1', 'Point 2']} />`: A clean bulleted list with custom arrow markers.
- `<SplitColumns>` & `<SplitCol>`: Two-column layout perfect for cheat sheets or comparing two roles.
- `<NestedLayers>` & `<Layer>`: Visualization for nested architectures or budgets.
- `<Stages>` & `<StageCard>`: Numbered phase cards for step-by-step playbooks.

---

## ⌨️ Navigation Controls

The `JsonSlideDeck` engine has built-in navigation, so every presentation automatically supports:

| Input | Action |
|-------|--------|
| `Right Arrow`, `Space`, `PageDown` | Next slide |
| `Left Arrow`, `PageUp` | Previous slide |
| `Home`, `End` | First / Last slide |
| `O` key | Open Overview Grid (jump to any slide) |
| `F` key | Toggle Fullscreen |
| `Click / Tap` (Right 62% of screen) | Next slide |
| `Click / Tap` (Left 38% of screen) | Previous slide |
| `Swipe Left / Right` | Mobile touch navigation |

---

## 📝 Using in MDX (Blog Posts)

If you want to embed a presentation inside an `.mdx` blog post, you have two options.

### Option 1: Using an iframe (Recommended)
Since the slides have a custom dark theme and specific typography that might conflict with your blog's global styles (like Tailwind's `prose`), the safest and most robust way is to embed the standalone Astro page:

```mdx
# My Blog Post

Check out the presentation below:

<iframe 
  src="/blog/token-preservation/copilot-cost-playbook-slides/" 
  width="100%" 
  height="600px" 
  style={{ border: '1px solid #1E2947', borderRadius: '12px' }}
  allowFullScreen
/>
```

### Option 2: Direct Component Import
You can import the `JsonSlideDeck` engine directly and pass it a JSON data file. **Note:** You will need to modify the component's root `div` to use `position: 'relative'` instead of `position: 'fixed'`, and give it a set height so it fits within the article flow.

```mdx
import JsonSlideDeck from '../../components/slides/JsonSlideDeck';
import slideData from '../../data/my-topic-slides.json';

# My Blog Post

<div style={{ position: 'relative', height: '600px', borderRadius: '12px', overflow: 'hidden' }}>
  <JsonSlideDeck data={slideData} client:only="react" />
</div>
```
*(If you do this, make sure the engine's root `div` uses `absolute/relative` instead of `fixed` so it doesn't take over the whole screen).*

---

## 💡 AI Integration (Gemini Skill)

There is a Gemini Skill located at `.gemini/skills/create-slides/SKILL.md`. 
If you want to generate a new presentation quickly, simply ask Gemini: 
> *"Create a new slide presentation about [Topic] using the create-slides skill."*

The AI knows all the template primitives and will generate a fully functioning `React` component and `Astro` page for you.
