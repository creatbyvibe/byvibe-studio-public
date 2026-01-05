# ByVibe Studio 核心功能 PRD (v1.0)

## 📋 项目概述

ByVibe Studio 是 ByVibe.ai 的核心应用，帮助用户通过 "Vibe Coding" 方式从自然语言描述生成完整的项目架构和可部署代码。

## 🎯 核心价值

- **从 Vibe 到架构**：将用户的自然语言描述转换为结构化的项目架构
- **分阶段引导**：通过 Scope -> Stack -> Design -> Build 四个阶段逐步细化
- **实时协作**：AI 助手（Gemini）全程参与，提供建议和优化
- **可部署输出**：最终生成可直接部署的项目代码

## 🗄️ 数据模型

### Projects 表
```sql
projects:
  - id: uuid (primary key)
  - user_id: uuid (foreign key to auth.users)
  - name: text
  - description: text (nullable)
  - status: text (draft, in_progress, completed)
  - created_at: timestamp
  - updated_at: timestamp
```

### Artifacts 表
```sql
artifacts:
  - id: uuid (primary key)
  - project_id: uuid (foreign key to projects)
  - phase: text (scope, stack, design, build)
  - content: jsonb (存储该阶段的输出内容)
  - is_locked: boolean (是否锁定，锁定后不可编辑)
  - created_at: timestamp
  - updated_at: timestamp
```

## 🎨 UI/UX 规范

### Dashboard 页面 (`/studio`)
- **布局**：网格布局，显示用户的所有项目
- **新项目卡片**：醒目的 "+" 卡片，点击创建新项目
- **项目卡片**：显示项目名称、状态、最后更新时间
- **主题**：延续 Hero 页的深色主题（bg-[#050505]）

### 工作区页面 (`/studio/[id]`)
- **布局**：2 列布局
  - **左侧边栏**（固定 400px）：
    - PhaseNavigation：顶部显示当前阶段（Scope -> Stack -> Design -> Build）
    - ChatConsole：与 Gemini 的对话界面
  - **右侧画布**（自适应）：
    - 根据当前阶段显示不同内容
    - Scope：项目范围描述
    - Stack：技术栈选择
    - Design：架构图（Mermaid）
    - Build：代码文件树和预览

## 🔐 认证流程

1. 用户点击 Hero 页的 "Start Building" 按钮
2. 检查是否已登录
   - 未登录：显示登录/注册模态框（复用现有的 AuthModal）
   - 已登录：直接跳转到 `/studio`
3. 登录后，重定向到 Dashboard

## 🚀 开发阶段

### Phase 1: 基础架构（当前阶段）
- [x] 数据库 Schema
- [x] Supabase Auth 集成
- [x] Dashboard 页面
- [x] 工作区骨架

### Phase 2: 核心功能
- [ ] Phase Navigation 实现
- [ ] ChatConsole 与 Gemini 集成
- [ ] Scope 阶段：自然语言输入和解析
- [ ] Stack 阶段：技术栈选择界面

### Phase 3: 高级功能
- [ ] Design 阶段：架构图生成（Mermaid）
- [ ] Build 阶段：代码生成和预览
- [ ] 项目导出功能

## 📝 技术栈

- **前端**：Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **后端**：Supabase (Database + Auth + Edge Functions)
- **AI**：Google Gemini API
- **图表**：Mermaid.js
- **状态管理**：React Hooks + Context (或 Zustand)

## 🔒 安全考虑

- Row Level Security (RLS) 确保用户只能访问自己的项目
- API 路由验证用户身份
- 敏感操作需要二次确认
