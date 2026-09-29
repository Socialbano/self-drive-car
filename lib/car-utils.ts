import { Car } from '@/types';

/**
 * Normalizes car data to ensure consistency between vehicle name and technical specifications.
 * Fixes known mismatches (e.g., Innova Hycross specs, seats, transmission, fuel types).
 */
export function normalizeCarSpecs(car: Partial<Car>): Car {
  const name = (car.name || 'Vehicle').trim();
  const lowerName = name.toLowerCase();

  // 1. Preserve exact admin database values when present
  let seats = car.seats !== undefined && car.seats !== null ? Number(car.seats) : 5;
  let transmission = car.transmission || 'manual';
  let fuelType = car.fuel_type || 'petrol';
  let carType = car.car_type || 'car';
  let imageUrl = (car.image_url || '').trim();
  let description = (car.description || '').trim();

  // 2. Only apply smart spec defaults if admin hasn't specified custom values
  if (lowerName.includes('innova') || lowerName.includes('hycross') || lowerName.includes('crysta') || lowerName.includes('7 seater') || lowerName.includes('7-seater')) {
    if (!car.seats) seats = 7;
    if (!car.car_type) carType = 'muv';
    if (lowerName.includes('hycross')) {
      if (!car.fuel_type) fuelType = 'petrol/hybrid';
      if (!car.transmission) transmission = 'automatic';
    } else if (lowerName.includes('automatic') || lowerName.includes('cvt') || lowerName.includes('amt')) {
      if (!car.transmission) transmission = 'automatic';
    }
  }

  if (lowerName.includes('thar')) {
    if (!car.seats) seats = 4;
    if (!car.car_type) carType = 'suv';
    if (!car.fuel_type) fuelType = 'diesel';
  }

  if (lowerName.includes('fortuner')) {
    if (!car.seats) seats = 7;
    if (!car.car_type) carType = 'luxury';
    if (!car.fuel_type) fuelType = 'diesel';
  }

  if (lowerName.includes('ev') || lowerName.includes('electric') || lowerName.includes('nexon ev')) {
    if (!car.fuel_type) fuelType = 'electric';
    if (!car.car_type) carType = 'electric';
    if (!car.transmission) transmission = 'automatic';
  }

  // 3. Fallback description only if completely missing or truncated
  if (!description || description.endsWith('offer great') || description.includes('offer great')) {
    if (lowerName.includes('hycross') || lowerName.includes('innova')) {
      description = `Premium 7-seater MUV offering luxury comfort, smooth automatic drive, and zero security deposit.`;
    } else if (lowerName.includes('thar')) {
      description = `Iconic 4x4 SUV built for adventure, off-roading, and commanding road presence.`;
    } else if (lowerName.includes('fortuner')) {
      description = `Flagship 7-seater luxury SUV offering high power, unmatched prestige, and ultimate safety.`;
    } else {
      description = `Drive the ${name} with complete comfort, clean interior, and zero security deposit.`;
    }
  }

  // 4. Fallback image ONLY if image_url is empty or 'placeholder'
  if (!imageUrl || imageUrl === 'placeholder' || imageUrl.includes('placeholder.jpg')) {
    if (lowerName.includes('creta')) {
      imageUrl = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800';
    } else if (lowerName.includes('baleno') || lowerName.includes('swift')) {
      imageUrl = 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=800';
    } else if (lowerName.includes('innova') || lowerName.includes('ertiga') || lowerName.includes('hycross')) {
      imageUrl = 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800';
    } else if (lowerName.includes('fortuner') || lowerName.includes('thar')) {
      imageUrl = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800';
    } else {
      imageUrl = 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800';
    }
  }

  const price12 = car.price_12hr !== undefined && car.price_12hr !== null ? Number(car.price_12hr) : 1800;
  const price24 = car.price_24hr !== undefined && car.price_24hr !== null ? Number(car.price_24hr) : 2800;

  return {
    id: car.id || 'car-' + Math.random().toString(36).substring(2, 9),
    name: name,
    slug: car.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    car_type: carType as any,
    fuel_type: fuelType as any,
    transmission: transmission as any,
    seats: Number(seats),
    image_url: imageUrl,
    description: description,
    is_active: car.is_active !== undefined ? car.is_active : true,
    is_featured: car.is_featured !== undefined ? car.is_featured : false,
    is_available: car.is_available !== undefined ? car.is_available : true,
    price_12hr: price12,
    price_24hr: price24,
    km_limit_per_day: car.km_limit_per_day !== undefined && car.km_limit_per_day !== null ? Number(car.km_limit_per_day) : 300,
    extra_km_rate: car.extra_km_rate !== undefined && car.extra_km_rate !== null ? Number(car.extra_km_rate) : 10,
    price_per_week: car.price_per_week ? Number(car.price_per_week) : undefined,
    price_weekend: car.price_weekend ? Number(car.price_weekend) : undefined,
    price_outstation: car.price_outstation ? Number(car.price_outstation) : undefined,
    deposit: car.deposit !== undefined && car.deposit !== null ? Number(car.deposit) : 0,
    display_order: car.display_order ? Number(car.display_order) : 0,
    created_at: car.created_at || new Date().toISOString(),
    updated_at: car.updated_at || new Date().toISOString(),
  };
}
