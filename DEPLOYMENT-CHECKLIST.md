# 部署检查清单

## ✅ 已完成的配置

- [x] 代码已推送到 GitHub
- [x] 更新了 `cloudflare-pages.json`（输出目录改为 `.next`）
- [x] 创建了 `vercel.json` 配置文件
- [x] 创建了详细的部署指南

## 🚀 下一步：选择部署平台

### 选项 1：Vercel（推荐 ⭐）

**为什么推荐：**
- Next.js 官方平台，零配置
- 完美支持 API 路由
- 自动 HTTPS 和全球 CDN
- 免费套餐足够使用

**快速部署：**
1. 访问：https://vercel.com/new
2. 使用 GitHub 登录
3. 导入仓库：`creatbyvibe/byvibe-studio-public`
4. 添加环境变量：
   ```
   GEMINI_API_KEY=your_api_key_here
   ```
5. 点击 "Deploy"

**部署后 URL：**
- 自动生成：`https://byvibe-studio-public.vercel.app`
- 可以绑定自定义域名

### 选项 2：Cloudflare Pages

**配置步骤：**
1. 访问：https://dash.cloudflare.com
2. 进入 Pages → Create a project
3. 连接 GitHub 仓库
4. 构建设置：
   - Framework: Next.js
   - Build command: `npm run build`
   - Output directory: `.next`
5. 环境变量：
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

**注意：** Cloudflare Pages 需要配置 Workers 来支持 API 路由。

## 🔍 部署状态检查

### 1. 检查 GitHub Actions（如果有）

访问：https://github.com/creatbyvibe/byvibe-studio-public/actions

查看是否有自动部署工作流运行。

### 2. 检查平台部署状态

**Vercel：**
- 访问：https://vercel.com/dashboard
- 查看项目部署状态

**Cloudflare：**
- 访问：https://dash.cloudflare.com
- Pages → 项目 → Deployments

### 3. 测试部署

部署成功后，测试以下功能：

- [ ] 主页可以访问
- [ ] 导航栏正常工作
- [ ] 视频轮播正常
- [ ] 工具目录可以打开
- [ ] API 路由测试（需要设置环境变量）

## 🔑 环境变量设置

**必需的环境变量：**

```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

**获取 API Key：**
1. 访问：https://makersuite.google.com/app/apikey
2. 创建新的 API Key
3. 复制到部署平台的环境变量设置

**在哪里设置：**
- Vercel: Project Settings → Environment Variables
- Cloudflare: Pages → Settings → Environment variables

## 🧪 功能测试清单

部署后，请测试：

### 基础功能
- [ ] 页面加载正常
- [ ] 响应式设计正常（移动端/桌面端）
- [ ] 导航切换正常
- [ ] 视频轮播正常

### 交互功能
- [ ] 等待列表表单可以提交
- [ ] 工具目录搜索和过滤
- [ ] 工具详情模态框

### API 功能（需要环境变量）
- [ ] Refine 功能（优化 Vibe）
- [ ] Generate Plan 功能（生成项目规划）

## 📊 部署日志检查

如果部署失败，检查：

1. **构建日志**：查看错误信息
2. **环境变量**：确认已正确设置
3. **Node.js 版本**：确保是 18+
4. **依赖安装**：确认 `npm install` 成功

## 🐛 常见问题

### Q: 构建失败？
**A:** 检查：
- Node.js 版本（需要 18+）
- 环境变量是否正确
- 构建日志中的具体错误

### Q: API 路由返回 404？
**A:** 确保：
- 使用支持服务器端的平台（Vercel/Netlify）
- 不是静态托管
- API 路由路径正确

### Q: 环境变量不生效？
**A:** 
- 确认变量名正确（`GEMINI_API_KEY`）
- 重新部署项目
- 检查平台的环境变量设置

## 📝 部署后操作

1. **设置自定义域名**（可选）
2. **配置 HTTPS**（通常自动）
3. **测试所有功能**
4. **监控错误日志**

## 🎉 完成！

部署成功后，你的 ByVibe Hero 页面就可以在线上访问了！

如有问题，请查看：
- `DEPLOYMENT-CONFIG.md` - 详细部署配置
- 平台官方文档
- 构建日志中的错误信息
