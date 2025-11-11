import SearchClient from './components/SearchClient';
import { getFeaturedImage } from '@/lib/api';

async function fetchServerResults(query) {
  if (!query || query.length < 2) return [];
  
  try {
    // Check if environment variable is available
    if (!process.env.NEXT_PUBLIC_BACKEND) {
      console.error('NEXT_PUBLIC_BACKEND environment variable is not defined');
      return [];
    }

    // Create timeout controller for server-side (longer timeout to prevent aborts)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout for SSR

    let res;
    try {
      res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND}/wp-json/wp/v2/car?search=${encodeURIComponent(query)}&_fields=id,title,slug,acf,featured_media&per_page=50`,
        { 
          next: { revalidate: 300 }, // Cache for 5 minutes instead of no-store
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal
        }
      );
      clearTimeout(timeoutId);
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        console.warn('Search request timeout, returning empty results');
        return [];
      }
      throw fetchError;
    }
    
    if (!res.ok) {
      console.error(`Search API error: ${res.status}`);
      return [];
    }
    
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.error('SSR search fetch failed:', e);
    return [];
  }
}

async function processSearchResults(results, sortBy = 'relevance', filterBy = 'all') {
  if (!Array.isArray(results)) return { processedResults: [] };
  
  let processedResults = [...results];
  
  // Apply sorting
  if (sortBy === 'name') {
    processedResults.sort((a, b) => (a.title?.rendered || '').localeCompare(b.title?.rendered || ''));
  } else if (sortBy === 'brand') {
    processedResults.sort((a, b) => (a.acf?.brand_name || '').localeCompare(b.acf?.brand_name || ''));
  }
  
  // Apply filtering
  if (filterBy !== 'all') {
    processedResults = processedResults.filter((car) => 
      car.acf?.model_type?.toLowerCase().includes(filterBy.toLowerCase())
    );
  }
  
  // Pre-load images for the processed results and attach them to each car object
  const processedResultsWithImages = await Promise.all(
    processedResults.map(async (car) => {
      if (car && car.id && car.acf?.featured_image) {
        try {
          const imageUrl = await getFeaturedImage(car.acf.featured_image);
          return {
            ...car,
            imageUrl: imageUrl || null
          };
        } catch (error) {
          console.error(`Error fetching image for car ${car.id}:`, error);
          return {
            ...car,
            imageUrl: null
          };
        }
      }
      return {
        ...car,
        imageUrl: null
      };
    })
  );
  
  return { processedResults: processedResultsWithImages };
}

export default async function SearchPage({ searchParams }) {
  const searchQuery = (searchParams?.q || searchParams?.search || '').toString();
  const sortBy = (searchParams?.sort || 'relevance').toString();
  const filterBy = (searchParams?.filter || 'all').toString();
  
  const initialResults = await fetchServerResults(searchQuery);
  const { processedResults } = await processSearchResults(initialResults, sortBy, filterBy);
  
  return (
    <SearchClient 
      initialQuery={searchQuery} 
      initialResults={processedResults}
      currentSort={sortBy}
      currentFilter={filterBy}
    />
  );
}

