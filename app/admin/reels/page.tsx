'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { InstagramReel } from '@/types';

export default function AdminReelsPage() {
  const [reels, setReels] = useState<InstagramReel[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [editId, setEditId] = useState<string | null>(null);
  const [formUrl, setFormUrl] = useState('');
  const [formThumbnail, setFormThumbnail] = useState('');
  const [formPriority, setFormPriority] = useState(0);
  const [formActive, setFormActive] = useState(true);

  const fetchReels = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('instagram_reels')
      .select('*')
      .order('priority', { ascending: true });

    if (!error && data) setReels(data as InstagramReel[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchReels();
  }, []);

  const resetForm = () => {
    setEditId(null);
    setFormUrl('');
    setFormThumbnail('');
    setFormPriority(reels.length + 1);
    setFormActive(true);
  };

  const handleEdit = (reel: InstagramReel) => {
    setEditId(reel.id);
    setFormUrl(reel.reel_url);
    setFormThumbnail(reel.thumbnail || '');
    setFormPriority(reel.priority);
    setFormActive(reel.is_active);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getReelId = (url: string) => {
    const match = url.match(/(?:reel|p)\/([A-Za-z0-9_-]+)/);
    return match ? match[1] : null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formUrl.trim() || !getReelId(formUrl)) {
      alert('Please enter a valid Instagram reel URL.');
      return;
    }
    
    setSaving(true);
    const payload = {
      reel_url: formUrl.trim(),
      thumbnail: formThumbnail.trim() || null,
      priority: formPriority,
      is_active: formActive,
    };

    if (editId) {
      await supabase.from('instagram_reels').update(payload).eq('id', editId);
    } else {
      await supabase.from('instagram_reels').insert([payload]);
    }

    resetForm();
    await fetchReels();
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this reel permanently?')) return;
    await supabase.from('instagram_reels').delete().eq('id', id);
    fetchReels();
  };

  const handleToggle = async (id: string, current: boolean) => {
    await supabase.from('instagram_reels').update({ is_active: !current }).eq('id', id);
    fetchReels();
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#0B1F3A] tracking-tight">Instagram Reels</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage the video reels displayed in the "Follow Our Journey" grid on the homepage.
        </p>
      </div>

      {/* Add / Edit Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 mb-8 shadow-sm">
        <h2 className="text-lg font-bold text-[#0B1F3A] mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#E89B10]">{editId ? 'edit' : 'video_library'}</span>
          {editId ? 'Edit Reel' : 'Add New Reel'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Instagram Reel URL *</label>
            <input
              type="url"
              value={formUrl}
              onChange={(e) => setFormUrl(e.target.value)}
              placeholder="https://www.instagram.com/reel/C7XNxtsPCtI/"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#E89B10]/30 focus:border-[#E89B10] outline-none transition-all"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Custom Thumbnail URL (Optional)</label>
            <input
              type="url"
              value={formThumbnail}
              onChange={(e) => setFormThumbnail(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#E89B10]/30 focus:border-[#E89B10] outline-none transition-all"
            />
            <p className="mt-1 text-xs text-gray-400">Provide an image URL if you want a custom cover image. Otherwise, a generic gradient placeholder will show until clicked.</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Priority Order (1 = Top)</label>
            <input
              type="number"
              value={formPriority}
              onChange={(e) => setFormPriority(parseInt(e.target.value) || 0)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#E89B10]/30 focus:border-[#E89B10] outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Active Status</label>
            <button
              type="button"
              onClick={() => setFormActive(!formActive)}
              className={`relative w-12 h-6 rounded-full transition-colors mt-8 ${formActive ? 'bg-[#25D366]' : 'bg-gray-300'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${formActive ? 'translate-x-6' : ''}`} />
            </button>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            type="submit"
            disabled={saving || !formUrl.trim()}
            className="bg-[#0B1F3A] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#0B1F3A]/90 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">{editId ? 'save' : 'add'}</span>
            {saving ? 'Saving...' : editId ? 'Update Reel' : 'Add Reel'}
          </button>
          {editId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-500 border border-gray-200 hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Reels List */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-[#0B1F3A] flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">grid_view</span>
            Saved Reels ({reels.length})
          </h2>
        </div>

        {loading ? (
          <div className="py-16 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-[#0B1F3A] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : reels.length === 0 ? (
          <div className="py-16 text-center">
            <span className="material-symbols-outlined text-5xl text-gray-200 mb-3 block">videocam</span>
            <p className="text-gray-400 text-sm">No Instagram reels added yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6 bg-gray-50/50">
            {reels.map((reel) => {
              const reelId = getReelId(reel.reel_url);
              return (
                <div key={reel.id} className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden ${!reel.is_active ? 'opacity-50 grayscale' : ''}`}>
                  {/* Preview Image */}
                  <div className="aspect-video bg-gray-100 relative">
                    {reel.thumbnail ? (
                      <img src={reel.thumbnail} alt="Reel Thumbnail" className="w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 bg-[#0B1F3A] flex items-center justify-center">
                        <span className="text-white/30 font-bold">No Cover</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <a href={reel.reel_url} target="_blank" rel="noreferrer" className="bg-white/90 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2">
                        View Instantly <span className="material-symbols-outlined text-sm">open_in_new</span>
                      </a>
                    </div>
                  </div>
                  
                  {/* Info & Controls */}
                  <div className="p-4">
                    <p className="text-xs text-blue-500 font-bold truncate mb-2 block w-full bg-blue-50 p-2 rounded-lg">ID: {reelId}</p>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                        <span className="material-symbols-outlined text-[16px]">sort</span>
                        Priority: {reel.priority}
                      </div>
                      
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleToggle(reel.id, reel.is_active)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center border border-gray-200 hover:bg-gray-50 transition-colors"
                          title="Toggle Active"
                        >
                          <span className={`material-symbols-outlined text-[16px] ${reel.is_active ? 'text-green-500' : 'text-gray-400'}`}>
                            {reel.is_active ? 'toggle_on' : 'toggle_off'}
                          </span>
                        </button>
                        <button
                          onClick={() => handleEdit(reel)}
                          className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[16px]">edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(reel.id)}
                          className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
