'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Gift, Phone, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function PopupBlocker() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });

  useEffect(() => {
    // Check if user has already seen the popup in this session
    const hasSeenPopup = sessionStorage.getItem('popupBlockerSeen');
    
    if (!hasSeenPopup) {
      // Show popup after a small delay for better UX
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your full name.",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.phone.trim()) {
      toast({
        title: "Phone number required",
        description: "Please enter your phone number.",
        variant: "destructive"
      });
      return false;
    }

    // Validate phone number format
    const phoneRegex = /^\+?[\d\s\-()\/]+$/;
    if (!phoneRegex.test(formData.phone)) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid phone number.",
        variant: "destructive"
      });
      return false;
    }

    // Check minimum digits
    const numbersOnly = formData.phone.replace(/\D/g, '');
    if (numbersOnly.length < 10) {
      toast({
        title: "Phone number too short",
        description: "Phone number should contain at least 10 digits.",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive"
      });
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.message.trim()) {
      toast({
        title: "Enquiry details required",
        description: "Please tell us about your property requirements.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Submit to our API endpoint
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          message: formData.message,
          source: 'Popup Blocker',
          interest: 'General Enquiry',
          budget_range: '',
        }),
      });

      if (response.ok) {
        toast({
          title: "Thank you!",
          description: "We'll contact you soon with exclusive offers!",
        });
        
        // Mark as seen for this session
        sessionStorage.setItem('popupBlockerSeen', 'true');
        setIsOpen(false);
        
        // Reset form
        setFormData({
          name: '',
          phone: '',
          email: '',
          message: ''
        });
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again or contact us directly.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Only allow closing after form submission
    // Remove this function since we don't want users to close manually
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}} modal={true}>
      <DialogContent 
        className="
          w-[90vw] max-w-sm max-h-[85vh] 
          p-0 gap-0 
          data-[state=open]:animate-in data-[state=closed]:animate-out 
          data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
          data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
          rounded-xl overflow-hidden
          [&>button]:!hidden [&_button[data-dialog-close]]:!hidden
          flex flex-col
          !fixed !top-1/2 !left-1/2 !transform !-translate-x-1/2 !-translate-y-1/2
          sm:max-w-md
        "
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 border-b flex-shrink-0">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <Gift className="h-4 w-4 text-green-600" />
              <div className="text-center">
                <DialogTitle className="text-base font-semibold text-gray-900 leading-tight">
                  Premium Property Consultation!
                </DialogTitle>
                <p className="text-xs text-gray-600 mt-1 leading-tight">
                  Get Expert Property Consultation + Professional Market Analysis
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0 max-h-[calc(85vh-140px)]">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <Input
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Your full name"
              className="w-full h-10 text-sm"
              autoFocus
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <Input
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="9930910004 / 9820274467"
              className="w-full h-10 text-sm"
              inputMode="tel"
              required
            />
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
              className="w-full h-10 text-sm"
              required
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
              rows={2}
              className="w-full resize-none text-sm min-h-[50px]"
              required
            />
          </div>

          {/* Contact Info */}
          <div className="flex flex-col items-center justify-center space-y-1 text-xs text-gray-600 bg-gray-50 p-2 rounded-lg">
            <div className="flex items-center space-x-1">
              <Phone className="h-3 w-3" />
              <span>9930910004 / 9820274467</span>
            </div>
            <div className="flex items-center space-x-1">
              <Mail className="h-3 w-3" />
              <span>merakisquarefootsllp@gmail.com</span>
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="text-xs text-gray-500 text-center p-2 bg-gray-50 rounded">
            By submitting, you agree to receive updates about our services. We respect your privacy and never spam.
          </div>
        </div>

        {/* Footer Button */}
        <div className="border-t bg-white p-3 flex-shrink-0 sticky bottom-0">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.name.trim() || !formData.phone.trim() || !formData.email.trim() || !formData.message.trim()}
            className="w-full h-11 text-sm bg-green-600 hover:bg-green-700 font-semibold shadow-lg"
            size="lg"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Enquiry'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 
