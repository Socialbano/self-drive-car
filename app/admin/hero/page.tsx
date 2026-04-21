'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Check, AlertCircle, Image as ImageIcon, Loader2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function AdminHeroPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [currentHero, setCurrentHero] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch('/api/hero-settings')
      .then(res => res.json())
      .then(data => {
        if (data.heroImage) {
          // Append timestamp to bust cache on initial load
          setCurrentHero(`${data.heroImage}?t=${Date.now()}`);
        }
      })
      .catch(() => setCurrentHero('/images/hero-bg.jpg'))
      .finally(() => setLoading(false));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      
      if (selected.size > 2 * 1024 * 1024) {
        toast.error('File size exceeds 2MB limit');
        return;
      }
      
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(selected.type)) {
        toast.error('Only JPG, PNG and WebP are allowed');
        return;
      }

      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload-hero', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Upload failed');

      // Update current hero with new URL + timestamp to force refresh
      const freshUrl = `${data.url}?t=${Date.now()}`;
      setCurrentHero(freshUrl);
      setFile(null);
      if (preview) URL.revokeObjectURL(preview);
      setPreview(null);
      
      toast.success('Hero image replaced successfully!');
      router.refresh();
      
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-[#0B1F3A]" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-12 px-4">
      <Toaster position="top-right" />
      
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#0B1F3A] tracking-tight">Hero Section Settings</h1>
        <p className="text-slate-500 mt-1">
          Upload a new background image. This will permanently replace the current hero image in storage.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Column */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-[#0B1F3A] mb-6 flex items-center gap-2">
              <Upload size={20} className="text-[#E89B10]" />
              Replace Hero Image
            </h2>
            
            <div className={`relative border-2 border-dashed rounded-3xl transition-all duration-300 p-12 text-center 
              ${file ? 'border-[#25D366] bg-green-50/30' : 'border-gray-200 hover:border-[#E89B10] bg-gray-50'}`}>
              
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={uploading}
              />
              
              <div className="flex flex-col items-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 
                  ${file ? 'bg-green-100 text-green-600' : 'bg-white text-gray-400 shadow-sm'}`}>
                  {file ? <Check size={32} /> : <ImageIcon size={32} />}
                </div>
                
                {file ? (
                  <div>
                    <p className="font-bold text-green-700 mb-1">{file.name}</p>
                    <p className="text-xs text-green-600/70">{(file.size / 1024).toFixed(1)} KB • Ready to replace</p>
                  </div>
                ) : (
                  <div>
                    <p className="font-bold text-[#0B1F3A] mb-1">Click to browse or drag & drop</p>
                    <p className="text-xs text-slate-400">JPG, PNG or WebP • Max 2MB</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="w-full bg-[#0B1F3A] text-white py-4 rounded-2xl font-bold hover:bg-[#0B1F3A]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg active:scale-95"
              >
                {uploading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Processing Overwrite...
                  </>
                ) : (
                  <>
                    <Upload size={18} />
                    Upload & Overwrite Current
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 flex gap-4">
            <div className="shrink-0 bg-blue-500 text-white p-2 rounded-lg h-fit">
              <AlertCircle size={18} />
            </div>
            <div>
              <p className="text-sm font-bold text-blue-900 mb-1 uppercase tracking-wider">Storage Efficiency</p>
              <p className="text-xs text-blue-800 leading-relaxed">
                This system always replaces the existing "hero-image" file in Supabase Storage. 
                It prevents storage bloat and keeps your assets organized. 
                <b> Cache-busting</b> is automatically applied to ensure changes reflect instantly.
              </p>
            </div>
          </div>
        </div>

        {/* Preview Column */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm h-full">
            <h2 className="text-xl font-bold text-[#0B1F3A] mb-6 flex items-center justify-between">
              Live Image Preview
              <span className="text-[10px] bg-green-100 text-green-700 px-3 py-1 rounded-full uppercase font-black tracking-widest">
                Storage Path Active
              </span>
            </h2>
            
            <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-100 shadow-inner group">
              {preview || currentHero ? (
                <img
                  src={preview || currentHero || ''}
                  alt="Hero Preview"
                  className={`w-full h-full object-cover transition-all duration-700 
                    ${uploading ? 'scale-110 blur-sm opacity-50' : 'scale-100'}`}
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300">
                  <ImageIcon size={60} className="mb-2 opacity-10" />
                  <span className="text-sm font-medium">No Image found</span>
                </div>
              )}
              
              {preview && !uploading && (
                <div className="absolute top-4 left-4 bg-[#E89B10] text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg uppercase tracking-widest animate-pulse">
                  Unsaved Preview
                </div>
              )}

              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#0B1F3A]/20 backdrop-blur-[2px]">
                  <Loader2 className="animate-spin text-white" size={40} />
                </div>
              )}
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Asset Status</p>
                <p className="text-sm font-bold text-[#0B1F3A]">Constant URL</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Bucket</p>
                <p className="text-sm font-bold text-[#0B1F3A]">hero-images</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
