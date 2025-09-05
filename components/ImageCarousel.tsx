'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Building2 } from 'lucide-react';

interface ImageCarouselProps {
  images: string[];
  title: string;
  className?: string;
}

export default function ImageCarousel({ images, title, className = "" }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const validImages = images?.filter(img => img && img.trim() !== '') || [];

  // Handle touch events for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && validImages.length > 1) {
      nextImage();
    }
    if (isRightSwipe && validImages.length > 1) {
      prevImage();
    }
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % validImages.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = (index: number) => {
    setFailedImages(prev => new Set([...Array.from(prev), index]));
    setIsLoading(false);
  };

  // Process image URL for better compatibility
  const processImageUrl = (url: string): string => {
    if (!url) return '';
    
    // Cloudinary URLs - optimize for property cards
    if (url.includes('res.cloudinary.com')) {
      // Add optimization parameters: resize to 520x350, fill crop, auto quality and format
      const parts = url.split('/upload/');
      if (parts.length === 2) {
        return `${parts[0]}/upload/w_520,h_350,c_fill,q_auto,f_auto,g_center/${parts[1]}`;
      }
      return url;
    }
    
    // Generic Cloudinary URLs
    if (url.includes('cloudinary.com')) {
      return url;
    }
    
    // Other URLs - use as is
    return url;
  };

  const currentImage = validImages[currentIndex];
  const processedImageUrl = processImageUrl(currentImage);
  const hasFailedToLoad = failedImages.has(currentIndex);

  if (!validImages.length || hasFailedToLoad) {
    return (
      <div className={`relative w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center border border-blue-200 ${className}`}>
        <Building2 className="h-12 w-12 text-blue-400 mb-2" />
        <span className="text-xs text-blue-600 font-medium">Property Image</span>
        <span className="text-xs text-blue-500">Coming Soon</span>
      </div>
    );
  }

  return (
    <div 
      className={`relative w-full h-full overflow-hidden bg-gray-100 ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Main Image */}
      <div className="relative w-full h-full">
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center z-10">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        <Image
          src={processedImageUrl}
          alt={`${title} - Image ${currentIndex + 1}`}
          fill
          className="object-contain"
          onLoad={handleImageLoad}
          onError={() => handleImageError(currentIndex)}
          style={{ display: isLoading ? 'none' : 'block' }}
        />
        
        {/* Navigation Arrows - only show if multiple images */}
        {validImages.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white shadow-md w-8 h-8 z-20"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white shadow-md w-8 h-8 z-20"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}
        
        {/* Image Counter */}
        {validImages.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded-md text-xs z-20">
            {currentIndex + 1} / {validImages.length}
          </div>
        )}
        
        {/* Dot Indicators */}
        {validImages.length > 1 && validImages.length <= 5 && (
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 scale-[.6] sm:scale-100 transform flex space-x-[2px] origin-center">
            {validImages.map((_, index) => (
              <button
                key={index}
                className={`p-0 m-0 border-0 appearance-none leading-none w-px h-px sm:w-0.5 sm:h-0.5 rounded-full shrink-0 transition-colors focus:outline-none focus:ring-0 ${
                  index === currentIndex ? 'bg-white' : 'bg-white/50'
                }`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 
