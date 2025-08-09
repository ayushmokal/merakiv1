'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { 
  Building2, 
  Search, 
  Filter, 
  MapPin, 
  Home,
  Building,
  Warehouse,
  TreePine,
  Palette,
  Plus,
  Phone,
  Loader2
} from 'lucide-react';
import EnquiryModal from '@/components/EnquiryModal';
import MediaCarousel from '@/components/MediaCarousel';
import PropertyPostModal from '@/components/PropertyPostModal';

// Enhanced Property Interface for different categories
interface Property {
  id: string;
  type: 'buy' | 'lease' | 'commercial' | 'bungalow' | 'interior';
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
  videos: string[]; // Add support for video URLs
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

interface PropertyFilters {
  searchQuery: string;
  propertyType: 'all' | 'buy' | 'lease' | 'commercial' | 'bungalow' | 'interior';
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



export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);

  const [totalProperties, setTotalProperties] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [lastSearchParams, setLastSearchParams] = useState<string>('');

  // Utility function to combine images and videos into a single media array
  const getCombinedMedia = (property: Property): string[] => {
    // If the property has a media field (preserving original order), use it
    if ((property as any).media && Array.isArray((property as any).media)) {
      return (property as any).media;
    }
    
    const images = property.images || [];
    const videos = property.videos || [];
    
    // If videos array exists, combine with images
    if (videos.length > 0) {
      return [...videos, ...images]; // Videos first to match Google Sheets order
    }
    
    // If no separate videos array, check if images array contains video URLs
    const separatedMedia = images.reduce((acc: { images: string[], videos: string[] }, url: string) => {
      // Check for video URLs using the same logic as MediaCarousel
      const isVideo = url.includes('/video/upload/') || 
                     url.match(/\.(mp4|mov|avi|webm|ogg|m4v|3gp|flv|wmv|mkv)(\?|$|#)/i) ||
                     (url.includes('video') && (url.includes('cloudinary') || url.includes('youtube') || url.includes('vimeo')));
      
      if (isVideo) {
        acc.videos.push(url);
      } else {
        acc.images.push(url);
      }
      return acc;
    }, { images: [], videos: [] });
    
    return [...separatedMedia.videos, ...separatedMedia.images]; // Videos first
  };

  const [filters, setFilters] = useState<PropertyFilters>({
    searchQuery: '',
    propertyType: 'all',
    location: 'all',
    priceRange: [0, 50000000],
    bedrooms: [],
    bathrooms: [],
    furnished: [],
    amenities: [],
    carpetAreaRange: [0, 5000],
    verified: false,
    featured: false
  });

  const [sortBy, setSortBy] = useState<string>('relevance');

  const propertyTypes = [
    { value: 'all', label: 'All Properties', icon: Building2 },
    { value: 'buy', label: 'Buy', icon: Home },
    { value: 'lease', label: 'Lease', icon: Building },
    { value: 'commercial', label: 'Commercial', icon: Warehouse },
    { value: 'bungalow', label: 'Bungalow', icon: TreePine },
    { value: 'interior', label: 'Interior', icon: Palette }
  ];

  const locations = [
    'Airoli', 'Belapur', 'CBD Belapur', 'Dronagiri', 'Ghansoli', 'Kalamboli', 'Kamothe', 'Kharghar',
    'Kopar Khairane', 'Nerul', 'Panvel', 'Sanpada', 'Seawoods', 'Taloja', 'Ulwe', 'Vashi'
  ];



  // Debounced fetch function to reduce API calls
  const fetchProperties = useCallback(async (resetData = false) => {
    try {
      if (resetData) {
        setSearchLoading(true);
        if (initialLoading) {
          setInitialLoading(true);
        }
      } else {
        setLoading(true);
      }
      
      const params = new URLSearchParams({
        category: filters.propertyType.toUpperCase(),
        limit: '50', // Show all properties - matches backend default
        offset: resetData ? '0' : (currentPage * 50).toString(),
        search: filters.searchQuery,
        location: filters.location === 'all' ? '' : filters.location,
        minPrice: filters.priceRange[0].toString(),
        maxPrice: filters.priceRange[1].toString(),
        bedrooms: filters.bedrooms.join(',')
      });

      const paramsString = params.toString();
      
      // Skip API call if same parameters and resetData is true
      if (resetData && paramsString === lastSearchParams && !initialLoading) {
        setSearchLoading(false);
        setLoading(false);
        return;
      }
      
      if (resetData) {
        setLastSearchParams(paramsString);
      }

      const response = await fetch(`/api/properties?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }

      const data = await response.json();
      
      if (data.success) {
        // Sort properties by postedDate (newest first)
        const sortedData = data.data.sort((a: Property, b: Property) => {
          const dateA = new Date(a.postedDate);
          const dateB = new Date(b.postedDate);
          return dateB.getTime() - dateA.getTime(); // Descending order (newest first)
        });
        
        if (resetData) {
          setProperties(sortedData);
          setFilteredProperties(sortedData);
          setCurrentPage(0);
        } else {
          setProperties(prev => [...prev, ...sortedData]);
          setFilteredProperties(prev => [...prev, ...sortedData]);
        }
        setTotalProperties(data.total);
        setHasMore(data.pagination.hasMore);
      } else {
        console.error('API Error:', data.error);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
      setSearchLoading(false);
      setInitialLoading(false);
    }
  }, [filters.propertyType, filters.searchQuery, filters.location, filters.priceRange, filters.bedrooms, currentPage, initialLoading, lastSearchParams]);

  // Debounced version of fetchProperties
  const debouncedFetchProperties = useCallback((resetData = false) => {
    // Skip debounce for initial load
    if (initialLoading) {
      fetchProperties(resetData);
    } else {
      const timeoutId = setTimeout(() => {
        fetchProperties(resetData);
      }, 300); // 300ms debounce delay
      return timeoutId;
    }
  }, [fetchProperties, initialLoading]);

  // Initial load
  useEffect(() => {
    debouncedFetchProperties(true);
  }, [debouncedFetchProperties, filters.propertyType, filters.searchQuery, filters.location, filters.priceRange]);

  // Reset to initial loading when major filters change
  useEffect(() => {
    // Reset current page and trigger initial loading when property type changes
    setCurrentPage(0);
    setProperties([]);
    setFilteredProperties([]);
  }, [filters.propertyType]);

  // Filter properties locally for price range and other filters
  useEffect(() => {
    let filtered = properties;

    // Location filter (local filtering for API results)
    if (filters.location !== 'all') {
      filtered = filtered.filter(property => 
        property.location.toLowerCase().includes(filters.location.toLowerCase()) ||
        property.area.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Price range filter
    if (filters.priceRange[1] < 50000000) {
      filtered = filtered.filter(property => {
        const price = parseFloat(property.price.replace(/,/g, ''));
        return price >= 0 && price <= filters.priceRange[1];
      });
    }

    // Configuration filter
    if (filters.bedrooms.length > 0) {
      filtered = filtered.filter(property => 
        filters.bedrooms.some(config => property.configuration.toLowerCase().includes(config.toLowerCase()))
      );
    }

    // Carpet Area filter
    if (filters.carpetAreaRange[1] < 5000) {
      filtered = filtered.filter(property => 
        property.carpetArea >= 0 && property.carpetArea <= filters.carpetAreaRange[1]
      );
    }

    setFilteredProperties(filtered);
  }, [filters.priceRange, filters.bedrooms, filters.carpetAreaRange, filters.location, properties]);

  // Sort filtered properties based on selected sort option
  const sortedProperties = useMemo(() => {
    let sorted = [...filteredProperties];
    
    // Helper function to parse Indian price format
    const parseIndianPrice = (priceStr: string): number => {
      if (!priceStr) return 0;
      
      // Remove currency symbols and clean the string
      let cleanPrice = priceStr.replace(/[₹,\s]/g, '');
      
      // Handle price ranges - take the minimum value for sorting
      if (cleanPrice.includes('-')) {
        const parts = cleanPrice.split('-');
        cleanPrice = parts[0]; // Take the minimum price for sorting
      }
      
      // Handle different units (check BEFORE removing non-digit characters)
      if (cleanPrice.includes('Cr') || cleanPrice.includes('cr')) {
        const numValue = parseFloat(cleanPrice.replace(/[^\d.]/g, ''));
        return numValue * 10000000; // 1 Cr = 1,00,00,000
      } else if (cleanPrice.includes('L') || cleanPrice.includes('l')) {
        const numValue = parseFloat(cleanPrice.replace(/[^\d.]/g, ''));
        return numValue * 100000; // 1 L = 1,00,000
      } else if (cleanPrice.includes('K') || cleanPrice.includes('k')) {
        const numValue = parseFloat(cleanPrice.replace(/[^\d.]/g, ''));
        return numValue * 1000; // 1 K = 1,000
      } else {
        // Assume it's already in rupees
        return parseFloat(cleanPrice.replace(/[^\d.]/g, '')) || 0;
      }
    };
    
    switch (sortBy) {
      case 'price-low':
        sorted.sort((a, b) => {
          const priceA = parseIndianPrice(a.price);
          const priceB = parseIndianPrice(b.price);
          return priceA - priceB;
        });
        break;
      case 'price-high':
        sorted.sort((a, b) => {
          const priceA = parseIndianPrice(a.price);
          const priceB = parseIndianPrice(b.price);
          return priceB - priceA;
        });
        break;
      case 'newest':
        sorted.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
        break;
      case 'area-large':
        sorted.sort((a, b) => (b.carpetArea || 0) - (a.carpetArea || 0));
        break;
      case 'relevance':
      default:
        // Keep original order (by featured, verified, etc.)
        sorted.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          if (a.verified && !b.verified) return -1;
          if (!a.verified && b.verified) return 1;
          return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
        });
        break;
    }
    
    return sorted;
  }, [filteredProperties, sortBy]);



  const handleEnquiry = async (property: Property) => {
    try {
      // Update view count
      await fetch('/api/properties', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: property.id,
          category: property.type,
          action: 'view'
        })
      });
      
      setSelectedProperty(property);
      setShowEnquiryModal(true);
    } catch (error) {
      console.error('Error updating view count:', error);
      setSelectedProperty(property);
      setShowEnquiryModal(true);
    }
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      setCurrentPage(prev => prev + 1);
      fetchProperties(false);
    }
  };

  const formatPrice = (price: string, priceType: string) => {
    switch (priceType) {
      case 'total':
        return `₹${price}`;
      case 'per_month':
        return `₹${price}/month`;
      case 'per_sqft':
        return `₹${price}/sq ft`;
      default:
        return `₹${price}`;
    }
  };

  // Count active filters
  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.location !== 'all') count++;
    if (filters.priceRange[1] < 50000000) count++;
    if (filters.carpetAreaRange[1] < 5000) count++;
    if (filters.bedrooms.length > 0) count++;
    return count;
  };



    const PropertyCard = ({ property }: { property: Property }) => (
    <Card className="rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 bg-white overflow-hidden">
      {/* Mobile Layout */}
      <div className="block md:hidden">
        {/* Property Image Section */}
        <div className="relative w-full h-48 overflow-hidden rounded-t-xl">
          <MediaCarousel 
            media={getCombinedMedia(property)} 
            title={property.title}
            className="h-full w-full"
          />
        </div>
        
        {/* Property Details Section */}
        <CardContent className="p-4">
          <div className="mb-3">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{property.title}</h3>
              <span className="text-lg font-bold text-primary ml-2">{formatPrice(property.price, property.priceType)}</span>
            </div>
            <p className="text-sm text-gray-600 flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {property.location}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-3 border border-gray-100">
            <div className="text-center">
              <span className="text-xs font-medium text-gray-500 block mb-1">Configuration</span>
              <span className="text-sm font-bold text-gray-900">{property.configuration}</span>
            </div>
            <div className="text-center">
              <span className="text-xs font-medium text-gray-500 block mb-1">Carpet Size</span>
              <span className="text-sm font-bold text-gray-900">{property.carpetArea} sq ft</span>
            </div>
            <div className="text-center">
              <span className="text-xs font-medium text-gray-500 block mb-1">Built up</span>
              <span className="text-sm font-bold text-gray-900">{property.builtUpArea} sq ft</span>
            </div>
            <div className="text-center">
              <span className="text-xs font-medium text-gray-500 block mb-1">Node</span>
              <span className="text-sm font-bold text-gray-900">{property.area}</span>
            </div>
          </div>

          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg" 
            onClick={() => handleEnquiry(property)}
          >
            <Phone className="h-4 w-4 mr-2" />
            Contact
          </Button>
        </CardContent>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex h-64">
        {/* Property Image Section with Carousel */}
        <div className="relative w-80 h-full flex-shrink-0 overflow-hidden rounded-l-xl">
          <MediaCarousel 
            media={getCombinedMedia(property)} 
            title={property.title}
            className="h-full w-full"
          />
        </div>
        
        {/* Property Details Section */}
        <CardContent className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1 pr-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{property.title}</h3>
                <p className="text-sm text-gray-600 flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {property.location}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold text-primary">{formatPrice(property.price, property.priceType)}</span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3 mb-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-3 border border-gray-100">
              <div className="text-center">
                <span className="text-xs font-medium text-gray-500 block mb-1">Configuration</span>
                <span className="text-sm font-bold text-gray-900">{property.configuration}</span>
              </div>
              <div className="text-center">
                <span className="text-xs font-medium text-gray-500 block mb-1">Carpet Size</span>
                <span className="text-sm font-bold text-gray-900">{property.carpetArea} sq ft</span>
              </div>
              <div className="text-center">
                <span className="text-xs font-medium text-gray-500 block mb-1">Built up</span>
                <span className="text-sm font-bold text-gray-900">{property.builtUpArea} sq ft</span>
              </div>
              <div className="text-center">
                <span className="text-xs font-medium text-gray-500 block mb-1">Node</span>
                <span className="text-sm font-bold text-gray-900">{property.area}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-auto">
            <Button 
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg" 
              onClick={() => handleEnquiry(property)}
            >
              <Phone className="h-4 w-4 mr-2" />
              Contact
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Search - extends behind navbar */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-12 sm:py-16 -mt-[80px] lg:-mt-[88px] pt-[92px] lg:pt-[104px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 leading-tight">
              Properties in Mumbai
            </h1>
            <p className="text-lg sm:text-xl text-white/90">
              Explore verified listings
            </p>
          </div>

          {/* Property Type Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1 flex flex-wrap gap-1 max-w-full">
              {propertyTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setFilters(prev => ({ ...prev, propertyType: type.value as any }))}
                  className={`px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-all min-h-[44px] ${
                    filters.propertyType === type.value
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <type.icon className="h-4 w-4 mr-1 sm:mr-2 inline" />
                  <span className="hidden sm:inline">{type.label}</span>
                  <span className="sm:hidden">{type.label.split(' ')[0]}</span>
                </button>
              ))}
              
              {/* Post a Property Button integrated into tabs */}
              <PropertyPostModal>
                <button className="px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-all min-h-[44px] bg-black hover:bg-gray-800 text-white">
                  <Plus className="h-4 w-4 mr-1 sm:mr-2 inline" />
                  <span className="hidden sm:inline">Post a Property</span>
                  <span className="sm:hidden">Post</span>
                </button>
              </PropertyPostModal>
            </div>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-3 sm:p-4 flex flex-col gap-3 sm:gap-4">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                {/* Location Selector */}
                <div className="w-full sm:w-auto sm:min-w-[200px]">
                  <Select value={filters.location} onValueChange={(value) => setFilters(prev => ({ ...prev, location: value }))}>
                    <SelectTrigger className="border-0 bg-gray-50 hover:bg-gray-100 transition-colors text-gray-900 h-12">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                        <SelectValue placeholder="Select Location" className="text-gray-900">
                          {filters.location === 'all' ? 'All Locations' : filters.location}
                        </SelectValue>
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-lg">
                      <SelectItem value="all" className="text-gray-900 hover:bg-gray-50">All Locations</SelectItem>
                      {locations.map(location => (
                        <SelectItem key={location} value={location} className="text-gray-900 hover:bg-gray-50">{location}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Search Input */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search locality, project, or builder"
                      className="pl-10 border-0 bg-gray-50 text-gray-900 placeholder-gray-500 hover:bg-gray-100 transition-colors h-12 text-base"
                      value={filters.searchQuery}
                      onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
              
              <Button 
                className="bg-primary hover:bg-primary/90 font-semibold h-12 text-base"
                onClick={() => debouncedFetchProperties(true)}
                disabled={searchLoading || initialLoading}
              >
                {(searchLoading || initialLoading) ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                {(searchLoading || initialLoading) ? 'Exploring...' : 'Search'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-80 space-y-4 lg:space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">Filters</h3>
                  {getActiveFiltersCount() > 0 && (
                    <Badge variant="default" className="bg-blue-600 text-white">
                      {getActiveFiltersCount()}
                    </Badge>
                  )}
                </div>
                <Button variant="ghost" size="sm" onClick={() => setFilters({
                  searchQuery: '',
                  propertyType: 'all',
                  location: 'all',
                  priceRange: [0, 50000000],
                  bedrooms: [],
                  bathrooms: [],
                  furnished: [],
                  amenities: [],
                  carpetAreaRange: [0, 5000],
                  verified: false,
                  featured: false
                })}>
                  Clear All
                </Button>
              </div>

              <div className="space-y-6">
                {/* Price Range */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Price Range</Label>
                  
                  {/* Manual Price Input Fields */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <Label className="text-xs text-gray-600 mb-1 block">Min Price (₹ Lakhs)</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={filters.priceRange[0] > 0 ? (filters.priceRange[0] / 100000).toString() : ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          const minPrice = value === '' ? 0 : parseFloat(value) * 100000;
                          if (!isNaN(minPrice) && minPrice >= 0) {
                            setFilters(prev => ({ 
                              ...prev, 
                              priceRange: [minPrice, Math.max(minPrice, prev.priceRange[1])] as [number, number] 
                            }));
                          }
                        }}
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600 mb-1 block">Max Price (₹ Lakhs)</Label>
                      <Input
                        type="number"
                        placeholder="500"
                        value={filters.priceRange[1] < 50000000 ? (filters.priceRange[1] / 100000).toString() : ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          const maxPrice = value === '' ? 50000000 : parseFloat(value) * 100000;
                          if (!isNaN(maxPrice) && maxPrice >= 0) {
                            setFilters(prev => ({ 
                              ...prev, 
                              priceRange: [Math.min(prev.priceRange[0], maxPrice), maxPrice] as [number, number] 
                            }));
                          }
                        }}
                        className="text-sm"
                      />
                    </div>
                  </div>

                  {/* Slider for Quick Selection */}
                  <div>
                    <Label className="text-xs text-gray-500 mb-2 block">Quick Selection (Max Price)</Label>
                    <Slider
                      value={[filters.priceRange[1]]}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: [prev.priceRange[0], value[0]] as [number, number] }))}
                      max={50000000}
                      step={100000}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-2">
                      <span>₹{(filters.priceRange[0] / 100000).toFixed(0)}L</span>
                      <span>₹{(filters.priceRange[1] / 100000).toFixed(0)}L</span>
                    </div>
                  </div>

                  {/* Quick Price Preset Buttons */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {[
                      { label: '< 10L', min: 0, max: 1000000 },
                      { label: '10-20L', min: 1000000, max: 2000000 },
                      { label: '20-50L', min: 2000000, max: 5000000 },
                      { label: '50L-1Cr', min: 5000000, max: 10000000 },
                      { label: '1Cr+', min: 10000000, max: 50000000 }
                    ].map((preset) => (
                      <Button
                        key={preset.label}
                        variant="outline"
                        size="sm"
                        className={`text-xs ${
                          filters.priceRange[0] === preset.min && filters.priceRange[1] === preset.max
                            ? 'bg-blue-50 border-blue-300 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                        onClick={() => setFilters(prev => ({ 
                          ...prev, 
                          priceRange: [preset.min, preset.max] as [number, number] 
                        }))}
                      >
                        {preset.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Carpet Area Range */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Carpet Area (sq ft)</Label>
                  <Slider
                    value={[filters.carpetAreaRange[1]]}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, carpetAreaRange: [0, value[0]] as [number, number] }))}
                    max={5000}
                    step={50}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <span>0 sq ft</span>
                    <span>{filters.carpetAreaRange[1]} sq ft</span>
                  </div>
                </div>

                <Separator />

                {/* Location Filter */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-sm font-medium">Location</Label>
                    {filters.location !== 'all' && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setFilters(prev => ({ ...prev, location: 'all' }))}
                        className="text-xs text-gray-500 hover:text-gray-700"
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                  <Select value={filters.location} onValueChange={(value) => setFilters(prev => ({ ...prev, location: value }))}>
                    <SelectTrigger className="w-full text-gray-900 bg-white border border-gray-300 hover:border-gray-400">
                      <SelectValue placeholder="Select Location" className="text-gray-900">
                        {filters.location === 'all' ? 'All Locations' : filters.location}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-lg max-h-60 overflow-y-auto">
                      <SelectItem value="all" className="text-gray-900 hover:bg-gray-50">All Locations</SelectItem>
                      {locations.map(location => (
                        <SelectItem key={location} value={location} className="text-gray-900 hover:bg-gray-50">
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Configuration Type */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Configuration</Label>
                  <div className="space-y-2">
                    {['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5 BHK', 'Villa', 'Office Space'].map(config => (
                      <div key={config} className="flex items-center space-x-2">
                        <Checkbox
                          id={`config-${config}`}
                          checked={filters.bedrooms.includes(config)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFilters(prev => ({ ...prev, bedrooms: [...prev.bedrooms, config] }));
                            } else {
                              setFilters(prev => ({ ...prev, bedrooms: prev.bedrooms.filter(b => b !== config) }));
                            }
                          }}
                        />
                        <Label htmlFor={`config-${config}`} className="text-sm">{config}</Label>
                      </div>
                    ))}
                  </div>
                </div>


              </div>
            </div>
          </div>

          {/* Properties Grid */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold leading-tight">
                  Properties for {filters.propertyType === 'all' ? 'All Types' : propertyTypes.find(t => t.value === filters.propertyType)?.label}
                  {filters.location !== 'all' && ` in ${filters.location}`}
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">
                  {initialLoading ? 'Discovering amazing properties for you...' : 
                   `Showing ${sortedProperties.length} of ${totalProperties} properties${filters.location !== 'all' ? ` in ${filters.location}` : ''}`}
                </p>
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="area-large">Area: Large to Small</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(initialLoading || (searchLoading && sortedProperties.length === 0)) ? (
              <div className="flex justify-center items-center h-64">
                <div className="flex items-center space-x-3 text-xl text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span>{initialLoading ? 'Curating your perfect property matches...' : 'Finding properties that match your criteria...'}</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {searchLoading && sortedProperties.length > 0 && (
                  <div className="flex justify-center py-4">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Refreshing your property options...</span>
                    </div>
                  </div>
                )}
                {sortedProperties.map((property, index) => (
                  <PropertyCard key={`${property.type}-${property.id}-${index}`} property={property} />
                ))}
              </div>
            )}

            {!loading && !searchLoading && !initialLoading && sortedProperties.length === 0 && (
              <div className="text-center py-12">
                <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties found in your price range</h3>
                <div className="text-gray-600 max-w-md mx-auto">
                  {filters.priceRange[1] < 50000000 || filters.priceRange[0] > 0 ? (
                    <div>
                      <p className="mb-3">
                        No properties available 
                        {filters.priceRange[0] > 0 && filters.priceRange[1] < 50000000 
                          ? ` between ₹${(filters.priceRange[0] / 100000).toFixed(0)}L - ₹${(filters.priceRange[1] / 100000).toFixed(0)}L`
                          : filters.priceRange[0] > 0 
                          ? ` above ₹${(filters.priceRange[0] / 100000).toFixed(0)}L`
                          : ` under ₹${(filters.priceRange[1] / 100000).toFixed(0)}L`
                        }
                      </p>
                      <div className="flex flex-col gap-2 justify-center">
                        <div className="flex gap-2 justify-center">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setFilters(prev => ({ 
                              ...prev, 
                              priceRange: [
                                Math.max(0, prev.priceRange[0] - 500000), 
                                prev.priceRange[1] + 500000
                              ] as [number, number] 
                            }))}
                          >
                            Expand range
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setFilters(prev => ({ ...prev, priceRange: [0, 50000000] as [number, number] }))}
                          >
                            Clear price filter
                          </Button>
                        </div>
                        {/* Quick suggestions based on current range */}
                        <div className="flex flex-wrap gap-1 justify-center mt-2">
                          {[
                            { label: '< 20L', range: [0, 2000000] },
                            { label: '20-50L', range: [2000000, 5000000] },
                            { label: '50L-1Cr', range: [5000000, 10000000] },
                            { label: '1Cr+', range: [10000000, 50000000] }
                          ].map((suggestion) => (
                            <Button
                              key={suggestion.label}
                              variant="ghost"
                              size="sm"
                              className="text-xs text-blue-600 hover:bg-blue-50"
                              onClick={() => setFilters(prev => ({ 
                                ...prev, 
                                priceRange: suggestion.range as [number, number] 
                              }))}
                            >
                              Try {suggestion.label}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p>Try adjusting your filters or search criteria</p>
                  )}
                </div>
              </div>
            )}

            {/* Load More Button */}
            {!searchLoading && !initialLoading && hasMore && sortedProperties.length > 0 && (
              <div className="text-center mt-8">
                <Button 
                  onClick={loadMore} 
                  variant="outline" 
                  size="lg"
                  className="px-8"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Discovering more options...
                    </>
                  ) : (
                    'Load More Properties'
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enquiry Modal */}
      {selectedProperty && (
        <EnquiryModal
          isOpen={showEnquiryModal}
          onClose={() => setShowEnquiryModal(false)}
          project={{
            srNo: parseInt(selectedProperty.id),
            configuration: selectedProperty.configuration,
            carpetSize: selectedProperty.carpetArea,
            builtUp: selectedProperty.builtUpArea,
            node: selectedProperty.area,
            price: selectedProperty.price
          }}
        />
      )}
    </div>
  );
} 