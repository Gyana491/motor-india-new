## Motor India Frontend - Component Templates

### Basic Client-Side Component
```jsx
"use client"
import React, { useState } from 'react';

const ComponentName = ({ prop1, prop2 }) => {
  const [state, setState] = useState(initialState);

  const handleEvent = () => {
    // Handle the event
    setState(newState);
  };

  return (
    <div className="classnames">
      {/* Component JSX */}
    </div>
  );
};

export default ComponentName;
```

### Server Component
```jsx
import SomeClientComponent from './SomeClientComponent';

export default async function ServerComponent({ params }) {
  // Data fetching
  const data = await fetchData(params.id);
  
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{data.title}</h1>
      <SomeClientComponent data={data} />
    </main>
  );
}
```

### Interactive Media Component
```jsx
"use client"
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function MediaComponent({ media, title }) {
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Handle media type (image, video, 360 view)
  const renderMedia = () => {
    const currentMedia = media[activeIndex];
    
    if (currentMedia.type === 'video') {
      return (
        <iframe
          src={getYoutubeEmbedUrl(currentMedia.url)}
          title={currentMedia.alt || title}
          className="w-full h-full"
          allowFullScreen
        />
      );
    } else if (currentMedia.type === '360') {
      return (
        <iframe
          src={currentMedia.url}
          className="w-full h-full"
          title={`${title} 360° View`}
          allowFullScreen
        />
      );
    } else {
      return (
        <Image
          src={currentMedia.url}
          alt={currentMedia.alt || title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={activeIndex === 0}
        />
      );
    }
  };
  
  return (
    <div className="w-full">
      <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
        {renderMedia()}
      </div>
      {/* Thumbnails or controls */}
      <div className="flex gap-2 mt-4">
        {media.map((item, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`w-16 h-16 rounded-md overflow-hidden border-2 ${
              index === activeIndex ? 'border-red-600' : 'border-transparent'
            }`}
          >
            {/* Thumbnail content */}
          </button>
        ))}
      </div>
    </div>
  );
}
```

### Page Component with Layout
```jsx
import ComponentA from './components/ComponentA';
import ComponentB from './components/ComponentB';

export default async function PageName({ params }) {
  // Data fetching if needed
  const data = await fetchData();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <ComponentA data={data} />
        </div>
        
        {/* Main Content */}
        <div className="lg:col-span-3">
          <ComponentB data={data} />
        </div>
      </div>
    </div>
  );
}
```

### Search Component
```jsx
"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const SearchComponent = ({ placeholder = "Search cars..." }) => {
  const [query, setQuery] = useState('');
  const router = useRouter();
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };
  
  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <button
          type="submit"
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          aria-label="Search"
        >
          <span className="px-4 py-1 bg-red-600 text-white rounded-full text-sm font-medium">
            Search
          </span>
        </button>
      </div>
    </form>
  );
};

export default SearchComponent;