import wordpressService from '@/lib/services/wordpressService';

// Force dynamic generation with real-time data updates
export const dynamic = 'force-dynamic';
export const revalidate = 0; // No caching - always fresh data

/**
 * Generate sitemap for all Hindi post categories
 * Following Next.js 14+ sitemap best practices
 */
export async function GET() {
  try {
    // Fetch all Hindi categories
    const categories = await wordpressService.getAllHindiCategories();

    // If no categories found, return a minimal sitemap with just the Hindi main page
    if (!categories || categories.length === 0) {
      const minimalXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://motorindia.in/hindi</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`;

      return new Response(minimalXml, {
        headers: {
          'Content-Type': 'application/xml',
          'Cache-Control': 'public, max-age=7200, s-maxage=7200',
          'X-Robots-Tag': 'index, follow'
        }
      });
    }

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
    console.error('Error generating Hindi categories sitemap:', error);
    
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
