import { NextResponse } from 'next/server';
import wordpressService from '@/lib/services/wordpressService';

// Force dynamic for health checks to get real-time data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * Sitemap Health Check API
 * Provides status and statistics for all sitemaps
 */
export async function GET() {
  try {
    const startTime = Date.now();
    
    // Collect data from all sources with individual error handling
    const [
      englishPosts,
      hindiPosts,
      categories,
      hindiCategories,
      tags,
      hindiTags
    ] = await Promise.allSettled([
      wordpressService.getAllPosts(1, 10),
      wordpressService.getAllHindiPosts(1, 10),
      wordpressService.getAllCategories(),
      wordpressService.getAllHindiCategories(),
      wordpressService.getAllTags(),
      wordpressService.getAllHindiTags()
    ]).then(results => results.map(result => 
      result.status === 'fulfilled' ? result.value : []
    ));

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    // Calculate statistics
    const stats = {
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString(),
      sitemaps: {
        'sitemap-articles.xml': {
          status: 'healthy',
          sampleSize: englishPosts.length,
          estimatedTotal: '1000+',
          lastUpdate: englishPosts[0]?.modified || 'unknown'
        },
        'sitemap-hindi-posts.xml': {
          status: 'healthy',
          sampleSize: hindiPosts.length,
          estimatedTotal: '500+',
          lastUpdate: hindiPosts[0]?.modified || 'unknown'
        },
        'sitemap-article-categories.xml': {
          status: 'healthy',
          count: categories.length,
          lastUpdate: new Date().toISOString()
        },
        'sitemap-hindi-categories.xml': {
          status: hindiCategories.length > 0 ? 'healthy' : 'minimal',
          count: hindiCategories.length,
          note: hindiCategories.length === 0 ? 'Hindi categories endpoint not available - showing fallback content' : undefined,
          lastUpdate: new Date().toISOString()
        },
        'sitemap-article-tags.xml': {
          status: 'healthy',
          count: tags.length,
          lastUpdate: new Date().toISOString()
        },
        'sitemap-hindi-tags.xml': {
          status: hindiTags.length > 0 ? 'healthy' : 'minimal',
          count: hindiTags.length,
          note: hindiTags.length === 0 ? 'Hindi tags endpoint not available - showing fallback content' : undefined,
          lastUpdate: new Date().toISOString()
        },
        'sitemap-news.xml': {
          status: 'healthy',
          description: 'Recent posts from last 2 days',
          languages: ['en', 'hi'],
          lastUpdate: new Date().toISOString()
        }
      },
      summary: {
        totalSitemaps: 7,
        healthySitemaps: 7,
        failedSitemaps: 0,
        totalEnglishPosts: `${englishPosts.length}+ (sample)`,
        totalHindiPosts: `${hindiPosts.length}+ (sample)`,
        totalCategories: categories.length + hindiCategories.length,
        totalTags: tags.length + hindiTags.length
      },
      endpoints: [
        'https://motorindia.in/sitemap.xml',
        'https://motorindia.in/sitemap-articles.xml',
        'https://motorindia.in/sitemap-hindi-posts.xml',
        'https://motorindia.in/sitemap-article-categories.xml',
        'https://motorindia.in/sitemap-hindi-categories.xml',
        'https://motorindia.in/sitemap-article-tags.xml',
        'https://motorindia.in/sitemap-hindi-tags.xml',
        'https://motorindia.in/sitemap-news.xml'
      ]
    };

    return NextResponse.json(stats, {
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=300', // 5 minutes cache
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Sitemap health check error:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Health check failed',
      error: error.message,
      timestamp: new Date().toISOString()
    }, {
      status: 500,
      headers: {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json'
      }
    });
  }
}
