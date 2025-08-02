'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Building2, 
  Calendar, 
  MapPin, 
  ArrowLeft, 
  Users, 
  Clock, 
  Target,
  CheckCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface ProjectDetail {
  id: string;
  title: string;
  description: string;
  location: string;
  status: 'completed' | 'upcoming';
  category: string;
  images: string[];
  videos: string[]; // Add support for video URLs
  completion_date: string;
  budget_range: string;
  area: string;
  slug: string;
  client: string;
  duration: string;
  team_size: number;
  features: string[];
  challenges: string[];
  solutions: string[];
  technologies: string[];
}

// Mock data - replace with actual API call
const mockProjectDetails: { [key: string]: ProjectDetail } = {
  'luxury-villa-complex': {
    id: '1',
    title: 'Luxury Villa Complex',
    description: 'A stunning luxury villa complex that combines modern architectural excellence with sustainable design principles. This project showcases our commitment to creating spaces that are both aesthetically pleasing and environmentally responsible.',
    location: 'Bandra, Mumbai',
    status: 'completed',
    category: 'Residential',
    images: [
      '/IMG-20250611-WA0041.jpg',
      '/IMG-20250611-WA0041.jpg',
      '/IMG-20250611-WA0041.jpg',
      '/IMG-20250611-WA0041.jpg'
    ],
    completion_date: '2024-03-15',
    budget_range: '₹2-5 Crores',
    area: '3500 sq ft',
    slug: 'luxury-villa-complex',
    client: 'Private Developer',
    duration: '18 months',
    team_size: 12,
    features: [
      'Smart home automation system',
      'Solar panel integration',
      'Rainwater harvesting',
      'Private swimming pool',
      'Landscaped gardens',
      'Underground parking',
      'Security systems',
      'Energy-efficient lighting'
    ],
    challenges: [
      'Complex terrain with elevation changes',
      'Strict local building regulations',
      'Integration of sustainable technologies',
      'Maintaining luxury aesthetics with eco-friendly materials'
    ],
    solutions: [
      'Innovative foundation design to work with natural terrain',
      'Close collaboration with local authorities for compliance',
      'Custom integration of green technologies',
      'Sourcing premium sustainable materials'
    ],
    technologies: [
      'BIM (Building Information Modeling)',
      'Smart home IoT systems',
      'Solar energy systems',
      'Rainwater management systems',
      'Energy-efficient HVAC'
    ]
  },
  'commercial-plaza': {
    id: '2',
    title: 'Commercial Plaza',
    description: 'A state-of-the-art commercial complex designed to meet the evolving needs of modern businesses. This project features flexible office spaces, retail outlets, and premium amenities.',
    location: 'Andheri, Mumbai',
    status: 'completed',
    category: 'Commercial',
    images: [
      '/IMG-20250611-WA0041.jpg',
      '/IMG-20250611-WA0041.jpg',
      '/IMG-20250611-WA0041.jpg'
    ],
    completion_date: '2023-11-20',
    budget_range: '₹10-15 Crores',
    area: '25000 sq ft',
    slug: 'commercial-plaza',
    client: 'Corporate Group',
    duration: '24 months',
    team_size: 20,
    features: [
      'Flexible office layouts',
      'High-speed elevators',
      'Central air conditioning',
      'Retail spaces on ground floor',
      'Conference facilities',
      'Cafeteria and food court',
      'Ample parking space',
      'Fire safety systems'
    ],
    challenges: [
      'High-density urban location',
      'Traffic management during construction',
      'Meeting diverse tenant requirements',
      'Optimizing space utilization'
    ],
    solutions: [
      'Vertical construction approach',
      'Coordinated construction scheduling',
      'Modular design for flexibility',
      'Efficient space planning techniques'
    ],
    technologies: [
      'Advanced structural engineering',
      'Building management systems',
      'High-efficiency HVAC',
      'Smart security systems',
      'Energy management systems'
    ]
  }
};

export default function ProjectDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load project details (replace with actual API call)
    setTimeout(() => {
      const projectData = mockProjectDetails[slug];
      setProject(projectData || null);
      setLoading(false);
    }, 500);
  }, [slug]);

  const nextImage = () => {
    if (project) {
      setCurrentImageIndex((prev) => (prev + 1) % project.images.length);
    }
  };

  const prevImage = () => {
    if (project) {
      setCurrentImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-96 bg-muted rounded-lg"></div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div className="h-6 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
              </div>
              <div className="space-y-4">
                <div className="h-6 bg-muted rounded w-1/2"></div>
                <div className="h-32 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
            <p className="text-muted-foreground mb-6">The project you're looking for doesn't exist.</p>
            <Button asChild>
              <Link href="/projects">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Projects
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background -mt-[80px] lg:-mt-[88px] pt-[80px] lg:pt-[88px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/projects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Link>
        </Button>

        {/* Project Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Badge variant={project.status === 'completed' ? 'default' : 'secondary'}>
              {project.status === 'completed' ? 'Completed' : 'Upcoming'}
            </Badge>
            <Badge variant="outline">{project.category}</Badge>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">{project.title}</h1>
          <p className="text-xl text-muted-foreground">{project.description}</p>
        </div>

        {/* Image Carousel */}
        <div className="relative mb-12">
          <div className="aspect-[16/9] overflow-hidden rounded-2xl">
            <img 
              src={project.images[currentImageIndex]} 
              alt={`${project.title} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
          
          {project.images.length > 1 && (
            <>
              <Button
                variant="secondary"
                size="icon"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white"
                onClick={prevImage}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white"
                onClick={nextImage}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {project.images.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Project Details Grid */}
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Overview */}
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-6">Project Overview</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-muted-foreground">{project.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Completion Date</p>
                      <p className="text-muted-foreground">
                        {new Date(project.completion_date).toLocaleDateString('en-IN', { 
                          year: 'numeric', 
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Building2 className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Total Area</p>
                      <p className="text-muted-foreground">{project.area}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Team Size</p>
                      <p className="text-muted-foreground">{project.team_size} professionals</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Duration</p>
                      <p className="text-muted-foreground">{project.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Target className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Budget Range</p>
                      <p className="text-muted-foreground">{project.budget_range}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Features */}
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-6">Key Features</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {project.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Challenges & Solutions */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Challenges</h3>
                  <ul className="space-y-3">
                    {project.challenges.map((challenge, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm">{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Solutions</h3>
                  <ul className="space-y-3">
                    {project.solutions.map((solution, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm">{solution}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Technologies Used */}
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-6">Technologies & Methods</h2>
                <div className="flex flex-wrap gap-3">
                  {project.technologies.map((tech, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Info Card */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Project Information</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Client</p>
                    <p className="font-medium">{project.client}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Category</p>
                    <p className="font-medium">{project.category}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <Badge variant={project.status === 'completed' ? 'default' : 'secondary'}>
                      {project.status === 'completed' ? 'Completed' : 'Upcoming'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA Card */}
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-semibold mb-3">Interested in Similar Project?</h3>
                <p className="mb-4 text-primary-foreground/90">
                  Let's discuss how we can create something amazing for you.
                </p>
                <Button variant="secondary" asChild className="w-full">
                  <Link href="/services">Our Services</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Share Card */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3">Share This Project</h3>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Share
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Save
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Projects CTA */}
        <div className="mt-16 text-center p-8 bg-slate-50 rounded-2xl">
          <h3 className="text-2xl font-semibold mb-4">Explore More Projects</h3>
          <p className="text-muted-foreground mb-6">
            Discover our complete portfolio of architectural and property development projects.
          </p>
          <Button size="lg" asChild>
            <Link href="/projects">View All Projects</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}