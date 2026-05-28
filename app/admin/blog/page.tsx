'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useSettings } from '@/components/SettingsProvider';
import { BookOpen, Plus, Trash2, Edit2, Check, X, HelpCircle, MapPin, Calendar, Tag, Globe, MessageSquare } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

interface DBLocation {
  id: string;
  name: string;
  slug: string;
}

interface BlogPostFAQ {
  question: string;
  answer: string;
}

interface DBBlogPost {
  id: string;
  slug: string;
  title: string;
  meta_description: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
  content: string;
  faqs: BlogPostFAQ[];
  location_id: string | null;
  locations?: DBLocation;
}

export default function AdminBlogPage() {
  const { refreshSettings } = useSettings();
  const [blogs, setBlogs] = useState<DBBlogPost[]>([]);
  const [locations, setLocations] = useState<DBLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [editId, setEditId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formMetaDesc, setFormMetaDesc] = useState('');
  const [formExcerpt, setFormExcerpt] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formCategory, setFormCategory] = useState('Comprehensive Guides');
  const [formCustomCategory, setFormCustomCategory] = useState('');
  const [formIsCustomCategory, setFormIsCustomCategory] = useState(false);
  const [formImage, setFormImage] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formLocationId, setFormLocationId] = useState<string>('global'); // 'global' = null
  const [formFAQs, setFormFAQs] = useState<BlogPostFAQ[]>([]);

  // Standard category options
  const standardCategories = ['Comprehensive Guides', 'Pricing & Budget', 'Travel Tips', 'Safety Guidelines'];

  const fetchLocations = async () => {
    try {
      const { data, error } = await supabase
        .from('locations')
        .select('id, name, slug')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (!error && data) {
        setLocations(data as DBLocation[]);
      }
    } catch (e) {
      console.error('Error fetching locations:', e);
    }
  };

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*, locations(id, name, slug)')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setBlogs(data as DBBlogPost[]);
      } else {
        toast.error('Failed to load blog posts from database.');
      }
    } catch {
      toast.error('Failed to load blogs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
    fetchBlogs();
  }, []);

  const resetForm = () => {
    setEditId(null);
    setFormTitle('');
    setFormSlug('');
    setFormMetaDesc('');
    setFormExcerpt('');
    
    // Set date to current in 'Mon DD, YYYY' format
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: '2-digit', year: 'numeric' };
    setFormDate(new Date().toLocaleDateString('en-US', options));
    
    setFormCategory('Comprehensive Guides');
    setFormCustomCategory('');
    setFormIsCustomCategory(false);
    setFormImage('');
    setFormContent('');
    setFormLocationId('global');
    setFormFAQs([]);
    setShowForm(false);
  };

  const handleEdit = (blog: DBBlogPost) => {
    setEditId(blog.id);
    setFormTitle(blog.title);
    setFormSlug(blog.slug);
    setFormMetaDesc(blog.meta_description || '');
    setFormExcerpt(blog.excerpt || '');
    setFormDate(blog.date);
    
    if (standardCategories.includes(blog.category)) {
      setFormCategory(blog.category);
      setFormIsCustomCategory(false);
    } else {
      setFormCategory('custom');
      setFormCustomCategory(blog.category);
      setFormIsCustomCategory(true);
    }
    
    setFormImage(blog.image || '');
    setFormContent(blog.content || '');
    setFormLocationId(blog.location_id || 'global');
    setFormFAQs(Array.isArray(blog.faqs) ? blog.faqs : []);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formSlug.trim() || !formContent.trim()) {
      toast.error('Title, Slug, and Content are required fields.');
      return;
    }
    setSaving(true);

    const finalCategory = formIsCustomCategory ? formCustomCategory.trim() : formCategory;
    const finalLocationId = formLocationId === 'global' ? null : formLocationId;

    const payload = {
      title: formTitle.trim(),
      slug: formSlug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-'),
      meta_description: formMetaDesc.trim() || formExcerpt.trim() || formTitle.trim(),
      excerpt: formExcerpt.trim() || formTitle.trim(),
      date: formDate.trim(),
      category: finalCategory || 'Comprehensive Guides',
      image: formImage.trim() || '/images/blog/default.jpg',
      content: formContent,
      location_id: finalLocationId,
      faqs: formFAQs,
      updated_at: new Date().toISOString(),
    };

    try {
      if (editId) {
        const { error } = await supabase
          .from('blogs')
          .update(payload)
          .eq('id', editId);
        if (error) throw error;
        toast.success('Blog post updated successfully!');
      } else {
        const { error } = await supabase
          .from('blogs')
          .insert([{ ...payload, created_at: new Date().toISOString() }]);
        if (error) throw error;
        toast.success('New blog post created successfully!');
      }

      resetForm();
      await fetchBlogs();
      await refreshSettings();
    } catch (err: any) {
      toast.error(`Error saving blog post: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this blog post?')) return;
    try {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', id);
      if (error) throw error;
      toast.success('Blog post deleted successfully.');
      fetchBlogs();
      await refreshSettings();
    } catch (err: any) {
      toast.error(`Failed to delete blog post: ${err.message}`);
    }
  };

  // FAQ list operations
  const addFAQ = () => {
    setFormFAQs([...formFAQs, { question: '', answer: '' }]);
  };

  const updateFAQ = (index: number, field: keyof BlogPostFAQ, value: string) => {
    const updated = [...formFAQs];
    updated[index][field] = value;
    setFormFAQs(updated);
  };

  const removeFAQ = (index: number) => {
    setFormFAQs(formFAQs.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500 pb-12">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#0B1F3A] tracking-tight flex items-center gap-3">
            <BookOpen size={32} className="text-[#E89B10]" />
            Blog Articles Manager
          </h1>
          <p className="text-slate-500 mt-1">Manage database-driven articles, travel guides, and location-specific blogs.</p>
        </div>

        <button
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              resetForm();
              setShowForm(true);
            }
          }}
          className="px-5 py-3 rounded-xl bg-[#0B1F3A] hover:bg-[#0B1F3A]/90 text-white font-bold text-sm transition-all flex items-center gap-2 shadow-md hover:shadow-lg self-start md:self-center"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? 'Close Editor' : 'Write New Article'}
        </button>
      </div>

      {/* Editor Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 mb-8 space-y-6">
          <h2 className="text-lg font-bold text-[#0B1F3A] flex items-center gap-2 border-b border-gray-100 pb-4">
            <span className="material-symbols-outlined text-[#E89B10]">{editId ? 'edit_note' : 'post_add'}</span>
            {editId ? 'Edit Article Details' : 'Compose New Article'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Article Title *</label>
              <input
                type="text"
                required
                value={formTitle}
                onChange={(e) => {
                  setFormTitle(e.target.value);
                  if (!editId) {
                    setFormSlug(e.target.value.toLowerCase().trim()
                      .replace(/\s+/g, '-')
                      .replace(/[^a-z0-9-_]/g, '')
                    );
                  }
                }}
                placeholder="e.g. Best Self Drive Car on Rent in Goa"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#E89B10]/30 focus:border-[#E89B10] outline-none bg-white transition-all text-[#0B1F3A] font-semibold"
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
                placeholder="e.g. best-self-drive-car-goa"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#E89B10]/30 focus:border-[#E89B10] outline-none bg-white transition-all text-[#0B1F3A]"
              />
              <p className="text-[10px] text-slate-400 mt-1">URL path: `/blog/{formSlug || 'slug'}`</p>
            </div>

            {/* Category selection */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Category *</label>
              <select
                value={formIsCustomCategory ? 'custom' : formCategory}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'custom') {
                    setFormIsCustomCategory(true);
                  } else {
                    setFormCategory(val);
                    setFormIsCustomCategory(false);
                  }
                }}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#E89B10]/30 focus:border-[#E89B10] outline-none bg-white transition-all text-[#0B1F3A]"
              >
                {standardCategories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
                <option value="custom">Custom / New Category...</option>
              </select>
            </div>

            {/* Custom Category Input */}
            {formIsCustomCategory && (
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Custom Category Name *</label>
                <input
                  type="text"
                  required
                  value={formCustomCategory}
                  onChange={(e) => setFormCustomCategory(e.target.value)}
                  placeholder="e.g. Driving Itineraries"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#E89B10]/30 focus:border-[#E89B10] outline-none bg-white transition-all text-[#0B1F3A]"
                />
              </div>
            )}

            {/* Target Location / City Tagging */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Target Location / City</label>
              <select
                value={formLocationId}
                onChange={(e) => setFormLocationId(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#E89B10]/30 focus:border-[#E89B10] outline-none bg-white transition-all text-[#0B1F3A]"
              >
                <option value="global">🌎 Global / All Locations</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>📍 {loc.name}</option>
                ))}
              </select>
              <p className="text-[10px] text-slate-400 mt-1">Links this article to a landing page.</p>
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Publish Date String *</label>
              <input
                type="text"
                required
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                placeholder="e.g. May 27, 2026"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#E89B10]/30 focus:border-[#E89B10] outline-none bg-white transition-all text-[#0B1F3A]"
              />
            </div>

            {/* Excerpt */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Excerpt (Short Summary for card preview) *</label>
              <input
                type="text"
                required
                value={formExcerpt}
                onChange={(e) => setFormExcerpt(e.target.value)}
                placeholder="Write a catchy 1-2 sentence hook..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#E89B10]/30 focus:border-[#E89B10] outline-none bg-white transition-all text-[#0B1F3A]"
              />
            </div>

            {/* Image URL */}
            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Featured Image URL *</label>
              <input
                type="text"
                required
                value={formImage}
                onChange={(e) => setFormImage(e.target.value)}
                placeholder="e.g. https://images.unsplash.com/... or local path like /images/blog/..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#E89B10]/30 focus:border-[#E89B10] outline-none bg-white transition-all text-[#0B1F3A]"
              />
            </div>

            {/* Meta Description */}
            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">SEO Meta Description (Google snippet) *</label>
              <textarea
                rows={2}
                required
                value={formMetaDesc}
                onChange={(e) => setFormMetaDesc(e.target.value)}
                placeholder="Write a high-converting description containing your key location words..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#E89B10]/30 focus:border-[#E89B10] outline-none bg-white transition-all text-[#0B1F3A]"
              />
            </div>

            {/* Content Textarea (Rich HTML) */}
            <div className="md:col-span-3">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">HTML Article Content *</label>
                <span className="text-[10px] text-[#1152d4] font-semibold">Supports HTML tags like &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;ul&gt;, &lt;li&gt;</span>
              </div>
              <textarea
                rows={15}
                required
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                placeholder="<div class='space-y-6'>&#10;  <p>Start writing your rich blog post content...</p>&#10;  <h2>Why choose this?</h2>&#10;  <p>Details here...</p>&#10;</div>"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#E89B10]/30 focus:border-[#E89B10] outline-none bg-white transition-all font-mono text-slate-800"
              />
            </div>
          </div>

          {/* Dynamic FAQs Section */}
          <div className="border-t border-gray-100 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-[#0B1F3A] flex items-center gap-2">
                <HelpCircle size={16} className="text-[#E89B10]" />
                Frequently Asked Questions (FAQ schema markup generation)
              </h3>
              <button
                type="button"
                onClick={addFAQ}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-[#0B1F3A] hover:bg-gray-50 transition-colors flex items-center gap-1.5"
              >
                <Plus size={12} />
                Add FAQ Item
              </button>
            </div>

            {formFAQs.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No FAQs added to this article yet. Click the button to append schemas.</p>
            ) : (
              <div className="space-y-4">
                {formFAQs.map((faq, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex gap-4 items-start relative animate-in fade-in duration-300">
                    <div className="flex-grow space-y-3">
                      <input
                        type="text"
                        required
                        value={faq.question}
                        onChange={(e) => updateFAQ(idx, 'question', e.target.value)}
                        placeholder="Question..."
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#E89B10] outline-none font-semibold text-[#0B1F3A]"
                      />
                      <textarea
                        rows={2}
                        required
                        value={faq.answer}
                        onChange={(e) => updateFAQ(idx, 'answer', e.target.value)}
                        placeholder="Answer..."
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#E89B10] outline-none text-slate-600"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFAQ(idx)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition-colors mt-1"
                      title="Remove FAQ item"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
                  Saving Article...
                </>
              ) : (
                <>
                  <Check size={16} />
                  {editId ? 'Save Changes' : 'Publish Article'}
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

      {/* Blogs list Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-[#0B1F3A] flex items-center gap-2 text-lg">
            <MessageSquare size={20} className="text-[#E89B10]" />
            Articles Published ({blogs.length})
          </h2>
        </div>

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-[3px] border-[#0B1F3A] border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-400 text-xs font-semibold">Loading blogs from database...</span>
          </div>
        ) : blogs.length === 0 ? (
          <div className="py-24 text-center">
            <BookOpen size={48} className="text-gray-200 mx-auto mb-3" />
            <h3 className="font-bold text-slate-700 mb-1">No articles found</h3>
            <p className="text-gray-400 text-xs">Begin publishing custom travel content by clicking the 'Write New Article' button above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="py-4 px-6">Image</th>
                  <th className="py-4 px-6">Title</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">City / Location</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-slate-700">
                {blogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-gray-50/50 transition-colors">
                    {/* Image Preview */}
                    <td className="py-4 px-6">
                      <div className="w-12 h-10 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 shrink-0">
                        <img src={blog.image} alt="" className="w-full h-full object-cover" />
                      </div>
                    </td>

                    {/* Title & Slug */}
                    <td className="py-4 px-6 max-w-xs md:max-w-sm">
                      <div className="font-semibold text-[#0B1F3A] truncate">{blog.title}</div>
                      <a href={`/blog/${blog.slug}`} target="_blank" rel="noreferrer" className="text-[10px] text-blue-500 font-mono block hover:underline">
                        /blog/{blog.slug}
                      </a>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100 whitespace-nowrap">
                        <Tag size={10} className="text-[#E89B10]" />
                        {blog.category}
                      </span>
                    </td>

                    {/* Location association */}
                    <td className="py-4 px-6">
                      {blog.locations ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100 whitespace-nowrap">
                          <MapPin size={10} />
                          {blog.locations.name}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-150 whitespace-nowrap">
                          <Globe size={10} />
                          Global
                        </span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="py-4 px-6 text-xs text-slate-400 font-medium whitespace-nowrap">
                      <span className="inline-flex items-center gap-1">
                        <Calendar size={10} />
                        {blog.date}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right space-x-2 shrink-0 whitespace-nowrap">
                      <button
                        onClick={() => handleEdit(blog)}
                        className="inline-flex w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 items-center justify-center transition-colors"
                        title="Edit Article"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(blog.id)}
                        className="inline-flex w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 items-center justify-center transition-colors"
                        title="Delete Article"
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
    </div>
  );
}
