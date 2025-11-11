"use client";
import { useState, useEffect, useRef } from 'react';
import { BiSearch } from 'react-icons/bi';
import { IoMdClose } from 'react-icons/io';
import Link from 'next/link';
import Image from 'next/image';

const SearchBar = ({ className, autoFocus, onClose }) => {
  const [searchValue, setSearchValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState({});
  const searchRef = useRef(null);

  const fetchMediaDetails = async (mediaId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/wp-json/wp/v2/media/${mediaId}`);
      if (!response.ok) throw new Error('Failed to fetch media');
      const data = await response.json();
      return data.media_details.sizes.thumbnail.source_url;
    } catch (error) {
      console.error('Media fetch error:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchValue.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND}/wp-json/wp/v2/car?search=${encodeURIComponent(searchValue)}&_fields=id,title,slug,acf,featured_media&per_page=5`
        );
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        
        // Fetch media URLs for each car that has featured_media
        const mediaPromises = data.map(async (car) => {
          if (car.acf?.featured_image) {
            const mediaUrl = await fetchMediaDetails(car.acf.featured_image);
            if (mediaUrl) {
              setImageUrls(prev => ({ ...prev, [car.id]: mediaUrl }));
            }
          }
        });
        
        await Promise.all(mediaPromises);
        setSuggestions(data);
      } catch (error) {
        console.error('Search error:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchValue]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const clearSearch = () => {
    setSearchValue('');
    setSuggestions([]);
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

  const handleSearchSubmit = () => {
    const q = searchValue.trim();
    if (!q) return;
    if (onClose) onClose();
    window.location.href = `/search?q=${encodeURIComponent(q)}`;
  };

  return (
    <div className={`relative transition-all duration-300 ${className}`} ref={searchRef} role="search">
      <div className={`flex items-center bg-white overflow-hidden rounded-lg 
        border ${isFocused ? 'border-[#FF3B30] shadow-lg' : 'border-gray-200'} 
        transition-all duration-200 hover:shadow-md`}>
        <span className="pl-4 text-gray-400">
          <BiSearch className={`text-xl transition-colors ${isFocused ? 'text-[#FF3B30]' : 'text-gray-400'}`} />
        </span>
        
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search cars..."
          autoFocus={autoFocus}
          onFocus={() => setIsFocused(true)}
          onKeyDown={(e) => {
            // Prevent Enter from submitting; only the Search button triggers redirect
            if (e.key === 'Enter') {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
          className="w-full px-3 py-3 bg-transparent focus:outline-none text-gray-700"
        />
        
        {searchValue && (
          <button 
            onClick={clearSearch}
            className="pr-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <IoMdClose className="text-lg" />
          </button>
        )}

        {/* Search button - only this navigates to /search */}
        <button
          type="button"
          onClick={handleSearchSubmit}
          className="mx-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded"
        >
          Search
        </button>
      </div>

      {/* Search Suggestions Dropdown */}
      {isFocused && searchValue.trim().length > 1 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-[400px] overflow-y-auto z-50">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin inline-block w-6 h-6 border-2 border-gray-300 border-t-red-600 rounded-full"></div>
            </div>
          ) : suggestions.length > 0 ? (
            <div className="py-2">
              {suggestions.map((car) => (
                <Link
                  key={car.id}
                  href={constructCarUrl(car)}
                  className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors gap-3"
                  onClick={(e) => {
                    e.preventDefault();
                    const url = constructCarUrl(car);
                    if (onClose) {
                      onClose();
                      setTimeout(() => {
                        window.location.href = url;
                      }, 100);
                    } else {
                      window.location.href = url;
                    }
                    setIsFocused(false);
                    clearSearch();
                  }}
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-md overflow-hidden relative">
                    {car.acf?.featured_image && imageUrls[car.id] ? (
                      <Image
                        src={imageUrls[car.id]}
                        alt={car.title.rendered}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400 text-xl font-medium">
                        {car.title.rendered.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-gray-900 font-medium">{car.title.rendered}</h4>
                    {car.acf?.model_type && (
                      <p className="text-sm text-gray-500 mt-1">
                        {car.acf.brand_name} | {car.acf.model_type}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;