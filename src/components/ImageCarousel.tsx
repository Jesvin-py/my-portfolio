import React, { useState, useEffect, useRef } from 'react';

interface ImageCarouselProps {
  images: string[];
  interval?: number; // Time in milliseconds for auto-slide
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, interval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = window.setTimeout(() => {
      if (!isTransitioning) {
        goToNext();
      }
    }, interval);

    return () => {
      resetTimeout();
    };
  }, [currentIndex, images.length, interval, isTransitioning]);

  const goToNext = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    resetTimeout();
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
    
    // Reset transition state after animation completes
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToPrevious = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    resetTimeout();
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
    
    // Reset transition state after animation completes
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentIndex) return;
    
    setIsTransitioning(true);
    resetTimeout();
    setCurrentIndex(index);
    
    // Reset transition state after animation completes
    setTimeout(() => setIsTransitioning(false), 500);
  };

  if (images.length === 0) {
    return (
      <div className="w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm">No images available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-48 overflow-hidden rounded-lg shadow-md group bg-gray-900">
      {/* Image display */}
      <div
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div key={index} className="w-full flex-shrink-0 relative">
            <img
              src={image}
              alt={`AidLink App Screenshot ${index + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {/* Image overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            disabled={isTransitioning}
            className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 hover:bg-black/80 disabled:opacity-50 disabled:cursor-not-allowed carousel-nav-button"
            aria-label="Previous slide"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            disabled={isTransitioning}
            className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 hover:bg-black/80 disabled:opacity-50 disabled:cursor-not-allowed carousel-nav-button"
            aria-label="Next slide"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Navigation Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
              className={`w-3 h-3 rounded-full transition-all duration-300 carousel-dot ${
                currentIndex === index 
                  ? 'bg-white scale-125 shadow-lg' 
                  : 'bg-gray-400 hover:bg-gray-300 hover:scale-110'
              } opacity-0 group-hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>
      )}

      {/* Slide Counter */}
      {images.length > 1 && (
        <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Progress Bar */}
      {images.length > 1 && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-black/20">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ease-linear"
            style={{ width: `${((currentIndex + 1) / images.length) * 100}%` }}
          ></div>
        </div>
      )}

      {/* Pause/Play Indicator */}
      {images.length > 1 && (
        <div className="absolute top-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;

