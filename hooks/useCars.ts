import { useState, useMemo } from 'react';
import type { Car } from '@/types';

interface CarFilters {
  carType: string;
  fuelType: string;
  transmission: string;
  search: string;
}

export function useCars(initialCars: Car[]) {
  const [cars] = useState<Car[]>(initialCars);
  
  const [filters, setFilters] = useState<CarFilters>({
    carType: 'all',
    fuelType: 'all',
    transmission: 'all',
    search: '',
  });

  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      // Text search
      if (filters.search && !car.name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      // Type
      if (filters.carType !== 'all' && car.car_type !== filters.carType) return false;
      // Fuel
      if (filters.fuelType !== 'all' && car.fuel_type !== filters.fuelType) return false;
      // Transmission
      if (filters.transmission !== 'all' && car.transmission !== filters.transmission) return false;

      return true;
    });
  }, [cars, filters]);

  const setFilter = (key: keyof CarFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      carType: 'all',
      fuelType: 'all',
      transmission: 'all',
      search: '',
    });
  };

  return {
    filteredCars,
    filters,
    setFilter,
    clearFilters
  };
}
