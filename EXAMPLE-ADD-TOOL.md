# 📖 实际示例：添加一个新工具

## 场景：你想添加 "Cursor" 这个工具

### 步骤 1: 收集信息

从 vibecoding.app 或其他网站收集信息：

- **名称**: Cursor
- **分类**: Developer IDEs & Agents
- **描述**: AI-powered code editor that understands your codebase
- **定价**: Free + Pro $20/mo
- **投票**: 15000
- **评分**: 4.9
- **标签**: AI IDE, Code Editor, AI Assistant
- **图片**: https://cursor.sh/logo.png
- **链接**: https://cursor.sh

---

### 步骤 2: 打开文件

打开 `src/data/tools.js`

---

### 步骤 3: 找到插入位置

滚动到文件末尾，找到最后一个工具（Bolt.new），在它的 `},` 后面添加新工具。

**修改前：**
```javascript
  {
    id: 8,
    name: "Bolt.new",
    // ... 其他字段
    link: "https://vibecoding.app/tools/bolt-new"
  }
];  // ← 在这里之前添加
```

---

### 步骤 4: 添加新工具

**修改后：**
```javascript
  {
    id: 8,
    name: "Bolt.new",
    // ... 其他字段
    link: "https://vibecoding.app/tools/bolt-new"
  },
  {  // ← 添加这个新工具
    id: 9,
    name: "Cursor",
    category: "Developer IDEs & Agents",
    description: "AI-powered code editor that understands your codebase",
    pricing: "Free + Pro $20/mo",
    votes: 15000,
    rating: 4.9,
    ratingSource: null,
    tags: ["AI IDE", "Code Editor", "AI Assistant"],
    featured: false,
    new: false,
    imageUrl: "https://cursor.sh/logo.png",
    link: "https://cursor.sh"
  }
];
```

**注意：**
- 在 `Bolt.new` 的 `}` 后面加了逗号 `,`
- 新工具的 `id` 是 `9`（比最后一个大 1）
- 所有字段都填好了

---

### 步骤 5: 更新分类数量

滚动到文件底部，找到 `categories` 部分：

**修改前：**
```javascript
export const categories = [
  { id: "all", name: "全部工具", count: 62, emoji: "🎯" },
  { id: "ide", name: "开发者 IDE & 代理", count: 13, emoji: "🚀" },
  // ...
];
```

**修改后：**
```javascript
export const categories = [
  { id: "all", name: "全部工具", count: 63, emoji: "🎯" },  // 62 → 63
  { id: "ide", name: "开发者 IDE & 代理", count: 14, emoji: "🚀" },  // 13 → 14
  // ...
];
```

---

### 步骤 6: 保存文件

按 `Ctrl+S`（Windows）或 `Cmd+S`（Mac）保存

---

### 步骤 7: 查看效果

1. 刷新浏览器（`F5` 或 `Ctrl+R`）
2. 滚动到工具部分
3. 应该能看到新的 "Cursor" 工具卡片了！✅

---

## 🎯 完整代码对比

### 修改前（tools.js 末尾）

```javascript
  {
    id: 8,
    name: "Bolt.new",
    category: "Cloud Platforms & Prototyping",
    description: "Part of StackBlitz ecosystem...",
    pricing: "Free tier available, Team & Enterprise plans",
    votes: 4000,
    rating: null,
    ratingSource: null,
    tags: ["Full-Stack", "Supabase Integration", "StackBlitz"],
    imageUrl: "https://vibecoding.app/_next/image?url=%2Flogos%2Fbolt-new.ico&w=3840&q=75",
    link: "https://vibecoding.app/tools/bolt-new"
  }
];

export const categories = [
  { id: "all", name: "全部工具", count: 62, emoji: "🎯" },
  // ...
];
```

### 修改后

```javascript
  {
    id: 8,
    name: "Bolt.new",
    category: "Cloud Platforms & Prototyping",
    description: "Part of StackBlitz ecosystem...",
    pricing: "Free tier available, Team & Enterprise plans",
    votes: 4000,
    rating: null,
    ratingSource: null,
    tags: ["Full-Stack", "Supabase Integration", "StackBlitz"],
    imageUrl: "https://vibecoding.app/_next/image?url=%2Flogos%2Fbolt-new.ico&w=3840&q=75",
    link: "https://vibecoding.app/tools/bolt-new"
  },
  {  // ← 新添加的工具
    id: 9,
    name: "Cursor",
    category: "Developer IDEs & Agents",
    description: "AI-powered code editor that understands your codebase",
    pricing: "Free + Pro $20/mo",
    votes: 15000,
    rating: 4.9,
    ratingSource: null,
    tags: ["AI IDE", "Code Editor", "AI Assistant"],
    featured: false,
    new: false,
    imageUrl: "https://cursor.sh/logo.png",
    link: "https://cursor.sh"
  }
];

export const categories = [
  { id: "all", name: "全部工具", count: 63, emoji: "🎯" },  // ← 更新了数量
  { id: "ide", name: "开发者 IDE & 代理", count: 14, emoji: "🚀" },  // ← 更新了数量
  // ...
];
```

---

## ✅ 检查清单

添加工具后，检查这些：

- [ ] 新工具的 `id` 是唯一的（不重复）
- [ ] 所有字段都有值（或 `null`）
- [ ] 在最后一个工具后面加了逗号 `,`
- [ ] 新工具的 `}` 后面没有多余的逗号
- [ ] 分类名称拼写正确
- [ ] 更新了分类的 `count` 数量
- [ ] 文件已保存
- [ ] 浏览器已刷新

---

## 🐛 如果出错了

### 错误：网站显示空白

**原因**: JSON 格式错误

**解决**:
1. 检查所有括号 `{}` 是否配对
2. 检查所有引号 `""` 是否配对
3. 检查逗号是否正确（最后一个工具后面不要有逗号）

### 错误：新工具不显示

**原因**: 可能分类不匹配

**解决**:
1. 检查 `category` 字段是否完全匹配（大小写、空格都要一致）
2. 检查浏览器控制台（F12）是否有错误

### 错误：图片不显示

**原因**: 图片链接无效或跨域问题

**解决**:
1. 检查图片链接是否能正常访问
2. 如果不行，下载图片到 `public/images/` 目录
3. 使用相对路径：`imageUrl: "/images/cursor.png"`

---

## 💡 提示

1. **总是复制现有工具作为模板** - 不容易出错
2. **先测试一个简单的工具** - 熟悉流程后再添加复杂的
3. **保存前检查格式** - 确保没有语法错误
4. **使用代码格式化** - VS Code 中按 `Shift+Alt+F` 自动格式化

---

现在你已经知道如何添加工具了！🎉
