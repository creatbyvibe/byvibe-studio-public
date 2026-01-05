# 修复权限问题

## 问题
Next.js 无法读取 `node_modules/next` 中的文件，错误：`Operation not permitted (os error 1)`

## 解决方案

### 方案 1：重新安装 node_modules（最可靠）

```bash
cd /Users/wubinyuan/byvibe-hero

# 停止服务器
pkill -9 node

# 完全删除 node_modules
rm -rf node_modules package-lock.json

# 清理 npm 缓存
npm cache clean --force

# 重新安装
npm install

# 启动
npm run dev
```

### 方案 2：修复文件权限

```bash
cd /Users/wubinyuan/byvibe-hero

# 修复整个 node_modules 的权限
chmod -R u+r node_modules

# 或者只修复 next 包
chmod -R u+r node_modules/next
```

### 方案 3：检查 macOS 安全设置

1. 打开"系统设置" > "隐私与安全性"
2. 检查"文件和文件夹"权限
3. 确保你的终端应用（Terminal/iTerm）有完整磁盘访问权限

### 方案 4：使用 sudo（不推荐，但可以尝试）

```bash
cd /Users/wubinyuan/byvibe-hero
sudo chmod -R u+r node_modules/next
```

### 方案 5：检查是否有安全软件阻止

- 检查是否有防病毒软件或安全软件
- 临时禁用并重试

## 如果都不行

可能需要：
1. 检查磁盘空间：`df -h`
2. 检查文件系统：`diskutil verifyVolume /`
3. 重启 Mac
4. 联系 Apple 支持（如果是系统级权限问题）

## 临时解决方案

如果急需测试，可以尝试使用 Docker 或不同的开发环境。
