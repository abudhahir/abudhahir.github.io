// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import { mermaidPlugin } from './src/utils/mermaid-plugin.js';

// https://astro.build/config
export default defineConfig({
  site: 'https://abudhahir.github.io',
  showProjects: false, // Custom flag to control Projects section visibility
  integrations: [
    react(),
    mdx(),
    tailwind({
      // Disable the default base styles since we're using custom ones
      applyBaseStyles: false,
    }),
  ],
  markdown: {
    remarkPlugins: [mermaidPlugin],
  },
  vite: {
    optimizeDeps: {
      include: ['framer-motion', 'mermaid'],
    },
  },
});
