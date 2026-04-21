/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  poweredByHeader: false,
  compress: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
  // Increase body size limit for file uploads (10 MB)
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/locations/gwalior',
        destination: '/locations/goa',
        permanent: true,
      },
      {
        source: '/locations/gwalior/',
        destination: '/locations/goa/',
        permanent: true,
      },
      {
        source: '/locations/bhopal',
        destination: '/locations/jaipur',
        permanent: true,
      },
      {
        source: '/locations/bhopal/',
        destination: '/locations/jaipur/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
