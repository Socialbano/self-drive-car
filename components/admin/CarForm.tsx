'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';

export interface CarFormData {
  id?: string;
  name: string;
  slug: string;
  car_type: string;
  fuel_type: string;
  transmission: string;
  seats: number;
  price_12hr: string | number;
  price_24hr: string | number;
  description: string;
  image_url: string;
  is_active: boolean;
  is_featured: boolean;
}

export const DEFAULT_FORM_DATA: CarFormData = {
  name: '',
  slug: '',
  car_type: 'hatchback',
  fuel_type: 'petrol',
  transmission: 'manual',
  seats: 5,
  price_12hr: '',
  price_24hr: '',
  description: '',
  image_url: '',
  is_active: true,
  is_featured: false,
};

const CAR_TYPES = ['hatchback', 'sedan', 'suv', 'luxury', 'electric', 'muv'];
const FUEL_TYPES = ['petrol', 'diesel', 'cng', 'electric'];
const TRANSMISSIONS = ['manual', 'automatic'];

const InputField = ({ label, name, formData, onChange, type = 'text', required = false, placeholder = '', ...rest }: any) => (
  <div>
    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
    <input
      type={type}
      name={name}
      value={formData[name] ?? ''}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1152d4] focus:border-transparent transition-all"
      {...rest}
    />
  </div>
);

const SelectField = ({ label, name, formData, onChange, options }: any) => (
  <div>
    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
    <select
      name={name}
      value={formData[name] ?? ''}
      onChange={onChange}
      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm capitalize focus:outline-none focus:ring-2 focus:ring-[#1152d4] transition-all"
    >
      {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);

interface CarFormProps {
  initialData?: CarFormData;
  isEditing: boolean;
  onSave: (data: CarFormData) => Promise<void>;
  onCancel: () => void;
  saving: boolean;
}

export function CarForm({ initialData, isEditing, onSave, onCancel, saving }: CarFormProps) {
  const [formData, setFormData] = useState<CarFormData>(initialData || DEFAULT_FORM_DATA);

  const handleChange = (e: any) => {
    const { name, type, checked, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSave(formData);
    } catch (err: any) {
      toast.error('Failed to save vehicle: ' + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Info */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-lg text-[#E89B10]">info</span>
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <InputField formData={formData} onChange={handleChange} label="Car Name" name="name" required placeholder="e.g. Hyundai Creta" />
          <InputField formData={formData} onChange={handleChange} label="URL Slug" name="slug" required placeholder="e.g. hyundai-creta" />
          <SelectField formData={formData} onChange={handleChange} label="Car Type" name="car_type" options={CAR_TYPES} />
          <SelectField formData={formData} onChange={handleChange} label="Fuel Type" name="fuel_type" options={FUEL_TYPES} />
          <SelectField formData={formData} onChange={handleChange} label="Transmission" name="transmission" options={TRANSMISSIONS} />
          <InputField formData={formData} onChange={handleChange} label="Seats" name="seats" type="number" required />
          <InputField formData={formData} onChange={handleChange} label="Price (12 Hours)" name="price_12hr" type="number" required placeholder="e.g. 1200" />
          <InputField formData={formData} onChange={handleChange} label="Price (24 Hours)" name="price_24hr" type="number" required placeholder="e.g. 1800" />
        </div>
      </div>

      {/* Description & Image */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-lg text-[#0B1F3A]">description</span>
          Description & Image
        </h3>
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              maxLength={300}
              placeholder="Short description of the vehicle (max 300 chars)"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1152d4] resize-none transition-all"
            />
            <p className="text-xs text-gray-400 mt-1">{formData.description.length}/300 characters</p>
          </div>
          <InputField formData={formData} onChange={handleChange} label="Image URL" name="image_url" required placeholder="Cloudinary URL or full image URL" />
          {formData.image_url && (
            <div className="w-48 h-32 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
              <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </div>

      {/* Toggles */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-lg text-gray-500">toggle_on</span>
          Visibility & Status
        </h3>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} className="rounded text-[#1152d4] focus:ring-[#1152d4] w-5 h-5" />
            <span className="text-sm font-medium text-[#0B1F3A]">Active (Visible on Website)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleChange} className="rounded text-[#E89B10] focus:ring-[#E89B10] w-5 h-5" />
            <span className="text-sm font-medium text-[#0B1F3A]">Featured on Homepage</span>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 pb-8">
        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3 rounded-xl bg-[#0B1F3A] text-white font-bold text-sm hover:bg-[#0B1F3A]/90 transition-colors shadow-lg disabled:opacity-50"
        >
          {saving ? 'Saving...' : (isEditing ? 'Update Vehicle' : 'Add Vehicle')}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-8 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
