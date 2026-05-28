const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800';

export function getCloudinaryUrl(
  publicIdOrUrl: string | null | undefined, 
  options?: { width?: number; height?: number; crop?: string; quality?: number | 'auto' }
): string {
  if (!publicIdOrUrl) return FALLBACK_IMAGE;

  // If it's already a full URL (not just a public ID), just return it
  if (publicIdOrUrl.startsWith('http')) return publicIdOrUrl;

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo';
  
  const width = options?.width ? `w_${options.width}` : '';
  const height = options?.height ? `h_${options.height}` : '';
  const crop = options?.crop ? `c_${options.crop}` : 'c_fill';
  const quality = options?.quality ? `q_${options.quality}` : 'q_auto';
  
  // Base transform always includes auto format (webp)
  const transforms = [width, height, crop, 'f_auto', quality]
    .filter(Boolean)
    .join(',');

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transforms}/${publicIdOrUrl}`;
}
