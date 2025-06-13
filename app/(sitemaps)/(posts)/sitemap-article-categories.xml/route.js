import wordpressService from '@/lib/services/wordpressService';

// Force dynamic generation to ensure fresh data
export const dynamic = 'force-dynamic';

/**
 * Generate sitemap for all English article categories
 * Following Next.js 14+ sitemap best practices
 */
export async function GET() {
  try {
    // Fetch all English categories
    const categories = await wordpressService.getAllCategories();

    // Generate sitemap XML
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${categories.map(category => {
    const priority = getCategoryPriority(category);
    const changefreq = getCategoryChangeFreq(category);
    
    return `
  <url>
    <loc>https://motorindia.in${category.link}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  }).join('')}
</urlset>`;

    return new Response(xmlContent, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=7200, s-maxage=7200', // 2 hours cache for categories
        'X-Robots-Tag': 'index, follow'
      }
    });

  } catch (error) {
    console.error('Error generating article categories sitemap:', error);
    
    // Return minimal sitemap on error
    const errorXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://motorindia.in/articles</loc>
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
 * Determine priority based on category characteristics
 * @param {Object} category - Category object
 * @returns {string} Priority value
 */
function getCategoryPriority(category) {
  // Higher priority for categories with more posts
  if (category.count > 50) return '0.9';
  if (category.count > 20) return '0.8';
  if (category.count > 10) return '0.7';
  if (category.count > 5) return '0.6';
  
  return '0.5';
}

/**
 * Determine change frequency based on category activity
 * @param {Object} category - Category object
 * @returns {string} Change frequency
 */
function getCategoryChangeFreq(category) {
  // More active categories change more frequently
  if (category.count > 50) return 'daily';
  if (category.count > 20) return 'weekly';
  if (category.count > 5) return 'monthly';
  
  return 'yearly';
}
