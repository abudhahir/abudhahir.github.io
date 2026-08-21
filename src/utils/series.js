import {
  getPublishedBlogEntries,
  sortByPublicationDate,
  sortBySeriesOrder,
} from './blog.js';

/**
 * Get all blog posts grouped by series
 * @returns {Promise<Object>} Object with series names as keys and arrays of posts as values
 */
export async function getPostsBySeries() {
  const publishedPosts = await getPublishedBlogEntries();
  const seriesGroups = {};

  publishedPosts.forEach(post => {
    const series = post.data.series;
    if (series) {
      if (!seriesGroups[series]) {
        seriesGroups[series] = [];
      }
      seriesGroups[series].push(post);
    }
  });

  Object.keys(seriesGroups).forEach(series => {
    seriesGroups[series] = sortBySeriesOrder(seriesGroups[series]);
  });

  return seriesGroups;
}

/**
 * Get posts for a specific series
 * @param {string} seriesName - Name of the series
 * @returns {Promise<Array>} Array of posts in the series
 */
export async function getPostsInSeries(seriesName) {
  const posts = await getPublishedBlogEntries();
  return sortBySeriesOrder(
    posts.filter(post => post.data.series === seriesName),
  );
}

/**
 * Get all unique series names
 * @returns {Promise<Array>} Array of series names
 */
export async function getAllSeries() {
  const posts = await getPublishedBlogEntries();
  const series = new Set();
  posts.forEach(post => {
    if (post.data.series) {
      series.add(post.data.series);
    }
  });

  return Array.from(series).sort();
}

/**
 * Get series information with post counts
 * @returns {Promise<Array>} Array of series objects with name and post count
 */
export async function getSeriesInfo() {
  const seriesGroups = await getPostsBySeries();

  return Object.entries(seriesGroups).map(([name, posts]) => ({
    name,
    count: posts.length,
    latestPost: sortByPublicationDate(posts)[0],
    firstPost: posts[0],
  }));
}


const PART_PREFIX_PATTERN = /^Part\s+(\d+)\s*[:–—-]/i;

/**
 * True when a title already carries its own "Part N:" prefix.
 * @param {string} title
 * @returns {boolean}
 */
export function titleCarriesPartLabel(title) {
  return PART_PREFIX_PATTERN.test(title);
}

/**
 * Display label for a series member. Prefers the number the title already
 * declares so 0-indexed series (LGTM starts at Part 0) label correctly, and
 * falls back to the schema's 1-based seriesOrder when the title has no prefix.
 * @param {Object} post
 * @returns {string}
 */
export function getSeriesPartLabel(post) {
  const match = PART_PREFIX_PATTERN.exec(post.data.title);
  return `Part ${match ? match[1] : post.data.seriesOrder}`;
}
