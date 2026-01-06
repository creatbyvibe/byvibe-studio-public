# Studio 预览问题排查指南

## 🔍 快速诊断

### 方法 1: 使用启动脚本（推荐）

```bash
cd /Users/wubinyuan/.cursor/worktrees/byvibe-hero/vwt
./start-dev.sh
```

这个脚本会自动：
- ✅ 检查 Node.js 和 npm
- ✅ 检查依赖是否安装
- ✅ 清理旧进程和端口
- ✅ 清理构建缓存
- ✅ 启动开发服务器

### 方法 2: 手动启动

如果脚本不工作，可以手动执行：

```bash
cd /Users/wubinyuan/.cursor/worktrees/byvibe-hero/vwt

# 1. 停止所有相关进程
pkill -f "next dev"
lsof -ti:3000 | xargs kill -9 2>/dev/null

# 2. 清理缓存
rm -rf .next

# 3. 启动服务器
npm run dev
```

### 方法 3: 使用不同端口

如果 3000 端口被占用，可以使用其他端口：

```bash
PORT=3001 npm run dev
# 然后访问 http://localhost:3001/studio
```

或者：

```bash
npm run dev -- -p 3001
```

## 🔧 常见问题解决

### 问题 1: 端口被占用

**症状**：
- 错误信息：`Port 3000 is already in use`
- 或者服务器启动但无法访问

**解决**：

```bash
# 查看占用端口的进程
lsof -i :3000

# 杀死占用端口的进程
lsof -ti:3000 | xargs kill -9

# 或者使用其他端口
PORT=3001 npm run dev
```

### 问题 2: 依赖未安装

**症状**：
- 错误信息：`Cannot find module 'xxx'`
- 或者 `node_modules` 目录不存在

**解决**：

```bash
# 重新安装依赖
npm install

# 如果遇到问题，清理后重装
rm -rf node_modules package-lock.json
npm install
```

### 问题 3: 构建缓存问题

**症状**：
- 页面显示错误
- 代码修改不生效

**解决**：

```bash
# 清理 Next.js 缓存
rm -rf .next

# 重新启动
npm run dev
```

### 问题 4: 多个进程冲突

**症状**：
- 服务器响应缓慢
- 端口显示被占用但找不到进程

**解决**：

```bash
# 查找所有 next 进程
ps aux | grep next

# 停止所有 next dev 进程
pkill -f "next dev"

# 等待几秒后重新启动
sleep 2
npm run dev
```

### 问题 5: 权限问题

**症状**：
- 无法创建文件或目录
- 权限被拒绝错误

**解决**：

```bash
# 检查文件权限
ls -la

# 如果需要，修复权限
chmod +x start-dev.sh
```

## 📋 启动检查清单

启动前确认：

- [ ] Node.js 已安装（`node --version` 应该显示 v18+）
- [ ] npm 已安装（`npm --version`）
- [ ] 依赖已安装（`node_modules` 目录存在）
- [ ] 端口 3000 可用（或使用其他端口）
- [ ] 没有其他 Next.js 进程在运行

## 🚀 启动后验证

服务器启动成功后，你应该看到：

```
  ▲ Next.js 14.x.x
  - Local:        http://localhost:3000
  - Ready in X.Xs
```

然后：

1. **打开浏览器**访问 `http://localhost:3000`
2. **检查首页**是否正常加载
3. **访问 Studio**：`http://localhost:3000/studio`
4. **检查控制台**是否有错误（F12 打开开发者工具）

## 🎯 访问 Studio 页面

### Studio Dashboard
```
http://localhost:3000/studio
```

### 创建新项目
1. 访问 `/studio`
2. 点击 "Create New Project" 卡片
3. 输入项目名称
4. 自动跳转到工作区

### 直接访问工作区（如果有项目 ID）
```
http://localhost:3000/studio/[your-project-id]
```

## 💡 调试技巧

### 查看服务器日志
启动服务器后，终端会显示：
- 编译错误
- 路由信息
- API 请求日志

### 查看浏览器控制台
按 `F12` 打开开发者工具：
- **Console** 标签：查看 JavaScript 错误
- **Network** 标签：查看 API 请求
- **Elements** 标签：检查 DOM 结构

### 检查环境变量
如果功能不工作，检查 `.env.local`：

```bash
cat .env.local
```

## 🔄 完全重置

如果所有方法都不行，尝试完全重置：

```bash
cd /Users/wubinyuan/.cursor/worktrees/byvibe-hero/vwt

# 1. 停止所有进程
pkill -f "next dev"
pkill -f "node"

# 2. 清理所有缓存和依赖
rm -rf .next
rm -rf node_modules
rm -rf package-lock.json

# 3. 重新安装
npm install

# 4. 启动
npm run dev
```

## 📞 如果还是不行

请提供以下信息：
1. 终端显示的错误信息（完整输出）
2. 浏览器控制台的错误信息
3. 使用的启动命令
4. Node.js 版本（`node --version`）
