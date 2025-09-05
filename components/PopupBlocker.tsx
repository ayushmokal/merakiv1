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
        className="w-[94vw] max-w-sm sm:max-w-md [&>button]:hidden mx-3 sm:mx-4 p-4 sm:p-6 max-h-[70vh] max-h-[70dvh] sm:max-h-[85vh] sm:max-h-[85dvh] overflow-hidden rounded-2xl"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div className="h-full overflow-y-auto pr-1 -mr-1 overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' }}>
          <DialogHeader>
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-2">
                <Gift className="h-5 w-5 text-primary" />
                <DialogTitle className="text-base sm:text-xl leading-tight">Premium Property Consultation!</DialogTitle>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-3 sm:space-y-4">
            <div className="bg-primary/5 p-3 sm:p-3 rounded-lg">
              <p className="text-xs sm:text-sm text-center leading-tight">
                <strong>Get Expert Property Consultation</strong> +
                <strong> Professional Market Analysis</strong>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-4">
              <div>
                <Label htmlFor="popup-name" className="text-sm">Name *</Label>
                <Input
                  id="popup-name"
                  name="name"
                  autoComplete="name"
                  autoFocus
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your full name"
                  className="h-11 text-[15px] sm:h-10 sm:text-sm"
                  required
                />
              </div>

              <div>
                <Label htmlFor="popup-number" className="text-sm">Phone Number *</Label>
                <Input
                  id="popup-number"
                  name="tel"
                  type="tel"
                  inputMode="tel"
                  pattern="[+0-9()\-\s]*"
                  autoComplete="tel"
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  placeholder="9930910004 / 9820274467"
                  className="h-11 text-[15px] sm:h-10 sm:text-sm"
                  required
                />
              </div>

              <div>
                <Label htmlFor="popup-email" className="text-sm">Email *</Label>
                <Input
                  id="popup-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="merakisquarefootsllp@gmail.com"
                  className="h-11 text-[15px] sm:h-10 sm:text-sm"
                  required
                />
              </div>

              <div>
                <Label htmlFor="popup-enquiry" className="text-sm">Enquiry Details *</Label>
                <Textarea
                  id="popup-enquiry"
                  name="message"
                  value={formData.enquiry}
                  onChange={(e) => setFormData({ ...formData, enquiry: e.target.value })}
                  placeholder="Tell us about your property requirements..."
                  rows={3}
                  className="text-sm resize-none"
                  required
                />
              </div>
              <div className="flex space-x-2 pt-1">
                <Button type="submit" disabled={isSubmitting} className="flex-1 h-11 text-[15px]" aria-label="Submit enquiry">
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
              </div>
            </form>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-4 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Phone className="h-3 w-3" />
                <span>9930910004 / 9820274467</span>
              </div>
              <div className="flex items-center space-x-1">
                <Mail className="h-3 w-3" />
                <span>merakisquarefootsllp@gmail.com</span>
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground text-center leading-snug px-2">
              By submitting, you agree to receive updates about our services.
              We respect your privacy and never spam.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 
