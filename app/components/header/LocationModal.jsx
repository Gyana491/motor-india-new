"use client";
import { useState, useEffect } from 'react';
import { BiSearch, BiX } from 'react-icons/bi';
import { IoLocationSharp } from 'react-icons/io5';
import Cookies from 'js-cookie';
import citiesData from './cities.json';

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

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
    }
  }, [isOpen]);

  const handleLocationSelect = (state, city) => {
    setSelectedState(state);
    setSelectedCity(city);
    
    // Store in cookies
    Cookies.set('selectedState', state, { expires: 30 }); // 30 days
    Cookies.set('selectedCity', city, { expires: 30 });
    
    onSelect(`${city}, ${state}`);
  };

  if (!isOpen) return null;

  const filteredLocations = Object.entries(citiesData)
    .reduce((acc, [state, cities]) => {
      const matchingCities = cities.filter(city => 
        city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        state.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      if (matchingCities.length > 0) {
        acc.push({ state, cities: matchingCities });
      }
      return acc;
    }, []);

  return (
    <div className={`fixed inset-0 z-50 overflow-y-auto transition-opacity duration-300 ${
      isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
    }`}>
      <div className="flex min-h-screen text-center">
        {/* Background overlay with smooth transition */}
      <div 
          className={`fixed inset-0 bg-gray-500 transition-opacity duration-300 ${
            isOpen ? 'bg-opacity-75' : 'bg-opacity-0'
          }`}
        onClick={onClose}
      ></div>
      
      {/* Desktop Modal */}
        <div className="relative w-full">
          <div className="hidden md:block">
            <div className={`inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all duration-300 sm:my-8 sm:align-middle sm:max-w-lg sm:w-full mx-auto mt-[10vh] ${
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

              {/* All Locations */}
              <div className="max-h-[400px] overflow-y-auto">
                <div className="space-y-4">
                  {filteredLocations.map(({ state, cities }) => (
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
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

          {/* Mobile Bottom Sheet with smooth slide-up animation */}
          <div className={`md:hidden fixed inset-x-0 bottom-0 z-50 transition-transform duration-300 transform bg-white rounded-t-xl shadow-lg ${
        isOpen ? 'translate-y-0' : 'translate-y-full'
      }`}>
        {/* Mobile content - similar structure but with single column layout */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
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

        <div className="p-4">
          {/* Add Selected Location Display for Mobile */}
          {selectedCity && selectedState && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-500 mb-3">Selected Location</h4>
              <div className="flex items-center gap-3 p-3 bg-red-50 text-red-600 rounded-[4px]">
                <IoLocationSharp className="flex-shrink-0 text-red-600" />
                <span className="text-sm">{`${selectedCity}, ${selectedState}`}</span>
              </div>
            </div>
          )}

          {/* Existing Search Input */}
          <div className="relative">
            <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search state or city..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-[4px] text-sm focus:outline-none focus:ring-2 focus:ring-[#FF3B30] focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="px-4 pb-4 max-h-[60vh] overflow-y-auto">
          {/* Popular Cities for Mobile */}
          {!searchQuery && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-500 mb-3">Popular Cities</h4>
              <div className="space-y-1">
                {popularCities.map(({ state, city }) => (
                  <button
                    key={`popular-${state}-${city}`}
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
          )}

          {/* All Locations */}
          <div className="space-y-4">
            {filteredLocations.map(({ state, cities }) => (
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
            ))}
          </div>
        </div>
      </div>
        </div>
      </div>
    </div>
  );
};

// Update the location buttons styling in both desktop and mobile views
const LocationButton = ({ state, city, isSelected, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 p-3.5 text-left rounded-lg transition-all duration-200 ${
      isSelected
        ? 'bg-red-50 text-red-600 ring-1 ring-red-200'
        : 'hover:bg-gray-50'
    }`}
  >
    <IoLocationSharp className={`flex-shrink-0 ${
      isSelected ? 'text-red-600' : 'text-gray-400'
    }`} />
    <span className={`text-sm ${isSelected ? 'font-medium' : ''}`}>{city}</span>
  </button>
);

export default LocationModal;