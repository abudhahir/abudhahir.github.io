import { defineCollection, z } from 'astro:content';

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
  }),
  // Enable markdown processing
  markdown: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

export const collections = {
  blog,
};