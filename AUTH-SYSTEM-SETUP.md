# 认证系统设置指南

## ✅ 已实现的功能

### 1. 使用次数限制
- ✅ 免费用户只能使用 1 次 "Generate Plan" 功能
- ✅ 使用次数存储在 localStorage
- ✅ 达到限制后弹出登录/注册弹窗
- ✅ 已登录用户无限制使用

### 2. 登录/注册页面
- ✅ 独立页面：`/auth`
- ✅ 支持邮箱注册/登录
- ✅ 支持 Google OAuth 登录
- ✅ 支持 GitHub OAuth 登录
- ✅ 支持 ORCID OAuth 登录
- ✅ 登录/注册切换
- ✅ 错误处理和提示

### 3. 登录弹窗
- ✅ 在 InteractiveConsole 中使用
- ✅ 达到使用限制时自动弹出
- ✅ 支持所有登录方式
- ✅ 提供加入等待列表选项

### 4. 用户状态管理
- ✅ `useAuth` hook 管理用户状态
- ✅ `useUsageLimit` hook 管理使用限制
- ✅ 导航栏显示用户信息
- ✅ 用户菜单（退出登录）

## 🔧 Supabase 配置

### 1. 启用认证提供者

在 Supabase Dashboard 中启用以下认证提供者：

1. **访问 Supabase Dashboard**
   - https://supabase.com/dashboard
   - 选择你的项目

2. **进入 Authentication → Providers**

3. **启用以下提供者：**
   - ✅ Email（默认已启用）
   - ✅ Google
   - ✅ GitHub
   - ✅ ORCID（需要自定义配置）

### 2. Google OAuth 配置

1. **在 Google Cloud Console 创建 OAuth 2.0 凭证**
   - 访问：https://console.cloud.google.com/apis/credentials
   - 创建 OAuth 2.0 Client ID
   - 授权重定向 URI：`https://xejrdjqsuloecdeviopx.supabase.co/auth/v1/callback`

2. **在 Supabase Dashboard 配置**
   - 进入 Authentication → Providers → Google
   - 输入 Client ID 和 Client Secret
   - 保存

### 3. GitHub OAuth 配置

1. **在 GitHub 创建 OAuth App**
   - 访问：https://github.com/settings/developers
   - 创建新的 OAuth App
   - Authorization callback URL：`https://xejrdjqsuloecdeviopx.supabase.co/auth/v1/callback`

2. **在 Supabase Dashboard 配置**
   - 进入 Authentication → Providers → GitHub
   - 输入 Client ID 和 Client Secret
   - 保存

### 4. ORCID OAuth 配置

1. **在 ORCID 注册应用**
   - 访问：https://orcid.org/developer-tools
   - 创建新的应用
   - 获取 Client ID 和 Client Secret
   - 设置重定向 URI：`https://your-domain.com/auth/orcid/callback`

2. **环境变量配置**
   - 在 Cloudflare Pages 添加：`NEXT_PUBLIC_ORCID_CLIENT_ID`
   - 在 Cloudflare Pages 添加：`NEXT_PUBLIC_ORCID_CLIENT_SECRET`

3. **创建 ORCID 回调 API**
   - 已创建：`/app/auth/orcid/callback/route.ts`
   - 需要实现 token 交换和用户创建逻辑

## 📝 环境变量

需要在 Cloudflare Pages 添加以下环境变量：

| 变量名 | 用途 | 必需 |
|--------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 匿名密钥 | ✅ |
| `NEXT_PUBLIC_ORCID_CLIENT_ID` | ORCID OAuth Client ID | ⚠️ |
| `NEXT_PUBLIC_ORCID_CLIENT_SECRET` | ORCID OAuth Client Secret | ⚠️ |

## 🚀 使用流程

### 用户首次使用
1. 用户访问页面
2. 可以免费使用 1 次 "Generate Plan"
3. 使用后，次数用尽

### 第二次使用
1. 用户点击 "Generate Plan"
2. 检测到使用限制
3. 自动弹出登录/注册弹窗
4. 用户可以选择：
   - 登录/注册（邮箱、Google、GitHub、ORCID）
   - 加入等待列表

### 登录后
1. 用户登录成功
2. 使用限制解除
3. 可以无限次使用
4. 导航栏显示用户信息

## 📁 文件结构

```
app/
  auth/
    page.tsx                    # 登录/注册页面
    callback/
      route.ts                  # OAuth 回调处理
    orcid/
      callback/
        route.ts               # ORCID 回调处理

components/
  AuthModal.tsx                # 登录弹窗组件

lib/
  hooks/
    useAuth.ts                 # 用户认证 hook
    useUsageLimit.ts           # 使用限制 hook
  supabase/
    client.ts                  # Supabase 客户端
    server.ts                  # Supabase 服务端客户端
```

## 🔍 功能说明

### useAuth Hook
```typescript
const { user, loading, signOut } = useAuth();
```
- `user`: 当前登录用户（null 表示未登录）
- `loading`: 加载状态
- `signOut`: 退出登录函数

### useUsageLimit Hook
```typescript
const { usageCount, hasReachedLimit, remainingUsage, incrementUsage } = useUsageLimit();
```
- `usageCount`: 已使用次数
- `hasReachedLimit`: 是否达到限制
- `remainingUsage`: 剩余使用次数
- `incrementUsage`: 增加使用次数

## ⚠️ 注意事项

1. **ORCID 登录需要额外配置**
   - ORCID 不是 Supabase 内置提供者
   - 需要自定义实现 OAuth 流程
   - 当前实现为基本框架，需要完善 token 交换逻辑

2. **使用次数限制**
   - 基于 localStorage，清除浏览器数据会重置
   - 已登录用户不受限制
   - 可以考虑改为服务端验证

3. **OAuth 回调 URL**
   - 确保在 OAuth 提供者中配置正确的回调 URL
   - Supabase 的回调 URL 格式：`https://[project-ref].supabase.co/auth/v1/callback`

## 🎯 下一步优化建议

1. **服务端验证使用次数**
   - 将使用次数存储在数据库
   - 更安全，无法绕过

2. **完善 ORCID 登录**
   - 实现完整的 OAuth 流程
   - 处理 token 交换
   - 创建 Supabase 用户

3. **用户资料页面**
   - 显示使用统计
   - 账户设置
   - API 密钥管理

4. **邮件验证**
   - 注册后发送验证邮件
   - 验证后才能使用

5. **社交登录头像**
   - 显示用户头像
   - 从 OAuth 提供者获取

## ✨ 总结

认证系统已基本实现：
- ✅ 使用次数限制
- ✅ 登录/注册页面
- ✅ 多种登录方式
- ✅ 用户状态管理
- ✅ 导航栏集成

需要配置 Supabase OAuth 提供者才能完全使用！
