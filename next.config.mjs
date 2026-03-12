/** @type {import('next').NextConfig} */
// Triggering a server restart to apply image domain configuration.
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
};

export default nextConfig;

// Restarting server to load new .env.local variables