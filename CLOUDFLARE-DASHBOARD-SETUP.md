# Cloudflare Dashboard 配置检查清单

## ✅ 当前配置检查

根据你的截图，我看到：

### 已正确配置 ✅
- **Build command**: `npm run pages:build` ✅ 正确
- **Build output directory**: `.vercel/output/static` ✅ 正确
- **Enable build comments**: 已勾选 ✅ 好习惯

### 需要检查 ⚠️

**Framework preset: None**

这个设置有两个选项：

#### 选项 1：保持 "None"（推荐）
- 如果你使用 `@cloudflare/next-on-pages`，可以保持 "None"
- 因为构建命令已经指定了 `pages:build`
- 这样可以完全控制构建过程

#### 选项 2：选择 "Next.js"
- 如果 Cloudflare 检测到 Next.js 项目
- 可能会自动设置一些默认值
- 但可能会与 `pages:build` 冲突

**建议：保持 "None"**，因为：
- 你已经手动配置了正确的构建命令
- `@cloudflare/next-on-pages` 会处理所有 Next.js 相关配置
- 避免自动检测可能带来的冲突

## 🔧 完整配置清单

### Build configuration
- [x] Framework preset: **None**（保持）
- [x] Build command: **`npm run pages:build`** ✅
- [x] Build output directory: **`.vercel/output/static`** ✅
- [ ] Root directory: `/`（如果需要，展开设置）

### Environment variables（重要！）

在 **Settings** → **Environment variables** 中必须添加：

```
GEMINI_API_KEY=your_gemini_api_key_here
```

**设置位置：**
1. Pages → 你的项目 → Settings
2. Environment variables
3. 添加变量：
   - Variable name: `GEMINI_API_KEY`
   - Value: 你的 API Key
   - Environment: 选择 Production 和 Preview

## 🚀 下一步操作

1. **确认构建配置**（你已经完成了 ✅）
   - Build command: `npm run pages:build`
   - Output directory: `.vercel/output/static`

2. **设置环境变量**（必需！）
   - 添加 `GEMINI_API_KEY`
   - 否则 API 功能无法使用

3. **点击 Save** 保存配置

4. **触发部署**
   - 如果代码已推送，Cloudflare 会自动检测
   - 或者手动触发一次部署

## 🧪 部署后测试

部署成功后，测试：

1. **主页访问**
   - 访问你的 Pages URL
   - 检查页面是否正常加载

2. **API 路由测试**
   - 访问 `/api/polish`（应该返回错误，说明路由工作）
   - 测试控制台的 Refine 功能
   - 测试 Generate Plan 功能

3. **检查构建日志**
   - Pages → Deployments → 查看最新部署
   - 检查是否有错误或警告

## ⚠️ 常见问题

### Q: Framework preset 应该选什么？
**A:** 保持 "None"，因为使用 `@cloudflare/next-on-pages` 时不需要框架预设。

### Q: 构建失败怎么办？
**A:** 
1. 检查构建日志
2. 确认 `@cloudflare/next-on-pages` 已安装（在 package.json 中）
3. 检查 Node.js 版本（需要 18+）

### Q: API 路由返回 404？
**A:**
1. 确认环境变量已设置
2. 检查构建日志中是否有 API 路由转换错误
3. 确认使用了 `pages:build` 而不是 `build`

## 📝 配置总结

你的配置看起来很好！只需要：

1. ✅ 保持当前构建配置
2. ⚠️ **重要：设置环境变量 `GEMINI_API_KEY`**
3. ✅ 点击 Save
4. ✅ 等待自动部署

## 🎉 完成！

配置完成后，你的 Next.js 应用就可以在 Cloudflare Pages 上运行了，包括 API 路由！
