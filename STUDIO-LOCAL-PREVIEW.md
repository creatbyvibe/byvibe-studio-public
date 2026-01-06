# Studio 功能本地预览指南

## 🚀 快速启动

### 1. 确保依赖已安装

```bash
cd /Users/wubinyuan/.cursor/worktrees/byvibe-hero/vwt
npm install
```

### 2. 配置环境变量（如果需要）

创建 `.env.local` 文件（如果还没有）：

```bash
# Supabase 配置（Studio 功能需要）
NEXT_PUBLIC_SUPABASE_URL=https://xejrdjqsuloecdeviopx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_rMqAnJxp6DWT9SsowLTNcw_ucR4BqEk

# Gemini API 配置（AI 功能需要）
GEMINI_API_KEY=your_gemini_api_key_here
```

**注意**：如果只是预览 UI，可以暂时不配置这些变量，但某些功能（如 AI 生成、数据保存）将无法使用。

### 3. 启动开发服务器

```bash
npm run dev
```

服务器将在 `http://localhost:3000` 启动。

### 4. 访问 Studio 页面

#### Studio Dashboard（项目列表）
```
http://localhost:3000/studio
```

#### Studio Workspace（工作区）
需要先创建一个项目，然后访问：
```
http://localhost:3000/studio/[project-id]
```

**快速测试**：如果还没有项目，可以：
1. 访问 `/studio` 页面
2. 点击 "Create New Project" 卡片
3. 输入项目名称创建新项目
4. 自动跳转到工作区页面

## 📋 Studio 功能预览清单

### ✅ 可以预览的 UI 功能

1. **Studio Dashboard** (`/studio`)
   - 项目列表展示
   - 创建新项目
   - 项目卡片（状态、时间显示）
   - 删除项目

2. **Phase Navigation** (`/studio/[id]`)
   - 进度条显示
   - 阶段切换按钮
   - 完成度指示
   - 依赖验证提示

3. **Scope Phase**
   - AI 辅助解析输入框
   - 项目描述表单
   - 核心功能列表
   - 目标用户输入
   - 用例列表
   - 成功标准
   - 验证提示

4. **Stack Phase**
   - AI 推荐按钮
   - 技术栈选择（Frontend, Backend, Database, Deployment, Additional）
   - 验证结果展示
   - 冲突检测提示

5. **Design Phase**
   - 多视图切换（System, Data Flow, Deployment, Code）
   - 生成架构图按钮
   - Mermaid 图表渲染
   - 架构验证

6. **Build Phase**
   - 代码生成按钮
   - 文件树展示
   - 代码预览和编辑
   - 项目导出

7. **Chat Console**
   - AI 对话界面
   - 上下文记忆
   - 快捷操作

## 🎨 UI 打磨建议

在预览时，可以关注以下方面：

1. **视觉层次**
   - 颜色对比度
   - 字体大小和间距
   - 按钮和输入框的样式

2. **交互体验**
   - 按钮点击反馈
   - 加载状态显示
   - 错误提示清晰度
   - 表单验证提示

3. **响应式设计**
   - 移动端布局
   - 平板端适配
   - 桌面端优化

4. **动画效果**
   - 页面过渡
   - 状态变化动画
   - 加载动画

## 🔧 常见问题

### 问题 1：无法访问 `/studio` 页面

**原因**：可能需要登录

**解决**：
- 页面会自动弹出登录模态框
- 可以使用 Google/GitHub/ORCID 登录
- 或者使用邮箱注册

### 问题 2：AI 功能不工作

**原因**：缺少 `GEMINI_API_KEY`

**解决**：
- 在 `.env.local` 中添加 `GEMINI_API_KEY`
- 重启开发服务器

### 问题 3：数据无法保存

**原因**：缺少 Supabase 配置

**解决**：
- 确保 `.env.local` 中有 Supabase 配置
- 检查 Supabase 项目是否正常运行

### 问题 4：端口被占用

**解决**：
```bash
# 使用其他端口
PORT=3001 npm run dev
```

## 📝 开发提示

1. **热重载**：修改代码后会自动刷新页面
2. **控制台调试**：打开浏览器开发者工具查看日志
3. **React DevTools**：安装 React DevTools 扩展便于调试
4. **网络请求**：在 Network 标签查看 API 调用

## 🎯 下一步

预览完成后，可以：
1. 记录需要改进的 UI 问题
2. 调整颜色、间距、字体等样式
3. 优化交互体验
4. 添加动画效果
5. 完善响应式设计
