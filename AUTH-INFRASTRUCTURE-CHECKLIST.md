# 用户注册与认证基础设施配置检查清单

## ✅ 代码功能完整性检查

### 1. 认证功能 ✅
- [x] 邮箱注册/登录 (`components/AuthModal.tsx`, `app/auth/page.tsx`)
- [x] Google OAuth (`handleOAuth('google')`)
- [x] GitHub OAuth (`handleOAuth('github')`)
- [x] ORCID OAuth (`handleORCID()`)
- [x] 密码重置 (`handleResetPassword`)
- [x] 邮箱验证 (`app/auth/callback/route.ts`)
- [x] 重新发送验证邮件 (`app/api/auth/resend-verification/route.ts`)
- [x] 错误处理和用户友好提示

### 2. 数据库结构 ✅
- [x] Projects 表 (`supabase/schema.sql`)
- [x] Artifacts 表 (`supabase/schema.sql`)
- [x] Row Level Security (RLS) 策略
- [x] 索引优化
- [x] 自动更新时间戳触发器

### 3. API 路由 ✅
- [x] `/api/auth/resend-verification` - 重新发送验证邮件
- [x] `/api/auth/orcid` - ORCID OAuth 处理
- [x] `/auth/callback` - OAuth 回调处理
- [x] `/auth/orcid/callback` - ORCID 回调处理
- [x] `/auth/verify` - 验证状态页面
- [x] `/auth/reset-password` - 密码重置页面

---

## 🔧 需要配置的内容

### 1. Supabase 配置（必需）✅

#### 1.1 环境变量
在 **Cloudflare Pages Dashboard** 中设置：

| 变量名 | 说明 | 必需 | 状态 |
|--------|------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL | ✅ | ⚠️ 需确认 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 匿名密钥 | ✅ | ⚠️ 需确认 |

**设置位置**：
- Cloudflare Dashboard → Pages → 你的项目 → Settings → Environment variables
- 确保在 **Production** 和 **Preview** 环境都设置了

**获取方式**：
1. 访问 Supabase Dashboard: https://app.supabase.com
2. 选择你的项目
3. Settings → API
4. 复制 `Project URL` 和 `anon public` key

#### 1.2 数据库表创建
在 **Supabase SQL Editor** 中执行：

```sql
-- 运行 supabase/schema.sql 文件中的 SQL
```

**检查清单**：
- [ ] 已创建 `projects` 表
- [ ] 已创建 `artifacts` 表
- [ ] 已启用 Row Level Security (RLS)
- [ ] 已创建 RLS 策略
- [ ] 已创建索引
- [ ] 已创建触发器

#### 1.3 认证提供者配置

##### Google OAuth
在 **Supabase Dashboard** 中配置：
1. Authentication → Providers → Google
2. 启用 Google provider
3. 输入 Google OAuth Client ID 和 Secret
4. 设置 Redirect URL: `https://your-domain.com/auth/callback`

**需要获取**：
- Google OAuth Client ID
- Google OAuth Client Secret

**获取方式**：
1. 访问 Google Cloud Console: https://console.cloud.google.com
2. 创建 OAuth 2.0 客户端 ID
3. 设置授权重定向 URI: `https://your-project.supabase.co/auth/v1/callback`

##### GitHub OAuth
在 **Supabase Dashboard** 中配置：
1. Authentication → Providers → GitHub
2. 启用 GitHub provider
3. 输入 GitHub OAuth Client ID 和 Secret
4. 设置 Redirect URL: `https://your-domain.com/auth/callback`

**需要获取**：
- GitHub OAuth Client ID
- GitHub OAuth Client Secret

**获取方式**：
1. 访问 GitHub Settings → Developer settings → OAuth Apps
2. 创建新的 OAuth App
3. 设置 Authorization callback URL: `https://your-project.supabase.co/auth/v1/callback`

##### ORCID OAuth
在 **ORCID** 和 **环境变量** 中配置：

**环境变量**（在 Cloudflare Pages 中设置）：
- `NEXT_PUBLIC_ORCID_CLIENT_ID` - ORCID Client ID
- `NEXT_PUBLIC_ORCID_CLIENT_SECRET` - ORCID Client Secret（服务端使用）

**需要获取**：
- ORCID Client ID
- ORCID Client Secret

**获取方式**：
1. 访问 ORCID Developer Tools: https://orcid.org/developer-tools
2. 创建新的应用
3. 设置 Redirect URI: `https://your-domain.com/auth/orcid/callback`
4. 获取 Client ID 和 Client Secret

#### 1.4 邮件配置（可选但推荐）

##### Supabase 邮件设置
在 **Supabase Dashboard** 中配置：
1. Authentication → Email Templates
2. 自定义验证邮件模板
3. 自定义密码重置邮件模板

**邮件服务提供商**：
- Supabase 默认使用 SendGrid（免费额度有限）
- 推荐配置自定义 SMTP（如 Resend）

##### Resend 配置（推荐）
如果使用 Resend 发送邮件：

**环境变量**（在 Cloudflare Pages 中设置）：
- `RESEND_API_KEY` - Resend API Key

**获取方式**：
1. 访问 Resend: https://resend.com
2. 创建账户并获取 API Key
3. 在 Supabase 中配置 SMTP 设置（使用 Resend SMTP）

---

### 2. Gemini API 配置（必需）✅

**环境变量**（在 Cloudflare Pages 中设置）：
- `GEMINI_API_KEY` - Google Gemini API Key

**获取方式**：
1. 访问 Google AI Studio: https://makersuite.google.com/app/apikey
2. 创建新的 API Key
3. 复制 API Key

**注意**：
- 使用 **Secret** 类型存储（敏感信息）
- 只在服务端使用，不会暴露给客户端

---

### 3. 域名和重定向 URL 配置

#### 3.1 Supabase 重定向 URL
在 **Supabase Dashboard** 中配置：
1. Authentication → URL Configuration
2. 设置 Site URL: `https://your-domain.com`
3. 添加 Redirect URLs:
   - `https://your-domain.com/auth/callback`
   - `https://your-domain.com/auth/verify`
   - `https://your-domain.com/auth/reset-password`
   - `https://your-domain.com/auth/orcid/callback`

#### 3.2 OAuth 提供者重定向 URL
确保所有 OAuth 提供者（Google、GitHub、ORCID）的重定向 URL 都指向正确的域名。

---

## 📋 完整配置检查清单

### 环境变量检查（Cloudflare Pages）

#### 必需变量 ✅
- [ ] `NEXT_PUBLIC_SUPABASE_URL` - 已设置（Production + Preview）
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - 已设置（Production + Preview）
- [ ] `GEMINI_API_KEY` - 已设置（Production + Preview，使用 Secret 类型）

#### 可选但推荐变量 ⚪
- [ ] `RESEND_API_KEY` - 已设置（如果使用 Resend 发送邮件）
- [ ] `NEXT_PUBLIC_ORCID_CLIENT_ID` - 已设置（如果启用 ORCID）
- [ ] `NEXT_PUBLIC_ORCID_CLIENT_SECRET` - 已设置（如果启用 ORCID，服务端使用）

### Supabase 配置检查

#### 数据库 ✅
- [ ] 已运行 `supabase/schema.sql` 创建表结构
- [ ] RLS 策略已启用并正确配置
- [ ] 索引已创建

#### 认证提供者 ⚪
- [ ] Google OAuth 已配置（Client ID + Secret）
- [ ] GitHub OAuth 已配置（Client ID + Secret）
- [ ] ORCID OAuth 已配置（Client ID + Secret + 环境变量）

#### 邮件配置 ⚪
- [ ] 邮件模板已自定义（可选）
- [ ] SMTP 已配置（如果使用自定义 SMTP，如 Resend）

#### URL 配置 ✅
- [ ] Site URL 已设置
- [ ] Redirect URLs 已添加

### OAuth 提供者配置检查

#### Google OAuth ⚪
- [ ] 已在 Google Cloud Console 创建 OAuth 客户端
- [ ] 授权重定向 URI 已设置
- [ ] Client ID 和 Secret 已添加到 Supabase

#### GitHub OAuth ⚪
- [ ] 已在 GitHub 创建 OAuth App
- [ ] Authorization callback URL 已设置
- [ ] Client ID 和 Secret 已添加到 Supabase

#### ORCID OAuth ⚪
- [ ] 已在 ORCID 创建应用
- [ ] Redirect URI 已设置
- [ ] Client ID 和 Secret 已添加到环境变量

---

## 🧪 功能测试清单

### 注册功能
- [ ] 邮箱注册（需要验证）
- [ ] Google 注册/登录
- [ ] GitHub 注册/登录
- [ ] ORCID 注册/登录
- [ ] 邮箱验证流程
- [ ] 重新发送验证邮件

### 登录功能
- [ ] 邮箱登录
- [ ] Google 登录
- [ ] GitHub 登录
- [ ] ORCID 登录

### 密码管理
- [ ] 忘记密码
- [ ] 密码重置邮件
- [ ] 密码重置流程

### 错误处理
- [ ] 无效邮箱格式提示
- [ ] 密码长度不足提示
- [ ] 用户已存在提示
- [ ] 登录凭据错误提示
- [ ] OAuth 错误处理

---

## ⚠️ 常见问题排查

### 1. 注册后收不到验证邮件
**可能原因**：
- Supabase 邮件服务未配置
- 邮件被标记为垃圾邮件
- SMTP 配置错误

**解决方案**：
1. 检查 Supabase Dashboard → Authentication → Email Templates
2. 配置自定义 SMTP（推荐使用 Resend）
3. 检查垃圾邮件文件夹
4. 使用"重新发送验证邮件"功能

### 2. OAuth 登录失败
**可能原因**：
- OAuth 提供者配置错误
- 重定向 URL 不匹配
- Client ID/Secret 错误

**解决方案**：
1. 检查 OAuth 提供者配置（Google/GitHub/ORCID）
2. 确认重定向 URL 完全匹配
3. 重新生成 Client ID/Secret

### 3. 数据库权限错误
**可能原因**：
- RLS 策略未正确配置
- 用户未通过认证

**解决方案**：
1. 检查 `supabase/schema.sql` 中的 RLS 策略
2. 确认用户已登录
3. 检查 Supabase Dashboard → Authentication → Policies

---

## 🚀 快速配置指南

### 步骤 1: Supabase 基础配置
1. 在 Supabase Dashboard 创建项目
2. 获取 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. 在 Cloudflare Pages 设置环境变量
4. 运行 `supabase/schema.sql` 创建数据库表

### 步骤 2: OAuth 配置（可选）
1. 配置 Google OAuth（在 Supabase Dashboard）
2. 配置 GitHub OAuth（在 Supabase Dashboard）
3. 配置 ORCID OAuth（需要环境变量）

### 步骤 3: 邮件配置（推荐）
1. 获取 Resend API Key
2. 在 Cloudflare Pages 设置 `RESEND_API_KEY`
3. 在 Supabase 配置 SMTP（使用 Resend）

### 步骤 4: 测试
1. 测试邮箱注册
2. 测试 OAuth 登录
3. 测试密码重置
4. 测试邮箱验证

---

## 📝 总结

### ✅ 已完成
- 代码功能完整（注册、登录、OAuth、密码重置、邮箱验证）
- 数据库结构完整（表、RLS、索引、触发器）
- API 路由完整
- 错误处理完善

### ⚠️ 需要配置
1. **Supabase 环境变量**（必需）
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

2. **数据库表创建**（必需）
   - 运行 `supabase/schema.sql`

3. **OAuth 提供者**（可选）
   - Google OAuth（在 Supabase Dashboard 配置）
   - GitHub OAuth（在 Supabase Dashboard 配置）
   - ORCID OAuth（需要环境变量）

4. **邮件服务**（推荐）
   - Resend API Key（可选，但推荐用于生产环境）

5. **Gemini API**（必需，用于 AI 功能）
   - `GEMINI_API_KEY`

### 🎯 下一步
1. 确认所有环境变量已在 Cloudflare Pages 设置
2. 确认数据库表已创建
3. 测试所有认证功能
4. 配置 OAuth 提供者（如果需要）
5. 配置邮件服务（推荐）

---

**最后更新**: 2024-01-XX
**状态**: 代码完整，需要配置环境变量和 Supabase 设置
