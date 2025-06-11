import Image from 'next/image'
import { getAllBrands, getFeaturedImage } from '@/app/lib/api';

// Using the centralized API function that includes proper caching
export default async function Cars() {
  const brands = await getAllBrands();

  // Fetch featured images for each brand using cached getFeaturedImage
  const brandsWithImages = await Promise.all(
    brands.map(async (brand) => {
      let imageUrl = null;
      
      if (brand.acf?.featured_image) {
        imageUrl = await getFeaturedImage(brand.acf.featured_image);
      }
      
      return {
        ...brand,
        featuredImageUrl: imageUrl
      };
    })
  );

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">New Cars</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {brandsWithImages.map(brand => (
          <a 
            key={brand.id}
            href={`/cars/${brand.slug}`}
            className="p-4 border rounded-lg hover:shadow-lg transition-shadow"
          >
            {brand.featuredImageUrl && (
              <div className="aspect-w-16 aspect-h-9 mb-4">
                <Image
                  src={brand.featuredImageUrl}
                  alt={brand.title?.rendered || 'Car brand'}
                  width={300}
                  height={169}
                  className="object-cover rounded"
                />
              </div>
            )}
            <h2 className="text-lg font-semibold">
              {brand.title?.rendered || 'Brand Name'}
            </h2>
          </a>
        ))}
      </div>
    </main>
  );
}

// Add metadata for SEO with cache headers
export async function generateMetadata() {
  return {
    title: 'Browse All Car Brands | Motor India',
    description: 'Explore all car brands available in India. Find detailed information, specifications, prices, and more for your favorite car brands.',
    openGraph: {
      title: 'Browse All Car Brands | Motor India',
      description: 'Explore all car brands available in India. Find detailed information, specifications, prices, and more for your favorite car brands.',
      type: 'website',
    },
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=7200'
    }
  }
}