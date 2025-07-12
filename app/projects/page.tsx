'use client';

import { useState, useEffect } from 'react';
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
  Bed, 
  Bath, 
  Square, 
  Car, 
  Home,
  Building,
  Warehouse,
  TreePine,
  Palette,
  Plus,
  IndianRupee,
  Calendar,
  User,
  Phone,
  Mail,
  Heart,
  Share2,
  Loader2
} from 'lucide-react';
import EnquiryModal from '@/components/EnquiryModal';

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

// Sample data structure - this will be replaced with API calls
const sampleProperties: Property[] = [
  {
    id: '1',
    type: 'buy',
    title: 'Modern 2BHK Apartment',
    location: 'Kharghar, Navi Mumbai',
    area: 'Sector 21',
    price: '85,00,000',
    priceType: 'total',
    configuration: '2 BHK',
    carpetArea: 650,
    builtUpArea: 850,
    bedrooms: 2,
    bathrooms: 2,
    balconies: 1,
    parking: 1,
    furnished: 'Semi-Furnished',
    amenities: ['Gym', 'Swimming Pool', 'Security', 'Power Backup', 'Lift'],
    images: ['/images/property1.jpg'],
    description: 'Beautiful 2BHK apartment with modern amenities and excellent connectivity.',
    developedBy: 'ABC Developers',
    possessionDate: 'December 2024',
    approvals: ['RERA', 'Bank Loan'],
    featured: true,
    verified: true,
    contact: {
      name: 'Meraki Square Foots',
      phone: '+91 98765 43210',
      email: 'info@merakisquarefoots.com'
    },
    postedDate: '2024-01-15',
    views: 245,
    likes: 12
  },
  {
    id: '2',
    type: 'lease',
    title: 'Spacious 3BHK for Rent',
    location: 'Vashi, Navi Mumbai',
    area: 'Sector 17',
    price: '35,000',
    priceType: 'per_month',
    configuration: '3 BHK',
    carpetArea: 950,
    builtUpArea: 1200,
    bedrooms: 3,
    bathrooms: 3,
    balconies: 2,
    parking: 2,
    furnished: 'Furnished',
    amenities: ['Gym', 'Swimming Pool', 'Security', 'Power Backup', 'Lift', 'Garden'],
    images: ['/images/property2.jpg'],
    description: 'Fully furnished 3BHK apartment perfect for families with all modern amenities.',
    featured: false,
    verified: true,
    contact: {
      name: 'Meraki Square Foots',
      phone: '+91 98765 43210',
      email: 'info@merakisquarefoots.com'
    },
    postedDate: '2024-01-20',
    views: 178,
    likes: 8
  },
  {
    id: '3',
    type: 'commercial',
    title: 'Premium Office Space',
    location: 'Belapur, Navi Mumbai',
    area: 'CBD',
    price: '125',
    priceType: 'per_sqft',
    configuration: 'Office Space',
    carpetArea: 2500,
    builtUpArea: 3000,
    parking: 8,
    amenities: ['Security', 'Power Backup', 'Lift', 'Air Conditioning', 'Cafeteria'],
    images: ['/images/property3.jpg'],
    description: 'Modern office space in prime CBD location with excellent connectivity.',
    featured: true,
    verified: true,
    contact: {
      name: 'Meraki Square Foots',
      phone: '+91 98765 43210',
      email: 'info@merakisquarefoots.com'
    },
    postedDate: '2024-01-18',
    views: 320,
    likes: 15
  },
  {
    id: '4',
    type: 'bungalow',
    title: 'Luxury Villa with Garden',
    location: 'Panvel, Navi Mumbai',
    area: 'New Panvel',
    price: '1,50,00,000',
    priceType: 'total',
    configuration: '4 BHK Villa',
    carpetArea: 2500,
    builtUpArea: 3200,
    bedrooms: 4,
    bathrooms: 4,
    balconies: 3,
    parking: 3,
    furnished: 'Semi-Furnished',
    amenities: ['Garden', 'Swimming Pool', 'Security', 'Power Backup', 'Servant Room'],
    images: ['/images/property4.jpg'],
    description: 'Luxurious independent villa with private garden and swimming pool.',
    developedBy: 'Premium Builders',
    featured: true,
    verified: true,
    contact: {
      name: 'Meraki Square Foots',
      phone: '+91 98765 43210',
      email: 'info@merakisquarefoots.com'
    },
    postedDate: '2024-01-12',
    views: 156,
    likes: 22
  },
  {
    id: '5',
    type: 'interior',
    title: 'Complete Interior Design Package',
    location: 'Navi Mumbai',
    area: 'All Areas',
    price: '1,200',
    priceType: 'per_sqft',
    configuration: 'Interior Design',
    carpetArea: 1000,
    builtUpArea: 1000,
    amenities: ['3D Design', 'Modular Kitchen', 'Wardrobe', 'Lighting', 'Flooring'],
    images: ['/images/property5.jpg'],
    description: 'Complete interior design solution with modern aesthetics and functionality.',
    featured: false,
    verified: true,
    contact: {
      name: 'Meraki Square Foots',
      phone: '+91 98765 43210',
      email: 'info@merakisquarefoots.com'
    },
    postedDate: '2024-01-25',
    views: 89,
    likes: 5
  }
];

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [likedProperties, setLikedProperties] = useState<string[]>([]);
  const [totalProperties, setTotalProperties] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const [filters, setFilters] = useState<PropertyFilters>({
    searchQuery: '',
    propertyType: 'all',
    location: 'all',
    priceRange: [0, 10000000],
    bedrooms: [],
    bathrooms: [],
    furnished: [],
    amenities: [],
    carpetAreaRange: [0, 5000],
    verified: false,
    featured: false
  });

  const propertyTypes = [
    { value: 'all', label: 'All Properties', icon: Building2 },
    { value: 'buy', label: 'Buy', icon: Home },
    { value: 'lease', label: 'Lease', icon: Building },
    { value: 'commercial', label: 'Commercial', icon: Warehouse },
    { value: 'bungalow', label: 'Bungalow', icon: TreePine },
    { value: 'interior', label: 'Interior', icon: Palette }
  ];

  const locations = [
    'Kharghar', 'Vashi', 'Belapur', 'Panvel', 'Nerul', 'Airoli', 'Ghansoli', 'Kopar Khairane'
  ];

  const amenitiesList = [
    'Gym', 'Swimming Pool', 'Security', 'Power Backup', 'Lift', 'Garden', 
    'Parking', 'Air Conditioning', 'Cafeteria', 'Servant Room', 'Intercom'
  ];

  // Fetch properties from API
  const fetchProperties = async (resetData = false) => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        category: filters.propertyType.toUpperCase(),
        limit: '12',
        offset: resetData ? '0' : (currentPage * 12).toString(),
        search: filters.searchQuery,
        location: filters.location === 'all' ? '' : filters.location,
        minPrice: filters.priceRange[0].toString(),
        maxPrice: filters.priceRange[1].toString(),
        bedrooms: filters.bedrooms.join(','),
        verified: filters.verified.toString(),
        featured: filters.featured.toString()
      });

      const response = await fetch(`/api/properties?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }

      const data = await response.json();
      
      if (data.success) {
        if (resetData) {
          setProperties(data.data);
          setFilteredProperties(data.data);
          setCurrentPage(0);
        } else {
          setProperties(prev => [...prev, ...data.data]);
          setFilteredProperties(prev => [...prev, ...data.data]);
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
    }
  };

  // Initial load
  useEffect(() => {
    fetchProperties(true);
  }, [filters.propertyType, filters.searchQuery, filters.location, filters.verified, filters.featured]);

  // Filter properties locally for price range and other filters
  useEffect(() => {
    let filtered = properties;

    // Price range filter
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000000) {
      filtered = filtered.filter(property => {
        const price = parseFloat(property.price.replace(/,/g, ''));
        return price >= filters.priceRange[0] && price <= filters.priceRange[1];
      });
    }

    // Bedrooms filter
    if (filters.bedrooms.length > 0) {
      filtered = filtered.filter(property => 
        property.bedrooms && filters.bedrooms.includes(property.bedrooms.toString())
      );
    }

    // Amenities filter
    if (filters.amenities.length > 0) {
      filtered = filtered.filter(property => 
        filters.amenities.some(amenity => property.amenities.includes(amenity))
      );
    }

    setFilteredProperties(filtered);
  }, [filters.priceRange, filters.bedrooms, filters.amenities, properties]);

  const handleLike = async (propertyId: string, propertyType: string) => {
    try {
      const isLiked = likedProperties.includes(propertyId);
      
      if (!isLiked) {
        // Update analytics
        await fetch('/api/properties', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            propertyId,
            category: propertyType,
            action: 'like'
          })
        });
      }
      
      setLikedProperties(prev => 
        prev.includes(propertyId) 
          ? prev.filter(id => id !== propertyId)
          : [...prev, propertyId]
      );
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

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

  const PropertyCard = ({ property }: { property: Property }) => (
    <Card className="rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 bg-white overflow-hidden">
      <div className="relative">
        <div className="h-48 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
          <Building2 className="h-16 w-16 text-primary/30" />
        </div>
        <div className="absolute top-2 left-2 flex gap-2">
          {property.featured && (
            <Badge className="bg-orange-500 text-white">Featured</Badge>
          )}
          {property.verified && (
            <Badge className="bg-green-500 text-white">Verified</Badge>
          )}
        </div>
        <div className="absolute top-2 right-2 flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="bg-white/80 hover:bg-white"
            onClick={() => handleLike(property.id, property.type)}
          >
            <Heart className={`h-4 w-4 ${likedProperties.includes(property.id) ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="bg-white/80 hover:bg-white"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{property.title}</h3>
          <p className="text-sm text-gray-600 flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            {property.location}
          </p>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="text-2xl font-bold text-primary">
            {formatPrice(property.price, property.priceType)}
          </div>
          <div className="text-sm text-gray-500">
            {property.carpetArea} sq ft
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {property.bedrooms && (
            <div className="flex items-center text-sm text-gray-600">
              <Bed className="h-4 w-4 mr-1" />
              {property.bedrooms} Bed
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center text-sm text-gray-600">
              <Bath className="h-4 w-4 mr-1" />
              {property.bathrooms} Bath
            </div>
          )}
          {property.parking && (
            <div className="flex items-center text-sm text-gray-600">
              <Car className="h-4 w-4 mr-1" />
              {property.parking} Parking
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {property.amenities.slice(0, 3).map((amenity, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {amenity}
            </Badge>
          ))}
          {property.amenities.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{property.amenities.length - 3} more
            </Badge>
          )}
        </div>

        <div className="flex gap-2">
          <Button 
            className="flex-1" 
            onClick={() => handleEnquiry(property)}
          >
            <Phone className="h-4 w-4 mr-2" />
            Contact
          </Button>
          <Button variant="outline" className="flex-1">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Search */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Properties in Mumbai
            </h1>
            <p className="text-xl text-white/90">
              9K+ listings added daily and 68K+ total verified
            </p>
          </div>

          {/* Property Type Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1 flex flex-wrap gap-1">
              {propertyTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setFilters(prev => ({ ...prev, propertyType: type.value as any }))}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    filters.propertyType === type.value
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <type.icon className="h-4 w-4 mr-2 inline" />
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search for locality, landmark, project, or builder"
                    className="pl-10 border-0 text-gray-900 placeholder-gray-500"
                    value={filters.searchQuery}
                    onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                  />
                </div>
              </div>
              <Select value={filters.location} onValueChange={(value) => setFilters(prev => ({ ...prev, location: value }))}>
                <SelectTrigger className="w-full lg:w-48 border-0">
                  <SelectValue placeholder="Select Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map(location => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button className="bg-primary hover:bg-primary/90 px-8">
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-80 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Filters</h3>
                <Button variant="ghost" size="sm" onClick={() => setFilters({
                  searchQuery: '',
                  propertyType: 'all',
                  location: 'all',
                  priceRange: [0, 10000000],
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
                  <Slider
                    value={filters.priceRange}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value as [number, number] }))}
                    max={10000000}
                    step={100000}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <span>₹{(filters.priceRange[0] / 100000).toFixed(0)}L</span>
                    <span>₹{(filters.priceRange[1] / 100000).toFixed(0)}L</span>
                  </div>
                </div>

                <Separator />

                {/* Bedrooms */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Bedrooms</Label>
                  <div className="flex flex-wrap gap-2">
                    {['1', '2', '3', '4', '5+'].map(bedroom => (
                      <div key={bedroom} className="flex items-center space-x-2">
                        <Checkbox
                          id={`bedroom-${bedroom}`}
                          checked={filters.bedrooms.includes(bedroom)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFilters(prev => ({ ...prev, bedrooms: [...prev.bedrooms, bedroom] }));
                            } else {
                              setFilters(prev => ({ ...prev, bedrooms: prev.bedrooms.filter(b => b !== bedroom) }));
                            }
                          }}
                        />
                        <Label htmlFor={`bedroom-${bedroom}`} className="text-sm">{bedroom}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Property Features */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Property Features</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="verified"
                        checked={filters.verified}
                        onCheckedChange={(checked) => setFilters(prev => ({ ...prev, verified: !!checked }))}
                      />
                      <Label htmlFor="verified" className="text-sm">Verified Properties</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="featured"
                        checked={filters.featured}
                        onCheckedChange={(checked) => setFilters(prev => ({ ...prev, featured: !!checked }))}
                      />
                      <Label htmlFor="featured" className="text-sm">Featured Properties</Label>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Amenities */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Amenities</Label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {amenitiesList.map(amenity => (
                      <div key={amenity} className="flex items-center space-x-2">
                        <Checkbox
                          id={`amenity-${amenity}`}
                          checked={filters.amenities.includes(amenity)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFilters(prev => ({ ...prev, amenities: [...prev.amenities, amenity] }));
                            } else {
                              setFilters(prev => ({ ...prev, amenities: prev.amenities.filter(a => a !== amenity) }));
                            }
                          }}
                        />
                        <Label htmlFor={`amenity-${amenity}`} className="text-sm">{amenity}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Post Property Button */}
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Post a Property
            </Button>
          </div>

          {/* Properties Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Properties for {filters.propertyType === 'all' ? 'All Types' : propertyTypes.find(t => t.value === filters.propertyType)?.label}</h2>
                <p className="text-gray-600">
                  Showing {filteredProperties.length} of {totalProperties} properties
                </p>
              </div>
              <Select defaultValue="relevance">
                <SelectTrigger className="w-48">
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

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="flex items-center space-x-3 text-xl text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span>Loading properties...</span>
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProperties.map(property => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}

            {!loading && filteredProperties.length === 0 && (
              <div className="text-center py-12">
                <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties found</h3>
                <p className="text-gray-600">Try adjusting your filters or search criteria</p>
              </div>
            )}

            {/* Load More Button */}
            {!loading && hasMore && filteredProperties.length > 0 && (
              <div className="text-center mt-8">
                <Button 
                  onClick={loadMore} 
                  variant="outline" 
                  size="lg"
                  className="px-8"
                >
                  Load More Properties
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