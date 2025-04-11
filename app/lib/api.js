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



export async function getFeaturedImage(imageId) {
  const url = `${process.env.BACKEND}/wp-json/wp/v2/media/${imageId}`;
  const response = await fetch(url, {
    next: { revalidate: 3600 }
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data.source_url;
}
