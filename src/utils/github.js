// GitHub API utility functions
const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_USERNAME = 'abudhahir';

/**
 * Fetch repositories from GitHub API
 * @param {number} limit - Number of repositories to fetch
 * @param {string} sort - Sort order (updated, created, pushed, full_name)
 * @returns {Promise<Array>} Array of repository objects
 */
export async function fetchGitHubRepos(limit = 20, sort = 'updated') {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?per_page=${limit}&sort=${sort}&direction=desc`
    );
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    const repos = await response.json();
    
    // Transform the data to match our project structure
    return repos
      .filter(repo => !repo.fork && !repo.archived) // Filter out forks and archived repos
      .map(repo => ({
        id: repo.id,
        name: repo.name,
        description: repo.description || 'No description available',
        tech: repo.topics || [],
        githubUrl: repo.html_url,
        liveUrl: repo.homepage || repo.html_url,
        featured: repo.stargazers_count > 0 || repo.description?.toLowerCase().includes('featured'),
        language: repo.language,
        updatedAt: repo.updated_at,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        isPrivate: repo.private,
      }));
  } catch (error) {
    console.error('Error fetching GitHub repositories:', error);
    return [];
  }
}

/**
 * Fetch a specific repository details
 * @param {string} repoName - Repository name
 * @returns {Promise<Object>} Repository details
 */
export async function fetchGitHubRepo(repoName) {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/repos/${GITHUB_USERNAME}/${repoName}`);
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    const repo = await response.json();
    
    return {
      id: repo.id,
      name: repo.name,
      description: repo.description || 'No description available',
      tech: repo.topics || [],
      githubUrl: repo.html_url,
      liveUrl: repo.homepage || repo.html_url,
      language: repo.language,
      updatedAt: repo.updated_at,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      isPrivate: repo.private,
    };
  } catch (error) {
    console.error(`Error fetching repository ${repoName}:`, error);
    return null;
  }
}

/**
 * Get language color based on GitHub's language colors
 * @param {string} language - Programming language
 * @returns {string} Hex color code
 */
export function getLanguageColor(language) {
  const colors = {
    'TypeScript': '#3178C6',
    'JavaScript': '#F7DF1E',
    'Python': '#3776AB',
    'Java': '#ED8B00',
    'Dart': '#0175C2',
    'HTML': '#E34F26',
    'CSS': '#1572B6',
    'Ruby': '#CC342D',
    'Go': '#00ADD8',
    'Rust': '#DEA584',
    'C++': '#F34B7D',
    'C#': '#239120',
    'PHP': '#777BB4',
    'Swift': '#FA7343',
    'Kotlin': '#A97BFF',
    'Vue': '#4FC08D',
    'React': '#61DAFB',
    'Angular': '#DD0031',
    'Node.js': '#339933',
    'Docker': '#2496ED',
    'Shell': '#89E051',
  };
  return colors[language] || '#6B7280';
}

/**
 * Format date for display
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format date for relative time (e.g., "2 months ago")
 * @param {string} dateString - ISO date string
 * @returns {string} Relative time
 */
export function formatRelativeTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}