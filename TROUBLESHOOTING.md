# 故障排查指南

## 当前问题：权限错误

如果遇到以下错误：
```
Operation not permitted (os error 1)
Failed to read source code from node_modules/next/...
```

## 解决方案

### 方案 1：重新安装依赖（推荐）

```bash
# 1. 停止开发服务器（Ctrl+C）

# 2. 删除 node_modules 和锁定文件
rm -rf node_modules package-lock.json

# 3. 清理 Next.js 缓存
rm -rf .next

# 4. 重新安装依赖
npm install

# 5. 重新启动开发服务器
npm run dev
```

### 方案 2：修复文件权限

```bash
# 修复 node_modules 权限
sudo chmod -R u+r node_modules

# 或者使用 npm 重新安装
npm rebuild
```

### 方案 3：使用不同的端口

如果 3000 端口有问题，可以尝试：

```bash
# 在 package.json 中修改 dev 脚本
# "dev": "next dev -p 3001"

# 或者直接运行
npm run dev -- -p 3001
```

### 方案 4：检查 macOS 安全设置

1. 打开"系统设置" > "隐私与安全性"
2. 检查"文件和文件夹"权限
3. 确保终端/IDE 有访问权限

## 如果问题仍然存在

1. **检查磁盘空间**：
   ```bash
   df -h
   ```

2. **检查 Node.js 版本**：
   ```bash
   node -v  # 应该 >= 18.0.0
   npm -v
   ```

3. **尝试使用 yarn 替代 npm**：
   ```bash
   npm install -g yarn
   yarn install
   yarn dev
   ```

4. **完全清理并重新开始**：
   ```bash
   rm -rf node_modules .next package-lock.json
   npm cache clean --force
   npm install
   npm run dev
   ```

## 联系支持

如果以上方法都不行，请提供：
- Node.js 版本
- npm 版本
- macOS 版本
- 完整的错误日志
