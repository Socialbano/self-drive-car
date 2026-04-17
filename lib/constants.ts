export const BUSINESS = {
  name: 'Skydeepgroup',
  phone: '+919111330558',
  phoneDisplay: '9111330558',
  whatsapp: '919111330558',
  address: 'Near HDFC Bank, Ramesh Dosa, Vishnupuri, Bhawarkua, Indore 452001',
  city: 'Indore',
  state: 'Madhya Pradesh',
  pincode: '452001',
  hours: 'Mon–Sun 24x7',
  email: 'info@skydeepgroup.com',
} as const;

export const CAR_TYPES = ['hatchback', 'sedan', 'suv', 'luxury', 'electric'] as const;
export const FUEL_TYPES = ['petrol', 'diesel', 'cng', 'electric'] as const;
export const TRANSMISSIONS = ['manual', 'automatic'] as const;
export const LEAD_STATUSES = ['new', 'contacted', 'booked', 'closed'] as const;
export const CAR_FEATURES = ['GPS', 'Music System', 'First Aid', 'Spare Tyre', 'Dashcam'] as const;

export const WHATSAPP_MESSAGES = {
  hero: "Hi Skydeepgroup! I'm interested in renting a self-drive car in Indore.",
  general: "Hi Skydeepgroup! I have a general inquiry about your self-drive cars.",
  carBooking: (carName: string) => `Hi Skydeepgroup! I want to book the ${carName}. Is it available?`,
  carBookingTime: (carName: string, time: string, price: number) => `I want to book ${carName} for ${time} (₹${price})`,
  carDetail: (carName: string) => `Hi Skydeepgroup! I'm looking at the ${carName} on your website. I want to book it.`,
  footer: "Hi Skydeepgroup! I came across your website and want to know more."
} as const;

export const whatsappLink = (message: string) => {
  return `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(message)}`;
};
