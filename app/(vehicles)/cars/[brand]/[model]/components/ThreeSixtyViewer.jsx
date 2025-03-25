'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ThreeSixtyViewer({ 
  threeSixtyView, 
  title, 
  brand, 
  model, 
  isFullPage = false 
}) {
  const [activeView, setActiveView] = useState('exterior');
  
  const hasExterior = !!threeSixtyView?.exterior;
  const hasInterior = !!threeSixtyView?.interior;
  const has360View = hasExterior || hasInterior;
  
  // Use useEffect to handle initial view selection based on available views
  useEffect(() => {
    if (!hasExterior && hasInterior) {
      setActiveView('interior');
    } else if (hasExterior) {
      setActiveView('exterior');
    }
  }, [hasExterior, hasInterior]);
  
  if (!has360View) {
    return (
      <div className="bg-gray-50 p-8 rounded-lg text-center">
        <p className="text-gray-600">360° views are currently unavailable.</p>
      </div>
    );
  }
  
  return (
    <div className="w-full">
      {/* Navigation Tabs - Only show if both views are available */}
      {hasExterior && hasInterior && (
        <div className="mb-6 flex border-b border-gray-200">
          <button 
            className={`py-3 px-6 border-b-2 font-medium transition-colors ${
              activeView === 'exterior' 
                ? 'border-red-600 text-red-600' 
                : 'border-transparent hover:text-red-600'
            }`}
            onClick={() => setActiveView('exterior')}
            aria-selected={activeView === 'exterior'}
            role="tab"
          >
            Exterior View
          </button>
          <button 
            className={`py-3 px-6 border-b-2 font-medium transition-colors ${
              activeView === 'interior' 
                ? 'border-red-600 text-red-600' 
                : 'border-transparent hover:text-red-600'
            }`}
            onClick={() => setActiveView('interior')}
            aria-selected={activeView === 'interior'}
            role="tab"
          >
            Interior View
          </button>
        </div>
      )}
      
      {/* Exterior 360° View */}
      {hasExterior && activeView === 'exterior' && (
        <div className={isFullPage ? "mb-8" : ""} role="tabpanel" aria-label="Exterior View">
          {isFullPage && (
            <h2 className="text-2xl font-semibold mb-6">Exterior 360° View</h2>
          )}
          <div className={`${isFullPage ? "bg-white rounded-xl overflow-hidden border border-gray-200 p-6" : ""}`}>
            {isFullPage && (
              <p className="text-gray-600 mb-4">
                Explore the {title} from every angle. Click and drag to rotate the vehicle and see all exterior details.
              </p>
            )}
            <div className="aspect-[16/9] rounded-lg overflow-hidden">
              <iframe
                src={threeSixtyView.exterior}
                className="w-full h-full"
                title={`${title} Exterior 360° View`}
                allowFullScreen
              />
            </div>
            {isFullPage && (
              <div className="mt-4 text-sm text-gray-500">
                <p>Tip: Click and drag to rotate. Use mouse wheel or pinch to zoom.</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Interior 360° View */}
      {hasInterior && activeView === 'interior' && (
        <div className={isFullPage ? "mb-8" : ""} role="tabpanel" aria-label="Interior View">
          {isFullPage && (
            <h2 className="text-2xl font-semibold mb-6">Interior 360° View</h2>
          )}
          <div className={`${isFullPage ? "bg-white rounded-xl overflow-hidden border border-gray-200 p-6" : ""}`}>
            {isFullPage && (
              <p className="text-gray-600 mb-4">
                Step inside the {title} and explore the cabin in detail. Look around to see all interior features.
              </p>
            )}
            <div className="aspect-[16/9] rounded-lg overflow-hidden">
              <iframe
                src={threeSixtyView.interior}
                className="w-full h-full"
                title={`${title} Interior 360° View`}
                allowFullScreen
              />
            </div>
            {isFullPage && (
              <div className="mt-4 text-sm text-gray-500">
                <p>Tip: Click and drag to look around. Use mouse wheel or pinch to zoom.</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* View Full Experience Link - Only show on main page */}
      {!isFullPage && (
        <div className="mt-4 text-center">
          <Link 
            href={`/cars/${brand}/${model}/360-view`}
            className="text-red-600 hover:underline inline-flex items-center gap-1"
          >
            <span>View Full Experience</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
} 