# 本地预览问题排查指南

## 🔴 常见问题

### 问题 1：连接没反应 / 无法访问

**症状**：
- 浏览器显示 "无法连接" 或 "连接超时"
- 终端显示服务器已启动，但无法访问

**原因**：
- 多个 `next dev` 进程冲突
- 端口被占用
- 构建缓存损坏

**解决方案**：

#### 方法 1：使用修复脚本（推荐）

```bash
./fix-dev-server.sh
```

#### 方法 2：手动修复

```bash
# 1. 停止所有进程
pkill -f "next dev"

# 2. 释放端口
lsof -ti:3000 | xargs kill -9

# 3. 清理缓存
rm -rf .next

# 4. 重新启动
npm run dev
```

### 问题 2：返回 500 错误

**症状**：
- 浏览器显示 500 Internal Server Error
- 服务器响应但返回错误

**原因**：
- 环境变量缺失
- 代码错误
- 依赖问题

**解决方案**：

1. **检查环境变量**
   ```bash
   # 确保 .env.local 文件存在
   cat .env.local
   ```

2. **检查终端错误日志**
   - 查看运行 `npm run dev` 的终端
   - 查找红色错误信息

3. **检查依赖**
   ```bash
   npm install
   ```

### 问题 3：端口被占用

**症状**：
- 错误信息：`Port 3000 is already in use`

**解决方案**：

```bash
# 方法 1：使用其他端口
PORT=3001 npm run dev

# 方法 2：释放端口
lsof -ti:3000 | xargs kill -9
npm run dev
```

### 问题 4：多个进程冲突

**症状**：
- 服务器启动多次
- 响应缓慢或不稳定

**解决方案**：

```bash
# 查看所有 next dev 进程
ps aux | grep "next dev"

# 停止所有进程
pkill -f "next dev"

# 重新启动
npm run dev
```

## 🔧 快速修复命令

### 一键修复脚本

```bash
./fix-dev-server.sh
```

### 手动快速修复

```bash
# 停止并清理
pkill -f "next dev" && lsof -ti:3000 | xargs kill -9 && rm -rf .next

# 重新启动
npm run dev
```

## ✅ 正常启动检查清单

启动后，应该看到：

1. **终端输出**：
   ```
   ▲ Next.js 14.2.35
   - Local:        http://localhost:3000
   ✓ Ready in X seconds
   ```

2. **浏览器访问**：
   - 打开 http://localhost:3000
   - 应该看到网站首页

3. **响应检查**：
   ```bash
   curl http://localhost:3000
   # 应该返回 HTML 内容
   ```

## 🐛 调试技巧

### 1. 检查服务器状态

```bash
# 检查端口是否被占用
lsof -ti:3000

# 检查进程
ps aux | grep "next dev"
```

### 2. 查看服务器日志

在运行 `npm run dev` 的终端中查看：
- 编译错误
- 运行时错误
- 警告信息

### 3. 检查环境变量

```bash
# 查看环境变量文件
cat .env.local

# 检查变量是否正确
echo $NEXT_PUBLIC_SUPABASE_URL
```

### 4. 清理并重新安装

```bash
# 完全清理
rm -rf .next node_modules package-lock.json

# 重新安装
npm install

# 重新启动
npm run dev
```

## 📋 常见错误信息

### Error: Port 3000 is already in use

**解决**：
```bash
lsof -ti:3000 | xargs kill -9
npm run dev
```

### Error: Missing Supabase environment variables

**解决**：
1. 检查 `.env.local` 文件是否存在
2. 确保变量名正确（区分大小写）
3. 重启开发服务器

### Error: Cannot find module

**解决**：
```bash
npm install
```

### Error: EADDRINUSE

**解决**：
```bash
# 使用其他端口
PORT=3001 npm run dev
```

## 🚀 最佳实践

1. **每次启动前检查**
   ```bash
   # 确保没有旧进程
   pkill -f "next dev"
   ```

2. **定期清理缓存**
   ```bash
   rm -rf .next
   ```

3. **使用修复脚本**
   ```bash
   ./fix-dev-server.sh
   ```

4. **检查终端输出**
   - 启动时查看是否有错误
   - 运行时查看日志

## 📞 如果仍然无法解决

1. **提供错误信息**
   - 终端中的完整错误日志
   - 浏览器控制台的错误信息

2. **检查系统要求**
   ```bash
   node --version  # 需要 Node.js 18+
   npm --version
   ```

3. **尝试完全重新安装**
   ```bash
   rm -rf node_modules .next package-lock.json
   npm install
   npm run dev
   ```

---

**最后更新**: 2026-01-05
**快速修复**: 运行 `./fix-dev-server.sh`
