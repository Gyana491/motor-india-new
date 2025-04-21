import Link from 'next/link';
import ThreeSixtyViewerEnhanced from '../../components/ThreeSixtyViewerEnhanced';

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

export default async function InteriorThreeSixtyViewPage({ params }) {
  const paramsObj = await params;
  const { brand, model } = paramsObj;
  const data = await getModelDetails(brand, model);
  
  if (!data || !data.posts || data.posts.length === 0) {
    return (
      <main className="container mx-auto px-4 py-6 sm:py-8">
        <h1 className="text-xl sm:text-2xl font-bold mb-4">Interior 360° View not found</h1>
        <p>Sorry, we couldn&apos;t find interior 360° views for {brand} {model}.</p>
        <Link href={`/cars/${brand}/${model}/360-view`} className="text-red-600 hover:underline inline-block mt-3">
          Return to 360° Overview
        </Link>
      </main>
    );
  }
  
  const modelData = data.posts[0];
  const threeSixtyView = modelData['360-view'] || {};
  const { title = `${brand} ${model}` } = modelData;
  
  const hasExterior = !!threeSixtyView.exterior;
  const hasInterior = !!threeSixtyView.interior;
  
  if (!hasInterior) {
    return (
      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mb-4">
          <Link href={`/cars/${brand}/${model}/360-view`} className="text-red-600 hover:underline flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to 360° View
          </Link>
        </div>
        
        <div className="bg-white shadow-md p-6 sm:p-8 rounded-lg text-center border border-gray-200">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h2 className="text-lg sm:text-xl font-bold mb-2">Interior 360° View Not Available</h2>
          <p className="text-gray-600 mb-4">The interior 360° view for {brand} {model} is currently unavailable.</p>
          <Link href={`/cars/${brand}/${model}/360-view`} className="inline-block px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
            Return to 360° Overview
          </Link>
        </div>
      </main>
    );
  }
  
  return (
    <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
      <div className="mb-4 sm:mb-6">
        <Link href={`/cars/${brand}/${model}/360-view`} className="text-red-600 hover:underline flex items-center gap-1 text-sm sm:text-base">
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to 360° Overview
        </Link>
      </div>
      
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-4 sm:p-6 rounded-lg mb-5 sm:mb-8">
        <div className="flex justify-between items-start flex-col sm:flex-row gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3">{title} Interior 360° View</h1>
            <p className="text-gray-300 max-w-3xl text-sm sm:text-base">
              Step inside the {brand} {model} and experience the cabin in this immersive 360-degree interior view. 
              Explore the dashboard, seating, and in-car technology without visiting a showroom.
            </p>
          </div>
          
          {hasExterior && (
            <div className="bg-gray-800/50 inline-flex p-1 rounded-lg self-end sm:self-center">
              <Link 
                href={`/cars/${brand}/${model}/360-view/exterior`}
                className="px-3 py-1.5 text-sm font-medium rounded-md hover:bg-gray-700/50"
              >
                Exterior
              </Link>
              <span className="bg-blue-600 text-white px-3 py-1.5 text-sm font-medium rounded-md">Interior</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg overflow-hidden border border-gray-200">
            <div className="bg-gray-50 p-2 sm:p-3 border-b border-gray-200">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="bg-blue-100 p-1.5 sm:p-2 rounded-full text-blue-600">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Click/touch and drag to rotate | Pinch or scroll to zoom | Tap fullscreen for immersive view</p>
                </div>
              </div>
            </div>
            
            <div className="p-2 sm:p-4 md:p-6">
              <ThreeSixtyViewerEnhanced 
                threeSixtyView={{ interior: threeSixtyView.interior }} 
                title={title} 
                brand={brand} 
                model={model} 
                isFullPage={true} 
                viewType="interior"
              />
            </div>
          </div>
          
          <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="text-blue-600 mt-1">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-700 text-sm sm:text-base">Pro tip:</p>
                <p className="text-xs sm:text-sm text-gray-600">
                  Explore the dashboard layout, seating materials, cabin space, and tech features while looking around the interior. 
                  Tap the fullscreen button for the most immersive experience.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:w-1/3 mt-4 lg:mt-0">
          <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 shadow-sm overflow-hidden sticky top-4">
            <div className="bg-gray-50 p-3 sm:p-4 border-b border-gray-200">
              <h2 className="font-semibold text-base sm:text-lg flex items-center gap-1.5 sm:gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
                About this Interior View
              </h2>
            </div>
            
            <div className="p-3 sm:p-4">
              <div className="space-y-3 mb-4">
                <h3 className="font-semibold text-sm text-gray-700">Key Interior Features</h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="p-1 rounded-full bg-blue-50 text-blue-600 mt-0.5">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-600">Complete 360° cabin view</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="p-1 rounded-full bg-blue-50 text-blue-600 mt-0.5">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-600">Zoom capability to examine details</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="p-1 rounded-full bg-blue-50 text-blue-600 mt-0.5">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-600">High-resolution dashboard exploration</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="space-y-2">
                  {hasExterior && (
                    <Link
                      href={`/cars/${brand}/${model}/360-view/exterior`}
                      className="block w-full text-center py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors font-medium text-sm sm:text-base"
                    >
                      View Exterior 360°
                    </Link>
                  )}
                  
                  <Link 
                    href={`/cars/${brand}/${model}/360-view`}
                    className="block w-full text-center py-2.5 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors font-medium text-sm sm:text-base"
                  >
                    Return to Combined View
                  </Link>
                  
                  <Link 
                    href={`/cars/${brand}/${model}`}
                    className="block w-full text-center py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm sm:text-base"
                  >
                    Back to {model} Overview
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export async function generateMetadata({ params }) {
  const paramsObj = await params;
  const { brand, model } = paramsObj;
  
  return {
    title: `${brand} ${model} Interior 360° View - Virtual Cabin Tour | Motor India`,
    description: `Step inside the ${brand} ${model} with our interactive 360° interior view. Explore the cabin, dashboard, seating, and tech features before visiting a showroom.`,
    openGraph: {
      title: `${brand} ${model} - Interior 360° Virtual Tour`,
      description: `Take a virtual tour inside the ${brand} ${model} with our interactive 360° view. Explore the cabin space and interior design.`,
      images: [
        {
          url: "/path/to/interior-image.jpg",
          width: 1200,
          height: 630,
          alt: `${brand} ${model} interior 360 view`
        }
      ]
    },
    alternates: {
      canonical: `/cars/${brand}/${model}/360-view/interior`
    }
  };
}