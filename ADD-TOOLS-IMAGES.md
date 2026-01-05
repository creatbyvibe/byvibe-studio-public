# 如何添加工具图片

## 概述
你的网站已经集成了从 vibecoding.app 获取的 AI 工具信息。目前工具卡片使用占位符图片，你可以通过以下方式添加真实图片。

## 方法 1: 从 vibecoding.app 获取图片

1. 访问工具页面，例如：https://vibecoding.app/tools/hostinger-ai-hub
2. 右键点击工具的主图片
3. 选择"复制图片地址"或"复制图片链接"
4. 将图片 URL 添加到 `src/data/tools.js` 文件中对应的工具的 `imageUrl` 字段

## 方法 2: 使用工具官方 Logo

1. 访问每个工具的官方网站
2. 找到他们的 Logo 或宣传图片
3. 下载图片到 `public/images/tools/` 目录
4. 在 `tools.js` 中使用相对路径，例如：`imageUrl: "/images/tools/hostinger.png"`

## 方法 3: 使用占位符服务

可以使用占位符图片服务，例如：
- `https://via.placeholder.com/400x200/667eea/ffffff?text=${tool.name}`
- 或使用其他占位符服务

## 更新工具数据

编辑 `src/data/tools.js` 文件，为每个工具添加 `imageUrl` 字段：

```javascript
{
  id: 1,
  name: "Hostinger AI Hub",
  // ... 其他字段
  imageUrl: "https://example.com/hostinger-logo.png", // 添加这行
  link: "https://vibecoding.app/tools/hostinger-ai-hub"
}
```

## 注意事项

1. **版权问题**：确保你有权使用这些图片，或者使用工具官方的公开 Logo
2. **图片大小**：建议图片尺寸为 400x200px 或类似比例，以保持一致性
3. **加载性能**：考虑使用 CDN 或优化图片大小
4. **备用方案**：如果图片加载失败，会自动显示占位符

## 当前工具列表

网站已包含以下工具的信息：
- Hostinger AI Hub
- LingGuang
- Google AntiGravity
- Windsurf (formerly Codeium)
- Claude Code CLI
- Gemini Code Assist
- v0
- Bolt.new

所有工具信息都来自 vibecoding.app，并已翻译为中文。
