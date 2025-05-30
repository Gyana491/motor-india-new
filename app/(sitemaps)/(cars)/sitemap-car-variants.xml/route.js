import { BACKEND } from '@/app/utils/constants';

// Add this line to prevent static generation at build time
export const dynamic = 'force-dynamic';

async function getAllProducts() {
  let allProducts = [];
  let page = 1;
  let hasMoreProducts = true;

  while (hasMoreProducts) {
    try {
      const response = await fetch(`${BACKEND || process.env.BACKEND}/wp-admin/admin-ajax.php?action=get_all_products_json&page=${page}&per_page=20`,{
        next: { revalidate: 86400 } // Revalidate every day
      });

      if (!response.ok) {
        if (response.status === 400 || response.status === 404) {
          hasMoreProducts = false;
          break;
        }
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const products = data.products || [];

      if (!products.length || page >= data.pagination.total_pages) {
        hasMoreProducts = false;
      }

      allProducts = [...allProducts, ...products];
      page++;

    } catch (error) {
      console.error('Error fetching products:', error);
      hasMoreProducts = false;
    }
  }

  return allProducts;
}

export async function GET() {
  try {
    const products = await getAllProducts();

    // Create XML content
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${products.map(product => {
    const make = product.make?.toLowerCase().replace(/\s+/g, '-') || '';
    const model = product.model?.toLowerCase().replace(/\s+/g, '-') || '';
    const variant = product.variant?.toLowerCase().replace(/\s+/g, '-') || '';
    
    if (!make || !model || !variant) return '';
    
    return `
  <url>
    <loc>https://motorindia.in/cars/${make}/${model}/${variant}/</loc>
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