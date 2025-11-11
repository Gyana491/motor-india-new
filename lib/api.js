export async function getAllBrands() {
  // Implement WordPress REST API call to fetch brands
  const response = await fetch(`${process.env.BACKEND}/brands`)
  const data = await response.json()
  return data
}

export async function getBrandModels(brand) {
  // Implement WordPress REST API call to fetch models for a specific brand
  const response = await fetch(`${process.env.BACKEND}/brands/${brand}/models`)
  const data = await response.json()
  return data
}

export async function getModelDetails(brand, model) {
  // Implement WordPress REST API call to fetch detailed model information
  const response = await fetch(`${process.env.BACKEND}/brands/${brand}/models/${model}`)
  const data = await response.json()
  return data
} 

export async function getVariantDetails(brand, model, variant) {
  // Implement WordPress REST API call to fetch detailed variant information
  const response = await fetch(`${process.env.BACKEND}/brands/${brand}/models/${model}/variants/${variant}`)
  const data = await response.json()
  return data
}

export async function getFeaturedImage(imageId) {
  if (!imageId || imageId === 0) {
    return null;
  }

  try {
    const url = `${process.env.BACKEND}/wp-json/wp/v2/media/${imageId}`;
    const response = await fetch(url, {
      next: { revalidate: 3600 },
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=7200'
      }
    });

    if (!response.ok) {
      console.warn(`Failed to fetch image ${imageId}: ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data.source_url || data.guid?.rendered || null;
  } catch (error) {
    console.error(`Error fetching image ${imageId}:`, error);
    return null;
  }
}



