# 修复注册功能 - 快速指南

## 🔴 问题原因

`.env.local` 文件不存在，导致 Supabase 无法连接，注册功能无法使用。

## ✅ 解决方案

### 步骤 1: 创建 `.env.local` 文件

在项目根目录创建 `.env.local` 文件：

**方法 1: 使用终端（推荐）**

```bash
cd /Users/wubinyuan/.cursor/worktrees/byvibe-hero/vwt

cat > .env.local << 'EOF'
# Supabase 配置（必需 - 用于注册和数据库）
NEXT_PUBLIC_SUPABASE_URL=https://xejrdjqsuloecdeviopx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_rMqAnJxp6DWT9SsowLTNcw_ucR4BqEk

# Gemini API 配置（可选 - 用于 AI 功能）
# GEMINI_API_KEY=your_gemini_api_key_here
EOF
```

**方法 2: 使用编辑器**

1. 在项目根目录创建新文件：`.env.local`
2. 复制以下内容：

```env
# Supabase 配置（必需 - 用于注册和数据库）
NEXT_PUBLIC_SUPABASE_URL=https://xejrdjqsuloecdeviopx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_rMqAnJxp6DWT9SsowLTNcw_ucR4BqEk

# Gemini API 配置（可选 - 用于 AI 功能）
# GEMINI_API_KEY=your_gemini_api_key_here
```

3. 保存文件

### 步骤 2: 验证文件创建

```bash
cat .env.local
```

应该看到 Supabase 配置。

### 步骤 3: 重启开发服务器

**重要**：必须重启服务器才能加载环境变量！

1. 停止当前服务器（在运行 `npm run dev` 的终端按 `Ctrl+C`）
2. 重新启动：
   ```bash
   npm run dev
   ```

### 步骤 4: 测试注册

1. 访问 `http://localhost:3000/studio`
2. 点击注册按钮
3. 输入邮箱和密码（至少 6 个字符）
4. 应该可以正常注册了！

## 🔍 如果还是无法注册

### 检查 1: 确认文件存在且内容正确

```bash
# 检查文件是否存在
ls -la .env.local

# 查看文件内容
cat .env.local
```

应该看到：
- `NEXT_PUBLIC_SUPABASE_URL=https://xejrdjqsuloecdeviopx.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_rMqAnJxp6DWT9SsowLTNcw_ucR4BqEk`

### 检查 2: 确认服务器已重启

环境变量只在服务器启动时加载，修改后必须重启！

### 检查 3: 查看浏览器控制台

1. 打开浏览器开发者工具（F12）
2. 查看 Console 标签
3. 尝试注册，查看错误信息
4. 如果看到 "Supabase not configured"，说明环境变量未加载

### 检查 4: 查看终端输出

启动服务器时，不应该看到：
- `Supabase environment variables are missing`
- `Using placeholder client`

如果看到这些，说明环境变量未正确加载。

## 📝 常见错误

### 错误 1: "Supabase not configured"

**原因**：`.env.local` 文件不存在或未重启服务器

**解决**：
1. 创建 `.env.local` 文件
2. 重启开发服务器

### 错误 2: "Invalid login credentials"

**原因**：邮箱或密码错误

**解决**：检查输入的邮箱和密码是否正确

### 错误 3: "User already registered"

**原因**：该邮箱已被注册

**解决**：直接使用登录功能，或使用其他邮箱注册

### 错误 4: "Password should be at least 6 characters"

**原因**：密码太短

**解决**：使用至少 6 个字符的密码

## ✅ 验证清单

- [ ] `.env.local` 文件已创建
- [ ] 文件内容包含 Supabase 配置
- [ ] 开发服务器已重启
- [ ] 浏览器控制台无错误
- [ ] 可以正常注册新用户

## 🎯 下一步

注册成功后，你可以：
1. 登录账户
2. 在 Studio 中创建项目
3. 使用所有 Studio 功能
