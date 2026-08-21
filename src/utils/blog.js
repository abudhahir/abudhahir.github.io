import { getCollection } from 'astro:content';

export function isPublishedEntry(entry) {
  return entry.data.draft === false;
}

export function sortByPublicationDate(posts) {
  return [...posts].sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
}

export function sortBySeriesOrder(posts) {
  return [...posts].sort(
    (a, b) => a.data.seriesOrder - b.data.seriesOrder,
  );
}

export function assertValidSeriesPositions(posts) {
  const positionsBySeries = new Map();

  for (const post of posts) {
    if (!post.data.series) continue;

    const positions = positionsBySeries.get(post.data.series) ?? new Map();
    const existing = positions.get(post.data.seriesOrder);
    if (existing) {
      throw new Error(
        `Duplicate seriesOrder ${post.data.seriesOrder} in "${post.data.series}": ${existing.slug} and ${post.slug}`,
      );
    }

    positions.set(post.data.seriesOrder, post);
    positionsBySeries.set(post.data.series, positions);
  }
}

export async function getPublishedBlogEntries() {
  const posts = (await getCollection('blog')).filter(isPublishedEntry);
  assertValidSeriesPositions(posts);
  return posts;
}
