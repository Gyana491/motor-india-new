import { BACKEND } from '@/app/utils/constants';

// Add this line to prevent static generation at build time
export const dynamic = 'force-dynamic';

async function getAllCarModelPages() {
  let allPages = [];
  let page = 1;
  let hasMorePages = true;

  while (hasMorePages) {
    try {
      const response = await fetch(`${BACKEND || process.env.BACKEND}/wp-admin/admin-ajax.php?action=get_all_cars_json&page=${page}&per_page=20`,{
        next: { revalidate: 86400 } // Revalidate every day
      });

      if (!response.ok) {
        if (response.status === 400 || response.status === 404) {
          hasMorePages = false;
          break;
        }
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const pages = data.pages || [];

      if (!pages.length || page >= data.pagination.total_pages) {
        hasMorePages = false;
      }

      allPages = [...allPages, ...pages];
      page++;

    } catch (error) {
      console.error('Error fetching cars:', error);
      hasMorePages = false;
    }
  }

  return allPages;
}

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
    <loc>${page.link}</loc>
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