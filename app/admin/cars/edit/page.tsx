'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { CarForm, DEFAULT_FORM_DATA } from '@/components/admin/CarForm';
import type { CarFormData } from '@/components/admin/CarForm';
import toast from 'react-hot-toast';

function EditCarPageContent() {
  const searchParams = useSearchParams();
  const id = searchParams?.get('id');
  const router = useRouter();

  const [initialData, setInitialData] = useState<CarFormData | undefined>(undefined);
  const [saving, setSaving] = useState(false);
  const [loadingExisting, setLoadingExisting] = useState(!!id);

  useEffect(() => {
    if (id) {
      supabase.from('cars').select('*').eq('id', id).single()
        .then(({ data }) => {
          if (data) {
            setInitialData({
              id: data.id,
              name: data.name,
              slug: data.slug,
              car_type: data.car_type,
              fuel_type: data.fuel_type,
              transmission: data.transmission,
              seats: data.seats,
              image_url: data.image_url,
              description: data.description,
              price_12hr: data.price_12hr,
              price_24hr: data.price_24hr,
              is_active: data.is_active,
              is_featured: data.is_featured,
            });
          }
          setLoadingExisting(false);
        });
    } else {
      setInitialData(undefined);
    }
  }, [id]);

  const handleSave = async (formData: CarFormData) => {
    setSaving(true);
    try {
      const slug = id ? formData.slug : formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      const payload = {
        name: formData.name,
        slug,
        car_type: formData.car_type,
        fuel_type: formData.fuel_type,
        transmission: formData.transmission,
        seats: Number(formData.seats),
        price_12hr: Number(formData.price_12hr),
        price_24hr: Number(formData.price_24hr),
        description: formData.description,
        image_url: formData.image_url,
        is_active: formData.is_active,
        is_featured: formData.is_featured,
      };

      if (id) {
        const { error } = await supabase.from('cars').update(payload).eq('id', id);
        if (error) throw error;
        toast.success("Vehicle updated successfully!");
      } else {
        // Fetch max display_order to append to end
        const { data: maxOrderData } = await supabase
          .from('cars')
          .select('display_order')
          .order('display_order', { ascending: false })
          .limit(1);
        
        const nextOrder = (maxOrderData && maxOrderData.length > 0) 
          ? (maxOrderData[0].display_order || 0) + 1 
          : 1;

        const { error } = await supabase.from('cars').insert([{ ...payload, display_order: nextOrder }]);
        if (error) throw error;
        toast.success("New vehicle added to fleet!");
      }


      // Revalidate frontend paths
      try {
        await fetch('/api/revalidate', { method: 'POST', body: JSON.stringify({ path: '/' }) });
        await fetch('/api/revalidate', { method: 'POST', body: JSON.stringify({ path: '/cars' }) });
        await fetch('/api/revalidate', { method: 'POST', body: JSON.stringify({ path: '/admin/cars' }) });
      } catch (err) {
        console.error('Failed to trigger revalidation:', err);
      }

      router.push('/admin/cars');
      router.refresh();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  if (loadingExisting) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-[3px] border-[#0B1F3A] border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-400 text-sm font-medium">Loading vehicle data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <button
          onClick={() => router.push('/admin/cars')}
          className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-[#0B1F3A] transition-colors mb-4"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Back to Fleet
        </button>
        <h1 className="text-3xl font-black text-[#0B1F3A] tracking-tight">
          {id ? 'Edit Vehicle' : 'Add New Vehicle'}
        </h1>
        <p className="text-gray-500 mt-1">
          {id ? 'Update vehicle details below.' : 'Fill in the details to add a new vehicle to your fleet.'}
        </p>
      </div>

      <CarForm
        initialData={initialData || DEFAULT_FORM_DATA}
        isEditing={!!id}
        onSave={handleSave}
        onCancel={() => router.push('/admin/cars')}
        saving={saving}
      />
    </div>
  );
}

export default function EditCarPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center p-20">
        <div className="w-8 h-8 border-[3px] border-[#0B1F3A] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <EditCarPageContent />
    </Suspense>
  );
}
