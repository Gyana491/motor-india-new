'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function MobileNav({ brand, model }) {
  const pathname = usePathname();
  
  // Define navigation items
  const navItems = [
    { name: 'Overview', path: `/cars/${brand}/${model}`, icon: 'home' },
    { name: 'Variants', path: `/cars/${brand}/${model}/variants`, icon: 'variants' },
    { name: 'Colors', path: `/cars/${brand}/${model}/colors`, icon: 'colors' },
    { name: 'Specifications', path: `/cars/${brand}/${model}/specifications`, icon: 'specs' },
    { name: 'Features', path: `/cars/${brand}/${model}/features`, icon: 'features' },
    { name: 'Images', path: `/cars/${brand}/${model}/images`, icon: 'images' },
    { name: '360° View', path: `/cars/${brand}/${model}/360-view`, icon: '360' },
  ];
  
  // Function to render the appropriate icon
  const renderIcon = (iconName) => {
    switch (iconName) {
      case 'home':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      case 'variants':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'colors':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
        );
      case 'specs':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'features':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        );
      case 'images':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case '360':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="lg:hidden mb-6">
      <div className="overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex whitespace-nowrap gap-2 min-w-full">
          {navItems.map((item) => {
            const isActive = pathname === item.path || 
              (item.path === `/cars/${brand}/${model}` && pathname === `/cars/${brand}/${model}`);
            
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-colors ${
                  isActive 
                    ? 'bg-red-600 text-white border-red-600' 
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <span className={isActive ? 'text-white' : 'text-gray-500'}>
                  {renderIcon(item.icon)}
                </span>
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
      
      {/* Back to brand link */}
      <div className="mt-2 mb-4">
        <Link
          href={`/cars/${brand}`}
          className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-red-600"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span>All {brand} Models</span>
        </Link>
      </div>
    </div>
  );
} 