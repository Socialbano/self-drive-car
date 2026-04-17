'use client';

import React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '../ui/Input';
import { CAR_TYPES, FUEL_TYPES, TRANSMISSIONS } from '@/lib/constants';
import { Badge } from '../ui/Badge';

interface CarFiltersProps {
  filters: {
    carType: string;
    fuelType: string;
    transmission: string;
    search: string;
  };
  setFilter: (key: any, value: string) => void;
  clearFilters: () => void;
}

export function CarFilters({ filters, setFilter, clearFilters }: CarFiltersProps) {
  const hasActiveFilters = 
    filters.carType !== 'all' || 
    filters.fuelType !== 'all' || 
    filters.transmission !== 'all' || 
    filters.search !== '';

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8">
      
      {/* Search Input */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder="Search by car name... (e.g. Creta)"
          className="pl-10"
          value={filters.search}
          onChange={(e) => setFilter('search', e.target.value)}
        />
      </div>

      {/* Dropdowns Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        {/* Car Type */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Category</label>
          <select
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-accent focus:border-accent text-sm"
            value={filters.carType}
            onChange={(e) => setFilter('carType', e.target.value)}
          >
            <option value="all">All Categories</option>
            {CAR_TYPES.map(type => (
              <option key={type} value={type} className="capitalize">{type}</option>
            ))}
          </select>
        </div>

        {/* Fuel Type */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Fuel Type</label>
          <select
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-accent focus:border-accent text-sm"
            value={filters.fuelType}
            onChange={(e) => setFilter('fuelType', e.target.value)}
          >
            <option value="all">Any Fuel Type</option>
            {FUEL_TYPES.map(type => (
              <option key={type} value={type} className="capitalize">{type}</option>
            ))}
          </select>
        </div>

        {/* Transmission */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Transmission</label>
          <select
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-accent focus:border-accent text-sm"
            value={filters.transmission}
            onChange={(e) => setFilter('transmission', e.target.value)}
          >
            <option value="all">Any Transmission</option>
            {TRANSMISSIONS.map(type => (
              <option key={type} value={type} className="capitalize">{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-500 mr-2">Active Filters:</span>
          
          {filters.carType !== 'all' && (
             <Badge className="bg-primary/5 text-primary">
               {filters.carType} <button onClick={() => setFilter('carType', 'all')} className="ml-1 hover:text-accent"><X className="w-3 h-3"/></button>
             </Badge>
          )}
          {filters.fuelType !== 'all' && (
             <Badge className="bg-primary/5 text-primary">
               {filters.fuelType} <button onClick={() => setFilter('fuelType', 'all')} className="ml-1 hover:text-accent"><X className="w-3 h-3"/></button>
             </Badge>
          )}
          {filters.transmission !== 'all' && (
             <Badge className="bg-primary/5 text-primary">
               {filters.transmission} <button onClick={() => setFilter('transmission', 'all')} className="ml-1 hover:text-accent"><X className="w-3 h-3"/></button>
             </Badge>
          )}
          {filters.search !== '' && (
             <Badge className="bg-primary/5 text-primary">
               &quot;{filters.search}&quot; <button onClick={() => setFilter('search', '')} className="ml-1 hover:text-accent"><X className="w-3 h-3"/></button>
             </Badge>
          )}

          <button onClick={clearFilters} className="text-xs text-gray-500 hover:text-red-500 underline ml-auto transition">
            Clear All
          </button>
        </div>
      )}
    </div>
  );
}
