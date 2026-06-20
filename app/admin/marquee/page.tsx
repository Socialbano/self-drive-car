'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { MarqueeMessage } from '@/types';

import { sanitizeInput } from '@/lib/client-auth';

export default function AdminMarqueePage() {
  const [messages, setMessages] = useState<MarqueeMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [editId, setEditId] = useState<string | null>(null);
  const [formText, setFormText] = useState('');
  const [formIcon, setFormIcon] = useState('🚗');
  const [formLink, setFormLink] = useState('');
  const [formPriority, setFormPriority] = useState(0);
  const [formActive, setFormActive] = useState(true);

  const iconOptions = ['🚗', '🔥', '✅', '💬', '✈️', '🎉', '⭐', '💰', '🏷️', '📞'];

  const fetchMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('marquee_messages')
      .select('*')
      .order('priority', { ascending: true });

    if (!error && data) setMessages(data as MarqueeMessage[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const resetForm = () => {
    setEditId(null);
    setFormText('');
    setFormIcon('🚗');
    setFormLink('');
    setFormPriority(messages.length + 1);
    setFormActive(true);
  };

  const handleEdit = (msg: MarqueeMessage) => {
    setEditId(msg.id);
    setFormText(msg.text);
    setFormIcon(msg.icon || '🚗');
    setFormLink(msg.link || '');
    setFormPriority(msg.priority);
    setFormActive(msg.is_active);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formText.trim()) return;
    setSaving(true);

    const payload = {
      text: sanitizeInput(formText),
      icon: formIcon,
      link: sanitizeInput(formLink) || null,
      priority: Number(formPriority) || 0,
      is_active: !!formActive,
      updated_at: new Date().toISOString(),
    };

    if (editId) {
      await supabase.from('marquee_messages').update(payload).eq('id', editId);
    } else {
      await supabase.from('marquee_messages').insert([{ ...payload, created_at: new Date().toISOString() }]);
    }

    resetForm();
    await fetchMessages();
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this message permanently?')) return;
    await supabase.from('marquee_messages').delete().eq('id', id);
    fetchMessages();
  };

  const handleToggle = async (id: string, current: boolean) => {
    await supabase.from('marquee_messages').update({ is_active: !current, updated_at: new Date().toISOString() }).eq('id', id);
    fetchMessages();
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#0B1F3A] tracking-tight">Marquee Bar Manager</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage scrolling announcements shown above the navbar on your website.
        </p>
      </div>

      {/* Live Preview */}
      <div className="mb-8 rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
        <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
          <span className="text-[10px] text-gray-400 ml-2 font-medium">Live Preview</span>
        </div>
        <div className="bg-gradient-to-r from-[#0B1F3A] via-[#122a4a] to-[#0B1F3A] overflow-hidden">
          <div className="flex items-center h-[40px] overflow-hidden">
            <div className="whitespace-nowrap animate-marquee-preview">
              <span className="text-xs font-semibold tracking-wide text-white/90 px-4">
                {messages.filter(m => m.is_active).map(m => `${m.icon} ${m.text}`).join('   •   ') || 'No active messages. Add one below.'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 mb-8 shadow-sm">
        <h2 className="text-lg font-bold text-[#0B1F3A] mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#E89B10]">{editId ? 'edit' : 'add_circle'}</span>
          {editId ? 'Edit Message' : 'Add New Message'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Message Text */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Message Text *</label>
            <input
              type="text"
              value={formText}
              onChange={(e) => setFormText(e.target.value)}
              placeholder="e.g. Flat 20% OFF on Self Drive Cars"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#E89B10]/30 focus:border-[#E89B10] outline-none transition-all"
              required
            />
          </div>

          {/* Icon Picker */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Icon</label>
            <div className="flex flex-wrap gap-2">
              {iconOptions.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setFormIcon(icon)}
                  className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center border-2 transition-all ${
                    formIcon === icon
                      ? 'border-[#E89B10] bg-[#E89B10]/10 scale-110'
                      : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Priority (lower = first)</label>
            <input
              type="number"
              value={formPriority}
              onChange={(e) => setFormPriority(parseInt(e.target.value) || 0)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#E89B10]/30 focus:border-[#E89B10] outline-none transition-all"
            />
          </div>

          {/* Link (Optional) */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Link (Optional)</label>
            <input
              type="text"
              value={formLink}
              onChange={(e) => setFormLink(e.target.value)}
              placeholder="e.g. /pricing or https://..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#E89B10]/30 focus:border-[#E89B10] outline-none transition-all"
            />
          </div>

          {/* Active Toggle */}
          <div className="flex items-center gap-3">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Active</label>
            <button
              type="button"
              onClick={() => setFormActive(!formActive)}
              className={`relative w-12 h-6 rounded-full transition-colors ${formActive ? 'bg-[#25D366]' : 'bg-gray-300'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${formActive ? 'translate-x-6' : ''}`} />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            type="submit"
            disabled={saving || !formText.trim()}
            className="bg-[#0B1F3A] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#0B1F3A]/90 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">{editId ? 'save' : 'add'}</span>
            {saving ? 'Saving...' : editId ? 'Update Message' : 'Add Message'}
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

      {/* Messages List */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-[#0B1F3A] flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">format_list_numbered</span>
            All Messages ({messages.length})
          </h2>
        </div>

        {loading ? (
          <div className="py-16 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-[#0B1F3A] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="py-16 text-center">
            <span className="material-symbols-outlined text-5xl text-gray-200 mb-3 block">campaign</span>
            <p className="text-gray-400 text-sm">No marquee messages yet. Add your first one above!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-center gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors ${!msg.is_active ? 'opacity-50' : ''}`}
              >
                {/* Icon */}
                <span className="text-2xl shrink-0">{msg.icon}</span>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#0B1F3A] truncate">{msg.text}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] text-gray-400 font-medium">Priority: {msg.priority}</span>
                    {msg.link && (
                      <span className="text-[10px] text-blue-500 font-medium truncate max-w-[150px]">🔗 {msg.link}</span>
                    )}
                  </div>
                </div>

                {/* Toggle */}
                <button
                  onClick={() => handleToggle(msg.id, msg.is_active)}
                  className={`relative w-10 h-5 rounded-full transition-colors shrink-0 ${msg.is_active ? 'bg-[#25D366]' : 'bg-gray-300'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${msg.is_active ? 'translate-x-5' : ''}`} />
                </button>

                {/* Edit */}
                <button
                  onClick={() => handleEdit(msg)}
                  className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors shrink-0"
                >
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                </button>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(msg.id)}
                  className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors shrink-0"
                >
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CSS for preview animation */}
      <style jsx global>{`
        @keyframes marquee-preview {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-preview {
          animation: marquee-preview 15s linear infinite;
        }
      `}</style>
    </div>
  );
}
