/**
 * Fetches all products recursively with pagination
 * @returns {Promise<Array>} - All products from all pages
 */
import { BACKEND } from '@/utils/constants';
async function getAllProducts() {
  let allProducts = [];
  let page = 1;
  let hasMoreProducts = true;

  while (hasMoreProducts) {
    try {
      const response = await fetch(`${BACKEND || process.env.BACKEND}/wp-admin/admin-ajax.php?action=get_all_products_json&page=${page}&per_page=20`);

      if (!response.ok) {
        if (response.status === 400 || response.status === 404) {
          hasMoreProducts = false;
          break;
        }
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const products = data.products || [];

      if (!products.length || page >= data.pagination.total_pages) {
        hasMoreProducts = false;
      }

      allProducts = [...allProducts, ...products];
      page++;

    } catch (error) {
      console.error('Error fetching products:', error);
      hasMoreProducts = false;
    }
  }

  return allProducts;
}

export default async function sitemap() {
  try {
    const products = await getAllProducts();

    const urls = products.map(product => {
      const make = product.make?.toLowerCase().replace(/\s+/g, '-') || '';
      const model = product.model?.toLowerCase().replace(/\s+/g, '-') || '';
      const variant = product.variant?.toLowerCase().replace(/\s+/g, '-') || '';

      if (!make || !model || !variant) return null;

      return {
        url: `https://motorindia.in/cars/${make}/${model}/${variant}/`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8
      };
    }).filter(Boolean);

    return urls;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return [];
  }
}