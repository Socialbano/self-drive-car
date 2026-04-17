'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { bulkUpdatePricing, getAdminSettings, updateAdminSetting } from '@/lib/supabase/queries';
import type { Car } from '@/types';

interface EditingCell {
  carId: string;
  field: string;
}

export default function AdminPricingPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving] = useState<string | null>(null);

  // Bulk update state
  const [bulkPercent, setBulkPercent] = useState('');
  const [bulkUpdating, setBulkUpdating] = useState(false);
  const [bulkResult, setBulkResult] = useState<string | null>(null);

  // Offer banner state
  const [offerText, setOfferText] = useState('');
  const [offerActive, setOfferActive] = useState(false);
  const [offerSaving, setOfferSaving] = useState(false);
  const [offerSaved, setOfferSaved] = useState(false);

  const fetchCars = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('cars')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    if (data) setCars(data as Car[]);
    setLoading(false);
  };

  const fetchSettings = async () => {
    const settings = await getAdminSettings();
    setOfferText(settings['offer_banner_text'] || '');
    setOfferActive(settings['offer_banner_active'] === 'true');
  };

  useEffect(() => {
    fetchCars();
    fetchSettings();
  }, []);

  const startEdit = (carId: string, field: string, currentValue: number | null | undefined) => {
    setEditingCell({ carId, field });
    setEditValue(currentValue?.toString() || '');
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const saveCell = async (carId: string, field: string) => {
    setSaving(carId + field);
    const numValue = editValue ? Number(editValue) : null;
    await supabase.from('cars').update({ [field]: numValue, updated_at: new Date().toISOString() }).eq('id', carId);
    setCars(prev => prev.map(c => c.id === carId ? { ...c, [field]: numValue } : c));
    setEditingCell(null);
    setEditValue('');
    setSaving(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, carId: string, field: string) => {
    if (e.key === 'Enter') saveCell(carId, field);
    if (e.key === 'Escape') cancelEdit();
  };

  const handleBulkUpdate = async () => {
    const percent = parseFloat(bulkPercent);
    if (isNaN(percent) || percent === 0) {
      setBulkResult('Please enter a valid percentage.');
      return;
    }

    const action = percent > 0 ? 'increase' : 'decrease';
    const confirmation = confirm(
      `Are you sure you want to ${action} ALL car prices by ${Math.abs(percent)}%?\n\nThis will affect: Per Day, Per Week, Weekend, and Outstation rates for all ${cars.length} active cars.\n\nThis action cannot be undone.`
    );

    if (!confirmation) return;

    setBulkUpdating(true);
    setBulkResult(null);

    const multiplier = 1 + (percent / 100);
    const result = await bulkUpdatePricing(multiplier);

    if (result.success) {
      setBulkResult(`✅ Prices ${action}d by ${Math.abs(percent)}% for ${result.updatedCount} cars.`);
      setBulkPercent('');
      fetchCars(); // Refresh table
    } else {
      setBulkResult('❌ Failed to update prices. Please try again.');
    }

    setBulkUpdating(false);
  };

  const handleOfferSave = async () => {
    setOfferSaving(true);
    await updateAdminSetting('offer_banner_text', offerText);
    await updateAdminSetting('offer_banner_active', offerActive.toString());
    setOfferSaving(false);
    setOfferSaved(true);
    setTimeout(() => setOfferSaved(false), 3000);
  };

  const pricingFields = [
    { key: 'price_per_day', label: 'Per Day', required: true },
    { key: 'price_per_week', label: 'Per Week', required: false },
    { key: 'price_weekend', label: 'Weekend', required: false },
    { key: 'price_outstation', label: 'Outstation', required: false },
    { key: 'deposit', label: 'Deposit', required: true },
    { key: 'km_limit_per_day', label: 'KM Limit', required: true },
    { key: 'extra_km_rate', label: 'Extra KM (₹)', required: true },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-[3px] border-[#0B1F3A] border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-400 text-sm font-medium">Loading pricing data...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#0B1F3A] tracking-tight">Pricing Control</h1>
        <p className="text-gray-500 mt-1">Click any cell to edit. Press Enter to save, Escape to cancel.</p>
      </div>

      {/* Bulk Update + Offer Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Bulk Pricing Update */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-lg text-[#E89B10]">trending_up</span>
            Bulk Price Adjustment
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            Increase or decrease all pricing fields at once. Use positive value for increase, negative for decrease.
          </p>
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Percentage (%)</label>
              <input
                type="number"
                value={bulkPercent}
                onChange={(e) => setBulkPercent(e.target.value)}
                placeholder="e.g. 10 or -5"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E89B10] focus:border-transparent"
              />
            </div>
            <button
              onClick={handleBulkUpdate}
              disabled={bulkUpdating || !bulkPercent}
              className="px-5 py-2.5 rounded-xl bg-[#E89B10] text-white font-bold text-sm hover:bg-[#d08c0e] transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              {bulkUpdating ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Updating...
                </span>
              ) : 'Apply to All'}
            </button>
          </div>
          {bulkResult && (
            <p className={`text-sm font-medium mt-3 ${bulkResult.startsWith('✅') ? 'text-green-600' : 'text-red-500'}`}>
              {bulkResult}
            </p>
          )}
        </div>

        {/* Offer Banner Control */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-lg text-purple-600">campaign</span>
            Special Offer Banner
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            Set a promotional banner that appears on the public website.
          </p>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Banner Text</label>
              <input
                type="text"
                value={offerText}
                onChange={(e) => setOfferText(e.target.value)}
                placeholder="e.g. Flat 20% Off This Diwali!"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <button
                  type="button"
                  onClick={() => setOfferActive(!offerActive)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${offerActive ? 'bg-green-500' : 'bg-gray-300'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${offerActive ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
                <span className="text-sm font-medium text-[#0B1F3A]">{offerActive ? 'Active' : 'Inactive'}</span>
              </label>
              <button
                onClick={handleOfferSave}
                disabled={offerSaving}
                className="px-5 py-2 rounded-xl bg-[#0B1F3A] text-white font-bold text-sm hover:bg-[#0B1F3A]/90 transition-colors disabled:opacity-50"
              >
                {offerSaving ? 'Saving...' : offerSaved ? '✓ Saved' : 'Save Banner'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/80">
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 sticky left-0 bg-gray-50/80 z-10">Vehicle</th>
                {pricingFields.map(f => (
                  <th key={f.key} className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-center min-w-[100px]">
                    {f.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {cars.map(car => (
                <tr key={car.id} className="hover:bg-gray-50/30 transition-colors">
                  <td className="px-6 py-4 sticky left-0 bg-white z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-8 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                        <img src={car.image_url || ''} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-bold text-[#0B1F3A] text-sm whitespace-nowrap">{car.name}</div>
                        <div className="text-[10px] text-gray-400 uppercase">{car.car_type}</div>
                      </div>
                    </div>
                  </td>
                  {pricingFields.map(field => {
                    const value = (car as any)[field.key];
                    const isEditing = editingCell?.carId === car.id && editingCell?.field === field.key;
                    const isSaving = saving === car.id + field.key;

                    return (
                      <td key={field.key} className="px-2 py-3 text-center">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, car.id, field.key)}
                            onBlur={() => saveCell(car.id, field.key)}
                            autoFocus
                            className="w-24 px-2 py-1.5 rounded-lg border-2 border-[#1152d4] text-sm text-center font-bold focus:outline-none"
                          />
                        ) : (
                          <button
                            onClick={() => startEdit(car.id, field.key, value)}
                            className={`inline-block px-3 py-1.5 rounded-lg text-sm font-bold transition-all cursor-pointer hover:bg-[#E89B10]/10 hover:text-[#E89B10] ${
                              isSaving ? 'animate-pulse' : ''
                            } ${
                              value
                                ? field.key === 'price_per_day' ? 'text-[#E89B10]' : 'text-[#0B1F3A]'
                                : 'text-gray-300'
                            }`}
                          >
                            {value != null ? (field.key.includes('price') || field.key === 'deposit' || field.key === 'extra_km_rate' ? `₹${value.toLocaleString()}` : value) : '—'}
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
              {cars.length === 0 && (
                <tr>
                  <td colSpan={pricingFields.length + 1} className="px-6 py-12 text-center text-gray-400">
                    No active cars found. Add cars first from Fleet Management.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
