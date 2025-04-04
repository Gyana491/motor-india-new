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
