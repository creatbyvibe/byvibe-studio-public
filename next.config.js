/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  // 排除 API 路由（静态导出不需要）
  // 注意：即使排除，构建时仍会尝试编译，所以需要确保环境变量检查延迟到运行时
}

module.exports = nextConfig
