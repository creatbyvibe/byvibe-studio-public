# Cloudflare Pages 错误排查指南

## 🔍 常见错误和解决方案

### 错误 1：构建失败

#### 症状
- 部署状态显示 "Failed"
- 构建日志中有错误信息

#### 可能原因和解决方案

**原因 A：@cloudflare/next-on-pages 未安装**

**检查：**
```bash
# 在本地运行
npm list @cloudflare/next-on-pages
```

**解决：**
1. 确保 `package.json` 中有依赖：
```json
{
  "devDependencies": {
    "@cloudflare/next-on-pages": "^1.11.4"
  }
}
```

2. 如果缺失，添加并推送：
```bash
npm install --save-dev @cloudflare/next-on-pages
git add package.json package-lock.json
git commit -m "fix: 添加 @cloudflare/next-on-pages 依赖"
git push origin main
```

**原因 B：Node.js 版本不兼容**

**检查：**
- Cloudflare Pages 需要 Node.js 18+

**解决：**
1. 创建 `.nvmrc` 文件：
```bash
echo "20" > .nvmrc
```

2. 或者在 Cloudflare Dashboard 设置 Node.js 版本

**原因 C：构建命令错误**

**检查：**
- Build command 应该是：`npm run pages:build`
- 不是：`npm run build`

**解决：**
在 Cloudflare Dashboard 中确认：
- Build command: `npm run pages:build`
- Output directory: `.vercel/output/static`

### 错误 2：API 路由返回 404

#### 症状
- 页面可以访问
- 但 `/api/polish` 或 `/api/orchestrate` 返回 404

#### 可能原因和解决方案

**原因 A：@cloudflare/next-on-pages 未正确转换 API 路由**

**检查构建日志：**
- 查看是否有 API 路由转换的警告或错误

**解决：**
1. 确保使用了正确的构建命令：`npm run pages:build`
2. 检查 `next.config.js` 配置

**原因 B：环境变量未正确加载**

**检查：**
1. 在 Cloudflare Dashboard 确认环境变量已设置
2. 变量名必须是：`GEMINI_API_KEY`（完全匹配）

**解决：**
1. 删除并重新添加环境变量
2. 确保在 Production 和 Preview 环境都设置了
3. 重新部署

### 错误 3：API 返回 500 错误

#### 症状
- API 路由可以访问（不是 404）
- 但返回 500 内部服务器错误

#### 可能原因和解决方案

**原因 A：环境变量未加载**

**检查代码：**
```typescript
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
}
```

**解决：**
1. 确认环境变量名称正确：`GEMINI_API_KEY`
2. 确认值已正确设置
3. 重新部署（环境变量更改需要重新部署）

**原因 B：Gemini API 调用失败**

**检查：**
- 查看 Cloudflare 的 Function 日志
- 检查 API Key 是否有效

**解决：**
1. 测试 API Key：
```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"test"}]}]}'
```

2. 如果 API Key 无效，重新生成

**原因 C：Node.js API 不兼容**

**检查：**
- Cloudflare Workers 不支持所有 Node.js API
- 某些 API 可能需要适配

**解决：**
查看构建日志中的具体错误，可能需要：
1. 使用 Cloudflare 兼容的 API
2. 调整代码以适配 Cloudflare 环境

### 错误 4：页面无法访问

#### 症状
- 部署成功
- 但访问页面显示错误或空白

#### 可能原因和解决方案

**原因 A：输出目录错误**

**检查：**
- Output directory 应该是：`.vercel/output/static`
- 不是：`.next` 或 `out`

**解决：**
在 Cloudflare Dashboard 更新：
- Build output directory: `.vercel/output/static`

**原因 B：路由配置问题**

**检查：**
- 查看构建日志
- 检查是否有路由转换错误

## 🔧 完整排查步骤

### 步骤 1：检查构建日志

1. 访问 Cloudflare Dashboard
2. Pages → 你的项目 → Deployments
3. 点击最新的部署
4. 查看构建日志

**查找：**
- 错误信息（红色）
- 警告信息（黄色）
- API 路由转换信息

### 步骤 2：检查环境变量

1. Pages → Settings → Variables and Secrets
2. 确认 `GEMINI_API_KEY` 存在
3. 确认值正确（完整复制，无多余空格）
4. 确认在 Production 环境设置了

### 步骤 3：检查构建配置

1. Pages → Settings → Builds & deployments
2. 确认：
   - Build command: `npm run pages:build`
   - Output directory: `.vercel/output/static`
   - Framework preset: None（或 Next.js）

### 步骤 4：测试 API Key

在本地或使用 curl 测试 API Key 是否有效。

### 步骤 5：检查代码兼容性

查看构建日志，确认是否有 Node.js API 兼容性问题。

## 🚀 快速修复方案

### 方案 1：完全重新配置

1. **删除并重新创建环境变量**
2. **确认构建配置正确**
3. **触发新的部署**

### 方案 2：使用 Vercel（最简单）

如果 Cloudflare 持续有问题，可以考虑：
1. 在 Vercel 创建新项目
2. 连接同一个 GitHub 仓库
3. 设置环境变量
4. 零配置自动部署

### 方案 3：检查依赖

确保所有依赖都已正确安装：
```bash
npm install
git add package-lock.json
git commit -m "fix: 更新依赖"
git push origin main
```

## 📝 需要的信息

为了更准确地诊断问题，请提供：

1. **构建日志**（从 Cloudflare Dashboard 复制）
2. **错误信息**（具体的错误消息）
3. **部署状态**（成功/失败）
4. **测试结果**（访问什么 URL，返回什么）

## 🔗 有用的链接

- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [@cloudflare/next-on-pages 文档](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
- [Cloudflare Functions 文档](https://developers.cloudflare.com/pages/platform/functions/)
