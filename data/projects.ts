export interface ProjectDetail {
  id: string;
  title: string;
  description: string;
  location: string;
  status: 'completed' | 'upcoming';
  category: string;
  images: string[];
  videos: string[];
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

export const PROJECT_DETAILS: Record<string, ProjectDetail> = {
  'luxury-villa-complex': {
    id: '1',
    title: 'Luxury Villa Complex',
    description:
      'A stunning luxury villa complex that combines modern architectural excellence with sustainable design principles. This project showcases our commitment to creating spaces that are both aesthetically pleasing and environmentally responsible.',
    location: 'Bandra, Mumbai',
    status: 'completed',
    category: 'Residential',
    images: ['/IMG-20250611-WA0041.jpg', '/IMG-20250611-WA0041.jpg', '/IMG-20250611-WA0041.jpg', '/IMG-20250611-WA0041.jpg'],
    videos: [],
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
      'Energy-efficient lighting',
    ],
    challenges: [
      'Complex terrain with elevation changes',
      'Strict local building regulations',
      'Integration of sustainable technologies',
      'Maintaining luxury aesthetics with eco-friendly materials',
    ],
    solutions: [
      'Innovative foundation design to work with natural terrain',
      'Close collaboration with local authorities for compliance',
      'Custom integration of green technologies',
      'Sourcing premium sustainable materials',
    ],
    technologies: [
      'BIM (Building Information Modeling)',
      'Smart home IoT systems',
      'Solar energy systems',
      'Rainwater management systems',
      'Energy-efficient HVAC',
    ],
  },
  'commercial-plaza': {
    id: '2',
    title: 'Commercial Plaza',
    description:
      'A state-of-the-art commercial complex designed to meet the evolving needs of modern businesses. This project features flexible office spaces, retail outlets, and premium amenities.',
    location: 'Andheri, Mumbai',
    status: 'completed',
    category: 'Commercial',
    images: ['/IMG-20250611-WA0041.jpg', '/IMG-20250611-WA0041.jpg', '/IMG-20250611-WA0041.jpg'],
    videos: [],
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
      'Fire safety systems',
    ],
    challenges: [
      'High-density urban location',
      'Traffic management during construction',
      'Meeting diverse tenant requirements',
      'Optimizing space utilization',
    ],
    solutions: [
      'Vertical construction approach',
      'Coordinated construction scheduling',
      'Modular design for flexibility',
      'Efficient space planning techniques',
    ],
    technologies: [
      'Advanced structural engineering',
      'Building management systems',
      'High-efficiency HVAC',
      'Smart security systems',
      'Energy management systems',
    ],
  },
};

export const PROJECT_SLUGS = Object.keys(PROJECT_DETAILS);
