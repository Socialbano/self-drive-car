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
  themePrimaryColor: string;
  themeAccentColor: string;
  
  // Special Offers Settings
  offersSectionTitle: string;
  offersSectionSubtitle: string;
  offer1Active: boolean;
  offer1Title: string;
  offer1Discount: string;
  offer1Description: string;
  offer1BtnText: string;
  offer1WhatsappMsg: string;
  offer2Active: boolean;
  offer2Title: string;
  offer2Discount: string;
  offer2Description: string;
  offer2BtnText: string;
  offer2WhatsappMsg: string;
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
  themePrimaryColor: '#0B1F3A',
  themeAccentColor: '#E89B10',
  
  // Special Offers Defaults
  offersSectionTitle: 'Special Offers',
  offersSectionSubtitle: 'Take advantage of our exclusive deals and save on your next rental',
  offer1Active: true,
  offer1Title: 'Weekend Discount',
  offer1Discount: '20% OFF',
  offer1Description: 'Get 20% off on weekend rentals. Perfect for your short getaways and weekend adventures.',
  offer1BtnText: 'Claim Offer',
  offer1WhatsappMsg: 'Hi! I want to claim the 20% Weekend Discount for my car rental.',
  offer2Active: true,
  offer2Title: 'First Booking Offer',
  offer2Discount: '15% OFF',
  offer2Description: 'New users get a discount on their first ride. Start your journey with us and save today!',
  offer2BtnText: 'Get Started',
  offer2WhatsappMsg: 'Hi! I want to claim the 15% First Booking Offer for my car rental.',
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
    themePrimaryColor: data.theme_primary_color || DEFAULT_SETTINGS.themePrimaryColor,
    themeAccentColor: data.theme_accent_color || DEFAULT_SETTINGS.themeAccentColor,
    
    // Special Offers Settings
    offersSectionTitle: data.offers_section_title || DEFAULT_SETTINGS.offersSectionTitle,
    offersSectionSubtitle: data.offers_section_subtitle || DEFAULT_SETTINGS.offersSectionSubtitle,
    offer1Active: data.offer1_active !== undefined ? (data.offer1_active === 'true' || data.offer1_active === true) : DEFAULT_SETTINGS.offer1Active,
    offer1Title: data.offer1_title || DEFAULT_SETTINGS.offer1Title,
    offer1Discount: data.offer1_discount || DEFAULT_SETTINGS.offer1Discount,
    offer1Description: data.offer1_description || DEFAULT_SETTINGS.offer1Description,
    offer1BtnText: data.offer1_btn_text || DEFAULT_SETTINGS.offer1BtnText,
    offer1WhatsappMsg: data.offer1_whatsapp_msg || DEFAULT_SETTINGS.offer1WhatsappMsg,
    offer2Active: data.offer2_active !== undefined ? (data.offer2_active === 'true' || data.offer2_active === true) : DEFAULT_SETTINGS.offer2Active,
    offer2Title: data.offer2_title || DEFAULT_SETTINGS.offer2Title,
    offer2Discount: data.offer2_discount || DEFAULT_SETTINGS.offer2Discount,
    offer2Description: data.offer2_description || DEFAULT_SETTINGS.offer2Description,
    offer2BtnText: data.offer2_btn_text || DEFAULT_SETTINGS.offer2BtnText,
    offer2WhatsappMsg: data.offer2_whatsapp_msg || DEFAULT_SETTINGS.offer2WhatsappMsg,
  };
}
