export default async function BrandPage({ params }) {
  // Await params before destructuring
  const paramsObj = await params;
  const { brand } = paramsObj;

  const getBrandDetails = async () => {
    const response = await fetch(`${process.env.BACKEND}/wp-json/wp/v2/car_brand?slug=${brand}`, {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch brand details: ${response.status}`);
    }
    
    return response.json();
  };

  const getBrandModels = async (brand) => {
    const response = await fetch(`${process.env.BACKEND}/wp-json/api/cars?brand=${brand}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch brand models: ${response.status}`);
    }
    
    return response.json(); // API now returns array directly
  };
  
  const models = await getBrandModels(brand);
  
  // Separate models into current and upcoming
  const currentModels = models.filter(model => model.is_launched !== "0");
  const upcomingModels = models.filter(model => model.is_launched === "0");

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 capitalize">{brand} Models</h1>
      
      {/* Current Models Section */}
      {currentModels.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold mb-6">Available Models</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {currentModels.map(model => (
              <a 
                key={model.id}
                href={`/cars/${brand}/${model.model_slug}`}
                className="group"
              >
                <div className="relative aspect-video mb-4 overflow-hidden rounded-lg bg-gray-100">
                  {model.image_url ? (
                    <img
                      src={model.image_url}
                      alt={model.image_alt || model.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-gray-400">{model.title}</span>
                    </div>
                  )}
                  {model.body_type && (
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                      {model.body_type}
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-semibold">{model.title}</h2>
                {model.price.min_price > 0 ? (
                  <p className="text-red-600 font-medium">
                    Starting from {model.price.min_price_formatted}
                  </p>
                ) : (
                  <p className="text-gray-600 italic">
                    Price not available
                  </p>
                )}
              </a>
            ))}
          </div>
        </>
      )}

      {/* Upcoming Models Section */}
      {upcomingModels.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold mb-6">Upcoming Models</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingModels.map(model => (
              <a 
                key={model.id}
                href={`/cars/${brand}/${model.model_slug}`}
                className="group"
              >
                <div className="relative aspect-video mb-4 overflow-hidden rounded-lg bg-gray-100">
                  {model.image_url ? (
                    <img
                      src={model.image_url}
                      alt={model.image_alt || model.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-gray-400">{model.title}</span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                    Upcoming
                  </div>
                  {model.body_type && (
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                      {model.body_type}
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-semibold">{model.title}</h2>
                {model.price.min_price > 0 ? (
                  <p className="text-red-600 font-medium">
                    Expected Price: {model.price.min_price_formatted}
                  </p>
                ) : (
                  <p className="text-gray-600 italic">
                    Price not available
                  </p>
                )}
              </a>
            ))}
          </div>
        </>
      )}
    </main>
  );
}