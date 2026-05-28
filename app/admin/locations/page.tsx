'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useSettings } from '@/components/SettingsProvider';
import { MapPin, Plus, Trash2, Edit2, Sliders, Check, X, ShieldAlert } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

interface DBLocation {
  id: string;
  name: string;
  slug: string;
  category: 'city' | 'area';
  title: string;
  description: string;
  street_address: string;
  hero_image: string;
  icon_name: string;
  badge_text: string;
  heading_prefix: string;
  heading_highlight: string;
  hero_description: string;
  whatsapp_msg: string;
  display_order: number;
  is_active: boolean;
}

export default function AdminLocationsPage() {
  const { refreshSettings } = useSettings();
  const [locations, setLocations] = useState<DBLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [editId, setEditId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formCategory, setFormCategory] = useState<'city' | 'area'>('city');
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formStreetAddress, setFormStreetAddress] = useState('');
  const [formHeroImage, setFormHeroImage] = useState('');
  const [formIconName, setFormIconName] = useState('location_on');
  const [formBadgeText, setFormBadgeText] = useState('');
  const [formHeadingPrefix, setFormHeadingPrefix] = useState('Self Drive Car Rental in');
  const [formHeadingHighlight, setFormHeadingHighlight] = useState('');
  const [formHeroDescription, setFormHeroDescription] = useState('');
  const [formWhatsappMsg, setFormWhatsappMsg] = useState('');
  const [formDisplayOrder, setFormDisplayOrder] = useState(0);
  const [formActive, setFormActive] = useState(true);

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .order('display_order', { ascending: true });

      if (!error && data) {
        setLocations(data as DBLocation[]);
      } else {
        toast.error('Failed to load locations from database.');
      }
    } catch {
      toast.error('Failed to load locations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const resetForm = () => {
    setEditId(null);
    setFormName('');
    setFormSlug('');
    setFormCategory('city');
    setFormTitle('');
    setFormDescription('');
    setFormStreetAddress('');
    setFormHeroImage('');
    setFormIconName('location_on');
    setFormBadgeText('');
    setFormHeadingPrefix('Self Drive Car Rental in');
    setFormHeadingHighlight('');
    setFormHeroDescription('');
    setFormWhatsappMsg('');
    setFormDisplayOrder(locations.length + 1);
    setFormActive(true);
    setShowForm(false);
  };

  const handleEdit = (loc: DBLocation) => {
    setEditId(loc.id);
    setFormName(loc.name);
    setFormSlug(loc.slug);
    setFormCategory(loc.category);
    setFormTitle(loc.title || '');
    setFormDescription(loc.description || '');
    setFormStreetAddress(loc.street_address || '');
    setFormHeroImage(loc.hero_image || '');
    setFormIconName(loc.icon_name || 'location_on');
    setFormBadgeText(loc.badge_text || '');
    setFormHeadingPrefix(loc.heading_prefix || 'Self Drive Car Rental in');
    setFormHeadingHighlight(loc.heading_highlight || '');
    setFormHeroDescription(loc.hero_description || '');
    setFormWhatsappMsg(loc.whatsapp_msg || '');
    setFormDisplayOrder(loc.display_order);
    setFormActive(loc.is_active);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formSlug.trim()) {
      toast.error('Name and Slug are required fields.');
      return;
    }
    setSaving(true);

    const payload = {
      name: formName.trim(),
      slug: formSlug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-'),
      category: formCategory,
      title: formTitle.trim() || null,
      description: formDescription.trim() || null,
      street_address: formStreetAddress.trim() || null,
      hero_image: formHeroImage.trim() || null,
      icon_name: formIconName.trim(),
      badge_text: formBadgeText.trim() || null,
      heading_prefix: formHeadingPrefix.trim() || null,
      heading_highlight: formHeadingHighlight.trim() || null,
      hero_description: formHeroDescription.trim() || null,
      whatsapp_msg: formWhatsappMsg.trim() || null,
      display_order: formDisplayOrder,
      is_active: formActive,
      updated_at: new Date().toISOString(),
    };

    try {
      if (editId) {
        const { error } = await supabase
          .from('locations')
          .update(payload)
          .eq('id', editId);
        if (error) throw error;
        toast.success('Location updated successfully!');
      } else {
        const { error } = await supabase
          .from('locations')
          .insert([{ ...payload, created_at: new Date().toISOString() }]);
        if (error) throw error;
        toast.success('New location created successfully!');
      }

      resetForm();
      await fetchLocations();
      await refreshSettings();
    } catch (err: any) {
      toast.error(`Error saving location: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this location? The route /locations/[slug] will no longer resolve.')) return;
    try {
      const { error } = await supabase
        .from('locations')
        .delete()
        .eq('id', id);
      if (error) throw error;
      toast.success('Location deleted successfully.');
      fetchLocations();
      await refreshSettings();
    } catch (err: any) {
      toast.error(`Failed to delete location: ${err.message}`);
    }
  };

  const handleToggleActive = async (id: string, current: boolean) => {
    try {
      const { error } = await supabase
        .from('locations')
        .update({ is_active: !current, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
      toast.success('Location visibility toggled successfully.');
      fetchLocations();
      await refreshSettings();
    } catch (err: any) {
      toast.error(`Failed to toggle visibility: ${err.message}`);
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#0B1F3A] tracking-tight flex items-center gap-3">
            <MapPin size={32} className="text-[#E89B10]" />
            Location Landing Pages
          </h1>
          <p className="text-slate-500 mt-1">Manage database-driven SEO landing pages and locations navigation.</p>
        </div>

        <button
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setFormDisplayOrder(locations.length + 1);
              setShowForm(true);
            }
          }}
          className="px-5 py-3 rounded-xl bg-[#0B1F3A] hover:bg-[#0B1F3A]/90 text-white font-bold text-sm transition-all flex items-center gap-2 shadow-md hover:shadow-lg self-start md:self-center"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? 'Close Editor' : 'Create Location Page'}
        </button>
      </div>

      {/* Editor Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 mb-8 space-y-6">
          <h2 className="text-lg font-bold text-[#0B1F3A] flex items-center gap-2 border-b border-gray-100 pb-4">
            <span className="material-symbols-outlined text-[#E89B10]">{editId ? 'edit' : 'add_circle'}</span>
            {editId ? 'Edit Location Landing Page' : 'Create Dynamic Location Page'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Location Name *</label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => {
                  setFormName(e.target.value);
                  if (!editId) {
                    setFormSlug(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-_]/g, ''));
                    setFormHeadingHighlight(e.target.value);
                  }
                }}
                placeholder="e.g. Vijay Nagar"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#E89B10]/30 focus:border-[#E89B10] outline-none bg-white transition-all"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">URL Route Slug *</label>
              <input
                type="text"
                required
                value={formSlug}
                onChange={(e) => setFormSlug(e.target.value)}
                placeholder="e.g. vijay-nagar"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#E89B10]/30 focus:border-[#E89B10] outline-none bg-white transition-all"
              />
              <p className="text-[10px] text-slate-400 mt-1">This forms the URL route: `/locations/{formSlug || 'slug'}`</p>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Category (Group) *</label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value as 'city' | 'area')}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#E89B10]/30 focus:border-[#E89B10] outline-none bg-white transition-all"
              >
                <option value="city">Popular City (e.g. Goa, Jaipur)</option>
                <option value="area">Area / Neighborhood (e.g. Airport, Vijay Nagar)</option>
              </select>
            </div>

            {/* SEO Title */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Meta Title Tag (for SEO)</label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g. Self Drive Car Rental Vijay Nagar Indore | BrandName"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#E89B10]/30 focus:border-[#E89B10] outline-none bg-white transition-all"
              />
            </div>

            {/* Display Order */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Display Order (in Navbar)</label>
              <input
                type="number"
                value={formDisplayOrder}
                onChange={(e) => setFormDisplayOrder(parseInt(e.target.value) || 0)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#E89B10]/30 focus:border-[#E89B10] outline-none bg-white transition-all"
              />
            </div>

            {/* Meta Description */}
            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Meta Description Tag (for Search Engines)</label>
              <textarea
                rows={2}
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Write a meta description explaining rental details in this location..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#E89B10]/30 focus:border-[#E89B10] outline-none bg-white transition-all"
              />
            </div>

            {/* Hero Image */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Hero Banner Background Image URL (Unsplash or direct link)</label>
              <input
                type="text"
                value={formHeroImage}
                onChange={(e) => setFormHeroImage(e.target.value)}
                placeholder="e.g. https://images.unsplash.com/photo-..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#E89B10]/30 focus:border-[#E89B10] outline-none bg-white transition-all"
              />
            </div>

            {/* Icon Picker (Material Icon string) */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Hero Icon Name (Material Icons)</label>
              <select
                value={formIconName}
                onChange={(e) => setFormIconName(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#E89B10]/30 focus:border-[#E89B10] outline-none bg-white transition-all"
              >
                <option value="location_on">📍 Location Marker (location_on)</option>
                <option value="explore">🧭 Compass Explore (explore)</option>
                <option value="location_city">🏢 Building City (location_city)</option>
                <option value="flight_land">✈️ Flight Land (flight_land)</option>
                <option value="directions_car">🚗 Car icon (directions_car)</option>
              </select>
            </div>

            {/* Tagline Badge */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tagline Badge Text</label>
              <input
                type="text"
                value={formBadgeText}
                onChange={(e) => setFormBadgeText(e.target.value)}
                placeholder="e.g. Fast Delivery in Vijay Nagar"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#E89B10]/30 focus:border-[#E89B10] outline-none bg-white transition-all"
              />
            </div>

            {/* Title Prefix */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">H1 Header Prefix</label>
              <input
                type="text"
                value={formHeadingPrefix}
                onChange={(e) => setFormHeadingPrefix(e.target.value)}
                placeholder="e.g. Self Drive Car Rental in"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#E89B10]/30 focus:border-[#E89B10] outline-none bg-white transition-all"
              />
            </div>

            {/* Title Highlight */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">H1 Header Highlight (Gradient text)</label>
              <input
                type="text"
                value={formHeadingHighlight}
                onChange={(e) => setFormHeadingHighlight(e.target.value)}
                placeholder="e.g. Vijay Nagar"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#E89B10]/30 focus:border-[#E89B10] outline-none bg-white transition-all"
              />
            </div>

            {/* Hero Description */}
            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Hero Banner Description Paragraph</label>
              <textarea
                rows={2}
                value={formHeroDescription}
                onChange={(e) => setFormHeroDescription(e.target.value)}
                placeholder="Enjoy premium self-drive car rentals delivered right to your doorstep in..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#E89B10]/30 focus:border-[#E89B10] outline-none bg-white transition-all"
              />
            </div>

            {/* WhatsApp pre-filled Msg */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">WhatsApp Pre-filled Booking Message</label>
              <input
                type="text"
                value={formWhatsappMsg}
                onChange={(e) => setFormWhatsappMsg(e.target.value)}
                placeholder="e.g. Hi! I want to book a self drive car in Vijay Nagar."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#E89B10]/30 focus:border-[#E89B10] outline-none bg-white transition-all"
              />
            </div>

            {/* Schema Address */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Street Address (for Schema Markup)</label>
              <input
                type="text"
                value={formStreetAddress}
                onChange={(e) => setFormStreetAddress(e.target.value)}
                placeholder="e.g. Vijay Nagar, Indore"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#E89B10]/30 focus:border-[#E89B10] outline-none bg-white transition-all"
              />
            </div>

            {/* Active Toggle */}
            <div className="flex items-center gap-3">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Active (Visible)</label>
              <button
                type="button"
                onClick={() => setFormActive(!formActive)}
                className={`relative w-12 h-6 rounded-full transition-colors ${formActive ? 'bg-[#25D366]' : 'bg-gray-300'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${formActive ? 'translate-x-6' : ''}`} />
              </button>
            </div>

          </div>

          <div className="flex gap-3 border-t border-gray-100 pt-6">
            <button
              type="submit"
              disabled={saving}
              className="bg-[#0B1F3A] hover:bg-[#0B1F3A]/90 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-50 flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              {saving ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check size={16} />
                  {editId ? 'Update Page' : 'Publish Page'}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-3 rounded-xl text-sm font-bold text-gray-500 border border-gray-200 hover:bg-gray-50 transition-all bg-white"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Locations Table Card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-[#0B1F3A] flex items-center gap-2 text-lg">
            <Sliders size={20} className="text-[#E89B10]" />
            Active Location Pages ({locations.length})
          </h2>
        </div>

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-[3px] border-[#0B1F3A] border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-400 text-xs font-semibold">Loading landing pages...</span>
          </div>
        ) : locations.length === 0 ? (
          <div className="py-24 text-center">
            <MapPin size={48} className="text-gray-200 mx-auto mb-3" />
            <h3 className="font-bold text-slate-700 mb-1">No locations defined</h3>
            <p className="text-gray-400 text-xs">Create your first dynamic SEO landing page by clicking the button above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">URL Path</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6 text-center">Order</th>
                  <th className="py-4 px-6 text-center">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {locations.map((loc) => (
                  <tr key={loc.id} className="hover:bg-gray-50/50 transition-colors">
                    {/* Name */}
                    <td className="py-4 px-6 font-semibold text-[#0B1F3A]">{loc.name}</td>
                    
                    {/* Route Slug */}
                    <td className="py-4 px-6 font-mono text-xs text-blue-500 hover:underline">
                      <a href={`/locations/${loc.slug}`} target="_blank" rel="noreferrer">
                        /locations/{loc.slug}
                      </a>
                    </td>
                    
                    {/* Category */}
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border 
                        ${loc.category === 'city' 
                          ? 'bg-purple-50 text-purple-600 border-purple-100' 
                          : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                        {loc.category}
                      </span>
                    </td>

                    {/* Order */}
                    <td className="py-4 px-6 text-center text-slate-500 font-medium">{loc.display_order}</td>

                    {/* Visibility Toggle */}
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => handleToggleActive(loc.id, loc.is_active)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all 
                          ${loc.is_active 
                            ? 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-200' 
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200 border border-gray-200'}`}
                      >
                        {loc.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right space-x-2 shrink-0">
                      <button
                        onClick={() => handleEdit(loc)}
                        className="inline-flex w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 items-center justify-center transition-colors"
                        title="Edit Location Page"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(loc.id)}
                        className="inline-flex w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 items-center justify-center transition-colors"
                        title="Delete Location Page"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Alert Card */}
      <div className="mt-8 bg-amber-50/50 border border-amber-200/60 rounded-3xl p-6 flex items-start gap-4">
        <ShieldAlert className="text-amber-500 shrink-0 mt-0.5" size={20} />
        <div>
          <h4 className="text-sm font-bold text-amber-800">Dynamic Landing Page Generation</h4>
          <p className="text-xs text-amber-700/80 leading-relaxed mt-1">
            Locations published here are fully dynamic and immediately available at runtime in your Navbar locations dropdown and at the corresponding URL route. 
            When deploying Next.js static builds, these pages will be compiled as static HTML exports during build time.
          </p>
        </div>
      </div>

    </div>
  );
}
