import wordpressService from '@/lib/services/wordpressService';

// Force dynamic generation to ensure fresh data
export const dynamic = 'force-dynamic';

/**
 * Generate sitemap for all Hindi posts
 * Following Next.js 14+ sitemap best practices
 */
export async function GET() {
  try {
    // Fetch all Hindi posts with pagination
    const posts = await wordpressService.getAllPostsWithPagination('hindi');

    // Generate sitemap XML
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${posts.map(post => {
    const lastmod = post.modified || post.date;
    const priority = getPriority(post);
    const changefreq = getChangeFreq(post);
    
    return `
  <url>
    <loc>https://motorindia.in${post.link}</loc>
    <lastmod>${new Date(lastmod).toISOString()}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>${post.featuredImage.url ? `
    <image:image>
      <image:loc>${post.featuredImage.url}</image:loc>
      <image:title>${escapeXml(post.title)}</image:title>
      <image:caption>${escapeXml(post.featuredImage.alt || post.title)}</image:caption>
    </image:image>` : ''}${isRecentPost(post.date) ? `
    <news:news>
      <news:publication>
        <news:name>Motor India</news:name>
        <news:language>hi</news:language>
      </news:publication>
      <news:publication_date>${new Date(post.date).toISOString()}</news:publication_date>
      <news:title>${escapeXml(post.title)}</news:title>
    </news:news>` : ''}
  </url>`;
  }).join('')}
</urlset>`;

    return new Response(xmlContent, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        'X-Robots-Tag': 'index, follow'
      }
    });

  } catch (error) {
    console.error('Error generating Hindi posts sitemap:', error);
    
    // Return minimal sitemap on error
    const errorXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://motorindia.in/hindi</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`;

    return new Response(errorXml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=300, s-maxage=300' // Shorter cache on error
      }
    });
  }
}

/**
 * Determine priority based on post characteristics
 * @param {Object} post - Post object
 * @returns {string} Priority value
 */
function getPriority(post) {
  const daysSincePublished = (Date.now() - new Date(post.date).getTime()) / (1000 * 60 * 60 * 24);
  
  // Recent posts get higher priority
  if (daysSincePublished <= 7) return '0.9';
  if (daysSincePublished <= 30) return '0.8';
  if (daysSincePublished <= 90) return '0.7';
  
  // Featured posts or posts with many categories/tags get higher priority
  if (post.categories.length > 2 || post.tags.length > 3) return '0.7';
  
  return '0.6';
}

/**
 * Determine change frequency based on post age and type
 * @param {Object} post - Post object
 * @returns {string} Change frequency
 */
function getChangeFreq(post) {
  const daysSincePublished = (Date.now() - new Date(post.date).getTime()) / (1000 * 60 * 60 * 24);
  const daysSinceModified = (Date.now() - new Date(post.modified || post.date).getTime()) / (1000 * 60 * 60 * 24);
  
  // Recently published or modified posts
  if (daysSincePublished <= 7 || daysSinceModified <= 3) return 'daily';
  if (daysSincePublished <= 30 || daysSinceModified <= 14) return 'weekly';
  if (daysSincePublished <= 90) return 'monthly';
  
  return 'yearly';
}

/**
 * Check if post is recent enough for Google News sitemap
 * @param {string} dateString - Post publication date
 * @returns {boolean} True if recent (within 2 days)
 */
function isRecentPost(dateString) {
  const postDate = new Date(dateString);
  const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
  return postDate > twoDaysAgo;
}

/**
 * Escape XML special characters
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
function escapeXml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
