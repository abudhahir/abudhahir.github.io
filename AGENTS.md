# Repository Guidelines

## Project Structure & Module Organization
- `src/pages/`: Astro routes (e.g., `index.astro`, `blog/*`).
- `src/components/`: React UI components in PascalCase (e.g., `Header.jsx`).
- `src/content/blog/`: Markdown posts; schema via `src/content.config.ts`.
- `src/layouts/`, `src/styles/`, `src/utils/`, `src/data/`: Layouts, Tailwind styles, helpers, and metadata (e.g., `socialLinks.js`).
- `public/`: Static assets copied as‑is. `dist/`: production build output.

## Build, Test, and Development Commands
- `npm install`: Install dependencies.
- `npm run dev`: Start dev server at `http://localhost:4321` with HMR.
- `npm run build`: Generate static site into `dist/`.
- `npm run preview`: Serve the production build locally.
- `npm run astro`: Access Astro CLI (advanced tasks).

## Coding Style & Naming Conventions
- Indentation: 2 spaces; use ES modules and modern JS/TS.
- Components: PascalCase React files (e.g., `About.jsx`, `ThemeToggle.jsx`).
- Routes/Pages: lower‑case filenames reflecting URLs (e.g., `blog/index.astro`).
- Content: kebab‑case posts (e.g., `my-new-post.md`) with frontmatter: `title`, `date`, `excerpt`, `tags`, `author`.
- Styling: Tailwind utility classes; group semantically and avoid inline styles.
- Config changes: update `astro.config.mjs`, `tailwind.config.cjs`, and `.env.example` accordingly.

## Testing Guidelines
- No formal test runner. Validate by:
  - `npm run dev` and navigate home, blog list, post, and series pages.
  - Ensure frontmatter passes Zod schema in `src/content.config.ts` (build fails on invalid posts).
  - Check browser console for errors and run Lighthouse for perf/regressions.

## Commit & Pull Request Guidelines
- Commits: concise, imperative summaries. Example: "Add series pages and blog index tweaks".
- PRs should include:
  - Clear description and scope; link issues (e.g., `Fixes #123`).
  - Screenshots/GIFs for UI changes.
  - Notes for config/env updates (and `.env.example` changes).
  - Confirmation that `npm run build` succeeds and blog listing still works.

## Security & Configuration Tips
- Do not commit `.env`. Copy from `.env.example`; only `PUBLIC_*` vars are exposed client‑side.
- Validate external links in `src/data/socialLinks.js`.
- Sanitize external embeds and verify code blocks in posts.

