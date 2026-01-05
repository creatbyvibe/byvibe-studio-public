# Cloudflare Pages 配置指南（Next.js + API 路由）

## ✅ 答案：继续使用 Pages，不需要改成 Workers

**原因：**
- Pages 更适合完整的 Next.js 应用
- Workers 更适合纯 API 服务
- 你的项目有前端页面 + API 路由，Pages 是正确选择

## 🔧 已完成的配置更新

我已经更新了以下文件以支持 Cloudflare Pages：

1. **package.json**
   - 添加了 `@cloudflare/next-on-pages` 依赖
   - 添加了 `pages:build` 和 `pages:dev` 脚本

2. **cloudflare-pages.json**
   - 更新构建命令为 `npm run pages:build`
   - 更新输出目录为 `.vercel/output/static`

## 📝 在 Cloudflare Dashboard 中的配置

### 1. 项目设置

访问：https://dash.cloudflare.com → Pages → 你的项目 → Settings

### 2. 构建设置

**Builds & deployments：**
- **Build command**: `npm run pages:build`
- **Build output directory**: `.vercel/output/static`
- **Root directory**: `/` (留空)
- **Environment variables**: 添加 `GEMINI_API_KEY`

### 3. 环境变量

在 **Environment variables** 中添加：

```
GEMINI_API_KEY=your_gemini_api_key_here
```

**注意：** 需要为 Production 和 Preview 环境分别设置。

## 🚀 部署流程

1. **代码推送到 GitHub** → Cloudflare 自动检测
2. **运行构建** → `npm run pages:build`
3. **部署到边缘** → 自动部署到 Cloudflare 全球网络

## ⚠️ 重要提示

### API 路由兼容性

`@cloudflare/next-on-pages` 会将 Next.js API 路由转换为 Cloudflare Functions。

**检查你的 API 路由：**

当前 API 路由：
- `/api/polish` - 使用 `fetch` ✅ 兼容
- `/api/orchestrate` - 使用 `fetch` ✅ 兼容

**如果遇到问题：**
- 某些 Node.js API 可能不支持
- 需要使用 Cloudflare 兼容的 API
- 查看构建日志了解具体错误

### 环境变量

**必需的环境变量：**
- `GEMINI_API_KEY` - Gemini API 密钥

**在 Cloudflare Dashboard 设置：**
1. Pages → 项目 → Settings
2. Environment variables
3. 添加变量（Production 和 Preview）

## 🧪 测试部署

部署后测试：

1. **主页访问**：`https://your-domain.pages.dev`
2. **API 路由测试**：
   - 访问 `/api/polish`（应该返回错误，说明路由工作）
   - 测试控制台的 Refine 功能
   - 测试 Generate Plan 功能

## 🔍 故障排查

### 构建失败

1. **检查构建日志**：Cloudflare Dashboard → Deployments → 查看日志
2. **检查依赖**：确保 `@cloudflare/next-on-pages` 已安装
3. **检查 Node.js 版本**：需要 18+

### API 路由不工作

1. **检查环境变量**：确保 `GEMINI_API_KEY` 已设置
2. **检查构建日志**：查看是否有 API 路由转换错误
3. **测试 API**：直接访问 `/api/polish` 查看响应

### 页面无法访问

1. **检查部署状态**：确保部署成功
2. **检查自定义域名**：如果使用自定义域名，检查 DNS 配置
3. **清除缓存**：Cloudflare 会自动处理

## 📊 与 Workers 的对比

| 特性 | Pages | Workers |
|------|-------|---------|
| Next.js 支持 | ✅ 完整支持 | ❌ 需要手动实现 |
| API 路由 | ✅ 自动转换 | ⚠️ 需要手动编写 |
| 前端页面 | ✅ 自动处理 | ❌ 不支持 |
| 配置复杂度 | ⭐ 简单 | ⭐⭐⭐ 复杂 |
| 适合场景 | 全栈应用 | 纯 API 服务 |

## 💡 推荐

**继续使用 Cloudflare Pages**，因为：
- ✅ 你已经设置了 Pages
- ✅ Pages 更适合你的项目
- ✅ 配置相对简单
- ✅ 支持完整的 Next.js 功能

**如果遇到兼容性问题**，可以考虑：
- 使用 Vercel（最简单，零配置）
- 或者调整代码以兼容 Cloudflare

## 📚 相关资源

- [@cloudflare/next-on-pages 文档](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Next.js 部署文档](https://nextjs.org/docs/deployment)
