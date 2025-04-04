"use client";
import { useState, useEffect, useRef } from 'react';
import { BiSearch, BiX, BiCurrentLocation } from 'react-icons/bi';
import { IoLocationSharp } from 'react-icons/io5';
import Cookies from 'js-cookie';

// Define popular cities
const popularCities = [
  { state: "Maharashtra", city: "Mumbai" },
  { state: "Delhi", city: "New Delhi" },
  { state: "Karnataka", city: "Bangalore" },
  { state: "Telangana", city: "Hyderabad" },
  { state: "Tamil Nadu", city: "Chennai" },
  { state: "West Bengal", city: "Kolkata" },
  { state: "Maharashtra", city: "Pune" },
  { state: "Gujarat", city: "Ahmedabad" }
];

const LocationModal = ({ isOpen, onClose, onSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState(Cookies.get('selectedState') || '');
  const [selectedCity, setSelectedCity] = useState(Cookies.get('selectedCity') || '');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setSuggestions([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.length < 2) {
        setSuggestions([]);
        return;
      }

      // Cancel previous request if it exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller for this request
      abortControllerRef.current = new AbortController();
      setIsLoading(true);

      try {
        const response = await fetch(
          `/api/location/autocomplete?term=${encodeURIComponent(searchQuery)}`,
          { signal: abortControllerRef.current.signal }
        );
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setSuggestions(data.suggestions);
      } catch (error) {
        if (error.name === 'AbortError') {
          // Ignore abort errors
          return;
        }
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 400); // Increased debounce time
    return () => {
      clearTimeout(debounceTimer);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [searchQuery]);

  const handleLocationSelect = (state, city) => {
    setSelectedState(state);
    setSelectedCity(city);
    
    // Store in cookies
    Cookies.set('selectedState', state, { expires: 30 }); // 30 days
    Cookies.set('selectedCity', city, { expires: 30 });
    
    onSelect(`${city}, ${state}`);
  };

  const handleAutoDetectLocation = () => {
    setIsDetectingLocation(true);

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      setIsDetectingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          const response = await fetch(
            `/api/location/detect?latitude=${latitude}&longitude=${longitude}`
          );

          if (!response.ok) {
            throw new Error('Failed to detect location');
          }

          const data = await response.json();
          handleLocationSelect(data.state, data.city);
        } catch (error) {
          console.error("Error detecting location:", error);
          alert("Unable to detect your location. Please select manually.");
        } finally {
          setIsDetectingLocation(false);
        }
      },
      (error) => {
        console.error("Error getting coordinates:", error);
        alert("Unable to detect your location. Please select manually.");
        setIsDetectingLocation(false);
      }
    );
  };

  if (!isOpen) return null;

  const groupedSuggestions = suggestions.reduce((acc, item) => {
    if (!acc[item.state]) {
      acc[item.state] = [];
    }
    acc[item.state].push(item.city);
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop with enhanced blur */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Desktop Modal */}
      <div className="hidden md:flex relative w-full min-h-screen items-start justify-center p-4">
        <div className={`bg-white rounded-xl shadow-xl transform transition-all duration-300 ${
          isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Select Location
              </h3>
              <button
                onClick={onClose}
                className="p-1 text-gray-400 hover:text-gray-500"
              >
                <BiX className="w-6 h-6" />
              </button>
            </div>

            {/* Auto-detect button */}
            <button
              onClick={handleAutoDetectLocation}
              disabled={isDetectingLocation}
              className="w-full mb-4 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-[4px] text-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#FF3B30] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <BiCurrentLocation className={`${isDetectingLocation ? 'animate-spin' : ''}`} />
              {isDetectingLocation ? 'Detecting Location...' : 'Auto Detect Location'}
            </button>

            {/* Search input */}
            <div className="relative mb-4">
              <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search state or city..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-[4px] text-sm focus:outline-none focus:ring-2 focus:ring-[#FF3B30] focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {isLoading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-[#FF3B30] rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            {selectedCity && selectedState && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-500 mb-3 px-3">Selected Location</h4>
                <div className="flex items-center gap-3 p-3 bg-red-50 text-red-600 rounded-[4px]">
                  <IoLocationSharp className="flex-shrink-0 text-red-600" />
                  <span className="text-sm">{`${selectedCity}, ${selectedState}`}</span>
                </div>
              </div>
            )}

            {/* Popular Cities */}
            {!searchQuery && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-3 px-3">Popular Cities</h4>
                <div className="grid grid-cols-2 gap-2">
                  {popularCities.map(({ state, city }) => (
                    <button
                      key={`popular-${state}-${city}`}
                      onClick={() => handleLocationSelect(state, city)}
                      className={`flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-[4px] transition-colors ${
                        selectedState === state && selectedCity === city
                          ? 'bg-red-50 text-red-600'
                          : ''
                      }`}
                    >
                      <IoLocationSharp className={`flex-shrink-0 ${
                        selectedState === state && selectedCity === city
                          ? 'text-red-600'
                          : 'text-gray-400'
                      }`} />
                      <span className="text-sm">{city}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search Results */}
            <div className="max-h-[400px] overflow-y-auto">
              <div className="space-y-4">
                {searchQuery.length >= 2 ? (
                  Object.entries(groupedSuggestions).map(([state, cities]) => (
                    <div key={state} className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-500 px-3">{state}</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {cities.map((city) => (
                          <button
                            key={`${state}-${city}`}
                            onClick={() => handleLocationSelect(state, city)}
                            className={`flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-[4px] transition-colors ${
                              selectedState === state && selectedCity === city
                                ? 'bg-red-50 text-red-600'
                                : ''
                            }`}
                          >
                            <IoLocationSharp className={`flex-shrink-0 ${
                              selectedState === state && selectedCity === city
                                ? 'text-red-600'
                                : 'text-gray-400'
                            }`} />
                            <span className="text-sm">{city}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))
                ) : searchQuery.length > 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">Type at least 2 characters to search</p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Sheet */}
      <div className="md:hidden fixed inset-0 z-50">
        {/* Backdrop with blur */}
        <div 
          className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
        
        {/* Draggable area */}
        <div 
          className="absolute inset-0 z-10" 
          onClick={onClose}
        />
        
        {/* Modal Content */}
        <div className="relative h-full mt-auto bg-white animate-slideUp rounded-t-xl z-20">
          {/* Drag Handle */}
          <div className="w-full flex justify-center pt-3 pb-2">
            <div className="w-12 h-1.5 rounded-full bg-gray-300"></div>
          </div>

          <div className="flex flex-col h-[calc(100%-24px)]">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Select Location</h3>
                <button
                  onClick={onClose}
                  className="p-2 -mr-2 rounded-full text-gray-500 hover:text-gray-900 
                           hover:bg-gray-100/80 active:bg-gray-200 transition-all"
                  aria-label="Close location dialog"
                >
                  <BiX className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Selected Location */}
              {selectedCity && selectedState && (
                <div className="p-4 bg-red-50/50">
                  <div className="flex items-center gap-3 text-red-600">
                    <IoLocationSharp className="h-5 w-5" />
                    <span className="font-medium">{`${selectedCity}, ${selectedState}`}</span>
                  </div>
                </div>
              )}

              {/* Rest of the content */}
              <div className="p-4 space-y-4">
                {/* Auto-detect button */}
                <button
                  onClick={handleAutoDetectLocation}
                  disabled={isDetectingLocation}
                  className="w-full flex items-center justify-center gap-2 p-3 
                           bg-gray-50 hover:bg-gray-100 active:bg-gray-200 
                           rounded-lg border border-gray-200 transition-all
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <BiCurrentLocation className={`h-5 w-5 ${isDetectingLocation ? 'animate-spin' : ''}`} />
                  <span className="font-medium">
                    {isDetectingLocation ? 'Detecting...' : 'Use Current Location'}
                  </span>
                </button>

                {/* Search input */}
                <div className="relative">
                  <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search city or state..."
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 
                             rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 
                             focus:border-red-500 transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {isLoading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="w-5 h-5 border-2 border-red-500/20 border-t-red-500 
                                    rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>

                {/* Popular Cities or Search Results */}
                <div className="space-y-4">
                  {searchQuery.length >= 2 ? (
                    Object.entries(groupedSuggestions).map(([state, cities]) => (
                      <div key={state} className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-500">{state}</h4>
                        <div className="space-y-1">
                          {cities.map((city) => (
                            <button
                              key={`${state}-${city}`}
                              onClick={() => handleLocationSelect(state, city)}
                              className={`flex items-center w-full gap-3 p-3 text-left hover:bg-gray-50 rounded-[4px] transition-colors ${
                                selectedState === state && selectedCity === city
                                  ? 'bg-red-50 text-red-600'
                                  : ''
                              }`}
                            >
                              <IoLocationSharp className={`flex-shrink-0 ${
                                selectedState === state && selectedCity === city
                                  ? 'text-red-600'
                                  : 'text-gray-400'
                              }`} />
                              <span className="text-sm">{city}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : searchQuery.length > 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">Type at least 2 characters to search</p>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Safe area for bottom notch */}
            <div className="safe-bottom" />
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slideUp {
          animation: slideUp 0.25s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .safe-bottom {
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>
    </div>
  );
};

export default LocationModal;