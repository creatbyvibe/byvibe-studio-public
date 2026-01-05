# Cloudflare Pages 快速修复方案

## 🔴 常见错误和立即修复

### 问题 1：构建失败 - "@cloudflare/next-on-pages 找不到"

**错误信息：**
```
Error: Cannot find module '@cloudflare/next-on-pages'
```

**解决方案：**

已修复！我已经更新了 `package.json`，构建命令现在是：
```json
"pages:build": "next build && npx @cloudflare/next-on-pages"
```

**操作步骤：**
1. 代码已更新，推送到 GitHub
2. Cloudflare 会自动重新构建

### 问题 2：API 路由返回 404

**可能原因：**
- `@cloudflare/next-on-pages` 未正确转换 API 路由
- 需要先运行 `next build`

**解决方案：**
已修复！构建命令现在包含 `next build` 步骤。

### 问题 3：环境变量未加载

**检查：**
1. Cloudflare Dashboard → Pages → Settings → Variables and Secrets
2. 确认 `GEMINI_API_KEY` 存在
3. 确认值正确（无多余空格）

**解决方案：**
如果环境变量已设置但仍不工作：
1. 删除环境变量
2. 重新添加（确保名称完全匹配：`GEMINI_API_KEY`）
3. 重新部署

### 问题 4：API 返回 500 - "API key not configured"

**原因：**
环境变量在 Cloudflare Functions 中的访问方式可能不同。

**解决方案 A：使用 Cloudflare 环境变量（推荐）**

修改 API 路由以兼容 Cloudflare：

```typescript
// 兼容 Cloudflare 和标准 Next.js
const apiKey = process.env.GEMINI_API_KEY || 
               (globalThis as any).GEMINI_API_KEY ||
               (globalThis as any).env?.GEMINI_API_KEY;
```

**解决方案 B：检查环境变量设置**

1. 在 Cloudflare Dashboard 中：
   - Pages → Settings → Variables and Secrets
   - 确认变量类型是 "Text"（不是 "Secret"）
   - 确认在 Production 环境设置了

2. 重新部署

## 🚀 立即执行的修复步骤

### 步骤 1：更新代码（已完成）

我已经更新了 `package.json`，构建命令现在是：
```
next build && npx @cloudflare/next-on-pages
```

### 步骤 2：推送到 GitHub

```bash
git add package.json
git commit -m "fix: 修复 Cloudflare Pages 构建命令"
git push origin main
```

### 步骤 3：检查 Cloudflare 配置

在 Cloudflare Dashboard 确认：

1. **Build command**: `npm run pages:build` ✅
2. **Output directory**: `.vercel/output/static` ✅
3. **Environment variables**: `GEMINI_API_KEY` 已设置 ✅

### 步骤 4：触发重新部署

1. Cloudflare 会自动检测新的提交
2. 或者手动触发：Deployments → Retry deployment

### 步骤 5：查看构建日志

1. Pages → Deployments → 最新部署
2. 查看构建日志
3. 查找错误信息

## 🔍 如果还是不行

### 方案 A：使用 Vercel（最简单）

如果 Cloudflare 持续有问题，Vercel 是最简单的选择：

1. 访问 https://vercel.com
2. 导入 GitHub 仓库
3. 设置环境变量 `GEMINI_API_KEY`
4. 零配置自动部署

### 方案 B：检查具体错误

请提供：
1. **构建日志**（从 Cloudflare Dashboard 复制）
2. **具体错误信息**
3. **部署状态**（成功/失败）
4. **测试结果**（访问什么，返回什么）

## 📝 已修复的问题

✅ 构建命令已更新（包含 `next build`）
✅ 依赖已确认（@cloudflare/next-on-pages）
✅ 配置文件已检查

## 🎯 下一步

1. 推送更新的代码
2. 等待 Cloudflare 重新构建
3. 查看构建日志
4. 测试部署结果

如果还有问题，请提供具体的错误信息，我会继续帮你解决！
