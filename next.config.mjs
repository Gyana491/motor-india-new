/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: process.env.WP_API_HOST,
                port: '',
                pathname: '/**'
            },
            {
                protocol: 'https',
                hostname: 'img.youtube.com',
                port: '',
                pathname: '/**'
            },
            {
                protocol: 'https',
                hostname: 'i.ytimg.com',
                port: '',
                pathname: '/**'
            },
            {
                protocol: 'https',
                hostname: 's.gravatar.com',
                port: '',
                pathname: '/**'
            },
            {
                protocol: 'https',
                hostname: 'secure.gravatar.com',
                port: '',
                pathname: '/**'
            }
        ]
    },
    
    // Configure response headers for better caching
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=300, s-maxage=300, stale-while-revalidate=600',
                    },
                ],
            },
            {
                // Static assets caching
                source: '/assets/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
            {
                // API routes caching
                source: '/api/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=300, s-maxage=300, stale-while-revalidate=600',
                    },
                ],
            },
        ];
    },

    async rewrites() {
        return [
            {
                source: "/cars/:brand/:model/price-in-:city",
                destination: "/cars/:brand/:model/price-in/:city",
            },
        ];
    },
};

export default nextConfig;
