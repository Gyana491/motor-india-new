import Link from 'next/link';
import Image from 'next/image';
import ModelGallerySlider from './components/ModelGallerySlider';
import VariantsSection from './components/VariantsSection';
import ColorGallery from './components/ColorGallery';
import KeyHighlights from './components/KeyHighlights';
import OffRoadCapabilities from './components/OffRoadCapabilities';


async function getModelDetails(brand, model) {
  try {
    const slug = `${brand}-${model}`.toLowerCase().replace(/\s+/g, '-');
    const response = await fetch(`${process.env.BACKEND}/wp-json/api/car?slug=${slug}`, {
      next: { 
        revalidate: 300 // Revalidate every 5 minutes
      },
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=300, stale-while-revalidate=600'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }
    
    const data = await response.json();
    if (!data || !data.posts || data.posts.length === 0) {
      return null;
    }
    return data;
  } catch (error) {
    console.error("Error fetching car details:", error);
    return null;
  }
}

// Helper function to display mileage with fallback
function displayMileage(mileageValue) {
  return mileageValue || 'Not Available';
}

export default async function ModelPage({ params }) {
  const { brand, model } = await params;
  const data = await getModelDetails(brand, model);
  
  // Check if we have posts and a first post
  if (!data || !data.posts || data.posts.length === 0) {
    return (
      <main>
        <h1 className="text-2xl font-bold mb-4">Car model not found</h1>
      <p>Sorry, we couldn&apos;t find information for {brand} {model}.</p>
        <Link href="/cars" className="text-red-600 hover:underline">
          Browse all cars
        </Link>
      </main>
    );
  }
  
  const modelData = data.posts[0];
  
  // Extract key information with fallbacks for everything
  const {
    title = `${brand} ${model}`,
    image_url = "/placeholder-car.jpg",
    image_alt = `${brand} ${model}`,
    body_type = "Car",
    promo_video = null,
    price = { 
      min_price_formatted: "N/A", 
      max_price_formatted: "N/A" 
    },
    keySpecs = {},
    variants = [],
    images = {}, 
    "360-view": threeSixtyView = null
  } = modelData || {};

  // Ensure images subproperties exist with fallbacks
  const colorImages = images.colors || {};
  const exteriorImages = images.exterior || {};
  const interiorImages = images.interior || {};

  // Get unique fuel types (with safeguards)
  let fuelTypes = [];
  if (Array.isArray(variants)) {
    fuelTypes = [...new Set(variants.filter(v => v && v['fuel-type']).map(v => v['fuel-type']))];
  }
  
  // Find if it's an off-road vehicle (SUV with 4x4)
  const has4x4 = Array.isArray(variants) && variants.some(v => 
    v && v['variant-name'] && 
    (v['variant-name'].includes('4x4') || v['variant-name'].includes('AWD'))
  );
  const isOffRoader = body_type === 'SUV' && has4x4;

  // Prepare media for the gallery slider
  const galleryMedia = [];
  
  // Add featured image first
  if (image_url) {
    galleryMedia.push({
      type: 'image',
      url: image_url,
      alt: image_alt
    });
  }

  // Add promo video as second slide if available
  if (promo_video) {
    galleryMedia.push({
      type: 'video',
      url: promo_video,
      alt: `${title} Promo Video`
    });
  }
  
  // Add exterior images
  if (exteriorImages && typeof exteriorImages === 'object') {
    Object.values(exteriorImages)
      .filter(img => img && img.url && img.alt)
      .forEach(img => {
        galleryMedia.push({
          type: 'image',
          url: img.url,
          alt: img.alt
        });
      });
  }
  
  return (
    <div className="container mx-auto p">
      {/* Hero Section with Gallery Slider */}
      <div className="bg-gradient-to-br from-white to-gray-100 rounded-2xl p-2 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative rounded-lg overflow-hidden">
            <ModelGallerySlider media={galleryMedia} />
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">{title}</h1>
            
            {/* Price Range */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <p className="text-sm text-gray-600">Ex-Showroom Price</p>
              <p className="text-2xl font-bold text-red-600">
                {price.min_price_formatted} - {price.max_price_formatted}
              </p>
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <p className="text-sm text-gray-600">Body Type</p>
                <p className="font-semibold">{body_type}</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <p className="text-sm text-gray-600">Mileage</p>
                <p className="font-semibold">{keySpecs.mileage || 'Not Available'}</p>
              </div>
            </div>
            
            {/* Fuel Types */}
            {fuelTypes.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Available Fuel Types</h3>
                <div className="flex gap-2 flex-wrap">
                  {fuelTypes.map(fuel => (
                    <span 
                      key={fuel}
                      className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                    >
                      {fuel}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex gap-4">
              <Link
                href={`/cars/${brand}/${model}/variants`}
                className="flex-1 bg-red-600 text-white text-center py-3 rounded-lg hover:bg-red-700 transition-colors"
              >
                View Variants
              </Link>
              <button 
                className="flex-1 border-2 border-red-600 text-red-600 py-3 rounded-lg hover:bg-red-50 transition-colors"
              >
                Book Test Drive
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Column */}
        <div className="lg:col-span-2">
          {/* Key Highlights Section */}
          <KeyHighlights 
            keySpecs={keySpecs} 
            variants={variants} 
            price={price} 
            body_type={body_type} 
            isOffRoader={isOffRoader} 
          />

          {/* SUV Specific Section - Only show for SUVs */}
          {body_type === "SUV" && (
            <OffRoadCapabilities isOffRoader={isOffRoader} />
          )}

          {/* Available Colors Section */}
          {Object.keys(colorImages).length > 0 && (
            <ColorGallery 
              colorImages={colorImages} 
              title={title} 
              brand={brand} 
              model={model} 
            />
          )}

          {/* Popular Variants Section */}
          {Array.isArray(variants) && variants.length > 0 && (
            <VariantsSection 
              variants={variants} 
              brand={brand} 
              model={model} 
            />
          )}
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 space-y-4">
            {/* Quick Contact Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-4">Interested in {title}?</h3>
              <form className="space-y-3">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full p-2 border rounded-lg"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full p-2 border rounded-lg"
                />
                <button
                  className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Request Callback
                </button>
              </form>
            </div>

            {/* Similar Cars Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-4">Similar {body_type}s</h3>
              <div className="space-y-3">
                <p className="text-gray-600 text-sm">
                  Coming soon...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// SEO Metadata
export async function generateMetadata({ params }) {
  try {
    // Await params before destructuring
    const paramsObj = await params;
    const { brand, model } = paramsObj;
    
    const data = await getModelDetails(brand, model);
    
    // Handle case when no data is returned
    if (!data || !data.posts || data.posts.length === 0) {
      return {
        title: `${brand} ${model} - Not Found`,
        description: `Information about ${brand} ${model} could not be found.`
      };
    }
    
    const modelData = data.posts[0];
    const { 
      title = `${brand} ${model}`,
      body_type = "Car",
      price = {},
      image_url
    } = modelData || {};

    // Format the price range for description
    const priceDescription = price.min_price_formatted && price.max_price_formatted 
      ? `Price range: ${price.min_price_formatted} - ${price.max_price_formatted}` 
      : '';

    return {
      title: `${title} Price, Features & Specifications | Motor India`,
      description: `Explore ${title} ${body_type} features, specifications, colors, variants, and price. ${priceDescription}. Find the best deals on ${brand} ${model}.`,
      openGraph: {
        title: `${title} - ${body_type}`,
        description: `Explore ${title} ${body_type} features, specifications, colors, variants, and price. ${priceDescription}.`,
        images: image_url ? [{ url: image_url }] : []
      }
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Error",
      description: "An error occurred while generating metadata."
    };
  }
}