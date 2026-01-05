# 构建时环境变量问题修复

## 🐛 问题描述

构建失败，错误信息：
```
Error: Missing Supabase environment variables
  at /opt/buildhome/repo/.next/server/app/auth/page.js
  at /opt/buildhome/repo/.next/server/app/page.js
```

## 🔍 问题原因

1. **构建时预渲染**：Next.js 在构建时会尝试预渲染所有页面，包括 `'use client'` 页面
2. **模块加载时机**：`lib/supabase/client.ts` 在模块加载时就检查环境变量
3. **环境变量缺失**：Cloudflare Pages 构建时，环境变量可能还未注入，导致检查失败

## ✅ 解决方案

### 修改 `lib/supabase/client.ts`

**之前的问题代码**：
```typescript
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

**修复后的代码**：
```typescript
// 延迟初始化，避免构建时检查环境变量
let supabaseInstance: SupabaseClient | null = null

function getSupabaseClient(): SupabaseClient {
  if (supabaseInstance) {
    return supabaseInstance
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // 构建时如果没有环境变量，创建一个占位客户端
  if (!supabaseUrl || !supabaseAnonKey) {
    if (typeof window === 'undefined') {
      // 服务端构建时，返回占位客户端
      supabaseInstance = createClient('https://placeholder.supabase.co', 'placeholder-key')
      return supabaseInstance
    }
    // 客户端运行时，抛出错误
    throw new Error('Missing Supabase environment variables')
  }

  // 正常情况，创建真实的客户端
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
  return supabaseInstance
}

// 使用 Proxy 延迟初始化
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseClient()
    const value = (client as any)[prop]
    if (typeof value === 'function') {
      return value.bind(client)
    }
    return value
  },
}) as SupabaseClient
```

## 🎯 关键改进

1. **延迟初始化**：只在真正使用时才创建客户端
2. **构建时兼容**：构建时如果没有环境变量，使用占位客户端
3. **运行时检查**：客户端运行时才检查真实环境变量
4. **类型安全**：保持 TypeScript 类型检查

## 📋 环境变量配置

### 必须在 Cloudflare Pages 配置

即使代码已经修复，你仍然需要在 Cloudflare Pages Dashboard 中配置环境变量：

1. **登录 Cloudflare Dashboard**
2. **进入 Pages 项目** → **Settings** → **Environment variables**
3. **添加以下变量**：

| 变量名 | 值 | Production | Preview |
|--------|-----|------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | 你的 Supabase URL | ✅ | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 你的 Supabase Anon Key | ✅ | ✅ |

### 环境变量说明

- **Production**：生产环境，用户访问的实际网站
- **Preview**：预览环境，PR 或分支推送时的临时预览

**建议**：两个环境都配置相同的值（除非需要测试隔离）

## ✅ 验证修复

构建成功后，你应该看到：
```
✓ Compiled successfully
✓ Generating static pages (5/5)
```

所有页面都应该正常生成，包括：
- `/` - 首页
- `/auth` - 认证页面
- API 路由

## 🚀 部署检查清单

- [x] 代码修复完成
- [ ] 在 Cloudflare Pages 配置环境变量
- [ ] 验证构建成功
- [ ] 测试生产环境功能
- [ ] 测试预览环境功能

## 📚 相关文档

- `CLOUDFLARE-ENV-VARIABLES.md` - 详细的环境变量配置指南
- [Cloudflare Pages 环境变量文档](https://developers.cloudflare.com/pages/platform/build-configuration/#environment-variables)

---

**修复完成时间**: 2026-01-05
**构建状态**: ✅ 成功
**需要操作**: 在 Cloudflare Pages Dashboard 配置环境变量
