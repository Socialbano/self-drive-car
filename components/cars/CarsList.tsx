'use client';

import React, { useState, useMemo } from 'react';
import { Car } from '@/types';
import { CarCard } from './CarCard';
import { CAR_TYPES, FUEL_TYPES, TRANSMISSIONS } from '@/lib/constants';

interface CarsListProps {
  initialCars: Car[];
}

export function CarsList({ initialCars }: CarsListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Cars');
  
  // Advanced filters state
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedFuelType, setSelectedFuelType] = useState('all');
  const [selectedTransmission, setSelectedTransmission] = useState('all');
  const [selectedSeats, setSelectedSeats] = useState('all');
  const [maxPrice, setMaxPrice] = useState<number>(0);

  const categories = useMemo(() => ['All Cars', ...CAR_TYPES], []);

  const maxAvailablePrice = useMemo(() => {
    if (!initialCars.length) return 10000;
    return Math.max(...initialCars.map(c => Number(c.price_24hr || 0)));
  }, [initialCars]);

  const filteredCars = useMemo(() => {
    return initialCars.filter((car) => {
      const carName = car.name || '';
      const carType = car.car_type || '';
      const carFuel = car.fuel_type || '';
      const carTrans = car.transmission || '';
      const carSeats = car.seats || 5;
      const carPrice = Number(car.price_24hr || 0);
      
      const matchesSearch = carName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory =
        selectedCategory === 'All Cars' || carType.toLowerCase() === selectedCategory.toLowerCase();
        
      const matchesFuel =
        selectedFuelType === 'all' || carFuel.toLowerCase() === selectedFuelType.toLowerCase();
        
      const matchesTransmission =
        selectedTransmission === 'all' || carTrans.toLowerCase() === selectedTransmission.toLowerCase();
        
      const matchesSeats =
        selectedSeats === 'all' || carSeats.toString() === selectedSeats;
        
      const matchesPrice =
        maxPrice === 0 || carPrice <= maxPrice;

      return matchesSearch && matchesCategory && matchesFuel && matchesTransmission && matchesSeats && matchesPrice;
    });
  }, [initialCars, searchTerm, selectedCategory, selectedFuelType, selectedTransmission, selectedSeats, maxPrice]);

  const hasActiveAdvancedFilters = 
    selectedFuelType !== 'all' || 
    selectedTransmission !== 'all' || 
    selectedSeats !== 'all' || 
    maxPrice !== 0;

  const resetAdvancedFilters = () => {
    setSelectedFuelType('all');
    setSelectedTransmission('all');
    setSelectedSeats('all');
    setMaxPrice(0);
  };

  return (
    <>
      {/* Filters Bar */}
      <div className="mb-12">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-colors capitalize ${
                  selectedCategory === category
                    ? 'bg-[#0B1F3A] text-white'
                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                }`}
              >
                {category}
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
            <button 
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all flex-shrink-0 relative ${
                showAdvancedFilters || hasActiveAdvancedFilters 
                  ? 'bg-[#0B1F3A] text-white shadow-md' 
                  : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
              }`}
              title="Advanced Filters"
            >
              <span className="material-symbols-outlined">filter_list</span>
              {hasActiveAdvancedFilters && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#FF4500] rounded-full border-2 border-white flex items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Collapsible Advanced Filters Panel */}
        {showAdvancedFilters && (
          <div className="bg-white border border-gray-100 rounded-2xl p-6 mt-4 shadow-lg animate-fade-in transition-all duration-300">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
              <h4 className="font-bold text-[#0B1F3A] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#FF4500]">tune</span>
                Advanced Filters
              </h4>
              {hasActiveAdvancedFilters && (
                <button 
                  onClick={resetAdvancedFilters}
                  className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">restart_alt</span>
                  Reset Filters
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {/* Max Price Slider */}
              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                  Max Price: {maxPrice === 0 ? 'Any Price' : `₹${maxPrice.toLocaleString()}`}
                </label>
                <div className="px-1 py-2">
                  <input 
                    type="range" 
                    min="500" 
                    max={maxAvailablePrice} 
                    step="100"
                    value={maxPrice === 0 ? maxAvailablePrice : maxPrice} 
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#FF4500]"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 font-bold mt-2">
                    <span>₹500</span>
                    <span>₹{maxAvailablePrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Fuel Type Select */}
              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">Fuel Type</label>
                <select
                  value={selectedFuelType}
                  onChange={(e) => setSelectedFuelType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-100 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] focus:border-transparent transition-all outline-none text-[#0B1F3A] font-bold capitalize"
                >
                  <option value="all">Any Fuel</option>
                  {FUEL_TYPES.map(fuel => (
                    <option key={fuel} value={fuel}>{fuel}</option>
                  ))}
                </select>
              </div>

              {/* Transmission Select */}
              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">Transmission</label>
                <select
                  value={selectedTransmission}
                  onChange={(e) => setSelectedTransmission(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-100 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] focus:border-transparent transition-all outline-none text-[#0B1F3A] font-bold capitalize"
                >
                  <option value="all">Any Transmission</option>
                  {TRANSMISSIONS.map(trans => (
                    <option key={trans} value={trans}>{trans}</option>
                  ))}
                </select>
              </div>

              {/* Seats Select */}
              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">Seats / Capacity</label>
                <select
                  value={selectedSeats}
                  onChange={(e) => setSelectedSeats(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-100 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] focus:border-transparent transition-all outline-none text-[#0B1F3A] font-bold"
                >
                  <option value="all">Any Capacity</option>
                  <option value="4">4 Seater</option>
                  <option value="5">5 Seater</option>
                  <option value="7">7 Seater</option>
                </select>
              </div>
            </div>
          </div>
        )}
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
