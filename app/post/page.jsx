import Link from "next/link"

const getPosts = async () => {
    const response = await fetch(`${process.env.BACKEND}/wp-json/wp/v2/posts?_embed=true`)
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

const Posts = async () => {
  const posts = await getPosts()
  
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Latest Posts</h1>
      
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
                  <img
                    src={post.image_url}
                    alt={post.image_alt || post.title}
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
    </main>
  )
}

export default Posts