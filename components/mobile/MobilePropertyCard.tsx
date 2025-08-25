'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Phone, 
  Heart,
  Share2,
  Eye,
  Star,
  CheckCircle,
  Bed,
  Bath,
  Car,
  Maximize,
  Calendar,
  Building
} from 'lucide-react';
import { cn } from '@/lib/utils';
import TouchCarousel from './TouchCarousel';

interface Property {
  id: string;
  type: 'residential' | 'commercial' | 'bungalow';
  transactionType: 'buy' | 'lease' | 'unknown';
  title: string;
  location: string;
  area: string;
  price: string;
  priceType: 'total' | 'per_sqft' | 'per_month';
  configuration: string;
  carpetArea: number;
  builtUpArea: number;
  bedrooms?: number;
  bathrooms?: number;
  balconies?: number;
  parking?: number;
  furnished?: 'Furnished' | 'Semi-Furnished' | 'Unfurnished';
  amenities: string[];
  images: string[];
  videos: string[];
  description: string;
  developedBy?: string;
  possessionDate?: string;
  approvals?: string[];
  featured: boolean;
  verified: boolean;
  contact: {
    name: string;
    phone: string;
    email: string;
  };
  postedDate: string;
  views: number;
  likes: number;
}

interface MobilePropertyCardProps {
  property: Property;
  onContact: (property: Property) => void;
  onLike?: (property: Property) => void;
  onShare?: (property: Property) => void;
  onImageClick?: (property: Property, imageIndex: number) => void;
  className?: string;
  showQuickActions?: boolean;
  compact?: boolean;
}

const MobilePropertyCard: React.FC<MobilePropertyCardProps> = ({
  property,
  onContact,
  onLike,
  onShare,
  onImageClick,
  className,
  showQuickActions = true,
  compact = false
}) => {
  
  // Utility function to combine images and videos
  const getCombinedMedia = (): string[] => {
    const images = property.images || [];
    const videos = property.videos || [];
    return [...videos, ...images]; // Videos first to match existing behavior
  };

  const formatPrice = (price: string, priceType: string) => {
    const numPrice = parseInt(price.replace(/,/g, ''));
    let formattedPrice = '';
    
    if (numPrice >= 10000000) {
      formattedPrice = `₹${(numPrice / 10000000).toFixed(1)}Cr`;
    } else if (numPrice >= 100000) {
      formattedPrice = `₹${(numPrice / 100000).toFixed(1)}L`;
    } else {
      formattedPrice = `₹${numPrice.toLocaleString()}`;
    }

    switch (priceType) {
      case 'per_month':
        return `${formattedPrice}/month`;
      case 'per_sqft':
        return `${formattedPrice}/sq ft`;
      default:
        return formattedPrice;
    }
  };

  const handleImageClick = (index: number) => {
    if (onImageClick) {
      onImageClick(property, index);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: `${property.configuration} in ${property.location} - ${formatPrice(property.price, property.priceType)}`,
          url: window.location.href + `#property-${property.id}`,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
    onShare?.(property);
  };

  const handleLike = () => {
    onLike?.(property);
  };

  return (
    <Card 
      className={cn(
        "rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300",
        "border border-gray-200 bg-white overflow-hidden",
        "transform hover:scale-[1.02] active:scale-[0.98]", // Touch feedback
        className
      )}
      id={`property-${property.id}`}
    >
      {/* Property Image Section with Enhanced Carousel */}
      <div className="relative">
        <div className={cn(
          "relative overflow-hidden",
          compact ? "h-40" : "h-56"
        )}>
          <TouchCarousel 
            media={getCombinedMedia()} 
            title={property.title}
            className="h-full w-full rounded-t-2xl"
            showControls={true}
            onImageClick={handleImageClick}
            rounded={false}
          />
        </div>
        
        {/* Property Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          <div className="flex flex-col gap-1">
            {property.featured && (
              <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white border-0 text-xs font-semibold">
                <Star className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            )}
            {property.verified && (
              <Badge className="bg-green-600 hover:bg-green-700 text-white border-0 text-xs font-semibold">
                <CheckCircle className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>
          
          {/* Quick Actions */}
          {showQuickActions && (
            <div className="flex gap-1">
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 bg-black/20 hover:bg-black/40 text-white border-0 backdrop-blur-sm"
                onClick={handleLike}
              >
                <Heart className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 bg-black/20 hover:bg-black/40 text-white border-0 backdrop-blur-sm"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Property Type Badge */}
        <div className="absolute bottom-3 left-3">
          <Badge 
            variant="secondary" 
            className="bg-white/90 text-gray-800 border-0 text-xs font-medium backdrop-blur-sm"
          >
            {property.transactionType === 'buy' ? 'For Sale' : 'For Lease'}
          </Badge>
        </div>
      </div>
      
      {/* Property Details Section */}
      <CardContent className={cn("p-4", compact && "p-3")}>
        {/* Title and Price */}
        <div className="mb-3">
          <div className="flex justify-between items-start mb-2">
            <h3 className={cn(
              "font-bold text-gray-900 leading-tight",
              compact ? "text-base" : "text-lg"
            )}>
              {property.title}
            </h3>
            <span className={cn(
              "font-bold text-blue-600 ml-2 flex-shrink-0",
              compact ? "text-base" : "text-lg"
            )}>
              {formatPrice(property.price, property.priceType)}
            </span>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-600">
            <p className="flex items-center">
              <MapPin className="h-4 w-4 mr-1 text-gray-400" />
              {property.location}
            </p>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center">
                <Eye className="h-3 w-3 mr-1" />
                {property.views}
              </span>
              <span className="flex items-center">
                <Heart className="h-3 w-3 mr-1" />
                {property.likes}
              </span>
            </div>
          </div>
        </div>

        {/* Property Details Grid */}
        <div className={cn(
          "grid gap-3 mb-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-3 border border-gray-100",
          compact ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-4"
        )}>
          <div className="text-center">
            <span className="text-xs font-medium text-gray-500 block mb-1">Configuration</span>
            <span className={cn(
              "font-bold text-gray-900",
              compact ? "text-xs" : "text-sm"
            )}>
              {property.configuration}
            </span>
          </div>
          
          <div className="text-center">
            <span className="text-xs font-medium text-gray-500 block mb-1">Carpet Area</span>
            <span className={cn(
              "font-bold text-gray-900",
              compact ? "text-xs" : "text-sm"
            )}>
              {property.carpetArea} sq ft
            </span>
          </div>
          
          {!compact && (
            <>
              <div className="text-center">
                <span className="text-xs font-medium text-gray-500 block mb-1">Built-up</span>
                <span className="text-sm font-bold text-gray-900">
                  {property.builtUpArea} sq ft
                </span>
              </div>
              
              <div className="text-center">
                <span className="text-xs font-medium text-gray-500 block mb-1">Area</span>
                <span className="text-sm font-bold text-gray-900">
                  {property.area}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Property Features - Only for residential */}
        {property.type === 'residential' && (property.bedrooms || property.bathrooms || property.parking) && (
          <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
            {property.bedrooms && (
              <div className="flex items-center">
                <Bed className="h-4 w-4 mr-1" />
                <span>{property.bedrooms}</span>
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center">
                <Bath className="h-4 w-4 mr-1" />
                <span>{property.bathrooms}</span>
              </div>
            )}
            {property.parking && (
              <div className="flex items-center">
                <Car className="h-4 w-4 mr-1" />
                <span>{property.parking}</span>
              </div>
            )}
          </div>
        )}

        {/* Furnished Status */}
        {property.furnished && (
          <div className="mb-4">
            <Badge 
              variant="outline" 
              className="text-xs border-gray-300 text-gray-700"
            >
              {property.furnished}
            </Badge>
          </div>
        )}

        {/* Key Amenities - Show top 3 */}
        {property.amenities && property.amenities.length > 0 && !compact && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {property.amenities.slice(0, 3).map((amenity, index) => (
                <Badge 
                  key={index}
                  variant="secondary" 
                  className="text-xs bg-blue-100 text-blue-800 border-0"
                >
                  {amenity}
                </Badge>
              ))}
              {property.amenities.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{property.amenities.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Developer and Possession */}
        {(property.developedBy || property.possessionDate) && !compact && (
          <div className="mb-4 space-y-1 text-xs text-gray-600">
            {property.developedBy && (
              <div className="flex items-center">
                <Building className="h-3 w-3 mr-1" />
                <span>By {property.developedBy}</span>
              </div>
            )}
            {property.possessionDate && (
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                <span>Possession: {property.possessionDate}</span>
              </div>
            )}
          </div>
        )}

        {/* Contact Button */}
        <Button 
          className={cn(
            "w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold",
            "shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl",
            "active:scale-95", // Touch feedback
            compact ? "py-2 text-sm" : "py-3"
          )}
          onClick={() => onContact(property)}
        >
          <Phone className="h-4 w-4 mr-2" />
          Contact Agent
        </Button>
      </CardContent>
    </Card>
  );
};

export default MobilePropertyCard;