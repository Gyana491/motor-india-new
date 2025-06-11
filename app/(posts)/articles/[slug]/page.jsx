import Link from "next/link"
import Image from "next/image"
import "../../post-styles.css" // Import shared post styles

// Function to clean HTML entities
const cleanHtmlEntities = (text) => {
  if (!text) return text;
  return text
    .replace(/&#8211;/g, '–') // en dash
    .replace(/&#8212;/g, '—') // em dash
    .replace(/&#038;/g, '&') // ampersand 
    .replace(/&#8216;/g, "'") // single quote left
    .replace(/&#8217;/g, "'") // single quote right
    .replace(/&#8220;/g, '"') // double quote left
    .replace(/&#8221;/g, '"') // double quote right
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

// Generate metadata for the page
export async function generateMetadata({ params }) {
  const post = await getPost(params.slug)
  
  if (!post) {
    return {
      title: 'Post Not Found | Motor India',
      description: 'The requested article could not be found.'
    }
  }

  const metadata = {
    title: `${post.title} | Motor India`,
    description: post.content.replace(/<[^>]*>/g, '').slice(0, 160),
    keywords: [...post.categories.map(cat => cat.name), ...post.tags.map(tag => tag.name), 'Motor India', 'Automotive News'].join(', '),
    robots: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_FRONTEND}/articles/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.content.replace(/<[^>]*>/g, '').slice(0, 160),
      url: `${process.env.NEXT_PUBLIC_FRONTEND}/articles/${post.slug}`,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.modified,
      images: [
        {
          url: post.image_url || `${process.env.NEXT_PUBLIC_FRONTEND}/assets/place-holder.jpg`,
          width: 1200,
          height: 630,
          alt: post.image_alt || post.title,
        }
      ],
      siteName: 'Motor India',
      publisher: {
        '@type': 'Organization',
        name: 'Motor India',
        logo: {
          '@type': 'ImageObject',
          url: `${process.env.NEXT_PUBLIC_FRONTEND}/assets/motor-india-logo.png`
        }
      }
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.content.replace(/<[^>]*>/g, '').slice(0, 160),
      images: [post.image_url || `${process.env.NEXT_PUBLIC_FRONTEND}/assets/place-holder.jpg`],
    }
  }

  return metadata
}

// Fetch a single post by slug
const getPost = async (slug) => {
  const response = await fetch(`${process.env.BACKEND}/wp-json/wp/v2/posts?slug=${slug}&_embed=true`, {
    next: { revalidate: 0 } // no Cache 
  })
  const posts = await response.json()
  
  // If no post found, return null
  if (!posts.length) return null
  
  const post = posts[0]
  
  // Transform WordPress data to a more usable format
  return {
    id: post.id,
    slug: post.slug,
    title: cleanHtmlEntities(post.title.rendered),
    content: cleanHtmlEntities(post.content.rendered),
    date: post.date,
    modified: post.modified,
    image_url: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
    image_alt: cleanHtmlEntities(post._embedded?.['wp:featuredmedia']?.[0]?.alt_text || ''),
    categories: post._embedded?.['wp:term']?.[0]?.map(cat => ({
      id: cat.id,
      name: cleanHtmlEntities(cat.name),
      slug: cat.slug
    })) || [],
    tags: post._embedded?.['wp:term']?.[1]?.map(tag => ({
      id: tag.id,
      name: cleanHtmlEntities(tag.name),
      slug: tag.slug
    })) || [],
    author: {
      name: cleanHtmlEntities(post._embedded?.['author']?.[0]?.name || 'Unknown'),
      avatar: post._embedded?.['author']?.[0]?.avatar_urls?.['96'] || null
    }
  }
}

// Add this new function to fetch recent posts
const getRecentPosts = async (excludeSlug) => {
  const response = await fetch(`${process.env.BACKEND}/wp-json/wp/v2/posts?_embed=true&per_page=5`, {
    next: { revalidate: 3600 } 
  })
  const posts = await response.json()
  
  
  return posts
    .filter(post => post.slug !== excludeSlug)
    .slice(0, 4) // Limit to 4 posts
    .map(post => ({
      id: post.id,
      slug: post.slug,
      title: post.title.rendered,
      date: post.date,
      image_url: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
      category: post._embedded?.['wp:term']?.[0]?.[0]?.name || null
    }))
}

export default async function SinglePost({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const post = await getPost(slug);
  const recentPosts = await getRecentPosts(slug);
  
  // Handle case where post is not found
  if (!post) {
    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Post not found</h1>
        <p>Sorry, we couldn&apos;t find the post you&apos;re looking for.</p>
        <Link href="/articles" className="text-red-600 hover:underline mt-4 inline-block">
          ← Back to all posts
        </Link>
      </main>
    )
  }

  // Generate JSON-LD structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    datePublished: post.date,
    dateModified: post.modified,
    author: {
      '@type': 'Person',
      name: post.author.name,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Motor India',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_FRONTEND}/assets/motor-india-logo.png`
      }
    },
    image: post.image_url || `${process.env.NEXT_PUBLIC_FRONTEND}/assets/place-holder.jpg`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${process.env.NEXT_PUBLIC_FRONTEND}/articles/${post.slug}`
    }
  }
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <main className="lg:w-2/3">
            {/* Back button */}
            <Link href="/articles" className="text-red-600 hover:underline mb-6 inline-block">
              ← Back to all posts
            </Link>
            
            {/* Post title */}
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            
            {/* Post metadata */}
            <div className="flex flex-wrap items-center text-sm text-gray-500 mb-6">
              {post.date && (
                <span>Published: {new Date(post.date).toLocaleDateString()}</span>
              )}
              
              {post.modified && post.modified !== post.date && (
                <span className="ml-4">Updated: {new Date(post.modified).toLocaleDateString()}</span>
              )}
              
              {post.categories.length > 0 && (
                <div className="ml-4 flex items-center">
                  <span className="mr-1">Categories:</span>
                  {post.categories.map((cat, index) => (
                    <span key={cat.id}>
                      {index > 0 && ", "}
                      <Link href={`/category/${cat.slug}`} className="text-red-600 hover:underline">
                        {cat.name}
                      </Link>
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            {/* Author info */}
            {post.author && (
              <div className="flex items-center mb-8">
                {post.author.avatar && (
                  <Image 
                    src={post.author.avatar} 
                    alt={post.author.name}
                    width={40}
                    height={40}
                    className="rounded-full mr-3"
                  />
                )}
                <span className="font-medium">By {post.author.name}</span>
              </div>
            )}
            
            {/* Featured image */}
            {post.image_url && (
              <div className="mb-8">
                <Image
                  src={post.image_url}
                  alt={post.image_alt || post.title}
                  width={1200}
                  height={675}
                  className="w-full h-auto rounded-lg"
                />
              </div>
            )}
            
            {/* Post content with preserved WordPress classes and enhanced styling */}
            <article className="wp-content">
              <div 
                dangerouslySetInnerHTML={{ __html: post.content }}
                className="prose prose-lg max-w-none"
              />
            </article>

            {/* Tag cloud section */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-10 pt-6 border-t border-gray-200">
                <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  Topics & Tags
                </h3>
                <div className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 shadow-sm">
                  <div className="flex flex-wrap gap-3">
                    {post.tags.map((tag, idx) => (
                      <Link 
                        key={tag.id} 
                        href={`/articles/tag/${tag.slug}`}
                        className={`inline-flex items-center px-4 py-2 ${
                          idx % 4 === 0 ? 'bg-red-50 hover:bg-red-100 border-red-100' : 
                          idx % 4 === 1 ? 'bg-blue-50 hover:bg-blue-100 border-blue-100' : 
                          idx % 4 === 2 ? 'bg-green-50 hover:bg-green-100 border-green-100' : 
                          'bg-amber-50 hover:bg-amber-100 border-amber-100'
                        } text-gray-700 hover:text-gray-900 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow border hover:scale-105`}
                      >
                        <span className={`mr-1.5 ${
                          idx % 4 === 0 ? 'text-red-500' : 
                          idx % 4 === 1 ? 'text-blue-500' : 
                          idx % 4 === 2 ? 'text-green-500' : 
                          'text-amber-500'
                        } font-semibold`}>#</span>
                        {tag.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Share section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
                Share This Article
              </h3>
              <div className="flex space-x-4">
                <a 
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${process.env.NEXT_PUBLIC_FRONTEND}/articles/${post.slug}`)}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-[#1877F2] text-white rounded-full hover:bg-opacity-90 transition-all"
                  aria-label="Share on Facebook"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                  </svg>
                </a>
                <a 
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out: ${post.title}`)}&url=${encodeURIComponent(`${process.env.NEXT_PUBLIC_FRONTEND}/articles/${post.slug}`)}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-[#1DA1F2] text-white rounded-full hover:bg-opacity-90 transition-all"
                  aria-label="Share on Twitter"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a 
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${post.title}: ${process.env.NEXT_PUBLIC_FRONTEND}/articles/${post.slug}`)}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-[#25D366] text-white rounded-full hover:bg-opacity-90 transition-all"
                  aria-label="Share on WhatsApp"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                </a>
                <a 
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${process.env.NEXT_PUBLIC_FRONTEND}/articles/${post.slug}`)}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-[#0A66C2] text-white rounded-full hover:bg-opacity-90 transition-all"
                  aria-label="Share on LinkedIn"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
                  </svg>
                </a>
              </div>
            </div>
          </main>
          {/* Sidebar with recent posts */}
          <aside className="lg:w-1/3 mt-8 lg:mt-0">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold mb-4 text-gray-800 border-b border-gray-200 pb-2">Recent News</h2>
              
              {recentPosts.length > 0 ? (
                <div className="space-y-4">
                  {recentPosts.map(recentPost => (
                    <Link 
                      key={recentPost.id} 
                      href={`/articles/${recentPost.slug}`}
                      className="group block"
                    >
                      <div className="flex items-start gap-3">
                        {recentPost.image_url && (
                          <div className="flex-shrink-0 w-20 h-20 overflow-hidden rounded">
                            <Image
                              src={recentPost.image_url}
                              alt=""
                              width={80}
                              height={80}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <div>
                          <h3 className="text-sm font-medium group-hover:text-red-600 transition-colors line-clamp-2">
                            {recentPost.title}
                          </h3>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            {recentPost.date && (
                              <span>{new Date(recentPost.date).toLocaleDateString()}</span>
                            )}
                            {recentPost.category && (
                              <>
                                <span className="mx-1">•</span>
                                <span className="text-red-600">{recentPost.category}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No recent posts available.</p>
              )}
              
              <Link href="/articles" className="text-red-600 hover:underline text-sm mt-4 inline-block">
                View all posts →
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}