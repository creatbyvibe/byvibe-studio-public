# 快速修复指南

## 当前问题
Next.js 无法读取 node_modules 中的文件，可能是 macOS 安全机制导致的。

## 立即尝试的解决方案

### 步骤 1：在终端中手动停止并重启

```bash
# 进入项目目录
cd /Users/wubinyuan/byvibe-hero

# 停止所有 Node 进程
pkill -9 node

# 清理缓存
rm -rf .next

# 重新启动
npm run dev
```

### 步骤 2：如果还是不行，重新安装依赖

```bash
# 删除 node_modules（保留 package.json）
rm -rf node_modules

# 重新安装
npm install

# 启动
npm run dev
```

### 步骤 3：检查终端输出

启动后，查看终端是否有编译错误。如果有，请告诉我具体的错误信息。

## 替代方案：使用不同的端口

如果 3000 端口有问题：

```bash
# 修改 package.json 中的 dev 脚本为：
# "dev": "next dev -p 3001"

# 或者直接运行：
PORT=3001 npm run dev
```

然后访问 http://localhost:3001

## 如果浏览器仍然无法打开

1. **手动打开浏览器**：在浏览器地址栏输入 `http://localhost:3000`
2. **检查控制台**：按 F12 打开开发者工具，查看是否有错误
3. **检查网络标签**：看看请求是否成功

## 需要帮助？

请提供：
1. 终端中 `npm run dev` 的完整输出
2. 浏览器控制台的错误信息（如果有）
3. Node.js 版本（运行 `node -v`）
