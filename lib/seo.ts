export const SITE_URL = 'https://www.merakisquarefootsllp.co.in';

export const BUSINESS_INFO = {
  name: 'Meraki Square Foot LLP',
  legalName: 'Meraki Square Foot LLP',
  tagline: 'Building Dreams, Creating Futures',
  description:
    'Meraki Square Foot LLP (merakisquarefootllp) delivers integrated RCC consultancy, property advisory, interior design, and property management solutions across Navi Mumbai, Mumbai, and Pune.',
  email: 'merakisquarefootsllp@gmail.com',
  phones: ['+91-9930910004', '+91-9820274467'],
  whatsapp: 'https://wa.me/919930910004',
  instagram: 'https://www.instagram.com/merakisquarefoots?igsh=eXpnNzh1OWR2bTUw&utm_source=qr',
  address: {
    streetAddress: 'Unit no. C 304, Rahul Apartment CHS, Plot E125, Sector 12',
    addressLocality: 'Kharghar',
    addressRegion: 'Maharashtra',
    postalCode: '410210',
    addressCountry: 'IN',
  },
  serviceAreas: ['Navi Mumbai', 'Mumbai', 'Pune'],
  foundingYear: 2017,
};

export const KEYWORDS = [
  'merakisquarefootllp',
  'MerakiSquareFootLLP',
  'Meraki Square Foot LLP',
  'Meraki Square Foot',
  'Meraki Squarefoot',
  'Meraki Square Foot Navi Mumbai',
  'real estate consultants Navi Mumbai',
  'RCC consultancy Mumbai',
  'interior design Navi Mumbai',
  'property advisory Pune',
];

export const STATIC_ROUTES = ['/', '/projects', '/services', '/work', '/privacy', '/terms'];

export const SOCIAL_LINKS = [SITE_URL, BUSINESS_INFO.instagram, BUSINESS_INFO.whatsapp];

export const OPENING_HOURS = [
  {
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    opens: '09:00',
    closes: '18:00',
  },
  {
    dayOfWeek: ['Sunday'],
    opens: '00:00',
    closes: '00:00',
    description: 'By appointment only',
  },
];
