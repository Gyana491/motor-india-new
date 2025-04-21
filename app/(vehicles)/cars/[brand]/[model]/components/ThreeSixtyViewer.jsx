'use client';

import { useState, useEffect } from 'react';

export default function ThreeSixtyViewer({ threeSixtyView, title = '', size = 'large' }) {
  const [activeView, setActiveView] = useState('exterior');
  const [deviceType, setDeviceType] = useState('desktop');
  
  const hasExterior = !!threeSixtyView?.exterior;
  const hasInterior = !!threeSixtyView?.interior;
  
  // Set initial active view based on available content
  useEffect(() => {
    if (!hasExterior && hasInterior) {
      setActiveView('interior');
    }
    
    // Detect device type for optimized instructions
    const detectDeviceType = () => {
      const ua = navigator.userAgent;
      if (/Mobi|Android|iPhone/i.test(ua)) {
        setDeviceType('mobile');
      } else if (/iPad|Tablet/i.test(ua)) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };
    
    detectDeviceType();
  }, [hasExterior, hasInterior]);
  
  // Generate size-specific classes based on the size prop
  const containerClasses = {
    small: "max-w-[320px]",
    medium: "max-w-[480px]",
    large: "w-full max-w-none"
  };
  
  const aspectRatioClasses = {
    small: "aspect-[4/3]", 
    medium: "aspect-[16/10]",
    large: "aspect-[16/9]"
  };
  
  const currentViewSrc = activeView === 'exterior' ? threeSixtyView?.exterior : threeSixtyView?.interior;
  const viewerTitle = activeView === 'exterior' 
    ? `${title} Exterior 360° View` 
    : `${title} Interior 360° View`;
  
  return (
    <div className={`w-full ${containerClasses[size] || containerClasses.large}`}>
      {/* Tabs - Only show if both views are available */}
      {hasExterior && hasInterior && (
        <div className="mb-2 flex w-full rounded-t-lg overflow-hidden border border-b-0 border-gray-200">
          <button 
            className={`flex-1 py-2 sm:py-2.5 text-xs sm:text-sm font-medium flex items-center justify-center gap-1 sm:gap-1.5 ${
              activeView === 'exterior' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setActiveView('exterior')}
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="hidden xxs:inline">Exterior</span>
            <span className="xxs:hidden">Ext</span>
          </button>
          <button 
            className={`flex-1 py-2 sm:py-2.5 text-xs sm:text-sm font-medium flex items-center justify-center gap-1 sm:gap-1.5 ${
              activeView === 'interior' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setActiveView('interior')}
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="hidden xxs:inline">Interior</span>
            <span className="xxs:hidden">Int</span>
          </button>
        </div>
      )}
      
      {/* Iframe container with consistent aspect ratio */}
      <div className={`rounded-lg ${!hasInterior || !hasExterior ? 'rounded-t-lg' : ''} overflow-hidden border border-gray-200 bg-gray-50 ${aspectRatioClasses[size] || aspectRatioClasses.large}`}>
        {currentViewSrc ? (
          <iframe 
            src={currentViewSrc} 
            title={viewerTitle}
            className="w-full h-full bg-white"
            allowFullScreen
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center p-4">
              <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              </svg>
              <p className="mt-2 text-sm text-gray-500">No {activeView} view available</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Mobile-friendly help text */}
      <div className="mt-1.5 flex items-center justify-center">
        <p className="text-[10px] sm:text-xs text-gray-500 text-center">
          {deviceType === 'mobile' 
            ? "Touch and drag to interact • Pinch to zoom" 
            : "Click and drag to interact • Use mouse wheel to zoom"
          }
        </p>
      </div>
    </div>
  );
}