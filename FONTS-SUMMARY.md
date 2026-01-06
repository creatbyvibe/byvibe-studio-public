# 项目字体配置总结

## 📝 当前使用的字体

### 1. **Inter** - 正文字体（Sans-serif）
- **用途**: 默认正文、UI 元素、按钮文本
- **来源**: Google Fonts (Next.js 自动优化)
- **CSS 变量**: `--font-inter`
- **Tailwind 类**: `font-sans`
- **使用位置**:
  - 默认 body 字体
  - 所有正文内容
  - 表单输入框
  - 按钮文本
  - 导航栏

### 2. **Space Grotesk** - 标题字体（Display）
- **用途**: 标题、品牌 slogan、重要文本
- **来源**: Google Fonts (Next.js 自动优化)
- **CSS 变量**: `--font-space-grotesk`
- **Tailwind 类**: `font-display`
- **使用位置**:
  - 所有 `<h1>`, `<h2>`, `<h3>` 标题
  - Hero Section 主标题 "The Engineering Brain."
  - Section 标题（如 "Beyond Code. Engineered Realities."）
  - Features Grid 标题
  - 其他重要显示文本

### 3. **JetBrains Mono** - 等宽字体（Monospace）
- **用途**: 代码、CLI、技术文本、标签
- **来源**: Google Fonts (Next.js 自动优化)
- **CSS 变量**: `--font-mono`
- **Tailwind 类**: `font-mono`
- **使用位置**:
  - 代码块
  - CLI 控制台
  - 技术标签（如 "FROM VIBE TO ARCHITECTURE"）
  - 状态指示器
  - 版权信息
  - 所有需要等宽对齐的文本

### 4. **Arial** - SVG Fallback
- **用途**: Logo fallback SVG 中的文本
- **来源**: 系统字体
- **使用位置**: 
  - `public/logos/*.svg` 中的 fallback 文本

### 5. **系统字体栈** - 邮件模板
- **用途**: 邮件 HTML 模板
- **字体栈**: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`
- **使用位置**: 
  - `lib/email/templates.ts` 中的邮件模板

## 🎨 字体使用规范

### 字体层级
1. **Display (Space Grotesk)**: 用于所有标题和重要显示文本
2. **Sans (Inter)**: 用于所有正文和 UI 元素
3. **Mono (JetBrains Mono)**: 用于代码和技术文本

### 字体大小
- **品牌 Slogan**: 14px (mobile) / 16px (desktop)
- **产品 Slogan**: 40px (mobile) / 72px (desktop)
- **H1**: 32px (mobile) / 40px (desktop)
- **H2**: 24px (mobile) / 32px (desktop)
- **正文**: 14px (mobile) / 16px (desktop)

### 字体权重
- **Light**: 300
- **Normal**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700 (标题常用)
- **Extrabold**: 800

## 📍 配置文件位置

1. **字体导入**: `app/layout.tsx` (第 2-21 行)
2. **字体配置**: `tailwind.config.js` (第 11-15 行)
3. **设计令牌**: `lib/design-tokens.ts` (第 13-97 行)

## 🔄 字体加载优化

所有字体都使用 Next.js 的 `next/font/google` 进行优化：
- ✅ 自动字体优化
- ✅ 字体子集化（仅加载 latin 字符集）
- ✅ `display: swap` 防止布局偏移
- ✅ CSS 变量注入

---

**最后更新**: 2026-01-05
