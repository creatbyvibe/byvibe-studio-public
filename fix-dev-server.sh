#!/bin/bash

# 本地开发服务器修复脚本
# 用于解决端口占用、进程冲突等问题

echo "🔧 开始修复开发服务器..."

# 1. 停止所有 next dev 进程
echo "📌 停止所有 next dev 进程..."
pkill -f "next dev" 2>/dev/null
sleep 2

# 2. 释放端口 3000
echo "📌 释放端口 3000..."
lsof -ti:3000 | xargs kill -9 2>/dev/null
sleep 1

# 3. 清理构建缓存
echo "📌 清理构建缓存..."
rm -rf .next
echo "✅ 缓存已清理"

# 4. 检查环境变量
if [ ! -f .env.local ]; then
    echo "⚠️  警告: .env.local 文件不存在"
    echo "   请确保已配置环境变量"
fi

# 5. 启动开发服务器
echo ""
echo "🚀 启动开发服务器..."
echo "   访问地址: http://localhost:3000"
echo "   按 Ctrl+C 停止服务器"
echo ""

npm run dev
