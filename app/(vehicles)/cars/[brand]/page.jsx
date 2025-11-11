import Image from 'next/image';
import ReadMore from './components/Readmore'
import { getFeaturedImage } from '@/lib/api'; 
import Link from 'next/link';

// Shared fetch functions to be used by both page and metadata
async function getBrandDetails(brand) {
  const response = await fetch(`${process.env.BACKEND}/wp-json/wp/v2/car_brand?slug=${brand}`, {
    next: { revalidate: 3600 } // Revalidate every hour
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch brand details: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

async function getRelatedBrands() {
  const response = await fetch(`${process.env.BACKEND}/wp-json/wp/v2/car_brand?per_page=10`, {
    next: { revalidate: 3600 }
  });

  if (!response.ok) {
    return [];
  }

  return response.json();
}

async function getBrandModels(brand) {
  const response = await fetch(`${process.env.BACKEND}/wp-json/api/cars?brand=${brand}`, {
    next: { revalidate: 3600 } // Cache for 1 hour
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch brand models: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

export default async function BrandPage({ params }) {
  const paramsObj = await params;
  const { brand } = paramsObj;

  const [brandDetails, models, relatedBrands] = await Promise.all([
    getBrandDetails(brand),
    getBrandModels(brand),
    getRelatedBrands()
  ]);

  const brandInfo = brandDetails[0];
  let brandLogo = null;

  // Fetch brand logo with proper error handling
  if (brandInfo?.acf?.featured_image) {
    try {
      brandLogo = await getFeaturedImage(brandInfo.acf.featured_image);
    } catch (error) {
      console.error(`Error fetching brand logo for ${brandInfo.name}:`, error);
    }
  }

  // Filter out current brand from related brands
  const otherBrands = relatedBrands.filter(b => b.slug !== brand);
  
  // Separate models into current and upcoming
  const currentModels = models.filter(model => model.is_launched !== "0");
  const upcomingModels = models.filter(model => model.is_launched === "0");

  // Fetch images for current models
  const currentModelsWithImages = await Promise.all(
    currentModels.map(async (model) => {
      let imageUrl = null;
      let imageAlt = model.title;

      try {
        // Try to get featured image from ACF if available
        if (model.acf?.featured_image) {
          imageUrl = await getFeaturedImage(model.acf.featured_image);
        }
        // Fallback to existing image_url if available
        else if (model.image_url) {
          imageUrl = model.image_url;
        }
      } catch (error) {
        console.error(`Error fetching image for model ${model.title}:`, error);
      }

      return {
        ...model,
        image_url: imageUrl,
        image_alt: imageAlt
      };
    })
  );

  // Fetch images for upcoming models
  const upcomingModelsWithImages = await Promise.all(
    upcomingModels.map(async (model) => {
      let imageUrl = null;
      let imageAlt = model.title;

      try {
        // Try to get featured image from ACF if available
        if (model.acf?.featured_image) {
          imageUrl = await getFeaturedImage(model.acf.featured_image);
        }
        // Fallback to existing image_url if available
        else if (model.image_url) {
          imageUrl = model.image_url;
        }
      } catch (error) {
        console.error(`Error fetching image for upcoming model ${model.title}:`, error);
      }

      return {
        ...model,
        image_url: imageUrl,
        image_alt: imageAlt
      };
    })
  );

  // Fetch featured images for related brands
  const relatedBrandsWithImages = await Promise.all(
    otherBrands.slice(0, 6).map(async (brand) => {
      let imageUrl = null;
      if (brand.acf?.featured_image) {
        imageUrl = await getFeaturedImage(brand.acf.featured_image);
      }
      return {
        ...brand,
        imageUrl
      };
    })
  );

  // Sort models by price for the price table
  const sortedByPrice = [...currentModelsWithImages].sort((a, b) => {
    const priceA = a.price?.min_price || 0;
    const priceB = b.price?.min_price || 0;
    return priceA - priceB;
  }).filter(model => model.price?.min_price > 0 || model.price?.max_price > 0);

  // Sort upcoming models by price
  const sortedUpcoming = [...upcomingModelsWithImages].sort((a, b) => {
    const priceA = a.price?.min_price || 0;
    const priceB = b.price?.min_price || 0;
    return priceA - priceB;
  }).filter(model => model.price?.min_price > 0 || model.price?.max_price > 0);

  // Get current month and year for display
  const currentDate = new Date();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currentMonth = monthNames[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();

  // Generate dynamic SEO description
  const lowestPriceModel = sortedByPrice[0];
  const highestPriceModel = sortedByPrice[sortedByPrice.length - 1];
  
  const priceRangeText = sortedByPrice.length > 0 ? 
    `${lowestPriceModel?.price?.min_price_formatted || ''} to ${highestPriceModel?.price?.max_price_formatted || ''}` : 
    'Price details unavailable';
  
  const popularModels = currentModels
    .slice(0, 3)
    .map(model => model.title)
    .join(', ');
    
  const dynamicDescription = `
    Explore the complete range of ${brandInfo.name} cars in India for ${new Date().getFullYear()}. 
    ${brandInfo.name} offers ${currentModels.length} models${upcomingModels.length ? ` and has ${upcomingModels.length} upcoming cars` : ''} 
    with prices ranging from ${priceRangeText}. 
    ${popularModels ? `Popular ${brandInfo.name} models include ${popularModels}.` : ''} 
    Compare specifications, features, and prices to find the perfect ${brandInfo.name} car for you.
  `.replace(/\s+/g, ' ').trim();

  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-6 sm:py-10 bg-gradient-to-b from-gray-50 to-white">
      {/* Brand Hero Section */}
      <div className="relative mb-12">
        {/* Background gradient with luxury pattern overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 opacity-10 pattern-diagonal-lines pattern-white pattern-size-3"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>
        
        {/* Curved decorative elements */}
        <div className="absolute bottom-0 left-0 w-full h-24 overflow-hidden z-[1]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="absolute bottom-0 opacity-10">
            <path fill="#ffffff" fillOpacity="1" d="M0,224L80,197.3C160,171,320,117,480,117.3C640,117,800,171,960,181.3C1120,192,1280,160,1360,144L1440,128L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
          </svg>
        </div>
        
        {/* Premium content wrapper */}
        <div className="relative z-10 px-6 py-14 sm:py-20 md:py-24 rounded-2xl overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
              {/* Left side - Brand Logo and Name */}
              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                {brandLogo && (
                  <div className="w-44 h-44 sm:w-52 sm:h-52 relative flex-shrink-0 mb-8 
                               bg-white p-5 rounded-full shadow-[0_0_60px_rgba(255,255,255,0.25)] ring-2 ring-white/10 transition-transform duration-500 hover:scale-105">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-red-500/10 to-transparent"></div>
                    <Image
                      src={brandLogo}
                      alt={`${brandInfo.name} Logo`}
                      fill
                      className="object-contain p-4 rounded-full"
                      priority
                    />
                  </div>
                )}
                <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight leading-tight">
                  {brandInfo.name} <span className="text-red-500">Cars</span>
                </h1>
                <div className="h-1 w-20 bg-gradient-to-r from-red-500 to-red-600 rounded-full mb-4"></div>
                <p className="text-slate-200 text-lg max-w-xl leading-relaxed">
                  {brandInfo.description ? brandInfo.description.substring(0, 120) + (brandInfo.description.length > 120 ? '...' : '') : 
                  `Discover ${brandInfo.name}'s lineup of premium vehicles engineered for performance and luxury.`}
                </p>
                
                {/* NEW: CTA Button */}
                <a href="#car-models" className="mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-6 rounded-full font-medium shadow-lg hover:shadow-red-500/20 transition-all duration-300 hover:-translate-y-1">
                  Explore Models
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
              
              {/* Right side - Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full max-w-xl md:max-w-lg mt-8 md:mt-0 md:ml-auto">
                <div className="glassmorphism text-center px-5 py-7 rounded-2xl flex flex-col items-center backdrop-blur-md bg-white/5 border border-white/10 shadow-xl transform transition-transform hover:scale-105 hover:shadow-red-500/10 duration-300">
                  <div className="text-3xl sm:text-4xl font-bold text-white mb-1">{currentModelsWithImages.length}</div>
                  <div className="text-sm text-slate-300 font-medium">Available Models</div>
                  <div className="w-10 h-0.5 bg-gradient-to-r from-red-400 to-red-500 mt-3 rounded-full"></div>
                </div>
                
                <div className="glassmorphism text-center px-5 py-7 rounded-2xl flex flex-col items-center backdrop-blur-md bg-white/5 border border-white/10 shadow-xl transform transition-transform hover:scale-105 hover:shadow-red-500/10 duration-300">
                  <div className="text-3xl sm:text-4xl font-bold text-white mb-1">{upcomingModelsWithImages.length}</div>
                  <div className="text-sm text-slate-300 font-medium">Upcoming Models</div>
                  <div className="w-10 h-0.5 bg-gradient-to-r from-red-400 to-red-500 mt-3 rounded-full"></div>
                </div>
                
                <div className="glassmorphism text-center px-5 py-7 rounded-2xl flex flex-col items-center backdrop-blur-md bg-white/5 border border-white/10 shadow-xl transform transition-transform hover:scale-105 hover:shadow-red-500/10 duration-300">
                  <div className="text-xl sm:text-2xl font-bold text-white mb-1 truncate">
                    {sortedByPrice.length > 0 ? `${lowestPriceModel?.price?.min_price_formatted}+` : 'Price TBA'}
                  </div>
                  <div className="text-sm text-slate-300 font-medium">Starting Price</div>
                  <div className="w-10 h-0.5 bg-gradient-to-r from-red-400 to-red-500 mt-3 rounded-full"></div>
                </div>
              </div>
            </div>
            
            {/* NEW: Badge bar */}
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mt-10 pt-6 border-t border-white/10">
              {sortedByPrice.length > 0 && (
                <div className="px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-slate-700 to-slate-800 text-gray-200 shadow-inner">
                  Price Range: {priceRangeText}
                </div>
              )}
              
              <div className="px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-slate-700 to-slate-800 text-gray-200 shadow-inner">
                Updated: {currentMonth} {currentYear}
              </div>
              
              {brandInfo.country && (
                <div className="px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-slate-700 to-slate-800 text-gray-200 shadow-inner flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  {brandInfo.country || 'International Brand'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div id="car-models" className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 xl:col-span-3">
          {/* Brand Description */}
          <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8 mb-10 border border-gray-100">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 flex items-center">
              <span className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
                </svg>
              </span>
              About {brandInfo.name}
            </h2>
            
            <ReadMore collapsedHeight={200}>
              <div className="prose prose-lg max-w-none text-gray-700">
                {brandInfo.description && (
                  <div className="mb-6">
                    <p className="text-gray-600 leading-relaxed">{brandInfo.description}</p>
                  </div>
                )}
                
                <h3 className="text-xl font-semibold mb-3 text-gray-800">About {brandInfo.name} Cars in India</h3>
                <p className="mb-5 leading-relaxed">{dynamicDescription}</p>
                
                {popularModels && (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3 text-gray-800">Popular {brandInfo.name} Models</h3>
                    <p className="leading-relaxed">The most popular {brandInfo.name} cars in India include {popularModels}. These models offer a combination of performance, features, and value that appeals to Indian car buyers.</p>
                  </div>
                )}
                
                {sortedByPrice.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3 text-gray-800">{brandInfo.name} Price Range</h3>
                    <p className="leading-relaxed">{brandInfo.name} cars in India are priced between {priceRangeText}, making them accessible across different budget segments. The exact price varies based on the model, variant, features, and location.</p>
                  </div>
                )}
                
                {upcomingModels.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3 text-gray-800">Upcoming {brandInfo.name} Cars</h3>
                    <p className="leading-relaxed">{brandInfo.name} has {upcomingModels.length} upcoming cars in India, including {upcomingModels.slice(0, 2).map(m => m.title).join(', ')}{upcomingModels.length > 2 ? ' and more' : ''}. These new launches are expected to strengthen {brandInfo.name}&apos;s position in the Indian market.</p>
                  </div>
                )}
              </div>
            </ReadMore>
          </div>

          {/* Price Tables - Current Models */}
          {sortedByPrice.length > 0 && (
            <div className="mb-10">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 flex-grow flex items-center">
                  <span className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                  </span>
                  {brandInfo.name} Price List ({currentMonth} {currentYear})
                </h2>
              </div>
            
              <div className="bg-white rounded-xl overflow-hidden shadow-xl border border-gray-100">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr>
                        <th className="bg-slate-800 text-white px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Model</th>
                        <th className="bg-slate-800 text-white px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Price Range</th>
                        <th className="bg-slate-800 text-white px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Body Type</th>
                        <th className="bg-slate-800 text-white px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {sortedByPrice.map((model, idx) => (
                        <tr key={model.id} className={`hover:bg-slate-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                          <td className="px-6 py-4 font-medium">
                            <Link href={`/cars/${brand}/${model.model_slug}`}
                              className="text-gray-800 hover:text-red-600 transition-colors"
                            >
                              {model.title}
                            </Link>
                          </td>
                          <td className="px-6 py-4 text-gray-700">
                            {(() => {
                              const minPrice = model.price?.min_price;
                              const maxPrice = model.price?.max_price;
                              
                              if (minPrice > 0 && maxPrice > 0) {
                                if (minPrice === maxPrice) {
                                  return model.price.min_price_formatted;
                                } else {
                                  return `${model.price.min_price_formatted} - ${model.price.max_price_formatted}`;
                                }
                              } else if (minPrice > 0) {
                                return model.price.min_price_formatted;
                              } else if (maxPrice > 0) {
                                return model.price.max_price_formatted;
                              } else {
                                return 'TBA';
                              }
                            })()}
                          </td>
                          <td className="px-6 py-4 text-gray-700">
                            {model.body_type || 'N/A'}
                          </td>
                          <td className="px-6 py-4">
                            <Link 
                              href={`/cars/${brand}/${model.model_slug}`}
                              className="text-red-600 hover:text-red-800 font-medium transition-colors"
                            >
                              View Details
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Upcoming Models Price Table */}
          {sortedUpcoming.length > 0 && (
            <div className="mb-10">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 flex-grow flex items-center">
                  <span className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </span>
                  Upcoming {brandInfo.name} Models
                </h2>
              </div>
              
              <div className="bg-white rounded-xl overflow-hidden shadow-xl border border-gray-100">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr>
                        <th className="bg-slate-800 text-white px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Model</th>
                        <th className="bg-slate-800 text-white px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Expected Price</th>
                        <th className="bg-slate-800 text-white px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Body Type</th>
                        <th className="bg-slate-800 text-white px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {sortedUpcoming.map((model, idx) => (
                        <tr key={model.id} className={`hover:bg-slate-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                          <td className="px-6 py-4 font-medium">
                            <Link href={`/cars/${brand}/${model.model_slug}`}
                              className="text-gray-800 hover:text-red-600 transition-colors"
                            >
                              {model.title}
                            </Link>
                          </td>
                          <td className="px-6 py-4 text-gray-700">
                            {(() => {
                              const minPrice = model.price?.min_price;
                              const maxPrice = model.price?.max_price;
                              
                              if (minPrice > 0 && maxPrice > 0) {
                                if (minPrice === maxPrice) {
                                  return model.price.min_price_formatted;
                                } else {
                                  return `${model.price.min_price_formatted} - ${model.price.max_price_formatted}`;
                                }
                              } else if (minPrice > 0) {
                                return model.price.min_price_formatted;
                              } else if (maxPrice > 0) {
                                return model.price.max_price_formatted;
                              } else {
                                return 'TBA';
                              }
                            })()}
                          </td>
                          <td className="px-6 py-4 text-gray-700">
                            {model.body_type || 'N/A'}
                          </td>
                          <td className="px-6 py-4">
                            <Link 
                              href={`/cars/${brand}/${model.model_slug}`}
                              className="text-red-600 hover:text-red-800 font-medium transition-colors"
                            >
                              View Details
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Current Models Grid */}
          {currentModelsWithImages.length > 0 && (
            <div className="mb-14">
              <div className="flex items-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 flex-grow flex items-center">
                  <span className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                      <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-5h2.05a2.5 2.5 0 014.9 0H18a1 1 0 001-1V5a1 1 0 00-1-1H3z" />
                    </svg>
                  </span>
                  Available {brandInfo.name} Models
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {currentModelsWithImages.map(model => (
                  <a 
                    key={model.id}
                    href={`/cars/${brand}/${model.model_slug}`}
                    className="group bg-white rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden">
                      {model.image_url ? (
                        <Image
                          src={model.image_url}
                          alt={model.image_alt || model.title}
                          width={800}
                          height={450}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-slate-200">
                          <span className="text-slate-600 font-medium">{model.title}</span>
                        </div>
                      )}
                      {model.body_type && (
                        <div className="absolute top-4 left-4 bg-slate-900 bg-opacity-80 text-white text-xs px-3 py-1.5 rounded-full">
                          {model.body_type}
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <h2 className="text-xl font-bold text-slate-800 group-hover:text-red-600 transition-colors">{model.title}</h2>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                      
                      {model.price.min_price > 0 ? (
                        <div className="flex flex-col">
                          <p className="text-red-600 font-semibold">
                            {model.price.min_price_formatted}
                          </p>
                          <p className="text-slate-500 text-sm">Ex-showroom Price</p>
                        </div>
                      ) : (
                        <p className="text-slate-500 italic">
                          Price not available
                        </p>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Models Grid */}
          {upcomingModelsWithImages.length > 0 && (
            <div className="mb-14">
              <div className="flex items-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 flex-grow flex items-center">
                  <span className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                    </svg>
                  </span>
                  Upcoming {brandInfo.name} Models
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {upcomingModelsWithImages.map(model => (
                  <a 
                    key={model.id}
                    href={`/cars/${brand}/${model.model_slug}`}
                    className="group bg-white rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden">
                      {model.image_url ? (
                        <Image
                          src={model.image_url}
                          alt={model.image_alt || model.title}
                          width={800}
                          height={450}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-slate-200">
                          <span className="text-slate-600 font-medium">{model.title}</span>
                        </div>
                      )}
                      <div className="absolute top-4 right-4 bg-orange-500 text-white text-xs px-3 py-1.5 rounded-full font-medium">
                        Upcoming
                      </div>
                      {model.body_type && (
                        <div className="absolute top-4 left-4 bg-slate-900 bg-opacity-80 text-white text-xs px-3 py-1.5 rounded-full">
                          {model.body_type}
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <h2 className="text-xl font-bold text-slate-800 group-hover:text-orange-600 transition-colors">{model.title}</h2>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                      
                      {model.price.min_price > 0 ? (
                        <div className="flex flex-col">
                          <p className="text-orange-600 font-semibold">
                            Expected: {model.price.min_price_formatted}
                          </p>
                          <p className="text-slate-500 text-sm">Estimated Ex-showroom</p>
                        </div>
                      ) : (
                        <p className="text-slate-500 italic">
                          Price not available
                        </p>
                      )}
                      
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <p className="text-slate-600 text-sm">
                          Expected Launch: {currentMonth} {currentYear}
                        </p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 space-y-8">
            {/* Popular Brands Card */}
            <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-100">
              <h2 className="text-xl font-bold mb-5 text-gray-800 flex items-center">
                <span className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </span>
                Popular Car Brands
              </h2>
              
              <div className="grid grid-cols-3 gap-3">
                {relatedBrandsWithImages.map(relatedBrand => (
                  <a
                    key={relatedBrand.id}
                    href={`/cars/${relatedBrand.slug}`}
                    className="group flex flex-col items-center"
                  >
                    <div className="w-full aspect-square bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden p-2 flex items-center justify-center relative">
                      {relatedBrand.imageUrl ? (
                        <>
                          <div className="relative w-full h-full flex items-center justify-center p-1">
                            <Image
                              src={relatedBrand.imageUrl}
                              alt={relatedBrand.name}
                              width={80}
                              height={80}
                              className="object-contain max-h-full max-w-full transition-transform duration-300 group-hover:scale-110"
                            />
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-red-800 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-gray-200 group-hover:to-gray-300 transition-colors duration-300 rounded-lg">
                          <span className="text-xl font-bold text-gray-500">
                            {relatedBrand.name.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    <span className="mt-2 text-xs font-medium text-center text-gray-700 group-hover:text-red-600 transition-colors duration-300 truncate w-full">
                      {relatedBrand.name}
                    </span>
                  </a>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <a href="/cars" className="inline-flex items-center justify-center gap-1 py-2 px-4 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium text-sm transition-colors">
                  <span>View all brands</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            {/* Newsletter subscription */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl shadow-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">Stay Updated</h3>
              <p className="text-slate-300 text-sm mb-5">Get the latest updates on {brandInfo.name} cars, launches, and exclusive offers.</p>
              
              <form className="space-y-3">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <button 
                  type="submit" 
                  className="w-full px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
                >
                  Subscribe
                </button>
              </form>
              
              <p className="mt-3 text-xs text-slate-400">
                By subscribing, you agree to our privacy policy and terms of service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  try {
    const { brand } = await params;
    const brandData = await getBrandDetails(brand);
    const models = await getBrandModels(brand);

    if (!brandData.length) {
      return {
        title: 'Brand Not Found',
        description: 'The requested car brand could not be found.'
      };
    }

    const brandInfo = brandData[0];
    const currentModels = models.filter(model => model.is_launched !== "0");
    const upcomingModels = models.filter(model => model.is_launched === "0");

  const modelCount = currentModels.length;
  const upcomingCount = upcomingModels.length;    // Enhanced price range with better formatting
    let priceRange = '';
    if (currentModels.length > 0) {
      const sortedModels = [...currentModels].sort((a, b) => 
        (a.price?.min_price || 0) - (b.price?.min_price || 0)
      );
      const lowestPrice = sortedModels[0]?.price?.min_price_formatted;
      const highestPrice = sortedModels[sortedModels.length - 1]?.price?.max_price_formatted;
      
      if (lowestPrice && highestPrice) {
        priceRange = `${lowestPrice} - ${highestPrice}`;
      }
    }
    
    // Enhanced meta description
    const metaDescription = `Explore ${brandInfo.name} cars in India ${new Date().getFullYear()}. 
      ${modelCount} models available${upcomingCount ? ` and ${upcomingCount} upcoming` : ''}. 
      ${ priceRange? `Price range: ${priceRange}.` : ''} 
      Find specifications, features, images & dealers of ${brandInfo.name} cars.`.replace(/\s+/g, ' ').trim();

    // Generate canonical URL
    const canonicalUrl = new URL(`/cars/${brand}`, process.env.NEXT_PUBLIC_FRONTEND).toString();


    return {
      title: `${brandInfo.name} Cars in India ${new Date().getFullYear()} - Models, Prices & More`,
      description: metaDescription,
      openGraph: {
        title: `${brandInfo.name} Cars - Complete Model Lineup ${new Date().getFullYear()}`,
        description: metaDescription,
        type: 'website',
        images: brandInfo.acf?.featured_image ? [{ url: await getFeaturedImage(brandInfo.acf.featured_image) }] : [],
        url: canonicalUrl
      },
      keywords: `${brandInfo.name} cars, ${brandInfo.name} price, ${brandInfo.name} models, new ${brandInfo.name} cars, ${brandInfo.name} ${new Date().getFullYear()}`,
      alternates: {
        canonical: canonicalUrl
      }
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Car Brand Details",
      description: "Explore car models, specifications, and prices"
    };
  }
}
