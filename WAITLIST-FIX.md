# Waitlist 功能修复指南

## 🔴 问题症状

当用户尝试加入 waitlist 时，看到错误信息：
```
Service configuration error. Please contact support.
```

## 🔍 问题原因

Supabase 环境变量未在 Cloudflare Pages 中正确配置。

## ✅ 解决方案

### 步骤 1：检查 Cloudflare Pages 环境变量

1. **登录 Cloudflare Dashboard**
   - 访问：https://dash.cloudflare.com
   - 进入 **Workers & Pages** → 选择你的项目

2. **进入环境变量设置**
   - 点击 **Settings** 标签
   - 滚动到 **Environment variables** 部分

3. **检查以下变量是否存在**

   | 变量名 | 必需 | 说明 |
   |--------|------|------|
   | `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase 项目 URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase 匿名密钥 |

### 步骤 2：添加缺失的环境变量

如果变量不存在或值不正确：

1. **点击 "Add variable"**

2. **添加 `NEXT_PUBLIC_SUPABASE_URL`**
   - **Name**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: 你的 Supabase 项目 URL（例如：`https://xejrdjqsuloecdeviopx.supabase.co`）
   - **Environment**: 
     - ✅ Production
     - ✅ Preview
   - **Type**: Text（URL 不是敏感信息）

3. **添加 `NEXT_PUBLIC_SUPABASE_ANON_KEY`**
   - **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value**: 你的 Supabase 匿名密钥
   - **Environment**: 
     - ✅ Production
     - ✅ Preview
   - **Type**: Secret（推荐）或 Text

4. **保存变量**

### 步骤 3：重新部署

环境变量更新后，需要重新部署才能生效：

1. 在 Cloudflare Pages Dashboard 中
2. 进入 **Deployments** 标签
3. 点击 **Retry deployment** 或等待自动重新部署

### 步骤 4：验证修复

部署完成后：

1. 访问你的网站
2. 尝试加入 waitlist
3. 应该看到成功消息而不是错误

## 📋 获取 Supabase 凭证

如果你还没有 Supabase 凭证：

1. **访问 Supabase Dashboard**
   - https://supabase.com/dashboard
   - 登录你的账户

2. **选择或创建项目**
   - 如果已有项目，选择它
   - 如果没有，创建新项目

3. **获取 URL 和密钥**
   - 进入 **Settings** → **API**
   - **Project URL**: 复制 `NEXT_PUBLIC_SUPABASE_URL` 的值
   - **anon/public key**: 复制 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 的值

## ⚠️ 重要提示

### 1. 环境变量类型

- **Production 环境**：不支持 txt 格式
  - ✅ 使用 **Secret** 类型存储敏感信息（API 密钥）
  - ✅ 使用 **Text** 类型存储非敏感信息（URL）

- **Preview 环境**：可以使用 txt 格式

### 2. 两个环境都要配置

确保 **Production** 和 **Preview** 环境都配置了相同的变量。

### 3. 变量名必须完全匹配

- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ❌ `SUPABASE_URL`（缺少 `NEXT_PUBLIC_` 前缀）
- ❌ `NEXT_PUBLIC_SUPABASE_URL_`（多了下划线）

### 4. 检查变量值

- 确保没有多余的空格
- 确保 URL 以 `https://` 开头
- 确保密钥完整（没有截断）

## 🔍 调试技巧

如果问题仍然存在：

1. **检查构建日志**
   - 在 Cloudflare Pages Dashboard 中查看最新的构建日志
   - 查找环境变量相关的错误

2. **检查浏览器控制台**
   - 打开浏览器开发者工具
   - 查看 Console 标签中的错误信息

3. **检查网络请求**
   - 打开 Network 标签
   - 查看 `/api/waitlist` 请求的响应
   - 查看错误详情

## 📚 相关文档

- [Cloudflare Pages 环境变量配置](./CLOUDFLARE-ENV-VARIABLES.md)
- [环境变量完整清单](./ENVIRONMENT-VARIABLES.md)
- [Supabase 设置指南](./SUPABASE_SETUP.md)

---

**最后更新**: 2026-01-05
