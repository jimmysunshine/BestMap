/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['antd', '@ant-design/icons'],
  reactStrictMode: true,
  modularizeImports: {
    'antd': {
      transform: 'antd/es/{{member}}',
      skipDefaultConversion: true
    },
    '@ant-design/icons': {
      transform: '@ant-design/icons/es/icons/{{member}}',
      skipDefaultConversion: true
    }
  },
  // 允许开发工具的跨域请求
  experimental: {
    allowedDevOrigins: ['127.0.0.1', 'localhost']
  }
}

module.exports = nextConfig 