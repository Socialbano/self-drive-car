import { MetadataRoute } from 'next';
import { getCars } from '@/lib/supabase/queries';
import { BLOG_POSTS } from '@/lib/blog-data';

const URL = 'https://skydeepgroup.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  // Location pages
  const locations = ['ashok-nagar', 'goa', 'jaipur', 'indore', 'vijay-nagar', 'airport', 'bhanwar-kuan'].map((location) => ({
    url: `${URL}/locations/${location}`,
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
  const blogRoutes = BLOG_POSTS.map((post) => ({
    url: `${URL}/blog/${post.slug}`,
    lastModified: new Date(post.date).toISOString(), // fallback to current date if needed, but post.date is string like "April 9, 2026" usually need proper parsing. Using new Date() is safe.
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...baseRoutes, ...locations, ...carRoutes, ...blogRoutes];
}
