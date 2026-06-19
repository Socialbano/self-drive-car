'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Eye, EyeOff, LockKeyhole, Building2, Phone, Mail, MapPin, Clock, MessageSquare, Map, ShieldCheck, Upload, Trash2, Sliders, FileText, Globe, BarChart3, Info, Gift } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { ABOUT_DEFAULTS } from '@/lib/about-defaults';

export default function AdminSettingsPage() {
  const router = useRouter();
  
  // Tab State
  const [activeTab, setActiveTab] = useState<'profile' | 'hero' | 'seo' | 'about' | 'security'>('profile');
  
  // Auth State
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const superAdminEmail = process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL || 'developer@socialbano.in';
  const isSuperAdmin = userEmail === superAdminEmail;

  useEffect(() => {
    if (userEmail && !isSuperAdmin && activeTab !== 'security') {
      setActiveTab('security');
    }
  }, [activeTab, userEmail, isSuperAdmin]);
  
  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  
  // Business Profile Settings State
  const [profileData, setProfileData] = useState({
    business_name: '',
    business_email: '',
    business_phone: '',
    business_whatsapp: '',
    business_address: '',
    business_city: '',
    business_state: '',
    business_pincode: '',
    business_hours: '',
    whatsapp_default_msg: '',
    maps_embed_url: '',
    business_logo_url: '',
    business_upi_qr_url: '',
    business_subtitle: '',
    hero_tagline: '',
    hero_title_p1: '',
    hero_title_p2: '',
    hero_description: '',
    hero_stat1_value: '',
    hero_stat1_label: '',
    hero_stat2_value: '',
    hero_stat2_label: '',
    business_reg_no: '',
    business_udyam_no: '',
    business_gst_no: '',
    business_seo_title: '',
    business_seo_description: '',
    business_seo_keywords: '',
    business_google_site_verification: '',
    business_google_analytics_id: '',
    business_meta_pixel_id: '',
    business_site_url: '',
    business_instagram_url: '',
    theme_primary_color: '',
    theme_accent_color: '',
    
    // About Section
    about_hero_title: '',
    about_hero_subtitle: '',
    about_stat_trips: '',
    about_stat_trips_label: '',
    about_stat_customers: '',
    about_stat_customers_label: '',
    about_stat_vehicles: '',
    about_stat_vehicles_label: '',
    about_stat_cities: '',
    about_stat_cities_label: '',
    about_intro_title: '',
    about_intro_desc: '',
    about_intro_location_text: '',
    about_founder_name: '',
    about_founder_title: '',
    about_founder_story: '',
    about_founder_quote: '',
    about_founder_avatar_url: '',
    about_card1_title: '',
    about_card1_desc: '',
    about_card1_icon: '',
    about_card2_title: '',
    about_card2_desc: '',
    about_card2_icon: '',
    about_card3_title: '',
    about_card3_desc: '',
    about_card3_icon: '',
    about_card4_title: '',
    about_card4_desc: '',
    about_card4_icon: '',
    about_card5_title: '',
    about_card5_desc: '',
    about_card5_icon: '',
    about_card6_title: '',
    about_card6_desc: '',
    about_card6_icon: '',
    about_why_card1_title: '',
    about_why_card1_desc: '',
    about_why_card2_title: '',
    about_why_card2_desc: '',
    about_why_card3_title: '',
    about_why_card3_desc: '',
    about_why_card4_title: '',
    about_why_card4_desc: '',
    about_why_card5_title: '',
    about_why_card5_desc: '',
    about_why_card6_title: '',
    about_why_card6_desc: '',
    about_step1_title: '',
    about_step1_desc: '',
    about_step2_title: '',
    about_step2_desc: '',
    about_step3_title: '',
    about_step3_desc: '',
    about_step4_title: '',
    about_step4_desc: '',
    about_step5_title: '',
    about_step5_desc: '',
    about_safety_card1_title: '',
    about_safety_card1_desc: '',
    about_safety_card2_title: '',
    about_safety_card2_desc: '',
    about_safety_card3_title: '',
    about_safety_card3_desc: '',
    about_safety_card4_title: '',
    about_safety_card4_desc: '',
    about_safety_card5_title: '',
    about_safety_card5_desc: '',
    about_safety_card6_title: '',
    about_safety_card6_desc: '',
    about_cta_title: '',
    about_cta_desc: '',

    // Special Offers Section
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
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingQr, setUploadingQr] = useState(false);
  const [uploadingFounderAvatar, setUploadingFounderAvatar] = useState(false);

  useEffect(() => {
    // Fetch logged in user email and check session
    const checkAuthAndLoadSettings = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/admin/login');
        return;
      }
      setUserEmail(session.user.email || null);
      
      // Load business settings
      try {
        const res = await fetch(`/api/settings?t=${Date.now()}`, {
          cache: 'no-store'
        });
        if (!res.ok) throw new Error('Failed to load profile settings');
        const data = await res.json();
        
        if (data && Object.keys(data).length > 0) {
          setProfileData({
            business_name: data.business_name || '',
            business_email: data.business_email || '',
            business_phone: data.business_phone || '',
            business_whatsapp: data.business_whatsapp || '',
            business_address: data.business_address || '',
            business_city: data.business_city || '',
            business_state: data.business_state || '',
            business_pincode: data.business_pincode || '',
            business_hours: data.business_hours || '',
            whatsapp_default_msg: data.whatsapp_default_msg || '',
            maps_embed_url: data.maps_embed_url || '',
            business_logo_url: data.business_logo_url || '',
            business_upi_qr_url: data.business_upi_qr_url || '',
            business_subtitle: data.business_subtitle || '',
            hero_tagline: data.hero_tagline || '',
            hero_title_p1: data.hero_title_p1 || '',
            hero_title_p2: data.hero_title_p2 || '',
            hero_description: data.hero_description || '',
            hero_stat1_value: data.hero_stat1_value || '',
            hero_stat1_label: data.hero_stat1_label || '',
            hero_stat2_value: data.hero_stat2_value || '',
            hero_stat2_label: data.hero_stat2_label || '',
            business_reg_no: data.business_reg_no || '',
            business_udyam_no: data.business_udyam_no || '',
            business_gst_no: data.business_gst_no || '',
            business_seo_title: data.business_seo_title || '',
            business_seo_description: data.business_seo_description || '',
            business_seo_keywords: data.business_seo_keywords || '',
            business_google_site_verification: data.business_google_site_verification || '',
            business_google_analytics_id: data.business_google_analytics_id || '',
            business_meta_pixel_id: data.business_meta_pixel_id || '',
            business_site_url: data.business_site_url || '',
            business_instagram_url: data.business_instagram_url || '',
            theme_primary_color: data.theme_primary_color || '#0B1F3A',
            theme_accent_color: data.theme_accent_color || '#E89B10',
            
            // About Section fallbacks
            about_hero_title: data.about_hero_title || ABOUT_DEFAULTS.about_hero_title,
            about_hero_subtitle: data.about_hero_subtitle || ABOUT_DEFAULTS.about_hero_subtitle,
            about_stat_trips: data.about_stat_trips || ABOUT_DEFAULTS.about_stat_trips,
            about_stat_trips_label: data.about_stat_trips_label || ABOUT_DEFAULTS.about_stat_trips_label,
            about_stat_customers: data.about_stat_customers || ABOUT_DEFAULTS.about_stat_customers,
            about_stat_customers_label: data.about_stat_customers_label || ABOUT_DEFAULTS.about_stat_customers_label,
            about_stat_vehicles: data.about_stat_vehicles || ABOUT_DEFAULTS.about_stat_vehicles,
            about_stat_vehicles_label: data.about_stat_vehicles_label || ABOUT_DEFAULTS.about_stat_vehicles_label,
            about_stat_cities: data.about_stat_cities || ABOUT_DEFAULTS.about_stat_cities,
            about_stat_cities_label: data.about_stat_cities_label || ABOUT_DEFAULTS.about_stat_cities_label,
            about_intro_title: data.about_intro_title || ABOUT_DEFAULTS.about_intro_title,
            about_intro_desc: data.about_intro_desc || ABOUT_DEFAULTS.about_intro_desc,
            about_intro_location_text: data.about_intro_location_text || ABOUT_DEFAULTS.about_intro_location_text,
            about_founder_name: data.about_founder_name || ABOUT_DEFAULTS.about_founder_name,
            about_founder_title: data.about_founder_title || ABOUT_DEFAULTS.about_founder_title,
            about_founder_story: data.about_founder_story || ABOUT_DEFAULTS.about_founder_story,
            about_founder_quote: data.about_founder_quote || ABOUT_DEFAULTS.about_founder_quote,
            about_founder_avatar_url: data.about_founder_avatar_url || ABOUT_DEFAULTS.about_founder_avatar_url,
            about_card1_title: data.about_card1_title || ABOUT_DEFAULTS.about_card1_title,
            about_card1_desc: data.about_card1_desc || ABOUT_DEFAULTS.about_card1_desc,
            about_card1_icon: data.about_card1_icon || ABOUT_DEFAULTS.about_card1_icon,
            about_card2_title: data.about_card2_title || ABOUT_DEFAULTS.about_card2_title,
            about_card2_desc: data.about_card2_desc || ABOUT_DEFAULTS.about_card2_desc,
            about_card2_icon: data.about_card2_icon || ABOUT_DEFAULTS.about_card2_icon,
            about_card3_title: data.about_card3_title || ABOUT_DEFAULTS.about_card3_title,
            about_card3_desc: data.about_card3_desc || ABOUT_DEFAULTS.about_card3_desc,
            about_card3_icon: data.about_card3_icon || ABOUT_DEFAULTS.about_card3_icon,
            about_card4_title: data.about_card4_title || ABOUT_DEFAULTS.about_card4_title,
            about_card4_desc: data.about_card4_desc || ABOUT_DEFAULTS.about_card4_desc,
            about_card4_icon: data.about_card4_icon || ABOUT_DEFAULTS.about_card4_icon,
            about_card5_title: data.about_card5_title || ABOUT_DEFAULTS.about_card5_title,
            about_card5_desc: data.about_card5_desc || ABOUT_DEFAULTS.about_card5_desc,
            about_card5_icon: data.about_card5_icon || ABOUT_DEFAULTS.about_card5_icon,
            about_card6_title: data.about_card6_title || ABOUT_DEFAULTS.about_card6_title,
            about_card6_desc: data.about_card6_desc || ABOUT_DEFAULTS.about_card6_desc,
            about_card6_icon: data.about_card6_icon || ABOUT_DEFAULTS.about_card6_icon,
            about_why_card1_title: data.about_why_card1_title || ABOUT_DEFAULTS.about_why_card1_title,
            about_why_card1_desc: data.about_why_card1_desc || ABOUT_DEFAULTS.about_why_card1_desc,
            about_why_card2_title: data.about_why_card2_title || ABOUT_DEFAULTS.about_why_card2_title,
            about_why_card2_desc: data.about_why_card2_desc || ABOUT_DEFAULTS.about_why_card2_desc,
            about_why_card3_title: data.about_why_card3_title || ABOUT_DEFAULTS.about_why_card3_title,
            about_why_card3_desc: data.about_why_card3_desc || ABOUT_DEFAULTS.about_why_card3_desc,
            about_why_card4_title: data.about_why_card4_title || ABOUT_DEFAULTS.about_why_card4_title,
            about_why_card4_desc: data.about_why_card4_desc || ABOUT_DEFAULTS.about_why_card4_desc,
            about_why_card5_title: data.about_why_card5_title || ABOUT_DEFAULTS.about_why_card5_title,
            about_why_card5_desc: data.about_why_card5_desc || ABOUT_DEFAULTS.about_why_card5_desc,
            about_why_card6_title: data.about_why_card6_title || ABOUT_DEFAULTS.about_why_card6_title,
            about_why_card6_desc: data.about_why_card6_desc || ABOUT_DEFAULTS.about_why_card6_desc,
            about_step1_title: data.about_step1_title || ABOUT_DEFAULTS.about_step1_title,
            about_step1_desc: data.about_step1_desc || ABOUT_DEFAULTS.about_step1_desc,
            about_step2_title: data.about_step2_title || ABOUT_DEFAULTS.about_step2_title,
            about_step2_desc: data.about_step2_desc || ABOUT_DEFAULTS.about_step2_desc,
            about_step3_title: data.about_step3_title || ABOUT_DEFAULTS.about_step3_title,
            about_step3_desc: data.about_step3_desc || ABOUT_DEFAULTS.about_step3_desc,
            about_step4_title: data.about_step4_title || ABOUT_DEFAULTS.about_step4_title,
            about_step4_desc: data.about_step4_desc || ABOUT_DEFAULTS.about_step4_desc,
            about_step5_title: data.about_step5_title || ABOUT_DEFAULTS.about_step5_title,
            about_step5_desc: data.about_step5_desc || ABOUT_DEFAULTS.about_step5_desc,
            about_safety_card1_title: data.about_safety_card1_title || ABOUT_DEFAULTS.about_safety_card1_title,
            about_safety_card1_desc: data.about_safety_card1_desc || ABOUT_DEFAULTS.about_safety_card1_desc,
            about_safety_card2_title: data.about_safety_card2_title || ABOUT_DEFAULTS.about_safety_card2_title,
            about_safety_card2_desc: data.about_safety_card2_desc || ABOUT_DEFAULTS.about_safety_card2_desc,
            about_safety_card3_title: data.about_safety_card3_title || ABOUT_DEFAULTS.about_safety_card3_title,
            about_safety_card3_desc: data.about_safety_card3_desc || ABOUT_DEFAULTS.about_safety_card3_desc,
            about_safety_card4_title: data.about_safety_card4_title || ABOUT_DEFAULTS.about_safety_card4_title,
            about_safety_card4_desc: data.about_safety_card4_desc || ABOUT_DEFAULTS.about_safety_card4_desc,
            about_safety_card5_title: data.about_safety_card5_title || ABOUT_DEFAULTS.about_safety_card5_title,
            about_safety_card5_desc: data.about_safety_card5_desc || ABOUT_DEFAULTS.about_safety_card5_desc,
            about_safety_card6_title: data.about_safety_card6_title || ABOUT_DEFAULTS.about_safety_card6_title,
            about_safety_card6_desc: data.about_safety_card6_desc || ABOUT_DEFAULTS.about_safety_card6_desc,
            about_cta_title: data.about_cta_title || ABOUT_DEFAULTS.about_cta_title,
            about_cta_desc: data.about_cta_desc || ABOUT_DEFAULTS.about_cta_desc,

            // Special Offers Section
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
        toast.error('Error fetching business settings');
        console.error(err);
      } finally {
        setLoadingProfile(false);
      }
    };
    checkAuthAndLoadSettings();
  }, [router]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userEmail) return;
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setLoadingPassword(true);

    try {
      // Step 1: Verify current password by explicitly signing in via API
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: currentPassword,
      });

      if (verifyError) {
        toast.error('Current password is incorrect');
        setLoadingPassword(false);
        return;
      }

      // Step 2: Push New Password to Supabase auth record
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) {
        toast.error(`Update failed: ${updateError.message}`);
        setLoadingPassword(false);
        return;
      }

      toast.success('Password updated securely! Re-authenticating...', { duration: 4000 });
      
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      setTimeout(async () => {
        await supabase.auth.signOut();
        router.push('/admin/login');
      }, 1500);

    } catch (err: any) {
      toast.error("A network error occurred.");
    } finally {
      if(!newPassword) setLoadingPassword(false);
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Logo image must be under 2MB.');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPG, PNG, WEBP, and SVG logos are supported.');
      return;
    }

    setUploadingLogo(true);
    try {
      const ext = file.name.split('.').pop() || 'png';
      const fileName = `logo-${Date.now()}.${ext}`;

      const { data, error } = await supabase.storage
        .from('hero-images')
        .upload(fileName, file, {
          upsert: true,
          contentType: file.type,
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('hero-images')
        .getPublicUrl(fileName);

      setProfileData(prev => ({ ...prev, business_logo_url: publicUrl }));
      toast.success('Logo uploaded successfully!');
    } catch (err: any) {
      console.error('Error uploading logo:', err);
      toast.error(`Logo upload failed: ${err.message}`);
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleQrUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('QR Code image must be under 2MB.');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPG, PNG, WEBP, and SVG formats are supported.');
      return;
    }

    setUploadingQr(true);
    try {
      const ext = file.name.split('.').pop() || 'png';
      const fileName = `upi-qr-${Date.now()}.${ext}`;

      const { data, error } = await supabase.storage
         .from('hero-images')
         .upload(fileName, file, {
           upsert: true,
           contentType: file.type,
         });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
         .from('hero-images')
         .getPublicUrl(fileName);

      setProfileData(prev => ({ ...prev, business_upi_qr_url: publicUrl }));
      toast.success('UPI QR Code uploaded successfully!');
    } catch (err: any) {
      console.error('Error uploading QR code:', err);
      toast.error(`QR Code upload failed: ${err.message}`);
    } finally {
      setUploadingQr(false);
    }
  };

  const handleFounderAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Avatar image must be under 2MB.');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPG, PNG, and WEBP formats are supported.');
      return;
    }

    setUploadingFounderAvatar(true);
    try {
      const ext = file.name.split('.').pop() || 'png';
      const fileName = `founder-${Date.now()}.${ext}`;

      const { data, error } = await supabase.storage
        .from('hero-images')
        .upload(fileName, file, {
          upsert: true,
          contentType: file.type,
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('hero-images')
        .getPublicUrl(fileName);

      setProfileData(prev => ({ ...prev, about_founder_avatar_url: publicUrl }));
      toast.success('Founder avatar uploaded successfully!');
    } catch (err: any) {
      console.error('Error uploading avatar:', err);
      toast.error(`Avatar upload failed: ${err.message}`);
    } finally {
      setUploadingFounderAvatar(false);
    }
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);

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
        body: JSON.stringify(profileData)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update settings');
      }

      toast.success('Business settings updated successfully!');
      
      // Trigger a settings refresh on components consuming useSettings
      window.dispatchEvent(new Event('visibilitychange'));
    } catch (err: any) {
      toast.error(err.message || 'Failed to save business settings');
      console.error(err);
    } finally {
      setSavingProfile(false);
    }
  };

  if (!userEmail) return null; // Wait for auth check

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
      <Toaster position="top-right" />
      
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#0B1F3A] tracking-tight flex items-center gap-3">
            {isSuperAdmin ? (
              <>
                <ShieldCheck size={32} className="text-[#E89B10]" />
                Control Center Settings
              </>
            ) : (
              <>
                <LockKeyhole size={32} className="text-[#E89B10]" />
                Change Password
              </>
            )}
          </h1>
          <p className="text-slate-500 mt-1">
            {isSuperAdmin 
              ? "Manage website settings, branding details, and security passwords."
              : "Update your dashboard account login password securely."}
          </p>
        </div>

        {/* Dynamic Tab Switchers - Hidden for non-super-admins */}
        {isSuperAdmin && (
          <div className="flex bg-gray-100 p-1 rounded-xl self-start md:self-center border border-gray-200">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-5 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${
                activeTab === 'profile'
                  ? 'bg-white text-[#0B1F3A] shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Building2 size={16} />
              Business Profile
            </button>
            <button
              onClick={() => setActiveTab('hero')}
              className={`px-5 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${
                activeTab === 'hero'
                  ? 'bg-white text-[#0B1F3A] shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Sliders size={16} />
              Hero Settings
            </button>
            <button
              onClick={() => setActiveTab('seo')}
              className={`px-5 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${
                activeTab === 'seo'
                  ? 'bg-white text-[#0B1F3A] shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Globe size={16} />
              SEO & Pixels
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`px-5 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${
                activeTab === 'about'
                  ? 'bg-white text-[#0B1F3A] shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Info size={16} />
              About Page
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`px-5 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${
                activeTab === 'security'
                  ? 'bg-white text-[#0B1F3A] shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <LockKeyhole size={16} />
              Security & Pass
            </button>
          </div>
        )}
      </div>

      {/* Tab Content: Business Profile Settings */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-xl font-bold text-[#0B1F3A]">Identity & Business profile</h2>
            <p className="text-sm text-gray-500 mt-1">Customize website name, email, contact, whatsapp and maps coordinates for buyers.</p>
          </div>

          {loadingProfile ? (
            <div className="p-16 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-[3px] border-[#0B1F3A] border-t-transparent rounded-full animate-spin" />
                <span className="text-gray-500 text-sm font-medium">Fetching settings...</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleProfileSave} className="p-8 space-y-6">
              
              {/* Logo & UPI QR Code Upload Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Logo Upload Section */}
                <div className="p-6 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50 flex items-center gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center relative overflow-hidden shrink-0">
                    {profileData.business_logo_url ? (
                      <img 
                        src={profileData.business_logo_url} 
                        alt="Business Logo Preview" 
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <Building2 size={24} />
                        <span className="text-[10px] font-bold mt-1">NO LOGO</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <h4 className="text-sm font-bold text-[#0B1F3A]">Logo Icon Image</h4>
                    <p className="text-xs text-gray-400">Upload a square logo (PNG, JPG, WEBP, SVG) up to 2MB.</p>
                    
                    <div className="flex flex-wrap gap-3 items-center">
                      <label className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 
                        ${uploadingLogo 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-[#0B1F3A] hover:bg-[#0B1F3A]/90 text-white shadow-md hover:shadow-lg'}`}
                      >
                        <Upload size={14} />
                        {uploadingLogo ? 'Uploading...' : 'Choose File'}
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleLogoUpload} 
                          disabled={uploadingLogo} 
                          className="hidden" 
                        />
                      </label>
                      
                      {profileData.business_logo_url && (
                        <button
                          type="button"
                          onClick={() => setProfileData(prev => ({ ...prev, business_logo_url: '' }))}
                          className="px-4 py-2 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 text-xs font-bold transition-all flex items-center gap-1.5"
                        >
                          <Trash2 size={14} />
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* QR Code Upload Section */}
                <div className="p-6 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50 flex items-center gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center relative overflow-hidden shrink-0">
                    {profileData.business_upi_qr_url ? (
                      <img 
                        src={profileData.business_upi_qr_url} 
                        alt="UPI QR Code Preview" 
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <Upload size={24} />
                        <span className="text-[10px] font-bold mt-1">DEFAULT QR</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <h4 className="text-sm font-bold text-[#0B1F3A]">Payment UPI QR Code</h4>
                    <p className="text-xs text-gray-400">Upload your UPI QR image (PNG, JPG, WEBP, SVG) up to 2MB.</p>
                    
                    <div className="flex flex-wrap gap-3 items-center">
                      <label className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 
                        ${uploadingQr 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-[#0B1F3A] hover:bg-[#0B1F3A]/90 text-white shadow-md hover:shadow-lg'}`}
                      >
                        <Upload size={14} />
                        {uploadingQr ? 'Uploading...' : 'Choose File'}
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleQrUpload} 
                          disabled={uploadingQr} 
                          className="hidden" 
                        />
                      </label>
                      
                      {profileData.business_upi_qr_url && (
                        <button
                          type="button"
                          onClick={() => setProfileData(prev => ({ ...prev, business_upi_qr_url: '' }))}
                          className="px-4 py-2 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 text-xs font-bold transition-all flex items-center gap-1.5"
                        >
                          <Trash2 size={14} />
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Theme Styling Settings */}
              <div className="p-6 border border-gray-200 rounded-2xl bg-gray-50/50 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-200/60 pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-[#0B1F3A]">Website Theme Colors</h4>
                    <p className="text-xs text-gray-400">Choose custom colors to change the branding of your website dynamically.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setProfileData(prev => ({ ...prev, theme_primary_color: '#0B1F3A', theme_accent_color: '#E89B10' }))}
                    className="px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 text-xs font-bold text-gray-600 transition-all"
                  >
                    Reset to Defaults
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Primary Color */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded-full border border-gray-200" style={{ backgroundColor: profileData.theme_primary_color || '#0B1F3A' }} />
                      Primary Theme Color (Default Navy: #0B1F3A)
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        name="theme_primary_color"
                        value={profileData.theme_primary_color || '#0B1F3A'}
                        onChange={handleProfileChange}
                        className="w-12 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5"
                      />
                      <input
                        type="text"
                        name="theme_primary_color"
                        value={profileData.theme_primary_color || '#0B1F3A'}
                        onChange={handleProfileChange}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E89B10] transition-all bg-white font-mono uppercase"
                        placeholder="#0B1F3A"
                      />
                    </div>
                  </div>

                  {/* Accent Color */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded-full border border-gray-200" style={{ backgroundColor: profileData.theme_accent_color || '#E89B10' }} />
                      Accent / Highlight Color (Default Gold: #E89B10)
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        name="theme_accent_color"
                        value={profileData.theme_accent_color || '#E89B10'}
                        onChange={handleProfileChange}
                        className="w-12 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5"
                      />
                      <input
                        type="text"
                        name="theme_accent_color"
                        value={profileData.theme_accent_color || '#E89B10'}
                        onChange={handleProfileChange}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E89B10] transition-all bg-white font-mono uppercase"
                        placeholder="#E89B10"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Business Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Building2 size={14} className="text-gray-400" />
                    Website / Business Name
                  </label>
                  <input
                    type="text"
                    name="business_name"
                    required
                    value={profileData.business_name}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E89B10] transition-all bg-white"
                    placeholder="e.g. Car Rental"
                  />
                </div>

                {/* Business Subtitle */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Building2 size={14} className="text-gray-400" />
                    Logo Subtitle
                  </label>
                  <input
                    type="text"
                    name="business_subtitle"
                    required
                    value={profileData.business_subtitle}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E89B10] transition-all bg-white"
                    placeholder="e.g. Car Rental Services"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Mail size={14} className="text-gray-400" />
                    Business Email Address
                  </label>
                  <input
                    type="email"
                    name="business_email"
                    required
                    value={profileData.business_email}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E89B10] transition-all bg-white"
                    placeholder="e.g. contact@mybusiness.com"
                  />
                </div>

                {/* Contact Phone */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Phone size={14} className="text-gray-400" />
                    Display Phone Number (with Country Code)
                  </label>
                  <input
                    type="text"
                    name="business_phone"
                    required
                    value={profileData.business_phone}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E89B10] transition-all bg-white"
                    placeholder="e.g. +919111330558"
                  />
                </div>

                {/* WhatsApp Number */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Phone size={14} className="text-gray-400" />
                    WhatsApp Direct Mobile (no plus/spaces)
                  </label>
                  <input
                    type="text"
                    name="business_whatsapp"
                    required
                    value={profileData.business_whatsapp}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E89B10] transition-all bg-white"
                    placeholder="e.g. 919111330558"
                  />
                </div>

                {/* City & State */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <MapPin size={14} className="text-gray-400" />
                    City
                  </label>
                  <input
                    type="text"
                    name="business_city"
                    required
                    value={profileData.business_city}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E89B10] transition-all bg-white"
                    placeholder="e.g. Indore"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <MapPin size={14} className="text-gray-400" />
                    State
                  </label>
                  <input
                    type="text"
                    name="business_state"
                    required
                    value={profileData.business_state}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E89B10] transition-all bg-white"
                    placeholder="e.g. Madhya Pradesh"
                  />
                </div>

                {/* Pin Code & Hours */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <MapPin size={14} className="text-gray-400" />
                    Postal Pin Code
                  </label>
                  <input
                    type="text"
                    name="business_pincode"
                    required
                    value={profileData.business_pincode}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E89B10] transition-all bg-white"
                    placeholder="e.g. 452001"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Clock size={14} className="text-gray-400" />
                    Working Hours
                  </label>
                  <input
                    type="text"
                    name="business_hours"
                    required
                    value={profileData.business_hours}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E89B10] transition-all bg-white"
                    placeholder="e.g. Mon–Sun 24x7"
                  />
                </div>

              </div>

              {/* Business Address */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <MapPin size={14} className="text-gray-400" />
                  Full Physical Address
                </label>
                <textarea
                  name="business_address"
                  required
                  rows={2}
                  value={profileData.business_address}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E89B10] transition-all bg-white"
                  placeholder="Street name, landmark, City Pin Code"
                />
              </div>

              {/* WhatsApp Default Message */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <MessageSquare size={14} className="text-gray-400" />
                  Default WhatsApp Message Text
                </label>
                <input
                  type="text"
                  name="whatsapp_default_msg"
                  required
                  value={profileData.whatsapp_default_msg}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E89B10] transition-all bg-white"
                  placeholder="e.g. Hi! I want to book a self drive car in Indore."
                />
              </div>

              {/* Maps Embed URL */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Map size={14} className="text-gray-400" />
                  Google Maps Embed iframe Source URL (src value inside google map share iframe tag)
                </label>
                <textarea
                  name="maps_embed_url"
                  required
                  rows={2}
                  value={profileData.maps_embed_url}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E89B10] transition-all bg-white"
                  placeholder="https://www.google.com/maps/embed?pb=..."
                />
              </div>

              {/* Registration & Tax Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <FileText size={14} className="text-gray-400" />
                    Registration Number (REG. No)
                  </label>
                  <input
                    type="text"
                    name="business_reg_no"
                    value={profileData.business_reg_no}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E89B10] transition-all bg-white"
                    placeholder="e.g. INDO250409SE001514"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <FileText size={14} className="text-gray-400" />
                    Udyam Number
                  </label>
                  <input
                    type="text"
                    name="business_udyam_no"
                    value={profileData.business_udyam_no}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E89B10] transition-all bg-white"
                    placeholder="e.g. UDYAM-MP-23-0207225"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <FileText size={14} className="text-gray-400" />
                    GST Number (GSTIN)
                  </label>
                  <input
                    type="text"
                    name="business_gst_no"
                    value={profileData.business_gst_no}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E89B10] transition-all bg-white"
                    placeholder="e.g. 23AAAAA0000A1Z0"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="w-full bg-[#0B1F3A] text-white px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#0B1F3A]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {savingProfile ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving changes...
                    </>
                  ) : (
                    'Save Profile & Settings'
                  )}
                </button>
              </div>

            </form>
          )}
        </div>
      )}

      {/* Tab Content: Hero Settings */}
      {activeTab === 'hero' && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-xl font-bold text-[#0B1F3A]">Hero Section Customization</h2>
            <p className="text-sm text-gray-500 mt-1">Configure tagline badge, main heading lines, description text and counter metrics on your homepage hero banner.</p>
          </div>

          {loadingProfile ? (
            <div className="p-16 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-[3px] border-[#0B1F3A] border-t-transparent rounded-full animate-spin" />
                <span className="text-gray-500 text-sm font-medium">Fetching settings...</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleProfileSave} className="p-8 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Hero Tagline */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sliders size={14} className="text-gray-400" />
                    Tagline (Upper Badge Text)
                  </label>
                  <input
                    type="text"
                    name="hero_tagline"
                    required
                    value={profileData.hero_tagline}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E89B10] transition-all bg-white"
                    placeholder="e.g. Now Serving Indore, Goa & Jaipur"
                  />
                </div>

                {/* Hero Title Line 1 */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sliders size={14} className="text-gray-400" />
                    Main Heading Line 1 (White text)
                  </label>
                  <input
                    type="text"
                    name="hero_title_p1"
                    required
                    value={profileData.hero_title_p1}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E89B10] transition-all bg-white"
                    placeholder="e.g. Self Drive Car"
                  />
                </div>

                {/* Hero Title Line 2 */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sliders size={14} className="text-gray-400" />
                    Main Heading Line 2 (Highlighted Gradient text)
                  </label>
                  <input
                    type="text"
                    name="hero_title_p2"
                    required
                    value={profileData.hero_title_p2}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E89B10] transition-all bg-white"
                    placeholder="e.g. Rental in Indore"
                  />
                </div>

                {/* Hero Description */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sliders size={14} className="text-gray-400" />
                    Hero Section Description / Subtitle
                  </label>
                  <textarea
                    name="hero_description"
                    required
                    rows={3}
                    value={profileData.hero_description}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E89B10] transition-all bg-white"
                    placeholder="e.g. Premium self-drive car rental service with zero security deposit..."
                  />
                </div>

                {/* Metric 1 Value */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sliders size={14} className="text-gray-400" />
                    Stat Metric 1 Counter (Number only)
                  </label>
                  <input
                    type="number"
                    name="hero_stat1_value"
                    required
                    value={profileData.hero_stat1_value}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E89B10] transition-all bg-white"
                    placeholder="e.g. 1500"
                  />
                </div>

                {/* Metric 1 Label */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sliders size={14} className="text-gray-400" />
                    Stat Metric 1 Label Text
                  </label>
                  <input
                    type="text"
                    name="hero_stat1_label"
                    required
                    value={profileData.hero_stat1_label}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E89B10] transition-all bg-white"
                    placeholder="e.g. Happy Customers"
                  />
                </div>

                {/* Metric 2 Value */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sliders size={14} className="text-gray-400" />
                    Stat Metric 2 Counter (Number only)
                  </label>
                  <input
                    type="number"
                    name="hero_stat2_value"
                    required
                    value={profileData.hero_stat2_value}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E89B10] transition-all bg-white"
                    placeholder="e.g. 100"
                  />
                </div>

                {/* Metric 2 Label */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sliders size={14} className="text-gray-400" />
                    Stat Metric 2 Label Text
                  </label>
                  <input
                    type="text"
                    name="hero_stat2_label"
                    required
                    value={profileData.hero_stat2_label}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E89B10] transition-all bg-white"
                    placeholder="e.g. Cars in Fleet"
                  />
                </div>

              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="w-full bg-[#0B1F3A] text-white px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#0B1F3A]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {savingProfile ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving changes...
                    </>
                  ) : (
                    'Save Hero Section Settings'
                  )}
                </button>
              </div>

            </form>
          )}
        </div>
      )}

      {/* Tab Content: SEO & Analytics Settings */}
      {activeTab === 'seo' && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-xl font-bold text-[#0B1F3A]">SEO & Analytics Configuration</h2>
            <p className="text-sm text-gray-500 mt-1">Configure search engine metadata, site indexing verification, and dynamic user tracking codes.</p>
          </div>

          {loadingProfile ? (
            <div className="p-16 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-[3px] border-[#0B1F3A] border-t-transparent rounded-full animate-spin" />
                <span className="text-gray-500 text-sm font-medium">Fetching settings...</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleProfileSave} className="p-8 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Custom Page Title Template */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Globe size={14} className="text-gray-400" />
                    SEO Meta Title (Overrides homepage title tag)
                  </label>
                  <input
                    type="text"
                    name="business_seo_title"
                    value={profileData.business_seo_title || ''}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E89B10] transition-all bg-white"
                    placeholder="e.g. My Business | Best Self Drive Cars in Indore"
                  />
                </div>

                {/* SEO Description */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Globe size={14} className="text-gray-400" />
                    SEO Meta Description (Summary for Google listing)
                  </label>
                  <textarea
                    name="business_seo_description"
                    rows={3}
                    value={profileData.business_seo_description || ''}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E89B10] transition-all bg-white"
                    placeholder="Provide a search snippet (recommended: 150-160 characters)..."
                  />
                </div>

                {/* Meta Keywords */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Globe size={14} className="text-gray-400" />
                    Meta Keywords (comma-separated values)
                  </label>
                  <input
                    type="text"
                    name="business_seo_keywords"
                    value={profileData.business_seo_keywords || ''}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E89B10] transition-all bg-white"
                    placeholder="e.g. car rental, self drive indore, rent car indore"
                  />
                </div>

                {/* Website URL */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Globe size={14} className="text-gray-400" />
                    Website Canonical Domain URL
                  </label>
                  <input
                    type="url"
                    name="business_site_url"
                    value={profileData.business_site_url || ''}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E89B10] transition-all bg-white"
                    placeholder="e.g. https://www.selfdrivecarrental.in"
                  />
                  <p className="text-xs text-gray-400 mt-1">The primary absolute URL of your website used for sitemaps, robots.txt, and metadata tags.</p>
                </div>

                {/* Google Site Verification */}
                <div className="md:col-span-2 pt-4 border-t border-gray-100">
                  <h3 className="text-sm font-bold text-[#0B1F3A] mb-3 flex items-center gap-2">
                    <Globe size={16} className="text-[#E89B10]" />
                    Search Console Indexing
                  </h3>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Google Site Verification Code (content parameter in google-site-verification HTML tag)
                  </label>
                  <input
                    type="text"
                    name="business_google_site_verification"
                    value={profileData.business_google_site_verification || ''}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E89B10] transition-all bg-white"
                    placeholder="e.g. AbCdeF_gHiJkLmNoPqRsTuVwXyZ1234567890"
                  />
                  <p className="text-xs text-gray-400 mt-1">This validates ownership of your domain in Google Search Console to index your website pages.</p>
                </div>

                {/* Trackers Section */}
                <div className="md:col-span-2 pt-4 border-t border-gray-100">
                  <h3 className="text-sm font-bold text-[#0B1F3A] mb-3 flex items-center gap-2">
                    <BarChart3 size={16} className="text-[#E89B10]" />
                    Analytics & Pixel Trackers
                  </h3>
                </div>

                {/* Google Analytics ID */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <BarChart3 size={14} className="text-gray-400" />
                    Google Tag / Analytics ID (G-..., AW-..., GT-...)
                  </label>
                  <input
                    type="text"
                    name="business_google_analytics_id"
                    value={profileData.business_google_analytics_id || ''}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E89B10] transition-all bg-white"
                    placeholder="e.g. G-H67JK89L3B or AW-109283746"
                  />
                </div>

                {/* Meta Pixel ID */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <BarChart3 size={14} className="text-gray-400" />
                    Meta Pixel ID (Facebook Ads Pixel)
                  </label>
                  <input
                    type="text"
                    name="business_meta_pixel_id"
                    value={profileData.business_meta_pixel_id || ''}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E89B10] transition-all bg-white"
                    placeholder="e.g. 102938475610293"
                  />
                </div>

                {/* Instagram Profile URL */}
                <div className="md:col-span-2 pt-4 border-t border-gray-100">
                  <h3 className="text-sm font-bold text-[#0B1F3A] mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#E89B10]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                    Social Profile Connections
                  </h3>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Instagram Handle/Profile Link
                  </label>
                  <input
                    type="url"
                    name="business_instagram_url"
                    value={profileData.business_instagram_url || ''}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E89B10] transition-all bg-white"
                    placeholder="e.g. https://www.instagram.com/myprofile/"
                  />
                  <p className="text-xs text-gray-400 mt-1">This connects your Instagram link dynamically on the public pages (e.g. Follow Our Journey reels section CTA).</p>
                </div>

              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="w-full bg-[#0B1F3A] text-white px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#0B1F3A]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {savingProfile ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving changes...
                    </>
                  ) : (
                    'Save SEO & Tracking Settings'
                  )}
                </button>
              </div>

            </form>
          )}
        </div>
      )}

      {/* Tab Content: About Page Settings */}
      {activeTab === 'about' && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-xl font-bold text-[#0B1F3A]">About Page Customization</h2>
            <p className="text-sm text-gray-500 mt-1">Configure layout contents, statistics, timelines, and founder details for the premium About Page.</p>
          </div>

          {loadingProfile ? (
            <div className="p-16 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-[3px] border-[#0B1F3A] border-t-transparent rounded-full animate-spin" />
                <span className="text-gray-500 text-sm font-medium">Fetching settings...</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleProfileSave} className="p-8 space-y-6">
              <div className="space-y-4">
                
                {/* 1. Hero & Counter Metrics */}
                <details className="group border border-gray-200 rounded-2xl p-6 bg-gray-50/20" open>
                  <summary className="flex items-center justify-between cursor-pointer focus:outline-none list-none">
                    <h3 className="text-md font-bold text-[#0B1F3A] flex items-center gap-2">
                      <Sliders size={18} className="text-[#E89B10]" />
                      1. About Hero Section & Counter Stats
                    </h3>
                    <span className="transition group-open:-rotate-180">
                      <span className="material-symbols-outlined text-gray-500">expand_more</span>
                    </span>
                  </summary>
                  <div className="mt-6 space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Hero Main Title</label>
                      <input type="text" name="about_hero_title" value={profileData.about_hero_title} onChange={handleProfileChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E89B10] bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Hero Subtitle</label>
                      <textarea name="about_hero_subtitle" rows={2} value={profileData.about_hero_subtitle} onChange={handleProfileChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E89B10] bg-white" />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Stat 1 (Trips)</label>
                        <input type="text" name="about_stat_trips" value={profileData.about_stat_trips} onChange={handleProfileChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E89B10] bg-white" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Stat 1 Label</label>
                        <input type="text" name="about_stat_trips_label" value={profileData.about_stat_trips_label} onChange={handleProfileChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E89B10] bg-white" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Stat 2 (Customers)</label>
                        <input type="text" name="about_stat_customers" value={profileData.about_stat_customers} onChange={handleProfileChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E89B10] bg-white" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Stat 2 Label</label>
                        <input type="text" name="about_stat_customers_label" value={profileData.about_stat_customers_label} onChange={handleProfileChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E89B10] bg-white" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Stat 3 (Vehicles)</label>
                        <input type="text" name="about_stat_vehicles" value={profileData.about_stat_vehicles} onChange={handleProfileChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E89B10] bg-white" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Stat 3 Label</label>
                        <input type="text" name="about_stat_vehicles_label" value={profileData.about_stat_vehicles_label} onChange={handleProfileChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E89B10] bg-white" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Stat 4 (Cities)</label>
                        <input type="text" name="about_stat_cities" value={profileData.about_stat_cities} onChange={handleProfileChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E89B10] bg-white" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Stat 4 Label</label>
                        <input type="text" name="about_stat_cities_label" value={profileData.about_stat_cities_label} onChange={handleProfileChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E89B10] bg-white" />
                      </div>
                    </div>
                  </div>
                </details>

                {/* 2. Company Introduction */}
                <details className="group border border-gray-200 rounded-2xl p-6 bg-gray-50/20">
                  <summary className="flex items-center justify-between cursor-pointer focus:outline-none list-none">
                    <h3 className="text-md font-bold text-[#0B1F3A] flex items-center gap-2">
                      <Building2 size={18} className="text-[#E89B10]" />
                      2. Company Introduction & Left/Right Columns
                    </h3>
                    <span className="transition group-open:-rotate-180">
                      <span className="material-symbols-outlined text-gray-500">expand_more</span>
                    </span>
                  </summary>
                  <div className="mt-6 space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Introduction Heading</label>
                      <input type="text" name="about_intro_title" value={profileData.about_intro_title} onChange={handleProfileChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E89B10] bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Company Story / Mission Details</label>
                      <textarea name="about_intro_desc" rows={4} value={profileData.about_intro_desc} onChange={handleProfileChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E89B10] bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Location Tagline / Based-In details</label>
                      <input type="text" name="about_intro_location_text" value={profileData.about_intro_location_text} onChange={handleProfileChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E89B10] bg-white" />
                    </div>

                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-6 mb-2 border-b pb-2">Right Column Features (6 Premium Cards)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Card 1 Title</label>
                        <input type="text" name="about_card1_title" value={profileData.about_card1_title} onChange={handleProfileChange} className="w-full px-3 py-2 rounded-lg border text-xs bg-white" />
                        <label className="block text-[10px] text-gray-400 mt-1">Card 1 Desc</label>
                        <input type="text" name="about_card1_desc" value={profileData.about_card1_desc} onChange={handleProfileChange} className="w-full px-3 py-1 rounded-lg border text-[11px] bg-white" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Card 2 Title</label>
                        <input type="text" name="about_card2_title" value={profileData.about_card2_title} onChange={handleProfileChange} className="w-full px-3 py-2 rounded-lg border text-xs bg-white" />
                        <label className="block text-[10px] text-gray-400 mt-1">Card 2 Desc</label>
                        <input type="text" name="about_card2_desc" value={profileData.about_card2_desc} onChange={handleProfileChange} className="w-full px-3 py-1 rounded-lg border text-[11px] bg-white" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Card 3 Title</label>
                        <input type="text" name="about_card3_title" value={profileData.about_card3_title} onChange={handleProfileChange} className="w-full px-3 py-2 rounded-lg border text-xs bg-white" />
                        <label className="block text-[10px] text-gray-400 mt-1">Card 3 Desc</label>
                        <input type="text" name="about_card3_desc" value={profileData.about_card3_desc} onChange={handleProfileChange} className="w-full px-3 py-1 rounded-lg border text-[11px] bg-white" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Card 4 Title</label>
                        <input type="text" name="about_card4_title" value={profileData.about_card4_title} onChange={handleProfileChange} className="w-full px-3 py-2 rounded-lg border text-xs bg-white" />
                        <label className="block text-[10px] text-gray-400 mt-1">Card 4 Desc</label>
                        <input type="text" name="about_card4_desc" value={profileData.about_card4_desc} onChange={handleProfileChange} className="w-full px-3 py-1 rounded-lg border text-[11px] bg-white" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Card 5 Title</label>
                        <input type="text" name="about_card5_title" value={profileData.about_card5_title} onChange={handleProfileChange} className="w-full px-3 py-2 rounded-lg border text-xs bg-white" />
                        <label className="block text-[10px] text-gray-400 mt-1">Card 5 Desc</label>
                        <input type="text" name="about_card5_desc" value={profileData.about_card5_desc} onChange={handleProfileChange} className="w-full px-3 py-1 rounded-lg border text-[11px] bg-white" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Card 6 Title</label>
                        <input type="text" name="about_card6_title" value={profileData.about_card6_title} onChange={handleProfileChange} className="w-full px-3 py-2 rounded-lg border text-xs bg-white" />
                        <label className="block text-[10px] text-gray-400 mt-1">Card 6 Desc</label>
                        <input type="text" name="about_card6_desc" value={profileData.about_card6_desc} onChange={handleProfileChange} className="w-full px-3 py-1 rounded-lg border text-[11px] bg-white" />
                      </div>
                    </div>
                  </div>
                </details>

                {/* 3. Founder Spotlight */}
                <details className="group border border-gray-200 rounded-2xl p-6 bg-gray-50/20">
                  <summary className="flex items-center justify-between cursor-pointer focus:outline-none list-none">
                    <h3 className="text-md font-bold text-[#0B1F3A] flex items-center gap-2">
                      <ShieldCheck size={18} className="text-[#E89B10]" />
                      3. Founder / Owner Spotlight Section
                    </h3>
                    <span className="transition group-open:-rotate-180">
                      <span className="material-symbols-outlined text-gray-500">expand_more</span>
                    </span>
                  </summary>
                  <div className="mt-6 space-y-4">
                    {/* Avatar Upload */}
                    <div className="p-6 border border-dashed border-gray-200 rounded-2xl bg-gray-50 flex items-center gap-6">
                      <div className="w-20 h-20 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center relative overflow-hidden shrink-0">
                        {profileData.about_founder_avatar_url ? (
                          <img src={profileData.about_founder_avatar_url} alt="Founder Avatar Preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-gray-400 font-bold text-lg">
                            {profileData.about_founder_name ? profileData.about_founder_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : 'FN'}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <h4 className="text-sm font-bold text-[#0B1F3A]">Founder Photo Avatar</h4>
                        <p className="text-xs text-gray-400">Supported types: JPG, PNG, WEBP. Max 2MB.</p>
                        <div className="flex gap-2">
                          <label className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${uploadingFounderAvatar ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#0B1F3A] hover:bg-[#0B1F3A]/90 text-white shadow-md'}`}>
                            <Upload size={12} />
                            {uploadingFounderAvatar ? 'Uploading...' : 'Choose Photo'}
                            <input type="file" accept="image/*" onChange={handleFounderAvatarUpload} disabled={uploadingFounderAvatar} className="hidden" />
                          </label>
                          {profileData.about_founder_avatar_url && (
                            <button type="button" onClick={() => setProfileData(prev => ({ ...prev, about_founder_avatar_url: '' }))} className="px-3 py-2 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 text-xs font-bold flex items-center gap-1">
                              <Trash2 size={12} />
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Founder Name</label>
                        <input type="text" name="about_founder_name" value={profileData.about_founder_name} onChange={handleProfileChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none bg-white" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Founder Role / Title</label>
                        <input type="text" name="about_founder_title" value={profileData.about_founder_title} onChange={handleProfileChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none bg-white" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Founder Inspiring Story</label>
                      <textarea name="about_founder_story" rows={4} value={profileData.about_founder_story} onChange={handleProfileChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Elegant Quote Card Text</label>
                      <input type="text" name="about_founder_quote" value={profileData.about_founder_quote} onChange={handleProfileChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none bg-white" />
                    </div>
                  </div>
                </details>

                {/* 4. Why Choose Us Bento Grid */}
                <details className="group border border-gray-200 rounded-2xl p-6 bg-gray-50/20">
                  <summary className="flex items-center justify-between cursor-pointer focus:outline-none list-none">
                    <h3 className="text-md font-bold text-[#0B1F3A] flex items-center gap-2">
                      <Sliders size={18} className="text-[#E89B10]" />
                      4. Why Choose Us Bento Grid (6 Cards)
                    </h3>
                    <span className="transition group-open:-rotate-180">
                      <span className="material-symbols-outlined text-gray-500">expand_more</span>
                    </span>
                  </summary>
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Card 1: Instant Booking</label>
                      <input type="text" name="about_why_card1_title" value={profileData.about_why_card1_title} onChange={handleProfileChange} className="w-full px-3 py-2 rounded-lg border text-xs bg-white mb-1" />
                      <input type="text" name="about_why_card1_desc" value={profileData.about_why_card1_desc} onChange={handleProfileChange} className="w-full px-3 py-1.5 rounded-lg border text-[11px] bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Card 2: Wide Fleet Collection</label>
                      <input type="text" name="about_why_card2_title" value={profileData.about_why_card2_title} onChange={handleProfileChange} className="w-full px-3 py-2 rounded-lg border text-xs bg-white mb-1" />
                      <input type="text" name="about_why_card2_desc" value={profileData.about_why_card2_desc} onChange={handleProfileChange} className="w-full px-3 py-1.5 rounded-lg border text-[11px] bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Card 3: Affordable Pricing</label>
                      <input type="text" name="about_why_card3_title" value={profileData.about_why_card3_title} onChange={handleProfileChange} className="w-full px-3 py-2 rounded-lg border text-xs bg-white mb-1" />
                      <input type="text" name="about_why_card3_desc" value={profileData.about_why_card3_desc} onChange={handleProfileChange} className="w-full px-3 py-1.5 rounded-lg border text-[11px] bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Card 4: Fully Maintained Cars</label>
                      <input type="text" name="about_why_card4_title" value={profileData.about_why_card4_title} onChange={handleProfileChange} className="w-full px-3 py-2 rounded-lg border text-xs bg-white mb-1" />
                      <input type="text" name="about_why_card4_desc" value={profileData.about_why_card4_desc} onChange={handleProfileChange} className="w-full px-3 py-1.5 rounded-lg border text-[11px] bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Card 5: Legal Agreements</label>
                      <input type="text" name="about_why_card5_title" value={profileData.about_why_card5_title} onChange={handleProfileChange} className="w-full px-3 py-2 rounded-lg border text-xs bg-white mb-1" />
                      <input type="text" name="about_why_card5_desc" value={profileData.about_why_card5_desc} onChange={handleProfileChange} className="w-full px-3 py-1.5 rounded-lg border text-[11px] bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Card 6: Emergency Support</label>
                      <input type="text" name="about_why_card6_title" value={profileData.about_why_card6_title} onChange={handleProfileChange} className="w-full px-3 py-2 rounded-lg border text-xs bg-white mb-1" />
                      <input type="text" name="about_why_card6_desc" value={profileData.about_why_card6_desc} onChange={handleProfileChange} className="w-full px-3 py-1.5 rounded-lg border text-[11px] bg-white" />
                    </div>
                  </div>
                </details>

                {/* 5. Rental Timeline */}
                <details className="group border border-gray-200 rounded-2xl p-6 bg-gray-50/20">
                  <summary className="flex items-center justify-between cursor-pointer focus:outline-none list-none">
                    <h3 className="text-md font-bold text-[#0B1F3A] flex items-center gap-2">
                      <Clock size={18} className="text-[#E89B10]" />
                      5. Rental Process Timeline (5 Steps)
                    </h3>
                    <span className="transition group-open:-rotate-180">
                      <span className="material-symbols-outlined text-gray-500">expand_more</span>
                    </span>
                  </summary>
                  <div className="mt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div className="border p-3 rounded-lg bg-gray-50">
                        <label className="block text-xs font-bold text-gray-500 mb-1">Step 1 Title</label>
                        <input type="text" name="about_step1_title" value={profileData.about_step1_title} onChange={handleProfileChange} className="w-full px-2 py-1 rounded border text-xs bg-white mb-1 font-semibold" />
                        <label className="block text-[10px] text-gray-400">Step 1 Desc</label>
                        <textarea name="about_step1_desc" rows={3} value={profileData.about_step1_desc} onChange={handleProfileChange} className="w-full px-2 py-1 rounded border text-[11px] bg-white" />
                      </div>
                      <div className="border p-3 rounded-lg bg-gray-50">
                        <label className="block text-xs font-bold text-gray-500 mb-1">Step 2 Title</label>
                        <input type="text" name="about_step2_title" value={profileData.about_step2_title} onChange={handleProfileChange} className="w-full px-2 py-1 rounded border text-xs bg-white mb-1 font-semibold" />
                        <label className="block text-[10px] text-gray-400">Step 2 Desc</label>
                        <textarea name="about_step2_desc" rows={3} value={profileData.about_step2_desc} onChange={handleProfileChange} className="w-full px-2 py-1 rounded border text-[11px] bg-white" />
                      </div>
                      <div className="border p-3 rounded-lg bg-gray-50">
                        <label className="block text-xs font-bold text-gray-500 mb-1">Step 3 Title</label>
                        <input type="text" name="about_step3_title" value={profileData.about_step3_title} onChange={handleProfileChange} className="w-full px-2 py-1 rounded border text-xs bg-white mb-1 font-semibold" />
                        <label className="block text-[10px] text-gray-400">Step 3 Desc</label>
                        <textarea name="about_step3_desc" rows={3} value={profileData.about_step3_desc} onChange={handleProfileChange} className="w-full px-2 py-1 rounded border text-[11px] bg-white" />
                      </div>
                      <div className="border p-3 rounded-lg bg-gray-50">
                        <label className="block text-xs font-bold text-gray-500 mb-1">Step 4 Title</label>
                        <input type="text" name="about_step4_title" value={profileData.about_step4_title} onChange={handleProfileChange} className="w-full px-2 py-1 rounded border text-xs bg-white mb-1 font-semibold" />
                        <label className="block text-[10px] text-gray-400">Step 4 Desc</label>
                        <textarea name="about_step4_desc" rows={3} value={profileData.about_step4_desc} onChange={handleProfileChange} className="w-full px-2 py-1 rounded border text-[11px] bg-white" />
                      </div>
                      <div className="border p-3 rounded-lg bg-gray-50">
                        <label className="block text-xs font-bold text-gray-500 mb-1">Step 5 Title</label>
                        <input type="text" name="about_step5_title" value={profileData.about_step5_title} onChange={handleProfileChange} className="w-full px-2 py-1 rounded border text-xs bg-white mb-1 font-semibold" />
                        <label className="block text-[10px] text-gray-400">Step 5 Desc</label>
                        <textarea name="about_step5_desc" rows={3} value={profileData.about_step5_desc} onChange={handleProfileChange} className="w-full px-2 py-1 rounded border text-[11px] bg-white" />
                      </div>
                    </div>
                  </div>
                </details>

                {/* 6. Trust & Safety */}
                <details className="group border border-gray-200 rounded-2xl p-6 bg-gray-50/20">
                  <summary className="flex items-center justify-between cursor-pointer focus:outline-none list-none">
                    <h3 className="text-md font-bold text-[#0B1F3A] flex items-center gap-2">
                      <ShieldCheck size={18} className="text-[#E89B10]" />
                      6. Trust & Safety Section (6 Cards)
                    </h3>
                    <span className="transition group-open:-rotate-180">
                      <span className="material-symbols-outlined text-gray-500">expand_more</span>
                    </span>
                  </summary>
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Safety Card 1 (Verified Drivers)</label>
                      <input type="text" name="about_safety_card1_title" value={profileData.about_safety_card1_title} onChange={handleProfileChange} className="w-full px-2 py-1 rounded border text-xs bg-white mb-1 font-semibold" />
                      <input type="text" name="about_safety_card1_desc" value={profileData.about_safety_card1_desc} onChange={handleProfileChange} className="w-full px-2 py-1 rounded border text-[11px] bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Safety Card 2 (Sanitized Cars)</label>
                      <input type="text" name="about_safety_card2_title" value={profileData.about_safety_card2_title} onChange={handleProfileChange} className="w-full px-2 py-1 rounded border text-xs bg-white mb-1 font-semibold" />
                      <input type="text" name="about_safety_card2_desc" value={profileData.about_safety_card2_desc} onChange={handleProfileChange} className="w-full px-2 py-1 rounded border text-[11px] bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Safety Card 3 (Insurance Support)</label>
                      <input type="text" name="about_safety_card3_title" value={profileData.about_safety_card3_title} onChange={handleProfileChange} className="w-full px-2 py-1 rounded border text-xs bg-white mb-1 font-semibold" />
                      <input type="text" name="about_safety_card3_desc" value={profileData.about_safety_card3_desc} onChange={handleProfileChange} className="w-full px-2 py-1 rounded border text-[11px] bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Safety Card 4 (Secure Payments)</label>
                      <input type="text" name="about_safety_card4_title" value={profileData.about_safety_card4_title} onChange={handleProfileChange} className="w-full px-2 py-1 rounded border text-xs bg-white mb-1 font-semibold" />
                      <input type="text" name="about_safety_card4_desc" value={profileData.about_safety_card4_desc} onChange={handleProfileChange} className="w-full px-2 py-1 rounded border text-[11px] bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Safety Card 5 (GPS Tracking)</label>
                      <input type="text" name="about_safety_card5_title" value={profileData.about_safety_card5_title} onChange={handleProfileChange} className="w-full px-2 py-1 rounded border text-xs bg-white mb-1 font-semibold" />
                      <input type="text" name="about_safety_card5_desc" value={profileData.about_safety_card5_desc} onChange={handleProfileChange} className="w-full px-2 py-1 rounded border text-[11px] bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Safety Card 6 (24x7 Assistance)</label>
                      <input type="text" name="about_safety_card6_title" value={profileData.about_safety_card6_title} onChange={handleProfileChange} className="w-full px-2 py-1 rounded border text-xs bg-white mb-1 font-semibold" />
                      <input type="text" name="about_safety_card6_desc" value={profileData.about_safety_card6_desc} onChange={handleProfileChange} className="w-full px-2 py-1 rounded border text-[11px] bg-white" />
                    </div>
                  </div>
                </details>

                {/* 7. Final CTA Banner */}
                <details className="group border border-gray-200 rounded-2xl p-6 bg-gray-50/20">
                  <summary className="flex items-center justify-between cursor-pointer focus:outline-none list-none">
                    <h3 className="text-md font-bold text-[#0B1F3A] flex items-center gap-2">
                      <MessageSquare size={18} className="text-[#E89B10]" />
                      7. Final Call To Action Banner
                    </h3>
                    <span className="transition group-open:-rotate-180">
                      <span className="material-symbols-outlined text-gray-500">expand_more</span>
                    </span>
                  </summary>
                  <div className="mt-6 space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">CTA Banner Heading</label>
                      <input type="text" name="about_cta_title" value={profileData.about_cta_title} onChange={handleProfileChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E89B10] bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">CTA Banner Subtitle/Description</label>
                      <input type="text" name="about_cta_desc" value={profileData.about_cta_desc} onChange={handleProfileChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E89B10] bg-white" />
                    </div>
                  </div>
                </details>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="w-full bg-[#0B1F3A] text-white px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#0B1F3A]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {savingProfile ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving changes...
                    </>
                  ) : (
                    'Save About Page Settings'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Tab Content: Security Settings */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden max-w-2xl">
          <div className="p-8 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-xl font-bold text-[#0B1F3A]">Change Password</h2>
            <p className="text-sm text-gray-500 mt-1">Securely rotate your active login credentials.</p>
          </div>

          <form onSubmit={handlePasswordChange} className="p-8 space-y-6">
            
            {/* Current Password */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  autoComplete="current-password"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] pr-12 transition-all bg-white"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 rounded-md transition-colors"
                >
                  {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="h-px bg-gray-100 w-full" />

            {/* New Password */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E89B10] pr-12 transition-all bg-white"
                  placeholder="Minimum 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 rounded-md transition-colors"
                >
                  {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 pr-12 transition-all bg-white
                    ${confirmPassword === '' ? 'border-gray-200 focus:ring-[#0B1F3A]' : 
                      confirmPassword === newPassword ? 'border-green-300 focus:ring-green-500 bg-green-50/30' : 
                      'border-red-300 focus:ring-red-500 bg-red-50/30'
                    }`}
                  placeholder="Retype new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 rounded-md transition-colors"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              {confirmPassword && confirmPassword !== newPassword && (
                <p className="text-red-500 text-xs mt-2 flex items-center gap-1 font-medium">
                  Passwords do not match
                </p>
              )}
              {confirmPassword && confirmPassword.length >= 6 && confirmPassword === newPassword && (
                <p className="text-green-600 text-xs mt-2 flex items-center gap-1 font-medium">
                  Passwords match securely
                </p>
              )}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loadingPassword || !currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword || newPassword.length < 6}
                className="w-full bg-[#0B1F3A] text-white px-6 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#0B1F3A]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loadingPassword ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Updating Password...
                  </>
                ) : (
                  'Update Admin Password'
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
