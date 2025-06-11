import Link from "next/link"
import Image from "next/image"

// Fetch posts by category slug
const getPostsByCategory = async (slug) => {
  const response = await fetch(`${process.env.BACKEND}/wp-json/wp/v2/hindi?_embed=true&categories=${slug}`, {
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

// Fetch category details by slug
const getCategoryDetails = async (slug) => {
  const response = await fetch(`${process.env.BACKEND}/wp-json/wp/v2/categories?slug=${slug}&post_type=hindi`, {
    next: { revalidate: 3600 } // Cache for 1 hour
  })
  const categories = await response.json()
  
  if (!categories.length) return null
  
  return {
    id: categories[0].id,
    name: categories[0].name,
    slug: categories[0].slug,
    description: categories[0].description
  }
}

export default async function CategoryArchive({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const category = await getCategoryDetails(slug);
  const posts = await getPostsByCategory(category?.id);
  
  // Handle case where category is not found
  if (!category) {
    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Category not found</h1>
        <p>The category you&apos;re looking for doesn&apos;t exist or has been removed.</p>        <Link href="/hindi" className="text-red-600 hover:underline mt-4 inline-block">
          ← Back to all Hindi posts
        </Link>
      </main>
    )
  }
  
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{category.name}</h1>
      
      {category.description && (
        <p className="text-gray-600 mb-6">Sorry, we couldn&apos;t find any posts in this category.</p>
      )}
      
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (            <Link 
              key={post.id} 
              href={`/hindi/${post.slug}`}
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
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 mb-6">No posts found in this category.</p>
      )}
    </main>
  )
}
