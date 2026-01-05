# ⚡ 快速更新指南（5分钟上手）

## 🎯 最简单的更新方法

### 场景 1: 添加一个新工具

**步骤：**

1. 打开文件：`src/data/tools.js`

2. 找到最后一个工具（在 `]` 之前），复制整个工具对象

3. 粘贴到列表末尾，修改为新工具的信息：

```javascript
{
  id: 9,  // 改成下一个数字
  name: "新工具名称",
  category: "Developer IDEs & Agents",  // 选择一个分类
  description: "工具描述",
  pricing: "定价信息",
  votes: 100,
  rating: 4.5,  // 没有就写 null
  ratingSource: null,  // 没有就写 null
  tags: ["标签1", "标签2"],
  featured: false,
  new: false,
  imageUrl: "图片链接",  // 没有就写 null
  link: "工具链接"
},
```

4. 保存文件（`Ctrl+S` 或 `Cmd+S`）

5. 刷新浏览器，新工具就出现了！✅

---

### 场景 2: 修改现有工具的信息

**步骤：**

1. 打开文件：`src/data/tools.js`

2. 按 `Ctrl+F`（Windows）或 `Cmd+F`（Mac）搜索工具名称

3. 找到工具后，直接修改字段值

4. 保存文件

5. 刷新浏览器查看效果

---

### 场景 3: 修改工具数量

**步骤：**

1. 打开文件：`src/data/tools.js`

2. 滚动到文件底部，找到 `categories` 部分

3. 修改 `count` 数字：

```javascript
{ id: "all", name: "全部工具", count: 63, emoji: "🎯" },  // 改成实际数量
```

4. 保存文件

---

## 📝 常用字段速查

| 字段 | 说明 | 示例 |
|------|------|------|
| `id` | 唯一编号 | `9` |
| `name` | 工具名称 | `"Cursor"` |
| `category` | 分类（必须用英文） | `"Developer IDEs & Agents"` |
| `description` | 描述 | `"AI-powered code editor"` |
| `pricing` | 定价 | `"Free + Pro $20/mo"` |
| `votes` | 投票数 | `12000` |
| `rating` | 评分 | `4.8` 或 `null` |
| `tags` | 标签数组 | `["AI", "Editor"]` |
| `featured` | 是否精选 | `true` 或 `false` |
| `new` | 是否新工具 | `true` 或 `false` |
| `imageUrl` | 图片链接 | `"https://..."` 或 `null` |
| `link` | 工具链接 | `"https://cursor.sh"` |

---

## 🎨 可用的分类（必须完全一致）

- `"Website & Business Tools"`
- `"Vibe / No-Code Builders"`
- `"Developer IDEs & Agents"`
- `"AI Assistants & Code Review"`
- `"Cloud Platforms & Prototyping"`
- `"Workflow & Productivity"`

---

## ⚠️ 常见错误

### 错误 1: 忘记加逗号
```javascript
// ❌ 错误
{
  id: 8,
  name: "Tool"
}  // 缺少逗号

// ✅ 正确
{
  id: 8,
  name: "Tool"
},  // 有逗号
```

### 错误 2: 引号不匹配
```javascript
// ❌ 错误
name: "Tool,  // 缺少结束引号

// ✅ 正确
name: "Tool",
```

### 错误 3: 分类名称拼写错误
```javascript
// ❌ 错误
category: "Developer IDE",  // 拼写错误

// ✅ 正确
category: "Developer IDEs & Agents",  // 完全一致
```

---

## 🚀 快速测试

添加工具后，检查：

1. ✅ 文件保存成功
2. ✅ 浏览器自动刷新（或手动刷新）
3. ✅ 新工具出现在列表中
4. ✅ 没有错误信息（按 F12 查看控制台）

---

## 💡 小技巧

1. **复制模板**: 总是复制一个现有的工具，然后修改，不容易出错
2. **使用搜索**: `Ctrl+F` 快速找到要修改的工具
3. **检查格式**: 确保所有括号、引号都配对
4. **保存频繁**: 每修改一点就保存，方便回退

---

## 📚 需要更多帮助？

查看详细指南：`HOW-TO-UPDATE.md`
