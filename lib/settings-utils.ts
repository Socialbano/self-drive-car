import { BUSINESS } from '@/lib/constants';

export interface BusinessSettings {
  name: string;
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  hours: string;
  email: string;
  whatsappDefaultMsg: string;
  offerBannerText: string;
  offerBannerActive: boolean;
  heroImageUrl: string;
  mapsEmbedUrl: string;
  logoUrl: string;
  subtitle: string;
  heroTagline: string;
  heroTitleP1: string;
  heroTitleP2: string;
  heroDescription: string;
  heroStat1Value: number;
  heroStat1Label: string;
  heroStat2Value: number;
  heroStat2Label: string;
  regNo: string;
  udyamNo: string;
  gstNo: string;
  upiQrUrl: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  googleSiteVerification: string;
  googleAnalyticsId: string;
  metaPixelId: string;
  siteUrl: string;
  instagramUrl: string;
}

export const DEFAULT_SETTINGS: BusinessSettings = {
  name: BUSINESS.name,
  phone: BUSINESS.phone,
  phoneDisplay: BUSINESS.phoneDisplay,
  whatsapp: BUSINESS.whatsapp,
  address: BUSINESS.address,
  city: BUSINESS.city,
  state: BUSINESS.state,
  pincode: BUSINESS.pincode,
  hours: BUSINESS.hours,
  email: BUSINESS.email,
  whatsappDefaultMsg: 'Hi! I want to book a self drive car.',
  offerBannerText: '',
  offerBannerActive: false,
  heroImageUrl: '/images/hero-bg.jpg',
  mapsEmbedUrl: 'https://www.google.com/maps/embed?pb=...',
  logoUrl: '',
  subtitle: 'Car Rental Services',
  heroTagline: 'Now Serving Indore, Goa & Jaipur',
  heroTitleP1: 'Self Drive Car',
  heroTitleP2: 'Rental in Indore',
  heroDescription: 'Premium self-drive car rental service with zero security deposit. Experience the freedom of the road with our fleet of luxury SUVs and sedans.',
  heroStat1Value: 1500,
  heroStat1Label: 'Happy Customers',
  heroStat2Value: 100,
  heroStat2Label: 'Cars in Fleet',
  regNo: 'INDO250409SE001514',
  udyamNo: 'UDYAM-MP-23-0207225',
  gstNo: '',
  upiQrUrl: '/assets/upiqr.png',
  seoTitle: '',
  seoDescription: '',
  seoKeywords: '',
  googleSiteVerification: '',
  googleAnalyticsId: '',
  metaPixelId: '',
  siteUrl: '',
  instagramUrl: 'https://instagram.com/',
};

export function mapDatabaseSettings(data: Record<string, any>): BusinessSettings {
  const phone = data.business_phone || DEFAULT_SETTINGS.phone;
  return {
    name: data.business_name || DEFAULT_SETTINGS.name,
    phone: phone,
    phoneDisplay: phone.replace(/^\+91/, ''),
    whatsapp: data.business_whatsapp || DEFAULT_SETTINGS.whatsapp,
    address: data.business_address || DEFAULT_SETTINGS.address,
    city: data.business_city || DEFAULT_SETTINGS.city,
    state: data.business_state || DEFAULT_SETTINGS.state,
    pincode: data.business_pincode || DEFAULT_SETTINGS.pincode,
    hours: data.business_hours || DEFAULT_SETTINGS.hours,
    email: data.business_email || DEFAULT_SETTINGS.email,
    whatsappDefaultMsg: data.whatsapp_default_msg || DEFAULT_SETTINGS.whatsappDefaultMsg,
    offerBannerText: data.offer_banner_text || DEFAULT_SETTINGS.offerBannerText,
    offerBannerActive: data.offer_banner_active === 'true' || data.offer_banner_active === true,
    heroImageUrl: data.hero_image_url || DEFAULT_SETTINGS.heroImageUrl,
    mapsEmbedUrl: data.maps_embed_url || DEFAULT_SETTINGS.mapsEmbedUrl,
    logoUrl: data.business_logo_url || DEFAULT_SETTINGS.logoUrl,
    subtitle: data.business_subtitle || DEFAULT_SETTINGS.subtitle,
    heroTagline: data.hero_tagline || DEFAULT_SETTINGS.heroTagline,
    heroTitleP1: data.hero_title_p1 || DEFAULT_SETTINGS.heroTitleP1,
    heroTitleP2: data.hero_title_p2 || DEFAULT_SETTINGS.heroTitleP2,
    heroDescription: data.hero_description || DEFAULT_SETTINGS.heroDescription,
    heroStat1Value: data.hero_stat1_value ? parseInt(data.hero_stat1_value, 10) : DEFAULT_SETTINGS.heroStat1Value,
    heroStat1Label: data.hero_stat1_label || DEFAULT_SETTINGS.heroStat1Label,
    heroStat2Value: data.hero_stat2_value ? parseInt(data.hero_stat2_value, 10) : DEFAULT_SETTINGS.heroStat2Value,
    heroStat2Label: data.hero_stat2_label || DEFAULT_SETTINGS.heroStat2Label,
    regNo: data.business_reg_no || DEFAULT_SETTINGS.regNo,
    udyamNo: data.business_udyam_no || DEFAULT_SETTINGS.udyamNo,
    gstNo: data.business_gst_no || DEFAULT_SETTINGS.gstNo,
    upiQrUrl: data.business_upi_qr_url || DEFAULT_SETTINGS.upiQrUrl,
    seoTitle: data.business_seo_title || DEFAULT_SETTINGS.seoTitle,
    seoDescription: data.business_seo_description || DEFAULT_SETTINGS.seoDescription,
    seoKeywords: data.business_seo_keywords || DEFAULT_SETTINGS.seoKeywords,
    googleSiteVerification: data.business_google_site_verification || DEFAULT_SETTINGS.googleSiteVerification,
    googleAnalyticsId: data.business_google_analytics_id || DEFAULT_SETTINGS.googleAnalyticsId,
    metaPixelId: data.business_meta_pixel_id || DEFAULT_SETTINGS.metaPixelId,
    siteUrl: data.business_site_url || DEFAULT_SETTINGS.siteUrl,
    instagramUrl: data.business_instagram_url || DEFAULT_SETTINGS.instagramUrl,
  };
}
