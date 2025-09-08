'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Gift, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LeadCaptureModal({ isOpen, onClose }: LeadCaptureModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
    interest: '',
    budget_range: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in Name, Email, and Enquiry Details.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: 'Thank you!',
          description: "We'll be in touch with you soon with exclusive offers.",
        });
        localStorage.setItem('leadModalSeen', 'true');
        localStorage.setItem('leadModalTimestamp', Date.now().toString());
        onClose();
        // Reset form
        setFormData({
          name: '',
          phone: '',
          email: '',
          message: '',
          interest: '',
          budget_range: '',
        });
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      toast({
        title: 'Something went wrong',
        description: 'Please try again or contact us directly.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNotNow = () => {
    if (formData.email) {
      // Save partial data if email provided
      fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          name: formData.name || 'Not provided',
          interest: 'Deferred',
        }),
      }).catch(() => {});
    }
    localStorage.setItem('leadModalSeen', 'true');
    localStorage.setItem('leadModalTimestamp', Date.now().toString());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="
        max-w-md w-[95vw] max-h-[95vh] 
        p-0 gap-0 
        data-[state=open]:animate-in data-[state=closed]:animate-out 
        data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
        data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
        data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] 
        data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]
        sm:rounded-lg overflow-hidden
      ">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Gift className="h-5 w-5 text-blue-600" />
              <div>
                <DialogTitle className="text-lg font-semibold text-gray-900">
                  Premium Property Consultation!
                </DialogTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Get Expert Property Consultation + Professional Market Analysis
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[calc(95vh-140px)]">
          {/* Name and Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Your full name"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <Input
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="9930910004 / 9820274467"
                className="w-full"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="your@email.com"
              className="w-full"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enquiry Details *
            </label>
            <Textarea
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Tell us about your property requirements..."
              rows={3}
              className="w-full resize-none"
            />
          </div>

          {/* Interest */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              I&apos;m interested in
            </label>
            <Select
              value={formData.interest}
              onValueChange={(value) => handleInputChange('interest', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rcc-consultancy">RCC Consultancy</SelectItem>
                <SelectItem value="property-consultancy">Property Consultancy</SelectItem>
                <SelectItem value="interior-design">Interior Design</SelectItem>
                <SelectItem value="villa-management">Villa Management</SelectItem>
                <SelectItem value="property-management">Property Management</SelectItem>
                <SelectItem value="multiple">Multiple Services</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Budget Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Budget Range
            </label>
            <Select
              value={formData.budget_range}
              onValueChange={(value) => handleInputChange('budget_range', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select budget range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="under-5l">Under ₹5 Lakhs</SelectItem>
                <SelectItem value="5l-15l">₹5 - 15 Lakhs</SelectItem>
                <SelectItem value="15l-50l">₹15 - 50 Lakhs</SelectItem>
                <SelectItem value="50l-1cr">₹50 Lakhs - 1 Crore</SelectItem>
                <SelectItem value="above-1cr">Above ₹1 Crore</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Privacy Notice */}
          <div className="text-xs text-gray-500 text-center p-2 bg-gray-50 rounded">
            By submitting, you agree to receive updates about our services. We respect your privacy.
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="border-t bg-white p-4">
          <div className="flex space-x-3">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.name || !formData.email || !formData.message}
              className="flex-1"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Enquiry'}
            </Button>
            <Button
              variant="outline"
              onClick={handleNotNow}
              className="px-6"
            >
              Not Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
