import Link from 'next/link';

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

export default async function SpecificationsPage({ params }) {
  // Await params before destructuring
  const paramsObj = await params;
  const { brand, model } = paramsObj;
  const data = await getModelDetails(brand, model);
  
  // Check if we have posts and a first post
  if (!data || !data.posts || data.posts.length === 0) {
    return (
      <main className="container mx-auto px-4 py-8">
          <div className="bg-gray-50 p-8 rounded-lg text-center">
            <p className="text-gray-600">We couldn&apos;t find any specifications for {brand} {model}.</p>
            <Link href={`/cars/${brand}/${model}`} className="text-red-600 hover:underline mt-4 inline-block">
              Return to {model} Overview
            </Link>
          </div>
      </main>
    );
  }
  
  const modelData = data.posts[0];
  const { keySpecs = {}, variants = [] } = modelData;
  
  // Get the first variant for detailed specs
  const baseVariant = variants[0] || {};
  
  // Create specification groups
  const specifications = {
    engine: {
      title: "Engine & Transmission",
      specs: {
        "Engine Type": baseVariant['engine-type'] || "Not Available",
        "Displacement": baseVariant.displacement || "Not Available",
        "Max Power": baseVariant['max-power'] || "Not Available",
        "Max Torque": baseVariant['max-torque'] || "Not Available",
        "Transmission": baseVariant.transmission || "Not Available",
        "Drivetrain": baseVariant['drive-type'] || "Not Available",
        "Emission Standard": "BS6 Phase 2"
      }
    },
    performance: {
      title: "Performance & Mileage",
      specs: {
        "Mileage": keySpecs.mileage || "Not Available",
        "Fuel Type": baseVariant['fuel-type'] || "Not Available",
        "Fuel Tank Capacity": baseVariant['fuel-capacity'] || "Not Available",
        "Top Speed": baseVariant['top-speed'] || "Not Available",
        "Acceleration (0-100 km/h)": baseVariant['0-100-kmph'] || "Not Available"
      }
    },
    dimensions: {
      title: "Dimensions & Capacity",
      specs: {
        "Length": baseVariant.length || "Not Available",
        "Width": baseVariant.width || "Not Available",
        "Height": baseVariant.height || "Not Available",
        "Wheelbase": baseVariant.wheelbase || "Not Available",
        "Ground Clearance": baseVariant['ground-clearance'] || "Not Available",
        "Boot Space": baseVariant['boot-space'] || "Not Available",
        "Seating Capacity": baseVariant['seating-capacity'] || "Not Available"
      }
    },
    suspension: {
      title: "Suspension, Steering & Brakes",
      specs: {
        "Front Suspension": baseVariant['suspension-front'] || "Not Available",
        "Rear Suspension": baseVariant['suspension-rear'] || "Not Available",
        "Front Brake": baseVariant['brakes-front'] || "Not Available",
        "Rear Brake": baseVariant['brakes-rear'] || "Not Available",
        "Steering Type": baseVariant['steering-type'] || "Not Available",
        "Turning Radius": baseVariant['minimum-turning-radius'] || "Not Available"
      }
    },
    tyres: {
      title: "Wheels & Tyres",
      specs: {
        "Tyre Size": baseVariant['tyre-size'] || "Not Available",
        "Wheel Size": baseVariant['wheel-size'] || "Not Available",
        "Tyre Type": baseVariant['tyre-type'] || "Not Available",
        "Alloy Wheels": baseVariant['alloy-wheels'] ? "Yes" : "No"
      }
    }
  };

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
      
      <h1 className="text-3xl font-bold mb-6">{brand} {model} Specifications</h1>
      
      {/* Key Specs Summary */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <h2 className="text-xl font-semibold mb-4">Key Specifications</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-sm">Mileage</p>
            <p className="font-semibold">{keySpecs.mileage || "Not Available"}</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-sm">Engine</p>
            <p className="font-semibold">{baseVariant['engine-type'] || "Standard"}</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-sm">Transmission</p>
            <p className="font-semibold">{baseVariant.transmission || "Manual/Auto"}</p>
                </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-sm">Fuel Type</p>
            <p className="font-semibold">{baseVariant['fuel-type'] || "Petrol"}</p>
          </div>
        </div>
      </div>
      
      {/* Detailed Specifications */}
      {Object.entries(specifications).map(([key, section]) => (
        <section key={key} className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
          <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
            <table className="min-w-full">
              <tbody>
                {Object.entries(section.specs).map(([specName, specValue], index) => (
                  <tr key={specName} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="py-3 px-4 border-b border-gray-200 font-medium w-1/3">{specName}</td>
                    <td className="py-3 px-4 border-b border-gray-200">{specValue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
      
      {/* Variant Comparison */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Specifications by Variant</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-3 px-4 text-left border-b">Variant</th>
                <th className="py-3 px-4 text-left border-b">Engine</th>
                <th className="py-3 px-4 text-left border-b">Power</th>
                <th className="py-3 px-4 text-left border-b">Torque</th>
                <th className="py-3 px-4 text-left border-b">Mileage</th>
              </tr>
            </thead>
            <tbody>
              {variants.slice(0, 5).map((variant, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="py-3 px-4 border-b">{variant['variant-name'] || 'Variant'}</td>
                  <td className="py-3 px-4 border-b">{variant['engine-type'] || 'Standard'}</td>
                  <td className="py-3 px-4 border-b">{variant['max-power'] || 'N/A'}</td>
                  <td className="py-3 px-4 border-b">{variant['max-torque'] || 'N/A'}</td>
                  <td className="py-3 px-4 border-b">{variant.mileage || 'Not Available'}</td>
                </tr>
              ))}
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
    </main>
  );
}

export async function generateMetadata({ params }) {
  // Await params before destructuring
  const paramsObj = await params;
  const { brand, model } = paramsObj;
  
  return {
    title: `${brand} ${model} Specifications & Technical Details | Motor India`,
    description: `Complete technical specifications of ${brand} ${model} including engine, performance, dimensions, suspension, and more. Get detailed information about all ${model} variants.`,
    openGraph: {
      title: `${brand} ${model} - Technical Specifications`,
      description: `Detailed technical specifications and performance data for the ${brand} ${model}.`
    }
  };
}