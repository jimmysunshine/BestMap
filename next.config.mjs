/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@amap/amap-jsapi-loader', 'antd'],
  images: {
    domains: ['webapi.amap.com', 'restapi.amap.com'],
  },
  // 添加安全策略配置
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self' *.amap.com *.autonavi.com overpass-api.de;",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' blob: *.amap.com *.autonavi.com;",
              "style-src 'self' 'unsafe-inline' *.amap.com;",
              "img-src 'self' data: blob: *.amap.com *.autonavi.com;",
              "connect-src 'self' *.amap.com *.autonavi.com https://overpass-api.de;",
              "worker-src 'self' blob: data:;",
              "child-src 'self' blob: data:;"
            ].join(' ')
          }
        ]
      }
    ];
  },
  experimental: {
    optimizePackageImports: ['antd']
  },
  // 使用稳定版的 Turbopack
  turbopack: {
    // Turbopack 配置
  },
  // 优化构建性能
  poweredByHeader: false,
  compress: true,
  // 优化开发体验
  webpack: (config, { dev, isServer }) => {
    // 启用持久化缓存
    config.cache = true;
    
    if (dev && !isServer) {
      // 开发环境优化
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendors: {
              test: /[\\/]node_modules[\\/]/,
              priority: -10,
              reuseExistingChunk: true,
            },
            common: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            },
          },
        },
        minimize: true,
        minimizer: config.optimization.minimizer,
      };
      
      // 启用模块连接
      config.optimization.concatenateModules = true;
      
      // 优化模块解析
      config.resolve = {
        ...config.resolve,
        symlinks: false,
        cacheWithContext: false,
      };
    }
    return config;
  },
};

export default nextConfig; 