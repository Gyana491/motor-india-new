'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const fetchMediaDetails = async (mediaId) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/wp-json/wp/v2/media/${mediaId}`);
    if (!response.ok) throw new Error('Failed to fetch media');
    const data = await response.json();
    
    // Use medium_large (768px) or large (1024px) for better quality, fallback to medium (300px), then thumbnail
    const sizes = data.media_details?.sizes;
    if (!sizes) return null;
    
    // Prefer medium_large for good quality without being too large
    return sizes.medium_large?.source_url || 
           sizes.large?.source_url || 
           sizes.medium?.source_url || 
           sizes.thumbnail?.source_url || 
           null;
  } catch (error) {
    console.error('Media fetch error:', error);
    return null;
  }
};

const constructCarUrl = (car) => {
  if (!car || !car.acf) return '/cars';
  const brandName = car.acf.brand_name?.toLowerCase()?.trim() || '';
  const modelSlug = car.acf.model_slug?.toLowerCase()?.trim() || car.slug?.toLowerCase()?.trim() || '';
  if (!brandName || !modelSlug) return '/cars';
  const cleanBrandName = brandName.replace(/\s+/g, '-');
  const cleanModelSlug = modelSlug.replace(/\s+/g, '-');
  return `/cars/${cleanBrandName}/${cleanModelSlug}`;
};

export default function SearchClient({ initialQuery, initialResults }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(initialQuery || '');
  const [imageUrls, setImageUrls] = useState({});
  const [sortBy, setSortBy] = useState('relevance');
  const [filterBy, setFilterBy] = useState('all');

  const processedResults = useMemo(() => {
    let results = Array.isArray(initialResults) ? [...initialResults] : [];
    if (sortBy === 'name') {
      results.sort((a, b) => (a.title?.rendered || '').localeCompare(b.title?.rendered || ''));
    } else if (sortBy === 'brand') {
      results.sort((a, b) => (a.acf?.brand_name || '').localeCompare(b.acf?.brand_name || ''));
    }
    if (filterBy !== 'all') {
      results = results.filter((car) => car.acf?.model_type?.toLowerCase().includes(filterBy.toLowerCase()));
    }
    return results;
  }, [initialResults, sortBy, filterBy]);

  const totalResults = processedResults.length;

  useEffect(() => {
    const loadImages = async () => {
      const tasks = processedResults.map(async (car) => {
        if (car && car.id && car.acf?.featured_image && !imageUrls[car.id]) {
          const url = await fetchMediaDetails(car.acf.featured_image);
          if (url) {
            setImageUrls((prev) => ({ ...prev, [car.id]: url }));
          }
        }
      });
      await Promise.all(tasks);
    };
    loadImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processedResults]);

  const handleNewSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newQuery = (formData.get('search') || '').toString();
    if (newQuery) {
      router.push(`/search?q=${encodeURIComponent(newQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Page Title */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {searchQuery ? (
                  <>Search Results for &quot;{searchQuery}&quot;</>
                ) : (
                  'Car Search'
                )}
              </h1>
              {totalResults > 0 && (
                <p className="text-gray-600 mt-1">
                  Found {totalResults} car{totalResults !== 1 ? 's' : ''} matching your search
                </p>
              )}
            </div>

            {/* New Search Form */}
            <form onSubmit={handleNewSearch} className="flex-shrink-0">
              <div className="flex items-center bg-gray-50 rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-red-500 focus-within:border-red-500">
                <div className="pl-3 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="search"
                  defaultValue={searchQuery}
                  placeholder="Search cars..."
                  className="flex-1 px-3 py-2 bg-transparent focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-r-lg hover:bg-red-700 transition-colors"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Sorting */}
        {processedResults.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 p-4 bg-white rounded-lg shadow-sm">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="relevance">Relevance</option>
                <option value="name">Name</option>
                <option value="brand">Brand</option>
              </select>
            </div>

            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Filter by:</label>
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="all">All Types</option>
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
                <option value="hatchback">Hatchback</option>
                <option value="mpv">MPV</option>
              </select>
            </div>
          </div>
        )}

        {/* No Query State */}
        {!searchQuery && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Start Your Car Search</h2>
            <p className="text-gray-600">Enter a car name, brand, or type to find your perfect vehicle</p>
          </div>
        )}

        {/* No Results State */}
        {searchQuery && processedResults.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.291-1.002-5.824-2.582m0 0A7.962 7.962 0 016 9c0-.34.021-.677.06-1.009m5.824 2.582A7.963 7.963 0 0112 9a7.963 7.963 0 00-.176-1.581" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No cars found</h2>
            <p className="text-gray-600 mb-4">We couldn&apos;t find any cars matching &quot;{searchQuery}&quot;</p>
            <p className="text-gray-500 text-sm">Try searching with different keywords or check your spelling</p>
          </div>
        )}

        {/* Search Results */}
        {processedResults.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processedResults.map((car) => (
              <Link
                key={car.id}
                href={constructCarUrl(car)}
                className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-red-300"
              >
                {/* Car Image */}
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  {car.acf?.featured_image && imageUrls[car.id] ? (
                    <Image
                      src={imageUrls[car.id]}
                      alt={car.title?.rendered || 'Car image'}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <div className="text-center">
                        <svg className="w-12 h-12 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span className="text-2xl font-bold text-gray-500">
                          {(car.title?.rendered || 'Car').charAt(0)}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* Brand Badge */}
                  {car.acf?.brand_name && (
                    <div className="absolute top-3 left-3 bg-black/70 text-white px-2 py-1 rounded-md text-xs font-medium">
                      {car.acf.brand_name}
                    </div>
                  )}
                  
                  {/* Type Badge */}
                  {car.acf?.model_type && (
                    <div className="absolute top-3 right-3 bg-red-600 text-white px-2 py-1 rounded-md text-xs font-medium">
                      {car.acf.model_type}
                    </div>
                  )}
                </div>

                {/* Car Details */}
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-red-600 transition-colors mb-2 line-clamp-1">
                    {car.title?.rendered || 'Unknown Car'}
                  </h3>
                  
                  {/* Car Info */}
                  <div className="space-y-2 text-sm text-gray-600">
                    {car.acf?.brand_name && (
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span>Brand: {car.acf.brand_name}</span>
                      </div>
                    )}
                    
                    {car.acf?.model_type && (
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <span>Type: {car.acf.model_type}</span>
                      </div>
                    )}
                  </div>

                  {/* View Details Button */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-red-600 font-medium group-hover:text-red-700">
                        View Details
                      </span>
                      <svg className="w-5 h-5 text-red-600 group-hover:text-red-700 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Back to Home */}
        <div className="text-center mt-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
