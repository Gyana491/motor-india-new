import Link from "next/link"
import Image from "next/image"

// Fetch posts by tag
const getPostsByTag = async (tagSlug) => {
  // First get the tag ID
  const tagResponse = await fetch(
    `${process.env.BACKEND}/wp-json/wp/v2/tags?slug=${tagSlug}`,
    { next: { revalidate: 3600 } }
  )
  const tags = await tagResponse.json()
  if (!tags.length) return []
  
  // Then fetch posts with that tag ID for post post type
  const response = await fetch(
    `${process.env.BACKEND}/wp-json/wp/v2/posts?tags=${tags[0].id}&_embed=true&per_page=100`,
    { next: { revalidate: 3600 } }
  )
  const posts = await response.json()
  
  if (!Array.isArray(posts)) return []
  
  return posts.map(post => ({
    id: post.id,
    slug: post.slug,
    title: post.title.rendered,
    date: post.date,
    excerpt: post.excerpt.rendered,
    image_url: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
    image_alt: post._embedded?.['wp:featuredmedia']?.[0]?.alt_text || '',
    categories: post._embedded?.['wp:term']?.[0]?.map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug
    })) || []
  }))
}

// Fetch tag details
const getTag = async (tagSlug) => {
  const response = await fetch(
    `${process.env.BACKEND}/wp-json/wp/v2/tags?slug=${tagSlug}`,
    { next: { revalidate: 3600 } }
  )
  const tags = await response.json()
  return tags[0] || null
}

// Generate metadata
export async function generateMetadata({ params }) {
  const tag = await getTag(params.slug)
  
  if (!tag) {
    return {
      title: 'टैग नहीं मिला | मोटर इंडिया',
      description: 'अनुरोधित टैग नहीं मिल सका।'
    }
  }

  return {
    title: `${tag.name} - टैग्ड लेख | मोटर इंडिया`,
    description: tag.description || `मोटर इंडिया पर ${tag.name} से टैग किए गए सभी लेख`,
    keywords: [tag.name, 'मोटर इंडिया', 'टैग्ड लेख', 'ऑटोमोटिव न्यूज़'].join(', '),
    robots: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_FRONTEND}/articles/tag/${params.slug}`,
    },
    openGraph: {
      title: `${tag.name} - टैग्ड लेख | मोटर इंडिया`,
      description: tag.description || `मोटर इंडिया पर ${tag.name} से टैग किए गए सभी लेख`,
      url: `${process.env.NEXT_PUBLIC_FRONTEND}/articles/tag/${params.slug}`,
      siteName: 'मोटर इंडिया',
      locale: 'hi_IN',
      type: 'website',
    }
  }
}

export default async function TagPage({ params }) {
  const [tag, posts] = await Promise.all([
    getTag(params.slug),
    getPostsByTag(params.slug)
  ])

  if (!tag) {
    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">टैग नहीं मिला</h1>
        <p>क्षमा करें, आपका अनुरोधित टैग नहीं मिल सका।</p>
        <Link href="/articles" className="text-red-600 hover:underline mt-4 inline-block">
          ← सभी हिंदी लेखों पर वापस जाएं
        </Link>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/articles" className="text-red-600 hover:underline mb-6 inline-block">
          ← सभी हिंदी लेखों पर वापस जाएं
        </Link>
        
        <h1 className="text-3xl font-bold mt-4 mb-2 flex items-center">
          <span className="text-red-600 mr-2">#</span>
          {tag.name}
        </h1>
        
        {tag.description && (
          <p className="text-gray-600 mt-2" 
             dangerouslySetInnerHTML={{ __html: tag.description }} 
          />
        )}
        
        <p className="text-sm text-gray-500 mt-2">
          {posts.length} लेख मिले
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map(post => (
          <article key={post.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <Link href={`/articles/${post.slug}`}>
              {post.image_url ? (
                <div className="relative h-48 rounded-t-lg overflow-hidden">
                  <Image
                    src={post.image_url}
                    alt={post.image_alt || post.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="relative h-48 rounded-t-lg overflow-hidden bg-gray-100">
                  <Image
                    src="/assets/place-holder.jpg"
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              
              <div className="p-4">
                <h2 className="text-xl font-bold mb-2 text-gray-900 hover:text-red-600 transition-colors">
                  {post.title}
                </h2>
                
                <div className="flex items-center text-sm text-gray-500">
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString()}
                  </time>
                  
                  {post.categories?.[0] && (
                    <>
                      <span className="mx-2">•</span>
                      <Link 
                        href={`/articles/category/${post.categories[0].slug}`}
                        className="text-red-600 hover:underline"
                      >
                        {post.categories[0].name}
                      </Link>
                    </>
                  )}
                </div>
                
                <div 
                  className="mt-2 text-gray-600 text-sm line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: post.excerpt }}
                />
              </div>
            </Link>
          </article>
        ))}
      </div>

      {posts.length === 0 && (
        <p className="text-gray-500 text-center py-8">
          इस टैग के लिए कोई लेख नहीं मिला।
        </p>
      )}
    </main>
  )
}
