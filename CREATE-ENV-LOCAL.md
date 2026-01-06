# 创建 .env.local 文件

## 🚀 快速创建

在项目根目录创建 `.env.local` 文件，内容如下：

```env
# Supabase 配置（必需 - 用于注册和数据库）
NEXT_PUBLIC_SUPABASE_URL=https://xejrdjqsuloecdeviopx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_rMqAnJxp6DWT9SsowLTNcw_ucR4BqEk

# Gemini API 配置（可选 - 用于 AI 功能）
# GEMINI_API_KEY=your_gemini_api_key_here
```

## 📝 创建步骤

### 方法 1: 使用终端（推荐）

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

### 方法 2: 使用编辑器

1. 在项目根目录创建新文件：`.env.local`
2. 复制上面的内容到文件中
3. 保存文件

## ✅ 验证

创建后，检查文件：

```bash
cat .env.local
```

应该看到 Supabase 配置。

## 🔄 重启服务器

**重要**：创建或修改 `.env.local` 后，必须重启开发服务器：

```bash
# 停止当前服务器（在运行 npm run dev 的终端按 Ctrl+C）
# 然后重新启动
npm run dev
```

## 🎯 现在可以注册了！

重启服务器后：

1. 访问 `http://localhost:3000/studio`
2. 点击注册
3. 输入邮箱和密码
4. 应该可以正常注册了！
