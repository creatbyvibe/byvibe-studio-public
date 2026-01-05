# Cursor Hub 爬虫脚本

这个爬虫脚本用于爬取 [Cursor Hub](https://cursorhub.org/) 网站的数据。

## 功能特性

- ✅ 爬取网站主页内容
- ✅ 提取页面标题、描述、章节和链接
- ✅ 自动发现并爬取相关页面
- ✅ 生成 JSON 格式的结构化数据
- ✅ 生成可读的文本报告
- ✅ 支持延迟请求，避免对服务器造成压力

## 安装依赖

### 方法 1: 使用 JavaScript 版本（推荐，无额外依赖）

JavaScript 版本使用 Node.js 原生模块，无需安装额外依赖，可以直接运行：

```bash
npm run crawl
```

### 方法 2: 使用 TypeScript 版本（功能更强大）

TypeScript 版本使用 `cheerio` 进行 HTML 解析，功能更强大：

```bash
npm install
npm run crawl:ts
```

## 使用方法

### 快速开始

```bash
# 使用 JavaScript 版本（推荐）
npm run crawl

# 或使用 TypeScript 版本
npm run crawl:ts

# 或直接运行
node scripts/crawl-cursorhub.js
```

### 输出文件

爬取的数据会保存在 `data/cursorhub/` 目录下：

- `homepage.json` - 主页的完整数据
- `*.json` - 其他爬取的页面数据
- `summary.json` - 所有页面的汇总信息
- `report.txt` - 可读的文本报告

## 数据结构

每个页面的 JSON 数据包含：

```json
{
  "url": "https://cursorhub.org/",
  "title": "页面标题",
  "description": "页面描述",
  "sections": [
    {
      "title": "章节标题",
      "content": "章节内容"
    }
  ],
  "links": [
    {
      "text": "链接文本",
      "url": "链接地址"
    }
  ],
  "timestamp": "2025-01-XX..."
}
```

## 自定义配置

你可以修改 `scripts/crawl-cursorhub.js` 或 `scripts/crawl-cursorhub.ts` 来自定义：

- 爬取的页面数量（默认爬取前 3-5 个相关页面）
- 请求延迟时间（默认 1-2 秒）
- 输出目录位置
- 提取的内容字段

## 注意事项

1. **遵守 robots.txt**：请确保你的爬取行为符合网站的 robots.txt 规则
2. **请求频率**：脚本已内置延迟机制，避免请求过快
3. **数据使用**：爬取的数据仅供学习研究使用，请勿用于商业用途
4. **网站变化**：如果网站结构发生变化，可能需要更新解析逻辑

## 故障排除

### 网络错误
- 检查网络连接
- 确认目标网站可访问
- 尝试增加请求延迟时间

### 解析错误
- TypeScript 版本使用 `cheerio` 解析更准确
- 如果解析失败，检查网站 HTML 结构是否变化

### 权限错误
- 确保有写入 `data/cursorhub/` 目录的权限
- 如果目录不存在，脚本会自动创建

## 扩展功能

你可以根据需要扩展脚本功能：

- 添加数据库存储（MongoDB、PostgreSQL 等）
- 实现增量爬取（只爬取更新的内容）
- 添加并发控制
- 实现断点续传
- 添加邮件/通知功能

## 许可证

此脚本仅供学习和研究使用。
