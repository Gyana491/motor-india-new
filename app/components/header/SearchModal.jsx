'use client'
import React from 'react';
import { BiX } from 'react-icons/bi';
import SearchBar from './SearchBar';

const SearchModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white md:hidden">
        <div className="px-4 pt-3">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="text-lg font-semibold">Search</h2>
            <button
              onClick={onClose}
              className="text-gray-700 hover:text-red-600 transition-colors p-1"
              aria-label="Close search"
            >
              <BiX className="h-6 w-6" />
            </button>
          </div>
          <div className="py-4">
            <SearchBar 
              className="rounded-[4px]"
              autoFocus={true}
              onClose={onClose}
            />
          </div>
        </div>
      </div>
  );
};

export default SearchModal;