"use client";
import { useState } from 'react';
import { BiSearch } from 'react-icons/bi';
import { IoMdClose } from 'react-icons/io';

const SearchBar = ({ className, autoFocus, onSearch }) => {
  const [searchValue, setSearchValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = () => {
    if (onSearch && searchValue.trim()) {
      onSearch(searchValue);
    }
  };

  const clearSearch = () => {
    setSearchValue('');
  };

  return (
    <div className={`relative transition-all duration-300 ${className}`}>
      <div className={`flex items-center bg-white overflow-hidden rounded-lg 
        border ${isFocused ? 'border-[#FF3B30] shadow-lg' : 'border-gray-200'} 
        transition-all duration-200 hover:shadow-md`}>
        <span className="pl-4 text-gray-400">
          <BiSearch className={`text-xl transition-colors ${isFocused ? 'text-[#FF3B30]' : 'text-gray-400'}`} />
        </span>
        
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search..."
          autoFocus={autoFocus}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full px-3 py-3 bg-transparent focus:outline-none text-gray-700"
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearch();
          }}
        />
        
        {searchValue && (
          <button 
            onClick={clearSearch}
            className="pr-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <IoMdClose className="text-lg" />
          </button>
        )}
        
        <button 
          onClick={handleSearch}
          className={`px-5 py-3 transition-colors duration-200 bg-gradient-to-r 
            from-[#FF3B30] to-[#FF5C40] text-white font-medium hover:opacity-90`}
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchBar;