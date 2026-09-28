import { MetadataRoute } from 'next';
import { getAdminSettings } from '@/lib/supabase/queries';
import { siteConfig } from '@/config/site';

export default async function robots(): Promise<MetadataRoute.Robots> {
  let siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || siteConfig.urls.siteUrl;

  try {
    const settings = await getAdminSettings();
    if (settings?.business_site_url && !settings.business_site_url.includes('selfdrivecarrental.in')) {
      siteUrl = settings.business_site_url;
    }
  } catch (e) {
    // Fallback
  }
  
  const cleanSiteUrl = siteUrl.replace(/\/$/, '');
  const isDemo = siteConfig.urls.isDemo;

  if (isDemo) {
    // On preview/demo deployments (vercel.app), disallow crawling so demos don't compete with client domains
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    };
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'],
    },
    sitemap: `${cleanSiteUrl}/sitemap.xml`,
  };
}
