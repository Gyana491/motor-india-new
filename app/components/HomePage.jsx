import Link from "next/link"
import Image from "next/image"

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

const getEnglishPosts = async () => {
    // Simulating API call - ensure your BACKEND env variable is set
    const response = await fetch(`${process.env.BACKEND}/wp-json/wp/v2/posts?_embed=true&per_page=6`,{
        next: { revalidate: 0 }
    })
    const data = await response.json()
    
    return data.map(post => ({
        id: post.id,
        slug: post.slug,
        title: cleanHtmlEntities(post.title.rendered),
        excerpt: cleanHtmlEntities(post.excerpt.rendered.replace(/<[^>]*>/g, '')), // Strip HTML tags and clean entities
        date: post.date,
        image_url: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
        image_alt: cleanHtmlEntities(post._embedded?.['wp:featuredmedia']?.[0]?.alt_text || ''),
        category: cleanHtmlEntities(post._embedded?.['wp:term']?.[0]?.[0]?.name || null)
    }))
}

const getHindiPosts = async () => {
    // Simulating API call - ensure your BACKEND env variable is set
    const response = await fetch(`${process.env.BACKEND}/wp-json/wp/v2/hindi?_embed=true&per_page=6`,{
        next: { revalidate: 0 }
    })
    const data = await response.json()
    
    return data.map(post => ({
        id: post.id,
        slug: post.slug,
        title: cleanHtmlEntities(post.title.rendered),
        excerpt: cleanHtmlEntities(post.excerpt.rendered.replace(/<[^>]*>/g, '')), // Strip HTML tags and clean entities
        date: post.date,
        image_url: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
        image_alt: cleanHtmlEntities(post._embedded?.['wp:featuredmedia']?.[0]?.alt_text || ''),
        category: cleanHtmlEntities(post._embedded?.['wp:term']?.[0]?.[0]?.name || null)
    }))
}

const FeaturedPostCard = ({ post, language }) => (
    <Link 
        href={`/${language}/${post.slug}`}
        className="group block h-full"
    >
        <article className="relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 h-full transform hover:-translate-y-2 border border-slate-100">
            {/* Image Section */}
            <div className="relative h-64 lg:h-80 xl:h-96"> 
                {post.image_url && (
                    <div className="relative w-full h-full">
                        <Image
                            src={post.image_url}
                            alt={post.image_alt || post.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        {post.category && (
                            <span className="absolute top-6 left-6 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 text-sm font-bold rounded-full shadow-lg backdrop-blur-sm">
                                {post.category}
                            </span>
                        )}
                    </div>
                )}
            </div>
            
            {/* Content Section */}
            <div className="p-8">
                <h2 className="text-2xl xl:text-3xl font-bold mb-4 group-hover:text-red-600 transition-colors duration-300 line-clamp-3 leading-tight">
                    {post.title}
                </h2>
                {post.excerpt && (
                    <p className="text-slate-600 line-clamp-3 text-lg leading-relaxed mb-6">
                        {post.excerpt}
                    </p>
                )}
                <div className="flex items-center justify-between">
                    {post.date && (
                        <time dateTime={new Date(post.date).toISOString()} className="text-sm text-slate-500 font-medium">
                            {new Date(post.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                        </time>
                    )}
                    <div className="flex items-center text-red-600 font-semibold group-hover:text-red-700 transition-colors duration-300">
                        <span className="text-sm">Read More</span>
                        <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
            </div>
        </article>
    </Link>
)

const PostCard = ({ post, language }) => (
    <Link 
        href={`/${language}/${post.slug}`}
        className="group block h-full"
    >
        <article className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 h-full transform hover:-translate-y-1 border border-slate-100">
            {/* Image Section */}
            <div className="relative h-48 overflow-hidden">
                {post.image_url && (
                    <div className="relative w-full h-full">
                        <Image
                            src={post.image_url}
                            alt={post.image_alt || post.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        {post.category && (
                             <span className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 text-xs font-bold rounded-full shadow-md">
                                {post.category}
                            </span>
                        )}
                    </div>
                )}
            </div>
            
            {/* Content Section */}
            <div className="p-6">
                <h3 className="text-lg xl:text-xl font-bold mb-3 group-hover:text-red-600 transition-colors duration-300 line-clamp-2 leading-tight">
                    {post.title}
                </h3>
                <div className="flex items-center justify-between mt-4">
                    {post.date && (
                        <time dateTime={new Date(post.date).toISOString()} className="text-xs text-slate-500 font-medium">
                            {new Date(post.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </time>
                    )}
                    <div className="flex items-center text-red-600 font-semibold group-hover:text-red-700 transition-colors duration-300">
                        <span className="text-xs">Read</span>
                        <svg className="w-3 h-3 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
            </div>
        </article>
    </Link>
)

const HomePage = async () => {
    // In a real app, you'd handle potential errors from these fetches
    const [englishPosts, hindiPosts] = await Promise.all([
        getEnglishPosts(),
        getHindiPosts()
    ]).catch(err => {
        console.error("Error fetching posts:", err);
        // Return empty arrays or some default state if fetching fails
        return [[], []]; 
    });

    // Handle cases where posts might be empty to avoid errors
    const hasEnglishPosts = englishPosts && englishPosts.length > 0;
    const firstEnglishPost = hasEnglishPosts ? englishPosts[0] : null;
    const otherEnglishPosts = hasEnglishPosts && englishPosts.length > 1 ? englishPosts.slice(1, Math.min(3, englishPosts.length)) : [];
    
    const hasHindiPosts = hindiPosts && hindiPosts.length > 0;
    const firstHindiPost = hasHindiPosts ? hindiPosts[0] : null;
    const otherHindiPosts = hasHindiPosts && hindiPosts.length > 1 ? hindiPosts.slice(1, Math.min(3, hindiPosts.length)) : [];

    return (
        <div className="bg-gradient-to-br from-slate-50 via-white to-slate-50 min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-20 max-w-7xl">
            
            {/* English Section */}
            {hasEnglishPosts && (
            <section aria-labelledby="latest-articles-title" className="relative">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-8 gap-4">
                    <div>
                        <h2 id="latest-articles-title" className="text-4xl lg:text-5xl font-bold text-slate-900 mb-2">
                            Latest Articles
                        </h2>
                        <p className="text-slate-600 text-lg">Discover the latest automotive insights and news</p>
                    </div>
                    <Link 
                        href="/articles"
                        className="group inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105"
                    >
                        View All Articles
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </Link>
                </div>
                
                {/* Modern Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
                    {/* Hero Post - spans 2 columns and 2 rows on large screens */}
                    <div className="md:col-span-2 lg:row-span-2">
                        <FeaturedPostCard post={firstEnglishPost} language="articles" />
                    </div>
                    
                    {/* Side Posts */}
                    {otherEnglishPosts.map((post, index) => (
                        <div key={post.id} className={`${index === 0 ? 'md:col-span-1 lg:col-span-2' : ''}`}>
                            <PostCard post={post} language="articles" />
                        </div>
                    ))}
                </div>
            </section>
            )}

            {/* Hindi Section */}
            {hasHindiPosts && (
            <section aria-labelledby="hindi-लेख-title" className="relative">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-8 gap-4">
                    <div>
                        <h2 id="hindi-लेख-title" className="text-4xl lg:text-5xl font-bold text-slate-900 mb-2">
                            हिंदी लेख
                        </h2>
                        <p className="text-slate-600 text-lg">नवीनतम ऑटोमोटिव समाचार और जानकारी</p>
                    </div>
                    <Link 
                        href="/hindi"
                        className="group inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105"
                    >
                        सभी देखें
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </Link>
                </div>
                
                {/* Modern Masonry-Style Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {/* Hero Post */}
                    <div className="md:col-span-2 lg:col-span-3">
                        <FeaturedPostCard post={firstHindiPost} language="hindi" />
                    </div>
                    
                    {/* Side Posts in a stacked layout */}
                    <div className="md:col-span-1 lg:col-span-2 space-y-6">
                        {otherHindiPosts.map(post => (
                            <PostCard key={post.id} post={post} language="hindi" />
                        ))}
                    </div>
                </div>
            </section>
            )}
            </div>
        </div>
    )
}

export default HomePage