"use client";
import { useState, useEffect } from 'react';
import { IoLocationSharp } from 'react-icons/io5';
import Cookies from 'js-cookie';
import LocationModal from './LocationModal';

const LocationSelector = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState({
    city: Cookies.get('selectedCity') || '',
    state: Cookies.get('selectedState') || ''
  });

  const handleLocationSelect = (location) => {
    setSelectedLocation({
      city: location.split(', ')[0],
      state: location.split(', ')[1]
    });
    setIsModalOpen(false);
  };

  const displayText = selectedLocation.city 
    ? `${selectedLocation.city}, ${selectedLocation.state}`
    : 'Select your location';

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full flex items-center gap-2.5 px-4 py-2.5 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors duration-200"
          aria-label="Select location"
        >
          <IoLocationSharp className={`flex-shrink-0 h-5 w-5 ${selectedLocation.city ? 'text-red-500' : 'text-gray-400'}`} />
          <span className={`flex-1 text-left truncate ${selectedLocation.city ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
            {displayText}
          </span>
          <svg 
            className="w-4 h-4 text-gray-400 transition-transform duration-200" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            style={{ transform: isModalOpen ? 'rotate(180deg)' : 'rotate(0)' }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <LocationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleLocationSelect}
      />
    </>
  );
};

export default LocationSelector;