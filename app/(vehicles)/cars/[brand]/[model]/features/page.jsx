import Link from 'next/link';
import Image from 'next/image';

async function getModelDetails(brand, model) {
  try {
    const slug = `${brand}-${model}`.toLowerCase().replace(/\s+/g, '-');
    const response = await fetch(`${process.env.BACKEND}/wp-json/api/car?slug=${slug}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching car details:", error);
    return { posts: [] };
  }
}

// Helper function to extract features from variant data
function extractFeatures(variants) {
  if (!Array.isArray(variants) || variants.length === 0) {
    return {};
  }
  
  // Combine all variant attributes to get a complete feature set
  const allFeatures = {};
  
  // Categories we want to extract
  const categories = {
    safety: ['airbags', 'abs', 'ebd', 'esc', 'hill-assist', 'isofix', 'tpms', 'crash-rating'],
    comfort: ['climate-control', 'seat-adjustment', 'ventilated-seats', 'sunroof', 'wireless-charging'],
    technology: ['infotainment', 'smartphone-connectivity', 'digital-cluster', 'sound-system', 'voice-control'],
    convenience: ['keyless-entry', 'cruise-control', 'rain-sensing-wipers', 'auto-headlamps', 'parking-sensors']
  };
  
  // Extract features from all variants
  variants.forEach(variant => {
    Object.keys(variant).forEach(key => {
      if (variant[key] && typeof variant[key] !== 'object') {
        allFeatures[key] = variant[key];
      }
    });
  });
  
  // Organize features by category
  const organizedFeatures = {};
  
  Object.entries(categories).forEach(([category, featureKeys]) => {
    organizedFeatures[category] = [];
    
    featureKeys.forEach(featureKey => {
      // Find matching feature in allFeatures
      const matchingKey = Object.keys(allFeatures).find(k => 
        k.toLowerCase().includes(featureKey.toLowerCase())
      );
      
      if (matchingKey) {
        const value = allFeatures[matchingKey];
        const available = value === 'Yes' || value === 'yes' || value === true || value > 0;
        
        organizedFeatures[category].push({
          name: matchingKey.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
          available,
          description: `${matchingKey.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} feature`,
          value
        });
      }
    });
    
    // If no features found for this category, add some default ones
    if (organizedFeatures[category].length === 0) {
      if (category === 'safety') {
        organizedFeatures[category] = [
          { name: 'Multiple Airbags', available: true, description: 'Front, side and curtain airbags for comprehensive protection' },
          { name: 'ABS with EBD', available: true, description: 'Anti-lock Braking System with Electronic Brake-force Distribution' },
          { name: 'Electronic Stability Control', available: true, description: 'Helps maintain control during emergency maneuvers' }
        ];
      } else if (category === 'comfort') {
        organizedFeatures[category] = [
          { name: 'Climate Control', available: true, description: 'Maintains your preferred cabin temperature' },
          { name: 'Power Adjustable Seats', available: true, description: 'Electrically adjustable driver and passenger seats' }
        ];
      } else if (category === 'technology') {
        organizedFeatures[category] = [
          { name: 'Touchscreen Infotainment', available: true, description: 'Control entertainment, navigation and vehicle settings' },
          { name: 'Smartphone Connectivity', available: true, description: 'Apple CarPlay and Android Auto integration' }
        ];
      } else if (category === 'convenience') {
        organizedFeatures[category] = [
          { name: 'Keyless Entry', available: true, description: 'Access your vehicle without taking out your key' },
          { name: 'Parking Sensors', available: true, description: 'Alerts when approaching obstacles while parking' }
        ];
      }
    }
  });
  
  return organizedFeatures;
}

export default async function FeaturesPage({ params }) {
  // Await params before destructuring
  const paramsObj = await params;
  const { brand, model } = paramsObj;
  
  const data = await getModelDetails(brand, model);
  
  // Check if we have posts and a first post
  if (!data || !data.posts || data.posts.length === 0) {
    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Features not found</h1>
        <p>Sorry, we couldn't find features for {brand} {model}.</p>
        <Link href={`/cars/${brand}/${model}`} className="text-red-600 hover:underline">
          Return to {model} Overview
        </Link>
      </main>
    );
  }
  
  const modelData = data.posts[0];
  const { variants = [], images = {} } = modelData;
  
  // Extract features from variants
  const features = extractFeatures(variants);
  
  // Get some interior images for the feature highlights
  const interiorImages = images.interior || {};
  const interiorImageArray = Object.values(interiorImages)
    .filter(img => img && img.url && img.alt)
    .slice(0, 4);

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
      
      <h1 className="text-3xl font-bold mb-6">{brand} {model} Features</h1>
      
      {/* Feature Highlights */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Feature Highlights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">Safety & Security</h3>
              <ul className="space-y-3">
                {features.safety.slice(0, 3).map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className={`mt-1 text-lg ${feature.available ? 'text-green-500' : 'text-gray-400'}`}>
                      {feature.available ? '✓' : '×'}
                    </span>
                    <div>
                      <p className="font-medium">{feature.name}</p>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">Comfort & Convenience</h3>
              <ul className="space-y-3">
                {features.comfort.slice(0, 3).map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className={`mt-1 text-lg ${feature.available ? 'text-green-500' : 'text-gray-400'}`}>
                      {feature.available ? '✓' : '×'}
                    </span>
                    <div>
                      <p className="font-medium">{feature.name}</p>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* Interior Images with Features */}
      {interiorImageArray.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Interior Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {interiorImageArray.map((image, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold">{image.alt}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      
      {/* Detailed Features */}
      {Object.entries(features).map(([category, featureList]) => (
        <section key={category} className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 capitalize">{category} Features</h2>
          <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featureList.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      feature.available ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {feature.available ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                      ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{feature.name}</h3>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
        </div>
        </section>
      ))}
      
      {/* Variant-wise Features Comparison */}
      {variants.length > 1 && (
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Features by Variant</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-3 px-4 text-left border-b">Feature</th>
                  {variants.slice(0, 3).map((variant, index) => (
                    <th key={index} className="py-3 px-4 text-center border-b">
                      {variant['variant-name'] || `Variant ${index + 1}`}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Dynamic feature comparison based on common attributes */}
                {['Airbags', 'Sunroof', 'Infotainment', 'Climate Control', 'Seat Upholstery'].map((featureName, idx) => {
                  const featureKey = featureName.toLowerCase().replace(/\s+/g, '-');
                  return (
                    <tr key={featureKey} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="py-3 px-4 border-b font-medium">{featureName}</td>
                      {variants.slice(0, 3).map((variant, variantIdx) => {
                        // Try to find matching feature in variant
                        const matchingKey = Object.keys(variant).find(k => 
                          k.toLowerCase().includes(featureKey)
                        );
                        const value = matchingKey ? variant[matchingKey] : '-';
                        return (
                          <td key={variantIdx} className="py-3 px-4 text-center border-b">
                            {value === true || value === 'Yes' || value === 'yes' ? '✓' : 
                             value === false || value === 'No' || value === 'no' ? '✗' : value || '-'}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-4">
            <Link 
              href={`/cars/${brand}/${model}/variants`}
              className="text-red-600 hover:underline"
            >
              View All Variants
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}

export async function generateMetadata({ params }) {
  // Await params before destructuring
  const paramsObj = await params;
  const { brand, model } = paramsObj;
  
  return {
    title: `${brand} ${model} Features & Equipment | Motor India`,
    description: `Explore all features and equipment of ${brand} ${model} including safety, comfort, technology and convenience features across all variants.`,
    openGraph: {
      title: `${brand} ${model} - Features & Equipment`,
      description: `Complete list of features and equipment available on the ${brand} ${model}.`
    }
  };
} 