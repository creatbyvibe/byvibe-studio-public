# 全新部署指南

## ✅ 当前状态

- ✅ 代码已推送到 GitHub
- ✅ 依赖版本已修复
- ✅ package-lock.json 已同步
- ✅ .npmrc 配置已添加
- ✅ 构建脚本已配置

## 🚀 重新部署步骤

### 步骤 1：在 Cloudflare Dashboard 创建新项目

1. 访问：https://dash.cloudflare.com
2. 进入 **Workers & Pages**
3. 点击 **Create application** → **Pages** → **Connect to Git**
4. 选择 GitHub 并授权
5. 选择仓库：`creatbyvibe/byvibe-studio-public`
6. 选择分支：`main`

### 步骤 2：配置构建设置

在项目设置页面配置：

**Builds & deployments：**
- **Framework preset**: `None`（或留空）
- **Build command**: `npm install --legacy-peer-deps && npm run pages:build`
- **Build output directory**: `.vercel/output/static`
- **Root directory**: `/`（留空）

**Environment variables：**
点击 **Variables and Secrets**，添加：
- **Variable name**: `GEMINI_API_KEY`
- **Value**: 你的 Gemini API Key
- **Type**: Text
- **Environment**: Production 和 Preview 都要设置

### 步骤 3：保存并部署

1. 点击 **Save and Deploy**
2. 等待构建完成（通常 3-5 分钟）
3. 查看构建日志

## 📋 配置检查清单

部署前确认：

- [ ] 仓库已连接：`creatbyvibe/byvibe-studio-public`
- [ ] 分支：`main`
- [ ] 构建命令：`npm install --legacy-peer-deps && npm run pages:build`
- [ ] 输出目录：`.vercel/output/static`
- [ ] 环境变量：`GEMINI_API_KEY` 已设置
- [ ] Node.js 版本：20（自动检测）

## 🔍 构建日志检查

构建成功后，检查日志中应该看到：

1. ✅ 依赖安装成功（没有 ERESOLVE 错误）
2. ✅ `next build` 成功
3. ✅ `@cloudflare/next-on-pages` 转换成功
4. ✅ 部署成功

## 🐛 如果构建失败

### 错误 1：依赖冲突

**症状**：`npm error code ERESOLVE`

**解决**：
- 确认构建命令包含 `--legacy-peer-deps`
- 检查 `.npmrc` 文件是否在仓库中

### 错误 2：找不到模块

**症状**：`Cannot find module '@cloudflare/next-on-pages'`

**解决**：
- 确认 `package.json` 中有该依赖
- 确认构建命令正确执行了 `npm install`

### 错误 3：输出目录错误

**症状**：`Build output directory not found`

**解决**：
- 确认输出目录：`.vercel/output/static`
- 确认 `pages:build` 命令成功执行

## 📝 当前配置总结

### package.json
```json
{
  "dependencies": {
    "next": "^14.2.0"
  },
  "devDependencies": {
    "@cloudflare/next-on-pages": "^1.13.16"
  },
  "scripts": {
    "pages:build": "next build && npx @cloudflare/next-on-pages"
  }
}
```

### .npmrc
```
legacy-peer-deps=true
```

### 构建命令
```
npm install --legacy-peer-deps && npm run pages:build
```

## 🎯 部署后测试

部署成功后，测试：

1. **主页访问**
   - 访问你的 Pages URL
   - 检查页面是否正常加载

2. **API 路由测试**
   - 访问 `/api/polish`（应该返回错误，说明路由工作）
   - 测试控制台的 Refine 功能
   - 测试 Generate Plan 功能

3. **功能测试**
   - 导航切换
   - 视频轮播
   - 工具目录
   - 响应式设计

## 💡 提示

- 首次构建可能需要 5-10 分钟
- 如果构建失败，查看完整的构建日志
- 确保环境变量已正确设置
- 可以随时重新部署

## 🎉 完成！

部署成功后，你的 ByVibe Hero 页面就可以在线访问了！

如有问题，请提供构建日志，我会继续帮你解决。
