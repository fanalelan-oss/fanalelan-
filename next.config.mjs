
/** @type {import('next').NextConfig} */
const nextConfig = {
    skipTrailingSlashRedirect: true,
    images: {
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
