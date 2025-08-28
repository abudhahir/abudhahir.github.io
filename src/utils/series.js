import { getCollection } from 'astro:content';

/**
 * Get all blog posts grouped by series
 * @returns {Promise<Object>} Object with series names as keys and arrays of posts as values
 */
export async function getPostsBySeries() {
  const posts = await getCollection('blog');
  
  // Filter out draft posts and sort by date
  const publishedPosts = posts
    .filter(post => !post.data.draft)
    .sort((a, b) => new Date(b.data.date) - new Date(a.data.date));
  
  // Group posts by series
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
  
  // Sort posts within each series by date
  Object.keys(seriesGroups).forEach(series => {
    seriesGroups[series].sort((a, b) => new Date(a.data.date) - new Date(b.data.date));
  });
  
  return seriesGroups;
}

/**
 * Get posts for a specific series
 * @param {string} seriesName - Name of the series
 * @returns {Promise<Array>} Array of posts in the series
 */
export async function getPostsInSeries(seriesName) {
  const posts = await getCollection('blog');
  
  return posts
    .filter(post => post.data.series === seriesName && !post.data.draft)
    .sort((a, b) => new Date(a.data.date) - new Date(b.data.date));
}

/**
 * Get all unique series names
 * @returns {Promise<Array>} Array of series names
 */
export async function getAllSeries() {
  const posts = await getCollection('blog');
  
  const series = new Set();
  posts.forEach(post => {
    if (post.data.series && !post.data.draft) {
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
    latestPost: posts[posts.length - 1], // Most recent post
    firstPost: posts[0], // First post in series
  }));
}


