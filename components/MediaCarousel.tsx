'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Building2, Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface MediaItem {
  url: string;
  type: 'image' | 'video';
}

interface MediaCarouselProps {
  media: string[];
  title: string;
  className?: string;
}

export default function MediaCarousel({ media, title, className = "" }: MediaCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [failedMedia, setFailedMedia] = useState<Set<number>>(new Set());
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const validMedia = media?.filter(item => item && item.trim() !== '') || [];

  // Reset playing state when currentIndex changes
  useEffect(() => {
    setIsPlaying(false);
  }, [currentIndex]);

  // Determine if URL is video or image
  const determineMediaType = (url: string): 'image' | 'video' => {
    // Check for Cloudinary video URLs
    if (url.includes('/video/upload/')) {
      return 'video';
    }
    
    // Check for common video file extensions
    if (url.match(/\.(mp4|mov|avi|webm|ogg|m4v|3gp|flv|wmv|mkv)(\?|$|#)/i)) {
      return 'video';
    }
    
    // Check for video streaming patterns
    if (url.includes('video') && (url.includes('cloudinary') || url.includes('youtube') || url.includes('vimeo'))) {
      return 'video';
    }
    
    return 'image';
  };

  const mediaItems: MediaItem[] = validMedia.map(url => ({
    url,
    type: determineMediaType(url)
  }));

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

    if (isLeftSwipe && mediaItems.length > 1) {
      nextMedia();
    }
    if (isRightSwipe && mediaItems.length > 1) {
      prevMedia();
    }
  };

  const nextMedia = () => {
    setCurrentIndex((prev) => (prev + 1) % mediaItems.length);
    setIsPlaying(false);
  };

  const prevMedia = () => {
    setCurrentIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
    setIsPlaying(false);
  };

  const handleMediaLoad = () => {
    // Media loaded - no loading state to update
  };

  const handleMediaError = (index: number) => {
    setFailedMedia(prev => new Set([...Array.from(prev), index]));
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Process media URL for better compatibility
  const processMediaUrl = (url: string, type: 'image' | 'video'): string => {
    if (!url) return '';
    
    // Cloudinary URLs - optimize for property cards
    if (url.includes('res.cloudinary.com')) {
      const parts = url.split('/upload/');
      if (parts.length === 2) {
        if (type === 'image') {
          // Add optimization parameters for images: resize to fit within 520x350, preserve aspect ratio, auto quality and format
          return `${parts[0]}/upload/w_520,h_350,c_fit,q_auto,f_auto,dpr_auto/${parts[1]}`;
        } else if (type === 'video') {
          // Add optimization parameters for videos: resize to fit within 520x350, preserve aspect ratio, auto quality
          return `${parts[0]}/upload/w_520,h_350,c_fit,q_auto,f_auto/${parts[1]}`;
        }
      }
      return url;
    }
    
    return url;
  };

  // Reset video state when media changes
  useEffect(() => {
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  }, [currentIndex]);

  const currentMedia = mediaItems[currentIndex];
  const processedMediaUrl = currentMedia ? processMediaUrl(currentMedia.url, currentMedia.type) : '';
  const hasFailedToLoad = failedMedia.has(currentIndex);

  if (!mediaItems.length || hasFailedToLoad) {
    return (
      <div className={`relative w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center border border-blue-200 ${className}`}>
        <Building2 className="h-12 w-12 text-blue-400 mb-2" />
        <span className="text-xs text-blue-600 font-medium">Property Media</span>
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
      {/* Main Media */}
      <div className="relative w-full h-full">
        {currentMedia?.type === 'image' ? (
          <Image
            src={processedMediaUrl}
            alt={`${title} - Image ${currentIndex + 1}`}
            fill
            className="object-contain"
            onLoad={handleMediaLoad}
            onError={() => handleMediaError(currentIndex)}
          />
        ) : (
          <video
            ref={videoRef}
            src={processedMediaUrl}
            className="w-full h-full object-contain object-center"
            onLoadedMetadata={handleMediaLoad}
            onError={() => handleMediaError(currentIndex)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            muted={isMuted}
            playsInline
            preload="metadata"
            controls={false}
          />
        )}
        
        {/* Video Controls */}
        {currentMedia?.type === 'video' && (
          <>
            <div className="absolute inset-0 bg-transparent" onClick={togglePlay} />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              <Button
                variant="secondary"
                size="sm"
                className="bg-black/70 hover:bg-black/80 text-white border-0 h-8 w-8 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="bg-black/70 hover:bg-black/80 text-white border-0 h-8 w-8 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMute();
                }}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            </div>
          </>
        )}
        
        {/* Navigation Arrows - only show if multiple media items */}
        {mediaItems.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white shadow-md w-8 h-8 z-20"
              onClick={prevMedia}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white shadow-md w-8 h-8 z-20"
              onClick={nextMedia}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}
        
        {/* Media Counter with Type Indicator */}
        {mediaItems.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded-md text-xs z-20 flex items-center space-x-1">
            {currentMedia?.type === 'video' && <Play className="h-3 w-3" />}
            <span>{currentIndex + 1} / {mediaItems.length}</span>
          </div>
        )}
        
        {/* Dot Indicators */}
        {mediaItems.length > 1 && mediaItems.length <= 5 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1.5">
            {mediaItems.map((item, index) => (
              <button
                key={index}
                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors relative ${
                  index === currentIndex ? 'bg-white' : 'bg-white/50'
                }`}
                onClick={() => setCurrentIndex(index)}
              >
                {item.type === 'video' && (
                  <Play className="h-1 w-1 absolute top-0.5 left-0.5 text-black" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
