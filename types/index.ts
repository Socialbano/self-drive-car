export interface Car {
  id: string;
  name: string;
  slug: string;
  car_type: string;
  fuel_type: string;
  transmission: string;
  seats: number;
  image_url: string;
  description: string;
  price_12hr: number;
  price_24hr: number;
  price_per_week?: number | null;
  price_weekend?: number | null;
  price_outstation?: number | null;
  deposit?: number | null;
  km_limit_per_day?: number | null;
  extra_km_rate?: number | null;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  car_images?: CarImage[];
}

export interface CarImage {
  id: string;
  car_id: string;
  url: string;
  cloudinary_id: string;
  display_order?: number;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  car_type?: string;
  pickup_date?: string;
  message?: string;
  status: 'new' | 'contacted' | 'booked' | 'closed';
  source: string;
  created_at: string;
  updated_at: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  display_order?: number;
  is_active: boolean;
}

export interface Testimonial {
  id: string;
  customer_name: string;
  city: string;
  rating: number;
  review_text: string;
  car_rented?: string;
  is_approved: boolean;
  display_order?: number;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  customer_address?: string;
  aadhaar_number?: string;
  driving_license?: string;
  gst_enabled: boolean;
  car_id?: string | null;
  manual_vehicle_name?: string | null;
  manual_vehicle_type?: string | null;
  start_date: string;
  end_date: string;
  daily_rate: number;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  status: 'pending' | 'paid' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface Agreement {
  id: string;
  customer_name: string;
  email?: string;
  mobile: string;
  address: string;
  aadhaar_number: string;
  driving_license: string;
  car_id: string;
  start_date: string;
  end_date: string;
  price_per_day: number;
  total_amount: number;
  security_deposit: number;
  terms_accepted: boolean;
  signature_data?: string;
  created_at: string;
}

export interface MarqueeMessage {
  id: string;
  text: string;
  link?: string;
  icon: string;
  is_active: boolean;
  priority: number;
  created_at: string;
  updated_at: string;
}

export interface InstagramReel {
  id: string;
  reel_url: string;
  thumbnail: string | null;
  is_active: boolean;
  priority: number;
  created_at: string;
}

