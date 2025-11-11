import { BACKEND } from '@/app/utils/constants';
import { getFeaturedImage } from '@/lib/api';

export async function getFeaturedCars(limit = 12) {
  try {
    const response = await fetch(`${BACKEND}/wp-admin/admin-ajax.php?action=get_all_cars_json&page=1&per_page=${limit}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=7200'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch featured cars: ${response.status}`);
    }

    const data = await response.json();
    const cars = data.pages || [];

    // Filter only launched cars and get featured ones
    const launchedCars = cars.filter(car => car.is_launched !== "0");

    // Process cars with images
    const carsWithImages = await Promise.all(
      launchedCars.slice(0, limit).map(async (car) => {
        let featuredImageUrl = null;

        try {
          // Try to get featured image from ACF if available
          if (car.acf?.featured_image) {
            featuredImageUrl = await getFeaturedImage(car.acf.featured_image);
          }
          // Fallback to main featured_media if ACF image not available
          else if (car.featured_media && car.featured_media !== 0) {
            featuredImageUrl = await getFeaturedImage(car.featured_media);
          }
          // Another fallback - check if there's a direct image URL in car data
          else if (car.featured_image_url) {
            featuredImageUrl = car.featured_image_url;
          }
        } catch (error) {
          console.error(`Error fetching image for car ${car.title}:`, error);
          featuredImageUrl = null;
        }

        return {
          id: car.id,
          name: car.title || car.name,
          slug: car.slug || car.model_slug,
          brand: car.brand_name,
          brandSlug: car.brand_slug,
          bodyType: car.body_type,
          priceRange: car.price?.min_price_formatted ?
            `${car.price.min_price_formatted}${car.price.max_price_formatted && car.price.max_price_formatted !== car.price.min_price_formatted ? ` - ${car.price.max_price_formatted}` : ''}` :
            'Price TBA',
          fuelType: car.fuel_type || 'Petrol',
          featuredImageUrl,
          excerpt: car.excerpt || car.description || `${car.title} offers great value with modern features.`
        };
      })
    );

    return carsWithImages;
  } catch (error) {
    console.error('Error fetching featured cars:', error);
    // Return empty array as fallback
    return [];
  }
}

export async function getCarBodyTypes() {
  try {
    const response = await fetch(`${BACKEND}/wp-admin/admin-ajax.php?action=get_all_cars_json&page=1&per_page=1000`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=7200'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch cars for body types: ${response.status}`);
    }

    const data = await response.json();
    const cars = data.pages || [];

    // Extract unique body types and count them
    const bodyTypeCounts = {};
    cars.forEach(car => {
      if (car.body_type) {
        const bodyType = car.body_type.toLowerCase();
        if (!bodyTypeCounts[bodyType]) {
          bodyTypeCounts[bodyType] = {
            name: car.body_type,
            slug: bodyType,
            count: 0
          };
        }
        bodyTypeCounts[bodyType].count++;
      }
    });

    // Convert to array and sort by count
    const bodyTypes = Object.values(bodyTypeCounts)
      .sort((a, b) => b.count - a.count)
      .map((type, index) => ({
        id: index + 1,
        ...type
      }));

    return bodyTypes;
  } catch (error) {
    console.error('Error fetching car body types:', error);
    // Return empty array as fallback
    return [];
  }
}

export async function getCarsByBodyType(bodyTypeSlug, limit = 20) {
  try {
    const response = await fetch(`${BACKEND}/wp-admin/admin-ajax.php?action=get_all_cars_json&page=1&per_page=1000`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=7200'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch cars by body type: ${response.status}`);
    }

    const data = await response.json();
    const allCars = data.pages || [];

    // Filter cars by body type
    const filteredCars = allCars.filter(car =>
      car.body_type && car.body_type.toLowerCase() === bodyTypeSlug.toLowerCase() && car.is_launched !== "0"
    );

    // Process cars with images
    const carsWithImages = await Promise.all(
      filteredCars.slice(0, limit).map(async (car) => {
        let featuredImageUrl = null;

        try {
          // Try to get featured image from ACF if available
          if (car.acf?.featured_image) {
            featuredImageUrl = await getFeaturedImage(car.acf.featured_image);
          }
          // Fallback to main featured_media if ACF image not available
          else if (car.featured_media && car.featured_media !== 0) {
            featuredImageUrl = await getFeaturedImage(car.featured_media);
          }
          // Another fallback - check if there's a direct image URL in car data
          else if (car.featured_image_url) {
            featuredImageUrl = car.featured_image_url;
          }
        } catch (error) {
          console.error(`Error fetching image for car ${car.title}:`, error);
          featuredImageUrl = null;
        }

        return {
          id: car.id,
          name: car.title || car.name,
          slug: car.slug || car.model_slug,
          brand: car.brand_name,
          brandSlug: car.brand_slug,
          bodyType: car.body_type,
          priceRange: car.price?.min_price_formatted ?
            `${car.price.min_price_formatted}${car.price.max_price_formatted && car.price.max_price_formatted !== car.price.min_price_formatted ? ` - ${car.price.max_price_formatted}` : ''}` :
            'Price TBA',
          fuelType: car.fuel_type || 'Petrol',
          featuredImageUrl,
          excerpt: car.excerpt || car.description || `${car.title} offers great value with modern features.`
        };
      })
    );

    return carsWithImages;
  } catch (error) {
    console.error('Error fetching cars by body type:', error);
    // Return empty array as fallback
    return [];
  }
}