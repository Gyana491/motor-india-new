import Link from 'next/link';
import ThreeSixtyViewerEnhanced from '../components/ThreeSixtyViewerEnhanced';

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

export default async function ThreeSixtyViewPage({ params }) {
  const paramsObj = await params;
  const { brand, model } = paramsObj;
  const data = await getModelDetails(brand, model);
  
  if (!data || !data.posts || data.posts.length === 0) {
    return (
      <main className="container mx-auto px-4 py-6 sm:py-8">
        <h1 className="text-xl sm:text-2xl font-bold mb-4">360° View not found</h1>
        <p>Sorry, we couldn&apos;t find 360° views for {brand} {model}.</p>
        <Link href={`/cars/${brand}/${model}`} className="text-red-600 hover:underline inline-block mt-3">
          Return to {model} Overview
        </Link>
      </main>
    );
  }
  
  const modelData = data.posts[0];
  const threeSixtyView = modelData['360-view'] || {};
  const { title = `${brand} ${model}` } = modelData;
  
  const hasExterior = !!threeSixtyView.exterior;
  const hasInterior = !!threeSixtyView.interior;
  const has360View = hasExterior || hasInterior;
  const hasBothViews = hasExterior && hasInterior;

  const quickNavLinks = [
    { href: `/cars/${brand}/${model}/specifications`, name: "Specifications", icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
    { href: `/cars/${brand}/${model}/variants`, name: "Variants", icon: "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" },
    { href: `/cars/${brand}/${model}/colors`, name: "Colors", icon: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" },
    { href: `/cars/${brand}/${model}/features`, name: "Features", icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" },
    { href: `/cars/${brand}/${model}/price-in/delhi`, name: "Price", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
    { href: `/cars/${brand}/${model}/images`, name: "Images", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" }
  ];

  return (
    <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
      <div className="mb-4 sm:mb-6">
        <Link href={`/cars/${brand}/${model}`} className="text-red-600 hover:underline flex items-center gap-1 text-sm sm:text-base">
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to {model} Overview
        </Link>
      </div>
      
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-4 sm:p-6 rounded-lg mb-5 sm:mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3">{title} 360° Experience</h1>
        <p className="text-gray-300 max-w-3xl text-sm sm:text-base">
          Immerse yourself in a complete virtual tour of the {brand} {model}. Explore every angle of the exterior design
          and step inside to experience the interior cabin space.
        </p>
        
        {hasBothViews && (
          <div className="mt-5 sm:mt-6 bg-gray-800/50 p-1.5 rounded-lg inline-flex">
            <Link 
              href={`/cars/${brand}/${model}/360-view/exterior`}
              className="py-2 px-4 rounded-md flex items-center gap-2 transition-colors font-medium text-sm sm:text-base hover:bg-red-500/20"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Exterior
            </Link>
            <Link 
              href={`/cars/${brand}/${model}/360-view/interior`}
              className="py-2 px-4 rounded-md flex items-center gap-2 transition-colors font-medium text-sm sm:text-base hover:bg-blue-500/20"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Interior
            </Link>
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        <div className="lg:w-2/3">
          {hasBothViews && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-3 sm:p-4 mb-4 sm:mb-6 rounded-r-lg">
              <div className="flex items-start sm:items-center">
                <div className="flex-shrink-0">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mt-0.5 sm:mt-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-2 sm:ml-3">
                  <p className="text-xs sm:text-sm text-blue-700">
                    <span className="font-medium">Both views available!</span> This car has both interior and exterior 360° views. Use the tabs above to view them separately.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {has360View ? (
            <div className="bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg overflow-hidden border border-gray-200">
              <div className="bg-gray-50 p-2 sm:p-3 border-b border-gray-200">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="bg-red-100 p-1.5 sm:p-2 rounded-full text-red-600">
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
                  threeSixtyView={threeSixtyView} 
                  title={title} 
                  brand={brand} 
                  model={model} 
                  isFullPage={true} 
                />
              </div>
            </div>
          ) : (
            <div className="bg-white shadow-md sm:shadow-lg p-6 sm:p-8 rounded-lg text-center border border-gray-200">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 22V12h6v10" />
                </svg>
              </div>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">360° views for {brand} {model} are currently unavailable.</p>
              <Link href={`/cars/${brand}/${model}`} className="inline-block px-4 sm:px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm sm:text-base">
                Return to {model} Overview
              </Link>
            </div>
          )}
          
          {has360View && (
            <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="text-red-600 mt-1">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-700 text-sm sm:text-base">Pro tip:</p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {hasExterior && "For exterior views, look closely at details like headlights, wheels, and body contours. "}
                    {hasInterior && "For interior views, check out the dashboard layout, seating materials, and cabin space. "}
                    Tap the fullscreen button for the best immersive experience.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="lg:w-1/3 mt-4 lg:mt-0">
          <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 shadow-sm overflow-hidden sticky top-4">
            <div className="bg-gray-50 p-3 sm:p-4 border-b border-gray-200">
              <h2 className="font-semibold text-base sm:text-lg flex items-center gap-1.5 sm:gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
                Explore {brand} {model}
              </h2>
            </div>
            
            <div className="p-3 sm:p-4">
              {hasBothViews && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-medium text-sm text-gray-700 mb-3">View Selector</h3>
                  <div className="grid grid-cols-1 gap-2">
                    <Link 
                      href={`/cars/${brand}/${model}/360-view/exterior`}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-red-50 text-gray-800 hover:text-red-700 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <span>Exterior 360° View</span>
                    </Link>
                    <Link 
                      href={`/cars/${brand}/${model}/360-view/interior`}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-blue-50 text-gray-800 hover:text-blue-700 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span>Interior 360° View</span>
                    </Link>
                  </div>
                </div>
              )}
              
              <div className="flex flex-nowrap overflow-x-auto lg:overflow-x-visible lg:flex-col pb-2 lg:pb-0 gap-2 lg:gap-1 lg:space-y-1 -mx-1 px-1">
                {quickNavLinks.map((link, index) => (
                  <Link 
                    key={index} 
                    href={link.href}
                    className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-lg hover:bg-gray-50 transition-colors group flex-shrink-0 lg:flex-shrink min-w-[150px] sm:min-w-0 lg:w-full"
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-50 rounded-full flex items-center justify-center text-red-600 group-hover:bg-red-100 flex-shrink-0">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={link.icon} />
                      </svg>
                    </div>
                    <span className="font-medium text-sm sm:text-base">{link.name}</span>
                    <div className="ml-auto hidden lg:block">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
              
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-5 border-t border-gray-100">
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                  <h3 className="font-medium text-xs sm:text-sm text-gray-500 uppercase tracking-wide mb-2 sm:mb-3">Current Section</h3>
                  <div className="bg-white border border-red-100 rounded-lg p-2.5 sm:p-3 flex items-center gap-2.5 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                      </svg>
                    </div>
                    <div>
                      <span className="font-bold text-gray-800 text-sm sm:text-base">360° View</span>
                      <p className="text-xs text-gray-500 mt-0.5 sm:mt-1">Virtual tour experience</p>
                    </div>
                  </div>
                </div>
                
                <Link 
                  href={`/cars/${brand}/${model}`}
                  className="mt-3 sm:mt-4 w-full block py-2.5 sm:py-3 px-4 bg-red-600 hover:bg-red-700 text-white text-center rounded-lg transition-colors text-sm sm:text-base font-medium"
                >
                  Back to {model} Overview
                </Link>
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
    title: `${brand} ${model} 360° View - Explore Inside & Out | Motor India`,
    description: `Experience the ${brand} ${model} in 360 degrees. Explore both exterior and interior views to see every detail before visiting a showroom.`,
    openGraph: {
      title: `${brand} ${model} - 360° Virtual Tour`,
      description: `Take a virtual tour of the ${brand} ${model} with our interactive 360° view experience.`
    }
  };
}