# 环境变量配置清单

## 🔑 必需的环境变量

在 Cloudflare Pages Dashboard 中需要设置以下环境变量：

### 1. GEMINI_API_KEY
**用途**：用于调用 Gemini API（`/api/polish` 和 `/api/orchestrate`）

**设置位置**：
- Cloudflare Dashboard → Pages → 你的项目 → Settings → Environment variables
- 添加变量名：`GEMINI_API_KEY`
- 添加变量值：你的 Gemini API Key
- **重要**：需要在 Production 和 Preview 环境都设置

**获取方式**：
1. 访问：https://makersuite.google.com/app/apikey
2. 创建新的 API Key
3. 复制 API Key

### 2. NEXT_PUBLIC_SUPABASE_URL
**用途**：Supabase 项目 URL（用于 `/api/waitlist`）

**设置位置**：
- Cloudflare Dashboard → Pages → 你的项目 → Settings → Environment variables
- 添加变量名：`NEXT_PUBLIC_SUPABASE_URL`
- 添加变量值：`https://xejrdjqsuloecdeviopx.supabase.co`
- **重要**：需要在 Production 和 Preview 环境都设置

### 3. NEXT_PUBLIC_SUPABASE_ANON_KEY
**用途**：Supabase 匿名密钥（用于 `/api/waitlist`）

**设置位置**：
- Cloudflare Dashboard → Pages → 你的项目 → Settings → Environment variables
- 添加变量名：`NEXT_PUBLIC_SUPABASE_ANON_KEY`
- 添加变量值：`sb_publishable_rMqAnJxp6DWT9SsowLTNcw_ucR4BqEk`
- **重要**：需要在 Production 和 Preview 环境都设置

### 4. ADMIN_EMAIL（可选）
**用途**：接收 waitlist 通知邮件的管理员邮箱

**设置位置**：
- Cloudflare Dashboard → Pages → 你的项目 → Settings → Environment variables
- 添加变量名：`ADMIN_EMAIL` 或 `NOTIFICATION_EMAIL`
- 添加变量值：你的邮箱地址（例如：`your-email@example.com`）
- **重要**：需要在 Production 和 Preview 环境都设置（如果需要在预览环境也接收通知）

**说明**：
- 当有人加入 waitlist 时，系统会自动发送通知邮件到这个邮箱
- 如果不设置此变量，系统会跳过发送通知邮件（不影响用户收到欢迎邮件）

## 📋 完整配置清单

在 Cloudflare Dashboard 中应该设置：

| 变量名 | 值 | 用途 | 必需 |
|--------|-----|------|------|
| `GEMINI_API_KEY` | 你的 API Key | Gemini API 调用 | ✅ |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xejrdjqsuloecdeviopx.supabase.co` | Supabase 连接 | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_rMqAnJxp6DWT9SsowLTNcw_ucR4BqEk` | Supabase 认证 | ✅ |
| `RESEND_API_KEY` | 你的 Resend API Key | 邮件发送 | ✅ |
| `ADMIN_EMAIL` | 你的邮箱地址 | 接收 waitlist 通知 | ⚪ 可选 |

## 🚀 设置步骤

1. **访问 Cloudflare Dashboard**
   - https://dash.cloudflare.com
   - Pages → 你的项目 → Settings

2. **进入 Environment variables**
   - 点击 "Environment variables" 标签

3. **添加变量**
   - 点击 "Add variable"
   - 输入变量名和值
   - 选择环境（Production 和 Preview 都要设置）
   - 保存

4. **重新部署**
   - 添加环境变量后，需要重新部署才能生效
   - 可以手动触发新部署

## ⚠️ 重要提示

1. **环境变量格式限制**
   - ⚠️ **Production 环境不支持 txt 格式的变量**
   - ✅ Preview 环境可以配置 txt 格式
   - ✅ Production 环境必须使用 **Secret** 或 **Text** 类型
   - 推荐：敏感信息使用 Secret 类型，非敏感信息使用 Text 类型

2. **环境变量区分大小写**
   - 确保变量名完全匹配（包括大小写）

3. **NEXT_PUBLIC_ 前缀**
   - `NEXT_PUBLIC_` 开头的变量会在构建时注入到客户端
   - 这些变量是公开的，不要包含敏感信息

4. **GEMINI_API_KEY 不是公开的**
   - `GEMINI_API_KEY` 没有 `NEXT_PUBLIC_` 前缀
   - 只在服务器端使用，不会暴露给客户端
   - 应该使用 **Secret** 类型存储

5. **重新部署**
   - 添加或修改环境变量后，必须重新部署才能生效

## 🔍 验证

部署后，可以通过以下方式验证：

1. **测试 API 路由**
   - `/api/polish` - 应该能调用 Gemini API
   - `/api/orchestrate` - 应该能调用 Gemini API
   - `/api/waitlist` - 应该能连接 Supabase

2. **检查构建日志**
   - 如果环境变量缺失，API 会返回错误
   - 查看浏览器控制台或网络请求

## 📝 如果环境变量未设置

如果环境变量未正确设置，API 会返回：
- `{ error: 'API key not configured' }` - Gemini API
- `{ error: 'Missing Supabase environment variables' }` - Supabase
