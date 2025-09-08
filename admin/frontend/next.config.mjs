/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: "http://localhost:5163/api/:path*", // Assuming backend runs on port 5163
            },
        ];
    },
};

export default nextConfig;
