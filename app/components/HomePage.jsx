import Link from "next/link"
import Image from "next/image"
import { getFeaturedImage } from '@/lib/api'
import { getCarBodyTypes } from '@/lib/services/carService'
import CarsByBodyTypeServerSection from './CarsByBodyTypeServerSection'
import HeroSearchSection from './HeroSearchSection'

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

const getFeaturedCarBrands = async () => {
    try {
        const response = await fetch(`${process.env.BACKEND}/wp-json/wp/v2/car_brand?per_page=8&orderby=count&order=desc`, {
            next: { revalidate: 3600 }, // Cache for 1 hour
            headers: {
                'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=7200'
            }
        })
        
        if (!response.ok) {
            throw new Error(`Failed to fetch brands: ${response.status}`)
        }
        
        const brands = await response.json()
        
        // Fetch featured images for each brand
        const brandsWithImages = await Promise.all(
            brands.map(async (brand) => {
                let imageUrl = null
                
                try {
                    // Check if we have a featured_image (which contains the ID)
                    if (brand.acf?.featured_image) {
                        imageUrl = await getFeaturedImage(brand.acf.featured_image)
                    }
                } catch (error) {
                    console.error(`Error fetching image for brand ${brand.name}:`, error)
                }
                
                return {
                    id: brand.id,
                    name: brand.name,
                    slug: brand.slug,
                    count: brand.count,
                    featuredImageUrl: imageUrl
                }
            })
        )
        
        return brandsWithImages
    } catch (error) {
        console.error('Error fetching car brands:', error)
        return []
    }
}

const FeaturedPostCard = ({ post, language }) => (
    <Link 
        href={`/${language}/${post.slug}`}
        className="group block h-full"
    >
        <article className="relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col lg:flex-row border border-slate-200">
            {/* Image Section */}
            <div className="relative lg:w-3/5 h-64 lg:h-full"> {/* Added fixed height for small screens, full height for large */}
                {post.image_url && (
                    <div className="relative w-full h-full"> {/* Ensure this div takes full space of its parent */}
                        <Image
                            src={post.image_url}
                            alt={post.image_alt || post.title}
                            fill
                            sizes="(max-width: 1023px) 100vw, 60vw" // Added sizes attribute for optimization
                            className="object-cover transform group-hover:scale-105 transition-transform duration-300 ease-out"
                            priority // Keep priority for LCP element
                        />
                        {post.category && (
                            <span className="absolute top-4 left-4 bg-red-100 text-red-700 px-2.5 py-1 text-xs font-semibold rounded-full shadow-sm">
                                {post.category}
                            </span>
                        )}
                    </div>
                )}
            </div>
            {/* Content Section */}
            <div className="lg:w-2/5 p-6 flex flex-col justify-center">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 group-hover:text-red-700 transition-colors duration-300 line-clamp-3">
                    {post.title}
                </h2>
                {post.excerpt && (
                    <p className="text-slate-600 line-clamp-3 text-base leading-relaxed mb-4">
                        {post.excerpt}
                    </p>
                )}
                <div className="text-sm text-slate-500 mt-auto"> {/* Pushes date to bottom */}
                    {post.date && (
                        <time dateTime={new Date(post.date).toISOString()}> {/* Added dateTime attribute */}
                            {new Date(post.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                        </time>
                    )}
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
        <article className="relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex border border-slate-200">
            {/* Image Section */}
            <div className="relative w-2/5 flex-shrink-0"> {/* Added flex-shrink-0 */}
                {post.image_url && (
                    <div className="relative h-full aspect-[4/3]"> {/* Added aspect ratio for consistent image size */}
                        <Image
                            src={post.image_url}
                            alt={post.image_alt || post.title}
                            fill
                            sizes="40vw" // Added sizes attribute for optimization
                            className="object-cover transform group-hover:scale-105 transition-transform duration-300 ease-out"
                        />
                        {post.category && (
                             <span className="absolute top-2 left-2 bg-red-100 text-red-700 px-2 py-0.5 text-xs font-semibold rounded-full shadow-sm">
                                {post.category}
                            </span>
                        )}
                    </div>
                )}
            </div>
            {/* Content Section */}
            <div className="flex-1 p-4 flex flex-col justify-center">
                <h2 className="text-sm sm:text-base md:text-lg font-semibold mb-1.5 group-hover:text-red-700 transition-colors duration-300 line-clamp-2">
                    {post.title}
                </h2>
                {post.date && (
                    <time dateTime={new Date(post.date).toISOString()} className="text-xs text-slate-500 mt-auto"> {/* Pushes date to bottom, added dateTime */}
                        {new Date(post.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </time>
                )}
            </div>
        </article>
    </Link>
)

const BrandCard = ({ brand }) => (
    <Link 
        href={`/cars/${brand.slug}`}
        className="group block"
    >
        <div className="bg-white p-6 rounded-xl border border-slate-200 hover:border-red-600 hover:shadow-lg transition-all duration-300 text-center h-full">
            {/* Brand Logo */}
            <div className="mb-4">
                {brand.featuredImageUrl ? (
                    <div className="relative w-16 h-16 mx-auto">
                        <Image 
                            src={brand.featuredImageUrl} 
                            alt={`${brand.name} logo`}
                            fill
                            sizes="64px"
                            className="object-contain group-hover:scale-110 transition-transform duration-300"
                            loading="lazy"
                        />
                    </div>
                ) : (
                    <div className="w-16 h-16 flex items-center justify-center bg-slate-100 rounded-full mx-auto group-hover:bg-red-50 transition-colors duration-300">
                        <span className="text-xl font-bold text-slate-500 group-hover:text-red-600">
                            {brand.name?.charAt(0) || '?'}
                        </span>
                    </div>
                )}
            </div>
            
            {/* Brand Information */}
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-slate-900 group-hover:text-red-600 transition-colors duration-300 mb-1">
                {brand.name}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
                {brand.count ? `${brand.count} models` : 'View models'}
            </p>
        </div>
    </Link>
)





const HomePage = async () => {
    // In a real app, you'd handle potential errors from these fetches
    const [englishPosts, hindiPosts, featuredBrands, bodyTypes] = await Promise.all([
        getEnglishPosts(),
        getHindiPosts(),
        getFeaturedCarBrands(),
        getCarBodyTypes()
    ]).catch(err => {
        console.error("Error fetching data:", err);
        // Return empty arrays or some default state if fetching fails
        return [[], [], [], []]; 
    });

    // Handle cases where posts might be empty to avoid errors
    const firstEnglishPost = englishPosts && englishPosts.length > 0 ? englishPosts[0] : null;
    const otherEnglishPosts = englishPosts && englishPosts.length > 1 ? englishPosts.slice(1, 3) : [];
    
    const firstHindiPost = hindiPosts && hindiPosts.length > 0 ? hindiPosts[0] : null;
    const otherHindiPosts = hindiPosts && hindiPosts.length > 1 ? hindiPosts.slice(1, 3) : [];

    return (
        <div className="bg-slate-50 min-h-screen"> {/* Ensures background covers screen */}
            {/* Hero Search Section */}
            <HeroSearchSection />
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 max-w-7xl">
            
            {/* Featured Car Brands Section */}
            {featuredBrands && featuredBrands.length > 0 && (
            <section aria-labelledby="featured-brands-title">
                <div className="flex justify-between items-center mb-6">
                    <h2 id="featured-brands-title" className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800">Featured Car Brands</h2>
                    <Link 
                        href="/cars"
                        className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-1.5 hover:underline"
                    >
                        View All Brands
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                    {featuredBrands.map(brand => (
                        <BrandCard key={brand.id} brand={brand} />
                    ))}
                </div>
            </section>
            )}
            
            {/* Cars by Body Type Section */}
            <CarsByBodyTypeServerSection />
            
            {/* English Section */}
            {firstEnglishPost && ( 
            <section aria-labelledby="latest-articles-title"> 
                <div className="flex justify-between items-center mb-6">
                    <h2 id="latest-articles-title" className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800">Latest Articles</h2>
                    <Link 
                        href="/articles"
                        className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-1.5 hover:underline"
                    >
                        View All
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </Link>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-7 xl:col-span-8"> 
                        <FeaturedPostCard post={firstEnglishPost} language="articles" />
                    </div>
                    <div className="lg:col-span-5 xl:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                    {otherEnglishPosts.map(post => (
                        <PostCard key={post.id} post={post} language="articles" />
                    ))}
                    </div>
                </div>
            </section>
            )}

            {/* Hindi Section */}
            {firstHindiPost && ( // Only render section if there's a post
            <section aria-labelledby="hindi-लेख-title"> {/* Added aria-labelledby */}
                <div className="flex justify-between items-center mb-6">
                    <h2 id="hindi-लेख-title" className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800">हिंदी लेख</h2>
                    <Link 
                        href="/hindi"
                        className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-1.5 hover:underline"
                    >
                        सभी देखें
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </Link>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-7 xl:col-span-8"> {/* Adjusted span */}
                        <FeaturedPostCard post={firstHindiPost} language="hindi" />
                    </div>
                    <div className="lg:col-span-5 xl:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
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