# 部署配置指南

## ⚠️ 重要：当前项目需要服务器端支持

由于项目包含 API 路由（`/api/polish` 和 `/api/orchestrate`），需要支持服务器端渲染的平台。

## 🚀 推荐的部署平台

### 1. Vercel（最推荐 - Next.js 原生支持）

**优势：**
- Next.js 官方平台，完美支持所有功能
- 自动检测 Next.js 项目
- 零配置部署
- 免费套餐包含 API 路由支持

**部署步骤：**
1. 访问 https://vercel.com
2. 使用 GitHub 账号登录
3. 点击 "Add New Project"
4. 选择仓库：`creatbyvibe/byvibe-studio-public`
5. Vercel 会自动检测 Next.js 配置
6. 添加环境变量：
   - `GEMINI_API_KEY` = 你的 Gemini API Key
7. 点击 "Deploy"

**配置：**
- Framework: Next.js（自动检测）
- Build Command: `npm run build`（自动）
- Output Directory: `.next`（自动）
- Install Command: `npm install`（自动）

### 2. Cloudflare Pages（需要 Workers）

**注意：** Cloudflare Pages 默认只支持静态站点，需要配置 Workers 来支持 API 路由。

**配置步骤：**
1. 在 Cloudflare Dashboard 创建 Pages 项目
2. 连接 GitHub 仓库
3. 构建设置：
   - Framework preset: `Next.js`
   - Build command: `npm run build`
   - Build output directory: `.next`（不是 `out`）
   - Root directory: `/`
4. 环境变量：
   - `GEMINI_API_KEY` = 你的 API Key
5. 需要配置 Cloudflare Workers 来处理 API 路由

**更新 cloudflare-pages.json：**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "rootDirectory": "/",
  "framework": "nextjs",
  "nodeVersion": "20"
}
```

### 3. Netlify

**部署步骤：**
1. 访问 https://netlify.com
2. 连接 GitHub 仓库
3. 构建设置：
   - Build command: `npm run build`
   - Publish directory: `.next`
4. 环境变量：
   - `GEMINI_API_KEY`

## 📝 必需的环境变量

在所有平台上都需要设置：

```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

**获取 API Key：**
1. 访问 https://makersuite.google.com/app/apikey
2. 创建新的 API Key
3. 复制到平台的环境变量设置中

## 🔧 当前配置检查

### next.config.js ✅
- 已移除 `output: 'export'`（支持 API 路由）
- 配置正确

### package.json ✅
- 构建脚本正确：`npm run build`
- 依赖完整

### API 路由 ✅
- `/api/polish` - 已创建
- `/api/orchestrate` - 已创建
- 需要服务器端支持

## 🎯 推荐方案

**最佳选择：Vercel**
- 最简单，零配置
- 完美支持 Next.js API 路由
- 自动 HTTPS 和 CDN
- 免费套餐足够使用

**部署后检查清单：**
- [ ] 环境变量已设置
- [ ] 部署成功
- [ ] 页面可以访问
- [ ] API 路由正常工作（测试 `/api/polish`）
- [ ] 控制台功能正常

## 📊 部署状态检查

部署后，可以通过以下方式检查：

1. **查看部署日志**：在平台仪表板查看构建日志
2. **测试 API**：访问 `https://your-domain.com/api/polish`（应该返回错误，说明 API 路由工作）
3. **测试页面**：访问主页，测试控制台功能

## 🐛 常见问题

### Q: 构建失败？
A: 检查环境变量是否设置，Node.js 版本（需要 18+）

### Q: API 路由返回 404？
A: 确保使用支持服务器端的平台（Vercel/Netlify），不是静态托管

### Q: 环境变量不生效？
A: 确保变量名正确，重启部署
