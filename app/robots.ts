import { MetadataRoute } from 'next';
import { getAdminSettings } from '@/lib/supabase/queries';

export default async function robots(): Promise<MetadataRoute.Robots> {
  let siteUrl = 'https://selfdrivecarrental.in';
  try {
    const settings = await getAdminSettings();
    if (settings?.business_site_url) {
      siteUrl = settings.business_site_url;
    }
  } catch (e) {
    console.error('Failed to load settings in robots:', e);
  }
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'],
    },
    sitemap: `${siteUrl.replace(/\/$/, '')}/sitemap.xml`,
  };
}
