# Cloudflare Pages 自动部署说明

## ✅ 自动部署已配置

你的项目已经配置好自动部署！每次推送到 `main` 分支都会自动触发部署。

## 🔄 自动部署流程

```
Git Push → Cloudflare 检测 → 自动构建 → 自动部署 → 上线
```

### 详细步骤：

1. **推送到 GitHub**
   ```bash
   git push origin main
   ```

2. **Cloudflare 自动检测**
   - Cloudflare Pages 通过 webhook 检测到代码更改
   - 自动开始新的构建

3. **自动构建**
   - 使用 Node.js 20（从 `.nvmrc` 自动检测）
   - 运行 `npm run build`
   - 生成静态文件到 `out/` 目录

4. **自动部署**
   - 将构建产物部署到 Cloudflare 边缘网络
   - 全球 CDN 加速
   - 自动配置 HTTPS

5. **部署完成**
   - 在 Cloudflare Dashboard 中可以看到部署状态
   - 网站自动更新

## 📊 查看部署状态

### 在 Cloudflare Dashboard 中：

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Pages** → 你的项目
3. 查看 **Deployments** 标签页
   - 可以看到所有部署历史
   - 每个部署的状态（成功/失败/进行中）
   - 构建日志
   - 部署时间

### 部署状态说明：

- ✅ **Success** - 部署成功，网站已更新
- ⏳ **Building** - 正在构建中
- ❌ **Failed** - 构建失败，查看日志排查问题
- 🔄 **Queued** - 等待构建（如果有多个部署在排队）

## 🎯 预览部署（Preview Deployments）

当你创建 Pull Request 时，Cloudflare 会自动创建预览部署：

1. 创建 PR → Cloudflare 自动构建预览版本
2. 在 PR 中会显示预览链接
3. 可以测试更改而不影响生产环境
4. 合并 PR 后，预览部署会自动删除

## ⚙️ 配置检查清单

确保以下配置正确：

- [x] GitHub 仓库已连接到 Cloudflare Pages
- [x] 分支设置为 `main`
- [x] 构建命令：`npm run build`
- [x] 输出目录：`out`
- [x] Node.js 版本：20（通过 `.nvmrc` 自动检测）
- [ ] 环境变量已配置（在 Cloudflare Dashboard 中设置）

### 环境变量配置：

在 Cloudflare Pages 项目设置中：
1. 进入 **Settings** → **Environment variables**
2. 添加以下变量：

```
NEXT_PUBLIC_SUPABASE_URL = https://xejrdjqsuloecdeviopx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = sb_publishable_rMqAnJxp6DWT9SsowLTNcw_ucR4BqEk
```

3. 确保为 **Production** 和 **Preview** 环境都设置了

## 🚀 测试自动部署

### 方法 1：小改动测试

```bash
# 做一个小的更改
echo "# Test" >> README.md

# 提交并推送
git add README.md
git commit -m "test: Verify auto deployment"
git push origin main

# 然后在 Cloudflare Dashboard 中查看部署
```

### 方法 2：查看部署历史

1. 进入 Cloudflare Pages 项目
2. 查看 **Deployments** 标签页
3. 确认每次 push 都有对应的部署记录

## 🔧 故障排查

### 如果自动部署没有触发：

1. **检查 GitHub 连接**
   - 在 Cloudflare Pages 设置中确认仓库连接正常
   - 尝试重新连接 GitHub

2. **检查分支设置**
   - 确认监控的分支是 `main`
   - 确认你推送到了正确的分支

3. **检查构建日志**
   - 查看最近的部署日志
   - 查找错误信息

4. **检查环境变量**
   - 确认所有必需的环境变量都已设置
   - 检查变量值是否正确

### 如果构建失败：

1. **查看构建日志**
   - 在 Cloudflare Dashboard 中打开失败的部署
   - 查看详细的错误信息

2. **常见问题**：
   - 环境变量缺失 → 在设置中添加
   - Node.js 版本不匹配 → 检查 `.nvmrc`
   - 依赖安装失败 → 检查 `package.json`
   - 构建命令错误 → 检查构建配置

## 📝 手动部署（如果需要）

虽然自动部署很方便，但有时你可能需要手动触发：

1. 在 Cloudflare Pages 项目中
2. 点击 **"Retry deployment"** 重新部署最新版本
3. 或者点击 **"Create deployment"** 从特定 commit 部署

## 💡 最佳实践

1. **使用分支策略**
   - `main` 分支 → 生产环境自动部署
   - `develop` 分支 → 开发环境（可选）
   - Feature 分支 → 预览部署（通过 PR）

2. **提交信息**
   - 使用清晰的 commit message
   - 这样在部署历史中更容易追踪

3. **环境变量管理**
   - 生产环境和预览环境可以有不同的变量
   - 敏感信息使用环境变量，不要提交到代码库

4. **监控部署**
   - 定期检查部署状态
   - 设置通知（如果 Cloudflare 支持）

## 🎉 总结

你的项目已经配置好自动部署！只需要：

1. ✅ 在 Cloudflare Dashboard 中连接 GitHub 仓库
2. ✅ 配置环境变量
3. ✅ 推送代码到 `main` 分支

之后每次推送都会自动部署，无需手动操作！
