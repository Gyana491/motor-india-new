"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function ColorCarousel({ colors, brand, model }) {
  const [activeColorIndex, setActiveColorIndex] = useState(0);
  const [activeColor, setActiveColor] = useState(colors[0]);
  const [swiper, setSwiper] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  // Handle color change
  const handleColorChange = (index) => {
    setActiveColorIndex(index);
    setActiveColor(colors[index]);

    // If swiper is initialized, slide to the selected index
    if (swiper) {
      swiper.slideTo(index);
    }
  };

  // Navigation handlers for main image
  const goToPrevious = () => {
    const newIndex =
      activeColorIndex === 0 ? colors.length - 1 : activeColorIndex - 1;
    handleColorChange(newIndex);
  };

  const goToNext = () => {
    const newIndex =
      activeColorIndex === colors.length - 1 ? 0 : activeColorIndex + 1;
    handleColorChange(newIndex);
  };

  // Truncate long color names
  const truncateColorName = (name) => {
    if (name.length > 12) {
      return `${name.substring(0, 12)}...`;
    }
    return name;
  };

  // Update active color whenever the index changes
  useEffect(() => {
    setActiveColor(colors[activeColorIndex]);
  }, [activeColorIndex, colors]);

  return (
    <div className="w-full">
      {/* Main Car Image Display with Navigation */}
      <div className="bg-white rounded-lg overflow-hidden mb-8 relative shadow-sm hover:shadow-md transition-shadow">
        <div className="relative aspect-[16/9] md:aspect-[21/9]">
          <Image
            src={activeColor.url}
            alt={`${brand} ${model} in ${activeColor.name}`}
            fill
            className="object-contain"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
          />

          {/* Main Image Navigation Arrows */}
          <div className="absolute inset-0 flex items-center justify-between px-4 md:px-6">
            <button
              onClick={goToPrevious}
              className="bg-white/70 backdrop-blur-sm hover:bg-white/90 hover:scale-110 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-md transition-all duration-300 border border-gray-100 hover:border-gray-200"
              aria-label="Previous color"
            >
              <svg
                className="w-5 h-5 md:w-6 md:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className="bg-white/70 backdrop-blur-sm hover:bg-white/90 hover:scale-110 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-md transition-all duration-300 border border-gray-100 hover:border-gray-200"
              aria-label="Next color"
            >
              <svg
                className="w-5 h-5 md:w-6 md:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="p-4 md:p-5">
          <h2 className="text-xl md:text-2xl font-semibold flex items-center">
            <span className="mr-3">{activeColor.name}</span>
            <span
              className="flex-shrink-0 w-5 h-5 rounded-full border border-gray-300"
              style={{ backgroundColor: activeColor.hexcode }}
            ></span>
          </h2>
        </div>
      </div>

      {/* Color Selection Swiper */}
      <div className="mb-8 relative px-4 md:px-10 lg:px-16">
        {/* Custom Swiper Navigation Buttons - Positioned outside the Swiper for better alignment */}
        <button
          className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-10 md:h-10 bg-white rounded-full shadow-md flex items-center justify-center border border-gray-200 transition-all hover:shadow-lg"
          aria-label="Previous colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-10 md:h-10 bg-white rounded-full shadow-md flex items-center justify-center border border-gray-200 transition-all hover:shadow-lg"
          aria-label="Next colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Color Thumbnail Carousel */}
        <Swiper
          modules={[Navigation, Pagination, A11y]}
          spaceBetween={isMobile ? 8 : 16}
          slidesPerView="auto"
          navigation={{
            nextEl: ".swiper-button-next-custom",
            prevEl: ".swiper-button-prev-custom",
          }}
          pagination={{ clickable: true, dynamicBullets: true }}
          onSwiper={setSwiper}
          onSlideChange={(swiper) => setActiveColorIndex(swiper.activeIndex)}
          className="color-swiper"
          breakpoints={{
            320: { slidesPerView: 3.5, spaceBetween: 8 },
            480: { slidesPerView: 4.5, spaceBetween: 12 },
            640: { slidesPerView: 5.5, spaceBetween: 14 },
            768: { slidesPerView: 6.5, spaceBetween: 16 },
            1024: { slidesPerView: 8.5, spaceBetween: 16 },
            1280: { slidesPerView: 10.5, spaceBetween: 16 },
          }}
          style={{
            "--swiper-navigation-color": "#ef4444",
            "--swiper-pagination-color": "#ef4444",
          }}
        >
          {colors.map((color, index) => (
            <SwiperSlide
              key={index}
              className="!w-auto"
              onClick={() => handleColorChange(index)}
            >
              <div className="flex flex-col items-center text-center">
                <div
                  className={`relative rounded-full cursor-pointer transition-all duration-300
                    ${
                      index === activeColorIndex
                        ? "ring-2 ring-red-600 ring-offset-2 scale-105"
                        : "hover:ring-1 hover:ring-gray-300 hover:scale-105"
                    }`}
                  style={{
                    width: isMobile ? "52px" : "64px",
                    height: isMobile ? "52px" : "64px",
                  }}
                >
                  {/* The small car image as circle */}
                  <div className="rounded-full overflow-hidden w-full h-full shadow-sm">
                    <Image
                      src={color.url}
                      alt={color.name}
                      width={isMobile ? 52 : 64}
                      height={isMobile ? 52 : 64}
                      className="object-cover w-full h-full transition-transform hover:scale-110"
                    />
                  </div>
                </div>
                <span
                  className={`text-xs font-medium mt-2 max-w-[80px] line-clamp-1 ${
                    index === activeColorIndex
                      ? "text-red-600"
                      : "text-gray-700"
                  }`}
                  title={color.name}
                >
                  {truncateColorName(color.name)}
                </span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Color List Grid for Better Accessibility - Mobile Friendly */}
      <div className="bg-gray-50 rounded-lg p-4 md:p-6 mb-8">
        <h3 className="text-base md:text-lg font-medium mb-3">
          All Available Colors:
        </h3>
        <div className="flex flex-wrap gap-2">
          {colors.map((color, index) => (
            <button
              key={index}
              onClick={() => handleColorChange(index)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200
                ${
                  index === activeColorIndex
                    ? "bg-white shadow-md border border-red-200"
                    : "bg-white/80 border border-gray-200 hover:bg-white hover:shadow-sm"
                }`}
              title={color.name}
            >
              <div
                className="w-4 h-4 rounded-full border border-gray-300"
                style={{ backgroundColor: color.hexcode }}
              />
              <span className="text-sm font-medium">{color.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* CSS for Swiper customization */}
      <style jsx global>{`
        .color-swiper {
          padding: 10px 0 40px;
        }
        .swiper-button-next,
        .swiper-button-prev {
          display: none;
        }
        .color-swiper .swiper-pagination {
          bottom: 0;
        }

        /* Custom Swiper Arrow Hover Effect */
        .swiper-button-next-custom:hover,
        .swiper-button-prev-custom:hover {
          background-color: #f9fafb;
          color: #ef4444;
          border-color: #ef4444;
          transform: scale(1.1);
        }

        /* Improve pagination dots */
        .swiper-pagination-bullet {
          transition: all 0.3s ease;
        }
        .swiper-pagination-bullet-active {
          transform: scale(1.2);
        }

        /* Better focus styles for accessibility */
        button:focus-visible {
          outline: 2px solid #ef4444;
          outline-offset: 2px;
        }

        /* Mobile optimizations */
        @media (max-width: 767px) {
          .color-swiper {
            padding: 5px 0 30px;
          }
        }

        /* Smooth transitions */
        .swiper-slide-active {
          transition: transform 0.3s ease;
        }
      `}</style>
    </div>
  );
}
