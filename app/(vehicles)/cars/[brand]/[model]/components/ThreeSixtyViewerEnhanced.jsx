'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// Fullscreen Modal Component with touch-friendly controls
const FullscreenModal = ({ isOpen, onClose, children, title }) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center touch-none">
      <div className="w-full h-full max-w-7xl max-h-screen p-2 sm:p-4 flex flex-col">
        <div className="flex justify-between items-center mb-2 sm:mb-4">
          <h3 className="text-white text-base sm:text-xl font-medium ml-1 sm:ml-0">{title}</h3>
          <button 
            onClick={onClose}
            className="text-white hover:text-red-500 transition-colors p-2 rounded-full"
            aria-label="Close fullscreen view"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-grow overflow-hidden rounded-lg bg-gray-900">
          {children}
        </div>
        {/* Mobile-friendly bottom navigation bar */}
        <div className="mt-2 sm:mt-4 flex justify-center sm:justify-end">
          <button
            onClick={onClose}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-full flex items-center gap-2 transition-colors text-sm sm:text-base"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>Exit Fullscreen</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Enhanced ThreeSixtyViewer component with fullscreen capability
export default function ThreeSixtyViewerEnhanced({ threeSixtyView, title, brand, model, isFullPage = false }) {
  const [activeView, setActiveView] = useState('exterior');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [deviceType, setDeviceType] = useState('desktop');
  const iframeRef = useRef(null);
  
  const hasExterior = !!threeSixtyView?.exterior;
  const hasInterior = !!threeSixtyView?.interior;
  
  // Set initial active view based on available content
  useEffect(() => {
    if (!hasExterior && hasInterior) {
      setActiveView('interior');
    } else if (hasExterior) {
      setActiveView('exterior');
    }
    
    // Detect device type for optimized controls
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
    
    // Handle orientation changes
    const handleOrientation = () => {
      if (isFullscreen) {
        // Reframe the iframe content on orientation change
        if (iframeRef.current) {
          const iframe = iframeRef.current;
          const src = iframe.src;
          iframe.src = '';
          setTimeout(() => {
            iframe.src = src;
          }, 50);
        }
      }
    };
    
    window.addEventListener('orientationchange', handleOrientation);
    return () => {
      window.removeEventListener('orientationchange', handleOrientation);
    };
  }, [hasExterior, hasInterior, isFullscreen]);
  
  const currentViewSrc = activeView === 'exterior' ? threeSixtyView?.exterior : threeSixtyView?.interior;
  const viewerTitle = activeView === 'exterior' 
    ? `${title} Exterior 360° View` 
    : `${title} Interior 360° View`;
    
  // Define quick navigation links for "Explore More" section
  const exploreLinks = [
    { name: "Specifications", path: `/cars/${brand}/${model}/specifications`, icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
    { name: "Colors", path: `/cars/${brand}/${model}/colors`, icon: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" },
  ];

  // Handle iframe load events
  const handleIframeLoad = () => {
    setIframeLoaded(true);
  };
  
  return (
    <div className="w-full">
      {/* Navigation Tabs - Show whenever either exterior or interior is available */}
      {(hasExterior || hasInterior) && (
        <div className="mb-3 sm:mb-4">
          {/* Visual indicator only if both views are available */}
          {hasExterior && hasInterior && (
            <p className="text-xs sm:text-sm text-gray-500 mb-1.5 sm:mb-2 flex items-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
              </svg>
              <span className="hidden xs:inline">Switch between exterior and interior views</span>
              <span className="xs:hidden">Switch views</span>
            </p>
          )}
          
          <div className="flex rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-white">
            {hasExterior && (
              <button 
                className={`flex-1 py-2.5 sm:py-3.5 px-2 sm:px-4 font-medium transition-all flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base ${
                  activeView === 'exterior' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setActiveView('exterior')}
                aria-selected={activeView === 'exterior'}
                role="tab"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="hidden xs:inline">Exterior</span>
                <span className="xs:hidden">Exterior</span>
                {activeView === 'exterior' && (
                  <span className="ml-1 bg-white bg-opacity-20 text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full hidden sm:inline-block">Active</span>
                )}
              </button>
            )}
            {hasInterior && (
              <button 
                className={`flex-1 py-2.5 sm:py-3.5 px-2 sm:px-4 font-medium transition-all flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base ${
                  activeView === 'interior' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setActiveView('interior')}
                aria-selected={activeView === 'interior'}
                role="tab"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="hidden xs:inline">Interior</span>
                <span className="xs:hidden">Interior</span>
                {activeView === 'interior' && (
                  <span className="ml-1 bg-white bg-opacity-20 text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full hidden sm:inline-block">Active</span>
                )}
              </button>
            )}
          </div>
        </div>
      )}
      
      <div className="flex flex-col lg:flex-row gap-3 sm:gap-5">
        {/* Main Viewer Panel */}
        <div className="lg:w-full" role="tabpanel" aria-label={activeView === 'exterior' ? "Exterior View" : "Interior View"}>
          <div className="relative rounded-lg overflow-hidden border border-gray-200">
            {/* Aspect ratio container for consistent sizing */}
            <div className="aspect-[16/10] sm:aspect-[16/9]">
              {currentViewSrc ? (
                <>
                  {/* Loading indicator overlay */}
                  {!iframeLoaded && (
                    <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 border-3 border-gray-300 border-t-red-600 rounded-full animate-spin"></div>
                      <p className="mt-2 text-sm sm:text-base text-gray-600">Loading {activeView} view...</p>
                    </div>
                  )}
                  <iframe
                    ref={iframeRef}
                    src={currentViewSrc}
                    className="w-full h-full"
                    title={viewerTitle}
                    allowFullScreen
                    onLoad={handleIframeLoad}
                  />
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <p className="text-sm sm:text-base text-gray-500">No {activeView} view available</p>
                </div>
              )}
            </div>
            
            {/* Fullscreen button - larger touch target on mobile */}
            {currentViewSrc && (
              <button 
                onClick={() => setIsFullscreen(true)}
                className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-black bg-opacity-70 text-white p-2 sm:p-3 rounded-full hover:bg-opacity-90 transition-opacity shadow-lg"
                aria-label="Open fullscreen"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                </svg>
              </button>
            )}
          </div>
          
          {/* Touch-friendly interaction instructions */}
          <div className="mt-3 sm:mt-4 p-2.5 sm:p-3 bg-gray-50 rounded-lg border border-gray-200 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2.5 sm:gap-3">
            <div className="flex items-start gap-2">
              <div className="text-red-600 mt-0.5">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-700 text-xs sm:text-sm">How to interact:</p>
                {activeView === 'exterior' ? (
                  <p className="text-xs text-gray-600">
                    {deviceType === 'mobile' ? "Touch and drag to rotate. Pinch to zoom." : "Click and drag to rotate. Use mouse wheel to zoom."}
                  </p>
                ) : (
                  <p className="text-xs text-gray-600">
                    {deviceType === 'mobile' ? "Touch and drag to look around. Pinch to zoom." : "Click and drag to look around. Use mouse wheel to zoom."}
                  </p>
                )}
              </div>
            </div>
            <button 
              onClick={() => setIsFullscreen(true)}
              className="text-white bg-red-600 hover:bg-red-700 py-1.5 sm:py-2 px-3 sm:px-4 rounded flex items-center gap-1.5 sm:gap-2 transition-colors shadow-sm self-start sm:self-center text-xs sm:text-sm font-medium"
            >
              <span>Fullscreen</span>
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* "Explore More" sidebar - Only shown for non-fullPage mode */}
        {!isFullPage && (
          <div className="lg:w-1/4 mt-3 lg:mt-0">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gray-50 p-2.5 sm:p-3 border-b">
                <h3 className="font-medium text-sm sm:text-base text-gray-700">Explore More</h3>
              </div>
              <div className="p-2.5 sm:p-3 space-y-1.5 sm:space-y-2">
                {exploreLinks.map((link, idx) => (
                  <Link
                    key={idx}
                    href={link.path}
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-50 transition-colors group"
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-red-50 rounded-full flex items-center justify-center text-red-600 group-hover:bg-red-100">
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={link.icon} />
                      </svg>
                    </div>
                    <span className="text-xs sm:text-sm font-medium">{link.name}</span>
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-auto text-gray-400 group-hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
                <Link
                  href={`/cars/${brand}/${model}`}
                  className="w-full text-center block py-2 sm:py-2.5 px-3 mt-2 sm:mt-3 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs sm:text-sm rounded transition-colors"
                >
                  View All Details
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Fullscreen Modal with mobile optimizations */}
      <FullscreenModal
        isOpen={isFullscreen}
        onClose={() => setIsFullscreen(false)}
        title={viewerTitle}
      >
        {currentViewSrc ? (
          <iframe
            src={currentViewSrc}
            className="w-full h-full"
            title={`${viewerTitle} (Fullscreen)`}
            allowFullScreen
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-800">
            <p className="text-white text-sm sm:text-base">No {activeView} view available</p>
          </div>
        )}
      </FullscreenModal>
    </div>
  );
}