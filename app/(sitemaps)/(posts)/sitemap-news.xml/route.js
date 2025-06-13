import wordpressService from '@/lib/services/wordpressService';
import { 
  escapeXml, 
  getSitemapHeaders, 
  generateErrorSitemap, 
  isRecentPost,
  generateNewsSitemapEntry
} from '../../lib/sitemapUtils';

// Force dynamic generation with real-time data for news
export const dynamic = 'force-dynamic';
export const revalidate = 0; // No caching - always fresh news data

/**
 * Generate Google News sitemap for recent posts (both English and Hindi)
 * Following Google News sitemap guidelines and Next.js 14+ best practices
 */
export async function GET() {
  try {
    // Fetch recent posts from both languages
    const [englishPosts, hindiPosts] = await Promise.all([
      wordpressService.getAllPosts(1, 50), // Get first 50 recent English posts
      wordpressService.getAllHindiPosts(1, 50) // Get first 50 recent Hindi posts
    ]);

    // Filter for posts published in the last 2 days (Google News requirement)
    const recentEnglishPosts = englishPosts.filter(post => isRecentPost(post.date, 2));
    const recentHindiPosts = hindiPosts.filter(post => isRecentPost(post.date, 2));

    // Combine and sort by publication date (newest first)
    const allRecentPosts = [...recentEnglishPosts, ...recentHindiPosts]
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    // Generate sitemap XML
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${allRecentPosts.map(post => {
    const language = post.type === 'hindi' ? 'hi' : 'en';
    
    return `
  <url>
    <loc>https://motorindia.in${post.link}</loc>
    <lastmod>${new Date(post.modified || post.date).toISOString()}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>1.0</priority>${post.featuredImage.url ? `
    <image:image>
      <image:loc>${post.featuredImage.url}</image:loc>
      <image:title>${escapeXml(post.title)}</image:title>
      <image:caption>${escapeXml(post.featuredImage.alt || post.title)}</image:caption>
    </image:image>` : ''}
    <news:news>
      <news:publication>
        <news:name>Motor India</news:name>
        <news:language>${language}</news:language>
      </news:publication>
      <news:publication_date>${new Date(post.date).toISOString()}</news:publication_date>
      <news:title>${escapeXml(post.title)}</news:title>${post.categories.length > 0 ? `
      <news:keywords>${escapeXml(post.categories.map(cat => cat.name).join(', '))}</news:keywords>` : ''}
    </news:news>
  </url>`;
  }).join('')}
</urlset>`;

    return new Response(xmlContent, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'X-Robots-Tag': 'index, follow, max-snippet:-1, max-image-preview:large'
      }
    });

  } catch (error) {
    console.error('Error generating news sitemap:', error);
    
    // Return error sitemap
    return generateErrorSitemap('https://motorindia.in/articles', '1.0');
  }
}

/**
 * Static export for sitemap discovery
 * This helps search engines find the news sitemap
 */
export const metadata = {
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};
