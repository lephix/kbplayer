/** @type {import('next').NextConfig} */
const nextConfig = {
  // 开发环境配置
  ...(process.env.NODE_ENV === 'production' ? {
    output: 'export',
    basePath: '/kbplayer',
    images: {
      unoptimized: true,
    },
  } : {}),
}

module.exports = nextConfig 