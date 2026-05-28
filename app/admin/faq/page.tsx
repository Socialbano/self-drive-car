'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { HelpCircle, Plus, Trash2, Edit2, Sliders, Check, X, ShieldAlert } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

interface DBFAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
}

export default function AdminFAQPage() {
  const [faqs, setFaqs] = useState<DBFAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [editId, setEditId] = useState<string | null>(null);
  const [formQuestion, setFormQuestion] = useState('');
  const [formAnswer, setFormAnswer] = useState('');
  const [formCategory, setFormCategory] = useState('General');
  const [formDisplayOrder, setFormDisplayOrder] = useState(0);
  const [formActive, setFormActive] = useState(true);

  const categories = ['General', 'Pricing', 'Documents', 'Delivery', 'Booking', 'Outstation', 'Rules', 'Deposit', 'Payment', 'Refund', 'Availability'];

  const fetchFAQs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: true });

      if (!error && data) {
        setFaqs(data as DBFAQ[]);
      } else {
        toast.error('Failed to load FAQs from database.');
      }
    } catch {
      toast.error('Failed to load FAQs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  const resetForm = () => {
    setEditId(null);
    setFormQuestion('');
    setFormAnswer('');
    setFormCategory('General');
    setFormDisplayOrder(faqs.length + 1);
    setFormActive(true);
    setShowForm(false);
  };

  const handleEdit = (faq: DBFAQ) => {
    setEditId(faq.id);
    setFormQuestion(faq.question);
    setFormAnswer(faq.answer);
    setFormCategory(faq.category || 'General');
    setFormDisplayOrder(faq.display_order);
    setFormActive(faq.is_active);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formQuestion.trim() || !formAnswer.trim()) {
      toast.error('Question and Answer are required fields.');
      return;
    }
    setSaving(true);

    const payload = {
      question: formQuestion.trim(),
      answer: formAnswer.trim(),
      category: formCategory.trim(),
      display_order: formDisplayOrder,
      is_active: formActive,
    };

    try {
      if (editId) {
        const { error } = await supabase
          .from('faqs')
          .update(payload)
          .eq('id', editId);
        if (error) throw error;
        toast.success('FAQ updated successfully!');
      } else {
        const { error } = await supabase
          .from('faqs')
          .insert([payload]);
        if (error) throw error;
        toast.success('New FAQ added successfully!');
      }

      resetForm();
      await fetchFAQs();
    } catch (err: any) {
      toast.error(`Error saving FAQ: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this FAQ item?')) return;
    try {
      const { error } = await supabase
        .from('faqs')
        .delete()
        .eq('id', id);
      if (error) throw error;
      toast.success('FAQ deleted successfully.');
      fetchFAQs();
    } catch (err: any) {
      toast.error(`Failed to delete FAQ: ${err.message}`);
    }
  };

  const handleToggleActive = async (id: string, current: boolean) => {
    try {
      const { error } = await supabase
        .from('faqs')
        .update({ is_active: !current })
        .eq('id', id);
      if (error) throw error;
      toast.success('FAQ visibility updated.');
      fetchFAQs();
    } catch (err: any) {
      toast.error(`Failed to update FAQ: ${err.message}`);
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#0B1F3A] tracking-tight flex items-center gap-3">
            <HelpCircle size={32} className="text-[#E89B10]" />
            FAQ & Support Manager
          </h1>
          <p className="text-slate-500 mt-1">Manage, add, and organize frequently asked questions displayed on the website.</p>
        </div>

        <button
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setFormDisplayOrder(faqs.length + 1);
              setShowForm(true);
            }
          }}
          className="px-5 py-3 rounded-xl bg-[#0B1F3A] hover:bg-[#0B1F3A]/90 text-white font-bold text-sm transition-all flex items-center gap-2 shadow-md hover:shadow-lg self-start md:self-center"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? 'Close Editor' : 'Add New FAQ'}
        </button>
      </div>

      {/* Editor Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 mb-8 space-y-6">
          <h2 className="text-lg font-bold text-[#0B1F3A] flex items-center gap-2 border-b border-gray-100 pb-4">
            <span className="material-symbols-outlined text-[#E89B10]">{editId ? 'edit' : 'add_circle'}</span>
            {editId ? 'Edit FAQ Item' : 'Add New FAQ Item'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Question */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Question / Inquiry *</label>
              <input
                type="text"
                required
                value={formQuestion}
                onChange={(e) => setFormQuestion(e.target.value)}
                placeholder="e.g. Can I get a self drive car in Indore?"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#E89B10]/30 focus:border-[#E89B10] outline-none bg-white transition-all"
              />
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

            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Category *</label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#E89B10]/30 focus:border-[#E89B10] outline-none bg-white transition-all"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Active Toggle */}
            <div className="flex items-center gap-3">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Active Visibility</label>
              <button
                type="button"
                onClick={() => setFormActive(!formActive)}
                className={`relative w-12 h-6 rounded-full transition-colors ${formActive ? 'bg-[#25D366]' : 'bg-gray-300'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${formActive ? 'translate-x-6' : ''}`} />
              </button>
            </div>

            {/* Answer */}
            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Answer / Resolution *</label>
              <textarea
                required
                rows={4}
                value={formAnswer}
                onChange={(e) => setFormAnswer(e.target.value)}
                placeholder="Write the detailed resolution copy here. HTML formatting is supported (e.g. <strong>text</strong>)."
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
                  {editId ? 'Update FAQ' : 'Publish FAQ'}
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

      {/* FAQs List Card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-[#0B1F3A] flex items-center gap-2 text-lg">
            <Sliders size={20} className="text-[#E89B10]" />
            Configured FAQs ({faqs.length})
          </h2>
        </div>

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-[3px] border-[#0B1F3A] border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-400 text-xs font-semibold">Loading questions...</span>
          </div>
        ) : faqs.length === 0 ? (
          <div className="py-24 text-center">
            <HelpCircle size={48} className="text-gray-200 mx-auto mb-3" />
            <h3 className="font-bold text-slate-700 mb-1">No FAQs defined</h3>
            <p className="text-gray-400 text-xs">Create your first database FAQ by clicking the button above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="py-4 px-6 w-[45%]">Question</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6 text-center">Order</th>
                  <th className="py-4 px-6 text-center">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {faqs.map((faq) => (
                  <tr key={faq.id} className="hover:bg-gray-50/50 transition-colors">
                    {/* Question */}
                    <td className="py-4 px-6 font-semibold text-[#0B1F3A] max-w-[280px] truncate" title={faq.question}>
                      {faq.question}
                    </td>
                    
                    {/* Category */}
                    <td className="py-4 px-6 text-slate-500 font-medium">{faq.category || 'General'}</td>

                    {/* Order */}
                    <td className="py-4 px-6 text-center text-slate-500 font-medium">{faq.display_order}</td>

                    {/* Visibility Toggle */}
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => handleToggleActive(faq.id, faq.is_active)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all 
                          ${faq.is_active 
                            ? 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-200' 
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200 border border-gray-200'}`}
                      >
                        {faq.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right space-x-2 shrink-0">
                      <button
                        onClick={() => handleEdit(faq)}
                        className="inline-flex w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 items-center justify-center transition-colors"
                        title="Edit FAQ"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(faq.id)}
                        className="inline-flex w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 items-center justify-center transition-colors"
                        title="Delete FAQ"
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
          <h4 className="text-sm font-bold text-amber-800">Dynamic FAQ Management</h4>
          <p className="text-xs text-amber-700/80 leading-relaxed mt-1">
            Questions and answers added here are fully dynamic and immediately available on your public FAQ page at `/faq`.
            These entries will also generate correct structured FAQ page JSON-LD Schema Markups for improved Google search indexing.
          </p>
        </div>
      </div>

    </div>
  );
}
