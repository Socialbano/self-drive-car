export const BUSINESS = {
  name: '',
  phone: '+919111330558',
  phoneDisplay: '9111330558',
  whatsapp: '919111330558',
  address: 'Near HDFC Bank, Ramesh Dosa, Vishnupuri, Bhawarkua, Indore 452001',
  city: 'Indore',
  state: 'Madhya Pradesh',
  pincode: '452001',
  hours: 'Mon–Sun 24x7',
  email: '',
} as const;

export const CAR_TYPES = ['hatchback', 'sedan', 'suv', 'luxury', 'electric', 'muv'] as const;
export const FUEL_TYPES = ['petrol', 'diesel', 'cng', 'electric'] as const;
export const TRANSMISSIONS = ['manual', 'automatic'] as const;
export const LEAD_STATUSES = ['new', 'contacted', 'booked', 'closed'] as const;
export const CAR_FEATURES = ['GPS', 'Music System', 'First Aid', 'Spare Tyre', 'Dashcam'] as const;

export const WHATSAPP_MESSAGES = {
  hero: "Hi! I'm interested in renting a self-drive car.",
  general: "Hi! I have a general inquiry about your self-drive cars.",
  carBooking: (carName: string) => `Hi! I want to book the ${carName}. Is it available?`,
  carBookingTime: (carName: string, time: string, price: number) => `I want to book ${carName} for ${time} (₹${price})`,
  carDetail: (carName: string) => `Hi! I'm looking at the ${carName} on your website. I want to book it.`,
  footer: "Hi! I came across your website and want to know more."
} as const;

export const whatsappLink = (message: string, whatsappNumber: string = BUSINESS.whatsapp) => {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
};
