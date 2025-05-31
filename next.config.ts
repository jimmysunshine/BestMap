/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'webapi.amap.com',
      },
      {
        protocol: 'https',
        hostname: 'restapi.amap.com',
      }
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self' https://*.amap.com https://*.autonavi.com; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.amap.com https://*.autonavi.com; style-src 'self' 'unsafe-inline' https://*.amap.com; img-src 'self' data: https://*.amap.com https://*.autonavi.com"
          }
        ]
      }
    ];
  }
};

export default nextConfig;