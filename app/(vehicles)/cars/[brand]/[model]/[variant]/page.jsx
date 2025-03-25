export default async function VariantDetailPage({ params }) {
  // Await params before destructuring
  const paramsObj = await params;
  const { brand, model, variant } = paramsObj;

  async function getVariantDetails(brand, model, variant) {
    const slug = `${brand}-${model}-${variant}`.toLowerCase().replace(/\s+/g, '-');
    const response = await fetch(`${process.env.BACKEND}/wp-json/api/variant?slug=${slug}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch variant details: ${response.status}`);
    }
  
    return response.json();
  }

  try {
    const variantData = await getVariantDetails(brand, model, variant);
    const { title, price, formatted_price, body_type, image_url, image_alt, attributes } = variantData;

    // Helper function to get attribute value by name
    const getAttributeValue = (attributeName) => {
      const attr = attributes.find(a => a.attribute_name === attributeName);
      return attr ? attr.attribute_values[0] : null;
    };

    // Get fuel type to determine which specs to show
    const fuelType = getAttributeValue('Fuel Type');
    const isElectric = fuelType?.toLowerCase() === 'electric';

    // Dynamic specs based on fuel type
    const getKeySpecs = () => {
      if (isElectric) {
        return [
          { label: 'Range', value: getAttributeValue('Range'), icon: '⚡' },
          { label: 'Battery Capacity', value: getAttributeValue('Battery Capacity'), icon: '🔋' },
          { label: 'Charging Time', value: getAttributeValue('Charging Time'), icon: '⚡' },
          { label: 'Motor Power', value: getAttributeValue('Motor Power'), icon: '💪' },
        ];
      }
      return [
        { label: 'Mileage (City)', value: getAttributeValue('Mileage (City)'), icon: '🛣️' },
        { label: 'Engine', value: getAttributeValue('Engine Type'), icon: '⚙️' },
        { label: 'Transmission', value: getAttributeValue('Transmission'), icon: '🔄' },
        { label: 'Fuel Capacity', value: getAttributeValue('Fuel Capacity'), icon: '⛽' },
      ];
    };

    // Key features that are important for the vehicle
    const keyFeatures = [
      { label: 'Safety Rating', value: getAttributeValue('Global NCAP Safety Rating'), icon: '🛡️' },
      { label: 'Boot Space', value: getAttributeValue('Boot Space'), icon: '🛄' },
      { label: 'Ground Clearance', value: getAttributeValue('Ground Clearance (Unladen)'), icon: '📏' },
      { label: 'Seating Capacity', value: getAttributeValue('Seating Capacity'), icon: '👥' },
    ];

    // Declare globalNCAP for safety rating badge
    const globalNCAP = getAttributeValue('Global NCAP Safety Rating');

    // Determine if the current variant qualifies for a badge ("Top Variant" or "ASE Variant")
    const variantBadge = (() => {
      const variantLower = variant.toLowerCase();
      if (variantLower.includes('top')) return 'Top Variant';
      if (variantLower.includes('ase')) return 'ASE Variant';
      return null;
    })();

    // Group attributes by their group for detailed specs
    const groupedAttributes = attributes.reduce((acc, attr) => {
      if (!acc[attr.attribute_group]) {
        acc[attr.attribute_group] = [];
      }
      acc[attr.attribute_group].push(attr);
      return acc;
    }, {});

    return (
      <main className="container mx-auto px-4 md:px-6 py-8 md:py-10">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-white to-gray-100 border border-gray-200 rounded-2xl p-4 md:p-8 shadow-lg mb-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Mobile: Vehicle Image on top; Desktop: Details on left */}
            <div className="order-1 md:order-2 md:w-1/2 w-full">
              {image_url && (
                <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                  <img 
                    src={image_url} 
                    alt={image_alt || title}
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}
            </div>
            <div className="order-2 md:order-1 flex-1 space-y-6">
              <h1 className="text-2xl md:text-4xl font-bold text-gray-800">{title}</h1>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-3">
                <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                  isElectric ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {fuelType}
                </span>
                <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                  {body_type}
                </span>
              </div>
              
              {/* Safety Rating Badge */}
              {globalNCAP && (
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                    Global NCAP: {globalNCAP}
                  </span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${i < parseInt(globalNCAP) ? 'text-blue-600' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              )}

              {/* Top/ASE Variant Badge */}
              {variantBadge && (
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-4 py-2 rounded-full bg-yellow-100 text-yellow-700 text-sm font-medium">
                    {variantBadge}
                  </span>
                </div>
              )}
              
              {/* Price Section */}
              <div className="bg-white rounded-2xl p-4 md:p-6 shadow-md border border-gray-100">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl md:text-4xl font-bold text-red-500">{formatted_price}</span>
                  <span className="text-base text-gray-500">Ex-showroom Price</span>
                </div>
                <button className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-xl 
                                   transition transform hover:scale-105 duration-300 flex items-center justify-center gap-2">
                  Book Test Drive
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Key Specs Section */}
        <section className="mb-12">
          <h2 className="text-xl md:text-3xl font-semibold text-gray-800 mb-6">Key Specifications</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {getKeySpecs().map(({ label, value, icon }) => value && (
              <div key={label} className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition transform hover:scale-105 border border-gray-100">
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{icon}</span>
                  <div>
                    <dt className="text-gray-600 text-sm">{label}</dt>
                    <dd className="mt-1 text-lg font-semibold text-gray-800">{value}</dd>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Key Features Section */}
        <section className="mb-12">
          <h2 className="text-xl md:text-3xl font-semibold text-gray-800 mb-6">Key Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {keyFeatures.map(({ label, value, icon }) => value && (
              <div key={label} className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition transform hover:scale-105 border border-gray-100">
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{icon}</span>
                  <div>
                    <dt className="text-gray-600 text-sm">{label}</dt>
                    <dd className="mt-1 text-lg font-semibold text-gray-800">{value}</dd>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Detailed Specifications */}
        <section className="mb-12">
          <h2 className="text-xl md:text-3xl font-semibold text-gray-800 mb-6">Detailed Specifications</h2>
          {Object.entries(groupedAttributes).map(([groupName, groupAttributes]) => (
            <div key={groupName} className="mb-10">
              <h3 className="text-lg md:text-2xl font-semibold text-gray-700 mb-4">{groupName}</h3>
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                  {groupAttributes.map((attr) => (
                    <div key={attr.attribute_id} className="border-b border-gray-200 pb-3">
                      <dt className="text-gray-600 text-sm">{attr.attribute_name}</dt>
                      <dd className="mt-1 font-medium text-gray-800">
                        {Array.isArray(attr.attribute_values) 
                          ? attr.attribute_values.join(', ')
                          : attr.attribute_values}
                      </dd>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>
    );
  } catch (error) {
    console.error('Error fetching variant details:', error);
    throw error;
  }
}

// SEO Metadata generation with enhanced optimization
export async function generateMetadata({ params }) {
  // Await params before destructuring
  const paramsObj = await params;
  const { brand, model, variant } = paramsObj;
  const slug = `${brand}-${model}-${variant}`.toLowerCase().replace(/\s+/g, '-');
  const response = await fetch(`${process.env.BACKEND}/wp-json/api/variant?slug=${slug}`, {
    next: { revalidate: 3600 } // Cache for 1 hour
  });

  if (!response.ok) {
    return {
      title: 'Car Variant Not Found | Premium Cars',
      description: 'The requested car variant details are currently unavailable. Explore our wide range of luxury and premium cars.',
      robots: 'noindex, follow'
    };
  }

  const variantData = await response.json();
  const { title, body_type, formatted_price, image_url, image_alt, attributes } = variantData;

  // Extract key specs for rich description
  const engineType = attributes?.find(a => a.attribute_slug === 'pa_engine-type')?.attribute_values[0];
  const maxPower = attributes?.find(a => a.attribute_slug === 'pa_max-power')?.attribute_values[0];
  const colors = attributes?.find(a => a.attribute_slug === 'pa_colors')?.attribute_values;

  const metaDescription = `${title} ${body_type} - Available at ${formatted_price}. Features ${engineType || 'powerful engine'} producing ${maxPower || 'impressive power'}. Available in ${colors?.length || 'multiple'} stunning colors. Book a test drive today!`;

  return {
    title: `${title} - On Road Price, Features & Specifications | Premium Cars India`,
    description: metaDescription,
    keywords: `${brand} ${model}, ${variant}, luxury cars, premium vehicles, ${body_type}, new cars, car price, car specifications`,
    openGraph: {
      title: `${title} - Premium ${body_type} Car Details & Price`,
      description: metaDescription,
      type: 'website',
      url: `${process.env.SITE_BASE_URL}/new-cars/${brand}/${model}/${variant}`,
      images: [
        {
          url: image_url || '/default-car-image.jpg',
          alt: image_alt || `${title} - ${variant}`,
          width: 1200,
          height: 630
        }
      ],
      siteName: 'Premium Cars'
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} - Starting at ${formatted_price}`,
      description: metaDescription,
      images: [image_url || '/default-car-image.jpg'],
      creator: '@premiumcars'
    },
    alternates: {
      canonical: `${process.env.SITE_BASE_URL}/new-cars/${brand}/${model}/${variant}`
    },
    robots: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1
    }
  };
}