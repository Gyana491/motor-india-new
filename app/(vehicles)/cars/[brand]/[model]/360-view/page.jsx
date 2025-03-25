import Link from 'next/link';
import ThreeSixtyViewer from '../components/ThreeSixtyViewer';

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
  // Await params before destructuring
  const paramsObj = await params;
  const { brand, model } = paramsObj;
  const data = await getModelDetails(brand, model);
  
  // Check if we have posts and a first post
  if (!data || !data.posts || data.posts.length === 0) {
    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">360° View not found</h1>
        <p>Sorry, we couldn&apos;t find 360° views for {brand} {model}.</p>
        <Link href={`/cars/${brand}/${model}`} className="text-red-600 hover:underline">
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
      
      <h1 className="text-3xl font-bold mb-6">{title} 360° View</h1>
      
      {has360View ? (
        <>
          {/* 360° Viewer Component */}
          <ThreeSixtyViewer 
            threeSixtyView={threeSixtyView} 
            title={title} 
            brand={brand} 
            model={model} 
            isFullPage={true} 
          />
          
          {/* Key Features Visible in 360° View */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Key Features to Explore</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hasExterior && (
                <>
                  <div className="bg-white p-5 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                      </div>
                      <h3 className="font-semibold">Design Elements</h3>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Explore the sleek lines, distinctive grille, and signature lighting elements.
                    </p>
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="font-semibold">Wheel Design</h3>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Check out the alloy wheel design and tire profile from different angles.
                    </p>
                  </div>
                </>
              )}
              
              {hasInterior && (
                <>
                  <div className="bg-white p-5 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="font-semibold">Dashboard Layout</h3>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Explore the intuitive dashboard design and infotainment system.
                    </p>
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                      </div>
                      <h3 className="font-semibold">Cabin Space</h3>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Get a feel for the spacious cabin and seating arrangement.
                    </p>
                  </div>
                </>
              )}
            </div>
          </section>
        </>
      ) : (
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <p className="text-gray-600">360° views for {brand} {model} are currently unavailable.</p>
          <Link href={`/cars/${brand}/${model}`} className="text-red-600 hover:underline mt-4 inline-block">
            Return to {model} Overview
          </Link>
        </div>
      )}
      {!threeSixtyView.exterior && !threeSixtyView.interior && (
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <p className="text-gray-600">360° views aren&apos;t available yet.</p>
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
    title: `${brand} ${model} 360° View - Explore Inside & Out | Motor India`,
    description: `Experience the ${brand} ${model} in 360 degrees. Explore both exterior and interior views to see every detail before visiting a showroom.`,
    openGraph: {
      title: `${brand} ${model} - 360° Virtual Tour`,
      description: `Take a virtual tour of the ${brand} ${model} with our interactive 360° view experience.`
    }
  };
}