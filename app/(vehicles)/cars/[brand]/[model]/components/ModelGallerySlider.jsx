'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function ModelGallerySlider({ media = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);

  const goToSlide = (index) => {
    if (index < 0) {
      setCurrentIndex(media.length - 1);
    } else if (index >= media.length) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(index);
    }
  };

  const goToPrevious = () => goToSlide(currentIndex - 1);
  const goToNext = () => goToSlide(currentIndex + 1);

  const getYoutubeEmbedUrl = (url) => {
    try {
      // Extract video ID from various YouTube URL formats
      const videoId = url.split('v=')[1]?.split('&')[0] || 
                     url.split('youtu.be/')[1]?.split('?')[0] ||
                     url.split('embed/')[1]?.split('?')[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    } catch (error) {
      console.error('Error parsing YouTube URL:', error);
      return url;
    }
  };

  if (media.length === 0) {
    return (
      <div className="aspect-[4/3] bg-gray-200 flex items-center justify-center">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  return (
    <div className="relative aspect-[4/3] w-full" ref={sliderRef}>
      {/* Main Slide */}
      <div className="relative h-full w-full overflow-hidden rounded-lg">
        {media[currentIndex].type === 'video' ? (
          <iframe
            src={getYoutubeEmbedUrl(media[currentIndex].url)}
            title={media[currentIndex].alt}
            className="absolute top-0 left-0 w-full h-full"
          />
        ) : (
          <Image
            src={media[currentIndex].url}
            alt={media[currentIndex].alt}
            fill
            className="object-cover"
            priority={currentIndex === 0}
          />
        )}
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={goToPrevious}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeftIcon className="h-5 w-5 text-gray-800" />
      </button>
      
      <button 
        onClick={goToNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors"
        aria-label="Next slide"
      >
        <ChevronRightIcon className="h-5 w-5 text-gray-800" />
      </button>

      {/* Thumbnail Navigation removed */}
    </div>
  );
}