// Common fetch options for different types of data
const CACHE_OPTIONS = {
  // For frequently changing data (prices, availability)
  dynamic: {
    next: { revalidate: 300 }, // 5 minutes
    headers: {
      'Cache-Control': 'public, max-age=300, s-maxage=300, stale-while-revalidate=600'
    }
  },
  // For semi-static data (car specs, features)
  semistatic: {
    next: { revalidate: 3600 }, // 1 hour
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=7200'
    }
  },
  // For static data (brands, categories)
  static: {
    next: { revalidate: 86400 }, // 24 hours
    headers: {
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=172800'
    }
  }
};

export async function getAllBrands() {
  const response = await fetch(`${process.env.BACKEND}/wp-json/wp/v2/car_brand?per_page=100`, 
    CACHE_OPTIONS.static
  );
  
  if (!response.ok) {
    throw new Error(`Failed to fetch brands: ${response.status}`);
  }
  
  return response.json();
}

export async function getBrandModels(brand) {
  const response = await fetch(`${process.env.BACKEND}/wp-json/api/cars?brand=${brand}`,
    CACHE_OPTIONS.semistatic
  );
  
  if (!response.ok) {
    throw new Error(`Failed to fetch brand models: ${response.status}`);
  }
  
  return response.json();
}

export async function getModelDetails(brand, model) {
  const response = await fetch(`${process.env.BACKEND}/wp-json/api/car?slug=${brand}-${model}`,
    CACHE_OPTIONS.dynamic
  );
  
  if (!response.ok) {
    throw new Error(`Failed to fetch model details: ${response.status}`);
  }
  
  return response.json();
}

export async function getFeaturedImage(imageId) {
  const url = `${process.env.BACKEND}/wp-json/wp/v2/media/${imageId}`;
  const response = await fetch(url, CACHE_OPTIONS.static);

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data.source_url;
}
