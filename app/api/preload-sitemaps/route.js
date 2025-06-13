import { NextResponse } from 'next/server';

/**
 * Sitemap Preloader API
 * Warms up sitemap cache by making internal requests
 * Can be used with cron jobs or build hooks
 */
export async function POST(request) {
  try {
    const { authorization } = await request.json();
    
    // Simple authorization check (replace with your actual auth logic)
    if (authorization !== process.env.SITEMAP_PRELOAD_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BACKEND || 'https://motorindia.in';
    const sitemapUrls = [
      '/sitemap.xml',
      '/sitemap-articles.xml',
      '/sitemap-hindi-posts.xml',
      '/sitemap-article-categories.xml',
      '/sitemap-hindi-categories.xml',
      '/sitemap-article-tags.xml',
      '/sitemap-hindi-tags.xml',
      '/sitemap-news.xml'
    ];

    const results = [];
    const startTime = Date.now();

    // Preload all sitemaps in parallel
    await Promise.allSettled(
      sitemapUrls.map(async (url) => {
        try {
          const response = await fetch(`${baseUrl}${url}`, {
            method: 'GET',
            headers: {
              'User-Agent': 'Motor India Sitemap Preloader',
              'Accept': 'application/xml'
            }
          });

          results.push({
            url,
            status: response.status,
            success: response.ok,
            size: response.headers.get('content-length') || 'unknown'
          });
        } catch (error) {
          results.push({
            url,
            status: 'error',
            success: false,
            error: error.message
          });
        }
      })
    );

    const endTime = Date.now();
    const totalTime = endTime - startTime;

    const summary = {
      totalSitemaps: sitemapUrls.length,
      successfulPreloads: results.filter(r => r.success).length,
      failedPreloads: results.filter(r => !r.success).length,
      totalTime: `${totalTime}ms`,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json({
      message: 'Sitemap preload completed',
      summary,
      results
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Sitemap preload error:', error);
    
    return NextResponse.json({
      error: 'Preload failed',
      message: error.message,
      timestamp: new Date().toISOString()
    }, {
      status: 500
    });
  }
}

/**
 * GET endpoint for manual testing (no auth required for status)
 */
export async function GET() {
  return NextResponse.json({
    message: 'Sitemap Preloader API',
    usage: 'Send POST request with { "authorization": "SECRET" } to preload sitemaps',
    endpoints: [
      '/sitemap.xml',
      '/sitemap-articles.xml',
      '/sitemap-hindi-posts.xml',
      '/sitemap-article-categories.xml',
      '/sitemap-hindi-categories.xml',
      '/sitemap-article-tags.xml',
      '/sitemap-hindi-tags.xml',
      '/sitemap-news.xml'
    ],
    lastUpdate: new Date().toISOString()
  });
}
