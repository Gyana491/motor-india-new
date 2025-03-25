import Link from 'next/link';
import Image from 'next/image';

async function getModelImages(brand, model) {
  try {
    const slug = `${brand}-${model}`.toLowerCase().replace(/\s+/g, '-');
    const response = await fetch(`${process.env.BACKEND}/wp-json/api/car?slug=${slug}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      images: data.posts[0]?.images || {},
      threeSixtyView: data.posts[0]?.['360-view'] || {}
    };
  } catch (error) {
    console.error("Error fetching images:", error);
    return { images: {}, threeSixtyView: {} };
  }
}

export default async function ImagesPage({ params }) {
  // Await params before destructuring
  const paramsObj = await params;
  const { brand, model } = paramsObj;
  
  const { images: imagesData, threeSixtyView } = await getModelImages(brand, model);
  
  // Process image categories
  const imageCategories = {
    exterior: Object.values(imagesData.exterior || {}).filter(img => img && img.url && img.alt),
    interior: Object.values(imagesData.interior || {}).filter(img => img && img.url && img.alt),
    colors: Object.values(imagesData.colors || {}).filter(img => img && img.url && img.alt)
  };
  
  // Count total images
  const totalImages = Object.values(imageCategories).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href={`/cars/${brand}/${model}`} className="text-red-600 hover:underline flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to {model} Overview
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-6">{brand} {model} Image Gallery</h1>
      
      {totalImages > 0 ? (
        <>
          {/* Image Categories Navigation */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-4">
              {Object.entries(imageCategories).map(([category, images]) => 
                images.length > 0 && (
                  <a 
                    key={category}
                    href={`#${category}`}
                    className="px-4 py-2 bg-gray-100 rounded-full hover:bg-red-600 hover:text-white transition-colors"
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)} ({images.length})
                  </a>
                )
              )}
              {(threeSixtyView.exterior || threeSixtyView.interior) && (
                <a 
                  href="#360view"
                  className="px-4 py-2 bg-gray-100 rounded-full hover:bg-red-600 hover:text-white transition-colors"
                >
                  360° View
                </a>
              )}
            </div>
          </div>
          
          {/* Exterior Images */}
          {imageCategories.exterior.length > 0 && (
            <section id="exterior" className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">Exterior Images</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {imageCategories.exterior.map((image, index) => (
                  <div 
                    key={index}
                    className="group relative aspect-[4/3] rounded-lg overflow-hidden border border-gray-200"
                  >
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white font-medium">{image.alt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {/* Interior Images */}
          {imageCategories.interior.length > 0 && (
            <section id="interior" className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">Interior Images</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {imageCategories.interior.map((image, index) => (
          <div 
                    key={index}
                    className="group relative aspect-[4/3] rounded-lg overflow-hidden border border-gray-200"
          >
                    <Image
              src={image.url}
                      alt={image.alt}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white font-medium">{image.alt}</span>
            </div>
          </div>
        ))}
      </div>
            </section>
          )}
          
          {/* Color Images */}
          {imageCategories.colors.length > 0 && (
            <section id="colors" className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">Color Options</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {imageCategories.colors.map((image, index) => (
                  <div 
                    key={index}
                    className="group relative aspect-[4/3] rounded-lg overflow-hidden border border-gray-200"
                  >
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white font-medium">{image.alt}</span>
                    </div>
                    {image.hexcode && (
                      <div 
                        className="absolute bottom-3 right-3 w-8 h-8 rounded-full border-2 border-white"
                        style={{ backgroundColor: image.hexcode }}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Link 
                  href={`/cars/${brand}/${model}/colors`}
                  className="text-red-600 hover:underline"
                >
                  View All Colors
                </Link>
              </div>
            </section>
          )}
          
          {/* 360° View Section */}
          {(threeSixtyView.exterior || threeSixtyView.interior) && (
            <section id="360view" className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">360° View</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {threeSixtyView.exterior && (
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold mb-4">Exterior 360° View</h3>
                    <div className="aspect-video rounded-lg overflow-hidden">
                      <iframe
                        src={threeSixtyView.exterior}
                        className="w-full h-full"
                        title="Exterior 360° View"
                        loading="lazy"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}
                {threeSixtyView.interior && (
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold mb-4">Interior 360° View</h3>
                    <div className="aspect-video rounded-lg overflow-hidden">
                      <iframe
                        src={threeSixtyView.interior}
                        className="w-full h-full"
                        title="Interior 360° View"
                        loading="lazy"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}
        </>
      ) : (
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <p className="text-gray-600">Images for {brand} {model} are currently unavailable.</p>
          <Link href={`/cars/${brand}/${model}`} className="text-red-600 hover:underline mt-4 inline-block">
            Return to {model} Overview
          </Link>
        </div>
      )}
    </main>
  );
}

export async function generateMetadata({ params }) {
  // Await params before destructuring
  const paramsObj = await params;
  const { brand, model } = paramsObj;
  
  return {
    title: `${brand} ${model} Images - Exterior, Interior & Colors | Motor India`,
    description: `Browse high-quality images of ${brand} ${model} including exterior, interior and all available color options. See the ${model} from every angle.`,
    openGraph: {
      title: `${brand} ${model} - Image Gallery`,
      description: `Complete image gallery of the ${brand} ${model} showing exterior, interior and all color options.`
    }
  };
} 