'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  X, 
  Building2, 
  MapPin, 
  IndianRupee, 
  User, 
  Phone, 
  Mail,
  Loader2,
  CheckCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PropertyPostModalProps {
  children: React.ReactNode;
}

interface FormData {
  propertyType: string;
  listingType: string;
  title: string;
  description: string;
  location: string;
  area: string;
  price: string;
  priceType: string;
  configuration: string;
  carpetArea: string;
  builtUpArea: string;
  bedrooms: string;
  bathrooms: string;
  balconies: string;
  parking: string;
  furnished: string;
  amenities: string[];
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  additionalNotes: string;
}

const PropertyPostModal: React.FC<PropertyPostModalProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState<FormData>({
    propertyType: '',
    listingType: '',
    title: '',
    description: '',
    location: '',
    area: '',
    price: '',
    priceType: 'total',
    configuration: '',
    carpetArea: '',
    builtUpArea: '',
    bedrooms: '',
    bathrooms: '',
    balconies: '',
    parking: '',
    furnished: '',
    amenities: [],
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    additionalNotes: ''
  });

  const propertyTypes = [
    'Residential Apartment',
    'Independent House',
    'Builder Floor',
    'Penthouse',
    'Studio Apartment',
    'Commercial Office',
    'Retail Shop',
    'Warehouse',
    'Industrial Land',
    'Residential Plot'
  ];

  const listingTypes = ['Sale', 'Rent', 'Lease'];
  const configurations = ['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5+ BHK', 'Studio'];
  const furnishedOptions = ['Furnished', 'Semi-Furnished', 'Unfurnished'];
  
  const amenitiesList = [
    'Swimming Pool', 'Gym', 'Parking', 'Security', 'Power Backup',
    'Lift', 'Garden', 'Club House', 'Children Play Area', 'CCTV',
    'Intercom', 'Rain Water Harvesting', 'Waste Disposal', 'Maintenance Staff'
  ];

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      amenities: checked 
        ? [...prev.amenities, amenity]
        : prev.amenities.filter(a => a !== amenity)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = {
      propertyType: 'Property Type',
      listingType: 'Listing Type',
      title: 'Property Title',
      location: 'Location',
      price: 'Price',
      contactName: 'Contact Name',
      contactPhone: 'Contact Phone'
    };

    for (const [field, label] of Object.entries(requiredFields)) {
      if (!formData[field as keyof FormData]) {
        toast({
          title: "Validation Error",
          description: `Please fill in the ${label} field.`,
          variant: "destructive",
        });
        return;
      }
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/post-property', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        toast({
          title: "Success!",
          description: "Your property has been submitted successfully. We'll contact you soon.",
        });
        
        // Reset form after 2 seconds
        setTimeout(() => {
          setOpen(false);
          setIsSuccess(false);
          setFormData({
            propertyType: '',
            listingType: '',
            title: '',
            description: '',
            location: '',
            area: '',
            price: '',
            priceType: 'total',
            configuration: '',
            carpetArea: '',
            builtUpArea: '',
            bedrooms: '',
            bathrooms: '',
            balconies: '',
            parking: '',
            furnished: '',
            amenities: [],
            contactName: '',
            contactPhone: '',
            contactEmail: '',
            additionalNotes: ''
          });
        }, 2000);
      } else {
        throw new Error(result.error || 'Failed to submit property');
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Submission Error",
        description: "There was an issue submitting your property. Please check your internet connection and try again, or contact support if the problem persists.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent className="max-w-md mx-auto">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Property Submitted Successfully!</h3>
            <p className="text-gray-600 mb-4">
              Thank you for submitting your property. Our team will review it and contact you soon.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Post Your Property
          </DialogTitle>
          <DialogDescription>
            Fill in the details below to list your property. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Property Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Property Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="propertyType">Property Type *</Label>
                  <Select value={formData.propertyType} onValueChange={(value) => handleInputChange('propertyType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      {propertyTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="listingType">Listing Type *</Label>
                  <Select value={formData.listingType} onValueChange={(value) => handleInputChange('listingType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select listing type" />
                    </SelectTrigger>
                    <SelectContent>
                      {listingTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="title">Property Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., Spacious 2BHK Apartment in Bandra"
                />
              </div>

              <div>
                <Label htmlFor="description">Property Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your property's key features and highlights..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Location & Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location & Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="e.g., Bandra West, Andheri East, Thane"
                  />
                </div>

                <div>
                  <Label htmlFor="area">Area/Locality</Label>
                  <Input
                    id="area"
                    value={formData.area}
                    onChange={(e) => handleInputChange('area', e.target.value)}
                    placeholder="e.g., Near Metro Station"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price *</Label>
                  <div className="flex">
                    <div className="flex items-center justify-center px-3 border border-r-0 rounded-l-md bg-gray-50">
                      <IndianRupee className="h-4 w-4 text-gray-500" />
                    </div>
                    <Input
                      id="price"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="e.g., 50,00,000"
                      className="rounded-l-none"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="priceType">Price Type</Label>
                  <Select value={formData.priceType} onValueChange={(value) => handleInputChange('priceType', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="total">Total Price</SelectItem>
                      <SelectItem value="per_sqft">Per Sq Ft</SelectItem>
                      <SelectItem value="per_month">Per Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Property Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Property Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="configuration">Configuration</Label>
                  <Select value={formData.configuration} onValueChange={(value) => handleInputChange('configuration', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select BHK" />
                    </SelectTrigger>
                    <SelectContent>
                      {configurations.map((config) => (
                        <SelectItem key={config} value={config}>{config}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="carpetArea">Carpet Area (sq ft)</Label>
                  <Input
                    id="carpetArea"
                    value={formData.carpetArea}
                    onChange={(e) => handleInputChange('carpetArea', e.target.value)}
                    placeholder="e.g., 850"
                  />
                </div>

                <div>
                  <Label htmlFor="builtUpArea">Built-up Area (sq ft)</Label>
                  <Input
                    id="builtUpArea"
                    value={formData.builtUpArea}
                    onChange={(e) => handleInputChange('builtUpArea', e.target.value)}
                    placeholder="e.g., 1000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    value={formData.bedrooms}
                    onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                    placeholder="2"
                  />
                </div>

                <div>
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    value={formData.bathrooms}
                    onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                    placeholder="2"
                  />
                </div>

                <div>
                  <Label htmlFor="balconies">Balconies</Label>
                  <Input
                    id="balconies"
                    value={formData.balconies}
                    onChange={(e) => handleInputChange('balconies', e.target.value)}
                    placeholder="1"
                  />
                </div>

                <div>
                  <Label htmlFor="parking">Parking</Label>
                  <Input
                    id="parking"
                    value={formData.parking}
                    onChange={(e) => handleInputChange('parking', e.target.value)}
                    placeholder="1"
                  />
                </div>

                <div>
                  <Label htmlFor="furnished">Furnished</Label>
                  <Select value={formData.furnished} onValueChange={(value) => handleInputChange('furnished', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {furnishedOptions.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <Label>Amenities</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {amenitiesList.map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox
                        id={amenity}
                        checked={formData.amenities.includes(amenity)}
                        onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
                      />
                      <Label htmlFor={amenity} className="text-sm">{amenity}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-4 w-4" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactName">Full Name *</Label>
                  <Input
                    id="contactName"
                    value={formData.contactName}
                    onChange={(e) => handleInputChange('contactName', e.target.value)}
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <Label htmlFor="contactPhone">Phone Number *</Label>
                  <div className="flex">
                    <div className="flex items-center justify-center px-3 border border-r-0 rounded-l-md bg-gray-50">
                      <Phone className="h-4 w-4 text-gray-500" />
                    </div>
                    <Input
                      id="contactPhone"
                      value={formData.contactPhone}
                      onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                      placeholder="Your phone number"
                      className="rounded-l-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="contactEmail">Email Address</Label>
                <div className="flex">
                  <div className="flex items-center justify-center px-3 border border-r-0 rounded-l-md bg-gray-50">
                    <Mail className="h-4 w-4 text-gray-500" />
                  </div>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    placeholder="Your email address"
                    className="rounded-l-none"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="additionalNotes">Additional Notes</Label>
                <Textarea
                  id="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                  placeholder="Any additional information you'd like to share..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Property'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyPostModal;
