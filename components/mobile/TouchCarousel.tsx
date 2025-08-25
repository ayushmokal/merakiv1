'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause,
  Maximize2,
  X,
  Download,
  Share2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTouchGestures } from '@/hooks/useMobileInteractions';

interface TouchCarouselProps {
  media: string[];
  title?: string;
  className?: string;
  showControls?: boolean;
  showThumbnails?: boolean;
  autoPlay?: boolean;
  interval?: number;
  onImageClick?: (index: number) => void;
  rounded?: boolean;
}

const TouchCarousel: React.FC<TouchCarouselProps> = ({
  media = [],
  title = '',
  className,
  showControls = true,
  showThumbnails = false,
  autoPlay = false,
  interval = 3000,
  onImageClick,
  rounded = true
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState<{ [key: number]: boolean }>({});
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const { onTouchStart, onTouchMove, onTouchEnd } = useTouchGestures();

  // Handle swipe gestures
  const handleTouchEnd = () => {
    const result = onTouchEnd();
    if (result) {
      if (result.isLeftSwipe && currentIndex < media.length - 1) {
        nextSlide();
      } else if (result.isRightSwipe && currentIndex > 0) {
        prevSlide();
      }
    }
  };

  // Auto play functionality
  useEffect(() => {
    if (isPlaying && media.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % media.length);
      }, interval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, media.length, interval]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % media.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleImageLoad = (index: number) => {
    setImageLoaded(prev => ({ ...prev, [index]: true }));
  };

  const isVideo = (url: string) => {
    return url.includes('/video/upload/') || 
           url.match(/\.(mp4|mov|avi|webm|ogg|m4v|3gp|flv|wmv|mkv)(\?|$|#)/i) ||
           (url.includes('video') && (url.includes('cloudinary') || url.includes('youtube') || url.includes('vimeo')));
  };

  const handleFullscreen = () => {
    setShowFullscreen(true);
  };

  const handleShare = async () => {
    if (navigator.share && media[currentIndex]) {
      try {
        await navigator.share({
          title: title || 'Property Image',
          url: media[currentIndex],
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  if (!media || media.length === 0) {
    return (
      <div className={cn(
        "relative w-full h-full bg-gray-200 flex items-center justify-center",
        rounded && "rounded-lg",
        className
      )}>
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  return (
    <>
      {/* Main Carousel */}
      <div 
        ref={carouselRef}
        className={cn(
          "relative w-full h-full overflow-hidden bg-gray-100",
          rounded && "rounded-lg",
          className
        )}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Media Container */}
        <div 
          className="flex transition-transform duration-300 ease-out h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {media.map((url, index) => (
            <div 
              key={index} 
              className="w-full h-full flex-shrink-0 relative"
              onClick={() => onImageClick?.(index)}
            >
              {isVideo(url) ? (
                <video
                  className="w-full h-full object-cover"
                  controls
                  preload="metadata"
                  poster={url.replace('/video/', '/image/').split('.')[0] + '.jpg'}
                >
                  <source src={url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <>
                  {!imageLoaded[index] && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  <Image
                    src={url}
                    alt={`${title} - Image ${index + 1}`}
                    fill
                    className={cn(
                      "object-cover transition-opacity duration-300",
                      imageLoaded[index] ? "opacity-100" : "opacity-0"
                    )}
                    onLoad={() => handleImageLoad(index)}
                    priority={index === 0}
                  />
                </>
              )}
            </div>
          ))}
        </div>

        {/* Controls Overlay */}
        {showControls && media.length > 1 && (
          <>
            {/* Navigation Buttons */}
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white border-0 h-8 w-8 z-10"
              onClick={prevSlide}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
              variant="secondary"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white border-0 h-8 w-8 z-10"
              onClick={nextSlide}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            {/* Top Controls */}
            <div className="absolute top-2 left-2 right-2 flex justify-between items-center z-10">
              <Badge variant="secondary" className="bg-black/50 text-white border-0">
                {currentIndex + 1} / {media.length}
              </Badge>
              
              <div className="flex gap-1">
                {autoPlay && (
                  <Button
                    variant="secondary"
                    size="icon"
                    className="bg-black/50 hover:bg-black/70 text-white border-0 h-8 w-8"
                    onClick={togglePlayPause}
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                )}
                
                <Button
                  variant="secondary"
                  size="icon"
                  className="bg-black/50 hover:bg-black/70 text-white border-0 h-8 w-8"
                  onClick={handleFullscreen}
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>

                {navigator.share && (
                  <Button
                    variant="secondary"
                    size="icon"
                    className="bg-black/50 hover:bg-black/70 text-white border-0 h-8 w-8"
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Dot Indicators */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
              {media.map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-200",
                    index === currentIndex 
                      ? "bg-white scale-110" 
                      : "bg-white/50 hover:bg-white/75"
                  )}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {showThumbnails && media.length > 1 && (
        <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
          {media.map((url, index) => (
            <button
              key={index}
              className={cn(
                "relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all duration-200",
                index === currentIndex 
                  ? "border-blue-600 scale-105" 
                  : "border-gray-200 hover:border-gray-300"
              )}
              onClick={() => goToSlide(index)}
            >
              {isVideo(url) ? (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <Play className="h-4 w-4 text-gray-600" />
                </div>
              ) : (
                <Image
                  src={url}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Modal */}
      {showFullscreen && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <div className="relative w-full h-full">
            <TouchCarousel
              media={media}
              title={title}
              className="w-full h-full rounded-none"
              showControls={true}
              autoPlay={false}
            />
            
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white border-0 z-10"
              onClick={() => setShowFullscreen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default TouchCarousel;