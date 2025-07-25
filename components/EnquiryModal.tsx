import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface Project {
  srNo: number;
  configuration: string;
  carpetSize: number;
  builtUp: number;
  node: string;
  price: string;
}

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

export default function EnquiryModal({ isOpen, onClose, project }: EnquiryModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Prepare the data to be sent
    const enquiryData = {
      ...formData,
      projectSrNo: project.srNo,
      projectConfiguration: project.configuration,
      projectCarpetSize: project.carpetSize,
      projectBuiltUp: project.builtUp,
      projectNode: project.node,
      projectPrice: project.price,
      enquiryDate: new Date().toISOString()
    };

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(enquiryData),
      });

      const result = await response.json();

      if (response.ok && result.status === 'success') {
        alert('✅ Thank you for your enquiry! We will contact you within 24 hours.');
        onClose();
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        throw new Error(result.error || result.message || 'Failed to submit enquiry');
      }
    } catch (error) {
      console.error('Enquiry submission error:', error);
      alert('❌ Sorry, there was an error submitting your enquiry. Please try again or contact us directly at 9930910004 / 9820274467.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enquire About This Property</DialogTitle>
          <DialogDescription>
            Fill out the form below and we'll get back to you shortly.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Your full name"
            />
          </div>

          <div className="grid w-full gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Your email address"
            />
          </div>

          <div className="grid w-full gap-1.5">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Your phone number"
            />
          </div>

          <div className="grid w-full gap-1.5">
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Any specific questions or requirements?"
              className="h-24"
            />
          </div>

          {/* Project Details Summary */}
          <div className="bg-muted p-3 rounded-lg text-sm">
            <h4 className="font-medium mb-2">Property Details</h4>
            <div className="grid grid-cols-2 gap-2 text-muted-foreground">
              <span>Configuration:</span>
              <span className="font-medium">{project.configuration}</span>
              <span>Carpet Size:</span>
              <span className="font-medium">{project.carpetSize}</span>
              <span>Built Up:</span>
              <span className="font-medium">{project.builtUp}</span>
              <span>Node:</span>
              <span className="font-medium">{project.node}</span>
              <span>Price:</span>
              <span className="font-medium">₹{project.price}</span>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              'Submit Enquiry'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
} 