'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function ColorGallery({ colorImages, title, brand, model }) {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const scrollContainerRef = useRef(null);
  
  // Convert object to array for easier handling
  const colorArray = Object.values(colorImages)
    .filter(color => color && color.url && color.alt);
  
  if (colorArray.length === 0) return null;
  
  const selectedColor = colorArray[selectedColorIndex];
  
  const scrollTo = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };
  
  return (
    <section className="mb-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Available Colors</h2>
        <Link 
          href={`/cars/${brand}/${model}/colors`}
          className="text-red-600 hover:text-red-700 font-medium flex items-center gap-2"
        >
          View All Colors
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
      
      {/* Main Color Display */}
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 mb-8 shadow-sm hover:shadow-md transition-shadow">
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={selectedColor.url}
            alt={`${title} in ${selectedColor.alt}`}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
          />
        </div>
        <div className="p-6 flex justify-between items-center bg-gradient-to-b from-gray-50">
          <h3 className="text-2xl font-medium text-gray-900">{selectedColor.alt}</h3>
          <Link
            href={`/cars/${brand}/${model}/colors`}
            className="text-red-600 hover:text-red-700 font-medium flex items-center gap-2"
          >
            See more details
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
      
      {/* Color Selection Strip */}
      <div className="relative max-w-4xl mx-auto">
        {colorArray.length > 5 && (
          <>
            <button
              onClick={() => scrollTo('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 border border-gray-200"
              aria-label="Scroll left"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scrollTo('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 border border-gray-200"
              aria-label="Scroll right"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
        <div 
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto px-2 pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-red-600 scrollbar-track-gray-200 scrollbar-thumb-rounded-full scrollbar-track-rounded-full"
          style={{
            scrollbarWidth: 'thin',
            msOverflowStyle: 'none',
          }}
        >
          {colorArray.map((color, index) => (
            <button
              key={index}
              onClick={() => setSelectedColorIndex(index)}
              className={`relative w-20 h-20 rounded-xl overflow-hidden transition-all duration-300 flex-shrink-0 snap-center
                ${index === selectedColorIndex 
                  ? 'ring-3 ring-red-600 scale-110 shadow-lg' 
                  : 'ring-1 ring-gray-200 hover:ring-2 hover:ring-red-400 hover:scale-105'}`}
              title={color.alt || ''}
            >
              <Image
                src={color.url}
                alt={color.alt || ''}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}