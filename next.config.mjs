
/** @type {import('next').NextConfig} */
const nextConfig = {
    skipTrailingSlashRedirect: true,
    compress: true,
    images: {
        formats: ['image/avif', 'image/webp'],
        minimumCacheTTL: 31536000,
        deviceSizes: [360, 640, 750, 828, 1080, 1200, 1920],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'e7.pngegg.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'i.imgur.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
                    { key: 'X-XSS-Protection', value: '1; mode=block' },
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
                ],
            },
            {
                source: '/works_images/(.*)',
                headers: [
                    { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
                ],
            },
            {
                source: '/images/(.*)',
                headers: [
                    { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
                ],
            },
        ];
    },
    async redirects() {
        return [
          {
            source: '/blog/why-cladding-is-best-for-riyadh',
            destination: '/blog/cladding-comparison-saudi-american-chinese',
            permanent: true,
          },
          {
            source: '/services/signage-manufacturing',
            destination: '/services/advertising-signs',
            permanent: true,
          },
          {
            source: '/services/advertising-boards',
            destination: '/services/advertising-signs',
            permanent: true,
          },
          {
            source: '/services/maintenance-and-restoration',
            destination: '/services/maintenance-restoration',
            permanent: true,
          },
          {
            source: '/contact',
            destination: '/#contact',
            permanent: true,
          },
        ]
    },
};

export default nextConfig;
