import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  type: 'content',
  schema: z
    .object({
      title: z.string().min(1),
      date: z.coerce.date(),
      excerpt: z.string().min(1),
      tags: z.array(z.string()),
      author: z.literal('Abu Dhahir'),
      featured: z.boolean().optional(),
      readTime: z.string().optional(),
      series: z.string().min(1).optional(),
      seriesOrder: z.number().int().positive().optional(),
      subtitle: z.string().optional(),
      draft: z.boolean(),
      pageLayout: z.enum(['default', 'slides']).optional().default('default'),
      slidesData: z.string().min(1).optional(),
    })
    .superRefine((entry, context) => {
      if (entry.series && entry.seriesOrder === undefined) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['seriesOrder'],
          message: 'Series entries require a positive integer seriesOrder.',
        });
      }

      if (!entry.series && entry.seriesOrder !== undefined) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['seriesOrder'],
          message: 'seriesOrder is only valid when series is set.',
        });
      }

      if (entry.pageLayout === 'slides' && !entry.slidesData) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['slidesData'],
          message: 'Slide entries require slidesData.',
        });
      }
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