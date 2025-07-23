'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Gift, Phone, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function PopupBlocker() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    email: '',
    enquiry: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user has already seen the popup in this session
    const hasSeenPopup = sessionStorage.getItem('popupBlockerSeen');
    
    if (!hasSeenPopup) {
      setIsOpen(true); // Instant popup
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.number || !formData.email || !formData.enquiry) {
      toast({
        title: "Required fields missing",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Validate phone number (basic validation for numbers only)
    const phoneRegex = /^\+?[\d\s\-()]+$/;
    if (!phoneRegex.test(formData.number)) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid phone number with only numbers, spaces, hyphens, or brackets.",
        variant: "destructive"
      });
      return;
    }

    // Validate phone number length (should be at least 10 digits)
    const numbersOnly = formData.number.replace(/\D/g, '');
    if (numbersOnly.length < 10) {
      toast({
        title: "Invalid phone number",
        description: "Phone number should contain at least 10 digits.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

        try {
      // Use FormData to avoid CORS issues
      const formData_encoded = new FormData();
      formData_encoded.append('name', formData.name);
      formData_encoded.append('phone', formData.number);
      formData_encoded.append('email', formData.email || '');
      formData_encoded.append('message', formData.enquiry || '');
      formData_encoded.append('source', 'Popup Blocker');

      // Submit using no-cors mode to bypass CORS restrictions
      await fetch('https://script.google.com/macros/s/AKfycby6OC0ZsBp6Bl7DzFwPBzpXwHyZXAa6R2NBzoHeNO0qf_wqzl_BJOkmE1BBLfgIxIPs/exec', {
        method: 'POST',
        mode: 'no-cors',
        body: formData_encoded,
      });

      // Since we're using no-cors, we can't check the response, so we assume success
      toast({
        title: "Thank you!",
        description: "We'll contact you soon with exclusive offers!",
      });
      
      // Mark as seen for this session
      sessionStorage.setItem('popupBlockerSeen', 'true');
      setIsOpen(false);
      
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
    sessionStorage.setItem('popupBlockerSeen', 'true');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}} modal={true}>
      <DialogContent 
        className="sm:max-w-md [&>button]:hidden" 
        onInteractOutside={(e) => e.preventDefault()} 
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <Gift className="h-6 w-6 text-primary" />
              <DialogTitle className="text-xl">Premium Property Consultation!</DialogTitle>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-primary/5 p-4 rounded-lg">
            <p className="text-sm text-center">
              <strong>Get Expert Property Consultation</strong> + 
              <strong> Professional Market Analysis</strong>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="popup-name">Name *</Label>
              <Input
                id="popup-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your full name"
                required
              />
            </div>

            <div>
              <Label htmlFor="popup-number">Phone Number *</Label>
              <Input
                id="popup-number"
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                placeholder="+91 98765 43210"
                required
              />
            </div>

            <div>
              <Label htmlFor="popup-email">Email *</Label>
              <Input
                id="popup-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="popup-enquiry">Enquiry Details *</Label>
              <Textarea
                id="popup-enquiry"
                value={formData.enquiry}
                onChange={(e) => setFormData({ ...formData, enquiry: e.target.value })}
                placeholder="Tell us about your property requirements..."
                rows={3}
                required
              />
            </div>

            <div className="flex space-x-2">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </form>

          <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Phone className="h-3 w-3" />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center space-x-1">
              <Mail className="h-3 w-3" />
              <span>info@merakisquarefoots.com</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            By submitting, you agree to receive updates about our services. 
            We respect your privacy and never spam.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
} 