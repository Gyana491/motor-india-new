import Link from "next/link"
import Image from "next/image"
import "./post-styles.css" // Import CSS file for styling

// Fetch a single post by slug
const getPost = async (slug) => {
  const response = await fetch(`${process.env.BACKEND}/wp-json/wp/v2/posts?slug=${slug}&_embed=true`, {
    next: { revalidate: 300 } // Cache for 5 minutes
  })
  const posts = await response.json()
  
  // If no post found, return null
  if (!posts.length) return null
  
  const post = posts[0]
  
  // Transform WordPress data to a more usable format
  return {
    id: post.id,
    slug: post.slug,
    title: post.title.rendered,
    content: post.content.rendered,
    date: post.date,
    modified: post.modified,
    image_url: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
    image_alt: post._embedded?.['wp:featuredmedia']?.[0]?.alt_text || '',
    categories: post._embedded?.['wp:term']?.[0]?.map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug
    })) || [],
    author: {
      name: post._embedded?.['author']?.[0]?.name || 'Unknown',
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
  
  return (
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
  )
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const post = await getPost(slug)
  
  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested post could not be found.'
    }
  }
  
  // Strip HTML tags from content for description
  const description = post.content
    .replace(/<[^>]*>/g, '')
    .substring(0, 160)
    .trim() + '...'
  
  return {
    title: post.title,
    description: description,
    openGraph: {
      title: post.title,
      description: description,
      type: 'article',
      images: post.image_url ? [post.image_url] : [],
      publishedTime: post.date,
      modifiedTime: post.modified,
      authors: [post.author.name],
      tags: post.categories.map(cat => cat.name)
    }
  }
}