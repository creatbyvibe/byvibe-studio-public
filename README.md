# byVibe.ai - VibeCoding Hero Page

这是一个使用 VibeCoding 方式构建的现代化 hero 页面，展示了从想法到部署的完整 AI 辅助开发流程。

## 🚀 项目特点

- ⚡ **React + Vite** - 现代化的快速开发体验
- 🎨 **响应式设计** - 完美适配各种设备
- 🌈 **渐变背景** - 美观的视觉效果
- 📱 **移动端优化** - 优秀的移动端体验

## 📦 本地开发

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173 查看页面

### 构建生产版本

```bash
npm run build
```

构建产物将在 `dist` 目录中

## 🌐 部署到 Cloudflare Pages

### 方法一：通过 Cloudflare Dashboard（推荐新手）

1. **登录 Cloudflare Dashboard**
   - 访问 https://dash.cloudflare.com
   - 登录你的账户

2. **创建新的 Pages 项目**
   - 点击左侧菜单的 "Pages"
   - 点击 "Create a project"
   - 选择 "Connect to Git"（如果使用 Git）或 "Upload assets"（直接上传）

3. **如果使用 Git（推荐）**
   - 将代码推送到 GitHub/GitLab
   - 连接你的仓库
   - 构建配置：
     - **Framework preset**: Vite
     - **Build command**: `npm run build`
     - **Build output directory**: `dist`
     - **Root directory**: `/` (项目根目录)

4. **如果直接上传**
   - 先运行 `npm run build` 构建项目
   - 上传 `dist` 目录中的所有文件

5. **自定义域名**
   - 在项目设置中，点击 "Custom domains"
   - 添加你的域名 `byvibe.ai`
   - Cloudflare 会自动配置 DNS

### 方法二：通过 Wrangler CLI

```bash
# 安装 Wrangler
npm install -g wrangler

# 登录
wrangler login

# 在项目根目录创建 wrangler.toml（可选）
# 然后运行
npm run build
wrangler pages deploy dist --project-name=byvibe-hero
```

## 📝 技术栈

- **React 18** - UI 框架
- **Vite** - 构建工具
- **CSS3** - 样式（使用现代 CSS 特性）
- **Cloudflare Pages** - 部署平台

## 📚 更新网站内容

想要添加新工具或更新内容？查看这些文档：

- **快速上手** → [`QUICK-UPDATE-GUIDE.md`](./QUICK-UPDATE-GUIDE.md) - 5分钟学会添加工具
- **详细教程** → [`HOW-TO-UPDATE.md`](./HOW-TO-UPDATE.md) - 完整的更新指南
- **实际例子** → [`EXAMPLE-ADD-TOOL.md`](./EXAMPLE-ADD-TOOL.md) - 一步步演示如何添加工具
- **文档索引** → [`README-UPDATES.md`](./README-UPDATES.md) - 所有更新文档的索引

### 最简单的更新方法

1. 打开 `src/data/tools.js`
2. 复制一个现有工具
3. 修改为新工具信息
4. 保存文件
5. 完成！

详细步骤请查看 [`QUICK-UPDATE-GUIDE.md`](./QUICK-UPDATE-GUIDE.md)

## 🎯 下一步计划

- [x] 添加工具展示功能
- [ ] 添加博客功能
- [ ] 集成内容管理系统
- [ ] 添加更多互动元素
- [ ] SEO 优化
- [ ] 性能优化

## 📄 许可证

MIT License

---

Built with ❤️ using VibeCoding