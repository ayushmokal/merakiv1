'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Building2, 
  Users, 
  Award, 
  Home, 
  FileText, 
  CheckCircle, 
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Star
} from 'lucide-react';
import LeadCaptureModal from '@/components/LeadCaptureModal';
import { useToast } from '@/hooks/use-toast';

const services = [
  {
    id: 'rcc-consultancy',
    title: 'RCC Consultancy',
    description: 'Expert structural engineering and RCC design solutions for residential and commercial projects with focus on safety, durability, and cost-effectiveness.',
    icon: Building2,
    features: [
      'Structural Analysis & Design',
      'Foundation Engineering',
      'Seismic Assessment',
      'Quality Control & Testing',
      'Construction Supervision',
      'Structural Audit',
      'Retrofitting Solutions',
      'Code Compliance'
    ],
    benefits: [
      'Enhanced structural safety',
      'Cost-effective solutions',
      'Regulatory compliance',
      'Long-term durability'
    ],
    process: [
      'Site Assessment',
      'Structural Analysis',
      'Design Development',
      'Documentation',
      'Construction Support'
    ],
    pricing: 'Starting from ₹50,000',
    duration: '2-8 weeks'
  },
  {
    id: 'property-consultancy',
    title: 'Property Consultancy',
    description: 'Comprehensive property advisory services from market analysis to investment guidance, helping you make informed real estate decisions.',
    icon: Users,
    features: [
      'Market Analysis & Research',
      'Investment Advisory',
      'Due Diligence Services',
      'Property Valuation',
      'Legal Documentation',
      'Negotiation Support',
      'Portfolio Management',
      'Exit Strategy Planning'
    ],
    benefits: [
      'Informed investment decisions',
      'Risk mitigation',
      'Maximum ROI',
      'Expert market insights'
    ],
    process: [
      'Requirement Analysis',
      'Market Research',
      'Property Evaluation',
      'Advisory Report',
      'Implementation Support'
    ],
    pricing: 'Starting from ₹25,000',
    duration: '1-4 weeks'
  },
  {
    id: 'interior-designing',
    title: 'Interior Designing',
    description: 'Transform your spaces with innovative and functional interior design solutions that reflect your personality and lifestyle.',
    icon: Award,
    features: [
      'Space Planning & Layout',
      '3D Visualization',
      'Custom Furniture Design',
      'Lighting Design',
      'Color Consultation',
      'Material Selection',
      'Project Management',
      'Styling & Accessories'
    ],
    benefits: [
      'Optimized space utilization',
      'Enhanced aesthetics',
      'Increased property value',
      'Personalized design'
    ],
    process: [
      'Consultation & Brief',
      'Concept Development',
      '3D Visualization',
      'Design Finalization',
      'Implementation'
    ],
    pricing: 'Starting from ₹1,50,000',
    duration: '4-12 weeks'
  },
  {
    id: 'villa-management',
    title: 'Villa Management',
    description: 'Complete villa management services ensuring your property is well-maintained, secure, and generating optimal returns.',
    icon: Home,
    features: [
      'Property Maintenance',
      'Security Management',
      'Tenant Management',
      'Rental Optimization',
      'Financial Reporting',
      'Emergency Response',
      'Vendor Coordination',
      'Regular Inspections'
    ],
    benefits: [
      'Hassle-free ownership',
      'Maximized rental income',
      'Property value preservation',
      'Peace of mind'
    ],
    process: [
      'Property Assessment',
      'Management Plan',
      'Service Implementation',
      'Regular Monitoring',
      'Performance Review'
    ],
    pricing: '3-5% of rental income',
    duration: 'Ongoing service'
  },
  {
    id: 'property-management',
    title: 'Property Management & Registration',
    description: 'End-to-end property management and registration services ensuring legal compliance and smooth property transactions.',
    icon: FileText,
    features: [
      'Property Registration',
      'Legal Documentation',
      'Title Verification',
      'NOC Procurement',
      'Compliance Management',
      'Tax Advisory',
      'Dispute Resolution',
      'Record Maintenance'
    ],
    benefits: [
      'Legal compliance',
      'Smooth transactions',
      'Risk mitigation',
      'Expert guidance'
    ],
    process: [
      'Document Review',
      'Legal Verification',
      'Registration Process',
      'Compliance Check',
      'Handover'
    ],
    pricing: 'Starting from ₹15,000',
    duration: '2-6 weeks'
  }
];

const testimonials = [
  {
    name: 'Rajesh Kumar',
    role: 'Property Developer',
    service: 'RCC Consultancy',
    content: 'Their structural engineering expertise saved us significant costs while ensuring top-notch safety standards.',
    rating: 5
  },
  {
    name: 'Priya Sharma',
    role: 'Homeowner',
    service: 'Interior Design',
    content: 'Transformed our home beautifully. The 3D visualization helped us see the final result before implementation.',
    rating: 5
  },
  {
    name: 'Amit Patel',
    role: 'Investor',
    service: 'Property Consultancy',
    content: 'Excellent market insights and advisory. Their guidance helped me make profitable investment decisions.',
    rating: 5
  }
];

export default function ServicesPage() {
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [selectedService, setSelectedService] = useState<string>('');
  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
    budget_range: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user should see lead modal
    const hasSeenModal = localStorage.getItem('leadModalSeen');
    const modalTimestamp = localStorage.getItem('leadModalTimestamp');
    
    if (!hasSeenModal || (modalTimestamp && Date.now() - parseInt(modalTimestamp) > 30 * 24 * 60 * 60 * 1000)) {
      const timer = setTimeout(() => {
        setShowLeadModal(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleEnquiry = (serviceId: string) => {
    setSelectedService(serviceId);
    setEnquiryForm(prev => ({ ...prev, service: serviceId }));
  };

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!enquiryForm.name || !enquiryForm.email || !enquiryForm.service) {
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
          ...enquiryForm,
          interest: enquiryForm.service,
          name: enquiryForm.name,
          email: enquiryForm.email,
          phone: enquiryForm.phone,
          message: enquiryForm.message,
          budget_range: enquiryForm.budget_range
        }),
      });

      if (response.ok) {
        toast({
          title: "Enquiry submitted!",
          description: "We'll get back to you within 24 hours.",
        });
        
        setEnquiryForm({
          name: '',
          email: '',
          phone: '',
          service: '',
          message: '',
          budget_range: ''
        });
        setSelectedService('');
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

  const scrollToService = (serviceId: string) => {
    const element = document.getElementById(serviceId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
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
              <Link href="/services" className="text-primary font-medium">Services</Link>
              <Link href="/contact" className="text-foreground hover:text-primary transition-colors">Contact</Link>
            </div>
            <Button asChild>
              <Link href="/contact">Get Quote</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="secondary" className="mb-4">Our Services</Badge>
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            Comprehensive Property Solutions
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            From architectural design to property management, we provide end-to-end services 
            that transform your vision into exceptional reality.
          </p>
          
          {/* Service Navigation */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {services.map((service) => (
              <Button
                key={service.id}
                variant="outline"
                onClick={() => scrollToService(service.id)}
                className="hover:bg-primary hover:text-primary-foreground"
              >
                {service.title}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Services Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {services.map((service, index) => (
          <section key={service.id} id={service.id} className="mb-20">
            <div className={`grid lg:grid-cols-2 gap-12 items-center ${
              index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
            }`}>
              {/* Content */}
              <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <service.icon className="h-6 w-6 text-primary" />
                  </div>
                  <Badge variant="secondary">{service.title}</Badge>
                </div>
                
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">{service.title}</h2>
                <p className="text-lg text-muted-foreground mb-6">{service.description}</p>
                
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h4 className="font-semibold mb-3">Key Features</h4>
                    <ul className="space-y-2">
                      {service.features.slice(0, 4).map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Benefits</h4>
                    <ul className="space-y-2">
                      {service.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-center text-sm">
                          <div className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="lg" onClick={() => handleEnquiry(service.id)}>
                        Enquire Now <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Enquire about {service.title}</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleEnquirySubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="name">Name *</Label>
                            <Input
                              id="name"
                              value={enquiryForm.name}
                              onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                              placeholder="Your name"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">Email *</Label>
                            <Input
                              id="email"
                              type="email"
                              value={enquiryForm.email}
                              onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                              placeholder="your@email.com"
                              required
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            value={enquiryForm.phone}
                            onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                            placeholder="+91 98765 43210"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="budget">Budget Range</Label>
                          <Select value={enquiryForm.budget_range} onValueChange={(value) => setEnquiryForm({ ...enquiryForm, budget_range: value })}>
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
                        
                        <div>
                          <Label htmlFor="message">Message</Label>
                          <Textarea
                            id="message"
                            value={enquiryForm.message}
                            onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                            placeholder="Tell us about your requirements..."
                            rows={3}
                          />
                        </div>
                        
                        <Button type="submit" disabled={isSubmitting} className="w-full">
                          {isSubmitting ? 'Submitting...' : 'Submit Enquiry'}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                  
                  <Button variant="outline" size="lg">
                    Learn More
                  </Button>
                </div>
              </div>
              
              {/* Service Details Card */}
              <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                <Card className="shadow-xl">
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold mb-3">Our Process</h4>
                        <div className="space-y-3">
                          {service.process.map((step, idx) => (
                            <div key={idx} className="flex items-center space-x-3">
                              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs font-medium text-primary">
                                {idx + 1}
                              </div>
                              <span className="text-sm">{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Starting Price</p>
                          <p className="font-semibold text-primary">{service.pricing}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Timeline</p>
                          <p className="font-semibold">{service.duration}</p>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <h5 className="font-medium mb-2">All Features Include:</h5>
                        <div className="grid grid-cols-1 gap-1">
                          {service.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center text-xs">
                              <CheckCircle className="h-3 w-3 text-green-600 mr-2 flex-shrink-0" />
                              {feature}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Testimonials */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Client Testimonials</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              What Our Clients Say
            </h2>
            <p className="text-xl text-muted-foreground">
              Real feedback from clients who have experienced our services.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.content}"</p>
                  <div className="mb-2">
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {testimonial.service}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/90">
            Let's discuss your project requirements and create something exceptional together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild className="text-lg px-8">
              <Link href="/contact">Get Free Consultation</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Link href="/projects">View Our Work</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Phone className="h-8 w-8 mb-4 text-blue-400" />
              <h3 className="text-lg font-semibold mb-2">Call Us</h3>
              <p className="text-slate-300">+91 98765 43210</p>
              <p className="text-slate-300">Mon-Sat 9AM-7PM</p>
            </div>
            <div className="flex flex-col items-center">
              <Mail className="h-8 w-8 mb-4 text-blue-400" />
              <h3 className="text-lg font-semibold mb-2">Email Us</h3>
              <p className="text-slate-300">info@archprop.com</p>
              <p className="text-slate-300">24/7 Support</p>
            </div>
            <div className="flex flex-col items-center">
              <MapPin className="h-8 w-8 mb-4 text-blue-400" />
              <h3 className="text-lg font-semibold mb-2">Visit Us</h3>
              <p className="text-slate-300">Mumbai, Maharashtra</p>
              <p className="text-slate-300">By Appointment</p>
            </div>
          </div>
        </div>
      </section>

      <LeadCaptureModal 
        isOpen={showLeadModal} 
        onClose={() => setShowLeadModal(false)} 
      />
    </div>
  );
}