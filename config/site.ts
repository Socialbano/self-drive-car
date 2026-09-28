/**
 * DriveKro.IN — Master Site & White-Label Configuration
 * Built by Social Bano Technologies
 * 
 * This file serves as the primary single source of truth for all business settings,
 * trust metrics, location hierarchies, SEO defaults, and branding.
 */

export interface SiteLocation {
  id: string;
  name: string;
  slug: string;
  category: 'city' | 'area';
  cityName: string;
  title: string;
  description: string;
  heroDescription: string;
  streetAddress: string;
  heroImage: string;
  iconName: string;
  badgeText: string;
  headingPrefix: string;
  headingHighlight: string;
  whatsappMsg: string;
  displayOrder: number;
}

export const siteConfig = {
  brand: {
    name: 'DriveKro.IN',
    subtitle: 'Self Drive Car Rental',
    tagline: 'Self Drive Your Way',
    heroTagline: 'Now Serving Ujjain, Bhopal & Indore',
    heroTitleP1: 'Self Drive Car',
    heroTitleP2: 'Rental in Ujjain',
    heroDescription:
      'Premium self-drive car rental service with zero security deposit. Experience the freedom of the road with our fleet of luxury SUVs, sedans, and hatchbacks.',
    logoUrl: '',
    foundingYear: '2019',
    legalName: 'Social Bano Technologies Pvt. Ltd.',
    developerName: 'Social Bano Technologies',
    developerUrl: 'https://socialbano.in',
  },
  contact: {
    phone: '+918065064293',
    phoneDisplay: '8065064293',
    whatsapp: '918065064293',
    email: 'support@drivekro.in',
    address: 'Near Railway Station, Freeganj, Ujjain, Madhya Pradesh 456001',
    city: 'Ujjain',
    state: 'Madhya Pradesh',
    pincode: '456001',
    hours: 'Mon–Sun 24x7',
    mapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3667.489110287829!2d75.7845!3d23.1815',
  },
  trustMetrics: {
    customersCount: 1500,
    customersLabel: 'Happy Customers',
    carsCount: 100,
    carsLabel: 'Cars in Fleet',
    supportHours: '24/7',
    googleRating: 4.9,
    googleReviewCount: 500,
    googleProfileLink: 'https://g.co/r/drivekro', // TODO: Replace with client Google My Business link
    suvTypesCount: 4,
    sedanTypesCount: 8,
    hatchbackTypesCount: 6,
  },
  social: {
    instagram: 'https://instagram.com/drivekro.in', // TODO: Client Instagram URL
    facebook: '', // TODO: Client Facebook URL
    twitter: '', // TODO: Client Twitter URL
    youtube: '', // TODO: Client YouTube URL
  },
  urls: {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://drivekro.in',
    isDemo: Boolean(
      process.env.NEXT_PUBLIC_IS_DEMO === 'true' ||
      (typeof process !== 'undefined' && process.env.VERCEL_URL && !process.env.NEXT_PUBLIC_SITE_URL)
    ),
  },
  // Single Source of Truth for Locations (Cities & Areas)
  locations: [
    // --- CITIES ---
    {
      id: 'loc-ujjain',
      name: 'Ujjain',
      slug: 'ujjain',
      category: 'city',
      cityName: 'Ujjain',
      title: 'Self Drive Car Rental in Ujjain | DriveKro.IN',
      description: 'Rent self drive cars in Ujjain without driver. Hatchbacks, sedans, SUVs available at best daily rates with zero security deposit.',
      heroDescription: 'Experience Mahakal Nagari Ujjain with complete freedom. Clean, sanitized self-drive cars delivered straight to Freeganj, Nanakheda, or Railway Station.',
      streetAddress: 'Near Railway Station, Freeganj, Ujjain, Madhya Pradesh 456001',
      heroImage: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&q=80',
      iconName: 'location_city',
      badgeText: 'Top Rated in Ujjain',
      headingPrefix: 'Self Drive Car Rental in',
      headingHighlight: 'Ujjain',
      whatsappMsg: 'Hi! I want to rent a self-drive car in Ujjain.',
      displayOrder: 1,
    },
    {
      id: 'loc-indore',
      name: 'Indore',
      slug: 'indore',
      category: 'city',
      cityName: 'Indore',
      title: 'Self Drive Car Rental in Indore | Car on Rent Without Driver - DriveKro.IN',
      description: 'Book the best self-drive cars in Indore. Hatchbacks, sedans, and luxury SUVs available on daily and monthly rent with 24/7 delivery.',
      heroDescription: 'Explore the cleanest city in India with total comfort. Fast doorstep delivery across Vijay Nagar, Bhawarkua, and Indore Airport.',
      streetAddress: 'Vijay Nagar & Bhawarkua, Indore, Madhya Pradesh 452001',
      heroImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80',
      iconName: 'location_city',
      badgeText: '24/7 Airport Delivery in Indore',
      headingPrefix: 'Self Drive Car Rental in',
      headingHighlight: 'Indore',
      whatsappMsg: 'Hi! I want to rent a self-drive car in Indore.',
      displayOrder: 2,
    },
    {
      id: 'loc-bhopal',
      name: 'Bhopal',
      slug: 'bhopal',
      category: 'city',
      cityName: 'Bhopal',
      title: 'Self Drive Car Rental Bhopal | Rent Car Without Driver - DriveKro.IN',
      description: 'Rent self drive cars in Bhopal. Premium SUVs, sedans, and hatchbacks with zero security deposit and instant booking.',
      heroDescription: 'Explore the City of Lakes on your own terms. Drive around Upper Lake, MP Nagar, DB Mall, and Bhopal Airport with complete privacy.',
      streetAddress: 'MP Nagar Zone-1 & DB Mall Area, Bhopal, Madhya Pradesh 462011',
      heroImage: 'https://images.unsplash.com/photo-1477587458883-47135dfdb56f?auto=format&fit=crop&q=80',
      iconName: 'explore',
      badgeText: 'Serving MP Nagar & DB Mall Bhopal',
      headingPrefix: 'Self Drive Car Rental in',
      headingHighlight: 'Bhopal',
      whatsappMsg: 'Hi! I want to rent a self-drive car in Bhopal.',
      displayOrder: 3,
    },

    // --- UJJAIN AREAS ---
    {
      id: 'loc-mahakal',
      name: 'Mahakal Temple Area',
      slug: 'mahakal-temple-area',
      category: 'area',
      cityName: 'Ujjain',
      title: 'Self Drive Car Rental Mahakal Temple Area Ujjain | DriveKro.IN',
      description: 'Rent a self drive car near Shri Mahakaleshwar Temple Ujjain. Hassle-free pickup for pilgrims and tourists with zero security deposit.',
      heroDescription: 'Visiting Shri Mahakaleshwar Jyotirlinga? Get your self-drive car delivered near Mahakal Corridor or your hotel in Ujjain.',
      streetAddress: 'Mahakal Mandir Marg, Ujjain, Madhya Pradesh 456001',
      heroImage: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&q=80',
      iconName: 'temple_hindu',
      badgeText: 'Pilgrimage Special Delivery',
      headingPrefix: 'Self Drive Car Rental near',
      headingHighlight: 'Mahakal Temple Ujjain',
      whatsappMsg: 'Hi! I need a self-drive car near Mahakal Temple, Ujjain.',
      displayOrder: 4,
    },
    {
      id: 'loc-freeganj',
      name: 'Freeganj',
      slug: 'freeganj',
      category: 'area',
      cityName: 'Ujjain',
      title: 'Self Drive Car Rental Freeganj Ujjain | DriveKro.IN',
      description: 'Rent self drive cars in Freeganj, Ujjain. Instant delivery of clean SUVs and sedans for local and outstation trips.',
      heroDescription: 'Convenient car pickup in the commercial hub of Ujjain. Quick documentation and doorstep delivery in Freeganj.',
      streetAddress: 'Freeganj Main Road, Ujjain, Madhya Pradesh 456001',
      heroImage: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&q=80',
      iconName: 'location_on',
      badgeText: 'Hub Pickup in Freeganj',
      headingPrefix: 'Self Drive Car Rental in',
      headingHighlight: 'Freeganj Ujjain',
      whatsappMsg: 'Hi! I want to rent a car in Freeganj, Ujjain.',
      displayOrder: 5,
    },
    {
      id: 'loc-ujjain-railway',
      name: 'Ujjain Railway Station',
      slug: 'ujjain-railway-station',
      category: 'area',
      cityName: 'Ujjain',
      title: 'Self Drive Car Rental Ujjain Railway Station | DriveKro.IN',
      description: 'Step off the train and drive away. Instant self-drive car delivery at Ujjain Junction Railway Station.',
      heroDescription: 'Arriving at Ujjain Junction? Our team will deliver your pre-booked self-drive car right outside the railway station entrance.',
      streetAddress: 'Ujjain Junction Railway Station, Ujjain, MP 456001',
      heroImage: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80',
      iconName: 'train',
      badgeText: 'Station Pickup Available',
      headingPrefix: 'Car Rental at',
      headingHighlight: 'Ujjain Railway Station',
      whatsappMsg: 'Hi! I need a car pickup at Ujjain Railway Station.',
      displayOrder: 6,
    },

    // --- INDORE AREAS ---
    {
      id: 'loc-vijay-nagar',
      name: 'Vijay Nagar',
      slug: 'vijay-nagar',
      category: 'area',
      cityName: 'Indore',
      title: 'Self Drive Car Rental Vijay Nagar Indore | DriveKro.IN',
      description: 'Rent a self drive car in Vijay Nagar, Indore. Quick delivery of hatchbacks, sedans, and SUVs with zero deposit.',
      heroDescription: 'Fast doorstep delivery for Vijay Nagar residents and corporate travelers. Well-maintained fleet for city and outstation use.',
      streetAddress: 'Vijay Nagar Square, Indore, MP 452010',
      heroImage: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&q=80',
      iconName: 'location_on',
      badgeText: 'Fast Delivery in Vijay Nagar',
      headingPrefix: 'Self Drive Car Rental in',
      headingHighlight: 'Vijay Nagar Indore',
      whatsappMsg: 'Hi! I want to book a self-drive car in Vijay Nagar, Indore.',
      displayOrder: 7,
    },
    {
      id: 'loc-bhanwar-kuan',
      name: 'Bhawarkua',
      slug: 'bhanwar-kuan',
      category: 'area',
      cityName: 'Indore',
      title: 'Car Rental Bhawarkua Indore | Self Drive Near Bhanwar Kuan - DriveKro.IN',
      description: 'Rent a self drive car near Bhawarkua square, Indore. Budget hatchbacks and premium SUVs available with instant verification.',
      heroDescription: 'Pickup your clean, sanitized vehicle right next to Bhawarkua square. Perfect for student getaways and family trips.',
      streetAddress: 'Bhawarkua Main Square, Indore, MP 452001',
      heroImage: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&q=80',
      iconName: 'location_on',
      badgeText: 'Pickup near Bhawarkua',
      headingPrefix: 'Self Drive Car Rental near',
      headingHighlight: 'Bhawarkua Indore',
      whatsappMsg: 'Hi! I want to book a car near Bhawarkua, Indore.',
      displayOrder: 8,
    },
    {
      id: 'loc-indore-airport',
      name: 'Indore Airport',
      slug: 'indore-airport',
      category: 'area',
      cityName: 'Indore',
      title: 'Self Drive Car Rental Indore Airport | Airport Pickup - DriveKro.IN',
      description: 'Arriving at Devi Ahilya Bai Holkar Airport? DriveKro.IN provides instant self-drive car rental delivery at Indore airport.',
      heroDescription: 'Skip the taxi line. Step off your flight and straight into your pre-booked self-drive car at Indore Airport.',
      streetAddress: 'Devi Ahilya Bai Holkar Airport, Indore, MP 452005',
      heroImage: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80',
      iconName: 'flight_land',
      badgeText: '24x7 Airport Delivery',
      headingPrefix: 'Self Drive Car Rental at',
      headingHighlight: 'Indore Airport',
      whatsappMsg: 'Hi! I need a car delivery at Indore Airport.',
      displayOrder: 9,
    },

    // --- BHOPAL AREAS ---
    {
      id: 'loc-mp-nagar',
      name: 'MP Nagar',
      slug: 'mp-nagar',
      category: 'area',
      cityName: 'Bhopal',
      title: 'Self Drive Car Rental MP Nagar Bhopal | DriveKro.IN',
      description: 'Rent self drive cars in MP Nagar, Bhopal. Best rates on hatchbacks, sedans, and SUVs with fast delivery.',
      heroDescription: 'Located in the commercial heart of Bhopal. Doorstep car delivery across MP Nagar Zone-1 and Zone-2.',
      streetAddress: 'MP Nagar Zone-1, Bhopal, MP 462011',
      heroImage: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&q=80',
      iconName: 'location_on',
      badgeText: 'MP Nagar Delivery',
      headingPrefix: 'Self Drive Car Rental in',
      headingHighlight: 'MP Nagar Bhopal',
      whatsappMsg: 'Hi! I want to rent a car in MP Nagar, Bhopal.',
      displayOrder: 10,
    },
    {
      id: 'loc-db-mall',
      name: 'DB Mall Area',
      slug: 'db-mall',
      category: 'area',
      cityName: 'Bhopal',
      title: 'Self Drive Car Rental DB Mall Area Bhopal | DriveKro.IN',
      description: 'Book self drive cars near DB City Mall Bhopal. Fast delivery, sanitized cars, and zero security deposit.',
      heroDescription: 'Convenient car handover right near DB City Mall, Arera Hills, and Board Office square in Bhopal.',
      streetAddress: 'DB City Mall, Arera Hills, Bhopal, MP 462011',
      heroImage: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&q=80',
      iconName: 'shopping_bag',
      badgeText: 'Near DB Mall Bhopal',
      headingPrefix: 'Self Drive Car Rental near',
      headingHighlight: 'DB Mall Bhopal',
      whatsappMsg: 'Hi! I need a self-drive car near DB Mall, Bhopal.',
      displayOrder: 11,
    },
    {
      id: 'loc-bhopal-airport',
      name: 'Bhopal Airport',
      slug: 'bhopal-airport',
      category: 'area',
      cityName: 'Bhopal',
      title: 'Self Drive Car Rental Bhopal Airport | Raja Bhoj Airport - DriveKro.IN',
      description: 'Raja Bhoj Airport Bhopal self-drive car delivery. Book online and get your car delivered on arrival.',
      heroDescription: 'Fly in and drive away. Premium airport pickup service at Raja Bhoj Airport Bhopal.',
      streetAddress: 'Raja Bhoj Airport, Bhopal, MP 462030',
      heroImage: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80',
      iconName: 'flight_land',
      badgeText: 'Raja Bhoj Airport Delivery',
      headingPrefix: 'Car Rental at',
      headingHighlight: 'Bhopal Airport',
      whatsappMsg: 'Hi! I need a self-drive car delivery at Bhopal Airport.',
      displayOrder: 12,
    },
  ] as SiteLocation[],
};
