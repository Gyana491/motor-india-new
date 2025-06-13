import Image from 'next/image'
import Link from 'next/link'
import { getFeaturedImage } from '@/lib/api'

const getAllBrands = async () => {
  try {
    const response = await fetch(`${process.env.BACKEND}/wp-json/wp/v2/car_brand?per_page=100`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=7200'
      }
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch brands: ${response.status}`)
    }
    
    const brands = await response.json()
    return brands
  } catch (error) {
    console.error('Error fetching car brands:', error)
    return []
  }
}

export default async function Cars() {
  const brands = await getAllBrands()

  // Handle case where no brands are available
  if (!brands || brands.length === 0) {
    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">New Cars</h1>
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg mb-4">No car brands available at the moment.</p>
          <p className="text-gray-500">Please check back later.</p>
        </div>
      </main>
    )
  }

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
        ...brand,
        featuredImageUrl: imageUrl
      }
    })
  )

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 text-gray-900">New Cars</h1>
        <p className="text-gray-600 text-lg">
          Explore all car brands available in India. Find detailed information, specifications, 
          and pricing for your favorite automotive brands.
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {brandsWithImages.map(brand => (
          <Link 
            key={brand.id}
            href={`/cars/${brand.slug}`}
            className="group p-6 border border-gray-200 rounded-lg hover:shadow-lg hover:border-red-600 transition-all duration-300 bg-white"
          >
            {/* Brand Logo or Fallback */}
            <div className="mb-4">
              {brand.featuredImageUrl ? (
                <Image 
                  src={brand.featuredImageUrl} 
                  alt={`${brand.name} logo`}
                  width={80}
                  height={80}
                  className="w-20 h-20 object-contain mx-auto group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              ) : (
                <div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded-full mx-auto group-hover:bg-red-50 transition-colors duration-300">
                  <span className="text-2xl font-bold text-gray-500 group-hover:text-red-600">
                    {brand.name?.charAt(0) || '?'}
                  </span>
                </div>
              )}
            </div>
            
            {/* Brand Information */}
            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-900 group-hover:text-red-600 transition-colors duration-300 mb-1">
                {brand.name}
              </h2>
              <p className="text-sm text-gray-500">
                {brand.count ? `${brand.count} models` : 'View models'}
              </p>
            </div>
          </Link>
        ))}
      </div>
      
      {/* Additional Information Section */}
      <div className="mt-12 bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          Find Your Perfect Car
        </h2>
        <p className="text-gray-600">
          Browse through India&apos;s most popular car brands. Compare specifications, 
          check prices in your city, and find the perfect vehicle that matches your needs and budget.
        </p>
      </div>
    </main>
  )
}

// Add metadata for SEO
export async function generateMetadata() {
  return {
    title: 'Browse All Car Brands | Motor India - Find Your Perfect Car',
    description: 'Explore all car brands available in India. Find detailed information, specifications, prices, and more for your favorite car brands. Compare models and get the best deals.',
    keywords: 'car brands India, new cars, car models, car specifications, car prices, automotive brands, motor india',
    openGraph: {
      title: 'Browse All Car Brands | Motor India',
      description: 'Explore all car brands available in India. Find detailed information, specifications, prices, and more for your favorite car brands.',
      type: 'website',
      url: '/cars',
    },
    alternates: {
      canonical: '/cars',
    },
    robots: {
      index: true,
      follow: true,
    }
  }
}