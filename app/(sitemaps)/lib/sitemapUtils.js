/**
 * Sitemap utilities for Motor India
 * Common functions used across different sitemap generators
 */

/**
 * Escape XML special characters
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
export function escapeXml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generate standard HTTP headers for XML sitemaps
 * @param {number} maxAge - Cache max age in seconds (default: 3600)
 * @returns {Object} Headers object
 */
export function getSitemapHeaders(maxAge = 3600) {
  return {
    'Content-Type': 'application/xml',
    'Cache-Control': `public, max-age=${maxAge}, s-maxage=${maxAge}`,
    'X-Robots-Tag': 'index, follow'
  };
}

/**
 * Generate error sitemap response
 * @param {string} fallbackUrl - Fallback URL to include in error sitemap
 * @param {string} priority - Priority for the fallback URL (default: '0.9')
 * @returns {Response} Error sitemap response
 */
export function generateErrorSitemap(fallbackUrl, priority = '0.9') {
  const errorXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${fallbackUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${priority}</priority>
  </url>
</urlset>`;

  return new Response(errorXml, {
    headers: getSitemapHeaders(300) // Shorter cache on error
  });
}

/**
 * Determine content priority based on various factors
 * @param {Object} content - Content object with date, categories, tags, etc.
 * @param {string} type - Content type ('post', 'category', 'tag')
 * @returns {string} Priority value
 */
export function calculatePriority(content, type = 'post') {
  switch (type) {
    case 'post':
      return calculatePostPriority(content);
    case 'category':
      return calculateCategoryPriority(content);
    case 'tag':
      return calculateTagPriority(content);
    default:
      return '0.5';
  }
}

/**
 * Calculate priority for posts
 * @param {Object} post - Post object
 * @returns {string} Priority value
 */
function calculatePostPriority(post) {
  const daysSincePublished = (Date.now() - new Date(post.date).getTime()) / (1000 * 60 * 60 * 24);
  
  // Recent posts get higher priority
  if (daysSincePublished <= 7) return '0.9';
  if (daysSincePublished <= 30) return '0.8';
  if (daysSincePublished <= 90) return '0.7';
  
  // Featured posts or posts with many categories/tags get higher priority
  if (post.categories?.length > 2 || post.tags?.length > 3) return '0.7';
  
  return '0.6';
}

/**
 * Calculate priority for categories
 * @param {Object} category - Category object
 * @returns {string} Priority value
 */
function calculateCategoryPriority(category) {
  if (category.count > 50) return '0.9';
  if (category.count > 20) return '0.8';
  if (category.count > 10) return '0.7';
  if (category.count > 5) return '0.6';
  return '0.5';
}

/**
 * Calculate priority for tags
 * @param {Object} tag - Tag object
 * @returns {string} Priority value
 */
function calculateTagPriority(tag) {
  if (tag.count > 30) return '0.8';
  if (tag.count > 15) return '0.7';
  if (tag.count > 8) return '0.6';
  if (tag.count > 3) return '0.5';
  return '0.4';
}

/**
 * Determine change frequency based on content characteristics
 * @param {Object} content - Content object
 * @param {string} type - Content type ('post', 'category', 'tag')
 * @returns {string} Change frequency
 */
export function calculateChangeFreq(content, type = 'post') {
  switch (type) {
    case 'post':
      return calculatePostChangeFreq(content);
    case 'category':
      return calculateCategoryChangeFreq(content);
    case 'tag':
      return calculateTagChangeFreq(content);
    default:
      return 'monthly';
  }
}

/**
 * Calculate change frequency for posts
 * @param {Object} post - Post object
 * @returns {string} Change frequency
 */
function calculatePostChangeFreq(post) {
  const daysSincePublished = (Date.now() - new Date(post.date).getTime()) / (1000 * 60 * 60 * 24);
  const daysSinceModified = (Date.now() - new Date(post.modified || post.date).getTime()) / (1000 * 60 * 60 * 24);
  
  // Recently published or modified posts
  if (daysSincePublished <= 7 || daysSinceModified <= 3) return 'daily';
  if (daysSincePublished <= 30 || daysSinceModified <= 14) return 'weekly';
  if (daysSincePublished <= 90) return 'monthly';
  
  return 'yearly';
}

/**
 * Calculate change frequency for categories
 * @param {Object} category - Category object
 * @returns {string} Change frequency
 */
function calculateCategoryChangeFreq(category) {
  if (category.count > 50) return 'daily';
  if (category.count > 20) return 'weekly';
  if (category.count > 5) return 'monthly';
  return 'yearly';
}

/**
 * Calculate change frequency for tags
 * @param {Object} tag - Tag object
 * @returns {string} Change frequency
 */
function calculateTagChangeFreq(tag) {
  if (tag.count > 30) return 'daily';
  if (tag.count > 15) return 'weekly';
  if (tag.count > 5) return 'monthly';
  return 'yearly';
}

/**
 * Check if post is recent enough for Google News sitemap
 * @param {string} dateString - Post publication date
 * @param {number} daysThreshold - Number of days threshold (default: 2)
 * @returns {boolean} True if recent
 */
export function isRecentPost(dateString, daysThreshold = 2) {
  const postDate = new Date(dateString);
  const thresholdDate = new Date(Date.now() - daysThreshold * 24 * 60 * 60 * 1000);
  return postDate > thresholdDate;
}

/**
 * Generate image sitemap entry for a post
 * @param {Object} post - Post object with featured image
 * @returns {string} Image sitemap XML or empty string
 */
export function generateImageSitemapEntry(post) {
  if (!post.featuredImage?.url) return '';
  
  return `
    <image:image>
      <image:loc>${post.featuredImage.url}</image:loc>
      <image:title>${escapeXml(post.title)}</image:title>
      <image:caption>${escapeXml(post.featuredImage.alt || post.title)}</image:caption>
    </image:image>`;
}

/**
 * Generate Google News sitemap entry for a post
 * @param {Object} post - Post object
 * @param {string} language - Language code ('en' or 'hi')
 * @returns {string} News sitemap XML or empty string
 */
export function generateNewsSitemapEntry(post, language = 'en') {
  if (!isRecentPost(post.date)) return '';
  
  return `
    <news:news>
      <news:publication>
        <news:name>Motor India</news:name>
        <news:language>${language}</news:language>
      </news:publication>
      <news:publication_date>${new Date(post.date).toISOString()}</news:publication_date>
      <news:title>${escapeXml(post.title)}</news:title>
    </news:news>`;
}

/**
 * Chunk array into smaller arrays
 * @param {Array} array - Array to chunk
 * @param {number} size - Chunk size
 * @returns {Array} Array of chunks
 */
export function chunkArray(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid
 */
export function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Generate robots meta tag for sitemaps
 * @param {boolean} index - Whether to index (default: true)
 * @param {boolean} follow - Whether to follow (default: true)
 * @returns {string} Robots meta tag value
 */
export function generateRobotsTag(index = true, follow = true) {
  const indexValue = index ? 'index' : 'noindex';
  const followValue = follow ? 'follow' : 'nofollow';
  return `${indexValue}, ${followValue}`;
}
