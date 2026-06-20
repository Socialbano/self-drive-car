'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Car } from '@/types';
import Link from 'next/link';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { authPost } from '@/lib/client-auth';

interface SortableRowProps {
  car: Car;
  index: number;
  handleDelete: (id: string) => void;
  toggleFeatured: (car: Car) => void;
  toggleActive: (car: Car) => void;
}

function SortableCarRow({ car, index, handleDelete, toggleFeatured, toggleActive }: SortableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: car.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    position: 'relative' as const,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`hover:bg-gray-50/50 transition-colors group ${isDragging ? 'bg-blue-50/50 ring-2 ring-blue-500/20 ring-inset' : ''}`}
    >
      <td className="px-4 py-4 w-10">
        <div
          {...attributes}
          {...listeners}
          className="p-1 cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-600 transition-colors"
          title="Drag to reorder"
        >
          <span className="material-symbols-outlined text-xl">drag_indicator</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
            <img
              src={car.image_url || 'https://via.placeholder.com/64x48?text=Car'}
              alt={car.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="font-bold text-[#0B1F3A] text-sm">{car.name}</div>
            <div className="text-xs text-gray-400 capitalize">{car.fuel_type} · {car.transmission} · {car.seats} seats</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="text-xs font-bold uppercase px-2.5 py-1 rounded-lg bg-[#0B1F3A]/5 text-[#0B1F3A]">
          {car.car_type}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col gap-1">
          <span className="text-[#0B1F3A] font-semibold text-sm">₹{car.price_12hr?.toLocaleString() ?? 0} <span className="text-xs text-gray-400 font-normal">/ 12h</span></span>
          <span className="text-[#E89B10] font-black text-sm">₹{car.price_24hr?.toLocaleString() ?? 0} <span className="text-xs text-gray-400 font-normal">/ 24h</span></span>
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <button
          onClick={() => toggleFeatured(car)}
          className={`p-1.5 rounded-lg transition-colors ${car.is_featured ? 'text-[#E89B10] bg-[#E89B10]/10' : 'text-gray-300 hover:text-[#E89B10]'}`}
          title={car.is_featured ? 'Remove from featured' : 'Mark as featured'}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: car.is_featured ? "'FILL' 1" : "'FILL' 0" }}>star</span>
        </button>
      </td>
      <td className="px-6 py-4 text-center">
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={() => toggleActive(car)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${car.is_active ? 'bg-blue-500' : 'bg-gray-300'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${car.is_active ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
          <span className={`text-[10px] font-bold uppercase tracking-wider ${car.is_active ? 'text-blue-600' : 'text-gray-400'}`}>
            {car.is_active ? 'Active' : 'Hidden'}
          </span>
        </div>
      </td>

      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/admin/cars/edit?id=${car.id}`}
            className="p-2 text-gray-400 hover:text-[#1152d4] hover:bg-[#1152d4]/5 rounded-full transition-colors"
            title="Edit"
          >
            <span className="material-symbols-outlined text-lg">edit</span>
          </Link>
          <button
            onClick={() => handleDelete(car.id)}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
            title="Delete"
          >
            <span className="material-symbols-outlined text-lg">delete</span>
          </button>
        </div>
      </td>
    </tr>
  );
}


export default function AdminCarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchCars = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    
    console.log('Admin cars fetch:', { data, error });
    
    if (error) {
      setError(error.message);
      console.error('Admin cars error:', error);
    } else if (data) {
      setCars(data as Car[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (search) return;

    if (over && active.id !== over.id) {
      const oldIndex = cars.findIndex((c) => c.id === active.id);
      const newIndex = cars.findIndex((c) => c.id === over.id);

      if (oldIndex === -1 || newIndex === -1) return;

      const newCars = arrayMove(cars, oldIndex, newIndex);
      setCars(newCars);

      // Save new order with individual updates to avoid not-null constraint errors
      console.log('Finalizing reorder in database...');
      
      try {
        const updatePromises = newCars.map((car, idx) => 
          supabase
            .from('cars')
            .update({ display_order: idx + 1 })
            .eq('id', car.id)
        );

        const results = await Promise.all(updatePromises);
        const errors = results.filter(r => r.error);

        if (errors.length > 0) {
          throw errors[0].error;
        }

        console.log('Order persisted successfully');
        await triggerRevalidation();
      } catch (error) {
        console.error('Error saving new car order:', error);
        // Revert on failure to keep UI in sync with DB
        fetchCars();
      }
    }
  };




  // Filtered cars
  const filteredCars = useMemo(() => {
    if (!search) return cars;
    const q = search.toLowerCase();
    return cars.filter(car =>
      (car.name || '').toLowerCase().includes(q) ||
      (car.car_type || '').toLowerCase().includes(q) ||
      (car.fuel_type || '').toLowerCase().includes(q)
    );
  }, [cars, search]);

  // Type summary
  const typeSummary = useMemo(() => {
    const counts: Record<string, number> = {};
    cars.forEach(car => {
      counts[car.car_type] = (counts[car.car_type] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([type, count]) => `${count} ${type.charAt(0).toUpperCase() + type.slice(1)}${count > 1 ? 's' : ''}`)
      .join(' · ');
  }, [cars]);

  const triggerRevalidation = async () => {
    try {
      await authPost('/api/revalidate', { path: '/' });
      await authPost('/api/revalidate', { path: '/cars' });
    } catch (e) {
      console.error('Revalidation error:', e);
    }
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async (id: string) => {
    await supabase.from('cars').delete().eq('id', id);
    await triggerRevalidation();
    fetchCars();
  };

  const toggleFeatured = async (car: Car) => {
    await supabase.from('cars').update({ is_featured: !car.is_featured }).eq('id', car.id);
    setCars(prev => prev.map(c => c.id === car.id ? { ...c, is_featured: !c.is_featured } : c));
    await triggerRevalidation();
  };

  const toggleActive = async (car: Car) => {
    await supabase.from('cars').update({ is_active: !car.is_active }).eq('id', car.id);
    setCars(prev => prev.map(c => c.id === car.id ? { ...c, is_active: !c.is_active } : c));
    await triggerRevalidation();
  };

  // Top-level loading removed to allow skeletons in table

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#0B1F3A] tracking-tight">Fleet Management</h1>
          <p className="text-gray-500 mt-1 text-sm">
            {cars.length} vehicles · {typeSummary || 'No vehicles yet'}
          </p>
        </div>
        <Link
          href="/admin/cars/edit"
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#E89B10] text-white font-bold text-sm hover:bg-[#d08c0e] transition-colors shadow-lg shadow-[#E89B10]/20"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Add Vehicle
        </Link>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-start gap-3">
          <span className="material-symbols-outlined text-red-500 mt-0.5">error_outline</span>
          <div>
            <p className="font-bold">Failed to load cars from database</p>
            <p className="text-red-500 mt-1 font-mono text-xs">{error}</p>
            <p className="mt-2 text-red-600">
              This is likely a Supabase RLS (Row Level Security) issue. Please run{' '}
              <code className="bg-red-100 px-1 rounded">supabase_rls_fix.sql</code> in your Supabase SQL editor.
            </p>
          </div>
        </div>
      )}

      {/* Search */}
      {cars.length > 0 && (
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative max-w-md w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">search</span>
              <input
                type="text"
                placeholder="Search by name, type, or fuel..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1152d4] focus:border-transparent bg-white"
              />
            </div>
            {search && (
              <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-lg text-xs font-medium border border-amber-100">
                <span className="material-symbols-outlined text-sm">info</span>
                Drag-and-drop reordering is disabled while searching
              </div>
            )}
          </div>
        </div>
      )}


      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/80">
                <th className="px-4 py-3 w-10"></th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Vehicle</th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Type</th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Pricing (12H / 24H)</th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-center">Featured</th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-center">Active</th>

                <th className="px-6 py-3 text-right text-[10px] font-bold uppercase tracking-widest text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 relative">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4">
                    <div className="space-y-4 animate-pulse">
                      {[...Array(5)].map((_, idx) => (
                        <div key={idx} className="flex items-center gap-6 py-4 border-b border-gray-100">
                          <div className="w-16 h-12 bg-gray-100 rounded-lg shrink-0" />
                          <div className="flex-grow space-y-2">
                            <div className="h-4 bg-gray-100 rounded w-1/3" />
                            <div className="h-3 bg-gray-100 rounded w-1/4" />
                          </div>
                          <div className="w-[15%] h-5 bg-gray-100 rounded" />
                          <div className="w-[15%] h-5 bg-gray-100 rounded" />
                          <div className="w-[10%] h-5 bg-gray-100 rounded" />
                          <div className="w-[10%] h-6 bg-gray-100 rounded-full" />
                          <div className="flex gap-2 text-right justify-end w-16">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg" />
                            <div className="w-8 h-8 bg-gray-100 rounded-lg" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              ) : (
                <>
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                    modifiers={[restrictToVerticalAxis]}
                  >
                    <SortableContext
                      items={filteredCars.map(c => c.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {filteredCars.map((car, index) => (
                        <SortableCarRow
                          key={car.id}
                          car={car}
                          index={index}
                          handleDelete={handleDelete}
                          toggleFeatured={toggleFeatured}
                          toggleActive={toggleActive}
                        />
                      ))}
                    </SortableContext>
                  </DndContext>
                  {filteredCars.length === 0 && cars.length > 0 && (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center">
                        <span className="material-symbols-outlined text-5xl text-gray-300 mb-4 block">search_off</span>
                        <p className="text-gray-500 font-medium">No vehicles match &quot;{search}&quot;</p>
                        <button onClick={() => setSearch('')} className="text-sm font-semibold text-[#1152d4] hover:text-[#E89B10] mt-2 transition-colors">
                          Clear search
                        </button>
                      </td>
                    </tr>
                  )}
                  {cars.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-6 py-16 text-center">
                        <span className="material-symbols-outlined text-5xl text-gray-300 mb-4 block">directions_car</span>
                        <p className="text-gray-500 font-medium mb-4">No cars in fleet yet</p>
                        <Link href="/admin/cars/edit" className="text-sm font-bold text-[#E89B10] hover:text-[#d08c0e]">
                          + Add your first vehicle
                        </Link>
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Custom Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full border border-gray-100 shadow-2xl scale-in duration-200 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-2xl">delete</span>
            </div>
            <h3 className="text-lg font-bold text-[#0B1F3A]">Delete Vehicle?</h3>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              Are you sure you want to permanently delete this vehicle from the fleet? This action cannot be undone.
            </p>
            <div className="flex gap-3 w-full mt-6">
              <button
                onClick={() => {
                  const id = deleteId;
                  setDeleteId(null);
                  confirmDelete(id);
                }}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm transition-all"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-3 border border-gray-200 text-gray-500 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all bg-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
