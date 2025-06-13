export async function GET() {
  const today = new Date().toISOString();
  
  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Cars Sitemaps -->
  <sitemap>
    <loc>https://motorindia.in/sitemap-car-variants.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://motorindia.in/sitemap-car-models.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://motorindia.in/sitemap-car-images.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://motorindia.in/sitemap-car-360view.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://motorindia.in/sitemap-car-360view-exterior.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://motorindia.in/sitemap-car-360view-interior.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  
  <!-- Posts Sitemaps -->
  <sitemap>
    <loc>https://motorindia.in/sitemap-articles.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://motorindia.in/sitemap-hindi-posts.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://motorindia.in/sitemap-news.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  
  <!-- Categories Sitemaps -->
  <sitemap>
    <loc>https://motorindia.in/sitemap-article-categories.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://motorindia.in/sitemap-hindi-categories.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  
  <!-- Tags Sitemaps -->
  <sitemap>
    <loc>https://motorindia.in/sitemap-article-tags.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://motorindia.in/sitemap-hindi-tags.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>`;

  return new Response(xmlContent, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      'X-Robots-Tag': 'index, follow'
    }
  });
}