# Cloudflare Pages nodejs_compat 标志持久化配置

## 🔴 问题描述

每次部署后，`nodejs_compat` 兼容性标志都会丢失，需要重新在 Dashboard 中手动添加，特别是 Production 环境。

## ✅ 解决方案：在 wrangler.toml 中配置

### 更新后的 `wrangler.toml` 配置

```toml
name = "byvibe-studio-public"
compatibility_date = "2024-09-23"
pages_build_output_dir = ".vercel/output/static"
compatibility_flags = ["nodejs_compat"]
```

### 关键配置说明

1. **`compatibility_flags = ["nodejs_compat"]`**
   - 在根级别配置，适用于所有环境（Production 和 Preview）
   - 每次部署时自动应用，无需手动在 Dashboard 中设置

2. **`compatibility_date = "2024-09-23"`**
   - 更新为较新的日期，确保支持最新的 Node.js 兼容性功能
   - 之前的 `2024-01-01` 可能不够新

3. **`pages_build_output_dir`**
   - 保持原有配置，指定构建输出目录

## 🚀 部署步骤

### 1. 更新代码

代码已更新 `wrangler.toml` 文件，包含兼容性标志配置。

### 2. 提交并推送

```bash
git add wrangler.toml
git commit -m "fix: 在 wrangler.toml 中配置 nodejs_compat 标志以持久化"
git push origin main
```

### 3. Cloudflare 自动部署

- Cloudflare Pages 会自动检测到 `wrangler.toml` 文件
- 构建时会自动读取兼容性标志配置
- **无需在 Dashboard 中手动设置**

## 🔍 验证配置

### 方法 1：检查构建日志

在 Cloudflare Pages 的构建日志中，应该看到：
```
Found wrangler.toml file. Reading build configuration...
compatibility_flags: ["nodejs_compat"]
```

### 方法 2：检查部署后的网站

部署成功后：
- ✅ 不再显示 "Node.JS Compatibility Error"
- ✅ 网站正常加载
- ✅ API 路由正常工作

### 方法 3：检查 Dashboard（可选）

虽然不需要手动设置，但可以验证 Dashboard 中是否自动应用了配置：
1. 进入 Cloudflare Dashboard
2. Pages → 你的项目 → Settings → Functions
3. 查看 Compatibility Flags，应该显示 `nodejs_compat`

## ⚠️ 重要提示

### 为什么之前的方法不工作？

1. **Dashboard 手动设置**
   - 每次部署时可能会被重置
   - 特别是 Production 环境，配置容易丢失
   - 需要每次手动重新添加

2. **wrangler.toml 配置（新方法）**
   - 配置在代码中，随代码一起部署
   - 每次构建时自动读取
   - 不会丢失，持久化保存

### 如果仍然不工作

如果 `wrangler.toml` 配置仍然不生效，可以尝试：

1. **检查文件位置**
   - 确保 `wrangler.toml` 在项目根目录
   - 与 `package.json` 同级

2. **检查文件格式**
   - 确保 TOML 格式正确
   - 没有语法错误

3. **清理构建缓存**
   - 在 Cloudflare Dashboard 中，可以尝试清理构建缓存
   - 或者手动触发一次新的部署

4. **使用环境特定配置（备选方案）**

如果根级别配置不工作，可以尝试环境特定配置：

```toml
name = "byvibe-studio-public"
compatibility_date = "2024-09-23"
pages_build_output_dir = ".vercel/output/static"

[env.production]
compatibility_flags = ["nodejs_compat"]

[env.preview]
compatibility_flags = ["nodejs_compat"]
```

## 📋 完整配置清单

### wrangler.toml（已更新 ✅）

```toml
name = "byvibe-studio-public"
compatibility_date = "2024-09-23"
pages_build_output_dir = ".vercel/output/static"
compatibility_flags = ["nodejs_compat"]
```

### cloudflare-pages.json（保持不变）

```json
{
  "buildCommand": "npm install --legacy-peer-deps && npm run pages:build",
  "outputDirectory": ".vercel/output/static",
  "rootDirectory": "/",
  "framework": "nextjs",
  "nodeVersion": "20"
}
```

## 🎯 预期结果

配置完成后：

1. ✅ **首次部署**：兼容性标志自动应用
2. ✅ **后续部署**：兼容性标志自动保留，无需手动设置
3. ✅ **Production 环境**：标志不会丢失
4. ✅ **Preview 环境**：标志自动应用

## 📚 参考文档

- [Cloudflare Pages wrangler.toml 配置](https://developers.cloudflare.com/pages/platform/build-configuration/)
- [Cloudflare Workers 兼容性标志](https://developers.cloudflare.com/workers/configuration/compatibility-dates/)
- [Node.js 兼容性](https://developers.cloudflare.com/workers/runtime-apis/nodejs/)

---

**更新日期**: 2026-01-05
**状态**: ✅ 已配置，等待部署验证
