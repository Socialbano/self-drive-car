'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminHeroPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [currentHero, setCurrentHero] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Dynamic import to prevent SSR issues with filesystem JSON
    fetch('/api/hero-settings')
      .then(res => res.json())
      .then(data => setCurrentHero(data.heroImage))
      .catch(() => setCurrentHero('/images/hero-bg.jpg'));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSuccess(false);
    
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      
      // Validation
      if (selected.size > 2 * 1024 * 1024) {
        setError('File exceeds the 2MB size limit.');
        return;
      }
      
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(selected.type)) {
        setError('Invalid file format. Only JPG, PNG, and WebP are accepted.');
        return;
      }

      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload-hero', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Upload failed');

      setSuccess(true);
      setCurrentHero(data.url);
      setFile(null);
      
      // Clear object URL memory
      if (preview) URL.revokeObjectURL(preview);
      setPreview(null);
      
      // Optional: Ask router to refresh server components like the homepage
      router.refresh();
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#0B1F3A] tracking-tight">Hero Section Settings</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage the primary background image shown on the home page.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload Column */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col items-center text-center justify-center min-h-[400px]">
          <div className="w-full">
            <h2 className="font-bold text-[#0B1F3A] mb-6 text-left border-b pb-4">Background Settings</h2>
            
            <div className="mb-6 bg-gray-50 p-6 rounded-2xl border-2 border-dashed border-gray-200 hover:border-[#E89B10] transition-colors relative">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={loading}
              />
              <span className="material-symbols-outlined text-4xl text-gray-400 mb-2 block">cloud_upload</span>
              <p className="font-bold text-[#0B1F3A] text-sm">Click to Browse or Drag & Drop</p>
              
              {file && (
                <div className="mt-4 p-3 bg-white rounded-xl text-sm font-medium border border-gray-200 text-[#E89B10] flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">image</span>
                  {file.name}
                </div>
              )}
            </div>

            {/* Error / Success states */}
            {error && (
              <div className="mb-4 text-xs font-bold text-red-500 bg-red-50 p-3 rounded-xl border border-red-100">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 text-xs font-bold text-green-600 bg-green-50 p-3 rounded-xl border border-green-100">
                Hero background updated successfully! Changes are live.
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className="w-full bg-[#0B1F3A] text-white py-4 rounded-xl font-bold hover:bg-[#0B1F3A]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">publish</span>
                  Update Hero Image
                </>
              )}
            </button>
            
            {/* Guidelines UI */}
            <div className="mt-8 text-left bg-blue-50/50 p-4 rounded-xl border border-blue-100/50">
              <p className="text-xs font-bold text-[#0B1F3A] uppercase tracking-wider mb-3">Guidelines</p>
              <ul className="text-xs text-gray-500 space-y-2">
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[14px] text-blue-500">aspect_ratio</span> <b>Recommended size:</b> 1920 × 1080 px (Full HD)</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[14px] text-blue-500">crop_16_9</span> <b>Aspect ratio:</b> 16:9</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[14px] text-blue-500">sd_card_alert</span> <b>Max size:</b> 2MB</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-[14px] text-blue-500">image</span> <b>Format:</b> JPG / PNG / WebP</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Live Preview Column */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col min-h-[400px]">
          <h2 className="font-bold text-[#0B1F3A] mb-6 text-left border-b pb-4 flex items-center justify-between">
            Live Preview
            <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase tracking-wider">Active</span>
          </h2>
          
          <div className="flex-1 bg-gray-100 rounded-2xl overflow-hidden relative shadow-inner aspect-[16/9]">
            {preview || currentHero ? (
              <img
                src={preview || currentHero || ''}
                alt="Hero Preview"
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                <span className="material-symbols-outlined text-4xl mb-2">image_not_supported</span>
                <span className="text-sm font-medium">No Image found</span>
              </div>
            )}
            
            {/* Dummy Hero Elements overlay to show context */}
            <div className="absolute inset-0 bg-black/40 p-6 flex flex-col justify-center items-center text-center pointer-events-none">
              <div className="w-full max-w-sm">
                <div className="h-4 bg-white/20 rounded mb-2 w-1/3 mx-auto" />
                <div className="h-6 bg-white shadow-lg rounded mb-4 w-3/4 mx-auto" />
                <div className="h-3 bg-white/40 rounded mb-1 w-full" />
                <div className="h-3 bg-white/40 rounded mb-6 w-5/6 mx-auto" />
                <div className="gap-3 flex justify-center">
                  <div className="w-24 h-8 bg-[#E89B10] rounded-lg" />
                  <div className="w-24 h-8 bg-white/20 backdrop-blur rounded-lg border border-white/30" />
                </div>
              </div>
            </div>
            
            {preview && (
              <div className="absolute top-3 left-3 bg-[#E89B10] text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg uppercase tracking-wider animate-pulse">
                Unsaved Preview
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
