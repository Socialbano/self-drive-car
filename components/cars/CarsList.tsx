'use client';

import React, { useState, useMemo } from 'react';
import { Car } from '@/types';
import { CarCard } from './CarCard';

interface CarsListProps {
  initialCars: Car[];
}

export function CarsList({ initialCars }: CarsListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Cars');

  const categories = ['All Cars', 'hatchback', 'sedan', 'suv'];

  const filteredCars = useMemo(() => {
    return initialCars.filter((car) => {
      const carName = car.name || '';
      const carType = car.car_type || '';
      
      const matchesSearch = carName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === 'All Cars' || carType.toLowerCase() === selectedCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [initialCars, searchTerm, selectedCategory]);

  return (
    <>
      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 mb-12 items-center justify-between">
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? 'bg-[#0B1F3A] text-white'
                  : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
              }`}
            >
              {category === 'All Cars' ? 'All Cars' : category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-grow md:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">search</span>
            <input 
              type="text" 
              placeholder="Search fleet..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#0B1F3A] transition-shadow outline-none text-[#0B1F3A] font-semibold placeholder:text-gray-400 placeholder:font-medium"
            />
          </div>
          <button className="w-11 h-11 bg-gray-50 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors flex-shrink-0">
            <span className="material-symbols-outlined">filter_list</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      {filteredCars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
          <span className="material-symbols-outlined text-6xl text-gray-200 mb-4">directions_car</span>
          <h3 className="text-xl font-bold text-[#0B1F3A] mb-2">No cars available right now</h3>
          <p className="text-gray-400">Please check back later or modify your search criteria.</p>
        </div>
      )}
    </>
  );
}
