/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  poweredByHeader: false,
  compress: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
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
