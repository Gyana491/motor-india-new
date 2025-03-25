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



