'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send,
  MessageSquare
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    budget_range: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Required fields missing",
        description: "Please fill in all required fields.",
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
        body: JSON.stringify({
          ...formData,
          interest: formData.service || 'General Inquiry'
        }),
      });

      if (response.ok) {
        toast({
          title: "Message sent successfully!",
          description: "We'll get back to you within 24 hours.",
        });
        
        setFormData({
          name: '',
          email: '',
          phone: '',
          service: '',
          budget_range: '',
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

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-primary">ArchProp</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-foreground hover:text-primary transition-colors">Home</Link>
              <Link href="/projects" className="text-foreground hover:text-primary transition-colors">Projects</Link>
              <Link href="/services" className="text-foreground hover:text-primary transition-colors">Services</Link>
              <Link href="/contact" className="text-primary font-medium">Contact</Link>
            </div>
            <Button asChild>
              <Link href="/contact">Get Quote</Link>
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Get In Touch</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ready to start your project? We'd love to hear from you. 
            Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl">
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <MessageSquare className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-semibold">Send us a message</h2>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
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

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div>
                      <Label htmlFor="service">Service Interested In</Label>
                      <Select value={formData.service} onValueChange={(value) => setFormData({ ...formData, service: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rcc-consultancy">RCC Consultancy</SelectItem>
                          <SelectItem value="property-consultancy">Property Consultancy</SelectItem>
                          <SelectItem value="interior-design">Interior Design</SelectItem>
                          <SelectItem value="villa-management">Villa Management</SelectItem>
                          <SelectItem value="property-management">Property Management</SelectItem>
                          <SelectItem value="multiple">Multiple Services</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="budget">Budget Range</Label>
                    <Select value={formData.budget_range} onValueChange={(value) => setFormData({ ...formData, budget_range: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your budget range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under-5l">Under ₹5 Lakhs</SelectItem>
                        <SelectItem value="5l-15l">₹5 - 15 Lakhs</SelectItem>
                        <SelectItem value="15l-50l">₹15 - 50 Lakhs</SelectItem>
                        <SelectItem value="50l-1cr">₹50 Lakhs - 1 Crore</SelectItem>
                        <SelectItem value="above-1cr">Above ₹1 Crore</SelectItem>
                        <SelectItem value="discuss">Prefer to discuss</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about your project requirements, timeline, and any specific needs..."
                      rows={5}
                      required
                    />
                  </div>

                  <Button type="submit" disabled={isSubmitting} size="lg" className="w-full">
                    {isSubmitting ? 'Sending...' : (
                      <>
                        Send Message <Send className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Details */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-6">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-muted-foreground">+91 98765 43210</p>
                      <p className="text-sm text-muted-foreground">Mon-Sat 9AM-7PM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-muted-foreground">info@archprop.com</p>
                      <p className="text-sm text-muted-foreground">24/7 Support</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Office</p>
                      <p className="text-muted-foreground">Mumbai, Maharashtra</p>
                      <p className="text-sm text-muted-foreground">By Appointment</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Business Hours</p>
                      <p className="text-muted-foreground">Mon-Fri: 9AM-7PM</p>
                      <p className="text-muted-foreground">Sat: 10AM-5PM</p>
                      <p className="text-muted-foreground">Sun: Closed</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* WhatsApp Contact */}
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-green-800">Quick Connect</h3>
                <p className="text-green-700 mb-4">
                  Need immediate assistance? Connect with us on WhatsApp for instant support.
                </p>
                <Button 
                  asChild 
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <a 
                    href="https://wa.me/919876543210?text=Hi%2C%20I%27m%20interested%20in%20your%20services" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Chat on WhatsApp
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Map */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Find Us</h3>
                <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Interactive Map</p>
                    <p className="text-sm text-muted-foreground">Mumbai, Maharashtra</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4" asChild>
                  <a 
                    href="https://maps.google.com/?q=Mumbai,Maharashtra" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    View on Google Maps
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold mb-6 text-center">Frequently Asked Questions</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold mb-2">How quickly do you respond to inquiries?</h4>
                  <p className="text-muted-foreground text-sm mb-4">
                    We typically respond to all inquiries within 24 hours during business days. 
                    For urgent matters, please call us directly.
                  </p>
                  
                  <h4 className="font-semibold mb-2">Do you provide free consultations?</h4>
                  <p className="text-muted-foreground text-sm mb-4">
                    Yes, we offer free initial consultations to understand your requirements 
                    and provide preliminary guidance.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">What areas do you serve?</h4>
                  <p className="text-muted-foreground text-sm mb-4">
                    We primarily serve Mumbai and surrounding areas, but we also take on 
                    select projects across Maharashtra.
                  </p>
                  
                  <h4 className="font-semibold mb-2">Can you work with my existing architect?</h4>
                  <p className="text-muted-foreground text-sm">
                    Absolutely! We collaborate with architects, contractors, and other 
                    professionals to ensure project success.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}