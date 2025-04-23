import { getAllCarModelPages } from '../../../lib/getter';

// Add this line to prevent static generation at build time
export const dynamic = 'force-dynamic';



export async function GET() {
  try {
    const pages = await getAllCarModelPages();

    // Create XML content
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages.map(page => {
    // Simply use the link directly from the JSON if it exists
    if (!page.link) return '';
    
    return `
  <url>
    <loc>${page.link}360-view/exterior</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  }).join('')}
</urlset>`;

    // Return XML response with appropriate headers
    return new Response(xmlContent, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new Response('Error generating sitemap', { status: 500 });
  }
}