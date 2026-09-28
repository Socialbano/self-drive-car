import { siteConfig } from '@/config/site';

export const BUSINESS = {
  name: siteConfig.brand.name,
  phone: siteConfig.contact.phone,
  phoneDisplay: siteConfig.contact.phoneDisplay,
  whatsapp: siteConfig.contact.whatsapp,
  address: siteConfig.contact.address,
  city: siteConfig.contact.city,
  state: siteConfig.contact.state,
  pincode: siteConfig.contact.pincode,
  hours: siteConfig.contact.hours,
  email: siteConfig.contact.email,
} as const;

export const CAR_TYPES = ['hatchback', 'sedan', 'suv', 'luxury', 'electric', 'muv'] as const;
export const FUEL_TYPES = ['petrol', 'diesel', 'cng', 'electric'] as const;
export const TRANSMISSIONS = ['manual', 'automatic'] as const;
export const LEAD_STATUSES = ['new', 'contacted', 'booked', 'closed'] as const;
export const CAR_FEATURES = ['GPS', 'Music System', 'First Aid', 'Spare Tyre', 'Dashcam'] as const;

export const WHATSAPP_MESSAGES = {
  hero: (brandName: string = siteConfig.brand.name) => `Hi! I'm interested in renting a self-drive car with ${brandName}.`,
  general: (brandName: string = siteConfig.brand.name) => `Hi! I have an inquiry about ${brandName} self-drive cars.`,
  carBooking: (carName: string, brandName: string = siteConfig.brand.name) => `Hi ${brandName}! I want to book the ${carName}. Is it available?`,
  carBookingTime: (carName: string, time: string, price: number, brandName: string = siteConfig.brand.name) => `Hi ${brandName}! I want to book ${carName} for ${time} (₹${price}).`,
  carDetail: (carName: string, brandName: string = siteConfig.brand.name) => `Hi ${brandName}! I'm viewing ${carName} on your website and want to book it.`,
  footer: (brandName: string = siteConfig.brand.name) => `Hi ${brandName}! I came across your website and want to know more.`
} as const;

export const whatsappLink = (message: string, whatsappNumber: string = BUSINESS.whatsapp) => {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
};

