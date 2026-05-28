import { MetadataRoute } from 'next';
import { getCars, getBlogs, getActiveLocations, getAdminSettings } from '@/lib/supabase/queries';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getAdminSettings();
  const URL = (settings?.business_site_url || 'https://selfdrivecarrental.in').replace(/\/$/, '');
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

  // Dynamic location pages
  const activeLocations = await getActiveLocations();
  const locations = (activeLocations || []).map((location) => ({
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
