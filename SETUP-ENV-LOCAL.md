# 本地环境变量配置指南

## 🚀 快速设置

### 1. 创建 `.env.local` 文件

在项目根目录创建 `.env.local` 文件：

```bash
cd /Users/wubinyuan/.cursor/worktrees/byvibe-hero/vwt
cp .env.local.example .env.local
```

### 2. 配置 Supabase（必需 - 用于注册功能）

`.env.local` 文件中已经包含了 Supabase 的配置：

```env
NEXT_PUBLIC_SUPABASE_URL=https://xejrdjqsuloecdeviopx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_rMqAnJxp6DWT9SsowLTNcw_ucR4BqEk
```

**这些值已经配置好了，可以直接使用！**

### 3. 配置 Gemini API（可选 - 用于 AI 功能）

如果你需要使用 AI 功能（如 Interactive Console），需要配置 Gemini API Key：

1. 访问：https://makersuite.google.com/app/apikey
2. 创建新的 API Key
3. 复制 API Key
4. 在 `.env.local` 中替换 `your_gemini_api_key_here`

```env
GEMINI_API_KEY=你的实际API密钥
```

### 4. 重启开发服务器

配置完成后，需要重启开发服务器：

```bash
# 停止当前服务器（Ctrl+C）
# 然后重新启动
npm run dev
```

## ✅ 验证配置

配置完成后，你应该能够：

1. ✅ **注册新用户** - 使用邮箱和密码
2. ✅ **登录** - 使用注册的账号
3. ✅ **OAuth 登录** - Google/GitHub（如果已配置）
4. ✅ **创建项目** - 在 Studio 中创建新项目

## 🔍 如果还是无法注册

### 检查 1: 确认文件存在

```bash
ls -la .env.local
```

应该看到 `.env.local` 文件。

### 检查 2: 确认内容正确

```bash
cat .env.local
```

应该看到 Supabase 配置。

### 检查 3: 检查浏览器控制台

1. 打开浏览器开发者工具（F12）
2. 查看 Console 标签
3. 尝试注册，查看错误信息

### 检查 4: 检查 Supabase 连接

在浏览器控制台运行：

```javascript
// 检查 Supabase 是否配置
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
```

## 📝 完整配置示例

`.env.local` 文件应该类似这样：

```env
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=https://xejrdjqsuloecdeviopx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_rMqAnJxp6DWT9SsowLTNcw_ucR4BqEk

# Gemini API（可选）
GEMINI_API_KEY=AIzaSy...你的密钥

# Resend API（可选）
RESEND_API_KEY=re_...你的密钥
```

## ⚠️ 重要提示

1. **不要提交 `.env.local` 到 Git**
   - 这个文件已经在 `.gitignore` 中
   - 包含敏感信息，不要分享

2. **重启服务器**
   - 修改 `.env.local` 后必须重启开发服务器
   - 环境变量只在启动时加载

3. **Supabase 配置已就绪**
   - 项目已经配置了 Supabase
   - 你只需要创建 `.env.local` 文件即可

## 🎯 下一步

配置完成后：

1. 重启开发服务器
2. 访问 `http://localhost:3000/studio`
3. 点击注册，应该可以正常工作了！
