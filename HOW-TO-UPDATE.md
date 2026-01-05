# 📚 byVibe.ai 网站更新指南

## 🎯 快速开始

当你看到想要添加到网站的内容时，按照这个指南操作即可！

---

## 📝 目录

1. [添加新工具](#1-添加新工具)
2. [修改现有工具](#2-修改现有工具)
3. [更新分类](#3-更新分类)
4. [修改样式](#4-修改样式)
5. [添加新功能](#5-添加新功能)
6. [常见问题](#常见问题)

---

## 1. 添加新工具

### 步骤 1: 打开工具数据文件

找到并打开文件：`src/data/tools.js`

### 步骤 2: 找到工具数组

在文件中找到 `export const tools = [` 这一行，这就是所有工具的列表。

### 步骤 3: 复制一个现有工具作为模板

找一个现有的工具，复制整个对象（从 `{` 到 `},`），例如：

```javascript
{
  id: 1,
  name: "Hostinger AI Hub",
  category: "Website & Business Tools",
  description: "AI-powered website creation and content tools...",
  pricing: "Included with all Hostinger plans",
  votes: 158,
  rating: 4.7,
  ratingSource: "Trustpilot",
  tags: ["AI Website Builder", "Content Generation", "Vibe Coding"],
  featured: true,
  imageUrl: "https://vibecoding.app/_next/image?url=%2Fhostinger-logo-square.png&w=3840&q=75",
  link: "https://vibecoding.app/tools/hostinger-ai-hub"
},
```

### 步骤 4: 修改为新工具的信息

**重要字段说明：**

- `id`: 使用下一个数字（如果最后一个是 8，新工具就用 9）
- `name`: 工具名称
- `category`: 必须使用以下之一：
  - `"Website & Business Tools"`
  - `"Vibe / No-Code Builders"`
  - `"Developer IDEs & Agents"`
  - `"AI Assistants & Code Review"`
  - `"Cloud Platforms & Prototyping"`
  - `"Workflow & Productivity"`
- `description`: 工具描述（可以复制自 vibecoding.app）
- `pricing`: 定价信息
- `votes`: 投票数（数字）
- `rating`: 评分（数字，如 4.7，如果没有就写 `null`）
- `ratingSource`: 评分来源（如 "Trustpilot"，如果没有就写 `null`）
- `tags`: 标签数组，例如 `["标签1", "标签2", "标签3"]`
- `featured`: 是否精选（`true` 或 `false`）
- `new`: 是否新工具（`true` 或 `false`）
- `imageUrl`: 图片链接（如果没有图片，写 `null`）
- `link`: 工具详情页链接

### 步骤 5: 添加到列表末尾

将新工具对象添加到 `tools` 数组的末尾（在最后一个 `}` 之前，记得加逗号）

### 示例：添加一个新工具

```javascript
// 在 tools 数组的最后，添加：
{
  id: 9,  // 新的 ID
  name: "Cursor",  // 工具名称
  category: "Developer IDEs & Agents",  // 分类
  description: "AI-powered code editor that understands your codebase.",  // 描述
  pricing: "Free + Pro $20/mo",  // 定价
  votes: 12000,  // 投票数
  rating: 4.8,  // 评分
  ratingSource: "Product Hunt",  // 评分来源
  tags: ["AI IDE", "Code Editor", "AI Assistant"],  // 标签
  featured: false,  // 不是精选
  new: false,  // 不是新工具
  imageUrl: "https://example.com/cursor-logo.png",  // 图片链接
  link: "https://cursor.sh"  // 链接
},
```

### 步骤 6: 保存文件

保存文件后，网站会自动更新（如果开发服务器正在运行）

---

## 2. 修改现有工具

### 修改工具信息

1. 打开 `src/data/tools.js`
2. 找到要修改的工具（可以用 `Ctrl+F` 或 `Cmd+F` 搜索工具名称）
3. 直接修改字段值
4. 保存文件

### 示例：修改工具的投票数

```javascript
// 修改前
votes: 158,

// 修改后
votes: 200,
```

### 示例：添加图片

```javascript
// 修改前
imageUrl: null,

// 修改后
imageUrl: "https://example.com/tool-logo.png",
```

---

## 3. 更新分类

### 修改分类名称和数量

打开 `src/data/tools.js`，找到文件底部的 `export const categories = [` 部分：

```javascript
export const categories = [
  { id: "all", name: "全部工具", count: 62, emoji: "🎯" },
  { id: "website", name: "网站与商业工具", count: 7, emoji: "💼" },
  // ... 其他分类
];
```

### 修改分类信息

- `name`: 分类的中文名称
- `count`: 该分类下的工具数量（需要手动统计）
- `emoji`: 分类图标

### 示例：更新工具数量

```javascript
// 如果添加了 2 个新工具到 "网站与商业工具" 分类
{ id: "website", name: "网站与商业工具", count: 9, emoji: "💼" },  // 从 7 改为 9
{ id: "all", name: "全部工具", count: 64, emoji: "🎯" },  // 从 62 改为 64
```

---

## 4. 修改样式

### 修改工具卡片样式

打开 `src/components/ToolsSection.css`，可以修改：

- **卡片颜色**: 找到 `.tool-card` 修改 `background` 颜色
- **卡片大小**: 修改 `.tools-grid` 中的 `grid-template-columns`
- **字体大小**: 修改各个 `.tool-*` 类的 `font-size`
- **间距**: 修改 `padding` 和 `margin` 值

### 示例：修改卡片背景色

```css
/* 在 ToolsSection.css 中找到 */
.tool-card {
  background: rgba(255, 255, 255, 0.95);  /* 修改这个值 */
  /* ... */
}
```

### 修改整体颜色主题

打开 `src/components/ToolsSection.css`，找到：

```css
.tools-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);  /* 修改这里的颜色 */
}
```

可以改成其他渐变色，例如：
- 蓝色系：`linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)`
- 绿色系：`linear-gradient(135deg, #10b981 0%, #059669 100%)`
- 橙色系：`linear-gradient(135deg, #f59e0b 0%, #d97706 100%)`

---

## 5. 添加新功能

### 添加搜索功能（高级）

如果需要添加搜索功能，需要修改 `src/components/ToolsSection.jsx`：

1. 添加搜索状态：
```javascript
const [searchQuery, setSearchQuery] = useState('');
```

2. 添加搜索输入框（在 JSX 中）：
```jsx
<input
  type="text"
  placeholder="搜索工具..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  className="search-input"
/>
```

3. 修改筛选逻辑：
```javascript
const filteredTools = selectedCategory === 'all' 
  ? tools.filter(tool => 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  : tools.filter(tool => 
      getCategoryId(tool.category) === selectedCategory &&
      (tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       tool.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
```

---

## 📋 从其他网站"抄"内容的步骤

### 完整流程

1. **找到想要的内容**
   - 访问目标网站（如 vibecoding.app）
   - 找到想要复制的工具或内容

2. **收集信息**
   - 工具名称
   - 描述
   - 定价信息
   - 图片链接（右键图片 → 复制图片地址）
   - 标签/分类

3. **添加到你的网站**
   - 按照 [添加新工具](#1-添加新工具) 的步骤操作

4. **获取图片**
   - 方法 1: 右键图片 → 复制图片地址
   - 方法 2: 使用浏览器开发者工具（F12）查看图片 URL
   - 方法 3: 如果图片无法直接使用，可以下载后放到 `public/images/` 目录

### 示例：从 vibecoding.app 复制工具

1. 访问 https://vibecoding.app/tools
2. 找到想要添加的工具，点击进入详情页
3. 复制以下信息：
   - 工具名称
   - 描述
   - 定价
   - 标签
   - 图片（右键复制图片地址）
4. 打开 `src/data/tools.js`
5. 按照模板添加新工具
6. 保存文件

---

## 常见问题

### Q: 添加工具后网站没有更新？

**A:** 
1. 确保开发服务器正在运行（`npm run dev`）
2. 检查浏览器控制台是否有错误（F12）
3. 确保 JSON 格式正确（逗号、引号等）

### Q: 图片显示不出来？

**A:**
1. 检查图片 URL 是否正确
2. 某些网站可能禁止跨域访问，需要下载图片到本地
3. 将图片放到 `public/images/` 目录，使用 `/images/文件名.png`

### Q: 如何修改工具卡片的布局？

**A:**
打开 `src/components/ToolsSection.jsx`，找到工具卡片的 JSX 部分，可以调整元素的顺序或添加新元素。

### Q: 如何添加新的分类？

**A:**
1. 在 `src/data/tools.js` 的 `categories` 数组中添加新分类
2. 在 `ToolsSection.jsx` 的 `getCategoryId` 函数中添加映射关系
3. 确保工具的 `category` 字段使用正确的分类名称

### Q: 代码格式乱了怎么办？

**A:**
- 使用代码格式化工具（VS Code 中按 `Shift+Alt+F`）
- 或者使用 Prettier 自动格式化

---

## 🛠️ 开发工具推荐

### VS Code 插件推荐

1. **Prettier** - 自动格式化代码
2. **ES7+ React/Redux/React-Native snippets** - React 代码片段
3. **Auto Rename Tag** - 自动重命名标签

### 有用的快捷键

- `Ctrl+F` / `Cmd+F`: 搜索
- `Ctrl+S` / `Cmd+S`: 保存
- `Ctrl+/` / `Cmd+/`: 注释/取消注释
- `F12`: 打开浏览器开发者工具

---

## 📞 需要帮助？

如果遇到问题：

1. 检查浏览器控制台的错误信息（F12）
2. 确保所有引号、括号都正确配对
3. 确保 JSON 格式正确
4. 检查文件路径是否正确

---

## 🎉 总结

更新网站内容的三个关键文件：

1. **`src/data/tools.js`** - 工具数据（最重要！）
2. **`src/components/ToolsSection.jsx`** - 工具展示组件
3. **`src/components/ToolsSection.css`** - 样式文件

**最简单的更新流程：**
1. 打开 `src/data/tools.js`
2. 复制一个现有工具
3. 修改为新工具的信息
4. 保存文件
5. 完成！✨
