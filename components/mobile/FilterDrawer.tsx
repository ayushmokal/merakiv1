'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { 
  Filter, 
  X, 
  MapPin, 
  DollarSign,
  Home,
  Bath,
  Bed,
  Maximize,
  CheckCircle,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PropertyFilters {
  searchQuery: string;
  propertyType: 'all' | 'residential' | 'commercial' | 'bungalow';
  transactionType: 'all' | 'buy' | 'lease';
  possessionFilter: 'all' | 'ready' | 'under_construction';
  location: string;
  priceRange: [number, number];
  bedrooms: string[];
  bathrooms: string[];
  furnished: string[];
  amenities: string[];
  carpetAreaRange: [number, number];
  verified: boolean;
  featured: boolean;
}

interface FilterDrawerProps {
  filters: PropertyFilters;
  onFiltersChange: (filters: PropertyFilters) => void;
  activeFiltersCount?: number;
  className?: string;
  children?: React.ReactNode;
}

const FilterDrawer: React.FC<FilterDrawerProps> = ({
  filters,
  onFiltersChange,
  activeFiltersCount = 0,
  className,
  children
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<PropertyFilters>(filters);

  const locations = [
    'All Locations',
    'Airoli', 'Belapur', 'CBD Belapur', 'Dronagiri', 'Ghansoli', 
    'Kalamboli', 'Kamothe', 'Kharghar', 'Kopar Khairane', 'Nerul', 
    'Panvel', 'Sanpada', 'Seawoods', 'Taloja', 'Ulwe', 'Vashi'
  ];

  const bedroomOptions = ['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5+ BHK'];
  const bathroomOptions = ['1', '2', '3', '4', '5+'];
  const furnishedOptions = ['Furnished', 'Semi-Furnished', 'Unfurnished'];
  const amenityOptions = [
    'Swimming Pool', 'Gym', 'Parking', 'Security', 'Garden', 
    'Elevator', 'Power Backup', 'Clubhouse', 'Children Play Area', 'CCTV'
  ];

  const handleLocalFilterChange = (key: keyof PropertyFilters, value: any) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleArrayFilterToggle = (key: keyof PropertyFilters, value: string) => {
    setLocalFilters(prev => {
      const currentArray = prev[key] as string[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      
      return {
        ...prev,
        [key]: newArray
      };
    });
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
    setIsOpen(false);
  };

  const resetFilters = () => {
    const resetFilters: PropertyFilters = {
      searchQuery: '',
      propertyType: 'all',
      transactionType: 'all',
      possessionFilter: 'all',
      location: 'all',
      priceRange: [0, 100000000],
      bedrooms: [],
      bathrooms: [],
      furnished: [],
      amenities: [],
      carpetAreaRange: [0, 5000],
      verified: false,
      featured: false
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
    setIsOpen(false);
  };

  const formatPrice = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    return `₹${value.toLocaleString()}`;
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {children || (
          <Button 
            variant="outline" 
            className={cn(
              "relative flex items-center gap-2 rounded-xl border-2 hover:border-blue-300",
              activeFiltersCount > 0 && "border-blue-500 bg-blue-50",
              className
            )}
          >
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-1 bg-blue-600 text-white text-xs px-1.5 py-0.5">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        )}
      </SheetTrigger>
      
      <SheetContent 
        side="bottom" 
        className="h-[92vh] rounded-t-3xl border-0 p-0 overflow-hidden shadow-2xl"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="px-6 py-5 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center justify-between">
              <div>
                <SheetTitle className="text-2xl font-bold text-gray-900">Filters</SheetTitle>
                <SheetDescription className="text-base text-gray-600 mt-1">
                  Find your perfect property
                </SheetDescription>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsOpen(false)}
                className="h-10 w-10 p-0 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </SheetHeader>

          {/* Filter Content */}
          <div className="flex-1 overflow-y-auto bg-white">
            <div className="p-6 space-y-8">
              
              {/* Property Type */}
              <div className="space-y-4">
                <Label className="text-lg font-bold text-gray-900 flex items-center gap-3">
                  <Home className="h-5 w-5 text-blue-600" />
                  Property Type
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'all', label: 'All Properties' },
                    { value: 'residential', label: 'Residential' },
                    { value: 'commercial', label: 'Commercial' },
                    { value: 'bungalow', label: 'Bungalow' }
                  ].map((type) => (
                    <Button
                      key={type.value}
                      variant={localFilters.propertyType === type.value ? "default" : "outline"}
                      size="lg"
                      onClick={() => handleLocalFilterChange('propertyType', type.value)}
                      className="justify-start h-14 text-base font-semibold rounded-xl transition-all transform hover:scale-105 active:scale-95"
                    >
                      {type.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Transaction Type */}
              <div className="space-y-4">
                <Label className="text-lg font-bold text-gray-900 flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Transaction Type
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'all', label: 'All' },
                    { value: 'buy', label: 'Buy' },
                    { value: 'lease', label: 'Lease' }
                  ].map((type) => (
                    <Button
                      key={type.value}
                      variant={localFilters.transactionType === type.value ? "default" : "outline"}
                      size="lg"
                      onClick={() => handleLocalFilterChange('transactionType', type.value)}
                      className="justify-center h-14 text-base font-semibold rounded-xl transition-all transform hover:scale-105 active:scale-95"
                    >
                      {type.label}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator className="my-6" />

              {/* Location */}
              <div className="space-y-4">
                <Label className="text-lg font-bold text-gray-900 flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-purple-600" />
                  Location
                </Label>
                <Select 
                  value={localFilters.location} 
                  onValueChange={(value) => handleLocalFilterChange('location', value)}
                >
                  <SelectTrigger className="w-full h-14 text-base rounded-xl border-2 font-semibold">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="all" className="text-base py-3">All Locations</SelectItem>
                    {locations.slice(1).map((location) => (
                      <SelectItem key={location} value={location.toLowerCase()} className="text-base py-3">
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="space-y-4">
                <Label className="text-lg font-bold text-gray-900">
                  Price Range: {formatPrice(localFilters.priceRange[0])} - {formatPrice(localFilters.priceRange[1])}
                </Label>
                <div className="px-3 py-4 bg-blue-50 rounded-xl">
                  <Slider
                    value={localFilters.priceRange}
                    onValueChange={(value) => handleLocalFilterChange('priceRange', value as [number, number])}
                    max={100000000}
                    min={0}
                    step={500000}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Carpet Area Range */}
              <div className="space-y-4">
                <Label className="text-lg font-bold text-gray-900 flex items-center gap-3">
                  <Maximize className="h-5 w-5 text-orange-600" />
                  Carpet Area: {localFilters.carpetAreaRange[0]} - {localFilters.carpetAreaRange[1]} sq ft
                </Label>
                <div className="px-3 py-4 bg-orange-50 rounded-xl">
                  <Slider
                    value={localFilters.carpetAreaRange}
                    onValueChange={(value) => handleLocalFilterChange('carpetAreaRange', value as [number, number])}
                    max={5000}
                    min={0}
                    step={100}
                    className="w-full"
                  />
                </div>
              </div>

              <Separator className="my-6" />

              {/* Bedrooms */}
              <div className="space-y-4">
                <Label className="text-lg font-bold text-gray-900 flex items-center gap-3">
                  <Bed className="h-5 w-5 text-pink-600" />
                  Bedrooms
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  {bedroomOptions.map((bedroom) => (
                    <Button
                      key={bedroom}
                      variant={localFilters.bedrooms.includes(bedroom) ? "default" : "outline"}
                      size="lg"
                      onClick={() => handleArrayFilterToggle('bedrooms', bedroom)}
                      className="justify-center h-14 text-base font-semibold rounded-xl transition-all transform hover:scale-105 active:scale-95"
                    >
                      {bedroom}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Bathrooms */}
              <div className="space-y-4">
                <Label className="text-lg font-bold text-gray-900 flex items-center gap-3">
                  <Bath className="h-5 w-5 text-cyan-600" />
                  Bathrooms
                </Label>
                <div className="grid grid-cols-5 gap-2">
                  {bathroomOptions.map((bathroom) => (
                    <Button
                      key={bathroom}
                      variant={localFilters.bathrooms.includes(bathroom) ? "default" : "outline"}
                      size="lg"
                      onClick={() => handleArrayFilterToggle('bathrooms', bathroom)}
                      className="justify-center h-12 text-base font-semibold rounded-xl transition-all transform hover:scale-105 active:scale-95"
                    >
                      {bathroom}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Furnished Status */}
              <div className="space-y-4">
                <Label className="text-lg font-bold text-gray-900">Furnished Status</Label>
                <div className="grid grid-cols-2 gap-3">
                  {furnishedOptions.map((option) => (
                    <Button
                      key={option}
                      variant={localFilters.furnished.includes(option) ? "default" : "outline"}
                      size="lg"
                      onClick={() => handleArrayFilterToggle('furnished', option)}
                      className="justify-center h-14 text-sm font-semibold rounded-xl transition-all transform hover:scale-105 active:scale-95"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator className="my-6" />

              {/* Special Filters */}
              <div className="space-y-4">
                <Label className="text-sm font-semibold text-gray-900">Special Filters</Label>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="verified"
                    checked={localFilters.verified}
                    onCheckedChange={(checked) => handleLocalFilterChange('verified', checked)}
                  />
                  <Label htmlFor="verified" className="text-sm flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Verified Properties Only
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={localFilters.featured}
                    onCheckedChange={(checked) => handleLocalFilterChange('featured', checked)}
                  />
                  <Label htmlFor="featured" className="text-sm flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-600" />
                    Featured Properties Only
                  </Label>
                </div>
              </div>

              {/* Amenities */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-900">Amenities</Label>
                <div className="grid grid-cols-2 gap-2">
                  {amenityOptions.map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox
                        id={amenity}
                        checked={localFilters.amenities.includes(amenity)}
                        onCheckedChange={() => handleArrayFilterToggle('amenities', amenity)}
                      />
                      <Label htmlFor={amenity} className="text-sm">
                        {amenity}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t bg-gradient-to-r from-gray-50 to-blue-50 p-6 safe-area-padding-bottom">
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                onClick={resetFilters}
                className="flex-1 h-14 text-lg font-semibold rounded-xl border-2 hover:border-gray-400 transition-all transform active:scale-95"
              >
                Reset All
              </Button>
              <Button 
                onClick={applyFilters}
                className="flex-2 h-14 text-lg font-bold rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 active:scale-95"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FilterDrawer;
