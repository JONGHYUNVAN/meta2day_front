/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**', // 모든 도메인 허용
            },
        ],
    },
};

export default nextConfig;