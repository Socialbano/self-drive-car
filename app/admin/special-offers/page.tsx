'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Gift, Sparkles } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function AdminSpecialOffersPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Special Offers State
  const [formData, setFormData] = useState({
    offers_section_title: '',
    offers_section_subtitle: '',
    offer1_active: true,
    offer1_title: '',
    offer1_discount: '',
    offer1_description: '',
    offer1_btn_text: '',
    offer1_whatsapp_msg: '',
    offer2_active: true,
    offer2_title: '',
    offer2_discount: '',
    offer2_description: '',
    offer2_btn_text: '',
    offer2_whatsapp_msg: '',
  });

  useEffect(() => {
    const checkAuthAndLoadSettings = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/admin/login');
        return;
      }

      try {
        const res = await fetch(`/api/settings?t=${Date.now()}`, {
          cache: 'no-store'
        });
        if (!res.ok) throw new Error('Failed to load settings');
        const data = await res.json();

        if (data && Object.keys(data).length > 0) {
          setFormData({
            offers_section_title: data.offers_section_title || 'Special Offers',
            offers_section_subtitle: data.offers_section_subtitle || 'Take advantage of our exclusive deals and save on your next rental',
            offer1_active: data.offer1_active !== undefined ? (data.offer1_active === 'true' || data.offer1_active === true) : true,
            offer1_title: data.offer1_title || 'Weekend Discount',
            offer1_discount: data.offer1_discount || '20% OFF',
            offer1_description: data.offer1_description || 'Get 20% off on weekend rentals. Perfect for your short getaways and weekend adventures.',
            offer1_btn_text: data.offer1_btn_text || 'Claim Offer',
            offer1_whatsapp_msg: data.offer1_whatsapp_msg || 'Hi! I want to claim the 20% Weekend Discount for my car rental.',
            offer2_active: data.offer2_active !== undefined ? (data.offer2_active === 'true' || data.offer2_active === true) : true,
            offer2_title: data.offer2_title || 'First Booking Offer',
            offer2_discount: data.offer2_discount || '15% OFF',
            offer2_description: data.offer2_description || 'New users get a discount on their first ride. Start your journey with us and save today!',
            offer2_btn_text: data.offer2_btn_text || 'Get Started',
            offer2_whatsapp_msg: data.offer2_whatsapp_msg || 'Hi! I want to claim the 15% First Booking Offer for my car rental.',
          });
        }
      } catch (err: any) {
        toast.error('Error fetching settings');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    checkAuthAndLoadSettings();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        toast.error('Session expired. Please log in again.');
        router.push('/admin/login');
        return;
      }

      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update settings');
      }

      toast.success('Special Offers settings updated successfully!');
      
      // Dispatch visibilitychange event so SettingsProvider refreshes homepage state
      window.dispatchEvent(new Event('visibilitychange'));
    } catch (err: any) {
      toast.error(err.message || 'Failed to save settings');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500 pb-12">
      <Toaster position="top-right" />
      
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#0B1F3A] tracking-tight flex items-center gap-3">
          <Gift size={32} className="text-[#E89B10]" />
          Special Offers Settings
        </h1>
        <p className="text-slate-500 mt-1">
          Manage the promo cards, titles, discounts, descriptions, and WhatsApp buttons on your homepage.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-6 animate-pulse">
            <div className="p-6 border border-gray-100 rounded-2xl bg-gray-50/30 space-y-4">
              <div className="h-5 bg-gray-100 rounded w-1/4 mb-2" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-24" />
                  <div className="h-10 bg-gray-100 rounded w-full" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-32" />
                  <div className="h-10 bg-gray-100 rounded w-full" />
                </div>
              </div>
            </div>
            <div className="p-6 border border-gray-100 rounded-2xl bg-gray-50/30 space-y-4">
              <div className="h-5 bg-gray-100 rounded w-1/3 mb-2" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-24" />
                  <div className="h-10 bg-gray-100 rounded w-full" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-32" />
                  <div className="h-10 bg-gray-100 rounded w-full" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="p-8 space-y-6">
            
            {/* Section Header Configuration */}
            <div className="p-6 border border-gray-200 rounded-2xl bg-gray-50/50 space-y-4">
              <h3 className="text-md font-bold text-[#0B1F3A] flex items-center gap-2">
                <Sparkles size={18} className="text-[#E89B10]" />
                Section Header
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Section Title</label>
                  <input
                    type="text"
                    name="offers_section_title"
                    value={formData.offers_section_title}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E89B10] bg-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Section Subtitle</label>
                  <input
                    type="text"
                    name="offers_section_subtitle"
                    value={formData.offers_section_subtitle}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E89B10] bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Offer 1: Weekend Discount */}
            <div className="p-6 border border-gray-200 rounded-2xl bg-gray-50/50 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-200/60 pb-3">
                <h3 className="text-md font-bold text-[#0B1F3A] flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F97316]" />
                  Offer 1 (Weekend Discount - Orange Card)
                </h3>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="offer1_active"
                    checked={formData.offer1_active}
                    onChange={(e) => setFormData(prev => ({ ...prev, offer1_active: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F97316]"></div>
                  <span className="ml-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Active</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Offer Title</label>
                  <input
                    type="text"
                    name="offer1_title"
                    value={formData.offer1_title}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E89B10] bg-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Discount Rate (e.g. 20% OFF)</label>
                  <input
                    type="text"
                    name="offer1_discount"
                    value={formData.offer1_discount}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E89B10] bg-white font-black text-[#F97316]"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                  <textarea
                    name="offer1_description"
                    value={formData.offer1_description}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E89B10] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Button Text</label>
                  <input
                    type="text"
                    name="offer1_btn_text"
                    value={formData.offer1_btn_text}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E89B10] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">WhatsApp Pre-filled Message</label>
                  <input
                    type="text"
                    name="offer1_whatsapp_msg"
                    value={formData.offer1_whatsapp_msg}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E89B10] bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Offer 2: First Booking Offer */}
            <div className="p-6 border border-gray-200 rounded-2xl bg-gray-50/50 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-200/60 pb-3">
                <h3 className="text-md font-bold text-[#0B1F3A] flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
                  Offer 2 (First Booking Offer - Blue Card)
                </h3>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="offer2_active"
                    checked={formData.offer2_active}
                    onChange={(e) => setFormData(prev => ({ ...prev, offer2_active: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563EB]"></div>
                  <span className="ml-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Active</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Offer Title</label>
                  <input
                    type="text"
                    name="offer2_title"
                    value={formData.offer2_title}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E89B10] bg-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Discount Rate (e.g. 15% OFF)</label>
                  <input
                    type="text"
                    name="offer2_discount"
                    value={formData.offer2_discount}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E89B10] bg-white font-black text-[#2563EB]"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                  <textarea
                    name="offer2_description"
                    value={formData.offer2_description}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E89B10] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Button Text</label>
                  <input
                    type="text"
                    name="offer2_btn_text"
                    value={formData.offer2_btn_text}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E89B10] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">WhatsApp Pre-filled Message</label>
                  <input
                    type="text"
                    name="offer2_whatsapp_msg"
                    value={formData.offer2_whatsapp_msg}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E89B10] bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4 flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-[#0B1F3A] text-white px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#0B1F3A]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {saving ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving changes...
                  </>
                ) : (
                  'Save Special Offers'
                )}
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}
