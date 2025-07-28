'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Building2, 
  Users, 
  Award, 
  Home, 
  ArrowRight,
  MapPin,
  Calendar,
  Ruler,
  Eye,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import Image from 'next/image';
import LeadCaptureModal from '@/components/LeadCaptureModal';

interface WorkProject {
  id: string;
  name: string;
  type: string;
  location: string;
  year: number;
  description: string;
  area: string;
  services: string[];
  status: string;
  featured: boolean;
  imageUrl: string;
  timestamp: string;
}

const stats = [
  { number: '50+', label: 'Projects Completed' },
  { number: '2.5 Lac+', label: 'Sq. Ft. Delivered' },
  { number: '100+', label: 'Happy Clients' },
  { number: '6+', label: 'Years Experience' }
];

export default function WorkPage() {
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState<WorkProject | null>(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [projects, setProjects] = useState<WorkProject[]>([]);
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Fetch work projects from Google Sheets
  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Add cache buster to force fresh data
      const cacheBuster = `?t=${Date.now()}`;
      const response = await fetch(`/api/work${cacheBuster}`, {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache',
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setProjects(data.data || []);
        setLastRefresh(new Date());
        setIsUsingFallback(data.fallback || false);
        
        // Extract unique categories from the data
        const uniqueTypes = Array.from(new Set(data.data?.map((p: WorkProject) => p.type).filter(Boolean))) as string[];
        setCategories(['All', ...uniqueTypes]);
        
        if (data.fallback) {
          setError('Google Sheets connection failed - showing sample data');
        } else {
          setError('');
        }
      } else {
        setError(data.error || 'Failed to fetch projects from Google Sheets');
        setIsUsingFallback(false);
      }
    } catch (err) {
      console.error('Fetch Error:', err);
      setError('Failed to connect to Google Sheets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  setMounted(true);
  fetchProjects();    // Auto-refresh every 5 minutes to keep data in sync
    const interval = setInterval(fetchProjects, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredProjects = selectedCategory === 'All' 
    ? projects 
    : projects.filter(project => project.type === selectedCategory);

  const handleProjectClick = (project: WorkProject) => {
    setSelectedProject(project);
    setShowProjectModal(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - extends behind navbar */}
      <section className="relative bg-black text-white -mt-[80px] lg:-mt-[88px] pt-[80px] lg:pt-[88px]">
        <div className="absolute inset-0">
            <img
                src="/hero.png"
                alt="Modern architecture"
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="min-h-[80vh] flex flex-col justify-center py-20">
              <div className="max-w-2xl space-y-8">
                <div className="space-y-4">
                  <Badge variant="secondary" className="w-fit bg-white/10 border-white/20 text-white">
                    Our Work
                  </Badge>
                  <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                    Portfolio of
                    <br />
                    <span className="text-white/90">Excellence</span>
                  </h1>
                  <p className="text-xl text-white/80 leading-relaxed">
                    Explore our portfolio of exceptional projects that showcase our commitment to quality, 
                    innovation, and client satisfaction across residential and commercial spaces.
                  </p>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl lg:text-3xl font-bold text-white mb-2">
                        {stat.number}
                      </div>
                      <div className="text-sm text-white/70">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Our Work Portfolio</h2>
            </div>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Button
                onClick={() => fetchProjects()}
                variant="outline"
                size="sm"
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Syncing...' : 'Refresh'}
              </Button>
            </div>
          </div>

          {/* Error/Warning State */}
          {error && (
            <div className={`border rounded-lg p-4 mb-8 ${isUsingFallback ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'}`}>
              <p className={`mb-2 ${isUsingFallback ? 'text-yellow-700' : 'text-red-700'}`}>
                {isUsingFallback ? '⚠️ ' : '❌ '}{error}
              </p>
              {isUsingFallback ? (
                <p className="text-sm text-yellow-600 mb-3">
                  Please check your Google Apps Script deployment settings. Showing sample data for now.
                </p>
              ) : (
                <p className="text-sm text-red-600 mb-3">
                  Please ensure your Google Sheets is properly configured and accessible.
                </p>
              )}
              <Button
                onClick={() => fetchProjects()}
                variant="outline"
                size="sm"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2 text-muted-foreground">Syncing from Google Sheets...</span>
            </div>
          )}

          {/* Category Filter */}
          {!loading && (
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className="px-6 py-2"
                >
                  {category}
                </Button>
              ))}
            </div>
          )}
                  
          {/* Projects Grid */}
          {!loading && mounted && (
            <>
              {filteredProjects.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProjects.map((project) => (
                    <Card key={project.id} className="group cursor-pointer hover:shadow-xl transition-all duration-300">
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden rounded-t-lg">
                          <Image
                            src={project.imageUrl}
                            alt={project.name}
                            width={400}
                            height={300}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/Picture1.jpg';
                            }}
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleProjectClick(project)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                          </div>
                          <Badge 
                            variant={project.status === 'Completed' ? 'default' : 'secondary'}
                            className="absolute top-4 right-4"
                          >
                            {project.status}
                          </Badge>
                          {project.featured && (
                            <Badge 
                              variant="destructive"
                              className="absolute top-4 left-4"
                            >
                              Featured
                            </Badge>
                          )}
                        </div>
                        
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline" className="text-xs">
                              {project.type}
                            </Badge>
                            <span className="text-sm text-muted-foreground">{project.year}</span>
                          </div>
                          
                          <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
                          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{project.description}</p>
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4 mr-2" />
                              {project.location}
                            </div>
                            {project.area && (
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Ruler className="h-4 w-4 mr-2" />
                                {project.area} sq ft
                              </div>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap gap-1">
                            {project.services.slice(0, 2).map((service, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {service}
                              </Badge>
                            ))}
                            {project.services.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{project.services.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Projects Found</h3>
                  <p className="text-muted-foreground mb-4">
                    {selectedCategory === 'All' 
                      ? 'No work projects found in your Google Sheets. Add some entries to your spreadsheet to see them here.' 
                      : `No projects found in the ${selectedCategory} category.`}
                  </p>
                  <Button
                    onClick={() => fetchProjects()}
                    variant="outline"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh from Sheets
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Our Process</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              How We Work
            </h2>
            <p className="text-xl text-muted-foreground">
              Our systematic approach ensures every project meets the highest standards of quality and excellence.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Consultation', description: 'Understanding your vision and requirements' },
              { step: '02', title: 'Planning', description: 'Detailed planning and design development' },
              { step: '03', title: 'Execution', description: 'Professional implementation with quality control' },
              { step: '04', title: 'Delivery', description: 'Final handover and ongoing support' }
            ].map((item, index) => (
              <Card key={index} className="text-center p-6">
                <CardContent className="p-0">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>



      {/* Project Details Modal */}
      <Dialog open={showProjectModal} onOpenChange={setShowProjectModal}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedProject?.name}</DialogTitle>
          </DialogHeader>
          
          {selectedProject && (
            <div className="space-y-6">
              <div className="relative">
                <Image
                  src={selectedProject.imageUrl}
                  alt={selectedProject.name}
                  width={600}
                  height={400}
                  className="w-full h-64 object-cover rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/Picture1.jpg';
                  }}
                />
                <Badge 
                  variant={selectedProject.status === 'Completed' ? 'default' : 'secondary'}
                  className="absolute top-4 right-4"
                >
                  {selectedProject.status}
                </Badge>
                {selectedProject.featured && (
                  <Badge 
                    variant="destructive"
                    className="absolute top-4 left-4"
                  >
                    Featured
                  </Badge>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Location</p>
                  <p className="font-semibold">{selectedProject.location}</p>
                </div>
                {selectedProject.area && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Area</p>
                    <p className="font-semibold">{selectedProject.area} sq ft</p>
                  </div>
                )}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Year</p>
                  <p className="font-semibold">{selectedProject.year}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Type</p>
                  <p className="font-semibold">{selectedProject.type}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Description</p>
                <p className="text-muted-foreground">{selectedProject.description}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Services Provided</p>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.services.map((service: string, idx: number) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end pt-4">
                <Button variant="outline" onClick={() => setShowProjectModal(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Start Your Real Estate Journey?
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/90">
            Let's discuss how we can help you find the perfect property or bring your interior design dreams to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild className="text-lg px-8">
              <Link href="/services">Our Services</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild className="text-lg px-8">
              <Link href="/work">Our Work</Link>
            </Button>
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