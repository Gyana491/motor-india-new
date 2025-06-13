import wordpressService from '@/lib/services/wordpressService';
import { 
  escapeXml, 
  getSitemapHeaders, 
  generateErrorSitemap, 
  calculatePriority,
  calculateChangeFreq,
  generateImageSitemapEntry,
  generateNewsSitemapEntry,
  isRecentPost
} from '../../lib/sitemapUtils';

// Force dynamic generation with real-time data updates
export const dynamic = 'force-dynamic';
export const revalidate = 0; // No caching - always fresh data

/**
 * Generate sitemap for all English articles/posts
 * Following Next.js 14+ sitemap best practices
 */
export async function GET() {
  try {
    // Fetch all English posts with pagination
    const posts = await wordpressService.getAllPostsWithPagination('posts');

    // Generate sitemap XML
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${posts.map(post => {
    const lastmod = post.modified || post.date;
    const priority = calculatePriority(post, 'post');
    const changefreq = calculateChangeFreq(post, 'post');
    
    return `
  <url>
    <loc>https://motorindia.in${post.link}</loc>
    <lastmod>${new Date(lastmod).toISOString()}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>${generateImageSitemapEntry(post)}${generateNewsSitemapEntry(post, 'en')}
  </url>`;
  }).join('')}
</urlset>`;

    return new Response(xmlContent, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'X-Robots-Tag': 'index, follow'
      }
    });

  } catch (error) {
    console.error('Error generating articles sitemap:', error);
    
    // Return error sitemap using utility function
    return generateErrorSitemap('https://motorindia.in/articles', '0.9');
  }
}
