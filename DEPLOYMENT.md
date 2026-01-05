# Cloudflare Pages 部署指南

这是专门为新手准备的详细部署指南，帮助你将 byVibe.ai 网站部署到 Cloudflare Pages。

## 📋 前置准备

1. ✅ 已经注册 Cloudflare 账户
2. ✅ 已经拥有域名 byvibe.ai
3. ✅ 域名已经在 Cloudflare 管理

## 🚀 部署步骤

### 第一步：准备代码

确保你的代码已经准备好：

```bash
# 在项目目录下
cd ~/byvibe-hero
npm install
npm run build
```

这会生成 `dist` 目录，里面包含所有需要部署的文件。

### 第二步：登录 Cloudflare Dashboard

1. 访问 https://dash.cloudflare.com
2. 使用你的账户登录

### 第三步：创建 Pages 项目

#### 方式 A：直接上传（最简单，适合第一次）

1. 在 Cloudflare Dashboard 中，点击左侧菜单的 **"Pages"**
2. 点击 **"Create a project"** 按钮
3. 选择 **"Upload assets"** 选项
4. 给你的项目起个名字，比如 `byvibe-hero`
5. 点击 **"Upload site"**
6. 将 `dist` 目录中的所有文件拖拽到上传区域（或者选择文件夹）
7. 点击 **"Deploy site"**

#### 方式 B：通过 Git 连接（推荐，方便后续更新）

1. 首先将代码推送到 GitHub 或 GitLab
   ```bash
   cd ~/byvibe-hero
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <你的仓库地址>
   git push -u origin main
   ```

2. 在 Cloudflare Dashboard 中，点击 **"Pages"**
3. 点击 **"Create a project"**
4. 选择 **"Connect to Git"**
5. 授权 Cloudflare 访问你的 Git 仓库
6. 选择你刚创建的仓库
7. 配置构建设置：
   - **Framework preset**: 选择 "Vite"
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (留空即可)
   - **Environment variables**: 如果有的话可以添加
8. 点击 **"Save and Deploy"**

### 第四步：配置自定义域名

1. 部署成功后，进入项目详情页面
2. 点击 **"Custom domains"** 标签
3. 点击 **"Set up a custom domain"**
4. 输入你的域名：`byvibe.ai` 和 `www.byvibe.ai`（可选）
5. Cloudflare 会自动检测并配置 DNS 记录
6. 等待几分钟，DNS 记录生效

### 第五步：验证部署

1. 访问你的域名：https://byvibe.ai
2. 如果能看到页面，说明部署成功！🎉

## 🔄 更新网站

### 如果使用直接上传方式：

每次更新时，重新运行 `npm run build`，然后将新的 `dist` 目录上传到 Cloudflare Pages。

### 如果使用 Git 连接：

1. 修改代码后，提交并推送到 Git 仓库
2. Cloudflare Pages 会自动检测到更改并重新构建部署
3. 你可以在 Cloudflare Dashboard 中查看部署状态

## 🛠️ 常见问题

### Q: 构建失败怎么办？

A: 检查以下几点：
- 确保 `package.json` 中的构建脚本正确
- 检查是否有依赖问题，运行 `npm install`
- 在 Cloudflare Dashboard 中查看构建日志，找到具体错误信息

### Q: 域名无法访问？

A: 检查以下几点：
- DNS 记录是否已正确配置（等待几分钟让 DNS 生效）
- 确保域名在 Cloudflare 管理
- 检查 SSL/TLS 设置（Cloudflare 默认会自动配置）

### Q: 如何查看部署日志？

A: 在 Cloudflare Pages 项目页面，点击 "Deployments"，然后点击具体的部署记录，可以看到详细的构建和部署日志。

## 💡 提示

- Cloudflare Pages 提供免费的 HTTPS 证书
- 全球 CDN 加速，访问速度快
- 每次 Git push 都会自动触发部署（如果使用 Git 方式）
- 可以设置预览部署（Preview deployments）来测试更改

## 📚 更多资源

- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html)

---

祝你部署顺利！如有问题，可以查看 Cloudflare 的官方文档或社区支持。