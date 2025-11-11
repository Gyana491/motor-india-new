'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const HeroSearchSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const searchRef = useRef(null);
  const resultsRef = useRef(null);

  // Simplified image fetching function for client-side use
  const fetchImageUrl = async (mediaId) => {
    try {
      if (!process.env.NEXT_PUBLIC_BACKEND || !mediaId) return null;
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND}/wp-json/wp/v2/media/${mediaId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'cors',
          credentials: 'omit'
        }
      );
      
      if (!response.ok) {
        console.warn(`Failed to fetch media ${mediaId}: ${response.status}`);
        return null;
      }
      
      const data = await response.json();
      return data.source_url || data.guid?.rendered || null;
    } catch (error) {
      console.warn('Image fetch error for media ID:', mediaId, error.message);
      return null;
    }
  };

  const constructCarUrl = (car) => {
    // Ensure we have the required data to construct a URL
    if (!car || !car.acf) {
      return '/cars'; // Fallback to cars listing page
    }
    
    const brandName = car.acf.brand_name?.toLowerCase()?.trim() || '';
    const modelSlug = car.acf.model_slug?.toLowerCase()?.trim() || car.slug?.toLowerCase()?.trim() || '';
    
    // If we don't have both brand and model, return cars page
    if (!brandName || !modelSlug) {
      return '/cars';
    }
    
    const cleanBrandName = brandName.replace(/\s+/g, '-');
    const cleanModelSlug = modelSlug.replace(/\s+/g, '-');
    
    return `/cars/${cleanBrandName}/${cleanModelSlug}`;
  };

  // Handle search with debouncing - using the same API as header search
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      setIsLoading(true);
      try {
        // Check if environment variable is available
        if (!process.env.NEXT_PUBLIC_BACKEND) {
          console.error('NEXT_PUBLIC_BACKEND environment variable is not defined');
          setSearchResults([]);
          return;
        }

        // Create timeout controller
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        let response;
        try {
          response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND}/wp-json/wp/v2/car?search=${encodeURIComponent(searchQuery)}&_fields=id,title,slug,acf,featured_media&per_page=8`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
              signal: controller.signal
            }
          );
          clearTimeout(timeoutId);
        } catch (fetchError) {
          clearTimeout(timeoutId);
          throw fetchError;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Ensure data is an array
        const carsData = Array.isArray(data) ? data : [];
        
        // Fetch images for cars with featured_image and attach them to the car objects
        const carsWithImages = await Promise.allSettled(
          carsData.map(async (car) => {
            if (car && car.id && car.acf?.featured_image) {
              try {
                const imageUrl = await fetchImageUrl(car.acf.featured_image);
                return {
                  ...car,
                  imageUrl: imageUrl || null
                };
              } catch (error) {
                console.warn(`Failed to fetch image for car ${car.id}:`, error);
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

        // Extract successful results
        const successfulResults = carsWithImages
          .filter(result => result.status === 'fulfilled')
          .map(result => result.value);
        
        setSearchResults(successfulResults);
        setShowResults(true);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
        setShowResults(false);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Handle click outside to close results
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current && 
        !searchRef.current.contains(event.target) &&
        resultsRef.current &&
        !resultsRef.current.contains(event.target)
      ) {
        setShowResults(false);
        setIsInputFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Redirect to search results page
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const handleResultClick = (car) => {
    try {
      const url = constructCarUrl(car);
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error navigating to car:', error);
      // Fallback to cars page
      window.location.href = '/cars';
    }
    setShowResults(false);
    setIsInputFocused(false);
    setSearchQuery('');
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  };

  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-red-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      {/* Car silhouettes for decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 right-10 w-32 h-16 bg-white rounded-lg transform rotate-12"></div>
        <div className="absolute bottom-20 left-10 w-24 h-12 bg-white rounded-lg transform -rotate-6"></div>
        <div className="absolute top-1/2 right-1/4 w-20 h-10 bg-white rounded-lg transform rotate-45"></div>
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="text-center max-w-4xl mx-auto">
          {/* Hero Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
            Discover Your
            <span className="block bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
              Perfect Car
            </span>
          </h1>

          {/* Hero Subtext */}
          <p className="text-lg sm:text-xl md:text-2xl text-slate-300 mb-8 sm:mb-12 leading-relaxed max-w-3xl mx-auto">
            Explore thousands of cars, compare prices, read reviews, and find the ideal vehicle for your journey in India
          </p>

          {/* Search Section */}
          <div className="relative max-w-2xl mx-auto mb-8" role="search">
            {/* Converted form to div so Enter key doesn't trigger redirect; only Search button navigates */}
              <div 
                ref={searchRef}
                className={`relative flex items-center bg-white rounded-2xl shadow-2xl transition-all duration-300 ${
                  isInputFocused ? 'ring-4 ring-red-500/30 shadow-red-500/20' : 'hover:shadow-xl'
                }`}
              >
                {/* Search Icon */}
                <div className="absolute left-4 sm:left-6 text-slate-400">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                {/* Search Input */}
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    setIsInputFocused(true);
                    if (searchResults.length > 0) setShowResults(true);
                  }}
                  onKeyDown={(e) => {
                    // Prevent Enter key from redirecting; user must click Search button
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      e.stopPropagation();
                    }
                  }}
                  placeholder="Search cars..."
                  className="w-full pl-12 sm:pl-16 pr-16 sm:pr-20 py-4 sm:py-5 text-slate-800 text-base sm:text-lg rounded-2xl border-0 focus:outline-none focus:ring-0 placeholder-slate-400"
                />

                {/* Clear Search Button */}
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-16 sm:right-20 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}

                {/* Loading Spinner */}
                {isLoading && (
                  <div className="absolute right-16 sm:right-20">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-red-600 border-t-transparent"></div>
                  </div>
                )}

                {/* Search Button */}
                <button
                  type="button"
                  onClick={handleSearchSubmit}
                  className="absolute right-2 bg-red-600 hover:bg-red-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-colors duration-200 font-semibold text-sm sm:text-base"
                >
                  Search
                </button>
              </div>
            

            {/* Search Results Dropdown */}
            {showResults && searchResults.length > 0 && (
              <div 
                ref={resultsRef}
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 max-h-96 overflow-y-auto z-50"
              >
                {searchResults.filter(car => car && car.id && car.title).map((car) => (
                  <button
                    key={car.id}
                    onClick={() => handleResultClick(car)}
                    className="w-full flex items-center px-4 sm:px-6 py-3 sm:py-4 hover:bg-slate-50 transition-colors duration-200 border-b border-slate-100 last:border-b-0 text-left"
                  >
                    {/* Car Image */}
                    <div className="relative w-12 h-12 flex-shrink-0 mr-3 sm:mr-4 bg-slate-100 rounded-lg overflow-hidden">
                      {car.imageUrl ? (
                        <Image
                          src={car.imageUrl}
                          alt={car.title?.rendered || car.title || 'Car image'}
                          width={48}
                          height={48}
                          className="object-cover w-full h-full"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400 text-xl font-medium">
                          {(car.title?.rendered || car.title || 'C').charAt(0)}
                        </div>
                      )}
                    </div>

                    {/* Car Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-slate-900 font-semibold text-sm sm:text-base truncate">
                        {car.title?.rendered || car.title || 'Unknown Car'}
                      </h3>
                      {car.acf?.model_type && (
                        <div className="flex items-center text-xs sm:text-sm text-slate-500 mt-1">
                          <span>{car.acf.brand_name}</span>
                          <span className="mx-2">•</span>
                          <span>{car.acf.model_type}</span>
                        </div>
                      )}
                    </div>

                    {/* Arrow Icon */}
                    <div className="ml-2 text-slate-400">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                ))}

                {/* Removed "View all results" link to ensure only Search button triggers redirect */}
              </div>
            )}

            {/* No Results Message */}
            {showResults && searchResults.length === 0 && !isLoading && searchQuery.length >= 2 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 px-6 py-8 text-center z-50">
                <div className="text-slate-500 mb-2">
                  <svg className="w-12 h-12 mx-auto mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <p className="text-lg font-medium text-slate-600">No cars found</p>
                  <p className="text-sm text-slate-500 mt-1">Try a different search term</p>
                </div>
              </div>
            )}

            {/* Loading State */}
            {isLoading && showResults && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 px-6 py-8 text-center z-50">
                <div className="animate-spin inline-block w-8 h-8 border-2 border-slate-300 border-t-red-600 rounded-full mb-4"></div>
                <p className="text-slate-600">Searching cars...</p>
              </div>
            )}
          </div>

          {/* Popular Car Links */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 max-w-4xl mx-auto">
            <span className="text-slate-400 text-sm sm:text-base font-medium mb-2 sm:mb-0">Popular:</span>
            {[
              { name: 'Nexon', url: '/cars/tata/nexon' },
              { name: 'Punch', url: '/cars/tata/punch' },
              { name: 'Fronx', url: '/cars/maruti/fronx' },
              { name: 'Thar', url: '/cars/mahindra/thar' },
              { name: 'Venue', url: '/cars/hyundai/venue' },
              { name: 'Creta', url: '/cars/hyundai/creta' },
              { name: 'Tiago', url: '/cars/tata/tiago' },
              { name: 'BMW X7', url: '/cars/bmw/x7' },
              { name: 'Range Rover', url: '/cars/land-rover/range-rover' },
             
            ].map((car) => (
              <Link
                key={car.name}
                href={car.url}
                className="px-3 sm:px-4 py-1 sm:py-2 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-medium rounded-full transition-colors duration-200 border border-white/20 hover:border-white/30"
              >
                {car.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSearchSection;