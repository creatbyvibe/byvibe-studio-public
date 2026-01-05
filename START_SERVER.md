# 启动开发服务器

## 方法 1: 使用 npm
```bash
npm run dev
```

## 方法 2: 使用完整路径
```bash
./node_modules/.bin/next dev
```

## 方法 3: 使用 npx
```bash
npx next dev
```

## 如果遇到 "command not found" 错误

1. 重新安装依赖：
```bash
npm install
```

2. 检查 Node.js 版本（需要 Node.js 18+）：
```bash
node --version
```

3. 清除缓存并重新安装：
```bash
rm -rf node_modules package-lock.json
npm install
```

## 访问地址
服务器启动后，在浏览器打开：
http://localhost:3000
