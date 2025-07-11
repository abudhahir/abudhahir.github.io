# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is an Astro-based portfolio website with React components for interactivity, styled with Tailwind CSS. The project uses a dark/light theme system and features smooth animations.

## Common Development Commands

```bash
# Install dependencies
npm install

# Start development server (hot reload enabled)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run Astro CLI commands
npm run astro -- <command>
```

## Architecture and Structure

### Technology Stack
- **Astro v5.11.0** - Static site generator with island architecture
- **React v19.1.0** - Interactive components (selective hydration)
- **TypeScript** - Type safety with strict configuration
- **Tailwind CSS v3.4.17** - Utility-first styling
- **Framer Motion v12.23.3** - Component animations

### Key Architectural Patterns

1. **Astro Islands Architecture**
   - Static HTML generation by default
   - React components hydrate only where needed (`client:load` directive)
   - Optimal performance with selective JavaScript

2. **Component Strategy**
   - `.astro` files: Layout, structure, and static content
   - `.jsx` files: Interactive components requiring client-side JavaScript
   - Clear separation between static and dynamic content

3. **Theme System**
   - Dark/light mode toggle with localStorage persistence
   - CSS variables defined in Tailwind config
   - Theme-aware color palette with semantic naming

### Project Structure

```
src/
├── pages/index.astro      # Main portfolio page
├── components/
│   ├── Header.jsx         # Navigation with smooth scroll
│   ├── Hero.jsx           # Terminal-style hero section
│   ├── About.jsx          # About section with skills grid
│   ├── Experience.jsx     # Work experience timeline
│   ├── Projects.jsx       # Project showcase with filters
│   ├── Contact.jsx        # Contact form and social links
│   └── ThemeToggle.jsx    # Theme switcher with persistence
└── styles/global.css      # Tailwind imports and custom styles
```

### Tailwind Configuration

The project extends Tailwind with custom theme values:
- Custom color palette with dark/light mode support
- Fira Code monospace font
- Semantic color naming (background, foreground, card, accent, etc.)

### Configuration Options

The portfolio supports configuration through environment variables. Create a `.env` file (copy from `.env.example`):

```bash
# Feature Toggles
PUBLIC_SHOW_EXPERIENCE=false  # Set to true to show Experience section
PUBLIC_SHOW_CONTACT_FORM=true # Set to false to hide contact form
```

### Development Notes

- Modern developer portfolio with terminal-inspired design
- Dark theme by default with light mode toggle
- Smooth scroll navigation and section-based layout
- React components use `client:load` for immediate hydration
- All styling uses Tailwind utilities with custom design system
- Theme colors accessed via CSS custom properties (e.g., `bg-background`, `text-foreground`)
- Framer Motion for smooth animations and transitions
- Components are fully responsive with mobile-first design
- Project data sourced from actual GitHub repositories
- About section reflects real expertise in enterprise Java + AI integration
- Skills grid matches actual technology stack used

### Key Features

- **Terminal-style hero section** with typing animation
- **Skills grid** in About section with hover effects
- **Experience timeline** with company details and achievements
- **Project showcase** with filtering and clickable cards linking to GitHub
- **Contact form** with social media links
- **Theme persistence** using localStorage
- **Smooth animations** throughout the site