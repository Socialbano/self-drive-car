import { siteConfig } from '@/config/site';

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
  googleRating: number;
  googleReviewCount: number;
  googleProfileLink: string;
  foundingYear: string;
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
  facebookUrl: string;
  twitterUrl: string;
  youtubeUrl: string;
  themePrimaryColor: string;
  themeAccentColor: string;
  suvTypesCount: number;
  sedanTypesCount: number;
  
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
  name: siteConfig.brand.name,
  phone: siteConfig.contact.phone,
  phoneDisplay: siteConfig.contact.phoneDisplay,
  whatsapp: siteConfig.contact.whatsapp,
  address: siteConfig.contact.address,
  city: siteConfig.contact.city,
  state: siteConfig.contact.state,
  pincode: siteConfig.contact.pincode,
  hours: siteConfig.contact.hours,
  email: siteConfig.contact.email,
  whatsappDefaultMsg: `Hi! I want to book a self drive car with ${siteConfig.brand.name}.`,
  offerBannerText: '',
  offerBannerActive: false,
  heroImageUrl: '/images/hero-bg.jpg',
  mapsEmbedUrl: siteConfig.contact.mapsEmbedUrl,
  logoUrl: siteConfig.brand.logoUrl,
  subtitle: siteConfig.brand.subtitle,
  heroTagline: siteConfig.brand.heroTagline,
  heroTitleP1: siteConfig.brand.heroTitleP1,
  heroTitleP2: siteConfig.brand.heroTitleP2,
  heroDescription: siteConfig.brand.heroDescription,
  heroStat1Value: siteConfig.trustMetrics.customersCount,
  heroStat1Label: siteConfig.trustMetrics.customersLabel,
  heroStat2Value: siteConfig.trustMetrics.carsCount,
  heroStat2Label: siteConfig.trustMetrics.carsLabel,
  googleRating: siteConfig.trustMetrics.googleRating,
  googleReviewCount: siteConfig.trustMetrics.googleReviewCount,
  googleProfileLink: siteConfig.trustMetrics.googleProfileLink,
  foundingYear: siteConfig.brand.foundingYear,
  regNo: 'INDO250409SE001514',
  udyamNo: 'UDYAM-MP-23-0207225',
  gstNo: '',
  upiQrUrl: '/assets/upiqr.png',
  seoTitle: `Self Drive Car Rental in ${siteConfig.contact.city} | ${siteConfig.brand.name}`,
  seoDescription: siteConfig.brand.heroDescription,
  seoKeywords: 'self drive car rental ujjain, car rental without driver, self drive cars bhopal, indore self drive',
  googleSiteVerification: '',
  googleAnalyticsId: '',
  metaPixelId: '',
  siteUrl: siteConfig.urls.siteUrl,
  instagramUrl: siteConfig.social.instagram,
  facebookUrl: siteConfig.social.facebook,
  twitterUrl: siteConfig.social.twitter,
  youtubeUrl: siteConfig.social.youtube,
  themePrimaryColor: '#0B1F3A',
  themeAccentColor: '#E89B10',
  suvTypesCount: siteConfig.trustMetrics.suvTypesCount,
  sedanTypesCount: siteConfig.trustMetrics.sedanTypesCount,
  
  // Special Offers Defaults
  offersSectionTitle: 'Special Offers',
  offersSectionSubtitle: 'Take advantage of our exclusive deals and save on your next rental',
  offer1Active: true,
  offer1Title: 'Weekend Discount',
  offer1Discount: '20% OFF',
  offer1Description: 'Get 20% off on weekend rentals. Perfect for your short getaways and weekend adventures.',
  offer1BtnText: 'Claim Offer',
  offer1WhatsappMsg: `Hi! I want to claim the 20% Weekend Discount for my car rental with ${siteConfig.brand.name}.`,
  offer2Active: true,
  offer2Title: 'First Booking Offer',
  offer2Discount: '15% OFF',
  offer2Description: 'New users get a discount on their first ride. Start your journey with us and save today!',
  offer2BtnText: 'Get Started',
  offer2WhatsappMsg: `Hi! I want to claim the 15% First Booking Offer for my car rental with ${siteConfig.brand.name}.`,
};

function sanitizeString(val: any, defaultVal: string, brandName: string): string {
  if (!val || typeof val !== 'string') return defaultVal;
  let clean = val.replace(/DRINGO\.IN/gi, brandName).replace(/DRINGO/gi, brandName);
  clean = clean.replace(/Ujjain Pradesh/gi, 'Madhya Pradesh');
  clean = clean.replace(/MP Nagar,\s*Zone-2,\s*Ujjain Pradesh\s*452010/gi, siteConfig.contact.address);
  clean = clean.replace(/MP Nagar,\s*Zone-2,\s*Ujjain Pradesh/gi, siteConfig.contact.address);
  clean = clean.replace(/452010/gi, siteConfig.contact.pincode);
  return clean.trim() || defaultVal;
}

export function mapDatabaseSettings(data: Record<string, any>): BusinessSettings {
  const brandName = data.business_name && !data.business_name.toLowerCase().includes('dringo') ? data.business_name : DEFAULT_SETTINGS.name;
  const phone = data.business_phone || DEFAULT_SETTINGS.phone;

  const stat1 = data.hero_stat1_value ? parseInt(data.hero_stat1_value, 10) : 0;
  const stat2 = data.hero_stat2_value ? parseInt(data.hero_stat2_value, 10) : 0;

  let dbSiteUrl = data.business_site_url || '';
  if (!dbSiteUrl || dbSiteUrl.includes('selfdrivecarrental.in') || dbSiteUrl.includes('dringo')) {
    dbSiteUrl = DEFAULT_SETTINGS.siteUrl;
  }

  return {
    name: sanitizeString(data.business_name, DEFAULT_SETTINGS.name, brandName),
    phone: phone,
    phoneDisplay: phone.replace(/^\+91/, ''),
    whatsapp: data.business_whatsapp || DEFAULT_SETTINGS.whatsapp,
    address: sanitizeString(data.business_address, DEFAULT_SETTINGS.address, brandName),
    city: data.business_city || DEFAULT_SETTINGS.city,
    state: data.business_state || DEFAULT_SETTINGS.state,
    pincode: data.business_pincode || DEFAULT_SETTINGS.pincode,
    hours: data.business_hours || DEFAULT_SETTINGS.hours,
    email: data.business_email || DEFAULT_SETTINGS.email,
    whatsappDefaultMsg: sanitizeString(data.whatsapp_default_msg, DEFAULT_SETTINGS.whatsappDefaultMsg, brandName),
    offerBannerText: data.offer_banner_text || DEFAULT_SETTINGS.offerBannerText,
    offerBannerActive: data.offer_banner_active === 'true' || data.offer_banner_active === true,
    heroImageUrl: data.hero_image_url || DEFAULT_SETTINGS.heroImageUrl,
    mapsEmbedUrl: data.maps_embed_url || DEFAULT_SETTINGS.mapsEmbedUrl,
    logoUrl: data.business_logo_url || DEFAULT_SETTINGS.logoUrl,
    subtitle: data.business_subtitle || DEFAULT_SETTINGS.subtitle,
    heroTagline: data.hero_tagline || DEFAULT_SETTINGS.heroTagline,
    heroTitleP1: data.hero_title_p1 || DEFAULT_SETTINGS.heroTitleP1,
    heroTitleP2: data.hero_title_p2 || DEFAULT_SETTINGS.heroTitleP2,
    heroDescription: sanitizeString(data.hero_description, DEFAULT_SETTINGS.heroDescription, brandName),
    heroStat1Value: stat1 > 0 ? stat1 : DEFAULT_SETTINGS.heroStat1Value,
    heroStat1Label: data.hero_stat1_label || DEFAULT_SETTINGS.heroStat1Label,
    heroStat2Value: stat2 > 0 ? stat2 : DEFAULT_SETTINGS.heroStat2Value,
    heroStat2Label: data.hero_stat2_label || DEFAULT_SETTINGS.heroStat2Label,
    googleRating: data.google_rating ? parseFloat(data.google_rating) : DEFAULT_SETTINGS.googleRating,
    googleReviewCount: data.google_review_count ? parseInt(data.google_review_count, 10) : DEFAULT_SETTINGS.googleReviewCount,
    googleProfileLink: data.google_profile_link || DEFAULT_SETTINGS.googleProfileLink,
    foundingYear: data.founding_year || DEFAULT_SETTINGS.foundingYear,
    regNo: data.business_reg_no || DEFAULT_SETTINGS.regNo,
    udyamNo: data.business_udyam_no || DEFAULT_SETTINGS.udyamNo,
    gstNo: data.business_gst_no || DEFAULT_SETTINGS.gstNo,
    upiQrUrl: data.business_upi_qr_url || DEFAULT_SETTINGS.upiQrUrl,
    seoTitle: sanitizeString(data.business_seo_title, DEFAULT_SETTINGS.seoTitle, brandName),
    seoDescription: sanitizeString(data.business_seo_description, DEFAULT_SETTINGS.seoDescription, brandName),
    seoKeywords: data.business_seo_keywords || DEFAULT_SETTINGS.seoKeywords,
    googleSiteVerification: data.business_google_site_verification || DEFAULT_SETTINGS.googleSiteVerification,
    googleAnalyticsId: data.business_google_analytics_id || DEFAULT_SETTINGS.googleAnalyticsId,
    metaPixelId: data.business_meta_pixel_id || DEFAULT_SETTINGS.metaPixelId,
    siteUrl: dbSiteUrl,
    instagramUrl: data.business_instagram_url || DEFAULT_SETTINGS.instagramUrl,
    facebookUrl: data.business_facebook_url || DEFAULT_SETTINGS.facebookUrl,
    twitterUrl: data.business_twitter_url || DEFAULT_SETTINGS.twitterUrl,
    youtubeUrl: data.business_youtube_url || DEFAULT_SETTINGS.youtubeUrl,
    themePrimaryColor: data.theme_primary_color || DEFAULT_SETTINGS.themePrimaryColor,
    themeAccentColor: data.theme_accent_color || DEFAULT_SETTINGS.themeAccentColor,
    suvTypesCount: data.suv_types_count ? parseInt(data.suv_types_count, 10) : DEFAULT_SETTINGS.suvTypesCount,
    sedanTypesCount: data.sedan_types_count ? parseInt(data.sedan_types_count, 10) : DEFAULT_SETTINGS.sedanTypesCount,
    
    // Special Offers Settings
    offersSectionTitle: data.offers_section_title || DEFAULT_SETTINGS.offersSectionTitle,
    offersSectionSubtitle: data.offers_section_subtitle || DEFAULT_SETTINGS.offersSectionSubtitle,
    offer1Active: data.offer1_active !== undefined ? (data.offer1_active === 'true' || data.offer1_active === true) : DEFAULT_SETTINGS.offer1Active,
    offer1Title: data.offer1_title || DEFAULT_SETTINGS.offer1Title,
    offer1Discount: data.offer1_discount || DEFAULT_SETTINGS.offer1Discount,
    offer1Description: data.offer1_description || DEFAULT_SETTINGS.offer1Description,
    offer1BtnText: data.offer1_btn_text || DEFAULT_SETTINGS.offer1BtnText,
    offer1WhatsappMsg: sanitizeString(data.offer1_whatsapp_msg, DEFAULT_SETTINGS.offer1WhatsappMsg, brandName),
    offer2Active: data.offer2_active !== undefined ? (data.offer2_active === 'true' || data.offer2_active === true) : DEFAULT_SETTINGS.offer2Active,
    offer2Title: data.offer2_title || DEFAULT_SETTINGS.offer2Title,
    offer2Discount: data.offer2_discount || DEFAULT_SETTINGS.offer2Discount,
    offer2Description: data.offer2_description || DEFAULT_SETTINGS.offer2Description,
    offer2BtnText: data.offer2_btn_text || DEFAULT_SETTINGS.offer2BtnText,
    offer2WhatsappMsg: sanitizeString(data.offer2_whatsapp_msg, DEFAULT_SETTINGS.offer2WhatsappMsg, brandName),
  };
}
