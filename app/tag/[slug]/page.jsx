import Link from "next/link"
import Image from "next/image"

// Fetch posts by tag slug
const getPostsByTag = async (slug) => {
  const response = await fetch(`${process.env.BACKEND}/wp-json/wp/v2/posts?_embed=true&tags=${slug}`, {
    next: { revalidate: 3600 } // Cache for 1 hour
  })
  const data = await response.json()
  
  // Transform WordPress data to a more usable format
  return data.map(post => ({
    id: post.id,
    slug: post.slug,
    title: post.title.rendered,
    excerpt: post.excerpt.rendered.replace(/<[^>]*>/g, ''), // Strip HTML tags
    date: post.date,
    image_url: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
    image_alt: post._embedded?.['wp:featuredmedia']?.[0]?.alt_text || '',
    category: post._embedded?.['wp:term']?.[0]?.[0]?.name || null
  }))
}

// Fetch tag details by slug
const getTagDetails = async (slug) => {
  const response = await fetch(`${process.env.BACKEND}/wp-json/wp/v2/tags?slug=${slug}`, {
    next: { revalidate: 3600 } // Cache for 1 hour
  })
  const tags = await response.json()
  
  if (!tags.length) return null
  
  return {
    id: tags[0].id,
    name: tags[0].name,
    slug: tags[0].slug,
    description: tags[0].description
  }
}

export default async function TagArchive({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const tag = await getTagDetails(slug);
  const posts = await getPostsByTag(tag?.id);
  
  // Handle case where tag is not found
  if (!tag) {
    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Tag not found</h1>
        <p>The tag you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        <Link href="/post" className="text-red-600 hover:underline mt-4 inline-block">
          ← Back to all posts
        </Link>
      </main>
    )
  }
  
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Tag: {tag.name}</h1>
      
      {tag.description && (
        <p className="text-gray-600 mb-6">{tag.description}</p>
      )}
      
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <Link 
              key={post.id} 
              href={`/post/${post.slug}`}
              className="group"
            >
              <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                {post.image_url && (
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={post.image_url}
                      alt={post.image_alt || post.title}
                      width={800}
                      height={450}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2 group-hover:text-red-600 transition-colors">
                    {post.title}
                  </h2>
                  
                  {post.excerpt && (
                    <p className="text-gray-600 mb-3 line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}
                  
                  <div className="flex items-center text-sm text-gray-500">
                    {post.date && (
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                    )}
                    
                    {post.category && (
                      <>
                        <span className="mx-2">•</span>
                        <span className="text-red-600">{post.category}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No posts found with this tag.</p>
      )}
      
      <Link href="/post" className="text-red-600 hover:underline mt-8 inline-block">
        ← Back to all posts
      </Link>
    </main>
  )
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const tag = await getTagDetails(slug);
  
  if (!tag) {
    return {
      title: 'Tag Not Found',
      description: 'The requested tag could not be found.'
    }
  }
  
  return {
    title: `${tag.name} - Tagged Posts`,
    description: tag.description || `Browse all posts tagged with ${tag.name}.`,
    openGraph: {
      title: `${tag.name} - Tagged Posts`,
      description: tag.description || `Browse all posts tagged with ${tag.name}.`,
      type: 'website'
    }
  }
}