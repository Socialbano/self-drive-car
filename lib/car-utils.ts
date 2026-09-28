import { Car } from '@/types';

/**
 * Normalizes car data to ensure consistency between vehicle name and technical specifications.
 * Fixes known mismatches (e.g., Innova Hycross specs, seats, transmission, fuel types).
 */
export function normalizeCarSpecs(car: Partial<Car>): Car {
  const name = (car.name || 'Vehicle').trim();
  const lowerName = name.toLowerCase();

  let seats = car.seats || 5;
  let transmission = car.transmission || 'manual';
  let fuelType = car.fuel_type || 'petrol';
  let carType = car.car_type || 'car';
  let imageUrl = car.image_url || '';

  // 1. Fix Innova Hycross / 7 Seater mismatches
  if (lowerName.includes('innova') || lowerName.includes('hycross') || lowerName.includes('7 seater') || lowerName.includes('7-seater')) {
    seats = 7;
    if (lowerName.includes('automatic') || lowerName.includes('hycross') || lowerName.includes('cvt') || lowerName.includes('amt')) {
      transmission = 'automatic';
    }
    carType = 'muv';
    if (!fuelType || fuelType === 'manual') fuelType = 'petrol';
  }

  // 2. Fix Thar / SUV seats & transmission
  if (lowerName.includes('thar')) {
    seats = 4;
    carType = 'suv';
    if (!fuelType) fuelType = 'diesel';
  }

  // 3. Fix Fortuner
  if (lowerName.includes('fortuner')) {
    seats = 7;
    carType = 'luxury';
    if (!fuelType) fuelType = 'diesel';
  }

  // 4. Fix EV cars
  if (lowerName.includes('ev') || lowerName.includes('electric') || lowerName.includes('nexon ev')) {
    fuelType = 'electric';
    carType = 'electric';
    transmission = 'automatic';
  }

  // 5. Ensure high-resolution fallback image if missing or broken
  if (!imageUrl || imageUrl.includes('placeholder')) {
    if (lowerName.includes('creta')) {
      imageUrl = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800';
    } else if (lowerName.includes('baleno') || lowerName.includes('swift')) {
      imageUrl = 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=800';
    } else if (lowerName.includes('innova') || lowerName.includes('ertiga')) {
      imageUrl = 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800';
    } else if (lowerName.includes('fortuner') || lowerName.includes('thar')) {
      imageUrl = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800';
    } else {
      imageUrl = 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800';
    }
  }

  return {
    id: car.id || 'car-' + Math.random().toString(36).substring(2, 9),
    name: name,
    slug: car.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    car_type: carType as any,
    fuel_type: fuelType as any,
    transmission: transmission as any,
    seats: Number(seats),
    image_url: imageUrl,
    description: car.description || `Drive the ${name} with complete comfort and zero security deposit.`,
    is_active: car.is_active !== undefined ? car.is_active : true,
    is_featured: car.is_featured !== undefined ? car.is_featured : false,
    is_available: car.is_available !== undefined ? car.is_available : true,
    price_12hr: car.price_12hr ? Number(car.price_12hr) : 1800,
    price_24hr: car.price_24hr ? Number(car.price_24hr) : 2800,
    km_limit_per_day: car.km_limit_per_day ? Number(car.km_limit_per_day) : 300,
    extra_km_rate: car.extra_km_rate ? Number(car.extra_km_rate) : 10,
    price_per_week: car.price_per_week ? Number(car.price_per_week) : undefined,
    price_weekend: car.price_weekend ? Number(car.price_weekend) : undefined,
    price_outstation: car.price_outstation ? Number(car.price_outstation) : undefined,
    deposit: car.deposit ? Number(car.deposit) : 0,
    display_order: car.display_order ? Number(car.display_order) : 0,
    created_at: car.created_at || new Date().toISOString(),
    updated_at: car.updated_at || new Date().toISOString(),
  };
}
