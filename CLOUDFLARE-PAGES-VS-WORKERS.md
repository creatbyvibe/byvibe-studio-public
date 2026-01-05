# Cloudflare Pages vs Workers - 选择指南

## 🎯 结论：继续使用 Pages，不需要改成 Workers

### 为什么选择 Pages？

**对于 Next.js 项目，Pages 是更好的选择：**

1. **原生支持 Next.js**
   - Cloudflare Pages 现在支持 Next.js（通过 `@cloudflare/next-on-pages`）
   - 包括 API 路由支持
   - 自动处理路由和构建

2. **更适合全栈应用**
   - Pages 设计用于托管完整的 Web 应用
   - 支持静态页面 + API 路由
   - 自动 CDN 和边缘部署

3. **更简单的配置**
   - 连接 GitHub 即可自动部署
   - 自动处理构建和部署流程
   - 无需手动编写 Worker 代码

### Workers 适合什么场景？

**Workers 更适合：**
- 纯 API 服务（没有前端页面）
- 需要精细控制请求处理逻辑
- 边缘计算和中间件
- 简单的函数式 API

**Workers 不适合：**
- 完整的 Next.js 应用
- 需要 SSR/SSG 的页面
- 复杂的路由系统

## 🔧 当前配置检查

### 你的项目需要什么？

你的项目包含：
- ✅ Next.js 前端页面
- ✅ API 路由 (`/api/polish`, `/api/orchestrate`)
- ✅ 服务器端功能

**结论：Pages 是完美选择！**

## 📝 正确的 Cloudflare Pages 配置

### 方案 1：使用 @cloudflare/next-on-pages（推荐）

这是 Cloudflare 官方推荐的 Next.js 支持方式。

**步骤：**

1. **安装依赖：**
```bash
npm install --save-dev @cloudflare/next-on-pages
```

2. **更新 package.json：**
```json
{
  "scripts": {
    "build": "next build",
    "pages:build": "npx @cloudflare/next-on-pages",
    "pages:dev": "npx @cloudflare/next-on-pages --watch"
  }
}
```

3. **更新 cloudflare-pages.json：**
```json
{
  "buildCommand": "npm run pages:build",
  "outputDirectory": ".vercel/output/static",
  "rootDirectory": "/",
  "framework": "nextjs",
  "nodeVersion": "20"
}
```

4. **在 Cloudflare Dashboard 设置：**
   - Build command: `npm run pages:build`
   - Output directory: `.vercel/output/static`
   - Framework: Next.js

### 方案 2：使用标准 Next.js 构建（如果支持）

如果 Cloudflare Pages 直接支持 Next.js（某些配置下）：

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "rootDirectory": "/",
  "framework": "nextjs",
  "nodeVersion": "20"
}
```

## ⚠️ 重要提示

### Cloudflare Pages 的限制

1. **API 路由支持**
   - 需要 `@cloudflare/next-on-pages` 来支持 API 路由
   - 或者使用 Cloudflare Functions（Pages Functions）

2. **环境变量**
   - 必须在 Cloudflare Dashboard 中设置
   - `GEMINI_API_KEY` 必须设置

3. **Node.js API**
   - 某些 Node.js API 可能不支持
   - 需要使用 Cloudflare 兼容的 API

## 🚀 推荐方案对比

### 选项 A：继续使用 Cloudflare Pages + @cloudflare/next-on-pages

**优点：**
- ✅ 保持现有 Pages 设置
- ✅ 支持 Next.js 完整功能
- ✅ 自动部署和 CDN

**缺点：**
- ⚠️ 需要安装额外依赖
- ⚠️ 可能需要调整代码以兼容 Cloudflare

### 选项 B：改用 Vercel（最简单）

**优点：**
- ✅ 零配置，完美支持 Next.js
- ✅ 原生支持所有 Next.js 功能
- ✅ 自动优化和部署

**缺点：**
- ⚠️ 需要迁移项目

## 💡 我的建议

**如果你已经在 Cloudflare Pages 上设置了：**

1. **继续使用 Pages**，但需要：
   - 安装 `@cloudflare/next-on-pages`
   - 更新构建配置
   - 测试 API 路由是否正常工作

2. **如果遇到问题**，考虑：
   - 临时使用 Vercel（最简单）
   - 或者配置 Cloudflare Functions 来处理 API

**如果你还没设置好：**

- **推荐使用 Vercel**（最简单，零配置）
- 或者使用 Cloudflare Pages + `@cloudflare/next-on-pages`

## 🔍 下一步操作

让我帮你配置 Cloudflare Pages 以支持 Next.js API 路由。
