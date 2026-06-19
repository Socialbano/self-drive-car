'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { MessageSquare, Plus, Trash2, Edit2, Sliders, Check, X, ShieldAlert, Star } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

interface DBTestimonial {
  id: string;
  customer_name: string;
  city: string;
  rating: number;
  review_text: string;
  car_rented?: string;
  is_approved: boolean;
  display_order?: number;
  created_at?: string;
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<DBTestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form State
  const [editId, setEditId] = useState<string | null>(null);
  const [formCustomerName, setFormCustomerName] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formRating, setFormRating] = useState(5);
  const [formReviewText, setFormReviewText] = useState('');
  const [formCarRented, setFormCarRented] = useState('');
  const [formDisplayOrder, setFormDisplayOrder] = useState(0);
  const [formApproved, setFormApproved] = useState(true);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (!error && data) {
        setTestimonials(data as DBTestimonial[]);
      } else {
        toast.error('Failed to load testimonials from database.');
      }
    } catch {
      toast.error('Failed to load testimonials.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const resetForm = () => {
    setEditId(null);
    setFormCustomerName('');
    setFormCity('');
    setFormRating(5);
    setFormReviewText('');
    setFormCarRented('');
    setFormDisplayOrder(testimonials.length + 1);
    setFormApproved(true);
    setShowForm(false);
  };

  const handleEdit = (t: DBTestimonial) => {
    setEditId(t.id);
    setFormCustomerName(t.customer_name);
    setFormCity(t.city || '');
    setFormRating(t.rating || 5);
    setFormReviewText(t.review_text);
    setFormCarRented(t.car_rented || '');
    setFormDisplayOrder(t.display_order || 0);
    setFormApproved(t.is_approved);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCustomerName.trim() || !formReviewText.trim() || !formCity.trim()) {
      toast.error('Customer Name, City and Review Text are required fields.');
      return;
    }
    setSaving(true);

    const payload = {
      customer_name: formCustomerName.trim(),
      city: formCity.trim(),
      rating: formRating,
      review_text: formReviewText.trim(),
      car_rented: formCarRented.trim() || null,
      display_order: formDisplayOrder,
      is_approved: formApproved,
    };

    try {
      if (editId) {
        const { error } = await supabase
          .from('testimonials')
          .update(payload)
          .eq('id', editId);
        if (error) throw error;
        toast.success('Testimonial updated successfully!');
      } else {
        const { error } = await supabase
          .from('testimonials')
          .insert([payload]);
        if (error) throw error;
        toast.success('New testimonial added successfully!');
      }

      resetForm();
      await fetchTestimonials();
    } catch (err: any) {
      toast.error(`Error saving testimonial: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);
      if (error) throw error;
      toast.success('Testimonial deleted successfully.');
      fetchTestimonials();
    } catch (err: any) {
      toast.error(`Failed to delete testimonial: ${err.message}`);
    }
  };

  const handleToggleApproved = async (id: string, current: boolean) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ is_approved: !current })
        .eq('id', id);
      if (error) throw error;
      toast.success('Testimonial status updated.');
      fetchTestimonials();
    } catch (err: any) {
      toast.error(`Failed to update testimonial: ${err.message}`);
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#0B1F3A] tracking-tight flex items-center gap-3">
            <MessageSquare size={32} className="text-[#E89B10]" />
            Testimonials Manager
          </h1>
          <p className="text-slate-500 mt-1">Manage client reviews, approve feedback, and set their sorting order on the home page.</p>
        </div>

        <button
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setFormDisplayOrder(testimonials.length + 1);
              setShowForm(true);
            }
          }}
          className="px-5 py-3 rounded-xl bg-[#0B1F3A] hover:bg-[#0B1F3A]/90 text-white font-bold text-sm transition-all flex items-center gap-2 shadow-md hover:shadow-lg self-start md:self-center"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? 'Close Editor' : 'Add New Testimonial'}
        </button>
      </div>

      {/* Editor Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 mb-8 space-y-6">
          <h2 className="text-lg font-bold text-[#0B1F3A] flex items-center gap-2 border-b border-gray-100 pb-4">
            <span className="material-symbols-outlined text-[#E89B10]">{editId ? 'edit' : 'add_circle'}</span>
            {editId ? 'Edit Testimonial' : 'Add New Testimonial'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Customer Name */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Customer Name *</label>
              <input
                type="text"
                required
                value={formCustomerName}
                onChange={(e) => setFormCustomerName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#E89B10]/30 focus:border-[#E89B10] outline-none bg-white transition-all"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">City *</label>
              <input
                type="text"
                required
                value={formCity}
                onChange={(e) => setFormCity(e.target.value)}
                placeholder="e.g. Ujjain"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#E89B10]/30 focus:border-[#E89B10] outline-none bg-white transition-all"
              />
            </div>

            {/* Car Rented */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Car Rented (Optional)</label>
              <input
                type="text"
                value={formCarRented}
                onChange={(e) => setFormCarRented(e.target.value)}
                placeholder="e.g. Scorpio N"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#E89B10]/30 focus:border-[#E89B10] outline-none bg-white transition-all"
              />
            </div>

            {/* Rating Selector */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Rating (1-5 Stars)</label>
              <div className="flex items-center gap-1.5 h-[46px]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      size={24}
                      className={star <= formRating ? 'text-[#E89B10] fill-[#E89B10]' : 'text-gray-300'}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Display Order */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Display Order (Sorting)</label>
              <input
                type="number"
                value={formDisplayOrder}
                onChange={(e) => setFormDisplayOrder(parseInt(e.target.value) || 0)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#E89B10]/30 focus:border-[#E89B10] outline-none bg-white transition-all"
              />
            </div>

            {/* Active Toggle */}
            <div className="flex items-center gap-3">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Approved Visibility</label>
              <button
                type="button"
                onClick={() => setFormApproved(!formApproved)}
                className={`relative w-12 h-6 rounded-full transition-colors ${formApproved ? 'bg-[#25D366]' : 'bg-gray-300'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${formApproved ? 'translate-x-6' : ''}`} />
              </button>
            </div>

            {/* Review Text */}
            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Review Text *</label>
              <textarea
                required
                rows={4}
                value={formReviewText}
                onChange={(e) => setFormReviewText(e.target.value)}
                placeholder="Write the customer's testimonial quote copy here."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#E89B10]/30 focus:border-[#E89B10] outline-none bg-white transition-all"
              />
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
                  {editId ? 'Update Testimonial' : 'Publish Testimonial'}
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

      {/* Testimonials List Card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-[#0B1F3A] flex items-center gap-2 text-lg">
            <Sliders size={20} className="text-[#E89B10]" />
            Configured Reviews ({testimonials.length})
          </h2>
        </div>

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-[3px] border-[#0B1F3A] border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-400 text-xs font-semibold">Loading reviews...</span>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="py-24 text-center">
            <MessageSquare size={48} className="text-gray-200 mx-auto mb-3" />
            <h3 className="font-bold text-slate-700 mb-1">No testimonials defined</h3>
            <p className="text-gray-400 text-xs">Create your first database testimonial review by clicking the button above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="py-4 px-6 w-[25%]">Customer</th>
                  <th className="py-4 px-6 w-[15%]">Location / Car</th>
                  <th className="py-4 px-6 w-[15%]">Rating</th>
                  <th className="py-4 px-6 w-[25%]">Review Snippet</th>
                  <th className="py-4 px-6 text-center">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {testimonials.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                    {/* Customer Name */}
                    <td className="py-4 px-6 font-semibold text-[#0B1F3A]">
                      {t.customer_name}
                    </td>
                    
                    {/* Location / Car */}
                    <td className="py-4 px-6 text-slate-500 font-medium">
                      <div>{t.city}</div>
                      {t.car_rented && <div className="text-[10px] text-gray-400 italic">Car: {t.car_rented}</div>}
                    </td>

                    {/* Rating */}
                    <td className="py-4 px-6">
                      <div className="flex text-[#E89B10]">
                        {[...Array(t.rating || 5)].map((_, i) => (
                          <Star key={i} size={14} className="fill-[#E89B10] text-[#E89B10]" />
                        ))}
                      </div>
                    </td>

                    {/* Review Snippet */}
                    <td className="py-4 px-6 text-slate-500 max-w-[200px] truncate" title={t.review_text}>
                      "{t.review_text}"
                    </td>

                    {/* Visibility Toggle */}
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => handleToggleApproved(t.id, t.is_approved)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all 
                          ${t.is_approved 
                            ? 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-200' 
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200 border border-gray-200'}`}
                      >
                        {t.is_approved ? 'Approved' : 'Pending'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right space-x-2 shrink-0">
                      <button
                        onClick={() => handleEdit(t)}
                        className="inline-flex w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 items-center justify-center transition-colors"
                        title="Edit Review"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteId(t.id)}
                        className="inline-flex w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 items-center justify-center transition-colors"
                        title="Delete Review"
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
          <h4 className="text-sm font-bold text-amber-800">Dynamic Reviews Panel</h4>
          <p className="text-xs text-amber-700/80 leading-relaxed mt-1">
            Testimonials approved here will appear dynamically in the home page's customer review section carousel.
            Unapproved or pending reviews are saved but will remain hidden from visitors.
          </p>
        </div>
      </div>

      {/* Custom Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full border border-gray-100 shadow-2xl scale-in duration-200 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
              <Trash2 size={24} />
            </div>
            <h3 className="text-lg font-bold text-[#0B1F3A]">Delete Testimonial?</h3>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              Are you sure you want to permanently delete this testimonial? This action cannot be undone.
            </p>
            <div className="flex gap-3 w-full mt-6">
              <button
                onClick={() => {
                  const id = deleteId;
                  setDeleteId(null);
                  handleDelete(id);
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
