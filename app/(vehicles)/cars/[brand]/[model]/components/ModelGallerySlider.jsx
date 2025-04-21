'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
// Import Swiper components and required modules
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Keyboard, A11y, EffectFade } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
// Import our custom styles
import styles from './ModelGallerySlider.module.css';

export default function ModelGallerySlider({ media = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const swiperRef = useRef(null);
  const lightboxSwiperRef = useRef(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  
  // Navigation refs
  const prevElRef = useRef(null);
  const nextElRef = useRef(null);
  const lightboxPrevElRef = useRef(null);
  const lightboxNextElRef = useRef(null);

  // Preload images for smooth experience
  useEffect(() => {
    if (typeof window === 'undefined' || !media || media.length === 0) return;
    
    const imageUrls = media
      .filter(item => item.type === 'image')
      .map(item => item.url);
    
    if (imageUrls.length > 0) {
      const preloadImages = imageUrls.map(url => {
        return new Promise((resolve) => {
          // Use window.Image instead of just Image to avoid conflict with next/image
          const img = new window.Image();
          img.src = url;
          img.onload = () => resolve();
          img.onerror = () => resolve(); // Still resolve on error to avoid hanging
        });
      });
      
      Promise.all(preloadImages).then(() => {
        setImagesLoaded(true);
      });
    } else {
      setImagesLoaded(true);
    }
  }, [media]);

  const handleSlideChange = (swiper) => {
    setCurrentIndex(swiper.activeIndex);
  };

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
    
    // Prevent body scroll when lightbox is open - safer approach
    if (typeof window !== 'undefined') {
      // Save current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    }
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    
    // Restore body scroll when lightbox is closed - safer approach
    if (typeof window !== 'undefined') {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
    }
  };

  const goToPrevSlide = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  const goToNextSlide = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

  const goToPrevLightboxSlide = () => {
    if (lightboxSwiperRef.current && lightboxSwiperRef.current.swiper) {
      lightboxSwiperRef.current.swiper.slidePrev();
    }
  };

  const goToNextLightboxSlide = () => {
    if (lightboxSwiperRef.current && lightboxSwiperRef.current.swiper) {
      lightboxSwiperRef.current.swiper.slideNext();
    }
  };

  useEffect(() => {
    // Cleanup function to ensure body scroll is restored on unmount
    return () => {
      if (typeof window !== 'undefined') {
        const scrollY = document.body.style.top;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        if (scrollY) {
          window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
        }
      }
    };
  }, []);

  const handleKeydown = (e) => {
    if (isLightboxOpen) {
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        goToPrevLightboxSlide();
      } else if (e.key === 'ArrowRight') {
        goToNextLightboxSlide();
      }
    } else {
      if (e.key === 'ArrowLeft') {
        goToPrevSlide();
      } else if (e.key === 'ArrowRight') {
        goToNextSlide();
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeydown);
    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [isLightboxOpen]);

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
    <>
      <div className={`${styles.sliderWrapper} relative aspect-[4/3] w-full rounded-lg overflow-hidden`}>
        <Swiper
          ref={swiperRef}
          modules={[Navigation, Pagination, Keyboard, A11y, EffectFade]}
          spaceBetween={0}
          slidesPerView={1}
          navigation={false}
          pagination={{ 
            clickable: true,
            dynamicBullets: true
          }}
          keyboard={{ enabled: true }}
          loop={true}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          speed={500}
          onSlideChange={handleSlideChange}
          className="h-full w-full"
          preloadImages={false}
          lazy={{
            loadPrevNext: true,
            loadPrevNextAmount: 2,
          }}
          watchSlidesProgress={true}
        >
          {media.map((item, index) => (
            <SwiperSlide key={index} className="h-full w-full">
              {item.type === 'video' ? (
                <div className="h-full w-full">
                  <iframe
                    src={getYoutubeEmbedUrl(item.url)}
                    title={item.alt}
                    className="absolute top-0 left-0 w-full h-full"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div 
                  className={`${styles.imageWrapper} relative h-full w-full cursor-pointer`}
                  onClick={() => openLightbox(index)}
                >
                  <Image
                    src={item.url}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className={`${styles.sliderImage} object-cover`}
                    priority={index === 0}
                    loading={index === 0 ? "eager" : "lazy"}
                    quality={80}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent opacity-70"></div>
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Enhanced Custom Navigation Arrows */}
        <button
          ref={prevElRef}
          onClick={goToPrevSlide}
          className={`${styles.sliderNavButton} absolute left-4 top-1/2 z-30 bg-white/90 p-3 rounded-full shadow-xl hover:bg-white active:scale-95 transition-all cursor-pointer flex items-center justify-center border border-gray-200`}
          aria-label="Previous slide"
          tabIndex="0"
        >
          <ChevronLeftIcon className="h-7 w-7 text-gray-800" />
        </button>
        
        <button
          ref={nextElRef}
          onClick={goToNextSlide}
          className={`${styles.sliderNavButton} absolute right-4 top-1/2 z-30 bg-white/90 p-3 rounded-full shadow-xl hover:bg-white active:scale-95 transition-all cursor-pointer flex items-center justify-center border border-gray-200`}
          aria-label="Next slide"
          tabIndex="0"
        >
          <ChevronRightIcon className="h-7 w-7 text-gray-800" />
        </button>
      </div>

      {/* Lightbox Implementation */}
      {isLightboxOpen && (
        <div 
          className={`${styles.lightbox} fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center`}
          onClick={closeLightbox}
        >
          <div className={`${styles.lightboxContent} ${styles.sliderWrapper} relative w-full h-full max-w-4xl max-h-[90vh] mx-auto`} onClick={(e) => e.stopPropagation()}>
            <Swiper
              ref={lightboxSwiperRef}
              modules={[Navigation, Keyboard, A11y]}
              initialSlide={lightboxIndex}
              spaceBetween={0}
              slidesPerView={1}
              navigation={false}
              keyboard={{ enabled: true }}
              loop={true}
              speed={300}
              className="h-full w-full"
              lazy={{
                loadPrevNext: true,
                loadPrevNextAmount: 1
              }}
            >
              {media.filter(item => item.type === 'image').map((item, index) => (
                <SwiperSlide key={index} className="h-full w-full flex items-center justify-center">
                  <div className="relative h-full w-full">
                    <Image
                      src={item.url}
                      alt={item.alt}
                      fill
                      sizes="100vw"
                      className="object-contain"
                      quality={90}
                      loading="lazy"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            
            <button 
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors z-10"
              aria-label="Close lightbox"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <button 
              ref={lightboxPrevElRef} 
              onClick={goToPrevLightboxSlide} 
              className={`${styles.sliderNavButton} absolute left-4 top-1/2 z-10 bg-black/50 p-3 rounded-full text-white hover:bg-black/70 active:scale-95 transition-all cursor-pointer`}
              aria-label="Previous image"
              tabIndex="0"
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </button>
            
            <button 
              ref={lightboxNextElRef} 
              onClick={goToNextLightboxSlide} 
              className={`${styles.sliderNavButton} absolute right-4 top-1/2 z-10 bg-black/50 p-3 rounded-full text-white hover:bg-black/70 active:scale-95 transition-all cursor-pointer`}
              aria-label="Next image"
              tabIndex="0"
            >
              <ChevronRightIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}

      {/* Hidden preload container for critical images */}
      <div className={styles.preloadContainer} aria-hidden="true">
        {media.slice(0, 3).map((item, index) => {
          if (item.type === 'image') {
            return <img key={index} src={item.url} alt="" />;
          }
          return null;
        })}
      </div>
    </>
  );
}