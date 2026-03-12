
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
