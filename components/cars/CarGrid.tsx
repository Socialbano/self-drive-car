import React from 'react';
import { Car } from '@/types';
import { CarCard } from './CarCard';

interface CarGridProps {
  cars: Car[];
  emptyStateMessage?: string;
  maxDisplay?: number;
}

export function CarGrid({ 
  cars, 
  emptyStateMessage = "No cars match your criteria. Try adjusting the filters.",
  maxDisplay
}: CarGridProps) {
  
  const displayCars = maxDisplay ? cars.slice(0, maxDisplay) : cars;

  if (cars.length === 0) {
    return (
      <div className="w-full py-16 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
        <div className="text-gray-400 mb-3 text-5xl">🚘</div>
        <h3 className="text-lg font-heading font-semibold text-primary mb-1">No Cars Found</h3>
        <p className="text-gray-500 text-sm max-w-sm mx-auto">{emptyStateMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {displayCars.map((car) => (
        <CarCard key={car.id} car={car} />
      ))}
    </div>
  );
}
