# Cloudflare Pages 环境变量配置指南

## 📚 环境类型说明

### 1. Production（生产环境）
- **用途**：用户访问的实际网站
- **触发时机**：推送到 `main` 分支时自动部署
- **URL**：你的主域名（例如：`byvibe-studio-public.pages.dev`）
- **特点**：
  - 稳定、长期运行
  - 所有用户都能访问
  - 需要最稳定的配置

### 2. Preview（预览环境）
- **用途**：用于测试和预览的临时环境
- **触发时机**：
  - 创建 Pull Request 时
  - 推送到非 `main` 分支时
- **URL**：自动生成的临时 URL（例如：`pr-123-byvibe-studio-public.pages.dev`）
- **特点**：
  - 临时性，PR 合并或删除后会清理
  - 用于代码审查和测试
  - 可以有不同的配置用于测试

## 🔧 环境变量配置策略

### 方案 1：两个环境使用相同配置（推荐用于大多数情况）

**适用场景**：
- 使用相同的 Supabase 项目
- 使用相同的 API 密钥
- 预览环境也需要完整功能

**配置步骤**：
1. 在 Cloudflare Pages Dashboard 中
2. 进入 **Settings** → **Environment variables**
3. 添加变量时，**同时勾选 Production 和 Preview**

**示例**：
```
NEXT_PUBLIC_SUPABASE_URL
├── Production: ✅
└── Preview: ✅
```

### 方案 2：两个环境使用不同配置（用于测试）

**适用场景**：
- 预览环境使用测试数据库
- 生产环境使用生产数据库
- 需要隔离测试和生产数据

**配置步骤**：
1. 添加变量时，**只勾选 Production**（生产环境变量）
2. 再次添加同名变量，**只勾选 Preview**（预览环境变量）
3. 设置不同的值

**示例**：
```
NEXT_PUBLIC_SUPABASE_URL
├── Production: https://prod.supabase.co
└── Preview: https://test.supabase.co
```

## 📋 必需的环境变量

### 必须配置的变量（两个环境都需要）

| 变量名 | 说明 | Production | Preview |
|--------|------|------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL | ✅ | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 匿名密钥 | ✅ | ✅ |
| `GEMINI_API_KEY` | Gemini API 密钥（如果使用） | ✅ | ✅ |
| `RESEND_API_KEY` | Resend API 密钥（如果使用邮件） | ✅ | ✅ |

### 可选的环境变量

| 变量名 | 说明 | 必需性 |
|--------|------|--------|
| `NODE_ENV` | 环境标识 | 自动设置 |
| `NEXT_PUBLIC_*` | 客户端可访问的变量 | 根据需要 |

## 🚀 配置步骤

### 在 Cloudflare Pages Dashboard 中配置

1. **登录 Cloudflare Dashboard**
   - 访问：https://dash.cloudflare.com
   - 选择你的账户

2. **进入 Pages 项目**
   - 点击左侧菜单 **Pages**
   - 选择你的项目（`byvibe-studio-public`）

3. **打开环境变量设置**
   - 点击 **Settings** 标签
   - 滚动到 **Environment variables** 部分
   - 点击 **Add variable**

4. **添加变量**
   - **Name**: 变量名（例如：`NEXT_PUBLIC_SUPABASE_URL`）
   - **Value**: 变量值
   - **Environment**: 选择环境
     - ✅ Production：生产环境
     - ✅ Preview：预览环境
     - ✅ Branch：特定分支（可选）

5. **保存并重新部署**
   - 点击 **Save**
   - 变量会在下次部署时生效
   - 可以手动触发重新部署

## ⚠️ 重要提示

### 1. 变量命名
- 客户端可访问的变量必须以 `NEXT_PUBLIC_` 开头
- 服务端变量不需要前缀，但不会暴露给客户端

### 2. 安全性
- **不要**在代码中硬编码敏感信息
- **不要**将 `.env.local` 提交到 Git
- **使用** Cloudflare Pages 的环境变量管理

### 3. 变量更新
- 更新变量后需要重新部署才能生效
- 可以在 Dashboard 中手动触发重新部署

### 4. 变量验证
- 确保变量值正确（没有多余空格）
- 确保变量名拼写正确
- 检查变量是否在正确的环境中配置

## 🔍 如何检查变量是否配置

### 方法 1：查看构建日志
在 Cloudflare Pages 的构建日志中，环境变量不会直接显示（安全考虑），但如果缺少变量，构建会失败。

### 方法 2：在代码中检查（仅用于调试）
```typescript
// 仅在开发环境使用
if (process.env.NODE_ENV === 'development') {
  console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
}
```

### 方法 3：运行时检查
在浏览器控制台检查：
```javascript
// 在浏览器控制台运行
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
```

## 📝 当前项目需要的环境变量

根据你的项目，需要配置以下变量：

### 必需变量
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Gemini API（如果使用）
GEMINI_API_KEY=your-gemini-key

# Resend API（如果使用邮件功能）
RESEND_API_KEY=your-resend-key
```

### 配置建议
- **Production 和 Preview 都勾选**：如果使用相同的服务
- **只勾选 Production**：如果预览环境不需要完整功能
- **分别配置不同值**：如果需要测试和生产隔离

## 🎯 推荐配置

对于你的项目，建议：

1. **Supabase 变量**：两个环境都配置（使用相同的 Supabase 项目）
2. **API 密钥**：两个环境都配置（使用相同的密钥）
3. **测试环境**：如果需要，可以创建单独的 Supabase 项目用于 Preview

## 📚 参考资源

- [Cloudflare Pages 环境变量文档](https://developers.cloudflare.com/pages/platform/build-configuration/#environment-variables)
- [Next.js 环境变量文档](https://nextjs.org/docs/basic-features/environment-variables)

---

**最后更新**: 2026-01-05
**适用版本**: Cloudflare Pages, Next.js 14
