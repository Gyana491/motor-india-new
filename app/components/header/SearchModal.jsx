'use client'
import React from 'react';
import { BiX } from 'react-icons/bi';
import SearchBar from './SearchBar';

const SearchModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop with blur effect */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
      />
      
      {/* Draggable area - covers full screen */}
      <div 
        className="absolute inset-0 z-10" 
        onClick={onClose}
      />
      
      {/* Modal Content with slide-up animation */}
      <div className="relative h-full mt-auto bg-white animate-slideUp rounded-t-xl z-20">
        {/* Drag Handle */}
        <div className="w-full flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 rounded-full bg-gray-300"></div>
        </div>

        <div className="flex flex-col h-[calc(100%-24px)]">
          {/* Header */}
          <div className="safe-top px-4 pt-4 pb-3 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Search</h2>
              <button
                onClick={onClose}
                className="p-2 -mr-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100/80 active:bg-gray-200 transition-all"
                aria-label="Close search dialog"
              >
                <BiX className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Search Area */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            <SearchBar 
              className="rounded-xl shadow-sm border-gray-200 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500/20 transition-all duration-200"
              autoFocus={true}
              onClose={onClose}
            />
            
            {/* Optional: Add recent searches or suggested searches here */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Recent Searches</h3>
              <div className="space-y-2">
                {/* Placeholder for recent searches */}
                <div className="p-3 rounded-lg bg-gray-50 text-sm text-gray-600">
                  No recent searches
                </div>
              </div>
            </div>
          </div>

          {/* Safe area for bottom notch */}
          <div className="safe-bottom" />
        </div>
      </div>

      <style jsx global>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.25s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .safe-top {
          padding-top: env(safe-area-inset-top);
        }
        .safe-bottom {
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>
    </div>
  );
};

export default SearchModal;