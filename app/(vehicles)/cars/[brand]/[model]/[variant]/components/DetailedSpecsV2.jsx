'use client';
import React, { useState, useEffect, useRef } from 'react';

export default function DetailedSpecsV2({ groupedAttributes }) {
  const [activeSection, setActiveSection] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const contentRef = useRef(null);

  // Filter function for specifications
  const filteredAttributes = Object.entries(groupedAttributes).map(([groupName, attributes]) => {
    const filteredGroupAttributes = attributes.filter(attr => {
      const searchLower = searchQuery.toLowerCase();
      const nameMatch = attr.attribute_name.toLowerCase().includes(searchLower);
      const valueMatch = Array.isArray(attr.attribute_values) 
        ? attr.attribute_values.some(val => val.toLowerCase().includes(searchLower))
        : attr.attribute_values.toLowerCase().includes(searchLower);
      return nameMatch || valueMatch;
    });

    return [groupName, filteredGroupAttributes];
  }).filter(([_, attributes]) => attributes.length > 0);

  // Handle scroll in the content area
  const handleScroll = (e) => {
    const container = e.target;
    const sections = container.querySelectorAll('[data-section]');
    
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const isVisible = rect.top >= containerRect.top && rect.bottom <= containerRect.bottom;
      
      if (isVisible) {
        setActiveSection(section.dataset.section);
      }
    });
  };

  // Scroll to section when clicking sidebar
  const scrollToSection = (sectionName) => {
    const section = contentRef.current?.querySelector(`[data-section="${sectionName}"]`);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(sectionName);
    }
  };

  return (
    <section className="mb-12">
      <h2 className="text-xl md:text-3xl font-semibold text-gray-800 mb-6">Detailed Specifications</h2>
      
      {/* Search Input */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search specifications..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 text-sm md:px-4 md:py-3 md:text-base rounded-xl border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all duration-200"
        />
        <svg
          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Main container with fixed height */}
      <div className="flex gap-2 md:gap-6 h-[500px] md:h-[600px]">
        {/* Sidebar Navigation - Always visible */}
        <nav className="w-32 md:w-64 bg-gray-900 rounded-xl border border-gray-700 shadow-lg h-full">
          <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
            <ul className="p-2 md:p-4 space-y-1 md:space-y-2">
              {filteredAttributes.map(([groupName, attributes]) => (
                <li key={groupName}>
                  <button
                    onClick={() => scrollToSection(groupName)}
                    className={`w-full text-left px-2 md:px-4 py-1.5 md:py-2 rounded-lg transition-all duration-200 text-xs md:text-base ${
                      activeSection === groupName
                        ? 'bg-red-500/20 text-red-400 font-medium'
                        : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                    }`}
                  >
                    <span className="block truncate">
                      {groupName}
                      {searchQuery && (
                        <span className="ml-1 text-[10px] md:text-sm text-gray-400">
                          ({attributes.length})
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Main Content - Scrollable */}
        <div 
          ref={contentRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto space-y-3 md:space-y-6 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-100"
        >
          {filteredAttributes.map(([groupName, groupAttributes]) => (
            <div
              key={groupName}
              data-section={groupName}
              className="bg-white rounded-xl shadow-md border border-gray-100 p-3 md:p-6"
            >
              <h3 className="text-sm md:text-lg font-semibold text-gray-700 mb-3 md:mb-4">{groupName}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 md:gap-y-4 gap-x-4 md:gap-x-6">
                {groupAttributes.map((attr) => (
                  <div key={attr.attribute_id} className="border-b border-gray-200 pb-2 md:pb-3">
                    <dt className="text-gray-600 text-[10px] md:text-sm leading-tight">{attr.attribute_name}</dt>
                    <dd className="mt-0.5 md:mt-1 font-medium text-gray-800 text-xs md:text-base truncate">
                      {Array.isArray(attr.attribute_values) 
                        ? attr.attribute_values.join(', ')
                        : attr.attribute_values}
                    </dd>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* No results message */}
          {searchQuery && filteredAttributes.length === 0 && (
            <div className="text-center py-4 md:py-8 text-gray-500 text-xs md:text-base">
              No specifications found matching &quot;{searchQuery}&quot;
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
