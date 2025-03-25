'use client'
import React, { useState, useEffect, useCallback } from 'react';
import Logo from './Logo';
import SearchBar from './SearchBar';
import Navigation from './Navigation';
import LocationModal from './LocationModal';
import SearchModal from './SearchModal';
import { BiMenu, BiX, BiSearch } from 'react-icons/bi';
import { IoLocationSharp } from 'react-icons/io5';
import Cookies from 'js-cookie';

// Mobile header component
const MobileHeader = ({ 
  setIsMobileMenuOpen, 
  setIsSearchModalOpen, 
  setIsLocationModalOpen, 
  selectedLocation 
}) => (
  <div className="md:hidden border-b">
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsMobileMenuOpen(prev => !prev)}
          className="text-gray-700 hover:text-red-600 transition-colors bg-gray-100 border border-gray-200 rounded-[4px] p-1.5"
          aria-label="Toggle menu"
        >
          <BiMenu className="h-6 w-6" />
        </button>
        <Logo />
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsSearchModalOpen(true)}
          className="text-gray-700 hover:text-red-600 transition-colors"
          aria-label="Open search"
        >
          <BiSearch className="h-6 w-6" />
        </button>
        <button
          onClick={() => setIsLocationModalOpen(true)}
          className="relative text-gray-700 hover:text-red-600 transition-colors"
          aria-label={selectedLocation || 'Select Location'}
        >
          <IoLocationSharp className="h-7 w-7" />
          {selectedLocation && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
          )}
        </button>
      </div>
    </div>
  </div>
);

// Mobile menu overlay component
const MobileMenuOverlay = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-white md:hidden">
      <div className="px-4 pt-3">
        <div className="flex items-center justify-between border-b pb-3">
          <Logo />
          <button
            onClick={onClose}
            className="text-gray-700 hover:text-red-600 transition-colors p-1"
            aria-label="Close menu"
          >
            <BiX className="h-6 w-6" />
          </button>
        </div>
        <div className="py-4">
          <Navigation isMobile={true} />
        </div>
      </div>
    </div>
  );
};

// Desktop header component
const DesktopHeader = ({ setIsLocationModalOpen, selectedLocation }) => (
  <div className="hidden md:flex md:flex-col">
    <div className="border-b">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center gap-8">
          <Logo />
          <div className="flex flex-grow gap-4 justify-center items-center">
            <div className="w-64">
              <button
                onClick={() => setIsLocationModalOpen(true)}
                className="relative w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-[4px] text-sm focus:outline-none focus:ring-2 focus:ring-[#FF3B30] focus:border-transparent"
              >
                <IoLocationSharp className="text-gray-400 flex-shrink-0" />
                <span className="flex-1 text-left truncate">
                  {selectedLocation || 'Select Location'}
                </span>
                {selectedLocation && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>
            </div>
            <div className="flex-grow">
              <SearchBar className="rounded-[4px]" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="bg-white border-b">
      <div className="container mx-auto px-6">
        <Navigation />
      </div>
    </div>
  </div>
);

// Main Header component
const Header = () => {
  // State management
  const [uiState, setUiState] = useState({
    isMobileMenuOpen: false,
    isLocationModalOpen: false,
    isSearchModalOpen: false
  });
  const [selectedLocation, setSelectedLocation] = useState('');
  
  // Destructure UI states for readability
  const { isMobileMenuOpen, isLocationModalOpen, isSearchModalOpen } = uiState;
  
  // UI state handlers
  const updateUiState = (key, value) => {
    setUiState(prev => ({ ...prev, [key]: value }));
  };

  // Load initial location from cookies
  useEffect(() => {
    const savedState = Cookies.get('selectedState');
    const savedCity = Cookies.get('selectedCity');
    if (savedCity && savedState) {
      setSelectedLocation(`${savedCity}, ${savedState}`);
    }
  }, []);

  // Handler for location selection
  const handleLocationSelect = useCallback((location) => {
    setSelectedLocation(location);
    updateUiState('isLocationModalOpen', false);
  }, []);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 w-full mt-0 pt-0">
      {/* Mobile Header */}
      <MobileHeader 
        setIsMobileMenuOpen={(setter) => updateUiState('isMobileMenuOpen', setter(isMobileMenuOpen))}
        setIsSearchModalOpen={(value) => updateUiState('isSearchModalOpen', value)}
        setIsLocationModalOpen={(value) => updateUiState('isLocationModalOpen', value)}
        selectedLocation={selectedLocation}
      />

      {/* Modals */}
      <SearchModal 
        isOpen={isSearchModalOpen}
        onClose={() => updateUiState('isSearchModalOpen', false)}
      />

      <LocationModal 
        isOpen={isLocationModalOpen}
        onClose={() => updateUiState('isLocationModalOpen', false)}
        onSelect={handleLocationSelect}
      />

      {/* Mobile Menu Overlay */}
      <MobileMenuOverlay 
        isOpen={isMobileMenuOpen}
        onClose={() => updateUiState('isMobileMenuOpen', false)}
      />

      {/* Desktop Header */}
      <DesktopHeader 
        setIsLocationModalOpen={(value) => updateUiState('isLocationModalOpen', value)}
        selectedLocation={selectedLocation}
      />
    </header>
  );
};

export default Header;