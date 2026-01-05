# ByVibe Hero 页面设置指南

## 环境变量配置

1. 在项目根目录创建 `.env.local` 文件：

```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

2. 获取 Gemini API Key：
   - 访问 https://makersuite.google.com/app/apikey
   - 创建新的 API Key
   - 将 API Key 复制到 `.env.local` 文件中

## 安装依赖

```bash
npm install
```

## 运行开发服务器

```bash
npm run dev
```

访问 http://localhost:3000 查看页面

## 构建生产版本

```bash
npm run build
npm start
```

## 功能说明

### 主要功能

1. **Hero 区域**：包含品牌介绍和视频轮播
2. **交互式控制台**：使用 Gemini API 进行 Vibe 优化和项目规划
3. **功能展示**：展示 ByVibe 的核心功能
4. **生态系统 Logo**：展示集成的 AI 工具
5. **合规性部分**：展示 AI 治理和法规信息
6. **工具目录**：浏览和搜索 AI 集成工具库

### API 路由

- `/api/polish` - 优化用户输入的 Vibe
- `/api/orchestrate` - 生成项目规划

## 注意事项

- 确保设置了 `GEMINI_API_KEY` 环境变量，否则 API 功能将无法使用
- 所有 API 调用都在服务器端进行，确保 API Key 安全
