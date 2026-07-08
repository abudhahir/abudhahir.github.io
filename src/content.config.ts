import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    excerpt: z.string(),
    tags: z.array(z.string()),
    author: z.string(),
    featured: z.boolean().optional(),
    readTime: z.string().optional(),
    series: z.string().optional(),
    subtitle: z.string().optional(),
    draft: z.boolean().optional(),
    pageLayout: z.enum(['default', 'slides']).optional().default('default'),
    slidesData: z.string().optional(),
  }),
  // Enable markdown processing
  markdown: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

// Slide deck JSON data files consumed by the [...slug] router via import.meta.glob.
// Defined here so Astro does not auto-generate the collection.
const slides = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/slides' }),
});

export const collections = {
  blog,
  slides,
};