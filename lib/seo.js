/**
 * SEO and Structured Data utilities for Motor India
 * Generates JSON-LD structured data for various content types
 */

/**
 * Generate Article structured data for blog posts
 * @param {Object} post - Post object
 * @param {string} baseUrl - Base URL of the site
 * @returns {Object} JSON-LD structured data
 */
export function generateArticleStructuredData(post, baseUrl = 'https://motorindia.in') {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    url: `${baseUrl}${post.link}`,
    datePublished: post.date,
    dateModified: post.modified || post.date,
    author: {
      '@type': 'Organization',
      name: 'Motor India',
      url: baseUrl
    },
    publisher: {
      '@type': 'Organization',
      name: 'Motor India',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/assets/motor-india-logo.png`,
        width: 200,
        height: 60
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}${post.link}`
    }
  };

  // Add featured image if available
  if (post.featuredImage?.url) {
    structuredData.image = {
      '@type': 'ImageObject',
      url: post.featuredImage.url,
      caption: post.featuredImage.alt || post.title
    };
  }

  // Add categories as keywords
  if (post.categories?.length > 0) {
    structuredData.keywords = post.categories.map(cat => cat.name).join(', ');
  }

  // Add automotive-specific properties if it's a car-related article
  if (isCarRelatedPost(post)) {
    structuredData['@type'] = ['Article', 'Review'];
    structuredData.about = {
      '@type': 'Product',
      category: 'Automobile'
    };
  }

  return structuredData;
}

/**
 * Generate BreadcrumbList structured data
 * @param {Array} breadcrumbs - Array of breadcrumb items
 * @param {string} baseUrl - Base URL of the site
 * @returns {Object} JSON-LD structured data
 */
export function generateBreadcrumbStructuredData(breadcrumbs, baseUrl = 'https://motorindia.in') {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: breadcrumb.name,
      item: `${baseUrl}${breadcrumb.url}`
    }))
  };
}

/**
 * Generate WebSite structured data for homepage
 * @param {string} baseUrl - Base URL of the site
 * @returns {Object} JSON-LD structured data
 */
export function generateWebSiteStructuredData(baseUrl = 'https://motorindia.in') {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Motor India',
    description: 'India&apos;s #1 Complete Automotive Platform - Car Reviews, Prices, Specifications & More',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Motor India',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/assets/motor-india-logo.png`,
        width: 200,
        height: 60
      }
    }
  };
}

/**
 * Generate Organization structured data
 * @param {string} baseUrl - Base URL of the site
 * @returns {Object} JSON-LD structured data
 */
export function generateOrganizationStructuredData(baseUrl = 'https://motorindia.in') {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Motor India',
    description: 'Complete automotive platform providing car reviews, specifications, pricing, and comparisons for Indian market',
    url: baseUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${baseUrl}/assets/motor-india-logo.png`,
      width: 200,
      height: 60
    },
    sameAs: [
      // Add social media URLs when available
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      availableLanguage: ['English', 'Hindi']
    },
    areaServed: {
      '@type': 'Country',
      name: 'India'
    },
    knowsAbout: [
      'Automobiles',
      'Car Reviews',
      'Car Specifications',
      'Car Pricing',
      'Automotive Industry'
    ]
  };
}

/**
 * Generate ItemList structured data for category/tag pages
 * @param {Array} items - Array of posts/items
 * @param {Object} listInfo - Information about the list
 * @param {string} baseUrl - Base URL of the site
 * @returns {Object} JSON-LD structured data
 */
export function generateItemListStructuredData(items, listInfo, baseUrl = 'https://motorindia.in') {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listInfo.name,
    description: listInfo.description,
    url: `${baseUrl}${listInfo.url}`,
    numberOfItems: items.length,
    itemListElement: items.slice(0, 10).map((item, index) => ({ // Limit to first 10 items
      '@type': 'ListItem',
      position: index + 1,
      name: item.title,
      url: `${baseUrl}${item.link}`,
      description: item.excerpt
    }))
  };
}

/**
 * Generate FAQ structured data
 * @param {Array} faqs - Array of FAQ objects with question and answer
 * @returns {Object} JSON-LD structured data
 */
export function generateFAQStructuredData(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

/**
 * Generate meta tags for SEO
 * @param {Object} pageData - Page data object
 * @param {string} baseUrl - Base URL of the site
 * @returns {Object} Meta tags object
 */
export function generateMetaTags(pageData, baseUrl = 'https://motorindia.in') {
  const metaTags = {
    title: pageData.title || 'Motor India - Complete Automotive Platform',
    description: pageData.description || 'India&apos;s leading automotive platform for car reviews, specifications, pricing, and comparisons.',
    keywords: pageData.keywords || 'cars, automotive, India, car reviews, car prices, car specifications',
    canonical: `${baseUrl}${pageData.path || '/'}`,
    openGraph: {
      title: pageData.title,
      description: pageData.description,
      url: `${baseUrl}${pageData.path || '/'}`,
      type: pageData.type || 'website',
      locale: pageData.locale || 'en_IN',
      siteName: 'Motor India'
    },
    twitter: {
      card: 'summary_large_image',
      title: pageData.title,
      description: pageData.description,
      site: '@motorindia', // Update with actual Twitter handle
      creator: '@motorindia'
    }
  };

  // Add image metadata if available
  if (pageData.image) {
    metaTags.openGraph.images = [{
      url: pageData.image.url,
      width: pageData.image.width || 1200,
      height: pageData.image.height || 630,
      alt: pageData.image.alt || pageData.title
    }];
    metaTags.twitter.image = pageData.image.url;
  }

  // Add article-specific metadata
  if (pageData.type === 'article') {
    metaTags.openGraph.article = {
      publishedTime: pageData.publishedTime,
      modifiedTime: pageData.modifiedTime,
      author: pageData.author || 'Motor India',
      section: pageData.section,
      tags: pageData.tags || []
    };
  }

  return metaTags;
}

/**
 * Check if a post is car-related based on categories and content
 * @param {Object} post - Post object
 * @returns {boolean} True if car-related
 */
function isCarRelatedPost(post) {
  const carKeywords = ['car', 'vehicle', 'automobile', 'automotive', 'review', 'specification', 'price'];
  const carCategories = ['car-reviews', 'automotive', 'car-news', 'specifications'];
  
  // Check categories
  const hasCarCategory = post.categories?.some(cat => 
    carCategories.some(carCat => cat.slug.includes(carCat))
  );
  
  // Check content for car-related keywords
  const hasCarKeywords = carKeywords.some(keyword => 
    post.title?.toLowerCase().includes(keyword) || 
    post.excerpt?.toLowerCase().includes(keyword)
  );
  
  return hasCarCategory || hasCarKeywords;
}

/**
 * Generate hreflang tags for multilingual pages
 * @param {string} currentPath - Current page path
 * @param {Array} languages - Available languages
 * @param {string} baseUrl - Base URL of the site
 * @returns {Array} Hreflang tags array
 */
export function generateHreflangTags(currentPath, languages = ['en', 'hi'], baseUrl = 'https://motorindia.in') {
  const hreflangTags = [];
  
  languages.forEach(lang => {
    const href = lang === 'en' 
      ? `${baseUrl}${currentPath}`
      : `${baseUrl}/${lang}${currentPath}`;
    
    hreflangTags.push({
      rel: 'alternate',
      hreflang: lang === 'en' ? 'en-IN' : 'hi-IN',
      href
    });
  });
  
  // Add x-default for English
  hreflangTags.push({
    rel: 'alternate',
    hreflang: 'x-default',
    href: `${baseUrl}${currentPath}`
  });
  
  return hreflangTags;
}
