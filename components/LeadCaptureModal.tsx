'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Gift } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LeadCaptureModal({ isOpen, onClose }: LeadCaptureModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interest: '',
    budget_range: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast({
        title: "Required fields missing",
        description: "Please fill in your name and email address.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Thank you!",
          description: "We'll be in touch with you soon with exclusive offers.",
        });
        
        // Set localStorage to prevent showing modal again for 30 days
        localStorage.setItem('leadModalSeen', 'true');
        localStorage.setItem('leadModalTimestamp', Date.now().toString());
        
        onClose();
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

  const handleNotNow = () => {
    // Still capture email if provided
    if (formData.email) {
      fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          name: formData.name || 'Not provided',
          interest: 'Deferred'
        }),
      }).catch(() => {});
    }
    
    localStorage.setItem('leadModalSeen', 'true');
    localStorage.setItem('leadModalTimestamp', Date.now().toString());
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Gift className="h-6 w-6 text-primary" />
              <DialogTitle className="text-xl">Exclusive Offer!</DialogTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNotNow}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-primary/5 p-4 rounded-lg">
            <p className="text-sm text-center">
              <strong>Get 15% off</strong> your first project consultation + 
              <strong> Free 3D visualization</strong> worth ₹25,000!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
              />
            </div>

            <div>
              <Label htmlFor="interest">I'm interested in</Label>
              <Select value={formData.interest} onValueChange={(value) => setFormData({ ...formData, interest: value })}>
                <SelectTrigger>
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

            <div>
              <Label htmlFor="budget">Budget Range</Label>
              <Select value={formData.budget_range} onValueChange={(value) => setFormData({ ...formData, budget_range: value })}>
                <SelectTrigger>
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

            <div className="flex space-x-3 pt-2">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? 'Submitting...' : 'Claim Offer'}
              </Button>
              <Button type="button" variant="outline" onClick={handleNotNow}>
                Not Now
              </Button>
            </div>
          </form>

          <p className="text-xs text-muted-foreground text-center">
            By submitting, you agree to receive updates about our services. 
            We respect your privacy.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}