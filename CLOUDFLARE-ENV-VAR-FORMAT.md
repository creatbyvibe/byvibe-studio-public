# Cloudflare Pages 环境变量格式说明

## ⚠️ 重要提示：环境变量格式限制

### Production 环境限制

在 Cloudflare Pages 中，**Production 环境不支持 txt 格式的变量**。

- ✅ **Preview 环境**：可以配置 txt 格式的变量
- ❌ **Production 环境**：不能配置 txt 格式的变量

### 解决方案

#### 方案 1：使用 Secret 类型（推荐）

对于敏感信息（如 API 密钥），应该使用 **Secret** 类型而不是 txt 格式：

1. 在 Cloudflare Pages Dashboard 中
2. 进入 **Settings** → **Environment variables**
3. 添加变量时，选择 **Secret** 类型（不是 txt）
4. 输入变量名和值
5. 选择环境（Production 和 Preview）

#### 方案 2：使用普通文本格式

对于非敏感信息，使用普通文本格式：

1. 添加变量时，选择 **Text** 类型（不是 txt）
2. 直接输入变量值
3. 选择环境

### 环境变量类型说明

| 类型 | 说明 | Production | Preview |
|------|------|------------|---------|
| **Secret** | 加密存储的敏感信息 | ✅ | ✅ |
| **Text** | 普通文本变量 | ✅ | ✅ |
| **txt** | 文本文件格式 | ❌ | ✅ |

### 配置步骤

#### 1. 配置 Secret 类型变量（推荐用于 API 密钥）

```
变量名: GEMINI_API_KEY
类型: Secret
值: your-api-key-here
环境: ✅ Production, ✅ Preview
```

#### 2. 配置 Text 类型变量（用于 URL 等）

```
变量名: NEXT_PUBLIC_SUPABASE_URL
类型: Text
值: https://your-project.supabase.co
环境: ✅ Production, ✅ Preview
```

### 常见问题

#### Q: 为什么 Production 环境不能配置 txt 格式？

A: 这是 Cloudflare Pages 的安全限制。Production 环境要求使用更安全的 Secret 或 Text 类型，而不是文件格式。

#### Q: Preview 环境已经配置了 txt 格式，Production 怎么办？

A: 在 Production 环境中，使用相同的变量名，但选择 **Secret** 或 **Text** 类型，而不是 txt 格式。

#### Q: 如何迁移从 txt 格式到 Secret/Text？

1. 在 Cloudflare Dashboard 中删除 Production 环境的 txt 格式变量（如果存在）
2. 重新添加变量，选择 **Secret** 类型（用于敏感信息）或 **Text** 类型（用于非敏感信息）
3. 输入相同的变量值
4. 选择 Production 环境
5. 保存并重新部署

### 推荐配置

对于本项目，建议使用以下配置：

| 变量名 | 类型 | 环境 |
|--------|------|------|
| `GEMINI_API_KEY` | Secret | Production, Preview |
| `RESEND_API_KEY` | Secret | Production, Preview |
| `ORCID_CLIENT_SECRET` | Secret | Production, Preview |
| `NEXT_PUBLIC_SUPABASE_URL` | Text | Production, Preview |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Text | Production, Preview |
| `ADMIN_EMAIL` | Text | Production, Preview |

### 注意事项

1. **Secret 类型**：用于存储敏感信息，如 API 密钥、密码等
2. **Text 类型**：用于存储非敏感信息，如 URL、配置值等
3. **变量名区分大小写**：确保变量名完全匹配
4. **重新部署**：修改环境变量后需要重新部署才能生效

---

**最后更新**: 2026-01-05  
**适用版本**: Cloudflare Pages
