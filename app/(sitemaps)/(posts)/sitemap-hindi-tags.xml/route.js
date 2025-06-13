import wordpressService from '@/lib/services/wordpressService';

// Force dynamic generation with real-time data updates
export const dynamic = 'force-dynamic';
export const revalidate = 0; // No caching - always fresh data

/**
 * Generate sitemap for all Hindi post tags
 * Following Next.js 14+ sitemap best practices
 */
export async function GET() {
  try {
    // Fetch all Hindi tags
    const tags = await wordpressService.getAllHindiTags();

    // If no tags found, return a minimal sitemap with just the Hindi main page
    if (!tags || tags.length === 0) {
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
  ${tags.map(tag => {
    const priority = getTagPriority(tag);
    const changefreq = getTagChangeFreq(tag);
    
    return `
  <url>
    <loc>https://motorindia.in${tag.link}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  }).join('')}
</urlset>`;

    return new Response(xmlContent, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=7200, s-maxage=7200', // 2 hours cache for tags
        'X-Robots-Tag': 'index, follow'
      }
    });

  } catch (error) {
    console.error('Error generating Hindi tags sitemap:', error);
    
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
 * Determine priority based on tag characteristics
 * @param {Object} tag - Tag object
 * @returns {string} Priority value
 */
function getTagPriority(tag) {
  // Higher priority for tags with more posts
  if (tag.count > 30) return '0.8';
  if (tag.count > 15) return '0.7';
  if (tag.count > 8) return '0.6';
  if (tag.count > 3) return '0.5';
  
  return '0.4';
}

/**
 * Determine change frequency based on tag activity
 * @param {Object} tag - Tag object
 * @returns {string} Change frequency
 */
function getTagChangeFreq(tag) {
  // More active tags change more frequently
  if (tag.count > 30) return 'daily';
  if (tag.count > 15) return 'weekly';
  if (tag.count > 5) return 'monthly';
  
  return 'yearly';
}
