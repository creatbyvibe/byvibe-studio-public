# 本地开发指南

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

如果遇到依赖冲突，使用：

```bash
npm install --legacy-peer-deps
```

### 2. 配置环境变量

复制环境变量模板文件：

```bash
cp .env.local.example .env.local
```

编辑 `.env.local` 文件，填入真实的环境变量值：

```bash
# Supabase 配置（必需）
NEXT_PUBLIC_SUPABASE_URL=https://xejrdjqsuloecdeviopx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_rMqAnJxp6DWT9SsowLTNcw_ucR4BqEk

# Gemini API 配置（必需）
GEMINI_API_KEY=your_gemini_api_key_here

# Resend API 配置（可选）
RESEND_API_KEY=your_resend_api_key_here
```

### 3. 启动开发服务器

```bash
npm run dev
```

服务器将在 `http://localhost:3000` 启动。

## 📋 环境变量说明

### 必需变量

| 变量名 | 说明 | 获取方式 |
|--------|------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL | 从 Supabase Dashboard 获取 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 匿名密钥 | 从 Supabase Dashboard 获取 |
| `GEMINI_API_KEY` | Gemini API 密钥 | 从 [Google AI Studio](https://makersuite.google.com/app/apikey) 获取 |

### 可选变量

| 变量名 | 说明 | 获取方式 |
|--------|------|----------|
| `RESEND_API_KEY` | Resend API 密钥 | 从 [Resend](https://resend.com) 获取（用于邮件功能） |

## 🔧 开发命令

### 启动开发服务器

```bash
npm run dev
```

访问：http://localhost:3000

### 构建生产版本

```bash
npm run build
```

### 启动生产服务器

```bash
npm run build
npm start
```

### 代码检查

```bash
npm run lint
```

### Cloudflare Pages 本地开发

```bash
npm run pages:dev
```

## 🐛 常见问题

### 1. 端口被占用

如果 3000 端口被占用，Next.js 会自动使用下一个可用端口（3001, 3002...）

或者手动指定端口：

```bash
PORT=3001 npm run dev
```

### 2. 环境变量未生效

- 确保 `.env.local` 文件在项目根目录
- 重启开发服务器
- 检查变量名是否正确（区分大小写）

### 3. 依赖安装失败

```bash
# 清理并重新安装
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### 4. 构建错误

```bash
# 清理构建缓存
rm -rf .next
npm run build
```

## 📁 项目结构

```
byvibe-hero/
├── app/                    # Next.js App Router
│   ├── api/                # API 路由
│   ├── auth/               # 认证页面
│   └── page.tsx            # 首页
├── components/             # React 组件
├── lib/                    # 工具函数和 hooks
├── data/                   # 数据文件
├── public/                 # 静态资源
├── .env.local              # 本地环境变量（不提交到 Git）
└── package.json            # 项目配置
```

## 🔍 调试技巧

### 1. 查看环境变量

在代码中临时添加（仅用于调试）：

```typescript
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
```

### 2. 检查 API 路由

访问：
- http://localhost:3000/api/waitlist
- http://localhost:3000/api/polish
- http://localhost:3000/api/orchestrate

### 3. 浏览器开发者工具

- 打开浏览器开发者工具（F12）
- 查看 Console 标签页的错误信息
- 查看 Network 标签页的 API 请求

## 🎯 功能测试清单

- [ ] 首页加载正常
- [ ] 等待列表表单可以提交
- [ ] AI 控制台功能正常（Refine、Generate Plan）
- [ ] 认证页面可以访问
- [ ] 工具目录页面可以访问
- [ ] 视频轮播可以切换
- [ ] 响应式设计在不同设备上正常

## 📚 相关文档

- [Next.js 文档](https://nextjs.org/docs)
- [Supabase 文档](https://supabase.com/docs)
- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages)

---

**提示**：`.env.local` 文件已添加到 `.gitignore`，不会提交到 Git，确保安全。
