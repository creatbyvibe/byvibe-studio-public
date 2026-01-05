# Cloudflare Pages 自动部署配置指南

## 快速设置步骤

### 1. 在 Cloudflare Dashboard 中创建 Pages 项目

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Pages** 部分
3. 点击 **Create a project**
4. 选择 **Connect to Git**
5. 授权 GitHub 访问权限
6. 选择仓库：`creatbyvibe/byvibe-studio-public`
7. 选择分支：`main`

### 2. 配置构建设置

在 Cloudflare Pages 项目设置中配置：

**构建设置：**
- **Framework preset**: `Next.js (Static HTML Export)`
- **Build command**: `npm run build`
- **Build output directory**: `out`
- **Root directory**: `/` (留空或填写 `/`)

**环境变量：**
在 **Settings** → **Environment variables** 中添加：

```
NEXT_PUBLIC_SUPABASE_URL=https://xejrdjqsuloecdeviopx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_rMqAnJxp6DWT9SsowLTNcw_ucR4BqEk
```

### 3. 部署配置

**Node.js 版本：**
- Cloudflare Pages 会自动检测 `.nvmrc` 或 `.node-version` 文件
- 当前配置：Node.js 18

**构建配置：**
- 构建命令：`npm run build`
- 输出目录：`out`（Next.js 静态导出目录）

### 4. 自定义域名（可选）

1. 在 Pages 项目设置中进入 **Custom domains**
2. 添加你的自定义域名
3. 按照提示配置 DNS 记录

## 自动部署流程

配置完成后，每次推送到 `main` 分支都会自动触发部署：

1. **Push to GitHub** → Cloudflare 检测到更改
2. **自动构建** → 运行 `npm run build`
3. **生成静态文件** → 输出到 `out/` 目录
4. **部署上线** → 自动部署到 Cloudflare 边缘网络

## 部署状态

- 在 Cloudflare Dashboard 的 Pages 项目中可以查看：
  - 部署历史
  - 构建日志
  - 部署状态（成功/失败）

## 环境变量管理

### 生产环境变量
在 Cloudflare Pages 项目设置中添加：
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 预览环境变量
可以为预览部署（Pull Request）配置不同的环境变量。

## 注意事项

1. **静态导出限制**：
   - API 路由 (`app/api/*`) 不会被包含在静态导出中
   - 当前 Waitlist 组件直接使用 Supabase 客户端，不受影响

2. **环境变量**：
   - 所有 `NEXT_PUBLIC_*` 开头的变量会在构建时注入
   - 确保在 Cloudflare Pages 中正确配置

3. **构建时间**：
   - 首次构建可能需要 2-5 分钟
   - 后续构建通常更快（1-3 分钟）

4. **缓存**：
   - Cloudflare Pages 会自动缓存静态资源
   - 更新代码后会自动清除缓存

## 故障排查

### 构建失败
1. 检查构建日志中的错误信息
2. 确认 Node.js 版本（需要 18+）
3. 检查环境变量是否正确配置
4. 确认 `package.json` 中的依赖都已安装

### 页面无法访问
1. 检查自定义域名 DNS 配置
2. 确认部署状态为 "Success"
3. 检查浏览器控制台是否有错误

### Supabase 连接问题
1. 确认环境变量已正确配置
2. 检查 Supabase 项目的 RLS 策略
3. 确认 `waitlist` 表已创建

## 相关文件

- `.nvmrc` - Node.js 版本配置
- `.node-version` - Node.js 版本配置（备用）
- `next.config.js` - Next.js 配置（包含静态导出设置）
- `package.json` - 项目依赖和脚本

## 支持

如有问题，请查看：
- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Next.js 静态导出文档](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
