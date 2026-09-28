import { MetadataRoute } from 'next';
import { getCars, getBlogs, getActiveLocations, getAdminSettings } from '@/lib/supabase/queries';
import { siteConfig } from '@/config/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || siteConfig.urls.siteUrl;

  try {
    const settings = await getAdminSettings();
    if (settings?.business_site_url && !settings.business_site_url.includes('selfdrivecarrental.in')) {
      siteUrl = settings.business_site_url;
    }
  } catch (e) {
    // Fallback to siteConfig
  }

  const URL = siteUrl.replace(/\/$/, '');

  // Base static routes
  const baseRoutes = [
    '',
    '/about',
    '/cars',
    '/pricing',
    '/contact',
    '/faq',
    '/blog',
  ].map((route) => ({
    url: `${URL}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Dynamic location pages (fallback to siteConfig.locations if DB empty)
  let activeLocations = await getActiveLocations();
  if (!activeLocations || activeLocations.length === 0) {
    activeLocations = siteConfig.locations as any;
  }

  const filteredLocations = (activeLocations || []).filter(
    (loc: any) => loc.slug !== 'goa' && loc.slug !== 'jaipur'
  );

  const locations = filteredLocations.map((location: any) => ({
    url: `${URL}/locations/${location.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // Dynamic car routes
  const carsRes = await getCars();
  const carRoutes = (carsRes || []).map((car) => ({
    url: `${URL}/cars/${car.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  // Dynamic blog routes
  const blogsRes = await getBlogs();
  const blogRoutes = (blogsRes || []).map((post) => {
    let lastModDate = new Date();
    if (post.updated_at) {
      lastModDate = new Date(post.updated_at);
    } else if (post.date) {
      const parsed = Date.parse(post.date);
      if (!isNaN(parsed)) {
        lastModDate = new Date(parsed);
      }
    }
    return {
      url: `${URL}/blog/${post.slug}`,
      lastModified: lastModDate.toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    };
  });

  return [...baseRoutes, ...locations, ...carRoutes, ...blogRoutes];
}
