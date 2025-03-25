const getAllBrands = async () => {
  const response = await fetch(`${process.env.BACKEND}/wp-json/wp/v2/car_brand?per_page=100`, {
    next: { revalidate: 3600 } // Cache for 1 hour
  })
  
  if (!response.ok) {
    throw new Error(`Failed to fetch brands: ${response.status}`);
  }
  
  const brands = await response.json()
  return brands
}

export default async function Cars() {
  const brands = await getAllBrands()

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">New Cars</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {brands.map(brand => (
          <a 
            key={brand.id}
            href={`/cars/${brand.slug}`}
            className="p-4 border rounded-lg hover:shadow-lg transition-shadow"
          >
            {/* Use a fallback image or brand initial if no logo is available */}
            {brand.acf?.featured_image ? (
              <img 
                src={brand.acf.featured_image} 
                alt={brand.name}
                className="w-24 h-24 object-contain mx-auto mb-4"
              />
            ) : (
              <div className="w-24 h-24 flex items-center justify-center bg-gray-100 rounded-full mx-auto mb-4">
                <span className="text-3xl font-bold text-gray-500">{brand.name.charAt(0)}</span>
              </div>
            )}
            <h2 className="text-xl font-semibold text-center">{brand.name}</h2>
            <p className="text-sm text-center text-gray-500">{brand.count} models</p>
          </a>
        ))}
      </div>
    </main>
  )
}

// Add metadata for SEO
export async function generateMetadata() {
  return {
    title: 'Browse All Car Brands | Motor India',
    description: 'Explore all car brands available in India. Find detailed information, specifications, prices, and more for your favorite car brands.',
    openGraph: {
      title: 'Browse All Car Brands | Motor India',
      description: 'Explore all car brands available in India. Find detailed information, specifications, prices, and more for your favorite car brands.',
      type: 'website',
    }
  }
} 